# Reporting Assignment API

This project is a Node.js + Express reporting API built using MySQL and Sequelize ORM.  
It provides CRUD and aggregation endpoints for multiple flat reporting tables.

The goal of the assignment is to demonstrate:
- Flat reporting table design
- Aggregation queries
- Clean API structure
- Working CRUD operations
- Testable endpoints

---

## Tech Stack

- Node.js
- Express
- MySQL
- Sequelize ORM
- dotenv

---

## Project Structure

reporting-assignment/
├── src/
│ ├── models/ # Sequelize models
│ ├── services/ # CRUD route handlers
│ └── aggregations/ # Aggregation endpoints
├── docs.html # Static API documentation
├── populate-tables.js # Script to populate tables with mock data
├── flat-db-example.sql # Example database schema
├── connection.js # Sequelize database connection
├── index.js # Application entry point
├── package.json
└── README.md


## Running Project

1 - run "npm install" command
2 - create a .env in root of project
3 - add this keys to env:
    DB_USER=your_database_username
    DB_PASS=your_database_password
4 - run command "npm run start"