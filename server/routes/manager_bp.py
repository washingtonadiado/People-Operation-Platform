from flask import Blueprint, make_response, jsonify,Response
from flask_restful import Api, Resource, abort, reqparse
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity
from serializer import managerSchema,departmentSchema
from auth_middleware import manager_required
from models import Manager, db,Employee,Department,EmployeeProfile,EmployeeTraining,ManagerProfile

manager_bp = Blueprint('manager_bp', __name__)
ma = Marshmallow(manager_bp)
bcrypt = Bcrypt()
api = Api(manager_bp)

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


class Managers(Resource):
    def get(self):
        managers = Manager.query.all()
        result = managerSchema.dump(managers, many=True)
        response = make_response(jsonify(result), 200)

        return response

    def post(self):
        data = post_args.parse_args()

        # error handling
        manager = Manager.query.filter_by(email=data.email).first()
        if manager:
            abort(409, detail="Manager with the same email already exists")
        hashed_password = bcrypt.generate_password_hash(data['password'])
        new_manager = Manager(
            email=data['email'], password=hashed_password, dept_id=data['dept_id'])
        db.session.add(new_manager)
        db.session.commit()

        result = managerSchema.dump(new_manager)
        response = make_response(jsonify(result), 201)

        return response


api.add_resource(Managers, '/managers')


class ManagerById(Resource):
    def get(self, id):
        single_manager = Manager.query.filter_by(id=id).first()

        if not single_manager:
            abort(404, detail=f'user with  id {id} does not exist')

        else:
            result = managerSchema.dump(single_manager)
            response = make_response(jsonify(result), 200)
            return response

    @manager_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        single_manager = Manager.query.filter_by(id=id).first()

        if not single_manager:
            abort(404, detail=f'user with id {id} does not exist')

        if single_manager.id != current_user:
            abort(401, detail="Unauthorized request")

        data = patch_args.parse_args()
        for key, value in data.items():
            if value is None:
                continue
            setattr(single_manager, key, value)
        db.session.commit()
        result = managerSchema.dump(single_manager)
        response = make_response(jsonify(result), 200)

        return response

    @manager_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        manager = Manager.query.filter_by(id=id).first()
        if not manager:
            abort(404, detail=f'manager with id {id} does not exist')

        if manager.id != current_user:
            abort(401, detail="Unauthorized request")

        db.session.delete(manager)
        db.session.commit()

        response_body = {
            "message": "manager successfully deleted"
        }

        response = make_response(response_body, 200)
        return response


api.add_resource(ManagerById, '/managers/<string:id>')


class TrainingsPerDepartment(Resource):
    @manager_required()
    def get(self, manager_id):
        manager = Manager.query.get(manager_id)
        if not manager:
            return make_response(jsonify({"message": "Manager not found"}), 404)

        department = Department.query.get(manager.dept_id)
        if not department:
            return make_response(jsonify({"message": "Department not found"}), 404)

        employees = Employee.query.filter_by(dept_id=department.id).all()
        if not employees:
            return make_response(jsonify({"message": "No employees found in this department"}), 404)

        employees_details = []

        for employee in employees:
            employee_profile = EmployeeProfile.query.filter_by(employee_id=employee.id).first()

            employee_details = {
                "id": employee.id,
                "personal_no": employee.personal_no,
                "email": employee.email,
                "first_name": employee_profile.first_name if employee_profile else None,
                "last_name": employee_profile.last_name if employee_profile else None,
                "phone_contact": employee_profile.phone_contact if employee_profile else None
            }

            assigned_trainings = EmployeeTraining.query.filter_by(employee_id=employee.id).all()
            employee_details["assigned_trainings"] = [{
                "title": training.training.title if training.training else None,
                "description": training.training.description if training.training else None,
                "start_date": training.training.start_date.strftime('%Y-%m-%d') if training.training and training.training.start_date else None,
                "start_time": training.training.start_time.strftime('%H:%M:%S') if training.training and training.training.start_time else None,
                "end_date": training.training.end_date.strftime('%Y-%m-%d') if training.training and training.training.end_date else None,
                "end_time": training.training.end_time.strftime('%H:%M:%S') if training.training and training.training.end_time else None
            } for training in assigned_trainings]

            employees_details.append(employee_details)

        return jsonify(employees_details)

api.add_resource(TrainingsPerDepartment, '/manager/employees/<string:manager_id>')

