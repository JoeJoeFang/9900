import string
from functools import wraps
import random
import json
from flask import Blueprint, jsonify, request
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from flask import render_template
from models import Host, Customer, Events, Email, Events_order, Comments, db
import jwt
from sqlalchemy.orm.attributes import flag_modified
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from flask import current_app

bp = Blueprint('routes', __name__)
mail = Mail()
bcrypt = Bcrypt()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, bp.config['SECRET_KEY'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(*args, **kwargs)

    return decorated


def cust_generate_reset_token():
    token = ''.join(random.choices(string.ascii_letters + string.digits, k=4))
    return token


def cust_send_reset_email(cust, token):
    msg = Message('Reset your password', recipients=[cust.email])
    msg.body = f"Your account is trying to reset the password, the verification code is：\n{token}"
    mail.send(msg)


def verify_reset_token(email, role, token):
    # 从email中查询 当前尚未过期的token信息 验证token
    # 当前时间要小于expire_time
    res = Email.query.filter(
        Email.email == email,
        Email.role == role,
        Email.token == token,
        Email.expires > datetime.now()
    ).first()
    return res


@bp.route("/user/list")
def delete():
    want_del_id = request.args.get("delete", default=1, type=int)
    query_id = Host.query.filter_by(id=want_del_id).first()
    if not query_id:
        return "message:User not found"
    db.session.delete(query_id)
    db.session.commit()
    return f"message: The user with id {id} was removed from the database!"


@bp.route("/user/add")
def add_user():
    user1 = Host(email="刘畅", password="924082621")
    db.session.add(user1)
    db.session.commit()
    return "用户创建成功！"


@bp.route('/events', methods=['GET'])
def get_events():
    # 查询数据库以获取事件列表
    events = Events.query.all()
    current_date = datetime.now().date()

    # 将查询到的事件列表转换为 JSON 格式
    event_list = []
    for event in events:
        event_date = datetime.strptime(event.from_time, "%Y-%m-%d").date()
        end_date = datetime.strptime(event.to_time, "%Y-%m-%d").date()
        gap = event_date - current_date
        gap2 = end_date - current_date
        print(gap.days)
        print('aa')
        if gap.days <= 30 and gap2.days >= 0:
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
            # image_path = event.thumbnail
            # base64_str = image_to_base64(image_path)
            # event_data['thumbnail'] = base64_str
            event_list.append(event_data)
    # print("fanhui", event_list)
    # 使用 jsonify 函数将 JSON 格式的事件列表返回给前端
    return jsonify(event_list), 201


@bp.route('/events/search', methods=['GET'])
def search_events():
    event_description = request.args.get('description', '')
    keyword = request.args.get('keyWord', '')
    event_type = request.args.get('eventType', '')

    print('k: ',keyword, 't: ', event_type, 'd: ', event_description)
    query = Events.query

    events = Events.query.all()
    event_list = []

    for event in events:
        flag_print = 0
        # Check if the keyword is in any of the relevant fields
        #print(keyword.lower(), event.title.lower(), event_type.lower(), event.type.lower())
        #print(keyword.lower(), event.title.lower(), keyword.lower() in event.title.lower())
        if event_type == 'all types':
            if keyword.lower() == '':
                if event_description.lower() in event.description.lower():
                    flag_print = 1
            elif event_description.lower() == '':
                if keyword.lower() in event.title.lower():
                    flag_print = 1
            elif keyword.lower() == '' and event_description.lower() == '':
                flag_print = 1
            else:
                if keyword.lower() in event.title.lower() and event_description.lower() in event.description.lower():
                    flag_print = 1
        else:
            if event_description.lower() == '' and event_type.lower() == '' and keyword.lower() == '':
                return jsonify([]), 200
            elif keyword.lower() == '':
                if event_description.lower() in event.description.lower() and event_type.lower() in event.type.lower():
                    flag_print = 1
            elif event_description.lower() == '':
                if keyword.lower() in event.title.lower() and event_type.lower() in event.type.lower():
                    flag_print = 1
            elif event_type.lower() == '':
                if keyword.lower() in event.title.lower() and event_description.lower() in event.description.lower():
                    flag_print = 1
            elif keyword.lower() == '' and event_description.lower() == '':
                if event_type.lower() in event.type.lower():
                    flag_print = 1
            elif keyword.lower() == '' and event_type.lower() == '':
                if event_description.lower() in event.description.lower():
                    flag_print = 1
            elif event_description.lower() == '' and event_type.lower() == '':
                if keyword.lower() in event.title.lower():
                    flag_print = 1
            else:
                if keyword.lower() in event.title.lower() and event_description.lower() in event.description.lower() and event_type.lower() in event.type.lower():
                    flag_print = 1
        if flag_print == 1:
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


@bp.route('/events/title', methods=['GET'])
def get_events_title():
    # 查询数据库以获取事件列表
    events = Events.query.all()
    # 将查询到的事件列表转换为 JSON 格式
    event_list = []
    for event in events:
        event_data = {
            'title': event.title,
        }
        event_list.append(event_data)
    # print("fanhui", event_list)
    return jsonify(event_list)


@bp.route('/events/host/<int:userId>', methods=['GET'])
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


@bp.route('/events/<int:eventId>', methods=['GET'])
def get_events_details(eventId):
    # 查询数据库以获取事件列表
    # print(1111111111)
    # print(eventId)
    event = Events.query.filter_by(id=eventId).first()
    event_order = Events_order.query.filter_by(id=eventId).first()
    # 将查询到的事件列表转换为 JSON 格式
    print("if not event_order or not event:")
    # print(event, event_order)
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
        'eventType': event.type,
        'seatingCapacity': event.seats,
        'duration': event.duration,
        'startDate': event.from_time,
        'endDate': event.to_time,
        'description': event.description,
        'youtubeUrl': event.URL,
        'orderdetails': event_order.orderdetails
    }
    # print("finish", event_data)
    return jsonify(event_data)


