DROP DATABASE IF EXISTS besides;

CREATE DATABASE besides;

USE besides;

CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(50),
    legalStatus VARCHAR(30),
    activitySector VARCHAR(50)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyID INT,
    username VARCHAR(255) UNIQUE NOT NULL, -- l'adresse email
    pass VARCHAR(255) NOT NULL,
    firstName VARCHAR(60) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    isAdmin BOOLEAN DEFAULT 0 NOT NULL,
    birthday DATE,
    gender BOOLEAN,
    employer BOOLEAN DEFAULT 0,
    adress VARCHAR(255),
    zipCode VARCHAR(255),
    country VARCHAR(50),
    city VARCHAR(50),
    FOREIGN KEY (companyID) REFERENCES companies(id)
);

CREATE TABLE offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyID INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    libelle TEXT,
    postedAt DATETIME DEFAULT NOW(),
    jobType VARCHAR(30),
    workingTime VARCHAR(50),
    contractType VARCHAR(50),
    salary VARCHAR(30),
    adress VARCHAR(255) NOT NULL,
    zipCode VARCHAR(255),
    country VARCHAR(50),
    city VARCHAR(50),
    FOREIGN KEY (companyID) REFERENCES companies(id)
);

CREATE TABLE offerApplications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    offersID INT NOT NULL,
    applicantID INT NOT NULL,
    motivationLetter TEXT,
    statut VARCHAR(15) DEFAULT 'Submitted',
    appliedAt DATETIME DEFAULT NOW(),
    FOREIGN KEY (offersID) REFERENCES offers(id),
    FOREIGN KEY (applicantID) REFERENCES users(id)
);