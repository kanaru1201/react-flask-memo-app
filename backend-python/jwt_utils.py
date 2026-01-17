# Standard Library
from datetime import datetime, timedelta
from functools import wraps
from zoneinfo import ZoneInfo

# Third Party Library
from flask import current_app, jsonify, request
import jwt

def generate_token(userid):
    """Generate JWT token."""
    jst_now = datetime.now(ZoneInfo("Asia/Tokyo"))
    payload = {
        'userid': userid,
        'iat': jst_now,
        'exp': jst_now + timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES']),
    }
    token = jwt.encode(
        payload,
        current_app.config['JWT_PRIVATE_KEY'],
        algorithm=current_app.config['JWT_ALGORITHM']
    )
    return token

def verify_token(token):
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_PUBLIC_KEY'],
            algorithms=[current_app.config['JWT_ALGORITHM']]
        )
        return payload
    except jwt.ExpiredSignatureError: 
        return "Token has expired"
    except jwt.InvalidTokenError:
        return "Invalid token"

def token_required(f):
    """Decorator to require JWT authentication for an endpoint."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Extract token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                # Expected format: "Bearer <TOKEN>"
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid Authorization header format'}), 401

        if not token:
            return jsonify({'error': 'Authentication token is required'}), 401

        # Verify the token using the public key
        payload = verify_token(token)
        if payload is None:
            return jsonify({'error': 'Invalid or expired token'}), 401

        # Inject userid into the request context for subsequent use
        request.userid = payload['userid']

        return f(*args, **kwargs)

    return decorated