# Document Signature App

This is a MERN stack application for signing PDF documents.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js
* MongoDB

### Installing

1. Clone the repository
2. Install the dependencies for the server

```
cd server
npm install
```

3. Install the dependencies for the client

```
cd client
npm install
```

4. Create a `.env` file in the `server` directory and add your MongoDB connection string

```
ATLAS_URI=your_mongodb_connection_string
```

### Running the application

1. Start the server

```
cd server
node index.js
```

2. Start the client

```
cd client
npm run dev
```
