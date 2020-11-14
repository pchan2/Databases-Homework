# Class Database

## Submission

Below you will find a set of tasks for you to complete to set up a databases of students and mentors.

To submit this homework write the correct commands for each question here:

```sql


```

When you have finished all of the questions - open a pull request with your answers to the `Databases-Homework` repository.

## Task

https://github.com/KeithBremer/CYF-DB-Module/blob/master/install/install.md#windows-install

1. Create a new database called `cyf_classes` (hint: use `createdb` in the terminal)
- createdb -U toshiba cyf_classes
- psql -U toshiba cyf_classes

2. Create a new table `mentors`, for each mentor we want to save their name, how many years they lived in Glasgow, their address and their favourite programming language.
- CREATE TABLE mentors (
   id                SERIAL PRIMARY KEY,
   name              VARCHAR(30) NOT NULL,
   yearsInGlasgow    INT NOT NULL,
   address           VARCHAR(120) NOT NULL,
   favLanguage       VARCHAR(30) NOT NULL
);

# to change table name if you make a mistake
- ALTER TABLE customers RENAME TO mentors;

3. Insert 5 mentors in the `mentors` table (you can make up the data, it doesn't need to be accurate ;-)).
- INSERT INTO mentors (name, yearsInGlasgow, address, favLanguage) VALUES ('Marcin Szczot', 4, '12 Hope Road, Glasgow G10 1AH', 'React');
INSERT INTO mentors (name, yearsInGlasgow, address, favLanguage) VALUES ('Keith Barny', 10, '2 Grace Road, Glasgow G19 7EH', 'SQL');
INSERT INTO mentors (name, yearsInGlasgow, address, favLanguage) VALUES ('Kirsty Young', 15, '45 Nice Road, Glasgow G5 4YH', 'HTML');
INSERT INTO mentors (name, yearsInGlasgow, address, favLanguage) VALUES ('Tina Turner', 1, '100 Grand Road, Glasgow G18 2UI', 'CSS');
INSERT INTO mentors (name, yearsInGlasgow, address, favLanguage) VALUES ('Will Smith', 25, '65 Neat Road, Glasgow G25 0QH', 'Node');

4. Create a new table `students`, for each student we want to save their name, address and if they have graduated from Code Your Future.
- CREATE TABLE students (
   id                SERIAL PRIMARY KEY,
   name              VARCHAR(30) NOT NULL,
   address           VARCHAR(120) NOT NULL,
   graduated         BOOLEAN NOT NULL
);

5. Insert 10 students in the `students` table.
- INSERT INTO students (name, address, graduated) VALUES ('Matthew Griffiths', '18 Brooklyn Road, Birmingham B18 9EH', false);
INSERT INTO students (name, address, graduated) VALUES ('Dean West', '20 Charlie Road, Birmingham B8 0IH', true);
INSERT INTO students (name, address, graduated) VALUES ('Matthew Bolton', 'Soho House, Birmingham B18 9AH', true);
INSERT INTO students (name, address, graduated) VALUES ('Tommy Wison', '1 Falconhurst Road, London SW29 9EH', true);
INSERT INTO students (name, address, graduated) VALUES ('Jenny Tutu', '180 Westfield Road, London E48 2PH', false);
INSERT INTO students (name, address, graduated) VALUES ('Anton Johnson', '118 Capthorn Road, Glasgow G1 9YY', false);
INSERT INTO students (name, address, graduated) VALUES ('Luke Hammer', '298 Lucky Road, Glasgow G35 4HA', true);
INSERT INTO students (name, address, graduated) VALUES ('Mary Chan', '33 Moreton Road, Manchester M90 0TB', false);
INSERT INTO students (name, address, graduated) VALUES ('Grace Kelly', '192 Temple Road, Manchester M1 3DH', true);
INSERT INTO students (name, address, graduated) VALUES ('Soo May', '2358 Elderfield Road, Glasgow G10 5YQ', true);

6. Verify that the data you created for mentors and students are correctly stored in their respective tables (hint: use a `select` SQL statement).
- SELECT * FROM mentors;
SELECT * FROM students;

7. Create a new `classes` table to record the following information:

   - A class has a leading mentor
   - A class has a topic (such as Javascript, NodeJS)
   - A class is taught at a specific date and at a specific location

- CREATE TABLE classes (
   id                SERIAL PRIMARY KEY,
   leadMentor        VARCHAR(30) NOT NULL,
   topic             VARCHAR(50) NOT NULL,
   date              DATE NOT NULL,
   location          VARCHAR(120) NOT NULL
);

8. Insert a few classes in the `classes` table
- INSERT INTO classes (leadMentor, topic, date, location) VALUES ('Claire Summers', 'JavaScript', '2020-10-01', 'Zoom');
INSERT INTO classes (leadMentor, topic, date, location) VALUES ('Sunny Long', 'HTML', '2020-10-07', 'Zoom');
INSERT INTO classes (leadMentor, topic, date, location) VALUES ('Sunny Long', 'CSS', '2020-10-14', 'Zoom');
INSERT INTO classes (leadMentor, topic, date, location) VALUES ('Sunny Long', 'JavaScript', '2020-10-21', 'Zoom');
INSERT INTO classes (leadMentor, topic, date, location) VALUES ('Sunny Long', 'React', '2020-10-28', 'Zoom');
INSERT INTO classes (leadMentor, topic, date, location) VALUES ('Claire Summers', 'Node.js', '2020-11-05', 'Zoom');

9. We now want to store who among the students attends a specific class. How would you store that? Come up with a solution and insert some data if you model this as a new table.
- CREATE TABLE class (
   id             SERIAL PRIMARY KEY,
   class_id       INT REFERENCES classes(id),
   student_id     INT REFERENCES students(id)
);

INSERT INTO class (class_id, student_id) VALUES (1, 1);
INSERT INTO class (class_id, student_id) VALUES (1, 2);
INSERT INTO class (class_id, student_id) VALUES (1, 3);
INSERT INTO class (class_id, student_id) VALUES (1, 4);
INSERT INTO class (class_id, student_id) VALUES (1, 5);
INSERT INTO class (class_id, student_id) VALUES (2, 6);
INSERT INTO class (class_id, student_id) VALUES (2, 7);
INSERT INTO class (class_id, student_id) VALUES (2, 8);
INSERT INTO class (class_id, student_id) VALUES (3, 7);
INSERT INTO class (class_id, student_id) VALUES (3, 8);
INSERT INTO class (class_id, student_id) VALUES (3, 9);
INSERT INTO class (class_id, student_id) VALUES (3, 10);

10. Answer the following questions using a `select` SQL statement:
    - Retrieve all the mentors who lived more than 5 years in Glasgow
    - Retrieve all the mentors whose favourite language is Javascript
    - Retrieve all the students who are CYF graduates
    - Retrieve all the classes taught before June this year
    - Retrieve all the students (retrieving student ids only is fine) who attended the Javascript class (or any other class that you have in the `classes` table).

- SELECT * FROM mentors WHERE yearsInGlasgow > 5;
- SELECT * FROM mentors WHERE favLanguage = 'JavaScript';
- SELECT * FROM students WHERE graduated = true;
- SELECT * FROM classes WHERE date < '2020-06-01';
- SELECT * FROM class WHERE class_id = 1 OR class_id = 4;