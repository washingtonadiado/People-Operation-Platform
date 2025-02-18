from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Enum
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
import uuid

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)


def generate_uuid():
    return str(uuid.uuid4())


class Documents(db.Model):
    __tablename__ = 'documents'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    employee_id = db.Column(db.String, db.ForeignKey(
        'employees.id'), nullable=False)
    link_url = db.Column(db.String)
    name = db.Column(db.String, nullable=False)

    type = db.Column(Enum("official", "institution", "other"), nullable=False)


class Employee(db.Model):
    __tablename__ = 'employees'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    email = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    personal_no=db.Column(db.String(10),unique=True,nullable=False)
    dept_id = db.Column(db.String, db.ForeignKey(
        'departments.id'), nullable=False)
    employee_profiles = db.relationship('EmployeeProfile', backref='employee')
    remunerations = db.relationship('Remuneration', backref='employee')
    experiences = db.relationship('Experience', backref='employee')
    goals = db.relationship('Goals', backref='employee')
    employee_trainings = db.relationship(
        'EmployeeTraining', backref='employee')
    leaves = db.relationship('Leave', backref='employee')
    leave_approvals = db.relationship('LeaveApproval', backref='employee')
    documents = db.relationship('Documents', backref='employee')
    educations = db.relationship('Education', backref='employee')


class Manager(db.Model):
    __tablename__ = 'managers'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    email = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    personal_no=db.Column(db.String(10),unique=True,nullable=False)
    dept_id = db.Column(db.String, db.ForeignKey(
        'departments.id'), nullable=False)
    leave_approvals = db.relationship('LeaveApproval', backref='manager')
    manager_profile = db.relationship(
        'ManagerProfile', backref='manager')
    overseen_goals = db.relationship('Goals', backref='manager')


class Department(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    name = db.Column(db.String, nullable=False)
    dept_head = db.relationship('Manager', backref='department')
    employees = db.relationship('Employee', backref='department')
    hr_personnels = db.relationship('HR_Personel', backref='department')


class HR_Personel(db.Model):
    __tablename__ = 'hr_personnels'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    email = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    personal_no=db.Column(db.String(10),unique=True,nullable=False)
    dept_id = db.Column(db.String, db.ForeignKey(
        'departments.id'), nullable=False)
    leave_approvals = db.relationship('LeaveApproval', backref='hr_personnel')
    hr_profiles = db.relationship('HrProfile', backref='hr_personnel')


class EmployeeProfile(db.Model):
    __tablename__ = 'employee_profiles'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    date_of_birth = db.Column(db.Date, nullable=False)
    employee_id = db.Column(db.String, db.ForeignKey(
        'employees.id'), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
  
    mantra = db.Column(db.String, nullable=False)
    phone_contact = db.Column(db.Integer, nullable=False)
    profile_photo = db.Column(db.String, nullable=False)
    title = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)


class ManagerProfile(db.Model):
    __tablename__ = 'manager_profiles'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    date_of_birth = db.Column(db.Date, nullable=False)
    manager_id = db.Column(db.String, db.ForeignKey(
        'managers.id'), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    
    mantra = db.Column(db.String(), nullable=False)
    phone_contact = db.Column(db.Integer, nullable=False)
    profile_photo = db.Column(db.String(), nullable=False)
    title = db.Column(db.String(), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)


class HrProfile(db.Model):
    __tablename__ = 'hr_profiles'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    date_of_birth = db.Column(db.Date, nullable=False)
    hr_id = db.Column(db.String, db.ForeignKey(
        'hr_personnels.id'), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
   
    mantra = db.Column(db.String, nullable=False)
    phone_contact = db.Column(db.Integer, nullable=False)
    profile_photo = db.Column(db.String(), nullable=False)
    title = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)


class Remuneration(db.Model):
    __tablename__ = 'remunerations'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    name = db.Column(db.String(30), nullable=False)
    salary = db.Column(db.Float, nullable=False)
    employee_id = db.Column(db.String, db.ForeignKey(
        'employees.id'), nullable=False)
    remuneration_date = db.Column(db.DateTime, default=datetime.utcnow)
    remunerations = db.relationship(
        'RemunerationDescription', backref='remuneration')


class RemunerationDescription(db.Model):
    __tablename__ = 'remuneration_descriptions'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    remuneration_id = db.Column(db.String, db.ForeignKey(
        'remunerations.id'), nullable=False)
    type = db.Column(
        Enum("deduction", "bonus", "allowance", "normal"), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)


class Experience(db.Model):
    __tablename__ = 'experiences'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    employee_id = db.Column(db.String, db.ForeignKey(
        'employees.id'), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    job_title = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)


class Session(db.Model):
    __tablename__ = 'sessions'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    name = db.Column(db.String(30), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    goals = db.relationship('Goals', backref="session")


class Goals(db.Model):
    __tablename__ = 'goals'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    employee_id = db.Column(db.String, db.ForeignKey(
        'employees.id'), nullable=False)
    manager_id = db.Column(db.String, db.ForeignKey('managers.id'), nullable=True, default='default_manager_id')
    name = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String, nullable=False)
    session_id = db.Column(db.String, db.ForeignKey(
        'sessions.id'), nullable=False)


class Training(db.Model):
    __tablename__ = 'trainings'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    title = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    trainings = db.relationship('EmployeeTraining', backref='training')


class EmployeeTraining(db.Model):
    __tablename__ = 'employee_trainings'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    employee_id = db.Column(db.String, db.ForeignKey(
        'employees.id'), nullable=False)
    training_id = db.Column(db.String, db.ForeignKey(
        'trainings.id'), nullable=False)


class Leave(db.Model):
    __tablename__ = 'leaves'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    employee_id = db.Column(db.String, db.ForeignKey(
        'employees.id'), nullable=False)
    description = db.Column(db.String, nullable=False)
    approved = db.Column(db.Boolean, default=False)
    leave_approval = db.relationship(
        'LeaveApproval', backref='leave', lazy=True)


class LeaveApproval(db.Model):
    __tablename__ = 'leave_approvals'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    leave_id = db.Column(db.String, db.ForeignKey('leaves.id'), nullable=False)
    employee_id = db.Column(db.String, db.ForeignKey(
        'employees.id'), nullable=False)
    manager_id = db.Column(db.String, db.ForeignKey(
        'managers.id'))
    hr_id = db.Column(db.String, db.ForeignKey(
        'hr_personnels.id'))
    approved_by_manager = db.Column(db.Boolean, default=False)
    approved_by_hr = db.Column(db.Boolean, default=False)
    manager_app_date = db.Column(db.DateTime, nullable=True)
    hr_approval_date = db.Column(db.DateTime, nullable=True) 


class Education(db.Model):
    __tablename__ = 'educations'
    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    employee_id = db.Column(db.String, db.ForeignKey(
        'employees.id'), nullable=False)
    institution = db.Column(db.String, nullable=False)
    course = db.Column(db.String, nullable=False)
    qualification = db.Column(db.String, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)


# for handling Tokens

class TokenBlocklist(db.Model):
    __tablename__ = 'tokenblocklist'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)
