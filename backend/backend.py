from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import jwt
import datetime
from functools import wraps
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
import os
import base64
from PIL import Image
import io
from sqlalchemy import JSON
#from sqlalchemy.dialects.postgresql import JSON
from flask_wtf import FlaskForm
from sqlalchemy.testing.pickleable import User
from wtforms import Form, StringField, RadioField, SubmitField
from wtforms.validators import DataRequired
from flask import current_app
from sqlalchemy import or_, and_
from flask import render_template, request, session, redirect, url_for
from flask_mail import Mail, Message
from sqlalchemy.orm.attributes import flag_modified
from collections import defaultdict
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
#db = SQLAlchemy(app)
HOSTNAME = '127.0.0.1'
PORT = 3306
USERNAME = 'root'
PASSWORD = '924082621'
DATABASE = '9900_learn'
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}?charset=utf8mb4"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # 关闭追踪修改，提升性能\
app.config['SECRET_KEY'] = 'your_secret_key_here'
current_directory = os.path.dirname(os.path.abspath(__file__))
pic_folder = os.path.join(current_directory, 'PIC')
#app.config['PIC_FLODER'] = pic_folder

app.config['MAIL_SERVER'] = "smtp.qq.com"
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = "924082621@qq.com"
app.config['MAIL_PASSWORD'] = "" #vyiubszzwbojbdic
app.config['MAIL_DEFAULT_SENDER'] = "924082621@qq.com"

db = SQLAlchemy(app)
mail = Mail(app)
bcrypt = Bcrypt(app)
mail.init_app(app)

class Host(db.Model):
    __tablename__ = "host"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(80),nullable=False)
    companyName = db.Column(db.String(20), nullable=False)
    from_time = db.Column(db.String(10), nullable=True)
    to_time = db.Column(db.String(10), nullable=True)
    datentime = db.Column(db.String(30), nullable=True)
    street = db.Column(db.String(100), nullable=True)
    suburb = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    post_code = db.Column(db.String(10), nullable=True)
    description = db.Column(db.String(1000), nullable=True)
    #last_update = db.Column(db.DateTime, default=datetime.now)

class Customer(db.Model):
    __tablename__ = "customer"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(160),nullable=False)
    name = db.Column(db.String(20), nullable=False)
    cvc = db.Column(db.String(20), nullable=False)
    duedate = db.Column(db.String(20), nullable=True)
    from_time = db.Column(db.String(10), nullable=True)
    to_time = db.Column(db.String(10), nullable=True)
    datentime = db.Column(db.String(30), nullable=True)
    street = db.Column(db.String(100), nullable=True)
    suburb = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    post_code = db.Column(db.String(10), nullable=True)
    cardNumber = db.Column(db.String(100), nullable=True)
    wallet = db.Column(db.Integer, nullable=True)
    order = db.Column(JSON, nullable=True)
    #last_update = db.Column(db.DateTime, default=datetime.now)

class Events(db.Model):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hostId = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(100), nullable=True)
    price = db.Column(db.Integer, nullable=True)
    organizername = db.Column(db.String(100), nullable=True)
    type = db.Column(db.String(100), nullable=True)
    seats = db.Column(db.String(100), nullable=True)
    duration = db.Column(db.Integer, nullable=True)
    from_time = db.Column(db.String(10), nullable=True)
    to_time = db.Column(db.String(10), nullable=True)
    description = db.Column(db.String(100), nullable=True)
    URL = db.Column(db.String(100), nullable=True)
    thumbnail = db.Column(db.String(5000), nullable=True)
    #last_update = db.Column(db.DateTime, default=datetime.now)

    @staticmethod
    def get_events_search(keyword, type, page=1):
        events = Events.query
        if type != 'None':  # 活动类型
            events = Events.query.filter(Events.type == type)
        if keyword:  # 允许多个空格分隔的搜索关键字
            keywords = keyword.split()
            for k in keywords:
                events = events.filter(Events.title.like('%' + k + '%'))
        return events.paginate(page=page, per_page=30, error_out=False)  # 把query构建好了，用paginate分页取回活动

