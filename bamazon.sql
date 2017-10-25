DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NULL,
    department_name VARCHAR(35) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("lolz Game Console", "Video Games", 349.99, 50), 
        ("lolz Control Pad", "Video Games", 59.99, 120), 
        ("Bunny Rabbit Ramen", "Grocery", 5.99, 200),
        ("Fermented Duck Egg", "Grocery", 12.99, 45),
        ("Hipster Hat", "Clothing", 39.99, 80),
        ("Tight AF Pant", "Clothing", 89.99, 75),
        ("The Speaker", "Electronics", 299.99, 20),
        ("Flat AF Television", "Electronics", 1599.99, 19),
        ("Cool Football Bro", "Sporting Goods", 32.99, 70),
        ("Cool Basketball Bro", "Sporting Goods", 31.99, 60);