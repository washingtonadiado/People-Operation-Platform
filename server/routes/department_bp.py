from flask import Blueprint, make_response, jsonify
from flask_restful import Api, Resource, abort, reqparse
from flask_marshmallow import Marshmallow
from serializer import departmentSchema,employeeSchema
from models import db, Department,EmployeeProfile,Employee,Manager,ManagerProfile
from auth_middleware import manager_required


# create education blueprint
department_bp = Blueprint('department_bp', __name__)
# register blueprints with marshmallow and api
ma = Marshmallow(department_bp)
api = Api(department_bp)


post_args = reqparse.RequestParser()
post_args.add_argument('name', type=str, required=True,
                       help="name is required")
# post_args.add_argument('dept_head', type=str, required=True,
#                        help="dept_head is required")


patch_args = reqparse.RequestParser()
patch_args.add_argument('name', type=str)
# patch_args.add_argument('dept_head', type=str)


class Departments(Resource):
    def get(self):
        departments = Department.query.all()
        result = departmentSchema.dump(departments, many=True)
        response = make_response(jsonify(result), 200)
        return response


    def post(self):
        data = post_args.parse_args()


        new_department = Department(
            name=data["name"]
        )

        db.session.add(new_department)
        db.session.commit()

        result = departmentSchema.dump(new_department)
        response = make_response(jsonify(result), 201)

        return response


api.add_resource(Departments, '/departments')


class DepartmentByID(Resource):
    def get(self, id):
        department = Department.query.filter_by(id=id).first()

        if not department:
            abort(404, detail=f'department with  id {id} does not exist')

        result = departmentSchema.dump(department)
        response = make_response(jsonify(result), 200)
        return response

    @manager_required()
    def patch(self, id):
        department = Department.query.filter_by(id=id).first()

        if not department:
            abort(404, detail=f'department with id {id} does not exist')

        data = patch_args.parse_args()
        for key, value in data.items():
            if value is None:
                continue
            setattr(department, key, value)

        db.session.commit()
        result = departmentSchema.dump(department)
        response = make_response(jsonify(result), 200)

        return response

    @manager_required()
    def delete(self):
        department = Department.query.filter_by(id=id).first()

        if not department:
            abort(404, detail=f'department with id {id} does not exist')

        db.session.delete(department)
        db.session.commit()

        return {}, 200


api.add_resource(DepartmentByID, '/departments/<string:id>')



