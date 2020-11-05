<template>
  <div class="page-sign-in d-flex justify-center align-center">
    <v-card class="d-flex flex-column">
      <v-btn
        dark
        color="#3b5998"
        class="btn-sign-in ma-2 text-none"
        @click="signInFB"
      >
        <v-icon left>mdi-facebook</v-icon> Sign In with FACEBOOK
      </v-btn>
      <v-btn
        dark
        color="#ea4335"
        class="btn-sign-in ma-2 text-none"
        @click="signInGoogle"
      >
        <v-icon left>mdi-google</v-icon> Sign In with GOOGLE
      </v-btn>
    </v-card>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import "firebase/auth";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["isLogin"]),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.isLogin) {
        vm.$router.replace({name: 'Home'});
      }
    })
  },
  methods: {
    signInFB () {
      const vm = this;
      const providerF = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(providerF).then(function(result) {
        console.log(result);
        const user = result.user;
        let payload = {
          signInMethod: 'fb',
          token: result.credential.accessToken,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        vm.$cookies.set('signInMethod', 'fb');
        vm.$cookies.set('token', result.credential.accessToken);
        vm.$cookies.set('name', user.displayName);
        vm.$cookies.set('email', user.email);
        vm.$cookies.set('photoURL', user.photoURL);
        vm.$store.dispatch("init", payload);
        vm.$router.replace({name: 'Home'});
      }).catch(function(error) {
        console.log(error);
      });
    },
    signInGoogle () {
      const vm = this;
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log(result);
        const user = result.user;
        let payload = {
          signInMethod: 'google',
          token: result.credential.accessToken,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        vm.$cookies.set('signInMethod', 'google');
        vm.$cookies.set('token', result.credential.accessToken);
        vm.$cookies.set('name', user.displayName);
        vm.$cookies.set('email', user.email);
        vm.$cookies.set('photoURL', user.photoURL);
        vm.$store.dispatch("init", payload);
        vm.$router.replace({name: 'Home'});
      }).catch(function(error) {
        console.log(error);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.page-sign-in {
  padding: 30px 10px;
}

.btn-sign-in {
  width: 220px;
}
</style>