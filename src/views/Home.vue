<template>
  <div class="d-flex justify-center">
    <div v-if="!isIntroShown" class="card-quote d-flex flex-column align-end">
      <Quote :quoteObj="quoteObj" />
      <a @click="isIntroShown = true">Check it!</a>
    </div>
    <div v-if="isIntroShown" class="movie-intro">
      <v-btn icon @click="isIntroShown = false">
        <v-icon>mdi-keyboard-backspace</v-icon>
      </v-btn>
      <Movie :movieObj="movieObj" />
    </div>
  </div>
</template>

<script>
import Quote from "@/components/quote";
import Movie from "@/components/movie";
import { mapState } from "vuex";

export default {
  components: {
    Quote,
    Movie
  },
  data() {
    return {
      isIntroShown: false
    };
  },
  mounted() {
    this.$store.dispatch("getQuote");
  },
  computed: {
    ...mapState(["quoteObj", "movieObj"])
  }
};
</script>

<style lang="scss" scoped>
.card-quote {
  min-width: 300px;
  max-width: 80%;
  margin-top: 10vh;
  padding: 25px 40px 25px 30px;
  border: 2px solid #000;
  outline: 1px solid #333;
  outline-offset: -10px;
  box-shadow: 0 3px 10px rgba(#000, 0.4);
  background-color: rgba(255, 255, 255, 0.7);
}

.movie-intro {
  width: 100%;
}
</style>