class EventSearchForm(Form):        # 表单类创建了需要的field并赋值
    keyword = StringField('Keyword')        # 关键词输入
    type = RadioField('Event Type')         # 活动类型
    submit = SubmitField('Search')          # 搜索

    def __init__(self, *args, **kwargs):
        super(EventSearchForm, self).__init__(*args, **kwargs)
        # 为单选钮赋默认值
        events = Events.query.all()
        self.type.choices = [(event.id, event.title, event.description) for event in events]


@app.route('/user/search', methods=['GET', 'POST']) # 在View里面添加处理逻辑
def events_search():
    form = EventSearchForm()
    page = request.args.get('page', 1, type=int)
    if request.method == 'POST':
        # 在分页浏览中使用session保存搜索条件；每次POST，添加查询字符串，取回第一页
        session['event-keyword'] = form.keyword.data
        session['event-type'] = form.type.data
        page = 1
    pagination = Events.get_events_search(
        session.get('event-keyword', ""),
        session.get('event-type', 'None'),
        page
    )
    events = pagination.items
    events_json = [{
        'id': event.id,
        'title': event.title,
        'address': event.address,
        'price': event.price,
        'thumbnail': event.thumbnail,
        'organizerName': event.organizername,
        'eventType': event.type,
        'seatingCapacity': event.seats,
        'duration': event.duration,
        'startDate': event.from_time,
        'endDate': event.to_time,
        'description': event.description,
        'youtubeUrl': event.URL
        # 添加其他需要的字段
    } for event in events]

    response = {
        'events': events_json,
        'total': pagination.total,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'total_pages': pagination.pages
    }
    return jsonify(response)

class Events_order(db.Model):
    __tablename__ = "events_order"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eventtitle = db.Column(db.String(20), nullable=False)
    orderdetails = db.Column(JSON, nullable=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('customer.id'))

class Myevents(db.Model):
    __tablename__ = "myevents"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event = db.Column(db.String(50), nullable=False)
    host = db.Column(db.String(50), nullable=False)

class Comments(db.Model):
    __tablename__ = "comments"
    eventId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    comment = db.Column(JSON, nullable=True)

@app.route("/user/list")
def delete():
    want_del_id = request.args.get("delete", default=1, type=int)
    query_id = Host.query.filter_by(id=want_del_id).first()
    if not query_id:
        return "message:User not found"
    db.session.delete(query_id)
    db.session.commit()
    return f"message: The user with id {id} was removed from the database!"

@app.route("/user/add")
def add_user():
    user1 = Host(email="刘畅", password="924082621")
    db.session.add(user1)
    db.session.commit()
    return "用户创建成功！"

def add_users():
    user1 = Host(email="刘畅", password="924082621")
    db.session.add(user1)
    db.session.commit()
    return user1

def image_to_base64(image_path):
    # 使用 Pillow 打开图片
    with Image.open(image_path) as image:
        # 将图片转换为二进制数据
        buffered = io.BytesIO()
        image.save(buffered, format=image.format)
        # 将二进制数据编码为 Base64 字符串
        img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str

@app.route('/events', methods=['GET'])
def get_events():
    # 查询数据库以获取事件列表
    events = Events.query.all()

    # 将查询到的事件列表转换为 JSON 格式
    event_list = []
    for event in events:
        event_data = {
            'id': event.id,
            'title': event.title,
            'address': event.address,
            'price': event.price,
            'thumbnail': event.thumbnail,
            'organizerName': event.organizername,
            'eventType': event.type,
            'seatingCapacity': event.seats,
            'duration': event.duration,
            'startDate': event.from_time,
            'endDate': event.to_time,
            'description': event.description,
            'youtubeUrl':event.URL
        }
        #image_path = event.thumbnail
        #base64_str = image_to_base64(image_path)
        #event_data['thumbnail'] = base64_str
        event_list.append(event_data)
    #print("fanhui", event_list)
    # 使用 jsonify 函数将 JSON 格式的事件列表返回给前端
    return jsonify(event_list), 201



