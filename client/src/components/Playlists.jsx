import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Playlists() {

  const [userList, setUserList] = useState([]);
  const [movieDetail, setMovieDetail] = useState([]);
  const userId = localStorage.getItem("id");
  // console.log(movieDetail);
  // console.log(userId);

  const listData = async () => {

    try {
      // console.log('inside listData', userId);
      const response = await axios.get(`http://localhost:8080/movie/playlist/${userId}`);
      // console.log(response.data.movieLists);
      setUserList(response.data.movieLists);
    } catch (err) {
      console.log('error inside listdata', err);
    }

  }

  const fetchMovieDetails = async () => {
    const details = [];
    for (let i = 0; i < userList.length; i++) {
      const movieId = userList[i].id;

      // console.log(movieId);
      try {
        const response = await axios.get(`http://localhost:8080/movieById?imdbID=${movieId}`);
        // console.log(response.data);
        details.push(response.data);

        setMovieDetail(details);
      } 
      
      catch (err) {
        console.log('Error in fetching movie details', err);
      }
    }
    // console.log(details);

  }

 

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
        setMovieDetail(movieDetail.map(movieDetail => movieDetail.imdbID === imdbID ? { ...movieDetail, othersCanSee: true } : movieDetail));
      } catch (err) {
        console.log('Error submitting Movie', err);
      }


  }


  const handlePrivate = async (imdbID) => {
      // console.log('inside handlePrivate', imdbID + " " + userId);
      try {
        await axios.put("http://localhost:8080/movie/makePrivate", { imdbID, userId }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        // Update the movie list to reflect the change
        setMovieDetail(movieDetail.map(movieDetail => movieDetail.imdbID === imdbID ? { ...movieDetail, othersCanSee: false } : movieDetail));
      } catch (err) {
        console.log('Error submitting Movie', err);
      }

  }



  useEffect(() => {
    listData();
  
  }, [])

  useEffect(() => {
    if (userList.length > 0){
        fetchMovieDetails();

    } 

  }, [userList])

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-20 p-6 mr-[10%] ml-[10%] mx-auto">
      {movieDetail.map(m => (
        <div key={m.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <img src={m.Poster} alt={m.Title} className="w-96 h-64 object-cover m-auto" />
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{m.Title}</h2>
            <p className="flex text-black m-auto justify-around font-semibold">{m.Year}</p>
          </div>
          {m.othersCanSee ?
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