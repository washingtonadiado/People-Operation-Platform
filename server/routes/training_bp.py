from datetime import datetime
from flask import Blueprint, make_response, jsonify
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from flask_restful import Api, Resource, abort, reqparse
from models import Training, db
from serializer import trainingSchema
from auth_middleware import hr_required

training_bp = Blueprint('training_bp', __name__)
api = Api(training_bp)

post_args = reqparse.RequestParser()
post_args.add_argument('title', type=str, required=True,
                       help='Training title is required')
post_args.add_argument('description', type=str,
                       required=True, help='Description is required')
post_args.add_argument('start_date', type=str,
                       required=True, help='Start date is required')
post_args.add_argument('start_time', type=str,
                       required=True, help='Start time is required')
post_args.add_argument('end_date', type=str, required=True,
                       help='End date is required')
post_args.add_argument('end_time', type=str, required=True,
                       help='End time is required')

patch_args = reqparse.RequestParser()
patch_args.add_argument('title', type=str, help='Training title')
patch_args.add_argument('description', type=str, help='Description')
patch_args.add_argument('start_date', type=str, help='Start date')
patch_args.add_argument('start_time', type=str, help='Start time')
patch_args.add_argument('end_date', type=str, help='End date')
patch_args.add_argument('end_time', type=str, help='End time')


class TrainingsResource(Resource):
    def get(self):
        trainings = Training.query.all()
        result = trainingSchema.dump(trainings, many=True)
        return make_response(jsonify(result), 200)

    @hr_required()
    def post(self):
        data = post_args.parse_args()

        # error handling
        training = Training.query.filter_by(title=data.title).first()
        if training:
            return make_response(jsonify({"error": "Training with the same title already exists"}), 409)

        start_date = datetime.strptime(data["start_date"], "%Y-%m-%d")
        end_date = datetime.strptime(data["end_date"], "%Y-%m-%d")
        start_time = datetime.strptime(data["start_time"], "%H:%M:%S").time()
        end_time = datetime.strptime(data["end_time"], "%H:%M:%S").time()

        new_training = Training(title=data['title'], description=data['description'], start_date=start_date,
                                start_time=start_time, end_date=end_date, end_time=end_time)
        db.session.add(new_training)
        db.session.commit()

        result = trainingSchema.dump(new_training)
        return make_response(jsonify(result), 201)


api.add_resource(TrainingsResource, '/trainings')


class TrainingById(Resource):
    def get(self, id):
        single_training = Training.query.filter_by(id=id).first()

        if not single_training:
            return make_response(jsonify({"error": f"Training with id {id} does not exist"}), 404)

        else:
            result = trainingSchema.dump(single_training)
            return make_response(jsonify(result), 200)

    @hr_required()
    def delete(self, id):
        single_training = Training.query.filter_by(id=id).first()

        if not single_training:
            return make_response(jsonify({"error": f"Training with id {id} does not exist"}), 404)

        db.session.delete(single_training)
        db.session.commit()

        return make_response(jsonify({"message": f"Training with id {id} has been deleted"}), 200)

    @hr_required()
    def patch(self, id):
        single_training = Training.query.filter_by(id=id).first()

        if not single_training:
            return make_response(jsonify({"error": f"Training with id {id} does not exist"}), 404)

        data = patch_args.parse_args()
        # strip date
        if 'start_date' in data:
            data['start_date'] = datetime.strptime(
                data["start_date"], "%Y-%m-%d")
        if 'end_date' in data:
            data['end_date'] = datetime.strptime(data["end_date"], "%Y-%m-%d")
        # strip time
        if 'start_time' in data:
            data['start_time'] = datetime.strptime(
                data["start_time"], "%H:%M:%S").time()
        if 'end_time' in data:
            data['end_time'] = datetime.strptime(
                data["end_time"], "%H:%M:%S").time()

        for key, value in data.items():
            if value is None:
                continue
            setattr(single_training, key, value)
        db.session.commit()

        result = trainingSchema.dump(single_training)
        return make_response(jsonify(result), 200)


api.add_resource(TrainingById, '/trainings/<string:id>')