@app.route('/events/search', methods=['GET'])
def search_events():
    keyword = request.args.get('keyWord', '')
    event_type = request.args.get('eventType', None)
    query = Events.query

    if event_type and event_type.lower() != 'none':
        query = query.filter(Events.type == event_type)

    events = query.all()
    event_list = []

    for event in events:
        # Check if the keyword is in any of the relevant fields
        if keyword.lower() in event.title.lower() or keyword.lower() in event.description.lower() or keyword.lower() in event.type.lower():
            event_data = {
                'id': event.id,
                'title': event.title,
                'address': event.address,
                'price': event.price,
                'thumbnail': event.thumbnail,
                'organizerName': event.organizername,
                'eventType': event.type,
                'seatingCapacity': event.seats,
                'duration': event.duration,
                'startDate': event.from_time,
                'endDate': event.to_time,
                'description': event.description,
                'youtubeUrl': event.URL
            }
            event_list.append(event_data)

    return jsonify(event_list), 200


@app.route('/events/title', methods=['GET'])
def get_events_title():
    # 查询数据库以获取事件列表
    events = Events.query.all()
    # 将查询到的事件列表转换为 JSON 格式
    event_list = []
    for event in events:
        event_data = {
            # 'id': event.id,
            'title': event.title,
            # 'address': event.address,
            # 'price': event.price,
            # 'thumbnail': event.thumbnail,
            # 'organizerName': event.organizername,
            # 'eventType' : event.type,
            # 'seatingCapacity' :event.seats,
            # 'duration' : event.duration,
            # 'startDate': event.from_time,
            # 'endDate': event.to_time,
            # 'description': event.description,
            # 'youtubeUrl':event.URL
        }
        event_list.append(event_data)
    #print("fanhui", event_list)
    return jsonify(event_list)

@app.route('/events/host/<int:userId>', methods=['GET'])
def get_host_events(userId):
    events = Events.query.filter_by(hostId=userId)
    event_list = []
    for event in events:
        event_data = {
            'id': event.id,
            'hostId': event.hostId,
            'title': event.title,
            'address': event.address,
            'price': event.price,
            'organizerName': event.organizername,
            'eventType': event.type,
            'seatingCapacity': event.seats,
            'duration': event.duration,
            'startDate': event.from_time,
            'endDate': event.to_time,
            'description': event.description,
            'youtubeUrl': event.URL,
            'thumbnail': event.thumbnail
        }
        event_list.append(event_data)
    return jsonify(event_list)


@app.route('/events/<int:eventId>', methods=['GET'])
def get_events_details(eventId):
    # 查询数据库以获取事件列表
    #print(1111111111)
    print(eventId)
    event = Events.query.filter_by(id=eventId).first()
    event_order = Events_order.query.filter_by(id=eventId).first()
    # 将查询到的事件列表转换为 JSON 格式
    print("if not event_order or not event:")
    print(event, event_order)
    if not event_order or not event:
        return jsonify({'message': 'Event not found!!!!!'}), 404
    print("if not event_order or not event: enddddddd")
    event_data = {
        'id': event.id,
        'title': event.title,
        'address': event.address,
        'price': event.price,
        'thumbnail': event.thumbnail,
        'organizerName': event.organizername,
        'eventType' : event.type,
        'seatingCapacity' :event.seats,
        'duration' : event.duration,
        'startDate': event.from_time,
        'endDate': event.to_time,
        'description': event.description,
        'youtubeUrl':event.URL,
        'orderdetails': event_order.orderdetails
    }
    print("finish", event_data)
    return jsonify(event_data)

