
Project Overview
This is an Express.js application for managing a platform related to student and admin activities. Below is an overview of the key components and features.

Table of Contents
Dependencies
MongoDB Configuration
Middleware
Routes
Socket.io
View Engine
Static Files
CORS Configuration
Passport Authentication
Error Handling
Server Configuration
Status Codes
Dependencies
Express.js
MongoDB with Mongoose
Socket.io
Passport.js
EJS (view engine)
Helmet (commented out)
Morgan
CORS
Body-parser
Cookie-parser
MongoDB Configuration
Connection to MongoDB is established using Mongoose.
Database connection status logging.
Middleware
Morgan for logging requests.
Helmet for security (commented out).
Body-parser for parsing JSON, raw, text, and URL-encoded formats.
Cookie-parser for handling cookies.
Routes
Multiple routers are used for different functionalities (launchroutes, adminroutes, adminlaunchroutes, studentroutes, coworkroutes).
Routes for user authentication, home, and various functionalities.
Error handling for 404 and 500.
Socket.io
Socket.io server is created and managed separately (socketServer.js).
Socket.io integrated into the main server.
View Engine
EJS is set as the view engine.
Views are rendered for the main application and admin panel.
Static Files
Static files are served from the public directory.
CORS Configuration
CORS is configured to allow requests from specific origins.
Passport Authentication
Passport.js is used for authentication.
Strategies for regular users and admin users.
Token-based authentication.
Error Handling
Custom error pages for 404 and 500 errors.
Console logging of stack trace for server errors.
Server Configuration
Two separate servers are created using http.createServer for the main app and the admin panel.
Status Codes
Status codes are used for indicating the result of API requests.
200: Success
500: Server Error
501: Empty
404: Not Found
Instructions for Running
Install dependencies using npm install.
Set up a MongoDB database and update the connection details in ./database/mongodb.js.
Create a .env file with required configurations.
Run the application using npm start or as per the configured script.
Feel free to contribute or report issues!
