import sqlite3

# 데이터베이스 파일 생성 (없으면 자동 생성)
conn = sqlite3.connect("guestbook.db")
cursor = conn.cursor()

# 방명록 테이블 생성
cursor.execute("""
CREATE TABLE IF NOT EXISTS guestbook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()
print("✅ 데이터베이스가 생성되었습니다!")
