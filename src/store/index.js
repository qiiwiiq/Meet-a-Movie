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
    collectionGroups: [
      /* data stucture */
      // {
      //   id: 'cg0',
      //   name: 'My Collections'
      // }
    ],
    collections: [
      /* data stucture */
      // {
      //   groupid: 'cg0',
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
    updateCollectionGroups (state, {action, group}) {
      switch (action) {
        case "add":
          state.collectionGroups.push(group);
          return;
      }
    },
    updateIntroShownFlag (state, payload) {
      state.isIntroShown = payload;
    },
    addMovieIntoGroup (state, payload) {
      let obj = {
        groupid: payload.groupid,
        movieId: payload.movieId,
        movie: payload.movie
      };
      state.collections.push(obj);
    },
    removeMovieFromGroup (state, payload) {
      state.collections = state.collections.filter(item => item.movie.quote !== payload);
    }
  },
  actions: {
    init ({ commit, dispatch }, user) {
      commit("setUser", user);
      if (user.name) {
        // user is loggined
        commit("setLoginStatus", true);
        dispatch("initCollectionGroups");
      } else {
        commit("setLoginStatus", false);
      }
    },
    initCollectionGroups ({ commit }) {
      const group = {
        id: 'cg0',
        name: 'My Collections'
      };
      commit("updateCollectionGroups", {action: "add", group});
    },
    addCollectionGroups ({ commit, state }, groupName) {
      const lastGroup = state.collectionGroups[state.collectionGroups.length - 1];
      const index = +lastGroup["id"].split("cg")[1] + 1;
      const id = 'cg' + index;
      const group = {
        id,
        name: groupName
      };
      commit("updateCollectionGroups", {action: "add", group});
    },
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
