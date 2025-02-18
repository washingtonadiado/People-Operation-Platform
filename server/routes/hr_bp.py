from flask import Blueprint, make_response, jsonify
from flask_restful import Api, Resource, abort, reqparse
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity
from serializer import hrSchema
from auth_middleware import hr_required

from models import HR_Personel, db,HrProfile

hr_bp = Blueprint('hr_bp', __name__)
ma = Marshmallow(hr_bp)
bcrypt = Bcrypt()
api = Api(hr_bp)

post_args = reqparse.RequestParser()
post_args.add_argument('email', type=str, required=True,
                       help='Email is required')
post_args.add_argument('password', type=str, required=True,
                       help='Password is required')
post_args.add_argument('dept_id', type=str, required=True,
                       help='Departmemnt ID  is required')


patch_args = reqparse.RequestParser()
patch_args.add_argument('email', type=str)
patch_args.add_argument('password', type=str)
patch_args.add_argument('dept_id', type=str)


class HR_Personnels(Resource):
    def get(self):
        HR = HR_Personel.query.all()
        result = hrSchema.dump(HR, many=True)
        response = make_response(jsonify(result), 200)

        return response

    def post(self):
        data = post_args.parse_args()

        # error handling
        HR = HR_Personel.query.filter_by(email=data.email).first()
        if HR:
            abort(409, detail="HR with the same email already exists")
        hashed_password = bcrypt.generate_password_hash(data['password'])
        new_HR = HR_Personel(
            email=data['email'], password=hashed_password, dept_id=data['dept_id'])
        db.session.add(new_HR)
        db.session.commit()

        result = hrSchema.dump(new_HR)
        response = make_response(jsonify(result), 201)

        return response


api.add_resource(HR_Personnels, '/hr_personnels')


class HRById(Resource):
    def get(self, id):
        single_HR = HR_Personel.query.filter_by(id=id).first()

        if not single_HR:
            abort(404, detail=f'user with  id {id} does not exist')

        else:
            result = hrSchema.dump(single_HR)
            response = make_response(jsonify(result), 200)
            return response

    @hr_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        single_HR = HR_Personel.query.filter_by(id=id).first()

        if not single_HR:
            abort(404, detail=f'user with id {id} does not exist')

        if single_HR.id != current_user:
            abort(401, detail="Unauthorized request")

        data = patch_args.parse_args()
        for key, value in data.items():
            if value is None:
                continue
            setattr(single_HR, key, value)
        db.session.commit()
        result = hrSchema.dump(single_HR)
        response = make_response(jsonify(result), 200)

        return response

    @hr_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        HR = HR_Personel.query.filter_by(id=id).first()
        if not HR:
            abort(404, detail=f'HR with id {id} does not exist')

        if HR.id != current_user:
            abort(401, detail="Unauthorized request")

        db.session.delete(HR)
        db.session.commit()

        response_body = {
            "message": "HR successfully deleted"
        }

        response = make_response(response_body, 200)
        return response


api.add_resource(HRById, '/hr_personnels/<string:id>')


class HRDetails(Resource):
    def get(self):
        hr_personnels_with_profiles = db.session.query(HR_Personel, HrProfile).outerjoin(HrProfile, HR_Personel.id == HrProfile.hr_id).all()

        result = []
        for hr_personnel, hr_profile in hr_personnels_with_profiles:
            hr_data = {
                'id': hr_personnel.id,
                'email': hr_personnel.email,
                'personal_no': hr_personnel.personal_no
            }
            if hr_profile:
                hr_data.update({
                    'hr_first_name': hr_profile.first_name,
                    'hr_last_name': hr_profile.last_name,
                    'hr_title': hr_profile.title,
                    'hr_mantra': hr_profile.mantra,
                    'hr_phone_contact': hr_profile.phone_contact
                })
            
            result.append(hr_data)

        response = make_response(jsonify(result), 200)
        return response

api.add_resource(HRDetails, '/hr_details')