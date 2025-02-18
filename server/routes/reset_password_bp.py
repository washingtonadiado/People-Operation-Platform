from datetime import datetime
from flask import Blueprint,request,make_response,jsonify
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse,abort
from flask_jwt_extended import jwt_required,get_jwt_identity,current_user, get_jwt
from flask_bcrypt import Bcrypt
from models import db,Employee, Manager, HR_Personel


change_password_bp=Blueprint('change_password_bp',__name__)
ma=Marshmallow(change_password_bp)
api=Api(change_password_bp)
bcrypt = Bcrypt()
 

change_password_args=reqparse.RequestParser()
change_password_args.add_argument('currentPassword',type=str, required=True)
change_password_args.add_argument('newPassword',type=str, required=True)
change_password_args.add_argument('confirmPassword',type=str, required=True)

forgot_password_args=reqparse.RequestParser()
forgot_password_args.add_argument('email',type=str, required=True)
forgot_password_args.add_argument('newPassword',type=str, required=True)
forgot_password_args.add_argument('confirmPassword',type=str, required=True)
forgot_password_args.add_argument('role',type=str, required=True)


class ChangePassword(Resource):
    @jwt_required()
    def post(self):
        data = change_password_args.parse_args()
        claims = get_jwt()
        print(claims)
        
        current_user = get_jwt_identity()
        if claims['role']=='employee':
            employee = Employee.query.filter_by(id=current_user).first()

            if not employee:
                abort(404, detai="employee not found")

            if not bcrypt.check_password_hash(employee.password, data["currentPassword"]):
                return abort(401, detail="Incorrect current password")
            
            if data["newPassword"] != data["confirmPassword"]:
                return abort(422, detail="New password and confirm password do not match")
            hashed_password = bcrypt.generate_password_hash(data["newPassword"]).decode('utf-8')
            
            employee.password = hashed_password

            db.session.commit()

            return {'detail': 'Password has been changed successfully'}

        elif claims['role']=='manager':
            manager= Manager.query.filter_by(id=current_user).first()

            if not manager:
                abort(404, detai="manager not found")
            
            if not bcrypt.check_password_hash(manager.password, data["currentPassword"]):
                return abort(401, detail="Incorrect current password")
            
            if data["newPassword"] != data["confirmPassword"]:
                return abort(422, detail="New password and confirm password do not match")
            hashed_password = bcrypt.generate_password_hash(data["newPassword"]).decode('utf-8')
            
            manager.password = hashed_password

            db.session.commit()

            return {'detail': 'Password has been changed successfully'}

        elif claims['role']=='hr':
            
            hr = HR_Personel.query.filter_by(id=current_user).first()
            
            if not hr:
                abort(404, detai="hr not found")
            
            if not bcrypt.check_password_hash(hr.password, data["currentPassword"]):
                return abort(401, detail="Incorrect current password")
            
            if data["newPassword"] != data["confirmPassword"]:
                return abort(422, detail="New password and confirm password do not match")
            hashed_password = bcrypt.generate_password_hash(data["newPassword"]).decode('utf-8')
            
            hr.password = hashed_password

            db.session.commit()

            return {'detail': 'Password has been changed successfully'}

        else:
            return abort(404, detail='Invalid Role')


api.add_resource(ChangePassword, '/change_password')

class ForgotPassword(Resource):
    def post(self):
        data = forgot_password_args.parse_args()
        role = data['role']
        if role == 'employee':
            employee = Employee.query.filter_by(email=data['email']).first()

            if not employee:
                abort(404, detai="employee not found")
            
            if data["newPassword"] != data["confirmPassword"]:
                return abort(422, detail="New password and confirm password do not match")
            hashed_password = bcrypt.generate_password_hash(data["newPassword"]).decode('utf-8')
            
            employee.password = hashed_password

            db.session.commit()

            return {'detail': 'Password has been changed successfully'}

        elif role == "manager":
            manager= Manager.query.filter_by(email=data['email']).first()

            if not manager:
                abort(404, detai="manager not found")
            
            if data["newPassword"] != data["confirmPassword"]:
                return abort(422, detail="New password and confirm password do not match")
            hashed_password = bcrypt.generate_password_hash(data["newPassword"]).decode('utf-8')
            
            manager.password = hashed_password

            db.session.commit()

            return {'detail': 'Password has been changed successfully'}

        elif role == "hr":
            hr = HR_Personel.query.filter_by(email=data['email']).first()

            if not hr:
                abort(404, detai="hr not found")
            
            if data["newPassword"] != data["confirmPassword"]:
                return abort(422, detail="New password and confirm password do not match")
            hashed_password = bcrypt.generate_password_hash(data["newPassword"]).decode('utf-8')
            
            hr.password = hashed_password

            db.session.commit()

            return {'detail': 'Password has been changed successfully'}

        else:
            return abort(404, detail='Invalid Role')


api.add_resource(ForgotPassword, '/forgot_password')

