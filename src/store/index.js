import Vue from "vue";
import Vuex from "vuex";
import movieQuote from "popular-movie-quotes"; // https://github.com/NikhilNamal17/popular-movie-quotes
import { apiGetFilm } from "@/api/api.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    quoteObj: undefined,
    movieObj: {
      poster: "",
    },
  },
  mutations: {
    setQuoteObj(state, payload) {
      state.quoteObj = payload;
    },
    setMovieObj(state, payload) {
      state.movieObj = payload;
    },
  },
  actions: {
    getQuote({ commit, dispatch, state }) {
      state.quoteObj = undefined;
      state.movieObj = {
        poster: "",
      };
      commit("setQuoteObj", movieQuote.getSomeRandom(1)[0]);
      if (state.quoteObj) {
        dispatch("getFilm", state.quoteObj.movie);
      }
    },
    getFilm({ commit }, movie) {
      apiGetFilm(movie).then((res) => {
        commit("setMovieObj", res.data);
      });
    },
  },
  modules: {},
});
