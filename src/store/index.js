import Vue from "vue";
import Vuex from "vuex";
import movieQuote from "popular-movie-quotes"; // https://github.com/NikhilNamal17/popular-movie-quotes
import { apiGetFilm } from "@/api/api.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    user: {
      signInMethod: '',
      token: '',
      name: '',
      email: '',
      photoURL: ''
    },
    quoteObj: undefined,
    movieObj: {
      poster: '',
    },
    collections: [
      // {
      //   group: 'My List',
      //   movieId: "",
      //   movie: {}
      // }
    ],
    isIntroShown: false,
  },
  mutations: {
    setLoginStatus (state, payload) {
      state.isLogin = payload;
    },
    setUser ({ user }, payload) {
      user.signInMethod = payload.signInMethod;
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
    addMovieIntoList (state, payload) {
      let obj = {
        group: payload.group,
        movieId: payload.movieId,
        movie: payload.movie
      };
      state.collections.push(obj);
    },
    removeMovieFromList (state, payload) {
      state.collections = state.collections.filter(item => item.movie.quote !== payload);
    }
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
    getFilm ({ commit }, movieName) {
      apiGetFilm(movieName).then((res) => {
        commit("setMovieObj", res.data);
      });
    }
  },
  modules: {},
});