@app.route('/bookings', methods=['PUT'])
def update_events_bookings():
    # 查询数据库以获取事件列表s
    data = request.get_json()
    #print(data)
    cust_id = data['userId']
    date_ = data['Date']
    seat_number = data['seat']
    eventid = data['eventId']
    cust = Customer.query.filter_by(id=cust_id).first()
    event = Events_order.query.filter_by(id=eventid).first()
    events = Events.query.filter_by(id=eventid).first()
    if not event:
        return jsonify({'message': 'Event not found!'}), 404
    if not cust:
        return jsonify({'message': 'Customer not found!'}), 404
    if cust.order is None:
        cust.order = {}
    cust.order[event.id] = date_
    print(events)
    flag_modified(cust, "order")
    db.session.commit()


    event_d = event.orderdetails
    if date_ in event_d:
        for i in seat_number:
            print(event_d[date_])
            event_d[date_][i] = [1, cust_id]
            cust.wallet -= events.price
            print(event_d[date_])
            event.orderdetails = event_d
            print(event.orderdetails)
        flag_modified(event, "orderdetails")
        db.session.commit()
        order_data = {
            'id': event.id,
            'eventtitle': event.eventtitle,
            'orderdetails': event.orderdetails
        }
        print(cust.email)
        # message = Message(subject="Ticket", recipients=[cust.email], body="Order successfully!!")
        # mail.send(message)
        return jsonify({'message': 'Create order successfully!', 'event': order_data}), 201
    return jsonify({'message': 'Failed to update event details!'}), 400


@app.route('/bookings/<int:userId>/recommendation', methods=['GET'])  # 推荐系统
def get_recommendation(userId):
    # （思路：
    # 查询用户购买的活动，找到活动类型
    # 查询所有活动列表
    # 使用用户购买过的活动的类型来过滤活动列表
    # 返回过滤后的活动列表
    # 如果用户之前没有购买过任何活动，则显示两个未开始活动）
    # 最后的获取结果应该除开已经购买的活动
    # 如果活动列表中已购活动没有其他同类型的活动，推荐应返回空
    # 现在的问题是：前端功能显示返回了所有的活动，后端代码中的过滤不起作用
    app.logger.info(f"Fetching recommendations for user: {userId}")
    # 查询用户的订单信息
    user_orders = Events_order.query.filter_by(user_id=userId).all()
    # 存储每个活动类型的频次
    event_type_frequency = defaultdict(int)
    # 从用户订单中排除已购买的活动ID
    purchased_event_ids = {order.event_id for order in user_orders}
    if user_orders:
        # 统计每种类型活动的购买次数
        for order in user_orders:
            event = Events.query.get(order.event_id)
            if event:  # 确保找到了对应的活动
                event_type_frequency[event.type] += 1
        # 找到用户最常参加的活动类型
        favorite_event_type = max(event_type_frequency, key=event_type_frequency.get)
        # 获取推荐活动列表
        recommended_events = Events.query.filter(
            Events.type == favorite_event_type,
            Events.id.notin_(purchased_event_ids),
            Events.from_time > datetime.now()
        ).order_by(Events.from_time).all()
        if not recommended_events:  # 如果没有其他同类型的活动可推荐，则返回空列表
            app.logger.info(f"No recommended events found for favorite type '{favorite_event_type}' for user: {userId}")
            return jsonify([])
    else:
        # 对于没有购买记录的用户，推荐即将举行且未购买的活动
        recommended_events = Events.query.filter(
            Events.id.notin_(purchased_event_ids),
            Events.from_time > datetime.now()
        ).order_by(Events.from_time).limit(2).all()
        if not recommended_events:  # 如果没有活动可以推荐，则返回空列表
            app.logger.info(f"No upcoming events to recommend for new or inactive user: {userId}")
            return jsonify([])

    events_json = [{
        'id': event.id,
        'title': event.title,
        'type': event.type,
        'description': event.description,
        # 添加其他需要的字段
    } for event in recommended_events]

    return jsonify(events_json)


@app.route('/bookings/<int:userId>', methods=['GET'])
def get_bookings(userId):
    print(userId)
    cust = Customer.query.filter_by(id=userId).first()
    events_list = []
