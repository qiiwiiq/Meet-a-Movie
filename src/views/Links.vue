<template>
  <div class="d-flex justify-center h-100">
    <div v-if="isLogin" class="page-links justify-center w-100">
      <v-hover
        v-slot:default="{ hover }"
        open-delay="200"
      >
        <v-card
          href="https://www.imdb.com/"
          :elevation="hover ? 16 : 2"
          :class="{ 'on-hover': hover }"
          class="btn-link"
        >
          <img src="../assets/imdblogo.png">
        </v-card>
      </v-hover>
      <v-hover
        v-slot:default="{ hover }"
        open-delay="200"
      >
        <v-card
          href="https://www.rottentomatoes.com/"
          :elevation="hover ? 16 : 2"
          :class="{ 'on-hover': hover }"
          class="btn-link"
          color="#FA3209"
        >
          <img src="../assets/rtlogo.png">
        </v-card>
      </v-hover>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  metaInfo: {
    title: 'Links | Meet a Movie'
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.isLogin) {
        vm.$router.replace({ name: "SignIn" });
      }
    });
  },
  watch: {
    isLogin(val) {
      if (!val) this.$router.replace({ name: "SignIn" });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.page-links {
  display: flex;
  max-width: 800px;
  margin: 16px 20px;
  padding: 20px 4px 20px 20px;

  .btn-link {
    transition: opacity .4s ease-in-out;
    width: 100px;
    min-width: 100px;
    height: 100px;
    min-height: 100px;
    margin-right: 16px;

    &:not(.on-hover) {
      opacity: 0.9;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

</style>