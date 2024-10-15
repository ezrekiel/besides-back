CREATE DATABASE Besides;

USE Besides;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_company INT,
    username VARCHAR(255) UNIQUE NOT NULL, -- l'adresse email
    pass VARCHAR(255) NOT NULL,
    firstName VARCHAR(60) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    isAdmin BOOLEAN DEFAULT 0 NOT NULL,
    birthday DATE NOT NULL,
    phoneNumber VARCHAR(20),
    gender BOOLEAN NOT NULL,
    employer BOOLEAN DEFAULT 0,
    adress VARCHAR(255) NOT NULL,
    zipCode VARCHAR(255),
    country VARCHAR(50),
    city VARCHAR(50)
);

CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(50),
    legalStatus VARCHAR(30),
    activitySector VARCHAR(50)
);

CREATE TABLE jobAds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_company INT NOT NULL,
    reference VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    libelle TEXT,
    postedAt DATETIME DEFAULT NOW(),
    jobType VARCHAR(30),
    workingTime VARCHAR(50),
    salary VARCHAR(30),
    FOREIGN KEY (id_company) REFERENCES companies(id)
);

CREATE TABLE jobApplications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_jobAd INT NOT NULL,
    id_applicant INT NOT NULL,
    motivationLetter TEXT,
    statut VARCHAR(15) DEFAULT 'Submitted',
    appliedAt DATETIME DEFAULT NOW(),
    FOREIGN KEY (id_jobAd) REFERENCES jobAds(id),
    FOREIGN KEY (id_applicant) REFERENCES users(id)
);