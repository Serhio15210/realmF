import { API_KEY } from "./apiKey";

export default class GetFilms {
  static async getTopSerials() {

    try {
      const response =  await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=ru&with_original_language=en`);
      const topData = await response.json();

      return topData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getPopularSerials(page) {

    try {
      const response =  await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${page}`)
      const popularData = await response.json();

      return popularData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getDetailSerial(id){
    try {

      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=credits`)
      const detailData = await response.json();

      return detailData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getSimilarSerial(id){
    try {

      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}&sort_by=popularity.desc`)
      const similarSerialData = await response.json();

      return similarSerialData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getReviews(id){
    try {

      const response =    await fetch(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${API_KEY}`)
      const reviewsData = await response.json();

      return reviewsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getRatings(id){
    try {

      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=external_ids`).then(data => data.json()).then(async data2 => {

        await fetch(`http://www.omdbapi.com/?i=${data2.external_ids["imdb_id"]}&apikey=1d2aeb4f`)})
      const reviewsData = await response.json();

      return reviewsData;

    } catch (error) {
      console.error(error);
    }
  }
}
