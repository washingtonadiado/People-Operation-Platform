from flask import Blueprint, make_response, jsonify, current_app
from flask_mail import Message
from flask_restful import Api, Resource, abort, reqparse
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity
from serializer import employeeSchema,managerSchema,hrSchema
from auth_middleware import employee_required, hr_required

from models import Employee, db,EmployeeProfile,Manager,HR_Personel,ManagerProfile,HrProfile

employee_bp = Blueprint('employee_bp', __name__)
ma = Marshmallow(employee_bp)
bcrypt = Bcrypt()
api = Api(employee_bp)

post_args = reqparse.RequestParser()
post_args.add_argument('email', type=str, required=True,
                       help='Email is required')
post_args.add_argument('password', type=str, required=True,
                       help='Password is required')
post_args.add_argument('dept_id', type=str, required=True,
                       help='Departmemnt ID  is required')
post_args.add_argument('personal_no', type=str, required=True,
                       help='Staff No is required')
post_args.add_argument('role', type=str, required=True,
                       help='Role is required')



patch_args = reqparse.RequestParser()
patch_args.add_argument('email', type=str)
patch_args.add_argument('password', type=str)
patch_args.add_argument('dept_id', type=str)


class Employees(Resource):
    def get(self):
        employees = Employee.query.all()
        result = employeeSchema.dump(employees, many=True)
        response = make_response(jsonify(result), 200)

        return response

    def post(self):
        data = post_args.parse_args()

    # error handling
        if data['role'] == 'employee':
              employee = Employee.query.filter_by(email=data['email']).first()
              if employee:
                    abort(409, detail="Employee with the same email already exists")
              hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

              new_employee = Employee(email=data['email'], password=hashed_password, dept_id=data['dept_id'], personal_no=data["personal_no"])
              db.session.add(new_employee)
              db.session.commit()

              # send email
              msg = Message('Welcome!', sender = 'tedtedmike@gmail.com', recipients = [data['email']])
              msg.body = f"Hello, you have been added as an employee. Your account details are:\nEmail: {data['email']}\nPassword: {data['password']}"
              current_app.mail.send(msg)

              result = employeeSchema.dump(new_employee)
              response = make_response(jsonify(result), 201)
              return response

        elif data['role'] == 'manager':
              manager = Manager.query.filter_by(email=data['email']).first()
              if manager:abort(409, detail="Manager with the same email already exists")
              hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

              new_manager = Manager(email=data['email'], password=hashed_password, dept_id=data['dept_id'], personal_no=data["personal_no"])
              db.session.add(new_manager)
              db.session.commit()

              # send email
              msg = Message('Welcome!', sender = 'tedtedmike@gmail.com', recipients = [data['email']])
              msg.body = f"Hello, you have been added as a manager. Your account details are:\nEmail: {data['email']}\nPassword: {data['password']}"
              current_app.mail.send(msg)

              result = managerSchema.dump(new_manager)
              response = make_response(jsonify(result), 201)
              return response

        else:
              hr = HR_Personel.query.filter_by(email=data['email']).first()
              if hr:abort(409, detail="Hr with the same email already exists")
              hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

              new_hr = HR_Personel(
              email=data['email'], password=hashed_password, dept_id=data['dept_id'], personal_no=data["personal_no"])
              db.session.add(new_hr)
              db.session.commit()

              result = managerSchema.dump(new_hr)
              response = make_response(jsonify(result), 201)
              return response



api.add_resource(Employees, '/employees')


class EmployeeById(Resource):
    def get(self, id):
        single_employee = Employee.query.filter_by(id=id).first()

        if not single_employee:
            abort(404, detail=f'user with  id {id} does not exist')

        else:
            result = employeeSchema.dump(single_employee)
            response = make_response(jsonify(result), 200)
            return response

    @employee_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        single_employee = Employee.query.filter_by(id=id).first()

        if not single_employee:
            abort(404, detail=f'user with id {id} does not exist')

        if single_employee.id != current_user:
            abort(401, detail="Unauthorized request")

        data = patch_args.parse_args()
        for key, value in data.items():
            if value is None:
                continue
            setattr(single_employee, key, value)
        db.session.commit()
        result = employeeSchema.dump(single_employee)
        response = make_response(jsonify(result), 200)

        return response

    @hr_required()
    def delete(self, id):
        employee = Employee.query.filter_by(id=id).first()
        if not employee:
            abort(404, detail=f'employee with id {id} does not exist')
        db.session.delete(employee)
        db.session.commit()

        response_body = {
            "message": "employee successfully deleted"
        }

        response = make_response(response_body, 200)
        return response


api.add_resource(EmployeeById, '/employees/<string:id>')



class EmployeesDetails(Resource):
    def get(self):
        employees_with_profiles = db.session.query(Employee, EmployeeProfile).outerjoin(EmployeeProfile, Employee.id == EmployeeProfile.employee_id).all()

        result = []
        for employee, employee_profile in employees_with_profiles:
            employee_data = {
                'id': employee.id,
                'email': employee.email,
                'personal_no': employee.personal_no
            }
            if employee_profile:
                employee_data.update({
                    'employee_first_name': employee_profile.first_name,
                    'employee_last_name': employee_profile.last_name,
                    'employee_title': employee_profile.title
                })
            
            result.append(employee_data)

        response = make_response(jsonify(result), 200)
        return response

api.add_resource(EmployeesDetails, '/employees_details')
