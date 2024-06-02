const express = require('express');
const app = express();
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const axios = require('axios');



router.put('/saveLike', async (req, res) => {
    const { imdbID, userId } = req.body;
    console.log("inside savelike", imdbID, userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const movieExists = user.movieLists.some(movie => movie.id === imdbID);
        if (movieExists) {
            return res.status(400).json({ message: "User already saved the movie" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { movieLists: { id: imdbID } } },
            { new: true }
        );

        return res.status(200).json({ message: 'Movie is saved', user });

    } catch (err) {
        console.error('Error saving the movie', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/unsaveLike', async (req, res) => {
    const { imdbID, userId } = req.body;
    console.log("inside unsaveMovie", imdbID, userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Pull the movie from the movieLists array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { movieLists: { id: imdbID } } },
            { new: true }
        );

        return res.status(200).json({ message: 'Movie is unsaved', user: updatedUser });

    } catch (err) {
        console.error('Error unsaving the movie', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/playlist/:userId', async (req, res) => {
    const { userId } = req.params;
    // console.log('inside playlist', userId);
    const userData = await User.findById(userId);
    try {

        if (!userData) {
            return res.status(404).json({ message: 'user does not exist' });
        }
        return res.status(200).json({ movieLists: userData.movieLists });

    } catch (err) {
        res.status(400).json({ message: 'Internal server error' });
    }
})


router.put('/makePublic', async (req, res) => {
    const { imdbID, userId } = req.body;


    try {
        const userDetails = await User.findById(userId);
        if (!userDetails) return res.status(404).json({ message: 'user not found' });

        const movieDetails = userDetails.movieLists.find(m=>m.id===imdbID);
        console.log(movieDetails);

        if (!movieDetails) return res.status(404).json({ message: 'Movie not found in user\'s list' });
        
        movieDetails.public = true;
        await userDetails.save();

        res.status(200).json(userDetails);

    } catch (err) {
        res.status(400).json({ message: 'Internal server error' });
    }
})

router.put('/makePrivate', async (req, res) => {
    const { imdbID, userId } = req.body;


    try {
        const userDetails = await User.findById(userId);
        if (!userDetails) return res.status(404).json({ message: 'user not found' });

        const movieDetails = userDetails.movieLists.find(m=>m.id===imdbID);
        console.log(movieDetails);

        if (!movieDetails) return res.status(404).json({ message: 'Movie not found in user\'s list' });
        
        movieDetails.public = false;
        await userDetails.save();
        
        res.status(200).json(userDetails);


    } catch (err) {
        res.status(400).json({ message: 'Internal server error' });
    }
})

router.get('/allPublicMovies', async (req, res) => {
    try {
      const users = await User.find({ 'movieLists.public': true });
      let publicMovies = [];
  
      // Collect all public movies using for loops
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        for (let j = 0; j < user.movieLists.length; j++) {
          const movie = user.movieLists[j];
          if (movie.public) {
            publicMovies.push(movie.id);
          }
        }
      }
  
      // Fetch movie details from OMDB API
      const apiKey = 'e350aff8';
      const movieDetails = await Promise.all(publicMovies.map(async (imdbID) => {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
        return response.data;
      }));
  
      res.status(200).json(movieDetails);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Internal server error' });
    }
  });



module.exports = router;





