from functools import wraps
from flask_jwt_extended import get_jwt
from flask_jwt_extended import verify_jwt_in_request
from flask import jsonify, make_response


def employee_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            try:
                if claims["is_employee"]:
                    return fn(*args, **kwargs)
            except KeyError:
                return make_response(jsonify(msg="employee only!"), 403)

        return decorator

    return wrapper


def manager_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            try:
                if claims["is_manager"]:
                    return fn(*args, **kwargs)
            except KeyError:
                return make_response(jsonify(msg="manager only!"), 403)

        return decorator

    return wrapper


def hr_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            try:
                if claims["is_hr"]:
                    return fn(*args, **kwargs)
            except KeyError:
                return make_response(jsonify(msg="Hr only!"), 403)

        return decorator

    return wrapper
