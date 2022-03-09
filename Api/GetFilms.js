import { API_KEY } from "./apiKey";


export default class GetFilms {
  static async getSoonMovies() {

    try {
      const response =  await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ru`);
      const soonData = await response.json();

      return soonData;

    } catch (error) {
      console.error(error);
    }
  }

  static async getPremiereMovies(page) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${page}`)
      const premiereData = await response.json();

      return premiereData;

    } catch (error) {
      console.error(error);
    }
  }

  static async getPopularMovies() {
    try {

      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ru&sort_by=popularity.desc&include_video=true`)
      const popularData = await response.json();

      return popularData;

    } catch (error) {
      console.error(error);
    }
  }

  static async getDetailFilm(id){
    try {

      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`)
      const detailData = await response.json();

      return detailData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getSimilarFilm(id){
    try {

      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&sort_by=popularity.desc`)
      const similarFilmsData = await response.json();

      return similarFilmsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getReviews(id){
    try {

      const response =   await fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`)
      const reviewsData = await response.json();

      return reviewsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getRatings(imdb_id){
    try{
      const response =  await fetch(`http://www.omdbapi.com/?i=${imdb_id}&apikey=1d2aeb4f`)
        const ratingsData = await response.json();

        return ratingsData.Ratings;



    }catch (error){
      console.log(error)
    }
  }
}

