# Chat Room System

A chat room based system designed to facilitate real-time online communication.

## Tech Stack

- **Frontend**: 
  * AngularJs
  * Axios
- **Backend**: 
  * NodeJs
  * Mongoose
  * ExpressJs
  * JWT
- **Testing**: 
  * Mocha

## Getting Started

1. **Install Dependencies**: At the root directory of the project, run:
```
npm install
```

2. **Setup Frontend**: Navigate to the frontend directory and install the frontend dependencies:
```
cd frontend
npm install
```

3. **Seed the Database**:
```
db seedRoles
// we need SuperAdmin in default
db seedUsers
```

4. **Start Backend**:
```
node server.js
```

5. **Start Frontend**:
```
cd frontend
ng serve
```

## Database Schema

### Users Table:
- Storing user information.
- Key fields: 
* email
* username
* password
* roles
* groups

### Roles Table:
- Defining user permissions.
- Key fields: 
* Role name
* role permissions (stored as an array of strings)

### Groups Table:
- Each group contains specific channels.
- Key fields: 
* group name
* channels

### Channels Table:
- Represents individual chat rooms. Only users within a group can join its respective chat rooms.
- Key field: 
* name

## Permission Design

The system follows the **Role Based Access Control (RBAC)** principle. Permissions are controlled primarily by roles. A user can have multiple roles, with each role granting different permissions. The roles associated with a user are stored as an array of role IDs within their user information.

## Security & Accessibility

- The system use JWT to ensure that the backend retrieves the login user's information. As JWTs are stateless and immutable, the user ID is embedded within the JWT payload. This allows the backend to decode and recognize the specific user and their corresponding permissions.

- Middleware is implemented to inspect user roles and permissions. Actions, such as creating a group or channel, are routed through the middleware. The JWT is decoded to verify user permissions before proceeding to the data processing steps.

- On the frontend, upon user login, user details and the JWT token are stored in local storage. This ensures that the token is included in the header of every request, notifying the backend of the identity of the user on the frontend.