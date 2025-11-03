# TaskFlow: Full-Stack Task Management App


TaskFlow is a comprehensive full-stack task management application featuring a subscription-based model. It provides a seamless experience for users to register, subscribe, and manage their daily tasks. The application is built with a React frontend and a Node.js/Express backend, utilizing Firebase for authentication and data storage, and Razorpay for payment processing.

## Features

-   **User Authentication**: Secure user registration and login handled by Firebase Authentication.
-   **Subscription Management**: A subscription-based system using Razorpay. Users must subscribe to a plan to access the task management dashboard.
-   **Task CRUD Operations**: Users can create, read, update, and delete tasks.
-   **Task Status Toggling**: Easily toggle tasks between 'pending' and 'completed' states.
-   **Filtering and Sorting**: Filter tasks by status (all, pending, completed) and sort them by due date.
-   **Protected Routes**: The main dashboard is protected and only accessible to authenticated users with an active subscription.
-   **Responsive UI**: A modern and responsive interface built with React and Tailwind CSS.
-   **Real-time Updates**: Real-time updates for authentication status and user data using Firebase listeners.

## Tech Stack

| Component    | Technologies                                                                                                 |
| :----------- | :----------------------------------------------------------------------------------------------------------- |
| **Frontend** | React, Vite, Tailwind CSS, React Router, Axios, Firebase Client SDK, `react-hot-toast`, `lucide-react`          |
| **Backend**  | Node.js, Express.js, Firebase Admin SDK (Auth & Firestore), Razorpay SDK, Helmet, CORS, `express-validator` |

## Project Structure

The repository is a monorepo containing two main folders:

-   `backend/`: Contains the Node.js/Express server, API routes, middleware, and services.
-   `frontend/`: Contains the React application, components, contexts, and API service integration.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm (or a similar package manager)
-   A Firebase project
-   A Razorpay account

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `backend` root and add the following environment variables:

    ```env
    # Server configuration
    PORT=5000
    FRONTEND_URL=http://localhost:5173

    # Firebase Admin SDK Configuration
    # This is a JSON string. Get this from your Firebase project settings -> Service accounts.
    FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", "project_id": "...", ...}'

    # Razorpay API Keys
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ```
    *Note: To use the `FIREBASE_SERVICE_ACCOUNT` JSON in your `.env` file, ensure it's a single line with `\n` characters for newlines escaped, or handle multiline variables according to your shell/environment.*

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `frontend` root. You can copy the contents from `frontend/.env` and replace the values with your Firebase web app configuration:

    ```env
    VITE_REACT_APP_API_URL=http://localhost:5000/api

    # Firebase Web App Configuration
    # Get this from your Firebase project settings -> General tab.
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## API Endpoints

The backend server exposes the following RESTful API endpoints:

| Method | Endpoint                    | Description                                  |
| :----- | :-------------------------- | :------------------------------------------- |
| `GET`  | `/api/health`               | Checks the server's health status.           |
| `GET`  | `/api/auth/profile/:uid`    | Retrieves a user's profile data.             |
| `GET`  | `/api/tasks`                | Fetches all tasks for the authenticated user. |
| `POST` | `/api/tasks`                | Creates a new task.                           |
| `PUT`  | `/api/tasks/:id`            | Updates an existing task.                     |
| `DELETE` | `/api/tasks/:id`            | Deletes a task.                             |
| `PATCH`| `/api/tasks/:id/toggle`       | Toggles the status of a task.               |
| `POST` | `/api/payment/process`      | Creates a Razorpay order.                   |
| `POST` | `/api/payment/verification` | Verifies a payment and updates user subscription. |
| `GET`  | `/api/payment/getKey`       | Provides the Razorpay Key ID to the frontend. |
