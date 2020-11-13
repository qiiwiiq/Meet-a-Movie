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
    collectionLists: [
      /* data stucture */
      // {
      //   id: 'xxxxx',
      //   timestamp: 'xxxxxxx',
      //   name: 'My Collections'
      // }
    ],
    collections: [
      /* data stucture */
      // {
      //   collectionId: 'xxxxx',
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
    updateCollectionLists (state, {action, lists}) {
      switch (action) {
        case "set":
          state.collectionLists = lists;
      }
    },
    updateCollections (state, payload) {
      state.collections = payload;
    },
    updateIntroShownFlag (state, payload) {
      state.isIntroShown = payload;
    }
  },
  actions: {
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
    },
    init ({ commit, dispatch }, user) {
      if (user.email) {
        // user is loggined
        commit("setLoginStatus", true);
        dispatch("initUser", user);
        dispatch("initCollections", user);
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
    initCollections ({ dispatch }, user) {
      if (user.isNewUser) {
        dispatch("dbWriteCollectionList", {
          uid: user.uid,
          listName: 'My Collections'
        });
      } else {
        dispatch("dbReadCollectionLists", user.uid);
        dispatch("dbReadCollections", user.uid);
      }
    },
    dbWriteCollectionList ({ dispatch }, {uid, listName}) {
      const collectionName = `lists-${uid}`;
      db.collection(collectionName)
        .add({
          name: listName,
          timestamp: new Date().getTime()
        })
        .then(function() {
          console.log('Setup lists');
          dispatch("dbReadCollectionLists", uid);
        })
        .catch(function(error) {
          console.error('Error adding document: ', error)
        })
    },
    dbEditCollectionList ({ dispatch }, {uid, listid, listName}) {
      const collectionName = `lists-${uid}`;
      db.collection(collectionName)
        .doc(listid)
        .update({
          name: listName
        })
        .then(() => {
          dispatch("dbReadCollectionLists", uid);
        })
        .catch(function(error) {
          console.error('Error adding document: ', error)
        })
    },
    dbDeleteCollectionList ({ dispatch }, {uid, listid}) {
      const collectionName = `lists-${uid}`;
      db.collection(collectionName)
        .doc(listid)
        .delete()
        .then(() => dispatch("dbReadCollectionLists", uid))
        .catch((error) => console.error('Error deleting document: ', error))
    },
    dbReadCollectionLists ({ commit }, uid) {
      const collectionName = `lists-${uid}`;
      db.collection(collectionName)
        .orderBy("timestamp")
        .get()
        .then(querySnapshot => {
          const lists = querySnapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            }
          });
          commit("updateCollectionLists", { action: "set", lists });
        })
        .catch(error => console.log(error));
    },
    dbAddCollections ({ dispatch }, {uid, movieObj}) {
      const collectionName = `collections-${uid}`;
      movieObj.timestamp = new Date().getTime();
      movieObj.cast = JSON.stringify(movieObj.cast);
      movieObj.technical_specs = JSON.stringify(movieObj.technical_specs);
      db.collection(collectionName)
        .add(movieObj)
        .then(() => dispatch("dbReadCollections", uid))
        .catch(error => console.error('Error writing document: ', error))
    },
    dbUpdateCollections ({ dispatch }, {uid, collectionId, movieObj}) {
      const collectionName = `collections-${uid}`;
      movieObj.timestamp = new Date().getTime();
      movieObj.cast = JSON.stringify(movieObj.cast);
      movieObj.technical_specs = JSON.stringify(movieObj.technical_specs);
      db.collection(collectionName)
        .doc(collectionId)
        .set(movieObj)
        .then(() => dispatch("dbReadCollections", uid))
        .catch(error => console.error('Error writing document: ', error))
    },
    dbDeleteCollections ({ dispatch }, {uid, collectionId}) {
      const collectionName = `collections-${uid}`;
      db.collection(collectionName)
        .doc(collectionId)
        .delete()
        .then(() => dispatch("dbReadCollections", uid))
        .catch((error) => console.error('Error deleting document: ', error))
    },
    dbReadCollections ({ commit }, uid) {
      const collectionName = `collections-${uid}`;
      db.collection(collectionName)
        .orderBy("timestamp", "desc")
        .get()
        .then(querySnapshot => {
          const collections = querySnapshot.docs.map(doc => {
            return {
              collectionId: doc.id,
              movie: doc.data()
            }
          });
          commit("updateCollections", collections);
        })
        .catch(error => console.log(error));
    },
  },
  modules: {},
});
