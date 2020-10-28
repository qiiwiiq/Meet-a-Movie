<template>
  <div
    :style="{
      backgroundImage:
        'url(' +
        movieObj.poster +
        '), linear-gradient(#F1F1F1 0%, #EEE 70%, #999 100%)'
    }"
    class="main-page d-flex justify-center"
  >
    <div v-if="!isIntroShown" class="card-quote d-flex flex-column align-end">
      <Quote :quoteObj="quoteObj" />
      <div>
        <v-btn
          icon
          class="mr-2"
          @click="enterMovieIntro"
        >
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>
        <v-btn
          depressed
          class="text-none"
          @click="enterMovieIntro"
        >
          Check it!
        </v-btn>
      </div>
    </div>
    <div v-if="isIntroShown" class="movie-intro">
      <v-btn icon @click="leaveMovieIntro">
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
  mounted() {
    this.$store.dispatch("getQuote");
  },
  computed: {
    ...mapState(["quoteObj", "movieObj", "isIntroShown"])
  },
  methods: {
    enterMovieIntro() {
      this.$store.commit("updateIntroShownFlag", true);
    },
    leaveMovieIntro() {
      this.$store.commit("updateIntroShownFlag", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.main-page {
  height: 100%;
  background-size: cover;
  background-position: bottom 50px;
  background-blend-mode: soft-light;
}

.card-quote {
  min-width: 300px;
  max-width: 80%;
  height: fit-content;
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
