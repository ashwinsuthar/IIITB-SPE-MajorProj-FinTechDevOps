import random
import csv
import os

# 50 Companies (US and India mixed)
companies = [
    # US Stocks
    ('AAPL', 150.0), ('MSFT', 310.0), ('GOOGL', 2800.0), ('AMZN', 130.0), ('TSLA', 220.0),
    ('META', 300.0), ('NVDA', 450.0), ('NFLX', 400.0), ('JPM', 140.0), ('V', 230.0),
    ('JNJ', 160.0), ('WMT', 150.0), ('PG', 145.0), ('MA', 380.0), ('UNH', 480.0),
    ('DIS', 85.0), ('HD', 300.0), ('VZ', 35.0), ('CVX', 160.0), ('PEP', 170.0),
    ('KO', 60.0), ('MRK', 105.0), ('BAC', 30.0), ('INTC', 35.0), ('CSCO', 55.0),
    # Indian Stocks
    ('RELIANCE.NS', 2400.0), ('TCS.NS', 3300.0), ('HDFCBANK.NS', 1600.0), ('INFY.NS', 1400.0), ('ICICIBANK.NS', 950.0),
    ('HINDUNILVR.NS', 2500.0), ('ITC.NS', 450.0), ('SBIN.NS', 580.0), ('BHARTIARTL.NS', 850.0), ('KOTAKBANK.NS', 1800.0),
    ('BAJFINANCE.NS', 7200.0), ('LT.NS', 2600.0), ('WIPRO.NS', 410.0), ('HCLTECH.NS', 1150.0), ('ASIANPAINT.NS', 3200.0),
    ('MARUTI.NS', 9500.0), ('SUNPHARMA.NS', 1100.0), ('ULTRACEMCO.NS', 8200.0), ('TATAMOTORS.NS', 620.0), ('TATASTEEL.NS', 120.0),
    ('POWERGRID.NS', 240.0), ('NTPC.NS', 200.0), ('BAJAJFINSV.NS', 1500.0), ('AXISBANK.NS', 980.0), ('M&M.NS', 1500.0)
]

# Generate 50 Users
users = []
for i in range(1, 51):
    users.append({
        'id': f'user{i:03d}',
        'username': f'investor_{i:03d}',
        'password': f'pass1234_company_user{i}',
    })

# Write login credentials backup
with open('db/login_credentials_backup.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Login ID (username)', 'Password', 'User ID'])
    for u in users:
        writer.writerow([u['username'], u['password'], u['id']])

# Generate SQL script
sql_lines = []

sql_lines.append("CREATE TABLE IF NOT EXISTS users (")
sql_lines.append("    id VARCHAR(50) PRIMARY KEY,")
sql_lines.append("    username VARCHAR(100) NOT NULL UNIQUE,")
sql_lines.append("    password VARCHAR(255) NOT NULL")
sql_lines.append(");")
sql_lines.append("")

sql_lines.append("CREATE TABLE IF NOT EXISTS dummy_stock_portfolio (")
sql_lines.append("    id SERIAL PRIMARY KEY,")
sql_lines.append("    user_id VARCHAR(50) NOT NULL,")
sql_lines.append("    stock_symbol VARCHAR(20) NOT NULL,")
sql_lines.append("    quantity INT NOT NULL,")
sql_lines.append("    purchase_price DECIMAL(10, 2) NOT NULL")
sql_lines.append(");")
sql_lines.append("")

# Insert Users
for u in users:
    sql_lines.append(f"INSERT INTO users (id, username, password) VALUES ('{u['id']}', '{u['username']}', '{u['password']}') ON CONFLICT DO NOTHING;")

sql_lines.append("")

# Insert Portfolios
for u in users:
    # Each user gets 3 to 7 random stocks
    num_stocks = random.randint(3, 7)
    user_stocks = random.sample(companies, num_stocks)
    for stock in user_stocks:
        symbol = stock[0]
        # random variance in price from current roughly -5% to +5%
        price = stock[1] * random.uniform(0.95, 1.05)
        quantity = random.randint(10, 100)
        sql_lines.append(f"INSERT INTO dummy_stock_portfolio (user_id, stock_symbol, quantity, purchase_price) VALUES ('{u['id']}', '{symbol}', {quantity}, {price:.2f});")

with open('db/insert_data.sql', 'w') as f:
    f.write("\\n".join(sql_lines))

print("Data generation complete. Files saved to db/login_credentials_backup.csv and db/insert_data.sql")
