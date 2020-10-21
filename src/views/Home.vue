<template>
  <div class="mx-auto">
    <div v-if="!isIntroShown">
      <Quote :quoteObj="quoteObj" />
      <a @click="isIntroShown = true">Check it!</a>
    </div>
    <div v-if="isIntroShown">
      <v-btn icon @click="isIntroShown = false">
        <v-icon>mdi-keyboard-backspace</v-icon>
      </v-btn>
      <Movie :movieObj="movieObj" />
    </div>
  </div>
</template>

<script>
import movieQuote from "popular-movie-quotes"; // https://github.com/NikhilNamal17/popular-movie-quotes
import Quote from "@/components/quote";
import Movie from "@/components/movie";
import { apiGetFilm } from "@/api/api.js";

export default {
  components: {
    Quote,
    Movie
  },
  data() {
    return {
      isIntroShown: false,
      quoteObj: undefined,
      movieObj: undefined
    };
  },
  mounted() {
    this.getQuote();
  },
  watch: {
    quoteObj: {
      handler: function(obj) {
        if (obj) {
          this.getFilm(obj.movie);
        }
      },
      deep: true
    }
  },
  methods: {
    getQuote() {
      this.quoteObj = movieQuote.getSomeRandom(1)[0];
    },
    getFilm(movie) {
      apiGetFilm(movie).then(res => (this.movieObj = res.data));
    }
  }
};
</script>
