import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { throttle } from 'lodash';
import '../App.css'

const initialMovies = [
    { Title: "The Shawshank Redemption", Year: "1994", imdbID: "tt0111161", Poster: "https://m.media-amazon.com/images/I/51WYsbIa7TS._AC_UF1000,1000_QL80_.jpg" },
    { Title: "The Godfather", Year: "1972", imdbID: "tt0068646", Poster: "https://m.media-amazon.com/images/I/81C9FT0-8CL._AC_UF1000,1000_QL80_.jpg" },
    { Title: "The Dark Knight", Year: "2008", imdbID: "tt0468569", Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg" },
    { Title: "Pulp Fiction", Year: "1994", imdbID: "tt0110912", Poster: "https://cdn.europosters.eu/image/750/posters/pulp-fiction-cover-i1288.jpg" },
    { Title: "The Lord of the Rings: The Return of the King", Year: "2003", imdbID: "tt0167260", Poster: "https://cdn.europosters.eu/image/1300/posters/the-lord-of-the-rings-the-return-of-the-king-i104633.jpg" },
    { Title: "Fight Club", Year: "1999", imdbID: "tt0137523", Poster: "https://m.media-amazon.com/images/I/71o1aRN1FJL.jpg" },
    { Title: "Forrest Gump", Year: "1994", imdbID: "tt0109830", Poster: "https://i.etsystatic.com/23402008/r/il/95ec24/5607149375/il_570xN.5607149375_flx6.jpg" },
    { Title: "Inception", Year: "2010", imdbID: "tt1375666", Poster: "https://m.media-amazon.com/images/I/71DwIcSgFcS.jpg" },
    { Title: "The Matrix", Year: "1999", imdbID: "tt0133093", Poster: "https://m.media-amazon.com/images/I/71PfZFFz9yL._AC_UF1000,1000_QL80_.jpg" },
    { Title: "Goodfellas", Year: "1990", imdbID: "tt0099685", Poster: "https://m.media-amazon.com/images/I/61jwLygxx7L._AC_UF1000,1000_QL80_.jpg" },
];

const MovieSearch = () => {
    const [title, setTitle] = useState('');
    const [movies, setMovies] = useState(initialMovies);
    const [movieList, setMovieList] = useState([]);
    const userId = localStorage.getItem("id");
    const isLogin = localStorage.getItem("loggedin") || false;
    
    const userData = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/movie/playlist/${userId}`);
            setMovieList(response.data.movieLists.map(data => data.id));
           
        } catch (err) {
            console.log('error in userData', err);
        }
    });

    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.get(`http://localhost:8080/search?title=${title}`);
            setMovies(response.data.Search);
          
        } catch (error) {
            console.error('Error fetching data', error);
        }
    });

    const handleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleSave = useCallback(async (imdbID) => {
        try {
            await axios.put("http://localhost:8080/movie/saveLike", { imdbID, userId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            setMovieList(prevList => [...prevList, imdbID]);
        } catch (err) {
            console.log('Error submitting Movie', err);
        }
    }, [userId]);

    const handleUnsave = useCallback(async (imdbID) => {
        try {
            console.log("unsave ",imdbID);
            await axios.put("http://localhost:8080/movie/unsaveLike", { imdbID, userId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            setMovieList(prevList => prevList.filter(id => id !== imdbID));
        } catch (err) {
            console.log('Error submitting Movie', err);
        }
    }, [userId]);

    useEffect(() => {
        const throttledHandleSave = throttle(handleSave, 1000);
        const throttledHandleUnsave = throttle(handleUnsave, 1000);
        userData();
        return () => {
            throttledHandleSave.cancel();
            throttledHandleUnsave.cancel();
        };
    }, [handleSave, handleUnsave]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Movie Search</h1>
            <form onSubmit={handleSearch} className="mb-4 ">
                <input
                    type="text"
                    value={title}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Search for a movie..."
                    className="border rounded p-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto flex-grow"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto">Search</button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mr-[10%]">
                {movies && movies.length > 0 && movies.map(movie => {
                    const isFilled = movieList.includes(movie.imdbID);
                    return (
                        <div key={movie.imdbID} className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl">
                            <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white shadow-lg bg-clip-border rounded-xl h-80">
                                <img className="w-full h-full object-cover" src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"} alt={movie.Title} />
                            </div>
                            <div className="p-6 text-center">
                                <h4 className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">{movie.Title}</h4>
                                <p className="block font-sans text-base text-black antialiased font-medium leading-relaxed">{movie.Year}</p>
                            </div>
                            <div className="flex justify-center p-6 pt-2 gap-7">
                                <a href={`https://www.imdb.com/title/${movie.imdbID}/`} target="_blank" rel="noopener noreferrer" className="block font-sans text-xl antialiased font-normal leading-relaxed text-blue-600">
                                    <i className="fab fa-imdb" aria-hidden="true"></i>
                                </a>
                            </div>
                            {isLogin ? isFilled ?
                                <img className='h-8 w-5 mt-0 justify-end ml-[92%] pb-3 cursor-pointer' src="https://cdn.iconscout.com/icon/free/png-256/free-save-2694322-2236318.png" onClick={() => handleUnsave(movie.imdbID)} alt="" />
                                :
                                <span className="material-symbols-outlined mt-0 justify-end ml-[92%] pb-3 cursor-pointer" onClick={() => handleSave(movie.imdbID)}>bookmark</span>
                            :null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(MovieSearch);
