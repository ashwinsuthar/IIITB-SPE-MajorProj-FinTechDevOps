-- Initialization script for stock_portfolio dummy data
CREATE TABLE IF NOT EXISTS dummy_stock_portfolio (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    stock_symbol VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL
);

INSERT INTO dummy_stock_portfolio (user_id, stock_symbol, quantity, purchase_price) VALUES
('user123', 'AAPL', 50, 150.00),
('user123', 'GOOGL', 10, 2800.00),
('tester99', 'MSFT', 100, 310.50),
('tester99', 'TSLA', 25, 220.75);
