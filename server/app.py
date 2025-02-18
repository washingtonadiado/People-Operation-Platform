from routes.payslip_bp import payslip_bp
from routes.sessionGoals_bp import goals_session_bp
from routes.user_authentication_bp import authentication_bp
from routes.employee_profile_bp import employeeProfile_bp
from routes.experience_bp import experience_bp
from routes.remuneration_desc_bp import remunerationDescription_bp
from routes.remuneration_bp import remuneration_bp
from routes.hrProfile_bp import hrProfile_bp
from routes.leave_approval_bp import leave_approval_bp
from routes.employee_training_bp import employee_training_bp
from routes.employee_resources_bp import employee_resources_bp
from routes.training_bp import training_bp
from routes.Goals_bp import goals_bp
from routes.session_bp import session_bp
from routes.leave_bp import leave_bp
from routes.manager_profile_bp import manager_profile_bp
from routes.hr_bp import hr_bp
from routes.manager_bp import manager_bp
from routes.education_bp import education_bp
from routes.department_bp import department_bp
from routes.documents_bp import document_bp
from routes.employee_bp import employee_bp
from routes.approveLeave_bp import approvalLeave_bp
from routes.reset_password_bp import change_password_bp
from datetime import datetime, timedelta
from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models import db,Employee,Manager,HR_Personel
from dotenv import load_dotenv
import os
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from models import TokenBlocklist
from flask_mail import Mail



bcrypt = Bcrypt()
mail = Mail()


def create_app():
    app = Flask(__name__)
    bcrypt.init_app(app)
    load_dotenv()
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'SQLALCHEMY_DATABASE_URI')
    app.config['JWT_SECRET_KEY'] = os.getenv(
        'JWT_SECRET_KEY')
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

    # Flask-Mail configuration
    app.config['MAIL_SERVER']='smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = 'tedtedmike@gmail.com' 
    app.config['MAIL_PASSWORD'] = 'oupm zifw bhqj yadp'  
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True

    mail.init_app(app)
    app.mail = mail

    cloudinary_url = os.getenv('CLOUDINARY_URL')
    cloudinary_cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    cloudinary_api_key = os.getenv('CLOUDINARY_API_KEY')
    cloudinary_api_secret = os.getenv('CLOUDINARY_API_SECRET')

    app.config['CLOUDINARY_URL'] = cloudinary_url
    app.config['CLOUDINARY_CLOUD_NAME'] = cloudinary_cloud_name
    app.config['CLOUDINARY_API_KEY'] = cloudinary_api_key
    app.config['CLOUDINARY_API_SECRET'] = cloudinary_api_secret
    migrate = Migrate(app, db)
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    @jwt.token_in_blocklist_loader
    def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
        jti = jwt_payload["jti"]
        token = db.session.query(TokenBlocklist).filter_by(jti=jti).first()
        return token is not None
    
 

    app.register_blueprint(employee_bp)
    app.register_blueprint(department_bp)
    app.register_blueprint(education_bp)
    app.register_blueprint(document_bp)
    app.register_blueprint(hr_bp)
    app.register_blueprint(manager_bp)
    app.register_blueprint(manager_profile_bp)
    app.register_blueprint(leave_bp)
    app.register_blueprint(session_bp)
    app.register_blueprint(goals_bp)
    app.register_blueprint(training_bp)
    app.register_blueprint(employee_training_bp)
    app.register_blueprint(leave_approval_bp)
    app.register_blueprint(hrProfile_bp)
    app.register_blueprint(remuneration_bp)
    app.register_blueprint(remunerationDescription_bp)
    app.register_blueprint(experience_bp)
    app.register_blueprint(employeeProfile_bp)
    app.register_blueprint(authentication_bp)
    app.register_blueprint(goals_session_bp)
    app.register_blueprint(payslip_bp)
    app.register_blueprint(approvalLeave_bp)
    app.register_blueprint(change_password_bp)
    app.register_blueprint(employee_resources_bp)


    return app



app = create_app()
