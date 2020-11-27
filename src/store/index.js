import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { apiGetFilm } from "@/api/api.js";
import { db, storage } from '@/assets/firebase.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    user: {
      signInMethod: '',
      token: '',
      name: '',
      email: '',
      photo: '',
      photoURL: '',
      photoRef: '',
      uid: '',
      created: null
    },
    quoteObj: undefined,
      /* data stucture */
      // {
      //   checked: Boolean,
      //   genre: [...],
      //   id: 'xxxxx',
      //   imdbId: 'xxxxx',
      //   name: 'xxxxx',
      //   quote: 'xxxxx',
      //   timestamp: number,
      //   uploader: 'xxxxx',
      //   year: number
      // }
    movieObj: {
      poster: '',
    },
      /* data stucture */
      // {
      //   cast: [...],
      //   id: 'xxxxx',
      //   length: 'xxxxx',
      //   plot: 'xxxxx',
      //   poster: 'xxxxx',
      //   rating: 'xxxxx',
      //   rating_votes: 'xxxxx',
      //   technical_specs: [...],
      //   title: 'xxxxx',
      //   trailer: {
      //      id: 'xxxxx',
      //      link: 'xxxxx',
      //   },
      //   year: 'xxxxx',
      // }
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
      //   cast: "[]",
      //   collectionId: string,
      //   comment: string,
      //   id: string,
      //   length: string,
      //   listid: string,
      //   plot: string,
      //   poster: string,
      //   quote: string,
      //   rating: string,
      //   rating_votes: string,
      //   technical_specs: "[]",
      //   timestamp: number,
      //   title: string,
      //   trailer: {
      //    id: string,
      //    link: string
      //   },
      //   year: string,
      // }
    ],
    isIntroShown: false,
    quoteFilter: {
      yearFrom: null,
      yearTo: null,
      genres: []
    }
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
      user.photoRef = payload.photoRef;
      user.uid = payload.uid;
      user.created = payload.created;
    },
    setUserPhoto ({ user }, payload) {
      user.photo = payload;
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
    },
    setQuoteFilter ({quoteFilter}, {yearFrom, yearTo, genres}) {
      quoteFilter.yearFrom = yearFrom;
      quoteFilter.yearTo = yearTo;
      quoteFilter.genres = genres;
    }
  },
  actions: {
    initQuote ({ commit, dispatch }) {
      const lsYearFrom = +localStorage.getItem("yearFrom");
      const lsYearTo = +localStorage.getItem("yearTo");
      const lsSelectedGenres = localStorage.getItem("selectedGenres");
      const yearFrom = lsYearFrom ? lsYearFrom : null;
      const yearTo = lsYearTo ? lsYearTo : null;
      const genres = lsSelectedGenres ? lsSelectedGenres.split(",") : [];
      commit("setQuoteFilter", { yearFrom, yearTo, genres });
      dispatch("getQuote");
    },
    getQuote ({ commit, dispatch }) {
      commit("setQuoteObj", undefined);
      commit("setMovieObj", { poster: '' });
      commit("updateIntroShownFlag", false);
      dispatch("dbReadQuote");
    },
    dbReadQuote ({ dispatch, state }) {
      const quoteRef = db.collection("quote");
      const key = quoteRef.doc().id;
      const yearFrom = state.quoteFilter.yearFrom;
      const yearTo = state.quoteFilter.yearTo;
      const genres = state.quoteFilter.genres;
      let queryRef = quoteRef;
      
      if (yearFrom && yearTo) {
        let years = [];
        for (let i = yearFrom; i<=yearTo; i++) {
          years.push(i);
        }
        queryRef = queryRef.where("year", 'in', years)
      }

      if (genres.length > 0) {
        queryRef = queryRef.where("genre", "array-contains-any", genres);
      }
      let pickOneRef = queryRef.where("id", '>=', key).limit(1);
      pickOneRef.get()
        .then(snapshot => {
            if(snapshot.size > 0) {
                snapshot.forEach(doc => {
                  const movieObj = doc.data();
                  dispatch("getFilm", movieObj);
                });
            }
            else {
              queryRef.where("id", '<', key).limit(1).get()
                .then(snapshot => {
                  snapshot.forEach(doc => {
                    const movieObj = doc.data();
                    dispatch("getFilm", movieObj);
                  });
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    },
    getFilm ({ commit, dispatch }, movieObj) {
      apiGetFilm(movieObj.imdbId).then(
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
        localStorage.clear();
      }
      dispatch("initQuote");
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
    dbDeleteUser (context, {uid, obj}) {
      db.collection("users")
        .doc(uid)
        .delete()
        .then(() => console.log('delete user from db'))
        .catch((error) => console.error('Error deleting document: ', error))

      // record in deleteUsers table
      db.collection("deletedUsers")
        .doc(uid)
        .set(obj)
    },
    dbReadUser ({ commit, dispatch }, uid) {
      db.collection("users")
        .doc(uid)
        .get()
        .then(doc => {
          if (doc.data().photoRef) {
            console.log(doc.data().photoRef);
            dispatch("downloadPhoto", doc.data().photoRef);
          } else {
            commit("setUserPhoto", doc.data().photoURL);
          }
          commit("setUser", doc.data());
        })
    },
    downloadPhoto ({ commit }, photoRef) {
      storage.ref().child(photoRef).getDownloadURL().then(async (url) => {
        const result = await axios.get(url, { responseType: 'blob' });
        if (result) {
          let blob = new Blob([result.data]);
          const fileReader = new FileReader();
          fileReader.addEventListener('load', () => {
            commit("setUserPhoto", fileReader.result);
          });
          fileReader.readAsDataURL(blob);
        }
      }).catch(() => {

      });
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
      let newCollectionListRef = db.collection(collectionName).doc();
      newCollectionListRef
        .set({
          id: newCollectionListRef.id,
          name: listName,
          timestamp: new Date().getTime()
        })
        .then(function() {
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
          const lists = querySnapshot.docs.map(doc => doc.data());
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
