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
      <v-btn text small @click="goToMyCollections">
        <v-icon class="mr-1">mdi-heart-outline</v-icon>
        Collections
      </v-btn>
    </v-app-bar>

    <v-main
      :style="{
        backgroundImage:
          'url(' +
          movieObj.poster +
          '), linear-gradient(#F1F1F1 0%, #EEE 70%, #999 100%)'
      }"
      class="main"
    >
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
      this.$store.dispatch("getQuote");
    },
    goToMyCollections() {
      this.$router.push({ name: "MyCollections" }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  background-size: cover;
  background-position: center;
  background-blend-mode: soft-light;
}
</style>
