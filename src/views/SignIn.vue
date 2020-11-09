<template>
  <div class="page-sign-in d-flex justify-center align-center">
    <v-card class="card-sign-in d-flex flex-column pa-4">
      <div class="title-sign-in text-center">Sign In</div>
      <v-divider class="my-2"></v-divider>
      <v-btn
        dark
        depressed
        color="#3b5998"
        class="btn-sign-in ma-2 text-none"
        @click="signIn('fb')"
      >
        <v-icon left>mdi-facebook</v-icon> Sign In with FACEBOOK
      </v-btn>
      <v-btn
        dark
        depressed
        color="#ea4335"
        class="btn-sign-in ma-2 text-none"
        @click="signIn('google')"
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
    signIn(signInMethod) {
      const vm = this;
      let provider;
      switch(signInMethod) {
        case 'fb':
          provider = new firebase.auth.FacebookAuthProvider();
          break;
        case 'google':
          provider = new firebase.auth.GoogleAuthProvider();
          break;
      }
      firebase.auth().signInWithPopup(provider).then(function(result) {
        const user = result.user;
        let payload = {
          isNewUser: result.additionalUserInfo.isNewUser,
          signInMethod,
          token: result.credential.accessToken,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid
        };
        vm.$cookies.set('signInMethod', signInMethod);
        vm.$cookies.set('token', result.credential.accessToken);
        vm.$cookies.set('name', user.displayName);
        vm.$cookies.set('email', user.email);
        vm.$cookies.set('photoURL', user.photoURL);
        vm.$cookies.set('uid', user.uid);
        vm.$store.dispatch("init", payload);
        vm.$router.replace({name: 'Home'});
      }).catch(function(error) {
        console.log(error);
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.page-sign-in {
  padding: 30px 10px;
}

.card-sign-in {
  background-color: rgba(#FFF, .6);
}

.title-sign-in {
  font-size: 24px;
  font-weight: 700;
}

.btn-sign-in {
  width: 220px;
}
</style>