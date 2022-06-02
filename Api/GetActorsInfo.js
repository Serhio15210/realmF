import { API_KEY } from "./apiKey";


export default class GetActorsInfo {
  static async getActorsInfo(id) {

    try {
      const response =   await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=ee712ed3d9a31ac90e78463a3c77245f&language=ru`)
      const actorsData = await response.json();

      return actorsData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getActorsFilms(id) {

    try {
      const response = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=ee712ed3d9a31ac90e78463a3c77245f&sort_by=popularity.desc&language=ru`)
      const actorsFilmsData = await response.json();

      return actorsFilmsData;

    } catch (error) {
      console.error(error);
    }
  }
}
