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
    MAIL_USERNAME = "your_email@example.com"
    MAIL_PASSWORD = "your_email_password"
    MAIL_DEFAULT_SENDER = "your_email@example.com"