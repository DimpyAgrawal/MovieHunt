### Movie Seen Project

This project is a Movie Seen application built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to search for movies, add them to playlists, and manage the visibility of their playlists.

#### Features:

- Search for movies
- Add movies to playlists
- Manage playlist visibility (public/private)
- Optimized API calls using debounce and throttle
- Utilizes useMemo and useCallback for performance optimization
- Uses React.memo for component memoization

#### Installation:

1. Clone the repository:
   git clone https://github.com/DimpyAgrawal/MovieHunt.git
2. Navigate to the backend directory: cd backend
3. Install backend dependencies: npm install
4. Start the backend server: npm start
   The backend server will start running on port 8080.
5. Open a new terminal window/tab and navigate to the frontend directory: cd ../frontend
6. Install frontend dependencies: npm run dev
The frontend server will start running on a port specified by Vite (usually 5173).

Usage
Once the servers are running, you can access the MovieSeen application by opening your web browser and navigating to http://localhost:5173 (or whichever port your frontend server is running on).


1. Search Movies:

Users can search for movies using the search bar provided in the application.
The search query is sent to the backend API, which fetches movie information from external sources (e.g., IMDb).

2. Add Movies to Playlist:

Users can add movies to their playlists by clicking on the "groups" icon next to each movie.
When a movie is added to the playlist, it is stored in the MongoDB database along with the user's ID.

2. Manage Playlist Visibility:

Users can toggle the visibility of their playlists between public and private.
Public playlists are visible to other users, while private playlists are only visible to the owner.

3. Optimized API Calls:

API calls for searching movies and managing playlists are optimized using debounce and throttle techniques.
Debounce limits the number of API calls made while typing in the search bar, reducing unnecessary requests.
Throttle limits the rate at which API calls can be made for actions like adding movies to the playlist, preventing spamming.

4. Performance Optimization with Hooks:

The project utilizes useMemo and useCallback hooks to optimize re-renders and prevent unnecessary calculations.
useMemo is used to memoize expensive computations, such as filtering movie lists, to improve performance.
useCallback is used to memoize event handlers, ensuring that they do not change on every render.

5. Component Memoization:

React.memo is used to memoize functional components, preventing unnecessary re-renders when props remain unchanged.
This optimization improves the rendering performance of the application by avoiding unnecessary updates to the DOM.

6. Authentication and Authorization:

The application may include authentication and authorization features to ensure that users can only access their own playlists and data.
Users may need to sign in or sign up to access the full functionality of the application.
 
7. Backend API Endpoints:

The backend provides various API endpoints for handling user authentication, movie search, playlist management, and user data retrieval.
These endpoints are responsible for processing requests from the frontend and interacting with the MongoDB database to fetch or update data.

8. Database Management:

MongoDB is used as the database for storing user information, movie data, and playlist details.
The backend communicates with the MongoDB database to perform CRUD (Create, Read, Update, Delete) operations on user and movie data.

9. Error Handling and Validation:

The application includes error handling mechanisms to gracefully handle errors that may occur during API requests or data processing.
Input validation ensures that users provide valid data when performing actions such as searching for movies or adding movies to playlists.
These functionalities combine to create a robust Movie Seen application that allows users to search for movies, create playlists, and manage their movie collections efficiently while optimizing performance and user experience.


Frontend:
  React.js: JavaScript library for building user interfaces.
  Axios: Promise-based HTTP client for making API requests.
  React Router: Library for navigation and routing in React applications.
  Vite: Next-generation frontend build tool that serves the React application with fast hot module replacement (HMR) and optimized build performance.
  Tailwind CSS: Utility-first CSS framework for styling the UI components.
  Font Awesome: Icon library used for displaying icons in the application.
  React Hooks: Utilized hooks like useState, useEffect, react.memo, useMemo, and useCallback for managing state and handling side effects.

Backend:
 Node.js: JavaScript runtime environment for building server-side applications.
 Express.js: Web application framework for Node.js used for building APIs and handling HTTP requests.
 MongoDB: NoSQL database used for storing user data, movie information, and playlists.
 Mongoose: MongoDB object modeling library for Node.js used for interacting with the MongoDB database.
 JWT (JSON Web Tokens): Used for authentication and authorization by generating and validating tokens.
 Bcrypt.js: Library for hashing passwords to ensure secure storage in the database.

Credits
The MovieSeen project was created by Dimpy.
  

   
