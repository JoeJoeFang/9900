from flask import Flask, request, jsonify, flash
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail, Message
import logging
from routes import bp as routes_blueprint
from models import db

app = Flask(__name__)

# 加载配置
app.config.from_object('config.Config')

# 初始化数据库
db.init_app(app)

# 初始化邮件扩展
mail = Mail(app)

# 初始化密码哈希扩展
bcrypt = Bcrypt(app)

# 设置 CORS 跨域
CORS(app, resources={r"/*": {"origins": "*"}})

# 注册蓝图
app.register_blueprint(routes_blueprint)



if __name__ == '__main__':
    with app.app_context():
        # db.drop_all()
        db.create_all()
        # create_default_user()
    mail.init_app(app)
    app.run(host='127.0.0.1', port=5005, debug=True)
    app.logger.setLevel(logging.DEBUG)