-- Create the database seinfeld and specified it for use.
CREATE DATABASE files;
USE files;

-- Create the table actors.
CREATE TABLE file (
  id int AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  price int NOT NULL,
  item varchar(60) NOT NULL,
  description varchar(255) NOT NULL,
  type varchar(100) NOT NULL,
  size int(11) NOT NULL,
  updated_by varchar(255) ,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)

);

CREATE TABLE info (
  id int AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
    PRIMARY KEY(id)

) 
