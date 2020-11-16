<template>
  <div
    :style="{
      backgroundImage:
        bgImage +
        ', linear-gradient(#F1F1F1 0%, #EEE 60%, #888 100%)',
    }"
    class="page-home"
  >
    <div class="d-flex justify-center h-100">
      <template v-if="quoteObj">
        <v-card
          v-if="!isIntroShown"
          class="card-quote d-flex flex-column justify-space-between align-end"
        >
          <Quote :quoteObj="quoteObj" />
          <div>
            <CollectBtn
              v-if="isLogin"
              :isCollected="isCollected"
              :movieObj="movieQuoteObj"
              :collectionId="collectionId"
              @updateIsCollected="updateIsCollected"
              @updateListid="updateListid"
            />
            <v-btn text class="btn-direct px-2" @click="enterMovieIntro">
              Check it &rarr;
            </v-btn>
          </div>
          <div class="card-quote-actions d-flex flex-column">
            <v-btn fab x-small class="mb-2">
              <v-icon>mdi-tune</v-icon>
            </v-btn>
            <v-btn fab x-small @click="getQuote">
              <v-icon>mdi-autorenew</v-icon>
            </v-btn>
          </div>
        </v-card>
        <v-card v-if="isIntroShown" class="movie-intro">
          <MovieDetail :movieObj="movieObj">
            <template v-slot:movieInfo>
              <div class="mb-8">
                <v-btn
                  depressed
                  class="text-none"
                  color="#f5de50"
                  tag="a"
                  :href="movieObj.trailer.link"
                  target="_blank"
                >
                  Watch Trailer
                </v-btn>
              </div>
              <div class="d-flex justify-end">
                <CollectBtn
                  v-if="isLogin"
                  :isCollected="isCollected"
                  :movieObj="movieQuoteObj"
                  :collectionId="collectionId"
                  @updateIsCollected="updateIsCollected"
                  @updateListid="updateListid"
                />
                <v-btn text class="btn-direct px-2" @click="leaveMovieIntro">
                  Back &rarr;
                </v-btn>
              </div>
            </template>
            <template v-slot:colRight>
              <div class="d-flex flex-column ml-2">
                <v-btn fab x-small class="mb-3">
                  <v-icon>mdi-tune</v-icon>
                </v-btn>
                <v-btn fab x-small @click="getQuote">
                  <v-icon>mdi-autorenew</v-icon>
                </v-btn>
              </div>
            </template>
          </MovieDetail>
        </v-card>
      </template>
      <template v-else>
        <v-skeleton-loader
          min-width="500"
          max-width="700"
          type="image"
          class="card-quote-loading"
        ></v-skeleton-loader>
      </template>
    </div>
  </div>
</template>

<script>
import CollectBtn from "@/components/collectBtn";
import MovieDetail from "@/components/movieDetail";
import Quote from "@/components/quote";
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";

export default {
  mixins: [mixin],
  components: {
    CollectBtn,
    MovieDetail,
    Quote,
  },
  data() {
    return {
      isCollected: false,
      movieQuoteObj: undefined,
      collectionId: "",
    };
  },
  computed: {
    ...mapState([
      "isLogin",
      "user",
      "quoteObj",
      "movieObj",
      "collections",
      "isIntroShown",
    ]),
    bgImage() {
      if (this.movieObj.poster) {
        return `url(${this.movieObj.poster})`;
      } else {
        return `url(${require('@/assets/bg.jpg')})`;
      }
    },
  },
  async mounted() {
    await this.wait(500);
    if (this.quoteObj) {
      this.initMovieQuoteData();
    }
  },
  watch: {
    movieObj: {
      handler: function() {
        if (this.quoteObj) {
          this.initMovieQuoteData();
        }
      },
      deep: true,
    },
  },
  methods: {
    initMovieQuoteData() {
      const movieObjInCollections = this.collections.find(
        (item) => item.movie.quote === this.quoteObj.quote
      );
      if (movieObjInCollections) {
        this.isCollected = true;
        this.movieQuoteObj = Object.assign(
          {
            quote: this.quoteObj.quote,
            listid: movieObjInCollections.movie.listid,
            comments: movieObjInCollections.movie.comments,
          },
          this.movieObj
        );
        this.collectionId = movieObjInCollections.collectionId;
      } else {
        this.isCollected = false;
        this.movieQuoteObj = Object.assign(
          {
            quote: this.quoteObj.quote,
            listid: "",
            comments: "",
          },
          this.movieObj
        );
        this.collectionId = "";
      }
    },
    updateIsCollected(val) {
      this.isCollected = val;
    },
    updateListid(val) {
      this.movieQuoteObj.listid = val;
    },
    enterMovieIntro() {
      this.$store.commit("updateIntroShownFlag", true);
    },
    leaveMovieIntro() {
      this.$store.commit("updateIntroShownFlag", false);
    },
    getQuote() {
      this.$store.dispatch("getQuote");
    },
  },
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

.card-quote-loading {
  margin-top: 8vh;
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
