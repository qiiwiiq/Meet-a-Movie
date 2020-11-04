<template>
  <v-app>
    <v-app-bar app dark class="navbar">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div>

      <v-spacer></v-spacer>
      <v-btn text small class="mr-1" @click="getQuote">
        <v-icon class="mr-1">mdi-autorenew</v-icon>
        New Quote
      </v-btn>
      <v-btn text small class="mr-1" href="/my-collections">
        <v-icon class="mr-1">mdi-heart-outline</v-icon>
        Favorites
      </v-btn>
      <v-btn
        v-if="!isLogin"
        outlined
        small
        class="mx-1"
        href="/sign-in"
      >
        Sign in
      </v-btn>
      <v-btn
        v-else
        icon
        class="mr-1"
        @click="signOut"
      >
        <v-avatar v-if="user.photoURL" size="36">
          <img :src="user.photoURL" />
        </v-avatar>
        <v-icon v-else>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from './utils/mixin';
import firebase from 'firebase/app';
import "firebase/auth";

export default {
  name: "App",
  mixins: [mixin],
  computed: {
    ...mapState(["isLogin", "user", "movieObj"]),
  },
  mounted() {
    this.initUserFromCookies();
  },
  methods: {
    initUserFromCookies() {
      const signInMethod = this.$cookies.get('signInMethod');
      const token = this.$cookies.get('token');
      const name = this.$cookies.get('name');
      const email = this.$cookies.get('email');
      const photoURL = this.$cookies.get('photoURL');
      const user = {
        signInMethod,
        token,
        name,
        email,
        photoURL
      };
      this.$store.commit("setUser", user);
      if (user.name) {
        this.$store.commit("setLoginStatus", true);
      } else {
        this.$store.commit("setLoginStatus", false);
      }
    },
    getQuote() {
      if (this.$router.currentRoute.name !== 'Home') {
        this.$router.push({ name: "Home" }).catch(() => {});
      }
      this.$store.dispatch("getQuote");
    },
    signOut() {
      firebase.auth().signOut();
      let payload = {
        signInMethod: '',
        token: '',
        name: '',
        email: '',
        photoURL: ''
      };
      this.$store.commit("setUser", payload);
      this.$store.commit("setLoginStatus", false);
      this.clearCookies();
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-image: linear-gradient(#111 0%, #333 70%, #444 80%, #555 90%, #444 100%);
}

.main {
  background-image: url('./assets/bg.jpg');
  background-size: cover;
}
</style>

<style lang="scss">
@import './scss/global.scss';
</style>
