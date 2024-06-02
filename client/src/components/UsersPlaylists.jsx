import axios from 'axios';
import React, { useEffect, useState } from 'react';

function UsersPlaylists() {
  const [publicMovies, setPublicMovies] = useState([]);

  // Function to fetch public movies
  const fetchPublicMovies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/movie/allPublicMovies', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      setPublicMovies(response.data);
    } catch (error) {
      console.error('Error fetching public movies:', error);
    }
  };

  useEffect(() => {
    fetchPublicMovies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Others WishList</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publicMovies.length > 0 ? (
          publicMovies.map(movie => (
            <div key={movie.imdbID} className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
              <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white shadow-lg bg-clip-border rounded-xl h-80">
                <img className="w-full h-full object-cover" src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"} alt={movie.Title} />
              </div>
              <div className="p-6 text-center">
                <h4 className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">{movie.Title}</h4>
                <p className="block font-sans text-base text-black antialiased font-medium leading-relaxed">{movie.Year}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No public movies available</p>
        )}
      </div>
    </div>
  );
}

export default React.memo(UsersPlaylists);
