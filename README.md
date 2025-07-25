# BookMart: Book Sharing and Trading Platfrom


## 📚 Project Overview

BookMart is a modern, full-stack web application designed to foster a vibrant community of book lovers. It provides a seamless platform for users to exchange, sell, and acquire pre-owned books through an innovative credit-based system. Our mission is to make reading more accessible, promote sustainable practices by encouraging book reuse, and connect individuals who share a passion for literature.

## ✨ Key Features

-   **User Authentication & Authorization**: Secure registration, login, and email verification (OTP). Robust JWT-based authentication protects API endpoints, ensuring data integrity and user privacy. Includes a password reset functionality.
-   **Real-time Messaging**: Engage in instant conversations with other users regarding book listings. Powered by Socket.io, this feature provides a fluid and responsive chat experience.
-   **Dynamic Book Listings**: Create, view, and manage detailed book listings. Users can specify book condition, listing type (donate/sell), price, and upload cover images. Advanced server-side filtering and search capabilities allow users to easily discover books by title, author, category, or listing type.
-   **Credit-Based Exchange System**: Donate books to earn credits, which can then be used to request other books from the community. This encourages a circular economy for books.
-   **Direct Purchase Option**: For books listed for sale, users can directly purchase them, offering flexibility beyond the credit system.
-   **Transaction Management**: Comprehensive tracking of book requests and transactions (pending, completed, rejected). Owners can manage incoming requests, approve or decline them, and facilitate the exchange or sale.
-   **Personalized User Profiles**: Each user has a dedicated profile showcasing their shared books, credits balance, and transaction statistics (books donated/received). Users can also update their profile information and picture.
-   **Interactive Notifications**: Stay informed with real-time notifications for new book requests, transaction updates, and other important activities. Notifications are easily accessible and can be marked as read.
-   **Admin Panel**: A dedicated administrative interface for managing users and book listings, ensuring platform health and content moderation.

## 🚀 Technology Stack

> BookMart is built with a robust and scalable architecture, leveraging modern web technologies:

### Frontend

-   **React.js (v19)**: A declarative, component-based JavaScript library for building interactive user interfaces.
-   **Vite**: A next-generation frontend tooling that provides an extremely fast development experience.
-   **Tailwind CSS (v4)**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
-   **React Router DOM**: For declarative routing within the React application.
-   **Axios**: A promise-based HTTP client for making API requests to the backend.
-   **Framer Motion**: A production-ready motion library for React, enabling smooth animations and transitions.
-   **Socket.io Client**: The client-side library for real-time, bidirectional, and event-based communication with the server.

### Backend

-   **Node.js & Express.js**: A powerful JavaScript runtime and a fast, unopinionated, minimalist web framework for building the RESTful API.
-   **MongoDB & Mongoose**: A NoSQL database for flexible data storage, with Mongoose providing elegant MongoDB object modeling for Node.js.
-   **Socket.io**: The server-side library for enabling real-time communication between the server and connected clients.
-   **JSON Web Tokens (JWT)**: For secure, stateless authentication and authorization.
-   **Bcrypt.js**: A library for hashing passwords securely.
-   **Nodemailer**: A module for Node.js applications to allow easy email sending.
-   **Express-fileupload**: Middleware for handling file uploads (e.g., book cover images, profile pictures).

## 🛠️ Getting Started

Follow these instructions to set up and run the BookMart project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm (Node Package Manager)
-   MongoDB (Community Server)
-   Docker & Docker Compose (Optional, for containerized deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/SurajSah776/book-mart.git
cd BookMart
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and create a `.env` file.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following content:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookmart # Or your MongoDB Atlas URI
JWT_SECRET=your_jwt_secret_key # Generate a strong, random key
EMAIL=your_email@gmail.com # Your Gmail address for sending OTP/reset emails
EMAIL_PASSWORD=your_email_app_password # Your Gmail App Password (not your regular password)
```

**Note on `EMAIL_PASSWORD`**: If you are using Gmail, you might need to generate an App Password. Refer to [Google's documentation](https://support.google.com/accounts/answer/185833?hl=en) for instructions.

### 3. Frontend Setup

Navigate to the `frontend` directory and install dependencies.

```bash
cd ../frontend
npm install
```

### 4. Run the Application (Development)

#### Start MongoDB

Ensure your MongoDB server is running. If running locally, you can start it via your MongoDB installation or a tool like MongoDB Compass.

#### Start Backend Server

In the `backend` directory, run:

```bash
npm start # Or npm run dev if you have nodemon configured
```

The backend server will typically run on `http://localhost:5000`.

#### Start Frontend Development Server

In the `frontend` directory, run:

```bash
npm run dev
```

The frontend application will typically be accessible at `http://localhost:5173`.

### 5. Run with Docker (Production/Containerized Development)

Ensure Docker and Docker Compose are installed. From the root directory of the project (`BookMart/`):

```bash
docker-compose up --build -d
```

This command will:
-   Build Docker images for both `backend` and `frontend` services.
-   Start a MongoDB container.
-   Start the backend and frontend services, linking them to MongoDB.

The frontend will be available at `http://localhost:3000`.

**Important**: Remember to configure the `MONGO_URI`, `JWT_SECRET`, `EMAIL`, and `EMAIL_PASSWORD` environment variables within the `docker-compose.yml` file for the `backend` service, replacing placeholders with your actual values.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

-   Inspired by the love for reading and community sharing.
-   Special thanks to all my group members for their contributions.