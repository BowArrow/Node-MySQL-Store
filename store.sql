-- DROP DATABASE IF EXISTS store_frontDB;
-- CREATE DATABASE store_frontDB;

USE store_frontDB;

CREATE TABLE listedItems
(
    position INT AUTO_INCREMENT,
    seller VARCHAR(30) NOT NULL,
    item VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    quantity INT NOT NULL,
    department VARCHAR(50) NOT NULL,
    PRIMARY KEY (position)
);

CREATE TABLE soldItems
(
    position INT AUTO_INCREMENT,
    seller VARCHAR(30) NOT NULL,
    item VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    quantity INT NOT NULL,
    department VARCHAR(50) NOT NULL,
    PRIMARY KEY (position)
)

