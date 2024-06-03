import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import '../App.css';

function UsersPlaylists() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiKey = 'e350aff8';

  // Function to fetch movie details
  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  // Function to fetch all users' data and their movie details
  const allData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/movie/allUsersData', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      const users = response.data;
      for (let user of users) {
        for (let movie of user.movieLists) {
          if (movie.public) {
            const movieDetails = await fetchMovieDetails(movie.id);
            movie.details = movieDetails;
          }
        }
      }

      setUsersData(users);
      setLoading(false);
    } catch (err) {
      console.log('Error fetching all users data:', err);
    }
  }, []);

  useEffect(() => {
    allData();
  }, [allData]);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-4xl ml-[5%] font-bold mb-4">Others WishList</h1>
      {loading && <div className="loader"></div>}
      {usersData.map(user => (
        <div key={user._id} className="mb-8">
          <h2 className="text-3xl ml-[5%] font-semibold mb-4">{user.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ml-[5%] mr-[5%]">
            {user.movieLists.filter(movie => movie.public).map(movie => (
              <div key={movie.id} className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
                {movie.details && (
                  <>
                    <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white shadow-lg bg-clip-border rounded-xl h-80">
                      <img className="w-full h-full object-cover" src={movie.details.Poster !== "N/A" ? movie.details.Poster : "https://via.placeholder.com/300x450?text=No+Image"} alt={movie.details.Title} />
                    </div>
                    <div className="p-6 text-center">
                      <h4 className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">{movie.details.Title}</h4>
                      <p className="block font-sans text-base text-black antialiased font-medium leading-relaxed">{movie.details.Year}</p>
                    </div>
                  </>
                )}
              </div>

            ))}
          </div>
          <hr class="h-px my-8 bg-black border-0 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}

export default React.memo(UsersPlaylists);
