<template>
  <div
    :style="{
      backgroundImage:
        'url(' + bgImage + '), linear-gradient(#F1F1F1 0%, #EEE 60%, #888 100%)'
    }"
    class="page-home"
  >
    <div class="d-flex justify-center h-100">
      <v-card v-if="!isIntroShown" class="card-quote d-flex flex-column justify-space-between align-end">
        <Quote :quoteObj="quoteObj" />
        <div>
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
        <div class="card-quote-actions d-flex flex-column">
          <v-btn
            fab
            x-small
            class="mb-2"
            :ripple="false"
          >
            <v-icon>mdi-tune</v-icon>
          </v-btn>
          <v-btn
            fab
            x-small
            :ripple="false"
            @click="getQuote"
          >
            <v-icon>mdi-autorenew</v-icon>
          </v-btn>
        </div>
      </v-card>
      <v-card v-if="isIntroShown" class="movie-intro">
        <MovieDetail :movieObj="movieObj">
          <template v-slot:movieInfo>
            <div class="mb-8">
              <a :href="movieObj.trailer.link" target="_blank">Watch Trailer</a>
            </div>
            <div class="d-flex justify-end">
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
          </template>
          <template v-slot:colRight>
            <div class="d-flex flex-column ml-2">
              <v-btn
                fab
                x-small
                class="mb-3"
                :ripple="false"
              >
                <v-icon>mdi-tune</v-icon>
              </v-btn>
              <v-btn
                fab
                x-small
                :ripple="false"
                @click="getQuote"
              >
                <v-icon>mdi-autorenew</v-icon>
              </v-btn>
            </div>
          </template>
        </MovieDetail>
      </v-card>
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
  position: relative;
  min-width: 300px;
  max-width: 700px;
  height: fit-content;
  min-height: 200px;
  margin-top: 8vh;
  padding: 25px 30px;
  border: 1px solid #555;
  outline: 1px dashed #888;
  outline-offset: -10px;
  background-color: rgba(255, 255, 255, 0.7);

  &-actions {
    position: absolute;
    top: 0;
    right: -45px;
  }
}

.movie-intro {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  align-self: center;
  background-color: rgba(255, 255, 255, 0.7);
}

.btn-direct {
  text-decoration: underline;
}
</style>