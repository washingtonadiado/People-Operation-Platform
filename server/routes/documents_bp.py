from flask import Blueprint, make_response, jsonify,request
from flask_restful import Api, Resource, abort, reqparse
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity,jwt_required,current_user
from serializer import documentSchema
from models import db, Documents
from auth_middleware import employee_required
from flask_cors import cross_origin
from cloudinary.uploader import upload

# create document blueprint
document_bp = Blueprint('document_bp', __name__)
# register blueprints with marshmallow and api
ma = Marshmallow(document_bp)
api = Api(document_bp)


post_args = reqparse.RequestParser()
post_args.add_argument('link_url', type=str, required=True,
                       help="Document upload required")
post_args.add_argument('name', type=str, required=True,
                       help="Name of document is required")
post_args.add_argument('type', type=str, required=True,
                       help="Type of document is required")

patch_args = reqparse.RequestParser()
patch_args.add_argument('link_url', type=str)
patch_args.add_argument('name', type=str)
patch_args.add_argument('type', type=str)


class AllDocuments(Resource):
    def get(self):
        documents = Documents.query.all()
        result = documentSchema.dump(documents, many=True)
        response = make_response(jsonify(result), 200)
        return response

    @employee_required()
    def post(self):
        current_user = get_jwt_identity()
        data = post_args.parse_args()

        new_document = Documents(
            link_url=data["link_url"],
            name=data['name'],
            type=data['type'],
            employee_id=current_user
        )

        db.session.add(new_document)
        db.session.commit()

        result = documentSchema.dump(new_document)
        response = make_response(jsonify(result), 201)

        return response


api.add_resource(AllDocuments, '/documents')


class DocumentById(Resource):
    def get(self, id):
        document = Documents.query.filter_by(id=id).first()

        if not document:
            abort(404, detail=f'user with  id {id} does not exist')

        else:
            result = documentSchema.dump(document)
            response = make_response(jsonify(result), 200)
            return response

    @employee_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        document = Documents.query.filter_by(id=id).first()

        if not document:
            abort(404, detail=f'document with id {id} does not exist')

        if document.employee_id != current_user:
            abort(400, detail="Unauthorized request")

        data = patch_args.parse_args()
        for key, value in data.items():
            if value is None:
                continue
            setattr(document, key, value)

        db.session.commit()
        result = documentSchema.dump(document)
        response = make_response(jsonify(result), 200)

        return response

    @employee_required()
    def delete(self,id):
        current_user = get_jwt_identity()
        document = Documents.query.filter_by(id=id).first()

        if not document:
            abort(404, detail=f'document with id {id} does not exist')

        if document.employee_id != current_user:
            abort(400, detail="Unauthorized request")

        db.session.delete(document)
        db.session.commit()

        return {}, 200


api.add_resource(DocumentById, '/documents/<string:id>')


class DocumentUpload(Resource):
    @cross_origin()
    @employee_required()
    def post(self,id):
        current_user = get_jwt_identity()
        if 'document' not in request.files:
            return make_response(jsonify({"error": "No document part"}), 400)
        document = request.files['document']
        if document.filename == '':
            return make_response(jsonify({"error": "No selected document"}), 400)

        try:
           
            cloudinary_upload_result = upload(document)

            
            document_url = cloudinary_upload_result.get("url")
            print(document_url)

            data = request.form

            new_document = Documents(
                link_url=document_url,
                name=data["name"],
                type=data["type"],
                employee_id=current_user
            )

            db.session.add(new_document)
            db.session.commit()

            result = documentSchema.dump(new_document)
            return make_response(jsonify(result), 201)

        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)
        
      
     
        
api.add_resource(DocumentUpload, "/upload/<string:id>")


class EmployeeDocument(Resource):
      def get(self, employee_id):  
        documents = Documents.query.filter_by(employee_id=employee_id).all()

        if not documents:
            abort(404, detail=f'No documents found for employee with ID {employee_id}')

        result = documentSchema.dump(documents, many=True)
        response = make_response(jsonify(result), 200)
        return response
api.add_resource(EmployeeDocument, '/documents/employee/<string:employee_id>')


class DocumentUpdate(Resource):
    @cross_origin()
    @jwt_required()
    def patch(self, id):
        document = Documents.query.get(id)
        if not document:
            return make_response(jsonify({"error": "Document not found"}), 404)
        
        if 'document' not in request.files:
            return make_response(jsonify({"error": "No document part"}), 400)
        new_document = request.files['document']
        if new_document.filename == '':
            return make_response(jsonify({"error": "No selected document"}), 400)

        try:
            cloudinary_upload_result = upload(new_document)

            document.link_url = cloudinary_upload_result.get("url")
            document.name = request.form.get("name")
            document.type = request.form.get("type")

            db.session.commit()

            result = documentSchema.dump(document)
            return make_response(jsonify(result), 200)

        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)

api.add_resource(DocumentUpdate, "/update_document/upload/<string:id>")