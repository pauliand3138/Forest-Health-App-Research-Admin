CREATE DATABASE forestHealthDB;

CREATE TABLE form (
    formId VARCHAR(255) PRIMARY KEY,
    location VARCHAR(255),
    date VARCHAR(255),
    landscapeId int,
    vegTypeId int,
    vegStageId int,
    burnSevId int,
    userId varchar(255)
);

CREATE TABLE citizen_scientist (
    userId VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255),
    firstName VARCHAR(30),
    lastName VARCHAR(30),
    gender VARCHAR(10),
    dateOfBirth VARCHAR(255)
);

INSERT INTO form (formId, location, date, landscapeId, vegTypeId, vegStageId, burnSevId, userId)
VALUES ('0', 'Acacia', 'Sat Sep 16 2023', 1, 1, 1, 1, 'paul@test.com');

CREATE TABLE Landscape (
    landscapeId int PRIMARY KEY,
    landscapeDesc varchar(25)
);

CREATE TABLE Vegetation_Stage (
    vegStageId int PRIMARY KEY,
    vegStageDesc varchar(25)
);

CREATE TABLE Vegetation_Type (
    vegTypeId int PRIMARY KEY,
    vegTypeDesc varchar(25)
);

CREATE TABLE Burn_Severity (
    burnSevId int PRIMARY KEY,
    burnSevDesc varchar(25)
);

INSERT INTO Landscape (landscapeId, landscapeDesc)
VALUES
(1, 'Flat / Undulating'),
(2, 'Ridge / Hill'),
(3, 'Slope'),
(4, 'Valley / Gully');

INSERT INTO Vegetation_Stage (vegStageId, vegStageDesc)
VALUES
(1, 'Old'),
(2, 'Mature'),
(3, 'Regrowth'),
(4, 'Mixed'),
(5, 'Few trees present');

INSERT INTO Vegetation_Type (vegTypeId, vegTypeDesc)
VALUES
(1, 'Fern or Herb'),
(2, 'Grassy'),
(3, 'Shrubby'),
(4, 'Rainforest'),
(5, 'Riparian');

INSERT INTO Burn_Severity (burnSevId, burnSevDesc)
VALUES
(1, 'Unburnt'),
(2, 'Low'),
(3, 'Moderate'),
(4, 'High'),
(5, 'Extreme');