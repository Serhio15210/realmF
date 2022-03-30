import { API_KEY } from "./apiKey";

export default class GetFindInfo {

  static async getFilmsByQuery(page,movieQuery) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ru&query=${movieQuery}&page=${page}`)
      const premiereData = await response.json();

      return premiereData;

    } catch (error) {
      console.error(error);
    }
  }
  static async getSerialsByQuery(page,serialQuery) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=ru&query=${serialQuery}&page=${page}`)
      const premiereData = await response.json();

      return premiereData;

    } catch (error) {
      console.error(error);
    }
  }

}
