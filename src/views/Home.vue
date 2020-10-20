<template>
  <div class="home">
    <Quote :quoteObj="quoteObj" />
  </div>
</template>

<script>
import movieQuote from "popular-movie-quotes"; // https://github.com/NikhilNamal17/popular-movie-quotes
import Quote from "@/components/quote";
import { apiGetFilm } from "@/api/api.js";

export default {
  components: {
    Quote,
  },
  data() {
    return {
      quoteObj: undefined,
      movieObj: undefined,
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
      deep: true,
    },
  },
  methods: {
    getQuote() {
      this.quoteObj = movieQuote.getSomeRandom(1)[0];
    },
    getFilm(movie) {
      apiGetFilm(movie).then((res) => (this.movieObj = res.data));
    },
  },
};
</script>
