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
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState(["movieObj"])
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
