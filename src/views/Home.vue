<template>
  <div
    :style="{
      backgroundImage:
        'url(' + bgImage + '), linear-gradient(#F1F1F1 0%, #EEE 60%, #888 100%)'
    }"
    class="page-home"
  >
    <div class="quote-actions d-flex justify-end mx-auto">
    </div>
    <div class="d-flex justify-center">
      <div v-if="!isIntroShown" class="card-quote d-flex flex-column align-end">
        <Quote :quoteObj="quoteObj" />
        <div>
          <v-btn
            icon
            class="mr-2"
            :ripple="false"
            @click="getQuote"
          >
            <v-icon>mdi-autorenew</v-icon>
          </v-btn>
          <v-btn
            v-if="isLogin"
            icon
            class="mr-2"
            :ripple="false"
            @click="updateCollections"
          >
            <v-icon v-if="isCollected" color="#B71C1C">mdi-heart</v-icon>
            <v-icon v-else>mdi-heart-outline</v-icon>
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
        <MovieDetail :movieObj="movieObj">
          <div>
            <div class="mb-8">
              <a :href="movieObj.trailer.link" target="_blank">Watch Trailer</a>
            </div>
            <div class="d-flex justify-end">
              <v-btn
                icon
                class="mr-2"
                :ripple="false"
                @click="getQuote"
              >
                <v-icon>mdi-autorenew</v-icon>
              </v-btn>
              <v-btn
                v-if="isLogin"
                icon
                class="mr-2"
                :ripple="false"
                @click="updateCollections"
              >
                <v-icon v-if="isCollected" color="#B71C1C">mdi-heart</v-icon>
                <v-icon v-else>mdi-heart-outline</v-icon>
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
        </MovieDetail>
      </div>
    </div>
  </div>
</template>

<script>
import Quote from "@/components/quote";
import MovieDetail from "@/components/movieDetail";
import { mapState } from "vuex";

export default {
  components: {
    Quote,
    MovieDetail
  },
  data() {
    return {
      isCollected: false
    }
  },
  computed: {
    ...mapState(["isLogin", "quoteObj", "movieObj", "collections", "isIntroShown"]),
    bgImage() {
      if (this.movieObj.poster) {
        return this.movieObj.poster;
      } else {
        return '';
      }
    }
  },
  mounted() {
    this.isCollected = this.collections.find(item => item.movie.quote === this.quoteObj.quote);
  },
  watch: {
    movieObj: {
      handler: function() {
        this.isCollected = this.collections.find(item => item.movie.quote === this.quoteObj.quote);
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
    },
    updateCollections() {
      this.isCollected = !this.isCollected;
      if (this.isCollected) {
        const movie = Object.assign({
          quote: this.quoteObj.quote
        }, this.movieObj);
        const favMovieObj = {
          groupid: 'cg0',
          movie
        };
        this.$store.commit("addMovieIntoGroup", favMovieObj);
      } else {
        const quote = this.quoteObj.quote;
        this.$store.commit("removeMovieFromGroup", quote);
      }
    },
    getQuote() {
      this.$store.dispatch("getQuote");
    },
  }
};
</script>

<style lang="scss" scoped>
.page-home {
  height: 100%;
  background-size: cover;
  background-position: 50% 80%;
  background-blend-mode: soft-light;
}

.card-quote {
  min-width: 300px;
  max-width: 700px;
  height: fit-content;
  margin-top: 8vh;
  padding: 25px 30px;
  border: 2px solid #555;
  outline: 1px solid #888;
  outline-offset: -10px;
  box-shadow: 0 3px 10px rgba(#000, 0.4);
  background-color: rgba(255, 255, 255, 0.7);
}

.movie-intro {
  width: 100%;
  max-width: 1000px;
  padding: 30px 20px 20px 20px;
}

.btn-direct {
  text-decoration: underline;
}
</style>