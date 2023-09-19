# Getting Started with Create React App

Full-stack project with React framework for the front-end and Node.js for the backend

# Available Scripts

In the project directory, you can run:

## `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
Set "proxy": "http://localhost:4000" to interact with the backend

The page will reload when you make changes.\
You may also see any lint errors in the console.

## `nodemon server.js`

Runs the backend server at http://localhost:4000

# Logic

Create login application that includes database (Firebase) and message service (Twilio).

## Front-end

(1st post) Input a valid phone number to send a POST request to the backend.
(2nd post) Read and input the code to send a POST request to the backend for validation check.

## Back-end

(1st post) Receive the POST request to generate a random 6-digit access code and store it in the database (Firebase).
           Send the generated code as a message to the user's phone number using Twilio.
(2nd post) Receive the POST request to check if the code stored in the database matches the user's input for validation.

