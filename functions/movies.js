const {query} = require('./util/hasura');
const {URL} = require('url');
const fetch = require('node-fetch');





exports.handler = async () => {

const {Movies} = await query({
    query:`
    query{
        Movies {
          id
          poster
          tagline
          title
        }
      }  
    `
})

const api = new URL('https://www.omdbapi.com/');

const promises = Movies.map((movie) => {

    api.searchParams.set('i', movie.id);
    api.searchParams.set('apikey', process.env.OMDB_API_KEY);


    return fetch(api).then(res => res.json())
    
    .then((data) => {

        const scores = data.Ratings;
      
        return {
            ...movie, 
            scores,
        };
    })
})

const moviesWithRatings = await Promise.all(promises);


 return {
     statusCode: 200,
     body: JSON.stringify(moviesWithRatings),
 };

};