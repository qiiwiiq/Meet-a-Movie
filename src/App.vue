<template>
  <v-app>
    <v-app-bar app color="white" elevate-on-scroll>
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

      <v-btn icon @click="goToMyCollections">
        <v-icon>mdi-heart-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  methods: {
    goToMyCollections() {
      this.$router.push({ name: "MyCollections" }).catch(() => {});
    },
  },
};
</script>
