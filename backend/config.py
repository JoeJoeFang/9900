import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key_here'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = "smtp.qq.com"
    MAIL_USE_SSL = True
    MAIL_USE_TLS = False
    MAIL_PORT = 465
    MAIL_USERNAME = "924082621@qq.com"
    MAIL_PASSWORD = "vyiubszzwbojbdic"
    MAIL_DEFAULT_SENDER = "924082621@qq.com"