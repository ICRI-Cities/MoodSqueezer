create database floordb;
use floordb;

create table snapshot(
	date varchar(255),
    time varchar(255),
	circleMatrix text,
    numClients int,
    PRIMARY KEY (date, time)
);

create table loginData(
	date varchar(255),
    time varchar(255),
    PRIMARY KEY (date, time)
);

create table squeezeData(
	date varchar(255),
    time varchar(255),
	floor int,
	colour int,
	duration int,
	intensity int,
	PRIMARY KEY (date, time)
);
