Sure! Here’s the complete `README.md` file in a single block of code for your GitHub repository:

```markdown
# Emotorad Backend Task

This is a backend application for Emotorad that uses SQLite and Sequelize ORM to manage contacts. The server is built using Express.js and handles endpoints to identify and manage contacts based on email and phone number.

## Prerequisites

Before you begin, ensure that you have met the following requirements:

- **Node.js** and **npm** installed on your machine.
- **SQLite** installed on your machine.

### Install Node.js and npm (if not already installed)

1. Update your package list:
   ```bash
   sudo apt update
   ```

2. Install Node.js and npm:
   ```bash
   sudo apt install nodejs npm
   ```

3. Verify the installation:
   ```bash
   node -v
   npm -v
   ```

   If you have Node.js and npm installed already, you can skip this step.

### Install SQLite

1. Download and install SQLite:
   ```bash
   sudo apt install sqlite3
   ```

2. Verify SQLite installation:
   ```bash
   sqlite3 --version
   ```

## Project Setup

1. **Clone the repository:**

   If you haven't already cloned the repository, you can clone it using the following command:

   ```bash
   git clone https://github.com/your-username/emotorad-backend-task.git
   ```

   Replace `your-username` with your actual GitHub username.

2. **Navigate to the project directory:**

   ```bash
   cd emotorad-backend-task
   ```

3. **Install project dependencies:**

   Inside the project directory, install all dependencies listed in `package.json`:

   ```bash
   npm install
   ```

## Running the Application

1. **Start the server:**

   To start the application, run the following command:

   ```bash
   npm start
   ```

   This will start the server on `http://localhost:3000`.

2. **Verify the server is running:**

   Open your browser or use `curl` to verify that the application is working:

   ```bash
   curl http://<IP_Address>:3000
   ```

   You should receive the following response:

   ```
   Welcome to the Emotorad Backend Task API
   ```

## API Endpoints

### 1. **POST /identify**

#### Request Body

The request body should contain either an email or a phone number (or both). Here's an example:

```json
{
  "email": "john.doe@example.com",
  "phoneNumber": "123-456-7890"
}
```

#### Response

- **200 OK**: A JSON object containing the primary contact ID, emails, phone numbers, and secondary contact IDs.

Example response:

```json
{
  "primaryContactId": 1,
  "emails": ["john.doe@example.com", "secondary.email@example.com"],
  "phoneNumbers": ["123-456-7890", "987-654-3210"],
  "secondaryContactIds": [2, 3]
}
```

- **500 Internal Server Error**: If there is an error processing the request, you will receive a response like this:

```json
{
  "error": "An error occurred while processing the request."
}
```

## Database

The project uses SQLite for data storage. The SQLite database is created automatically when you run the application for the first time. The database file is stored in the project directory as `database.sqlite`.

### Database Schema

The `Contact` table has the following columns:

- `id`: Primary key, auto-incremented integer.
- `phoneNumber`: The contact's phone number (optional).
- `email`: The contact's email address (optional).
- `linkedId`: Foreign key linking secondary contacts to primary contacts (optional).
- `linkPrecedence`: Enum value (`primary` or `secondary`) indicating whether the contact is primary or secondary.
- `createdAt`: Timestamp when the contact was created.
- `updatedAt`: Timestamp when the contact was last updated.
- `deletedAt`: Timestamp when the contact was deleted (optional).