class EmployeesPerDepartment(Resource):
    @manager_required()
    def get(self, dept_id):
        department = Department.query.get(dept_id)
        if not department:
            return make_response(jsonify({"message": "Department not found"}), 404)

        employees = Employee.query.filter_by(dept_id=department.id).all()
        if not employees:
            return make_response(jsonify({"message": "No employees found in this department"}), 404)

        employees_details = []

        for employee in employees:
            employee_profile = EmployeeProfile.query.filter_by(employee_id=employee.id).first()

            employee_details = {
                "id": employee.id,
                "personal_no": employee.personal_no,  
                "email": employee.email,
                "first_name": employee_profile.first_name if employee_profile else None,
                "last_name": employee_profile.last_name if employee_profile else None,
                "phone_contact": employee_profile.phone_contact if employee_profile else None
            }

            employees_details.append(employee_details)

        return jsonify(employees_details)

api.add_resource(EmployeesPerDepartment, '/employees_department/<string:dept_id>')


class DepartmentsHead(Resource):
    def get(self):
        departments = Department.query.all()
        result = []
        for department in departments:
            department_data = departmentSchema.dump(department)
          
            manager = Manager.query.filter_by(dept_id=department.id).first()
            if manager:
                department_data['manager'] = {
                    'id': manager.id,
                    'email': manager.email,
                   
                    'profile': {}
                }
                manager_profile = ManagerProfile.query.filter_by(manager_id=manager.id).first()
                if manager_profile:
                    department_data['manager']['profile'] = {
                        'first_name': manager_profile.first_name,
                        'last_name': manager_profile.last_name,
                       
                    }
            result.append(department_data)
        response = make_response(jsonify(result), 200)
        return response
api.add_resource(DepartmentsHead, '/department_heads')

class UpdateDepartmentDetails(Resource):

    @manager_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        department = Department.query.filter_by(id=id).first()

        if not department:
            abort(404, detail=f'Department with id {id} does not exist')

     
        if department.manager.id != current_user:
            abort(401, detail="Unauthorized request")

        data = patch_args.parse_args()

    
        for key, value in data.items():
            if value is not None:
                setattr(department, key, value)

     
        manager_data = data.get('manager', {})
        if manager_data:
            manager = department.manager
            for key, value in manager_data.items():
                if value is not None:
                    setattr(manager, key, value)

        db.session.commit()

     
        result = {
            'department': departmentSchema.dump(department),
            'manager': managerSchema.dump(manager)
        }

        response = make_response(jsonify(result), 200)
        return response
api.add_resource(UpdateDepartmentDetails, '/Update_department_details')

@manager_bp.route('/managers_with_names', methods=['GET'])
def get_managers_with_names():
    managers = db.session.query(Manager.id, Manager.personal_no, ManagerProfile.first_name, ManagerProfile.last_name).join(ManagerProfile).all()
    return jsonify([{'id': id,"personal_no":personal_no, 'name': f"{first_name} {last_name}"} for id,personal_no, first_name, last_name in managers])

class ManagerDetails(Resource):
    def get(self):
        managers_with_profiles = db.session.query(Manager, ManagerProfile).outerjoin(ManagerProfile, Manager.id == ManagerProfile.manager_id).all()

        result = []
        for manager, manager_profile in managers_with_profiles:
            manager_data = {
                'id': manager.id,
                'email': manager.email,
                'personal_no': manager.personal_no
            }
            if manager_profile:
                manager_data.update({
                    'first_name': manager_profile.first_name,
                    'last_name': manager_profile.last_name,
                    'mantra': manager_profile.mantra,
                    'phone_contact': manager_profile.phone_contact
                })
            
            result.append(manager_data)

        response = make_response(jsonify(result), 200)
        return response

api.add_resource(ManagerDetails, '/manager_details')

class ManagerDepartmentDetails(Resource):
    def get(self):
        managers_with_profiles = db.session.query(Manager, ManagerProfile, Department).outerjoin(ManagerProfile, Manager.id == ManagerProfile.manager_id).outerjoin(Department, Manager.dept_id == Department.id).all()

        result = []
        for manager, manager_profile, department in managers_with_profiles:
            manager_data = {
                'id': manager.id,
                'email': manager.email,
                'personal_no': manager.personal_no,
                'department_name': department.name if department else None
            }
            if manager_profile:
                manager_data.update({
                    'first_name': manager_profile.first_name,
                    'last_name': manager_profile.last_name,
                    'mantra': manager_profile.mantra,
                    'phone_contact': manager_profile.phone_contact
                })

            result.append(manager_data)

        response = make_response(jsonify(result), 200)
        return response

api.add_resource(ManagerDepartmentDetails, '/manager_department_details')