# <<<<<<< HEAD
    if cust.order is None or len(cust.order)== 0:
# =======
        print(cust.order)
    if cust.order is None or len(cust.order) == 0:
# >>>>>>> 4fbbc7cdd4438b1cb10814863919c68846cd186a
        return jsonify({'message': 'No events found!'}), 404
    for k,v in cust.order.items():
        event_order = Events_order.query.filter_by(id=int(k)).first()
        events = Events.query.filter_by(id=int(k)).first()
        orderdetails = event_order.orderdetails[v]
        # print(orderdetails, k, v)

        seat_list = []
        for i in range(len(orderdetails)):
            if orderdetails[i][0] == userId:
                # print(1)
                seat_list.append(i)
        event1 = {
            'eventId': event_order.id,
            'userId': cust.id,
            'eventtitle': event_order.eventtitle,
            'thumbnail': events.thumbnail,
            'description': events.description,
            'date': v,
            'seat': seat_list
        }
        events_list.append(event1)
    print(events_list)
    return jsonify(events_list), 200

@app.route('/bookings/cancel/<int:userId>', methods=['PUT'])
def cancel_bookings(userId):
    data = request.get_json()
    print(data)
    cust = Customer.query.filter_by(id=int(userId)).first()
    events = Events.query.filter_by(id=int(data['eventId'])).first()
    price = events.price
    event_id = str(data['eventId'])
    if event_id in cust.order:
        del cust.order[event_id]
        flag_modified(cust, "order")
        event_order = Events_order.query.filter_by(id=int(data['eventId'])).first()
        for i in range(len(event_order.orderdetails[data['Date']])):
            #print(event_order.orderdetails[data['Date']][i], type(event_order.orderdetails[data['Date']][i]))
            if int(event_order.orderdetails[data['Date']][i][1]) == int(data['userId']):
                event_order.orderdetails[data['Date']][i] = [0, 0]
                cust.wallet += price
            flag_modified(event_order, "orderdetails")
            flag_modified(cust, "wallet")
        print(event_order.orderdetails)
        print(cust.wallet)
        # message = Message(subject="Cancel", recipients=[cust.email], body="Cancel order successfully!!")
        # mail.send(message)
        db.session.commit()
        return jsonify({'message': 'Refund successfully!'}), 201
    else:
        return jsonify({'message': 'Event not Found!!!'}), 400

@app.route('/bookings/cancel_event/<int:userId>', methods=['PUT'])
def cancel_events(userId):
    data = request.get_json()
    event_order = Events_order.query.filter_by(id=data['eventId']).first()
    event = Events.query.filter_by(id=data['eventId']).first()
    comment = Comments.query.filter_by(eventId=data['eventId']).first()
    user_list = defaultdict(int)
    events = Events.query.filter_by(id=int(data['eventId'])).first()
    price = events.price
    for k, v in event_order.orderdetails.items():
        for i in range(len(v)):
            if v[i][0] == 1:
                user_list[v[i][1]] += 1
    print(user_list)
    for i, j in user_list.items():
        user = Customer.query.filter_by(id=int(i)).first()
        print(data['eventId'], user.order)
        user.wallet += price*(int(j))
        del user.order[str(data['eventId'])]
        flag_modified(user, "order")
        flag_modified(user, "wallet")
        db.session.commit()
        # message = Message(subject="Order Changed!", recipients=[user.email], body="Event has been Canceled!")
        # mail.send(message)
    db.session.delete(event)
    db.session.delete(event_order)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Event has been canceled!'}), 201

@app.route('/comments/customer', methods=['POST'])
def if_order():
    data = request.get_json()
    cust = Customer.query.filter_by(id=data['customerId']).first()
    print(data['eventId'], cust.order)
    if str(data['eventId']) not in cust.order:
        return jsonify({'message': 'You did not order this event!'}), 404
    else:
        comment = Comments.query.filter_by(eventId=data['eventId']).first()
        if str(data['customerId']) in comment.comment:
            return jsonify({'message': 'You already commented this event!'})
        else:
            return jsonify({'message': 'You can fill your review now!'}), 201

