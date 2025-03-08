from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# 데이터베이스 파일이 있는 절대 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "guestbook.db")

# 데이터베이스 연결 함수
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ✅ 기본 페이지 ("/") - 서버 상태 확인 용
@app.route("/")
def home():
    return "Flask 백엔드가 정상적으로 실행 중입니다!"

# 📌 1) 방명록 목록 가져오기 (GET 요청)
@app.route("/messages", methods=["GET"])
def get_messages():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM guestbook ORDER BY created_at DESC")
    messages = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in messages])

# 📌 2) 새로운 방명록 추가하기 (POST 요청)
@app.route("/add-message", methods=["POST"])
def add_message():
    data = request.json
    name = data.get("name")
    message = data.get("message")

    if not name or not message:
        return jsonify({"error": "이름과 메시지를 입력하세요"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO guestbook (name, message) VALUES (?, ?)", (name, message))
    conn.commit()
    conn.close()
    return jsonify({"message": "방명록이 추가되었습니다!"})

# 📌 3) 방명록 삭제하기 (DELETE 요청)
@app.route("/delete-message/<int:id>", methods=["DELETE"])
def delete_message(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM guestbook WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "방명록이 삭제되었습니다!"})

# ✅ Render에서 실행되도록 설정 (포트 10000)
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=10000)
