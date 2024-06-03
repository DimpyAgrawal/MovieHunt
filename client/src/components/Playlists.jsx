import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Playlists() {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [movieDetail, setMovieDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("id");

  const listData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/movie/playlist/${userId}`);
      setUserList(response.data.movieLists);
    } catch (err) {
      console.log('error inside listData', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async () => {
    setLoading(true);
    const details = [];

    for (let i = 0; i < userList.length; i++) {
      const movieId = userList[i].id;
      const isPublic = userList[i].public;

      try {
        const response = await axios.get(`http://localhost:8080/movieById?imdbID=${movieId}`);
        const movieDetails = response.data;
        movieDetails.public = isPublic; // Add the public field to the movie details
        details.push(movieDetails);
      } catch (err) {
        console.log('Error in fetching movie details', err);
      }
    }

    setMovieDetail(details);
    setLoading(false);
    console.log(details);
  };

  const handlePublic = async (imdbID) => {
    console.log('inside handlePublic', imdbID + " " + userId);
    try {
      await axios.put("http://localhost:8080/movie/makePublic", { imdbID, userId }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      // Update the movie list to reflect the change
      setMovieDetail(prevMovieDetail =>
        prevMovieDetail.map(movie => movie.imdbID === imdbID ? { ...movie, public: true } : movie)
      );
    } catch (err) {
      console.log('Error submitting Movie', err);
    }
  };

  const handlePrivate = async (imdbID) => {
    console.log('inside handlePrivate', imdbID + " " + userId);
    try {
      await axios.put("http://localhost:8080/movie/makePrivate", { imdbID, userId }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      // Update the movie list to reflect the change
      setMovieDetail(prevMovieDetail =>
        prevMovieDetail.map(movie => movie.imdbID === imdbID ? { ...movie, public: false } : movie)
      );
    } catch (err) {
      console.log('Error submitting Movie', err);
    }
  };

  useEffect(() => {
    listData();
  }, []);

  useEffect(() => {
    if (userList.length > 0) {
      fetchMovieDetails();
    }
  }, [userList]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 p-6 mr-[10%] ml-[10%] mx-auto">
      {loading && <div className="loader"></div>}

      {movieDetail.map(m => (
        <div key={m.imdbID} className="bg-white shadow-md rounded-lg overflow-hidden">
          <img src={m.Poster} alt={m.Title} className="w-96 h-64 object-cover m-auto" />
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{m.Title}</h2>
            <p className="flex text-black m-auto justify-around font-semibold">{m.Year}</p>
          </div>
          {m.public ?
            <span className="material-symbols-outlined ml-[90%] cursor-pointer" onClick={() => handlePrivate(m.imdbID)}>person</span>
            :
            <span className="material-symbols-outlined ml-[90%] cursor-pointer" onClick={() => handlePublic(m.imdbID)}>groups</span>
          }
        </div>
      ))}
    </div>
  );
}

export default React.memo(Playlists);
