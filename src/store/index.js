import Vue from "vue";
import Vuex from "vuex";
import movieQuote from "popular-movie-quotes"; // https://github.com/NikhilNamal17/popular-movie-quotes
import { apiGetFilm } from "@/api/api.js";
import { db } from '@/assets/firebase.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    user: {
      signInMethod: '',
      token: '',
      name: '',
      email: '',
      photoURL: '',
      uid: ''
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
      user.uid = payload.uid;
    },
    setQuoteObj (state, payload) {
      state.quoteObj = payload;
    },
    setMovieObj (state, payload) {
      state.movieObj = payload;
    },
    updateCollectionGroups (state, {action, groups}) {
      switch (action) {
        case "set":
          state.collectionGroups = groups;
      }
    },
    updateIntroShownFlag (state, payload) {
      state.isIntroShown = payload;
    },
    addMovieIntoGroup (state, payload) {
      let obj = {
        groupid: payload.groupid,
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
      if (user.name) {
        // user is loggined
        commit("setLoginStatus", true);
        dispatch("initUser", user);
        dispatch("initCollectionGroups", user);
      } else {
        commit("setLoginStatus", false);
      }
    },
    initUser ({ commit }, user) {
      commit("setUser", user);
      if (user.isNewUser) {
        db.collection('users')
        .doc(user.uid)
        .set({
          signInMethod: user.signInMethod,
          email: user.email,
          uid: user.uid
        })
        .then(function() {
          console.log('Setup a new user')
        })
        .catch(function(error) {
          console.error('Error adding document: ', error)
        })
      }
    },
    initCollectionGroups ({ commit, dispatch }, user) {
      let groups;
      if (user.isNewUser) {
        groups = [{
          id: 'cg0',
          name: 'My Collections'
        }];
        dispatch("dbWriteCollectionGroups", {
          uid: user.uid,
          groups
        });
        commit("updateCollectionGroups", {action: "set", groups});
      } else {
        dispatch("dbReadCollectionGroups", user.uid);
      }
    },
    addCollectionGroups ({ commit, state, dispatch }, groupName) {
      const lastGroup = state.collectionGroups[state.collectionGroups.length - 1];
      const index = +lastGroup["id"].split("cg")[1] + 1;
      const id = 'cg' + index;
      const group = {
        id,
        name: groupName
      };
      const groups = [...state.collectionGroups, group];
      dispatch("dbWriteCollectionGroups", {
        uid: state.user.uid,
        groups
      });
      commit("updateCollectionGroups", { action: "set", groups });
    },
    dbWriteCollectionGroups (context, {uid, groups}) {
      db.collection('users')
        .doc(uid)
        .update({
          groups
        })
        .then(function() {
          console.log('Setup groups')
        })
        .catch(function(error) {
          console.error('Error adding document: ', error)
        })
    },
    dbReadCollectionGroups ({ commit }, uid) {
      db.collection('users')
        .doc(uid)
        .get()
        .then(doc => {
          const groups = doc.data().groups;
          commit("updateCollectionGroups", { action: "set", groups });
        })
        .catch(error => console.log(error))
    },
    getQuote ({ commit, dispatch }) {
      commit("setQuoteObj", undefined);
      commit("setMovieObj", { poster: '' });
      commit("updateIntroShownFlag", false);
      const movieObj = movieQuote.getSomeRandom(1)[0];
      commit("setQuoteObj", movieObj);
      dispatch("getFilm", movieObj.movie);
    },
    getFilm ({ commit }, movieName) {
      apiGetFilm(movieName).then((res) => {
        commit("setMovieObj", res.data);
      });
    }
  },
  modules: {},
});
