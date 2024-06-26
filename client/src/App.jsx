import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home'
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MovieSearch from './components/MovieSearch';
import MovieDetails from './components/MovieDetails';
import { ToastContainer } from 'react-toastify';

// Lazy load the components

const Playlists = lazy(() => import('./components/Playlists'));
const UsersPlaylists = lazy(() => import('./components/UsersPlaylists'));

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/signin' element={<SignIn />} />
            <Route exact path='/signup' element={<SignUp />} />
            <Route exact path='/playlists' element={<Playlists />} />
            <Route exact path='/usersplaylists' element={<UsersPlaylists />} />
            <Route exact path='/moviedetails' element={<MovieDetails />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}

export default App;
