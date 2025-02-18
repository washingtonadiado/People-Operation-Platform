from datetime import datetime
from flask import Blueprint, make_response, jsonify, request
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from flask_restful import Api, Resource, abort, reqparse
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity
from serializer import hrProfileSchema
from auth_middleware import hr_required
from flask_cors import cross_origin
from models import db, HrProfile
from cloudinary.uploader import upload

hrProfile_bp = Blueprint('hrProfile_bp', __name__)
ma = Marshmallow(hrProfile_bp)
api = Api(hrProfile_bp)



class HrProfiles(Resource):
    def get(self):
        hr_profiles = HrProfile.query.all()
        result = hrProfileSchema.dump(hr_profiles, many=True)
        response = make_response(jsonify(result), 200)

        return response


    @cross_origin()
    @hr_required()
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
            hr_id = current_user
            first_name = data["first_name"]
            last_name = data["last_name"]
            mantra = data["mantra"]
            phone_contact = data["phone_contact"]
            title = data["title"]
            date_of_birth = datetime.strptime(
                data["date_of_birth"], "%Y-%m-%d")
            date_created = datetime.utcnow()

            new_hr_profile = HrProfile(date_of_birth=date_of_birth, hr_id=hr_id, first_name=first_name, last_name=last_name, mantra=mantra,
                                    phone_contact=phone_contact, profile_photo=photo_url, title=title, date_created=date_created)
            db.session.add(new_hr_profile)
            db.session.commit()

            result = hrProfileSchema.dump(new_hr_profile)
            response = make_response(jsonify(result), 201)

            return response
        
        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)


api.add_resource(HrProfiles, '/hrProfiles')


class HrProfileById(Resource):
    def get(self, id):
        single_hr_profile = HrProfile.query.filter_by(id=id).first()

        if not single_hr_profile:
            abort(404, detail=f'Hr Profile with  id {id} does not exist')

        else:
            result = hrProfileSchema.dump(single_hr_profile)
            response = make_response(jsonify(result), 200)
            return response

    @cross_origin()
    @hr_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        single_hr_profile = HrProfile.query.filter_by(id=id).first()

        if not single_hr_profile:
            abort(404, detail=f'Hr Profile with id {id} does not exist')

        if single_hr_profile.hr_id != current_user:
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
                single_hr_profile.profile_photo = photo_url


            for key, value in data.items():
                if value is not None:
                    setattr(single_hr_profile, key, value)
            db.session.commit()
            result = hrProfileSchema.dump(single_hr_profile)
            response = make_response(jsonify(result), 200)

            return response
        except Exception as e:
            print(f"Error: {e}")
            db.session.rollback()
            return make_response(jsonify({"error": str(e)}), 500)


    @hr_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        single_hr_profile = HrProfile.query.filter_by(id=id).first()
        if not single_hr_profile:
            response_body = {"error": "Hr Profile not found"}
            return make_response(response_body, 404)

        if single_hr_profile.hr_id != current_user:
            abort(401, detail="Unauthorized request")

        db.session.delete(single_hr_profile)
        db.session.commit()
        response_body = {"message": "Hr Profile successfully deleted"}
        return make_response(response_body, 200)


api.add_resource(HrProfileById, '/hrProfiles/<string:id>')