@bp.route('/bookings', methods=['PUT'])
def update_events_bookings():
    # 查询数据库以获取事件列表s
    data = request.get_json()
    # print(data)
    cust_id = data['userId']
    date_ = data['Date']
    seat_number = data['seat']
    eventid = data['eventId']
    cust = Customer.query.filter_by(id=cust_id).first()
    print(cust_id, cust)
    event = Events_order.query.filter_by(id=eventid).first()
    events = Events.query.filter_by(id=eventid).first()
    if not event:
        return jsonify({'message': 'Event not found!'}), 404
    if not cust:
        return jsonify({'message': 'Customer not found!'}), 405
    if cust.order is None:
        cust.order = {}
    price = events.price * len(seat_number)
    if cust.wallet < price:
        return jsonify({'message': 'You do not have enough money!'}), 401
    flag = 0
    s = 0
    for i in seat_number:
        if event.orderdetails[date_][int(i)][0] == 1:
            flag = 1
            s = int(i) + 1
            break
    if flag == 1:
        return jsonify({'message': f'Seats {s} are not available!'}), 402
    # cust.order[event.id] = [date_]
    if str(event.id) in cust.order:
        print(cust.order[str(event.id)])
        if date_ in cust.order[str(event.id)]:
            pass
        else:
            cust.order[str(event.id)].append(date_)
    else:
        cust.order[event.id] = [date_]
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

        for i in range(len(seat_number)):
            seat_number[i] += 1

        events_json = {
            'title': events.title,
            'type': events.type,
            'address': events.address,
            'price': events.price,
            'seats': seat_number,
            'organizerName': events.organizername,
            'date': data['Date'],
            'description': events.description
        }
        events_html = render_template('mail_booking.html', events_json=events_json)
        message = Message(subject="Booking Successfully!", recipients=[cust.email])
        message.html = events_html

        mail.send(message)
        return jsonify({'message': 'Create order successfully!', 'event': order_data}), 201
    return jsonify({'message': 'Failed to update event details!'}), 400


