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

### Video Module

This module primarily utilizes PeerJs, which is built on top of WebRTC. In our project, we have integrated a new `videoRoomListeners` specifically for PeerJs event transmission. It uses `peerIds` for user identification and `roomId` to distinguish different rooms. Only users within the same room will receive updates, enabling multiple users to join different rooms.

On the frontend side, when a user clicks on the video, they are redirected to a new URL. The suffix of this URL is the room name, which corresponds to the channel name. We use this to retrieve events sent by the socket to the specific room.

### Group Admin

Features in the Group Admin dashboard include creating groups, creating channels, deleting groups, assigning users to groups, and removing groups. A Group Admin can only access groups they've created. The `createdBy` field in the group model facilitates this, allowing us to fetch groups created by a specific Group Admin based on the user ID passed down from the middleware.

### Super Admin

Super Admins are granted permissions to elevate regular users to either Group Admin or Super Admin statuses. They have unrestricted access to all routes and groups.

### Avatar Upload

For local file handling, we've implemented the `multer` package. It assists in storing files sent from the frontend locally. An 'upload' directory is integrated, and user-uploaded images are stored here. An additional `profileImage` field has been set up for users. Files are saved with a timestamped name to avoid duplication. This way, users can retrieve the avatars they've uploaded.

### Image Transmission in Chat

A simple approach was taken for image handling. Due to image rendering requirements, HTML formatting was implemented on the frontend instead of just plain text. When users send an image, the base64 data of the image is transmitted, embedded within an HTML image tag. This is then broadcast via the socket. All users in the channel can receive this base64 data, which, when rendered using HTML on the frontend, displays the image.