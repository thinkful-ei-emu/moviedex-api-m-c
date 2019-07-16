const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 8000;

const movieData = require('./movies-data-small.json');

const app = express();

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
    let avg_vote = parseFloat(avg_vote);
    filterMovies = filterMovies.filter(movie => movie.avg_vote >= avg_vote );
  }
  console.log('hello');
  res.send(filterMovies);
}

app.use(morgan('dev'));


app.get('/movie', filterMovie);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});