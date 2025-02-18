from datetime import datetime
from flask import Blueprint, make_response, jsonify
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from flask_restful import Api, Resource, abort, reqparse
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity
from serializer import experienceSchema

from models import db, Experience
from auth_middleware import employee_required

experience_bp = Blueprint('experience_bp', __name__)
ma = Marshmallow(experience_bp)
api = Api(experience_bp)


post_args = reqparse.RequestParser()
post_args.add_argument('name', type=str, required=True,
                       help='Name is required')
post_args.add_argument('job_title', type=str,
                       required=True, help='Job Title is required')
post_args.add_argument('description', type=str,
                       required=True, help='Description is required')
post_args.add_argument('start_date', type=str,
                       required=True, help='Start Date is required')
post_args.add_argument('end_date', type=str, required=True,
                       help='End Date is required')


patch_args = reqparse.RequestParser()
patch_args.add_argument('name', type=str)
patch_args.add_argument('job_title', type=str)
patch_args.add_argument('description', type=str)
patch_args.add_argument('start_date', type=str)
patch_args.add_argument('end_date', type=str)


class Experiences(Resource):
    def get(self):
        experiences = Experience.query.all()
        result = experienceSchema.dump(experiences, many=True)
        response = make_response(jsonify(result), 200)

        return response

    @employee_required()
    def post(self):
        current_user = get_jwt_identity()
        data = post_args.parse_args()

        employee_id = current_user
        name = data["name"]
        job_title = data["job_title"]
        description = data["description"]
        start_date = datetime.strptime(
            data["start_date"], "%Y-%m-%dT%H:%M:%S.%f")
        end_date = datetime.strptime(data["end_date"], "%Y-%m-%dT%H:%M:%S.%f")

        new_experience = Experience(employee_id=employee_id, name=name, job_title=job_title,
                                    description=description, start_date=start_date, end_date=end_date)
        db.session.add(new_experience)
        db.session.commit()

        result = experienceSchema.dump(new_experience)
        response = make_response(jsonify(result), 201)

        return response


api.add_resource(Experiences, '/experiences')


class ExperienceById(Resource):
    def get(self, id):
        single_experience = Experience.query.filter_by(id=id).first()

        if not single_experience:
            abort(
                404, detail=f'Single Experience with  id {id} does not exist')

        else:
            result = experienceSchema.dump(single_experience)
            response = make_response(jsonify(result), 200)
            return response

    @employee_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        single_experience = Experience.query.filter_by(id=id).first()

        if not single_experience:
            abort(404, detail=f'Experience with id {id} does not exist')

        if single_experience.employee_id != current_user:
            abort(401, detail="Unauthorized request")

        data = patch_args.parse_args()

        if 'start_date' in data:
            data['start_date'] = datetime.strptime(
                data['start_date'], "%Y-%m-%dT%H:%M:%S.%f")
        if 'end_date' in data:
            data['end_date'] = datetime.strptime(
                data['end_date'], "%Y-%m-%dT%H:%M:%S.%f")

        for key, value in data.items():
            if value is None:
                continue
            setattr(single_experience, key, value)
        db.session.commit()
        result = experienceSchema.dump(single_experience)
        response = make_response(jsonify(result), 200)

        return response

    @employee_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        single_experience = Experience.query.filter_by(id=id).first()
        if not single_experience:
            response_body = {"error": "Single Experience not found"}
            return make_response(response_body, 404)

        if single_experience.employee_id != current_user:
            abort(401, detail="Unauthorized request")

        db.session.delete(single_experience)
        db.session.commit()
        response_body = {"message": "Experience successfully deleted"}
        return make_response(response_body, 200)


api.add_resource(ExperienceById, '/experiences/<string:id>')
