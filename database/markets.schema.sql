CREATE TABLE markets_data (
    adj_ticker varchar(255) PRIMARY KEY,
    ticker VARCHAR(255),
    reported_date DATETIME,
    end_date DATETIME,
    market_slug VARCHAR(255),
    open_interest DECIMAL(10, 2),
    volume DECIMAL(10, 2),
    probability JSON,
    question TEXT,
    description TEXT,
    forecasts DECIMAL(10, 2),
    link VARCHAR(255),
    platform VARCHAR(255)
    status VARCHAR(255)
);

CREATE TABLE markets_data_raw (
    date DATE PRIMARY KEY,
    url VARCHAR(255),
    value JSON,
    platform VARCHAR(255)
);

CREATE TABLE trades_data_raw (
    date DATE PRIMARY KEY,
    url VARCHAR(255),
    value JSON,
    platform VARCHAR(255)
);

CREATE TABLE trades_data (
    ticker VARCHAR(255) PRIMARY KEY,
    reported_date DATETIME,
    end_date DATETIME,
    market_slug VARCHAR(255),
    open_interest DECIMAL(10, 2),
    volume DECIMAL(10, 2),
    probability JSON,
    question TEXT,
    description TEXT,
    forecasts DECIMAL(10, 2),
    link VARCHAR(255),
    platform VARCHAR(255)
);