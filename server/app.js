const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const path = require('path');
const axios = require('axios');


require('./models/user');

const router =  require('./routes/auth');
const userRoutes = require('./routes/route')

dotenv.config();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials: true}));

const port  = process.env.PORT||8080;

mongoose.connect(`mongodb+srv://dimpy:${process.env.DB_PASSWORD}@cluster0.glj5682.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{
    console.log('database is connected');
}).catch(err =>{
    console.log('Connection error', err.message);
})

app.use('/',router);
app.use('/movie',userRoutes);

app.get('/search', async (req, res) => {
    console.log('inside search api');
    const { title } = req.query;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    const apiKey = 'e350aff8';
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${title}`;
    
    try {
        // console.log(title);
        const response = await axios.get(url);
        // console.log(response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from OMDB API' });
    }
});


app.get('/movieById', async (req, res) => {
    const { imdbID } = req.query;
    //console.log('inside movie api');
    
    if (!imdbID) {
        return res.status(400).json({ error: 'IMDb ID is required' });
    }
    
    const apiKey = 'e350aff8';
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
    
    try {
        console.log(imdbID);
        const response = await axios.get(url);
        if (response.data.Response === "True") {
            // console.log(response.data);
            res.json(response.data);
        } else {
            res.status(404).json({ error: response.data.Error });
        }
    } catch (error) {
        console.error('Error fetching data from OMDB API:', error.message);
        res.status(500).json({ error: 'Error fetching data from OMDB API' });
    }
});



app.use(express.static(path.join(__dirname, 'dist')))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})





const server = app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
   
})
