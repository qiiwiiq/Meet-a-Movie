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
      <v-btn
        text
        small
        class="mr-1"
        :to="{ name: 'MyCollections' }"
      >
        <v-icon class="mr-1">mdi-heart-outline</v-icon>
        Collections
      </v-btn>
      <v-btn
        v-if="!isLogin"
        outlined
        small
        class="mx-1"
        :to="{ name: 'SignIn' }"
      >
        Sign in
      </v-btn>
      <v-menu
        v-else
        bottom
        offset-y
        open-on-hover
        close-delay="300"
        nudge-bottom="4"
        content-class="user-menu"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            class="mr-1"
            v-on="on"
          >
            <v-avatar v-if="user.photoURL" size="36">
              <img :src="user.photoURL" />
            </v-avatar>
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list tile dense dark color="#333" class="pa-0">
          <v-list-item
            class="menu-list-item"
            @click="goToSettings"
          >
            <v-list-item-title class="menu-list-item-text">Settings</v-list-item-title>
          </v-list-item>
          <v-list-item
            class="menu-list-item"
            @click="signOutDialogOpened = true"
          >
            <v-list-item-title class="menu-list-item-text">Sign Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="main">
      <router-view />
    </v-main>

    <v-dialog
      v-model="signOutDialogOpened"
      width="400"
    >
      <v-card>
        <v-card-text class="pt-6">
          Are you sure to leave?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="signOutDialogOpened = false"
          >
            NO
          </v-btn>
          <v-btn
            color="red"
            text
            @click="signOut"
          >
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  data() {
    return {
      signOutDialogOpened: false
    }
  },
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
      this.$store.dispatch("init", user);
    },
    getQuote() {
      if (this.$router.currentRoute.name !== 'Home') {
        this.$router.push({ name: "Home" }).catch(() => {});
      }
      this.$store.dispatch("getQuote");
    },
    goToSettings() {
      this.$router.push({name: 'Settings'}).catch(() => {});
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

.user-menu {
  border-radius: 0;
}

.menu-list-item {
  border-radius: 0;

  &:not(:last-child) {
    border-bottom: 1px dashed #CCC;
  }
  
  &-text {
    font-size: 12px !important;
    text-transform: uppercase;
  }
}
</style>

<style lang="scss">
@import './scss/global.scss';
</style>
