
# Exchange Book Requests Project

This project is a web application that allows users to manage book exchange requests. Users can send requests to exchange books, and the system allows the owners to accept or reject the requests.

## Features

- View list of exchange requests.
- Accept or reject exchange requests.
- Display book details like title, image, and status.
- Manage authentication via JWT (JSON Web Token).

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT (JSON Web Token)
- **HTTP Client**: Axios
- **State Management**: React's `useState`, `useEffect`
  
## Prerequisites

Before running this project, you need to have the following installed on your system:

- Node.js and npm (Node Package Manager)
- MongoDB (for local development)
- A modern web browser (Chrome, Firefox, etc.)

## Setup

### 1. Clone the repository

First, clone the repository from GitHub to your local machine.

```bash
git clone https://github.com/Ahmad0933-dev/bookexchange.git
cd exchange-book-requests
```

### 2. Install dependencies

Install all the required dependencies for both frontend and backend.

#### For frontend:

Navigate to the `frontend` folder and run the following command:

```bash
cd frontend
npm install
```

#### For backend:

Navigate to the `backend` folder and run the following command:

```bash
cd backend
npm install
```

### 3. Set up environment variables

Both the frontend and backend may require environment variables to run properly. Create a `.env` file in both the frontend and backend directories based on the provided `.env` files.

For example:

- **Frontend**: Set up any required API URLs or configurations.
- **Backend**: Set up your database connection string (`MONGODB_URI`), JWT secret (`JWT_SECRET`), and other necessary credentials.

### 4. Run the backend server

Navigate to the backend directory and run the following command to start the server:

```bash
cd backend
npm start
```

By default, the backend will be accessible at `http://localhost:8000`.

### 5. Run the frontend server

Navigate to the frontend directory and run the following command to start the frontend:

```bash
cd frontend
npm start
```

By default, the frontend will be accessible at `http://localhost:3000`.

### Authentication

The project uses JWT for authentication. Make sure to login using the appropriate API to get a token and include it in the `Authorization` header when making requests.

## Project Structure

```plaintext
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── .env
│   └── package.json
└── README.md
```

## Running Tests

To run tests, navigate to the backend or frontend directory and execute the following commands:

```bash
# For Backend Tests
cd backend
npm run test

# For Frontend Tests (if applicable)
cd frontend
npm run test
```

## Contact

For any questions or issues, feel free to open an issue or contact the project maintainers.