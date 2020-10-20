import axios from "axios";

const imdbRequest = axios.create({
  baseURL: "https://rapidapi.p.rapidapi.com",
  headers: {
    "x-rapidapi-host": "imdb-internet-movie-database-unofficial.p.rapidapi.com",
    "x-rapidapi-key": "da1360fc04msh2703d4f1fd8bbfdp1a08d1jsne80f4c5db559",
  },
});

export const apiGetFilm = (str) => imdbRequest.get(`/film/${str}`);
