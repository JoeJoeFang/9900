from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import jwt
import datetime
from functools import wraps
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/user/*": {"origins": "http://127.0.0.1:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SECRET_KEY'] = 'your_secret_key'  # 用于加密 JWT 的密钥
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# 用户模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

def create_default_user():
    # 检查是否已存在默认用户
    default_user = User.query.filter_by(email='default@example.com').first()
    if not default_user:
        # 创建默认用户
        hashed_password = bcrypt.generate_password_hash('default_password').decode('utf-8')
        default_user = User(email='default@example.com', password=hashed_password)
        db.session.add(default_user)
        db.session.commit()

# 注册路由
@app.route('/user/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully!'}), 201

# 登录路由
@app.route('/user/auth/login', methods=['POST'])
def login():
    #print(1)
    data = request.json

    if not data:
        print("Invalid request: Request body is empty")
        return jsonify({'message': 'Invalid request: Request body is empty'}), 400

    if 'email' not in data:
        print("Invalid request: Email is missing in request body")
        return jsonify({'message': 'Invalid request: Email is missing in request body'}), 400

    if 'password' not in data:
        return jsonify({'message': 'Invalid request: Password is missing in request body'}), 400

    #print(User.email, '111111111111111111')
    em = data['email']
    pas = data['password']

    user = User.query.filter_by(email=em).first()

    #print(1)
    if not user:
        print('User not found')
        return jsonify({'message': 'User not found'}), 401

    if bcrypt.check_password_hash(user.password, pas):
        token = jwt.encode({'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token': token.decode('UTF-8')})

    return jsonify({'message': 'Invalid credentials'}), 401

# 保护路由，需要验证 JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(*args, **kwargs)

    return decorated

# 一个受保护的路由示例，需要验证 JWT
@app.route('/protected')
@token_required
def protected():
    return jsonify({'message': 'This is a protected endpoint!'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        create_default_user()
    app.run(host='127.0.0.1', port=5005, debug=True)