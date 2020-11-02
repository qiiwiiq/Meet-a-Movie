<template>
  <v-app>
    <v-app-bar app color="black" dark elevate-on-scroll>
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
      <v-btn text small @click="getQuote">
        <v-icon class="mr-1">mdi-autorenew</v-icon>
        New Quote
      </v-btn>
      <v-btn text small href="/my-collections">
        <v-icon class="mr-1">mdi-heart-outline</v-icon>
        Favorites
      </v-btn>
      <v-btn
        v-if="profile.name === ''"
        depressed
        small
        @click="showLoginDialog = true"
      >
        Sign up / Login
      </v-btn>
      <v-btn
        v-else
        icon
      >
        <!-- <img
          v-if="profilePic"
          :src="profilePic"
        /> -->
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="main">
      <router-view />
    </v-main>

    <v-dialog
      v-model="showLoginDialog"
      max-width="290"
    >
      <Login
        :closeLoginDialog="showLoginDialog = false"
      />
    </v-dialog>
  </v-app>
</template>

<script>
import Login from "@/components/login";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    Login
  },
  data() {
    return {
      showLoginDialog: false
    }
  },
  computed: {
    ...mapState(["profile", "movieObj"]),
    profilePic () {
      let profilePic = '';
      if (this.profile.fbId) {
        profilePic = `https://graph.facebook.com/${this.profile.fbId}/picture?width=300`
      }
      return profilePic;
    }
  },
  mounted() {
    window.fbAsyncInit= function() {
      this.FB.init({
        appId      : '440698083578526',
        cookie     : true,
        xfbml      : true,
        version    : 'v8.0'
      });
      this.FB.AppEvents.logPageView();

      // Get FB Login Status
      this.FB.getLoginStatus( response => {
        console.log('res', response);
      })
    };
  },
  methods: {
    getQuote() {
      if (this.$router.currentRoute.name !== 'Home') {
        this.$router.push({ name: "Home" }).catch(() => {});
      }
      this.$store.dispatch("getQuote");
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  background-image: url('./assets/bg.jpg');
  background-size: cover;
}
</style>

<style lang="scss">
@import './scss/global.scss';
</style>
