<template>
  <div
    :style="{
      backgroundImage:
        bgImage +
        ', linear-gradient(#F1F1F1 0%, #EEE 60%, #888 100%)',
    }"
    class="page-home"
  > 
    <template v-if="quoteObj && !quoteObj.error">
      <div class="d-flex justify-center h-100 px-4">
        <v-card
          v-if="!isIntroShown"
          class="card-quote d-flex flex-column justify-space-between align-end"
        >
          <Quote :quoteObj="quoteObj" />
          <div>
            <CollectBtn
              v-if="isLogin"
              class="mr-1"
              :movieObj="movieQuoteObj"
            />
            <v-btn text class="btn-direct px-2" @click="enterMovieIntro">
              Check it &rarr;
            </v-btn>
          </div>
          <div class="card-quote-actions d-flex">
            <div class="btn-filter">
              <FilterBtn />
            </div>
            <v-btn fab x-small @click="getQuote">
              <v-icon>mdi-autorenew</v-icon>
            </v-btn>
          </div>
        </v-card>
        <v-card v-if="isIntroShown" class="movie-intro">
          <MovieDetail :movieObj="movieQuoteObj">
            <template v-slot:movieInfo>
              <div class="mb-8">
                <v-btn
                  depressed
                  class="text-none"
                  color="#f5de50"
                  :small="windowWidth <= 560"
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
                  class="mr-1"
                  :movieObj="movieQuoteObj"
                />
                <v-btn text class="btn-direct px-2" @click="leaveMovieIntro">
                  Back &rarr;
                </v-btn>
              </div>
            </template>
            <template v-slot:topColRight>
              <div class="quote-actions--mobile flex-column">
                <div class="mb-3">
                  <FilterBtn
                    :outlinedBtn="true"
                  />
                </div>
                <v-btn icon small outlined @click="getQuote">
                  <v-icon small>mdi-autorenew</v-icon>
                </v-btn>
              </div>
            </template>
            <template v-slot:colRight>
              <div class="quote-actions flex-column">
                <div class="mb-3">
                  <FilterBtn />
                </div>
                <v-btn fab x-small @click="getQuote">
                  <v-icon>mdi-autorenew</v-icon>
                </v-btn>
              </div>
            </template>
          </MovieDetail>
        </v-card>
      </div>
    </template>
    <template v-else-if="quoteObj && quoteObj.error">
      <ComingSoon />
    </template>
    <template v-else>
      <div class="d-flex justify-center h-100 px-4">
        <v-skeleton-loader
          type="image"
          class="card-quote-loading"
        ></v-skeleton-loader>
      </div>
    </template>
  </div>
</template>

<script>
import CollectBtn from "@/components/buttons/collectBtn";
import ComingSoon from "@/components/comingSoon";
import FilterBtn from "@/components/buttons/filterBtn";
import MovieDetail from "@/components/movieDetail";
import Quote from "@/components/quote";
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";

export default {
  metaInfo: {
    title: 'Meet a Movie'
  },
  mixins: [mixin],
  components: {
    CollectBtn,
    ComingSoon,
    FilterBtn,
    MovieDetail,
    Quote,
  },
  data() {
    return {
      movieQuoteObj: undefined,
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
  mounted() {
    let vm = this;
    vm.$nextTick(() => {
      if (vm.quoteObj) {
        vm.initMovieQuoteData();
      }
    })
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
    collections() {
      if (this.collections.length > 0 && this.quoteObj) {
        this.initMovieQuoteData();
      }
    }
  },
  methods: {
    initMovieQuoteData() {
      const movieObjInCollections = this.collections.find(
        (item) => item.quoteId === this.quoteObj.id
      );
      if (movieObjInCollections) {
        this.movieQuoteObj = Object.assign(
          {
            collectionId: movieObjInCollections.collectionId,
            quoteId: this.quoteObj.id,
            quote: this.quoteObj.quote,
            genre: this.quoteObj.genre,
            listid: movieObjInCollections.listid,
            comments: movieObjInCollections.comments,
          },
          this.movieObj
        );
      } else {
        this.movieQuoteObj = Object.assign(
          {
            collectionId: "",
            quoteId: this.quoteObj.id,
            quote: this.quoteObj.quote,
            genre: this.quoteObj.genre,
            listid: "",
            comments: "",
          },
          this.movieObj
        );
      }
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
@import '@/scss/mixins.scss';

.page-home {
  height: calc(var(--vh, 1vh) * 100 - 56px);
  background-size: cover;
  background-position: 50% 80%;
  background-blend-mode: soft-light;
  overflow: scroll;
}

.card-quote {
  position: relative;
  min-width: 300px;
  max-width: 700px;
  height: fit-content;
  margin: 8vh 0 30px 0;
  padding: 25px 30px;
  border: 1px solid #555;
  outline: 1px dashed #888;
  outline-offset: -10px;
  background-color: rgba(255, 255, 255, 0.7);

  @include respond(tab-land) {
    max-width: 600px;
    margin: 10vh 0 30px 0;
  }

  @include respond(tab-port) {
    margin: 60px 0 30px 0;
  }

  @include respond(large-mobile) {
    padding: 24px 20px;
    min-width: 250px;
  }

  &-actions {
    flex-direction: column;
    position: absolute;
    top: 0;
    right: -45px;

    @include respond(tab-port) {
      flex-direction: row;
      top: -43px;
      right: 8px;
    }

    .btn-filter {
      margin-bottom: 8px;

      @include respond(tab-port) {
        margin-bottom: 0;
        margin-right: 8px;
      }
    }
  }
}

.card-quote-loading {
  margin: 8vh 0 30px 0;
  width: 50vw;

   @include respond(tab-land) {
    margin: 10vh 0 30px 0;
    width: 60vw;
  }

  @include respond(tab-port) {
    margin: 60px 0 30px 0;
  }

  @include respond(large-mobile) {
    width: 80vw;
  }
}

.movie-intro {
  width: 100%;
  max-width: 1000px;
  min-width: 280px;
  height: fit-content;
  padding: 20px;
  margin: 30px 0;
  background-color: rgba(255, 255, 255, 0.7);

  @include respond(tab-port) {
    padding: 16px;
  }

  @include respond(mobile) {
    padding: 8px;
  }

  .quote-actions {
    display: flex;
    margin-left: 8px;

    @include respond(tab-port) {
      margin-left: 0;
    }

    @include respond(mobile) {
      display: none;
    }
  }

  .quote-actions--mobile {
    display: none;

    @include respond(mobile) {
      display: flex;
    }
  }
}

.btn-direct {
  text-decoration: underline;

  @include respond(large-mobile) {
    font-size: 13px;
  }
}
</style>
