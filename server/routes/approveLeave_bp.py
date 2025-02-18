from flask import Flask, request,Blueprint, make_response, jsonify
from flask_restful import Api, Resource
from datetime import datetime
from models import db, Leave, LeaveApproval
from flask_jwt_extended import get_jwt_identity,get_jwt,jwt_required
from flask_restful import Api, Resource, abort, reqparse
from flask_marshmallow import Marshmallow
from serializer import leaveApprovalSchema
approvalLeave_bp = Blueprint('approvalLeave_bp', __name__)
ma = Marshmallow(approvalLeave_bp)
api = Api(approvalLeave_bp)

post_args = reqparse.RequestParser()
post_args.add_argument('employee_id', type=str, required=True, help='Employee ID is required')
post_args.add_argument('manager_approval', type=bool)
post_args.add_argument('hr_approval', type=bool)

patch_args = reqparse.RequestParser()
patch_args.add_argument('manager_approval', type=bool)
patch_args.add_argument('hr_approval', type=bool)

class LeaveApprovalResource(Resource):

    @jwt_required()
    def get(self):
        date_str = request.args.get('date')
        if not date_str:
            return {'message': 'Date parameter is required'}, 400

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return {'message': 'Invalid date format. Date should be in YYYY-MM-DD format'}, 400

        leave_approvals = LeaveApproval.query.filter(
            (LeaveApproval.manager_app_date == date) | (LeaveApproval.hr_approval_date == date)
        ).all()

        result = []
        for leave_approval in leave_approvals:
            result.append({
                'leave_id': leave_approval.leave_id,
                'employee_id': leave_approval.employee_id,
                'approved_by_manager': leave_approval.approved_by_manager,
                'manager_app_date': leave_approval.manager_app_date,
                'approved_by_hr': leave_approval.approved_by_hr,
                'hr_approval_date': leave_approval.hr_approval_date
            })

        return {'leave_approvals': result}, 200
    
api.add_resource(LeaveApprovalResource, '/leave/approvals')

class LeaveApprovalResourceByID(Resource):

    @jwt_required()    
    def post(self, leave_id):
        data = post_args.parse_args()
        employee_id = data['employee_id']
        manager_approval = data['manager_approval']
        hr_approval = data['hr_approval']

        leave = Leave.query.get(leave_id)
        if not leave:
            return {'message': 'Leave not found'}, 404

        if manager_approval is not None:
            leave_approval = LeaveApproval(
                leave_id=leave_id,
                employee_id=employee_id,
                approved_by_manager=manager_approval
            )
            db.session.add(leave_approval)
            db.session.commit()
            result = leaveApprovalSchema.dump(leave_approval)
            return {'message': 'Leave approved by manager', 'leave_approval': result}, 200

        elif hr_approval is not None:
            leave_approval = LeaveApproval(
                leave_id=leave_id,
                employee_id=employee_id,
                approved_by_hr=hr_approval
            )
            db.session.add(leave_approval)
            db.session.commit()
            result = leaveApprovalSchema.dump(leave_approval)
            return {'message': 'Leave approved by HR', 'leave_approval': result}, 200

        else:
            return {'message': 'Manager approval or HR approval required'}, 400
    
    #updating a leave

    @jwt_required()
    def patch(self, leave_id):        
        data = patch_args.parse_args()

        # Check if a Leave record exists for the given leave_id
        leave = Leave.query.get(leave_id)
        if not leave:
            return {'message': 'Leave not found'}, 404

        leave_approval = LeaveApproval.query.filter_by(leave_id=leave_id).first()

        if not leave_approval:
            abort(404, message="Error approving Leave")

        for key, value in data.items():
            if value is not None:
                setattr(leave_approval, key, value)

        db.session.commit()
        result = leaveApprovalSchema.dump(leave_approval)
        return {'message': 'Leave Approval updated successfully', 'leave_approval': result}, 200

    @jwt_required()
    def delete(self, leave_id):

        # Check if a Leave record exists for the given leave_id
        leave = Leave.query.get(leave_id)
        if not leave:
            return {'message': 'Leave not found'}, 404

        leave_approval = LeaveApproval.query.filter_by(leave_id=leave_id).first()

        if not leave_approval:
            return {'message': 'Leave Approval not found'}, 404

        db.session.delete(leave_approval)
        db.session.commit()

        return {'message': 'Leave Approval deleted successfully'}, 200

    
    
    

      

api.add_resource(LeaveApprovalResourceByID, '/leave/approval/<string:leave_id>')