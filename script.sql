CREATE DATABASE Besides;

USE Besides;

CREATE TABLE adresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adress VARCHAR(255),
    zipCode VARCHAR(255),
    country VARCHAR(50),
    city VARCHAR(50),
    phoneNumber VARCHAR(20)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_adress INT,
    username VARCHAR(255) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    firstName VARCHAR(60) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    isAdmin BOOLEAN,
    birthday DATE,
    phoneNumber VARCHAR(20),
    gender BOOLEAN,
    FOREIGN KEY (id_adress) REFERENCES adresses(id)
);

CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_adress INT,
    username VARCHAR(255) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    companyName VARCHAR(50),
    legalStatus VARCHAR(30),
    creationDate DATE,
    activitySector VARCHAR(50),
    FOREIGN KEY (id_adress) REFERENCES adresses(id)
);

CREATE TABLE jobAds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_company INT NOT NULL,
    reference VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    libelle TEXT,
    postedAt DATETIME,
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
    appliedAt DATETIME,
    FOREIGN KEY (id_jobAd) REFERENCES jobAds(id),
    FOREIGN KEY (id_applicant) REFERENCES users(id)
);

INSERT INTO adresses (adress, city, country, email, phoneNumber, zipCode) VALUES ('1 rue du soleil', 'Montpellier', 'France', 'test1@test.com', '0611111111', '34000');
INSERT INTO adresses (adress, city, country, email, phoneNumber, zipCode) VALUES ('2 rue du soleil', 'Montpellier', 'France', 'test2@test.com', '0611111112', '34000');
INSERT INTO adresses (adress, city, country, email, phoneNumber, zipCode) VALUES ('3 rue du soleil', 'Montpellier', 'France', 'test3@test.com', '0611111113', '34000');

INSERT INTO companies (activitySector, companyName, creationDate, legalStatus, id_adress) VALUES ('secteur test', 'Nom entreprise test', '2024-10-09', 'statut test', 1);

INSERT INTO users (birthday, firstName, lastName, gender, isAdmin, id_adress) VALUES ('2000-10-07', 'user1', 'userlastname1', 1, 1, 1, 'test1@test.com');
INSERT INTO users (birthday, firstName, lastName, gender, isAdmin, id_adress) VALUES ('2000-10-08', 'user2', 'userlastname2', 0, 1, 1, 'test1@test.com');

INSERT INTO jobads (jobType, libelle, postedAt, reference, title, workingTime, id_company) VALUES ('temps plein', 'ceci est une offre test pour un emploi', '2024-10-09 10:39:00', 'AZE1', 'Titre annonce test', '35', 1);
INSERT INTO jobads (jobType, libelle, postedAt, reference, title, workingTime, id_company) VALUES ('temps partiel', 'ceci est une offre test pour un emploi 2', '2024-10-09 10:39:01', 'AZE2', 'Titre annonce test 2', '25', 1);
INSERT INTO jobads (jobType, libelle, postedAt, reference, title, workingTime, id_company) VALUES ('temps complet', 'ceci est une offre test pour un emploi 3', '2024-10-09 10:39:02', 'AZE3', 'Titre annonce test 3', '30', 1);


-- SELECT FROM 
-- UPDATE SET WHERE
-- DELETE FROM companies WHERE phoneNumber =  " "


