from flask import Blueprint, make_response, jsonify
from flask_restful import Api, Resource, abort, reqparse
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity,current_user

from serializer import leaveSchema

from models import Leave, db
from auth_middleware import employee_required
from datetime import datetime

leave_bp = Blueprint('leave_bp', __name__)
ma = Marshmallow(leave_bp)
bcrypt = Bcrypt()
api = Api(leave_bp)

post_args = reqparse.RequestParser()
post_args.add_argument('start_date', type=str,
                       required=True, help='Start date is required')
post_args.add_argument('end_date', type=str, required=True,
                       help='End date is required')
post_args.add_argument('description', type=str,
                       required=True, help='Description is required')
# post_args.add_argument('employee_id', type=int, required=True,
#                        help='Employee Id is required')
# post_args.add_argument('approved', type=bool, required=True,
#                        help='Approval slot is required')

patch_args = reqparse.RequestParser()
patch_args.add_argument('start_date', type=str)
patch_args.add_argument('end_date', type=str)
patch_args.add_argument('description', type=str)
patch_args.add_argument('employee_id', type=int)
patch_args.add_argument('approved', type=bool)


class Leaves(Resource):
    def get(self):
        leave = Leave.query.all()
        result = leaveSchema.dump(leave, many=True)
        response = make_response(jsonify(result), 200)

        return response

    @employee_required()
    def post(self):
        current_user = get_jwt_identity()
        data = post_args.parse_args()

      
        start_date = datetime.strptime(
            data["start_date"], "%Y-%m-%d")
        end_date = datetime.strptime(
            data["end_date"], "%Y-%m-%d")
        new_leave = Leave(start_date=start_date, end_date=end_date,
                          employee_id=current_user, description=data['description'], approved=0)
        db.session.add(new_leave)
        db.session.commit()

        result = leaveSchema.dump(new_leave)
        response = make_response(jsonify(result), 201)

        return response


api.add_resource(Leaves, '/leaves')


class LeaveById(Resource):
    def get(self, id):

        single_leave = Leave.query.filter_by(id=id).first()

        if not single_leave:
            abort(404, detail=f'leave with  id {id} does not exist')

        else:
            result = leaveSchema.dump(single_leave)
            response = make_response(jsonify(result), 200)
            return response

    @employee_required()
    def patch(self, id):
        current_user = get_jwt_identity()
        single_leave = Leave.query.filter_by(id=id).first()

        if not single_leave:
            abort(404, detail=f'leave with id {id} does not exist')

        if single_leave.employee_id != current_user:
            abort(401, detail="Unauthorized request")
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
            setattr(single_leave, key, value)
        db.session.commit()
        result = leaveSchema.dump(single_leave)
        response = make_response(jsonify(result), 200)

        return response

    @employee_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        leave = Leave.query.filter_by(id=id).first()
        if not leave:
            abort(404, detail=f'leave with id {id} does not exist')
        if leave.employee_id != current_user:
            abort(401, detail="Unauthorized request")

        db.session.delete(leave)
        db.session.commit()

        response_body = {
            "message": "leave successfully deleted"
        }

        response = make_response(response_body, 200)
        return response


api.add_resource(LeaveById, '/leaves/<string:id>')



class EmployeeLeaves(Resource):
    @employee_required()
    def get(self, id):
        current_user=get_jwt_identity()
        leaves = Leave.query.filter_by(employee_id=id).all()

        if not leaves:
            abort(404, detail=f'You have no applied Leaves')

        else:
            result = leaveSchema.dump(leaves, many=True)
            response = make_response(jsonify(result), 200)
            return response

api.add_resource(EmployeeLeaves, '/employee_leaves/<string:id>')


