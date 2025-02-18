from datetime import datetime
from flask import Blueprint, make_response, jsonify
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from flask_restful import Api, Resource, abort, reqparse
from flask_marshmallow import Marshmallow
from serializer import remunerationDescriptionSchema

from models import db, RemunerationDescription
from auth_middleware import hr_required

remunerationDescription_bp = Blueprint('remunerationDescription_bp', __name__)
ma = Marshmallow(remunerationDescription_bp)
api = Api(remunerationDescription_bp)


post_args = reqparse.RequestParser()
post_args.add_argument('remuneration_id', type=str,
                       required=True, help='Remuneration ID is required')
post_args.add_argument('type', type=str, required=True,
                       help='Type of Remuneration is required')
post_args.add_argument('name', type=str, required=True,
                       help='Remuneration Name is required')
post_args.add_argument('description', type=str, required=True,
                       help='Remuneration Description is required')
post_args.add_argument('amount', type=str, required=True,
                       help='Remuneration Amount is required')


patch_args = reqparse.RequestParser()
patch_args.add_argument('remuneration_id', type=str)
patch_args.add_argument('type', type=str)
patch_args.add_argument('name', type=str)
patch_args.add_argument('description', type=str)
patch_args.add_argument('amount', type=str)


class RemunerationDescs(Resource):
    def get(self):
        remuneration_descs = RemunerationDescription.query.all()
        result = remunerationDescriptionSchema.dump(
            remuneration_descs, many=True)
        response = make_response(jsonify(result), 200)

        return response

    @hr_required()
    def post(self):
        data = post_args.parse_args()

        remuneration_id = data["remuneration_id"]
        type = data["type"]
        name = data["name"]
        description = data["description"]
        amount = data["amount"]

        new_remuneration_descs = RemunerationDescription(
            remuneration_id=remuneration_id, type=type, name=name, description=description, amount=amount)
        db.session.add(new_remuneration_descs)
        db.session.commit()

        result = remunerationDescriptionSchema.dump(new_remuneration_descs)
        response = make_response(jsonify(result), 201)

        return response


api.add_resource(RemunerationDescs, '/remuneration_descs')


class RemunerationDescById(Resource):
    def get(self, id):
        single_remuneration_desc = RemunerationDescription.query.filter_by(
            id=id).first()

        if not single_remuneration_desc:
            abort(
                404, detail=f'Remuneration Description with  id {id} does not exist')

        else:
            result = remunerationDescriptionSchema.dump(
                single_remuneration_desc)

            return result

    @hr_required()
    def patch(self, id):
        single_remuneration_desc = RemunerationDescription.query.filter_by(
            id=id).first()

        if not single_remuneration_desc:
            abort(
                404, detail=f'Remuneration Description with id {id} does not exist')

        data = patch_args.parse_args()

        for key, value in data.items():
            if value is None:
                continue
            setattr(single_remuneration_desc, key, value)
        db.session.commit()
        result = remunerationDescriptionSchema.dump(single_remuneration_desc)
        response = make_response(jsonify(result), 200)

        return response

    @hr_required()
    def delete(self, id):
        single_remuneration_desc = RemunerationDescription.query.filter_by(
            id=id).first()
        if not single_remuneration_desc:
            response_body = {"error": "Remuneration Description not found"}
            return make_response(response_body, 404)
        else:

            db.session.delete(single_remuneration_desc)
            db.session.commit()
            response_body = {
                "message": "Remuneration Description successfully deleted"}
            return make_response(response_body, 200)


api.add_resource(RemunerationDescById, '/remuneration_descs/<string:id>')
