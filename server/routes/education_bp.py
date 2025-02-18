from flask import Blueprint, make_response, jsonify
from flask_restful import Api, Resource, abort, reqparse
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity
from serializer import educationSchema
from models import db, Education,EmployeeProfile,Employee
from auth_middleware import employee_required
from datetime import datetime

# create education blueprint
education_bp = Blueprint('education_bp', __name__)
# register blueprints with marshmallow and api
ma = Marshmallow(education_bp)
api = Api(education_bp)


post_args = reqparse.RequestParser()

post_args.add_argument('institution', type=str, required=True,
                       help="Institution is required")
post_args.add_argument('course', type=str, required=True,
                       help="course is required")
post_args.add_argument('qualification', type=str, required=True,
                       help="qualification is required")

post_args.add_argument('start_date', type=str, required=True,
                       help="start_date is required")
post_args.add_argument('end_date', type=str, required=True,
                       help="end_date is required")

patch_args = reqparse.RequestParser()

patch_args.add_argument('institution', type=str)
patch_args.add_argument('course', type=str)
patch_args.add_argument('qualification', type=str)
patch_args.add_argument('start_date', type=str)
patch_args.add_argument('end_date', type=str)


class EducationDetails(Resource):
    def get(self):
        education_details = Education.query.all()
        result = educationSchema.dump(education_details, many=True)
        response = make_response(jsonify(result), 200)
        return response

    @employee_required()
    def post(self):
        current_user = get_jwt_identity()
        data = post_args.parse_args()

        employee_education = Education(
            employee_id=current_user,
            institution=data['institution'],
            course=data['course'],
            qualification=data['qualification'],
            start_date=datetime.strptime(
                data["start_date"], "%Y-%m-%d"),
            end_date=datetime.strptime(
                data["end_date"], "%Y-%m-%d")


        )

        db.session.add(employee_education)
        db.session.commit()

        result = educationSchema.dump(employee_education)
        response = make_response(jsonify(result), 201)

        return response


api.add_resource(EducationDetails, '/education')


class EducationByID(Resource):
    def get(self, id):
        education = Education.query.filter_by(id=id).first()

        if not education:
            abort(404, detail=f'education with  id {id} does not exist')

        result = educationSchema.dump(education)
        response = make_response(jsonify(result), 200)
        return response

    @employee_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        education = Education.query.filter_by(id=id).first()

        if not education:
            abort(404, detail=f'educaction with id {id} does not exist')

        if education.employee_id != current_user:
            abort(400, detail="Unauthorized request")
        data = patch_args.parse_args()

        if 'start_date' in data:
            data['start_date'] = datetime.strptime(
                data['start_date'], "%Y-%m-%d")
        if 'end_date' in data:
            data['end_date'] = datetime.strptime(
                data['end_date'], "%Y-%m-%d")

        for key, value in data.items():
            if value is None:
                continue
            setattr(education, key, value)

        db.session.commit()
        result = educationSchema.dump(education)
        response = make_response(jsonify(result), 200)

        return response

    @employee_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        education = Education.query.filter_by(id=id).first()

        if not education:
            abort(404, detail=f'education with id {id} does not exist')

        if education.employee_id != current_user:
            abort(400, detail="Unauthorized request")

        db.session.delete(education)
        db.session.commit()

        return {}, 200


api.add_resource(EducationByID, '/education/<string:id>')


class EmployeeEducationDetails(Resource):
    @employee_required()
    def get(self, employee_id):
        current_user = get_jwt_identity()
        if current_user != employee_id:
            abort(
                403, detail="Forbidden: You can only access your own education details.")

        employee_education = Education.query.filter_by(
            employee_id=current_user).all()
        result = educationSchema.dump(employee_education, many=True)
        response = make_response(jsonify(result), 200)
        return response


api.add_resource(EmployeeEducationDetails,
                 '/education/employee/<string:employee_id>')

class StaffEducationDetails(Resource):
    def get(self):
        education_details = db.session.query(
            Education, EmployeeProfile, Employee.personal_no
        ).outerjoin(EmployeeProfile, Education.employee_id == EmployeeProfile.employee_id
        ).outerjoin(Employee, Education.employee_id == Employee.id
        ).all()

        result = []
        for education, profile, personal_no in education_details:
            education_data = educationSchema.dump(education)
            if profile is not None:
                profile_data = {
                    'first_name': profile.first_name,
                    'last_name': profile.last_name
                }
            else:
                profile_data = {
                    'employee_id': education.employee_id
                }
            result.append({**education_data, **profile_data, 'personal_no': personal_no})

        response = make_response(jsonify(result), 200)
        return response

api.add_resource(StaffEducationDetails, '/staff_education')

   