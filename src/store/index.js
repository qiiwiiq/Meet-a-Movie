import Vue from "vue";
import Vuex from "vuex";
import movieQuote from "popular-movie-quotes"; // https://github.com/NikhilNamal17/popular-movie-quotes
import { apiGetFilm } from "@/api/api.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    profile: {
      fbId: '',
      name: '',
      email: ''
    },
    quoteObj: undefined,
    movieObj: {
      poster: '',
    }, 
    isIntroShown: false,
  },
  mutations: {
    setProfile(state, payload) {
      let profile = state.profile;
      switch(payload.loginMethod) {
        case 'fb':
          profile.fbId = payload.id;
          profile.name = payload.name;
          profile.email = payload.email;
          break;
        default:
          profile.fbId = '';
          profile.name = '';
          profile.email = '';
      }
    },
    setQuoteObj(state, payload) {
      state.quoteObj = payload;
    },
    setMovieObj(state, payload) {
      state.movieObj = payload;
    },
    updateIntroShownFlag(state, payload) {
      state.isIntroShown = payload;
    },
  },
  actions: {
    getQuote({ commit, dispatch, state }) {
      commit("setQuoteObj", undefined);
      commit("setMovieObj", { poster: '' });
      commit("updateIntroShownFlag", false);
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
