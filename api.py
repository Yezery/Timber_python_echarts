import re
from flask import Flask, g, jsonify, request
# 开启跨域
from flask_cors import CORS
from flask import render_template
import sqlite3
from datetime import datetime
app = Flask(__name__)
CORS(app)
DATABASE = 'timber_data.db'

# 获取数据库连接
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

# 关闭数据库连接
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# 查询所有数据
@app.route('/get_timber_data', methods=['GET'])
def get_timber_data():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM timber_data')
    data = cursor.fetchall()  # 获取所有数据
    result = [
        {
            "name": row[0],
            "size": row[1],
            "grade": row[2],
            "location": row[3],
            "category": row[4],
            "price": row[5],
            "date": row[6],
            "type": row[7]
        }
        for row in data
    ]
    return {"timber_data": result}

# 查询并统计 `grade` 字段的种类及对应数量
@app.route('/grade_statistics', methods=['GET'])
def grade_statistics():
    db = get_db()
    cursor = db.cursor()
    
    # 查询并统计 `grade` 字段的种类及对应数量
    cursor.execute('''
        SELECT grade, COUNT(*) as count
        FROM timber_data
        GROUP BY grade
        ORDER BY count DESC
        LIMIT 10
    ''')
    
    data = cursor.fetchall()  # 获取统计结果
    result = [{"value": row[1], "name": row[0]} for row in data]  # 格式化为饼图数据
    
    return {"data": result}

# 查询并统计 `location` 字段的种类及对应数量
@app.route('/location_statistics', methods=['GET'])
def location_statistics():
    db = get_db()
    cursor = db.cursor()
    
    # 查询并统计 `location` 字段的种类及对应数量，限制返回前 7 个
    cursor.execute('''
        SELECT location, COUNT(*) as count
        FROM timber_data
        GROUP BY location
        ORDER BY count DESC
        LIMIT 7
    ''')
    
    data = cursor.fetchall()  # 获取查询结果
    result = [{"name": row[0], "value": row[1]} for row in data]  # 格式化为雷达图数据
    
    return {"data": result}

# 查询并统计 `name` 字段的种类及对应数量
@app.route('/name_statistics', methods=['GET'])
def name_statistics():
    db = get_db()
    cursor = db.cursor()
    
    # 查询并统计 `name` 字段的种类及对应数量
    cursor.execute('''
        SELECT name, COUNT(*) as count
        FROM timber_data
        GROUP BY name
        ORDER BY count DESC
        LIMIT 10
    ''')
    
    data = cursor.fetchall()  # 获取查询结果
    result = [{"name": row[0], "value": row[1]} for row in data]  # 格式化为饼图数据
    
    return {"data": result}

# 查询木材走势
@app.route('/get_trend', methods=['GET'])
def get_trend():
    name = request.args.get('name')  # 获取 name 参数
    location = request.args.get('location')  # 获取 location 参数
    grade = request.args.get('grade')  # 获取 grade 参数
    
    if not name:
        return jsonify({"error": "Missing 'name' parameter"}), 400

    db = get_db()
    cursor = db.cursor()

    # 构建查询条件
    query = "SELECT name, price, date, location, grade FROM timber_data WHERE name = ?"
    params = [name]

    # 如果 location 和 grade 存在，加入到查询条件
    if location:
        query += " AND location = ?"
        params.append(location)
    if grade:
        query += " AND grade = ?"
        params.append(grade)

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()
    db.close()

    # 格式化数据，并按日期从小到大排序
    sorted_rows = sorted(
        rows, 
        key=lambda x: datetime.fromtimestamp(int(x[2]))  # 转换时间戳进行排序
    )

    # 提取最后30条数据
    result = [
        {
            "date": datetime.fromtimestamp(int(row[2])).strftime('%Y-%m-%d'),  # 转换为格式化日期
            "price": row[1],  # 保留原始价格字符串
            "value": float(re.search(r'\d+(\.\d+)?', row[1]).group()) if re.search(r'\d+(\.\d+)?', row[1]) else 0.0  # 提取数值部分
        }
        for row in sorted_rows[-30:]
    ]

    return jsonify({"data": result})

@app.route('/')
def index():
    # 查询数据库获取数据量
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT COUNT(*) FROM timber_data')
    data_total = cursor.fetchone()[0]
    # 查询数据库获取地点数量
    cursor.execute('SELECT COUNT(DISTINCT location) FROM timber_data')
    location_num = cursor.fetchone()[0]
    # 查询数据库获取种类数量
    cursor.execute('SELECT COUNT(DISTINCT type) FROM timber_data')
    type_num = cursor.fetchone()[0]
    # 查询数据库获取更新时间
    cursor.execute('SELECT MAX(date) FROM timber_data')
    update_time = cursor.fetchone()[0]
    # 构造数据
    data_show = {
        'data_total':data_total,
        'location_num':location_num,
        'type_num':type_num,
        'update_time':datetime.fromtimestamp(int(update_time)).strftime('%Y-%m-%d')
        }
    return render_template('index.html', data=data_show)


if __name__ == '__main__':
    app.run(debug=True)




