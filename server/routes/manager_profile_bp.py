from flask import Blueprint, make_response, jsonify, request
from flask_restful import Api, Resource, abort, reqparse
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity
from datetime import datetime
from auth_middleware import manager_required
from cloudinary.uploader import upload
from flask_cors import cross_origin
from serializer import managerProfileSchema

from models import ManagerProfile, db


manager_profile_bp = Blueprint('manager_profile_bp', __name__)
ma = Marshmallow(manager_profile_bp)
bcrypt = Bcrypt()
api = Api(manager_profile_bp)


class ManagerProfiles(Resource):
    def get(self):
        managerProfile = ManagerProfile.query.all()
        result = managerProfileSchema.dump(managerProfile, many=True)
        response = make_response(jsonify(result), 200)

        return response
    
    @cross_origin()
    @manager_required()
    def post(self):
        current_user = get_jwt_identity()
        if "profile_photo" not in request.files:
            abort(400, detail='profile_photo is required first')

        profile_photo = request.files["profile_photo"]

        data = request.form
        try:
            if profile_photo:
                cloudinary_upload_result = upload(profile_photo)
                photo_url = cloudinary_upload_result.get("url")
                print(photo_url)
            else:
                abort(400, detail='profile_photo is required')

            data = request.form
            manager_id = current_user
            first_name = data["first_name"]
            last_name = data["last_name"]
            mantra = data["mantra"]
            phone_contact = data["phone_contact"]
            title = data["title"]
            date_of_birth = datetime.strptime(
                data["date_of_birth"], "%Y-%m-%d")
            date_created = datetime.utcnow()

            new_managerProfile = ManagerProfile(date_of_birth=date_of_birth, first_name=first_name,manager_id=manager_id, last_name=last_name,
                                                     mantra=mantra, phone_contact=phone_contact, profile_photo=photo_url, title=title, date_created=date_created)
            db.session.add(new_managerProfile)
            db.session.commit()

            result = managerProfileSchema.dump(new_managerProfile)
            response = make_response(jsonify(result), 201)

            return response
        
        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)


api.add_resource(ManagerProfiles, '/managerProfiles')


class ManagerProfileById(Resource):
    def get(self, id):
        single_manager_profile = ManagerProfile.query.filter_by(id=id).first()

        if not single_manager_profile:
            abort(404, detail=f'Manager Profile with  id {id} does not exist')

        else:
            result = managerProfileSchema.dump(single_manager_profile)
            response = make_response(jsonify(result), 200)
            return response

    @cross_origin()
    @manager_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        single_manager_profile = ManagerProfile.query.filter_by(id=id).first()

        if not single_manager_profile:
            abort(404, detail=f'Manager Profile with id {id} does not exist')

        if single_manager_profile.manager_id != current_user:
            abort(401, detail="Unauthorized request")

        # get the profile photo from the request files
        profile_photo = request.files.get("profile_photo")

        data = request.form.to_dict()


        if 'date_of_birth' in data:
            data['date_of_birth'] = datetime.strptime(
                data['date_of_birth'], "%Y-%m-%d")
            
        try:
            if profile_photo:
                # upload new profile photo
                cloudinary_upload_result = upload(profile_photo)
                photo_url = cloudinary_upload_result.get("url")
                print(photo_url)
                # set the profile photo attribute to the url
                single_manager_profile.profile_photo = photo_url


            for key, value in data.items():
                if value is not None:
                    setattr(single_manager_profile, key, value)
            db.session.commit()
            result = managerProfileSchema.dump(single_manager_profile)
            response = make_response(jsonify(result), 200)

            return response
        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)


    @manager_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        managerProfile = ManagerProfile.query.filter_by(id=id).first()
        if not managerProfile:
            abort(404, detail=f'manager profile with id {id} does not exist')

        if managerProfile.manager_id != current_user:
            abort(401, detail="Unauthorized request")

        db.session.delete(managerProfile)
        db.session.commit()

        response_body = {
            "message": "manager profile successfully deleted"
        }

        response = make_response(response_body, 200)
        return response


api.add_resource(ManagerProfileById, '/managerProfiles/<string:id>')