@bp.route('/bookings/<int:userId>/recommendation', methods=['GET'])  # 推荐系统
def get_recommendation(userId):
    # （思路：
    # 查询用户购买的活动，找到活动类型
    # 查询所有活动列表
    # 使用用户购买过的活动的类型来过滤活动列表
    # 返回过滤后的活动列表（显示三个）
    # 如果用户之前没有购买过任何活动，则显示三个未开始活动）
    # 最后的获取结果应该除开已经购买的活动
    # 如果活动列表中已购活动没有其他同类型的活动，推荐应返回空
    current_app.logger.info(f"Fetching recommendations for user: {userId}")
    # 从customer表中取出所有已购买的订单信息
    cust = Customer.query.filter_by(id=int(userId)).first()
    user_events_ids = list(cust.order.keys())
    # 存储每个活动类型的频次
    event_type_frequency = defaultdict(int)

    if user_events_ids:
        # 统计每种类型活动的购买次数
        for event_id in user_events_ids:
            event = Events.query.get(event_id)
            if event:  # 确保找到了对应的活动
                event_type_frequency[event.type] += 1
        # 找到用户最常参加的活动类型
        favorite_event_type = max(event_type_frequency, key=event_type_frequency.get)

        # 获取推荐活动列表  从用户订单中排除已购买的活动ID
        recommended_events = Events.query.filter(
            Events.type == favorite_event_type,
            Events.id.notin_(user_events_ids),
            Events.from_time > datetime.now()
        ).order_by(Events.from_time).limit(6).all()

        if not recommended_events:  # 如果没有其他同类型的活动可推荐，则返回空列表
            current_app.logger.info(f"No recommended events found for favorite type '{favorite_event_type}' for user: {userId}")
            return jsonify([])
    else:
        # 对于没有购买记录的用户，推荐即将举行且未购买的活动
        recommended_events = Events.query.filter(
            Events.id.notin_(user_events_ids),
            Events.from_time > datetime.now()
        ).order_by(Events.from_time).limit(3).all()
        if not recommended_events:  # 如果没有活动可以推荐，则返回空列表
            current_app.logger.info(f"No upcoming events to recommend for new or inactive user: {userId}")
            return jsonify([])

    events_json = [{
        'id': event.id,
        'title': event.title,
        'type': event.type,
        'description': event.description,
        'address': event.address,
        'price': event.price,
        'thumbnail': event.thumbnail,
        'organizerName': event.organizername,
        'eventType': event.type,
        'seatingCapacity': event.seats,
        'duration': event.duration,
        'startDate': event.from_time,
        'endDate': event.to_time,
        'youtubeUrl': event.URL
    } for event in recommended_events]

    return jsonify(events_json)


@bp.route('/bookings/<int:userId>', methods=['GET'])
def get_bookings(userId):
    print(userId)
    cust = Customer.query.filter_by(id=userId).first()
    events_list = []

    if cust.order is None or len(cust.order) == 0:
        print(cust.order)
    if cust.order is None or len(cust.order) == 0:
        return jsonify({'message': 'No events found!'}), 404
    for k, v in cust.order.items():
        # print('qwwwwwwwwwwwwwwwwwwwwww')
        event_order = Events_order.query.filter_by(id=int(k)).first()
        events = Events.query.filter_by(id=int(k)).first()
        for i in v:
            orderdetails = event_order.orderdetails[i]
            # print(orderdetails, k, v)
            seat_list = []
            for j in range(len(orderdetails)):
                seat_number = j+1
                # print(orderdetails[j], userId)
                if orderdetails[j][1] == str(userId):
                    seat_list.append(j)
                    print(j, '1111111111111111')
                    event1 = {
                        'eventId': event_order.id,
                        'userId': cust.id,
                        'eventtitle': event_order.eventtitle,
                        'thumbnail': events.thumbnail,
                        'description': events.description,
                        'date': i,
                        'seat': seat_number
                    }
                    #print(event1)
                    events_list.append(event1)

    print(events_list)
    return jsonify(events_list), 200


