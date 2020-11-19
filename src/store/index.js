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
      uid: '',
      created: null
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
      //   cast: []
      //   collectionId: 'xxxxx',
      //   ...
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
      user.created = payload.created;
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
      dispatch("getFilm", movieObj);
    },
    getFilm ({ commit, dispatch }, movieObj) {
      apiGetFilm(movieObj.movie).then(
        (res) => {
          if (res.data.title && res.data.poster) {
            commit("setQuoteObj", movieObj);
            commit("setMovieObj", res.data);
          } else {
            dispatch("getQuote");
          }
        },
        () => {
          dispatch("getQuote");
        });
    },
    init ({ commit, dispatch }, user) {
      if (user.uid) {
        // user is loggined
        commit("setLoginStatus", true);
        dispatch("initUser", user);
        dispatch("initCollections", user);
      } else {
        commit("setLoginStatus", false);
      }
    },
    initUser ({ dispatch }, user) {
      if (user.isNewUser) {
        db.collection('users')
        .doc(user.uid)
        .set({
          signInMethod: user.signInMethod,
          token: user.token,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          created: new Date().getTime()
        })
        .then(function() {
          dispatch("dbReadUser", user.uid);
        })
        .catch(function(error) {
          console.error('Error adding document: ', error)
        })
      } else {
        dispatch("dbReadUser", user.uid);
      }
    },
    dbUpdateUser ({ dispatch }, {uid, obj}) {
      db.collection("users")
        .doc(uid)
        .update(obj)
        .then(() => dispatch("dbReadUser", uid))
        .catch(error => console.error('Error writing document: ', error))
    },
    dbReadUser ({ commit }, uid) {
      db.collection("users")
        .doc(uid)
        .get()
        .then(doc => {
          commit("setUser", doc.data());
        })
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
      let newCollectionRef = db.collection(collectionName).doc();
      movieObj.collectionId = newCollectionRef.id;
      newCollectionRef
        .set(movieObj)
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
    dbUpdateCollectionDetail ({ dispatch }, {uid, collectionId, obj}) {
      const collectionName = `collections-${uid}`;
      db.collection(collectionName)
        .doc(collectionId)
        .update(obj)
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
          const collections = querySnapshot.docs.map(doc => doc.data());
          commit("updateCollections", collections);
        })
        .catch(error => console.log(error));
    },
  },
  modules: {},
});
