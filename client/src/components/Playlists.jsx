import axios from 'axios';
import React, { useCallback, useMemo, useEffect, useState } from 'react'
import debounce from 'lodash';
import { throttle } from 'lodash';
import '../App.css'
import { useNavigate } from 'react-router-dom';

function Playlists() {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [movieDetail, setMovieDetail] = useState([]);
  const [loading, setLoding] = useState(true);

  const userId = localStorage.getItem("id");
  // console.log(movieDetail);
  // console.log(userId);

  const listData = useCallback(async () => {

    try {
      // console.log('inside listData', userId);
      const response = await axios.get(`http://localhost:8080/movie/playlist/${userId}`);
      // console.log(response.data.movieLists);
      setUserList(response.data.movieLists);
      setLoding(false);

    } catch (err) {
      console.log('error inside listdata', err);
    }

  })

  const fetchMovieDetails = useCallback(async () => {
    setLoding(true);
    const details = [];
    for (let i = 0; i < userList.length; i++) {
      const movieId = userList[i].id;
      const isPublic = userList[i].public;

      try {
        const response = await axios.get(`http://localhost:8080/movieById?imdbID=${movieId}`);
        const movieDetails = response.data;
        movieDetails.public = isPublic; // Add the public field to the movie details

        details.push(movieDetails);

        setMovieDetail(details);
        setLoding(false);

        // console.log(details);
      } catch (err) {
        console.log('Error in fetching movie details', err);
      }
    }

    // console.log(details); 
  });

  const handlePublic = useCallback(async (imdbID) => {
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
  })

  const handlePrivate = useCallback(async (imdbID) => {
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
  })

  // const debouncedListData = useMemo(() => debounce(listData, 300), [listData]);
  // const throttledFetchMovieDetails = useMemo(() => throttle(fetchMovieDetails, 1000), [fetchMovieDetails]);

  // useEffect(() => {
  //   debouncedListData();
  //   return () => {
  //     debouncedListData.cancel();
  //   };
  // }, [debouncedListData]);



  // useEffect(() => {
  //   if (userList.length > 0) {
  //     throttledFetchMovieDetails();
  //   }
  //   return () => {
  //     throttledFetchMovieDetails.cancel();
  //   };
  // }, [userList, throttledFetchMovieDetails]);

  useEffect(() => {
    listData();

  }, [])

  useEffect(() => {
    if (userList.length > 0) {
      fetchMovieDetails();

    }

  }, [userList])

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-20 p-6 mr-[10%] ml-[10%] mx-auto">
      {loading && <div className="loader"></div>}

      {movieDetail.map(m => (
        <div key={m.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <img src={m.Poster} alt={m.Title}  className="w-96 h-64 object-cover m-auto" />
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{m.Title}</h2>
            <p className="flex text-black m-auto justify-around font-semibold">{m.Year}</p>
          </div>
          {m.public ?
            <span class="material-symbols-outlined ml-[90%] cursor-pointer" onClick={() => handlePrivate(m.imdbID)}>person</span>
            :
            <span class="material-symbols-outlined ml-[90%] cursor-pointer" onClick={() => handlePublic(m.imdbID)}>groups</span>
          }
        </div>
      ))}

    </div>

  )
}

export default React.memo(Playlists)