from datetime import datetime
from flask import Blueprint, make_response, jsonify, request
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from flask_restful import Api, Resource, abort, reqparse
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity, jwt_required
from serializer import employeeProfileSchema
from cloudinary.uploader import upload
from flask_cors import cross_origin

from models import db, EmployeeProfile
from auth_middleware import employee_required

employeeProfile_bp = Blueprint('employeeProfile_bp', __name__)
ma = Marshmallow(employeeProfile_bp)
api = Api(employeeProfile_bp)


class EmployeeProfiles(Resource):
    def get(self):
        employee_profiles = EmployeeProfile.query.all()
        result = employeeProfileSchema.dump(employee_profiles, many=True)
        response = make_response(jsonify(result), 200)

        return response

    @cross_origin()
    @employee_required()
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
            employee_id = current_user
            first_name = data["first_name"]
            last_name = data["last_name"]
            mantra = data["mantra"]
            phone_contact = data["phone_contact"]
            title = data["title"]
            date_of_birth = datetime.strptime(
                data["date_of_birth"], "%Y-%m-%d")
            date_created = datetime.utcnow()

            new_experience_profile = EmployeeProfile(date_of_birth=date_of_birth, employee_id=employee_id, first_name=first_name, last_name=last_name,
                                                     mantra=mantra, phone_contact=phone_contact, profile_photo=photo_url, title=title, date_created=date_created)
            db.session.add(new_experience_profile)
            db.session.commit()

            result = employeeProfileSchema.dump(new_experience_profile)
            response = make_response(jsonify(result), 201)

            return response

        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)


api.add_resource(EmployeeProfiles, '/employeeProfiles')


class EmployeeProfileById(Resource):
    def get(self, id):
        single_employee_profile = EmployeeProfile.query.filter_by(
            id=id).first()

        if not single_employee_profile:
            abort(404, detail=f'Employee Profile with  id {id} does not exist')

        else:
            result = employeeProfileSchema.dump(single_employee_profile)
            response = make_response(jsonify(result), 200)
            return response

    @cross_origin()
    @employee_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        single_employee_profile = EmployeeProfile.query.filter_by(
            id=id).first()

        if not single_employee_profile:
            abort(404, detail=f'Employee Profile with id {id} does not exist')

        if single_employee_profile.employee_id != current_user:
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
                single_employee_profile.profile_photo = photo_url

            # update the other attributes with the data
            for key, value in data.items():
                if value is not None:
                    setattr(single_employee_profile, key, value)

            db.session.commit()
            result = employeeProfileSchema.dump(single_employee_profile)
            response = make_response(jsonify(result), 200)

            return response
        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)

    @employee_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        single_employee_profile = EmployeeProfile.query.filter_by(
            id=id).first()
        if not single_employee_profile:
            response_body = {"error": "Employee Profile not found"}
            return make_response(response_body, 404)

        if single_employee_profile.employee_id != current_user:
            abort(401, detail="Unauthorized request")

        db.session.delete(single_employee_profile)
        db.session.commit()
        response_body = {
            "message": "Employee Profile successfully deleted"}
        return make_response(response_body, 200)


api.add_resource(EmployeeProfileById, '/employeeProfiles/<string:id>')