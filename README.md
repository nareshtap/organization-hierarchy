# Organization Hierarchy

## Overview
This project implements a system to manage an organization hierarchy. It allows users to add designations, assign employees to those designations, and view the entire organization hierarchy in a tree structure. 

## Technologies used:

- React (TypeScript)
- Node.js 
- MongoDB 

## Features
- **Add Designations**: Add new designations with or without a parent designation (treating it as a top-level node if no parent is provided).
- **Add Employees**: Assign employees to a specific designation in the hierarchy.
- **Retrieve Organization Hierarchy**: View the organization hierarchy as a tree structure, with each node displaying the designation name, employees, and child designations.
- **Tree View**: Display the organization hierarchy in a collapsible tree structure.
- **Edit and Delete**: Edit or Delete designations and employees.

## Frontend

Functionality:

1. **Tree View**: Display the organization hierarchy in a collapsible tree structure, showing designations and employees.
2. **Adding Designations**: UI to add new designations, either as top-level or nested under existing designations.
3. **Adding Employees**: UI to add employee details and assign them to a specific designation.
4. **Edit and Delete Designations and Employees**: Edit or Delete designations and employees.

## Backend

Functionality:

1. **Retrieve Organization Hierarchy**: Retrieve the entire hierarchy as a tree structure with designations, employees, and child designations.
2. **Add Designations**: Add a designation along with its parent designation (if applicable).
3. **Add Employees**: Add employee details and assign them to a specific designation.
4. **Edit or Delete Designations and Employees**: Edit or Delete designations and employees.

## Database
MongoDB is used to store the data.

## Setup Instructions

### 1. Install Dependencies
First, clone the repository and install the dependencies:

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd backend
npm install
```

### Database Migration (Optional)
To create the database collection with dummy data, run the migration file from the backend directory:

```bash
# Run the migration file to create collections and populate dummy data
cd backend
npm run migrate
```

This will set up the collections in MongoDB with initial data for testing purposes.

### 2. Run the Application

#### Backend
To run the Node.js backend, navigate to the `backend` directory and run:

```bash
# Run the backend server
cd backend
npm start
```

This will start the backend server on the default port.

#### Frontend
To run the React frontend, navigate to the `frontend` directory and run:

```bash
# Run the frontend development server
cd frontend
npm run dev
```

This will start the React development server, typically available at `http://localhost:5173`.

## GIF Preview
Attached is a working gif file that demonstrates the functionality of the organization hierarchy system.

