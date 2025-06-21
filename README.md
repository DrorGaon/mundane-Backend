# mundane — Backend

Node.js and Express backend API with WebSocket support for mundane, managing data and real-time updates.  
Built with Node.js, Express, and MongoDB (native driver).  
Part of a two-repository project including frontend application.

## Features

- REST API endpoints for boards, tasks, users, and authentication  
- WebSocket server broadcasting updates on board changes  
- Modular API structure organized by feature  
- MongoDB integration without Mongoose

- REST API endpoints for boards, tasks, users, and authentication  
- WebSocket server broadcasting updates on board changes  
- Modular API structure organized by feature  
- MongoDB integration without Mongoose  
- Supports user authentication, session handling, and data persistence  
  
## Technologies

- Node.js (ESM)  
- Express.js
- MongoDB (native driver)  
- WebSocket with socket.io 
- JavaScript (ES6+)

## Setup

1. Clone the repo  
2. `cd client && npm install`  
3. `npm start`  
   - Ensure MongoDB is running locally or update the connection string in the config file
