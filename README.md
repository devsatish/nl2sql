# Natural Language to SQL

This is a project that consists of two folders: `frontend` and `backend`. The backend is a Python Flask application, while the frontend is a React TypeScript app.

## Backend Setup

To set up the backend, follow these steps:

1. Initialize a virtual environment.
2. Install the required dependencies by running `pip install -r requirements.txt`.
3. Copy the `.env.example` file to `.env` and add your OpenAI key and MySQL credentials.
4. Start the Flask app. It usually starts at port 5000.

## Frontend Setup

To set up the frontend, follow these steps:

1. Run `npm install` to install the necessary dependencies.
2. Run `npm start` to start the application.
3. If your Flask app is starting at a different port, please update the `package.json` file in the proxy section with the correct port.
4. Also, update the `API_URL` in `App.tsx` to ensure it is pointing to the Flask backend.
