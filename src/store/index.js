import Vue from "vue";
import Vuex from "vuex";

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
  actions: {},
  modules: {},
});