@bp.route('/bookings/cancel/<int:userId>', methods=['PUT'])
def cancel_bookings(userId):
    data = request.get_json()
    seat = data['seat'] - 1
    # print(data)
    cust = Customer.query.filter_by(id=int(userId)).first()
    events = Events.query.filter_by(id=int(data['eventId'])).first()
    event_id = str(data['eventId'])
    if event_id in cust.order:
        price = events.price
        # del cust.order[event_id]
        # flag_modified(cust, "order")
        event_order = Events_order.query.filter_by(id=int(data['eventId'])).first()
        print(int(event_order.orderdetails[data['Date']][seat][1]), int(data['userId']))
        if int(event_order.orderdetails[data['Date']][seat][1]) == int(data['userId']):

            event_order.orderdetails[data['Date']][seat] = [0, 0]
            flag_modified(event_order, "orderdetails")
        flag = 0
        for i in range(len(event_order.orderdetails[data['Date']])):
            if int(event_order.orderdetails[data['Date']][i][1]) == int(data['userId']):
                flag = 1
        if flag == 0:
            if len(cust.order[event_id]) == 1:
                del cust.order[event_id]
                flag_modified(cust, "order")
            else:
                cust.order[event_id].remove(data['Date'])
                flag_modified(cust, "order")
        # for i in range(len(event_order.orderdetails[data['Date']])):
        #     # print(event_order.orderdetails[data['Date']][i], type(event_order.orderdetails[data['Date']][i]))
        #     if int(event_order.orderdetails[data['Date']][i][1]) == int(data['userId']):
        #         event_order.orderdetails[data['Date']][i] = [0, 0]
        cust.wallet += price
        flag_modified(cust, "wallet")
        # print(event_order.orderdetails)
        # print(cust.wallet)
        seat_number = seat + 1
        events_json = {
            'title': events.title,
            'type': events.type,
            'address': events.address,
            'price': events.price,
            'seats': seat_number,
            'organizerName': events.organizername,
            'date': data['Date'],
            'description': events.description
        }
        events_html = render_template('mail_cancel_booking.html', events_json=events_json)
        message = Message(subject="Your Booking has been canceled successfully!", recipients=[cust.email])
        message.html = events_html
        # events_json_str = json.dumps(events_json, ensure_ascii=True)
        # print(events_json_str)
        # message = Message(subject="Your Booking has been canceled successfully!", recipients=[cust.email], body=events_json_str)
        mail.send(message)
        db.session.commit()
        return jsonify({'message': 'Refund successfully!'}), 201
    else:
        return jsonify({'message': 'Event not Found!!!'}), 400


@bp.route('/bookings/cancel_event/<int:userId>', methods=['PUT'])
def cancel_events(userId):
    data = request.get_json()
    event_order = Events_order.query.filter_by(id=data['eventId']).first()
    event = Events.query.filter_by(id=data['eventId']).first()
    comment = Comments.query.filter_by(eventId=data['eventId']).first()
    user_list = defaultdict(int)
    events = Events.query.filter_by(id=int(data['eventId'])).first()
    price = events.price

    seat_list = {}
    for k, v in event_order.orderdetails.items():
        for i in range(len(v)):
            if v[i][0] == 1:
                user_list[v[i][1]] += 1
                if v[i][1] in seat_list:
                    seat_list[v[i][1]].append(i)
                else:
                    seat_list[v[i][1]] = [i]
    # print(seat_list)
    # print(user_list)
    for i, j in user_list.items():
        user = Customer.query.filter_by(id=int(i)).first()
        print(data['eventId'], user.order)
        user.wallet += price * (int(j))
        del user.order[str(data['eventId'])]
        flag_modified(user, "order")
        flag_modified(user, "wallet")
        db.session.commit()
        events_json = {
            'title': event.title,
            'type': event.type,
            'address': event.address,
            'price': event.price,
            # 'seats': seat_list[str(user.id)],
            'organizerName': event.organizername,
            'startDate': event.from_time,
            'endDate': event.to_time,
            'description': event.description
        }
        events_html = render_template('mail_cancel_event.html', events_json=events_json)
        message = Message(subject="Host has Canceled Your Booking!", recipients=[user.email])
        message.html = events_html
        mail.send(message)
    db.session.delete(event)
    db.session.delete(event_order)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Event has been canceled!'}), 201


@bp.route('/comments/customer', methods=['POST'])
def if_order():
    data = request.get_json()
    cust = Customer.query.filter_by(id=data['customerId']).first()
    print(data['eventId'], cust.order)
    if str(data['eventId']) not in cust.order:
        return jsonify({'message': 'You did not order this event!'}), 404
    else:
        comment = Comments.query.filter_by(eventId=data['eventId']).first()
        if str(data['customerId']) in comment.comment:
            return jsonify({'message': 'You already commented this event!'}), 401
        else:
            return jsonify({'message': 'You can fill your review now!'}), 201


@bp.route('/comments/customer', methods=['PUT'])
def cust_comments():
    data = request.get_json()
    # print(data)
    cust = Customer.query.filter_by(id=data['userId']).first()
    c = [data['Date'], data['review'], cust.name, 'None', 'None', 'None', 'None']
    comment = Comments.query.filter_by(eventId=int(data['eventId'])).first_or_404()
    comment.comment[data['userId']] = c
    flag_modified(comment, "comment")
    db.session.commit()
    return jsonify({'message': 'Add comment successfully!'}), 201


@bp.route('/comments/<int:eventId>', methods=['GET'])
def get_comments(eventId):
    comments = Comments.query.filter_by(eventId=eventId).first_or_404()
    return jsonify(comments.comment), 201