@app.route('/comments/customer', methods=['PUT'])
def cust_comments():
    data = request.get_json()
    print(data)
    cust = Customer.query.filter_by(id=data['userId']).first()
    c = [data['Date'], data['review'], cust.name,'None', 'None', 'None', 'None']
    comment = Comments.query.filter_by(eventId=int(data['eventId'])).first_or_404()
    comment.comment[data['userId']] = c
    flag_modified(comment, "comment")
    db.session.commit()
    return jsonify({'message': 'Add comment successfully!'}), 201

@app.route('/comments/<int:eventId>', methods=['GET'])
def get_comments(eventId):
    comments = Comments.query.filter_by(eventId=eventId).first_or_404()
    return jsonify(comments.comment), 201

@app.route('/comments/host', methods=['POST'])
def if_host():
    data = request.get_json()
    event = Events.query.filter_by(id=int(data['eventId'])).first_or_404()
    if event.hostId == int(data['hostId']):
        return jsonify({'message': 'Reply your review!'}), 201
    else:
        return jsonify({'message': 'You did not host this event!'}), 400

@app.route('/comments/host', methods=['PUT'])
def host_comments():
    data = request.get_json()
    host = Host.query.filter_by(id=int(data['hostId'])).first_or_404()
    comment = Comments.query.filter_by(eventId=int(data['eventId'])).first_or_404()
    comment.comment[data['userId']][3] = data['Date']
    comment.comment[data['userId']][4] = data['review']
    comment.comment[data['userId']][5] = data['hostId']
    comment.comment[data['userId']][6] = host.companyName
    flag_modified(comment, "comment")
    db.session.commit()
    return jsonify({'message': 'Add comment successfully!'}), 201


@app.route('/events/new', methods=['POST'])
def register_event():
    data = request.get_json()
    #print(data)
    #thumbnail_data = base64.b64decode(data['thumbnail'])
    #print(data)
    event_title = data['title']
    existing_event = Events.query.filter_by(title=event_title).first()
    if existing_event:
        return jsonify({'message': 'Event title already exists!'}), 400
    image_str = data['thumbnail']
    image_data = base64.b64decode(image_str.split(",")[1])

    if not os.path.exists(pic_folder):
        os.makedirs(pic_folder)
    filename = str(data['title']) + '.jpg'
    file_path = os.path.join(pic_folder, filename)
    with open(file_path, "wb") as f:
        f.write(image_data)
    seats = data['seatingCapacity']
    start_date_str = data['startDate']
    end_date_str = data['endDate']
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    print(data['startDate'])
    date_list = []
    current_date = start_date
    while current_date <= end_date:
        date_list.append(current_date.strftime("%Y-%m-%d"))
        current_date += timedelta(days=1)
    seats_list = [[0, 0] for _ in range(int(data['seatingCapacity']))]
    seats_c = {}
    for i in date_list:
        seats_c[i] = seats_list

    new_order = Events_order(eventtitle=data['title'], orderdetails=seats_c)
    db.session.add(new_order)
    db.session.commit()
    #print(type(new_order.id))
    new_comment = Comments(eventId=new_order.id, comment={})
    db.session.add(new_comment)
    db.session.commit()

    new_event = Events(hostId=data['hostId'], title=data['title'], address=data['address'], price=data['price'], thumbnail=file_path,
                       type=data['eventType'], seats=data['seatingCapacity'],
                       from_time=data['startDate'], to_time=data['endDate'], URL=data['youtubeUrl'],
                       organizername=data['organizerName'], description=data['description'])
    db.session.add(new_event)
    db.session.commit()

    return jsonify({'message': 'Event created successfully!'}), 201

