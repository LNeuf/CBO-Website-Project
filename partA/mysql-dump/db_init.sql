USE cbo_db;

CREATE TABLE staff (
ID int NOT NULL AUTO_INCREMENT,
firstname varchar(255),
lastname varchar(255) NOT NULL,
role varchar(255),
joindate varchar(255),
PRIMARY KEY (ID)
);

CREATE TABLE customers (
ID int NOT NULL AUTO_INCREMENT,
firstname varchar(255),
lastname varchar(255) NOT NULL,
joindate varchar(255),
PRIMARY KEY (ID)
);