@bp.route('/comments/host', methods=['POST'])
def if_host():
    data = request.get_json()
    event = Events.query.filter_by(id=int(data['eventId'])).first_or_404()
    if event.hostId == int(data['hostId']):
        return jsonify({'message': 'Reply your review!'}), 201
    else:
        return jsonify({'message': 'You did not host this event!'}), 400


@bp.route('/comments/host', methods=['PUT'])
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


@bp.route('/events/new', methods=['POST'])
def register_event():
    data = request.get_json()
    # print(data)
    # thumbnail_data = base64.b64decode(data['thumbnail'])
    # print(data)
    event_title = data['title']
    existing_event = Events.query.filter_by(title=event_title).first()
    if existing_event:
        return jsonify({'message': 'Event title already exists!'}), 400
    image_str = data['thumbnail']
    # image_data = base64.b64decode(image_str.split(",")[1])

    # if not os.path.exists(pic_folder):
    #     os.makedirs(pic_folder)
    # filename = str(data['title']) + '.jpg'
    # file_path = os.path.join(pic_folder, filename)
    # with open(file_path, "wb") as f:
    #     f.write(image_data)
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
    # print(type(new_order.id))
    new_comment = Comments(eventId=new_order.id, comment={})
    db.session.add(new_comment)
    db.session.commit()

    new_event = Events(hostId=data['hostId'], title=data['title'], address=data['address'], price=data['price'],
                       thumbnail=image_str,
                       type=data['eventType'], seats=data['seatingCapacity'],
                       from_time=data['startDate'], to_time=data['endDate'], URL=data['youtubeUrl'],
                       organizername=data['organizerName'], description=data['description'])
    db.session.add(new_event)
    db.session.commit()

    return jsonify({'message': 'Event created successfully!'}), 201