@app.route('/user/auth/host_register', methods=['POST'])
def host_register():
    data = request.get_json()
    email = data['email']
    existing_host = Host.query.filter_by(email=email).first()
    if existing_host:
        return jsonify({'message': 'Host email already exists!'}), 400
    print(data)
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = Host(companyName=data['companyName'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully!'}), 201

@app.route('/user/auth/customer_register', methods=['POST'])
def cust_register():
    data = request.get_json()
    print(data)
    email = data['email']
    existing_cust = Host.query.filter_by(email=email).first()
    if existing_cust:
        return jsonify({'message': 'Customer email already exists!'}), 400
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = Customer(name=data['Name'], email=data['email'], password=hashed_password, cvc=data['cardCVC'],
                        duedate=data['cardExpirationDate'], wallet=0, cardNumber=data['cardNumber'], order={})
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully!'}), 201

# Flask后端示例
@app.route('/user/auth/customer', methods=['GET'])
def get_customer():
    # 获取userId参数，并尝试将其转换为整数
    user_id = request.args.get('userId')
    user_id = int(user_id) if user_id is not None else None
    print('UserID received:', user_id)

    # 使用转换后的整数进行查询
    cust = Customer.query.filter_by(id=user_id).first()

    if cust is None:
        print('No customer found for UserID:', user_id)  # 如果查询无结果，输出信息
        return jsonify({'error': 'Customer not found'}), 404

    # 如果找到了customer，构造详情字典
    cust_detail = {
        'id': cust.id,
        'email': cust.email,
        'name': cust.name,
        'duedate': cust.duedate,
        'wallet': cust.wallet,
        'cardNumber': cust.cardNumber
    }
    return jsonify(cust_detail)

@app.route('/user/auth/customer/recharge', methods=['PUT'])
def top_up():
    data = request.get_json()
    user_id = data['userId']
    amount = data['amount']
    cust = Customer.query.filter_by(id=user_id).first()
    cust.wallet += int(amount)
    flag_modified(cust, "wallet")
    db.session.commit()
    amount = cust.wallet
    return jsonify(amount), 201


@app.route('/user/auth/login', methods=['POST'])
def login():
    data = request.json
    print(data)
    email = data.get('email')
    password = data.get('password')
    host = Host.query.filter_by(email=email).first()
    # hosts = Host.query.all()
    # for host in hosts:
    #     print(host)

    if not host:
        customer = Customer.query.filter_by(email=email).first()
        if not customer:
            print('message: User not found')
            return jsonify({'message': 'User not found'}), 401
        if not bcrypt.check_password_hash(customer.password, password):
            print('message: Invalid email or password')
            return jsonify({'message': 'Invalid email or password'}), 401

        token = jwt.encode({'id': customer.id, 'exp': datetime.now(timezone.utc) + timedelta(minutes=30)},
                           app.config['SECRET_KEY'])
        return jsonify({'token': token, 'id': customer.id})
    if not bcrypt.check_password_hash(host.password, password):
        print('message: Invalid email or password')
        return jsonify({'message': 'Invalid email or password'}), 401
    #print("package token")
    #print(app.config['SECRET_KEY'])
    token = jwt.encode({'id': host.id, 'exp': datetime.now(timezone.utc) + timedelta(minutes=30)}, app.config['SECRET_KEY'])
    return jsonify({'token': token, 'id': host.id})

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

@app.route('/user/auth/logout', methods=['POST'])
def logout():
    token = request.json.get('token')
    if not token:
        return jsonify({'message': 'Token is missing!'}), 401

    try:
        jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401
    return jsonify({'message': 'Logout successful!'}), 200

@app.route('/view_users')
def view_users():
    users = Host.query.all()
    user_list = [{'id': user.id, 'email': user.email, 'password': user.password} for user in users]
    return jsonify(user_list)

@app.route('/protected')
@token_required
def protected():
    return jsonify({'message': 'This is a protected endpoint!'})

if __name__ == '__main__':
    with app.app_context():
        #db.drop_all()
        db.create_all()
        #create_default_user()
    app.run(host='127.0.0.1', port=5005, debug=True)
    app.logger.setLevel(logging.DEBUG)