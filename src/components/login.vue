<template>
  <div class="login d-flex flex-column align-center">
    <v-btn
      dark
      color="#3b5998"
      class="btn-login ma-2 text-none"
      @click="loginFB"
    >
      <v-icon left>mdi-facebook</v-icon> Login with FACEBOOK
    </v-btn>
    <v-btn
      dark
      color="#ea4335"
      class="btn-login ma-2 text-none"
      @click="loginGoogle"
    >
      <v-icon left>mdi-google</v-icon> Login with GOOGLE
    </v-btn>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import "firebase/auth";

export default {
  methods: {
    loginFB () {
      const vm = this;
      const providerF = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(providerF).then(function(result) {
        console.log(result);
        const user = result.user;
        let payload = {
          loginMethod: 'fb',
          token: result.credential.accessToken,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        vm.$cookies.set('loginMethod', 'fb');
        vm.$cookies.set('token', result.credential.accessToken);
        vm.$cookies.set('name', user.displayName);
        vm.$cookies.set('email', user.email);
        vm.$cookies.set('photoURL', user.photoURL);
        vm.$store.commit("setUser", payload);
        vm.$store.commit("setLoginStatus", true);
        vm.$emit("closeLoginDialog");
      }).catch(function(error) {
        console.log(error);
      });
    },
    loginGoogle () {
      const vm = this;
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log(result);
        const user = result.user;
        let payload = {
          loginMethod: 'google',
          token: result.credential.accessToken,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        vm.$cookies.set('loginMethod', 'google');
        vm.$cookies.set('token', result.credential.accessToken);
        vm.$cookies.set('name', user.displayName);
        vm.$cookies.set('email', user.email);
        vm.$cookies.set('photoURL', user.photoURL);
        vm.$store.commit("setUser", payload);
        vm.$store.commit("setLoginStatus", true);
        vm.$emit("closeLoginDialog");
      }).catch(function(error) {
        console.log(error);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  background-color: #FFF;
  padding: 30px 10px;
}

.btn-login {
  width: 220px;
}
</style>