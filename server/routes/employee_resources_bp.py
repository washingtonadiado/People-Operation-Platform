from flask import Blueprint, make_response, jsonify
from flask_restful import Api, Resource, abort
from flask_marshmallow import Marshmallow
from flask_jwt_extended import get_jwt_identity
from serializer import experienceSchema, goalsSchema

from models import db, Experience, Goals
from auth_middleware import employee_required

employee_resources_bp = Blueprint('employee_resources_bp', __name__)
ma = Marshmallow(employee_resources_bp)
api = Api(employee_resources_bp)




class EmployeeExperiences(Resource):
    @employee_required()
    def get(self):
        current_user = get_jwt_identity()
        experiences = Experience.query.filter_by(employee_id=current_user).all()
        if not experiences:
            abort(404, detail=f'You have no experiences')
        result = experienceSchema.dump(experiences, many=True)
        response = make_response(jsonify(result), 200)

        return response
    
api.add_resource(EmployeeExperiences, '/employee_experiences')

class EmployeeGoals(Resource):
    @employee_required()
    def get(self):
        current_user = get_jwt_identity()
        goals = Goals.query.filter_by(employee_id=current_user).all()
        if not goals:
            abort(404, detail=f'You have no goals')
        result = goalsSchema.dump(goals, many=True)
        response = make_response(jsonify(result), 200)

        return response

api.add_resource(EmployeeGoals, '/employee_goals')



