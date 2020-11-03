import Vue from "vue";
import Vuex from "vuex";
import movieQuote from "popular-movie-quotes"; // https://github.com/NikhilNamal17/popular-movie-quotes
import { apiGetFilm } from "@/api/api.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      token: '',
      name: '',
      email: '',
      photoURL: ''
    },
    quoteObj: undefined,
    movieObj: {
      poster: '',
    }, 
    isIntroShown: false,
  },
  mutations: {
    setUser (state, payload) {
      let user = state.user;
      user.token = payload.token;
      user.name = payload.name;
      user.email = payload.email;
      user.photoURL = payload.photoURL;
    },
    setQuoteObj (state, payload) {
      state.quoteObj = payload;
    },
    setMovieObj (state, payload) {
      state.movieObj = payload;
    },
    updateIntroShownFlag (state, payload) {
      state.isIntroShown = payload;
    },
  },
  actions: {
    getQuote ({ commit, dispatch, state }) {
      commit("setQuoteObj", undefined);
      commit("setMovieObj", { poster: '' });
      commit("updateIntroShownFlag", false);
      commit("setQuoteObj", movieQuote.getSomeRandom(1)[0]);
      if (state.quoteObj) {
        dispatch("getFilm", state.quoteObj.movie);
      }
    },
    getFilm ({ commit }, movie) {
      apiGetFilm(movie).then((res) => {
        commit("setMovieObj", res.data);
      });
    },
  },
  modules: {},
});
