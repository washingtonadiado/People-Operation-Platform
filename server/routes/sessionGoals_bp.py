from flask import Blueprint, make_response, jsonify
from flask_restful import Api, Resource, reqparse
from datetime import datetime
from models import Goals, db, Session
from serializer import goalsSchema
from auth_middleware import manager_required

goals_session_bp = Blueprint('goals_session_bp', __name__)
api = Api(goals_session_bp)

post_args = reqparse.RequestParser()
post_args.add_argument('employee_id', type=str,
                       required=True, help='Employee ID is required')
post_args.add_argument('name', type=str, required=True,
                       help='Goal name is required')
post_args.add_argument('description', type=str,
                       required=True, help='Description is required')
post_args.add_argument('session_id', type=str,
                       required=True, help='Session ID is required')

get_args = reqparse.RequestParser()
get_args.add_argument('employee_id', type=str,
                      required=True, help='Employee ID is required')
get_args.add_argument('quarter', type=str, required=True,
                      help='Quarter Name is required')

patch_args = reqparse.RequestParser()
patch_args.add_argument('employee_id', type=str,
                        required=True, help='Employee ID is required')
patch_args.add_argument('name', type=str, required=True,
                        help='Goal name is required')
patch_args.add_argument('description', type=str,
                        required=True, help='Description is required')
patch_args.add_argument('session_id', type=str,
                        required=True, help='Session ID is required')


class GoalsSessionResource(Resource):
    def get(self):
        data = get_args.parse_args()

        session = Session.query.filter_by(name=f"{data['quarter']}").first()
        if not session:
            return make_response(jsonify({"error": "No session found for the specified quarter"}), 404)

        goals = Goals.query.filter_by(
            employee_id=data['employee_id'], session_id=session.id).all()
        if not goals:
            return make_response(jsonify({"message": "No goals found for the specified employee and quarter"}), 200)

        result = goalsSchema.dump(goals, many=True)
        return make_response(jsonify(result), 200)

    @manager_required()
    def post(self):
        data = post_args.parse_args()

        new_goal = Goals(employee_id=data['employee_id'], name=data['name'],
                         description=data['description'], session_id=data['session_id'])
        db.session.add(new_goal)
        db.session.commit()

        result = goalsSchema.dump(new_goal)
        return make_response(jsonify(result), 201)

    @manager_required()
    def patch(self):
        data = get_args.parse_args()

        session = Session.query.filter_by(name=f"{data['quarter']}").first()
        if not session:
            return make_response(jsonify({"error": "No session found for the specified quarter"}), 404)

        goals = Goals.query.filter_by(
            employee_id=data['employee_id'], session_id=session.id).all()
        if not goals:
            return make_response(jsonify({"error": "No goals found for the specified employee and quarter"}), 404)

        update_data = patch_args.parse_args()
        for goal in goals:
            for key, value in update_data.items():
                setattr(goal, key, value)

        db.session.commit()

        result = goalsSchema.dump(goals, many=True)
        return make_response(jsonify(result), 200)

    @manager_required()
    def delete(self):
        data = get_args.parse_args()

        session = Session.query.filter_by(name=f"{data['quarter']}").first()
        if not session:
            return make_response(jsonify({"error": "No session found for the specified quarter"}), 404)

        goals = Goals.query.filter_by(
            employee_id=data['employee_id'], session_id=session.id).all()
        if not goals:
            return make_response(jsonify({"error": "No goals found for the specified employee and quarter"}), 404)

        for goal in goals:
            db.session.delete(goal)

        db.session.commit()

        return make_response(jsonify({"message": "Goals deleted successfully"}), 200)


api.add_resource(GoalsSessionResource, '/goals/session')
