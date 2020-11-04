<template>
  <div
    :style="{
      backgroundImage:
        'url(' + bgImage + '), linear-gradient(#F1F1F1 0%, #EEE 60%, #888 100%)'
    }"
    class="main-page d-flex justify-center"
  >
    <div v-if="!isIntroShown" class="card-quote d-flex flex-column align-end">
      <Quote :quoteObj="quoteObj" />
      <div>
        <v-btn
          icon
          class="mr-1"
          :ripple="false"
          @click="isCollected = !isCollected"
        >
          <v-icon>mdi-heart{{ isCollected ? '' : '-outline'}}</v-icon>
        </v-btn>
        <v-btn
          text
          class="btn-direct px-2"
          @click="enterMovieIntro"
        >
          Check it &rarr;
        </v-btn>
      </div>
    </div>
    <div v-if="isIntroShown" class="movie-intro">
      <Movie :movieObj="movieObj">
        <div>
          <div class="mb-8">
            <a :href="movieObj.trailer.link" target="_blank">Watch Trailer</a>
          </div>
          <div class="d-flex justify-end">
            <v-btn
              icon
              class="mr-1"
              :ripple="false"
              @click="isCollected = !isCollected"
            >
              <v-icon>mdi-heart{{ isCollected ? '' : '-outline'}}</v-icon>
            </v-btn>
            <v-btn
              text
              class="btn-direct px-2"
              @click="leaveMovieIntro"
            >
              Back &rarr;
            </v-btn>
          </div>
          
        </div>
      </Movie>
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
      bgImage: '',
      isCollected: false
    }
  },
  mounted() {
    this.$store.dispatch("getQuote");
  },
  computed: {
    ...mapState(["quoteObj", "movieObj", "isIntroShown"]),
  },
  watch: {
    movieObj: {
      handler: function() {
        if (this.movieObj.poster) {
          this.bgImage = this.movieObj.poster;
        } else {
          this.bgImage = '';
        }
      },
      deep: true
    }
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
  background-position: 50% 80%;
  background-blend-mode: soft-light;
}

.card-quote {
  min-width: 300px;
  max-width: 80%;
  height: fit-content;
  margin-top: 10vh;
  padding: 25px 30px;
  border: 2px solid #000;
  outline: 1px solid #333;
  outline-offset: -10px;
  box-shadow: 0 3px 10px rgba(#000, 0.4);
  background-color: rgba(255, 255, 255, 0.7);
}

.movie-intro {
  width: 100%;
  padding: 30px 20px 20px 20px;
}

.btn-direct {
  text-decoration: underline;
}
</style>