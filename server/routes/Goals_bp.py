from flask import Blueprint, make_response, jsonify
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from flask_restful import Api, Resource, abort, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Goals, db
from serializer import goalsSchema

goals_bp = Blueprint('goals_bp', __name__)
api = Api(goals_bp)

post_args = reqparse.RequestParser()
post_args.add_argument('name', type=str, required=True,
                       help='Goal name is required')
post_args.add_argument('description', type=str,
                       required=True, help='Description is required')
post_args.add_argument('session_id', type=str,
                       required=True, help='Session ID is required')
post_args.add_argument('manager_id', type=str, required=True, help='Manager ID is required')

patch_args = reqparse.RequestParser()
patch_args.add_argument('employee_id', type=str, help='Employee ID')
patch_args.add_argument('name', type=str, help='Goal name')
patch_args.add_argument('description', type=str, help='Description')
patch_args.add_argument('session_id', type=str, help='Session ID')


class GoalsResource(Resource):
    def get(self):
        goals = Goals.query.all()
        result = goalsSchema.dump(goals, many=True)
        return make_response(jsonify(result), 200)

    @jwt_required()
    def post(self):
        data = post_args.parse_args()
        print("Received data:", data)
        current_user = get_jwt_identity()
    

        # error handling
        goal = Goals.query.filter_by(name=data['name']).first()
        if goal:
            return make_response(jsonify({"error": "Goal with the same name already exists"}), 409)

        new_goal = Goals(
            employee_id=current_user,
            manager_id=data['manager_id'],  
            name=data['name'],
            description=data['description'],
            session_id=data['session_id']
        )
        db.session.add(new_goal)
        db.session.commit()

        result = goalsSchema.dump(new_goal)
        return make_response(jsonify(result), 201)


api.add_resource(GoalsResource, '/goals')


class GoalById(Resource):
    def get(self, id):
        single_goal = Goals.query.filter_by(id=id).first()

        if not single_goal:
            return make_response(jsonify({"error": f"Goal with id {id} does not exist"}), 404)

        else:
            result = goalsSchema.dump(single_goal)
            return make_response(jsonify(result), 200)

    @jwt_required()
    def delete(self, id):
        single_goal = Goals.query.filter_by(id=id).first()

        if not single_goal:
            return make_response(jsonify({"error": f"Goal with id {id} does not exist"}), 404)

        db.session.delete(single_goal)
        db.session.commit()

        return make_response(jsonify({"message": f"Goal with id {id} has been deleted"}), 200)

    @jwt_required()
    def patch(self, id):
        single_goal = Goals.query.filter_by(id=id).first()

        if not single_goal:
            return make_response(jsonify({"error": f"Goal with id {id} does not exist"}), 404)

        data = patch_args.parse_args()
        for key, value in data.items():
            if value is None:
                continue
            setattr(single_goal, key, value)
        db.session.commit()

        result = goalsSchema.dump(single_goal)
        return make_response(jsonify(result), 200)


api.add_resource(GoalById, '/goals/<string:id>')