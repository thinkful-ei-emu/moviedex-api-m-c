require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 8000;
const API_TOKEN = process.env.API_TOKEN;
const cors = require('cors');
const helmet = require('helmet');

const movieData = require('./movies-data-small.json');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken (req, res, next){
  const authToken = req.get('Authorization') || '';
  const [ authType, token] = authToken.split(' ');

  if( authType.toLowerCase() !== 'bearer'){
    return res.status(401).json({error: 'No Bearer Token provided'});
  }

  if (token !== API_TOKEN){
    return res.status(401).json({error: 'Invalid Credentails'});
  }
  next();
});

function filterMovie(req, res) {
  let filterMovies = movieData;
  const { genre, country, avg_vote } = req.query;

  if(genre) {
    filterMovies = filterMovies.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if(country) {
    filterMovies = filterMovies.filter(movie => 
      movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  if(avg_vote) {
    let num_avg_vote = Number(avg_vote);
    if(num_avg_vote){
      filterMovies = filterMovies.filter(movie => movie.avg_vote >= num_avg_vote );
    } else{
      res.status(400).json({error:'Please enter a number'});
    }
  }
  res.send(filterMovies);
}

app.use(morgan('dev'));


app.get('/movie', filterMovie);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});