@bp.route('/user/auth/host_register', methods=['POST'])
def host_register():
    data = request.get_json()
    email = data['email']
    existing_host = Host.query.filter_by(email=email).first()
    if existing_host:
        return jsonify({'message': 'Host email already exists!'}), 400
    existing_cust = Host.query.filter_by(email=email).first()
    if existing_cust:
        return jsonify({'message': 'Customer email already exists!'}), 400
    print(data)
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = Host(companyName=data['companyName'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully!'}), 201


@bp.route('/user/auth/customer_register', methods=['POST'])
def cust_register():
    data = request.get_json()
    print(data)
    email = data['email']
    existing_cust = Host.query.filter_by(email=email).first()
    if existing_cust:
        return jsonify({'message': 'Customer email already exists!'}), 400
    existing_host = Host.query.filter_by(email=email).first()
    if existing_host:
        return jsonify({'message': 'Host email already exists!'}), 400
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = Customer(name=data['Name'], email=data['email'], password=hashed_password, cvc=data['cardCVC'],
                        duedate=data['cardExpirationDate'], wallet=0, cardNumber=data['cardNumber'], order={})
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully!'}), 201


# Flask后端示例
@bp.route('/user/auth/customer', methods=['GET'])
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


@bp.route('/user/auth/customer/recharge', methods=['PUT'])
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


@bp.route('/user/auth/login', methods=['POST'])
def login():
    data = request.json
    identity = data['identity']
    print(data)
    email = data.get('email')
    password = data.get('password')
    if identity == 'host':
        host = Host.query.filter_by(email=email).first()
        if not host:
            customer = Customer.query.filter_by(email=email).first()
            if not customer:
                return jsonify({'message': 'User not found'}), 401
            else:
                return jsonify({'message': 'Please login customer!'}), 402
        else:
            if not bcrypt.check_password_hash(host.password, password):
                print('message: Invalid email or password')
                return jsonify({'message': 'Invalid email or password'}), 403
            token = jwt.encode({'id': host.id, 'exp': datetime.now(timezone.utc) + timedelta(minutes=30)},
                               current_app.config['SECRET_KEY'])
            return jsonify({'token': token, 'id': host.id})
    else:
        customer = Customer.query.filter_by(email=email).first()
        if not customer:
            host = Host.query.filter_by(email=email).first()
            if not host:
                return jsonify({'message': 'User not found'}), 404
            else:
                return jsonify({'message': 'Please login host!'}), 405
        else:
            if not bcrypt.check_password_hash(customer.password, password):
                print('message: Invalid email or password')
                return jsonify({'message': 'Invalid email or password'}), 406
            token = jwt.encode({'id': customer.id, 'exp': datetime.now(timezone.utc) + timedelta(minutes=30)},
                               current_app.config['SECRET_KEY'])
            return jsonify({'token': token, 'id': customer.id})
    # a = Customer.query.filter_by(id=1).first()
    # print(a.email)
    # hosts = Host.query.all()
    # for host in hosts:
    #     print(host)

    # if not host:
    #     customer = Customer.query.filter_by(email=email).first()
    #     if not customer:
    #         print('message: User not found')
    #         return jsonify({'message': 'User not found'}), 401
    #     if not bcrypt.check_password_hash(customer.password, password):
    #         print('message: Invalid email or password')
    #         return jsonify({'message': 'Invalid email or password'}), 402
    #
    #     token = jwt.encode({'id': customer.id, 'exp': datetime.now(timezone.utc) + timedelta(minutes=30)},
    #                        current_app.config['SECRET_KEY'])
    #     return jsonify({'token': token, 'id': customer.id})


@bp.route('/user/auth/logout', methods=['POST'])
def logout():
    token = request.json.get('token')
    if not token:
        return jsonify({'message': 'Token is missing!'}), 401

    try:
        jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401
    return jsonify({'message': 'Logout successful!'}), 200


@bp.route('/view_users')
def view_users():
    users = Host.query.all()
    user_list = [{'id': user.id, 'email': user.email, 'password': user.password} for user in users]
    return jsonify(user_list)


@bp.route('/protected')
@token_required
def protected():
    return jsonify({'message': 'This is a protected endpoint!'})


@bp.route('/user/auth/send_email', methods=['GET', 'POST'])
def send_email():
    role = request.json.get('role')
    email = request.json.get('email')
    if role == 'Host':
        user = Host.query.filter_by(email=email).first()
    elif role == 'Customer':
        user = Customer.query.filter_by(email=email).first()
    else:
        return jsonify({'message': 'Invalid role. Role must be either "Host" or "Customer".'}), 400
    if user is None:
        return jsonify({'message': f'No {role} found with the provided email address.'}), 404

    if user:
        token = cust_generate_reset_token()
        cust_send_reset_email(user, token)

        # 保存token到db中 设置有效期1分钟
        expire_time = datetime.now() + timedelta(minutes=1)
        new_email = Email(email=email, role=role, token=token, expires=expire_time)
        db.session.add(new_email)
        db.session.commit()

        response = {'message': 'Reset email sent, please check your email.'}
        return jsonify(response), 200
    else:
        response = {'message': 'Invalid email.'}
        return jsonify(response), 404


@bp.route('/user/auth/check_token', methods=['GET', 'POST'])
def check_token():
    email = request.json.get('email')
    role = request.json.get('role')
    token = request.json.get('token')

    current_app.logger.info("Validating token: %s", token)

    email_code = verify_reset_token(email, role, token)

    if not email_code:
        return jsonify({'message': 'Invalid email or expiration token.'}), 404

    current_app.logger.info("Token info: %s", email_code.token)

    if email_code.token != token:
        response = {'message': 'Invalid or expired token'}
        return jsonify(response), 404

    response = {'message': 'Verification successfully'}
    return jsonify(response), 200


@bp.route('/user/auth/reset_password', methods=['GET', 'POST'])
def reset_password():
    email = request.json.get('email')
    role = request.json.get('role')
    token = request.json.get('token')

    current_app.logger.info("Validating token: %s", token)

    email_code = verify_reset_token(email, role, token)

    if not email_code:
        return jsonify({'message': 'Invalid email or expiration token.'}), 404

    if email_code.token != token:
        response = {'message': 'Invalid or expired token'}
        return jsonify(response), 404

    password = request.json.get('password')
    confirm_password = request.json.get('confirm_password')

    if password != confirm_password:
        response = {'message': 'Password and confirm password are not matched'}
        return jsonify(response), 404

    if role == 'Customer':
        user = Customer.query.filter_by(email=email).first()
    elif role == 'Host':
        user = Host.query.filter_by(email=email).first()
    else:
        return jsonify({'message': 'Invalid role.'}), 404

    # 更新用户密码
    user.password = bcrypt.generate_password_hash(password).decode('utf-8')
    db.session.commit()
    response = {'message': 'User password set successfully'}
    return jsonify(response), 200
