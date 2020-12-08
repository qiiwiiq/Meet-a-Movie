<template>
  <div class="view h-100">
    <div class="links">
      <v-card
        href="https://www.imdb.com/"
        target="_blank"
        class="btn-link"
      >
        <img src="../assets/imdblogo.png">
      </v-card>
      <v-card
        href="https://www.rottentomatoes.com/"
        target="_blank"
        class="btn-link"
        color="#FA3209"
      >
        <img src="../assets/rtlogo.png">
      </v-card>
    </div>
    <div v-if="isLogin" class="page-management w-100">
      <v-card flat class="page-header">
        <v-card-title class="page-title pa-0 mb-2">
          <span>Quotes Library</span>
          <span class="note">Note: 10 quotes at most for each search</span>
        </v-card-title>
        <div class="section-filter">
          <div class="filter">
            <div class="form-item-row">
              <div class="form-item d-flex align-center mr-8 mb-3">
                <label for="imdbId" class="form-item-label mr-2">IMDB ID</label>
                <div class="form-item-content--small">
                  <v-text-field
                    v-model="filter.imdbId"
                    :color="mainColor"
                    id="imdbId"
                    hide-details
                    class="mt-0 pt-0"
                  ></v-text-field>
                </div>
              </div>
              <div class="form-item d-flex align-center mb-3">
                <label for="movieQuote" class="form-item-label mr-2">Year</label>
                <div class="form-item-content--medium d-flex align-center">
                  <v-select
                    v-model="filter.yearFrom"
                    :items="yearFromOptions"
                    :color="mainColor"
                    :menu-props="{ bottom: true, offsetY: true }"
                    dense
                    outlined
                    hide-details
                  ></v-select>
                  <span class="dash mx-2"></span>
                  <v-select
                    v-model="filter.yearTo"
                    :items="yearToOptions"
                    :color="mainColor"
                    :menu-props="{ bottom: true, offsetY: true }"
                    dense
                    outlined
                    hide-details
                  ></v-select>
                </div>
              </div>
            </div>
            <div>
              <div class="form-item d-flex align-start">
                <label class="form-item-label mr-2">Genre</label>
                <div class="form-item-content--large d-flex flex-wrap">
                  <div
                    v-for="(genre, index) in genreOptions"
                    :key="index"
                    class="form-item-content genreOption"
                  >
                    <v-checkbox
                      dense
                      v-model="filter.genre"
                      :label="genre"
                      :value="genre"
                      :color="mainColor"
                      :ripple="false"
                      hide-details
                      class="mt-0 pt-0 mr-4"
                    ></v-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="actions">
            <v-btn
              outlined
              small
              color="#E57373"
              class="btn-new-quote--mobile"
              @click="newQuoteDialogOpened = true"
            >
              New Quote
            </v-btn>
            <div class="btn-filter-reset">
              <v-btn
                :outlined="!isFiltered"
                :depressed="isFiltered"
                :dark="isFiltered"
                :small="windowWidth <= 1024"
                color="#424242"
                class="btn-actions--rect"
                @click="filterQuotes"
              >
                Filter
              </v-btn>
              <v-btn
                outlined
                :small="windowWidth <= 1024"
                color="#424242"
                class="btn-actions--rect"
                @click="reset"
              >
                Reset
              </v-btn>
            </div>
            <v-btn
              outlined
              :small="windowWidth <= 1024"
              color="#E57373"
              class="btn-actions--square"
              @click="newQuoteDialogOpened = true"
            >
              New<br />Quote
            </v-btn>
          </div>
        </div>
      </v-card>
      <v-data-table
        :headers="tableHeaders"
        :items="quotes"
        :items-per-page="10"
      >
        <template v-slot:[`item.movie`]="{ item }">
          <a
            :href="'https://www.imdb.com/title/' + item.imdbId"
            target="_blank"
          >
            {{ item.name }}
          </a>
        </template>
        <template v-slot:[`item.genre`]="{ item }">
          <div v-for="(genre, i) in item.genre" :key="i">
            <div class="genre">{{ genre }}</div> 
          </div>
        </template>
        <template v-slot:[`item.collect`]="{ item }">
          <v-icon
            v-if="isCollected(item, collections)"
            class="mr-2"
            color="#B71C1C"
          >
            mdi-heart
          </v-icon>
          <v-icon
            v-else
            class="mr-2"
          >
            mdi-heart-outline
          </v-icon>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="mr-2"
            @click="showIntro(item)"
          >
            mdi-clipboard-text-outline
          </v-icon>
        </template>
      </v-data-table>
    </div>
    <v-dialog v-model="newQuoteDialogOpened" width="550" persistent>
      <div class="quote-dialog">
        <v-btn
          icon
          small
          :ripple="false"
          class="close-btn"
          @click="newQuoteDialogOpened = false"
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
        <QuoteEditor
          :title="'New Quote'"
          :purpose="'new'"
        />
      </div>
    </v-dialog>
    <v-dialog v-model="isIntroShown" max-width="900" persistent>
      <v-card class="movie-detail-card pa-4">
        <v-btn
          icon
          small
          :ripple="false"
          class="close-btn"
          @click="closeIntro"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <template v-if="movieObj">
          <MovieDetail :movieObj="movieObj" class="mr-2">
            <template v-slot:movieInfo>
              <div class="d-flex justify-space-between">
                <v-btn
                  depressed
                  class="text-none"
                  tag="a"
                  :small="windowWidth <= 560"
                  :href="movieObj.trailer.link"
                  target="_blank"
                >
                  Watch Trailer
                </v-btn>
                <CollectBtn
                  :movieObj="movieObj"
                />
              </div>
              <div class="quote text-center px-4 py-3 py-sm-6 flex-grow-1 d-flex justify-center align-center">
                {{ movieObj.quote }}
              </div>
            </template>
          </MovieDetail>
        </template>
        <template v-else>
          <Loading
            :active="!movieObj"
            :is-full-page="false"
            :color="mainColor"
            loader="dots"
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CollectBtn from "@/components/buttons/collectBtn";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import MovieDetail from "@/components/movieDetail";
import QuoteEditor from "@/components/quoteEditor";
import { mixin } from "@/utils/mixin";
import { apiGetFilm } from "@/api/api.js";
import { db } from '@/assets/firebase.js';

export default {
  mixins: [mixin],
  metaInfo: {
    title: 'Library | Meet a Movie'
  },
  components: {
    CollectBtn,
    Loading,
    MovieDetail,
    QuoteEditor,
  },
  data() {
    return {
      unsubscribe: undefined,
      isFiltered: false,
      filter: {
        imdbId: "",
        yearFrom: null,
        yearTo: null,
        genre: [],
      },
      newQuoteDialogOpened: false,
      tableHeaders: [
        {
          text: 'Movie',
          align: 'start',
          sortable: true,
          value: 'movie',
          width: 150
        },
        {
          text: 'Year',
          align: 'start',
          sortable: true,
          value: 'year',
          width: 100
        },
        {
          text: 'Genres',
          align: 'start',
          sortable: false,
          value: 'genre',
          width: 100
        },
        {
          text: 'Quote',
          align: 'start',
          sortable: false,
          value: 'quote',
        },
        {
          text: 'Collect',
          align: 'center',
          sortable: false,
          value: 'collect',
        },
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
      quotes: [],
      isIntroShown: false,
      movieObj: undefined
    }
  },
  computed: {
    ...mapState(["isLogin", "user", "collections"]),
    yearFromOptions() {
      let options = [];
      const lastOption = this.filter.yearTo ? this.filter.yearTo : null;
      if (lastOption) {
        const firstOption = (lastOption - 9) < this.minYear ? this.minYear : (lastOption - 9);
        for (let i = lastOption; i >= firstOption; i--) {
          options.push(i);
        }
      } else {
        for (let i = this.minYear; i <= this.currentYear; i++) {
          options.unshift(i);
        }
      }
      return options;
    },
    yearToOptions() {
      let options = [];
      const firstOption = this.filter.yearFrom ? this.filter.yearFrom : null;
      if (firstOption) {
        const lastOption = (firstOption + 9) > this.currentYear ? this.currentYear : (firstOption + 9);
        for (let i = firstOption; i <= lastOption; i++) {
          options.unshift(i);
        }
      } else {
        for (let i = this.minYear; i <= this.currentYear; i++) {
          options.unshift(i);
        }
      }
      return options;
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.isLogin) {
        vm.$router.replace({ name: "SignIn" });
      }
    });
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  watch: {
    isLogin(val) {
      if (!val) this.$router.replace({ name: "SignIn" });
    },
    filter: {
      handler: function() {
        if (this.filter.yearFrom && !this.filter.yearTo) {
          this.filter.yearTo = this.filter.yearFrom;
        }

        if (this.filter.yearTo && !this.filter.yearFrom) {
          this.filter.yearFrom = this.filter.yearTo;
        }
      },
      deep: true
    },
    collections() {
      if (this.movieObj) {
        const movieObjInCollections = this.collections.find(
          (item) => item.quoteId === this.movieObj.quoteId
        );
        if (movieObjInCollections) {
          this.movieObj.collectionId = movieObjInCollections.collectionId;
          this.movieObj.listid = movieObjInCollections.listid;
          this.movieObj.comments = movieObjInCollections.comments;
        } else {
          this.movieObj.collectionId = "";
          this.movieObj.listid = "";
          this.movieObj.comments = "";
        }
      }
    }
  },
  methods: {
    isCollected(quoteObj, collections) {
      return collections.some(item => item.quoteId === quoteObj.id)
    },
    getQuote() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.quotes = [];
      let queryRef = db.collection("quote");

      if (this.filter.imdbId) {
        queryRef = queryRef.where("imdbId", "==", this.filter.imdbId);
      }

      if (this.filter.yearFrom && this.filter.yearTo) {
        queryRef = queryRef.where("year", '>=', this.filter.yearFrom);
        queryRef = queryRef.where("year", '<=', this.filter.yearTo);
      }

      if (this.filter.genre.length > 0) {
        queryRef = queryRef.where("genre", "array-contains-any", this.filter.genre);
      }

      this.unsubscribe = queryRef.orderBy("year", "desc")
        .onSnapshot((querySnapshot) => {
            this.quotes = [];
            querySnapshot.forEach((doc) => {
                this.quotes.push(doc.data());
            });
        });
    },
    filterQuotes() {
      this.isFiltered = true;
      this.getQuote();
    },
    reset() {
      this.isFiltered = false;
      this.filter.movie = "";
      this.filter.imdbId = "";
      this.filter.yearFrom = null;
      this.filter.yearTo = null;
      this.filter.genre = [];
      this.filter.quote = "";
    },
    getMovieObj(quoteObj) {
      const movieObjInCollections = this.collections.find(
        (item) => item.quoteId === quoteObj.id
      );

      apiGetFilm(quoteObj.imdbId).then(
        (res) => {
          if (movieObjInCollections) {
            this.movieObj = Object.assign(
              {
                collectionId: movieObjInCollections.collectionId,
                quoteId: quoteObj.id,
                quote: quoteObj.quote,
                genre: quoteObj.genre,
                listid: movieObjInCollections.listid,
                comments: movieObjInCollections.comments,
              },
              {...res.data}
            );
          } else {
            this.movieObj = Object.assign(
              {
                collectionId: "",
                quoteId: quoteObj.id,
                quote: quoteObj.quote,
                genre: quoteObj.genre,
                listid: "",
                comments: "",
              },
              {...res.data}
            );
          }
        },
        () => {
          console.log('err');
        });
    },
    showIntro(item) {
      this.getMovieObj(item);
      this.isIntroShown = true;
    },
    closeIntro() {
      this.isIntroShown = false;
      this.movieObj = undefined;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.view {
  position: relative;
  background-color: rgba(#fff, 0.6);
  display: flex;
  justify-content: center;
}

.links {
  position: absolute;
  top: 12px;
  right: 0;
  padding: 12px 8px;
  background-color: rgba(#000, .8);
  border-radius: 4px 0 0 4px;
  z-index: 10;

  @include respond(large-mobile) {
    top: 8px;
  }

  .btn-link {
    width: 40px;
    min-width: 40px;
    height: 40px;
    min-height: 40px;

    &:first-child {
      margin-bottom: 12px;

      @include respond(tab-land) {
        margin-bottom: 8px;
      }
    }

    @include respond(tab-land) {
      width: 30px;
      min-width: 30px;
      height: 30px;
      min-height: 30px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.page-management {
  max-width: 1100px;
  height: calc(var(--vh, 1vh) * 100 - 56px);
  padding: 12px 20px;
  overflow: scroll;

  @include respond(large-mobile) {
    padding: 8px;
  }
}

.page-header {
  padding: 8px 16px 12px 16px;
  margin-bottom: 12px;

  .page-title {
    @include respond(large-mobile) {
      display: block;
    }
  }

  .note {
    font-size: 14px;
    font-weight: 400;
    margin-left: 8px;

    @include respond(large-mobile) {
      display: block;
      margin-left: 0;
      font-size: 12px;
      line-height: 12px;
    }
  }
}

.section-filter {
  display: flex;
  justify-content: center;

  @include respond(tab-port) {
    display: block;
  }

  .filter {
    .form-item-row {
      display: flex;

      @include respond(tab-port) {
        display: block;
      }      
    }

    .form-item {
      font-size: 12px;

      &-label {
        font-weight: 500;
        width: 50px;

        @include respond(tab-land) {
          width: 45px;
        }
      }

      &-content {
        &--small {
          width: 180px;
        }

        &--medium {
          width: 260px;

          @include respond(tab-land) {
            width: 240px;
          }

          @include respond(small-mobile) {
            width: 100%;
          }
        }

        &--large {
          width: 630px;

          @include respond(tab-land) {
            width: 540px;
          }

          @include respond(tab-port) {
            width: 100%;
          }
        }
      }

      .genreOption {
        width: 90px;
      }
    }
  }

  .actions {
    display: flex;

    @include respond(tab-land) {
      display: block;
    }

    @include respond(tab-port) {
      display: flex;
      justify-content: space-between;
    }

    .btn-new-quote--mobile {
      display: none;

      @include respond(tab-port) {
        display: block;
        margin-top: 20px;
        text-transform: none;
      }
    }

    .btn-filter-reset {
      @include respond(tab-port) {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 20px;
      }
    }

    .btn-actions {
      &--rect {
        display: block;
        width: 90px;
        text-transform: none;
        margin-right: 16px;
        margin-bottom: 8px;

        @include respond(tab-land) {
          width: 65px;
        }

        @include respond(tab-port) {
          display: inline-block;
        }
      }

      &--square {
        width: 80px;
        height: 80px;
        text-transform: none;

        @include respond(tab-land) {
          width: 65px;
          height: 65px;
        }

        @include respond(tab-port) {
          display: none;
        }
      }
    }
  }
}

.genre {
  font-size: 12px;
}

.dash {
  background-color: grey;
  width: 15px;
  height: 1px;
}

.quote-dialog {
  position: relative;
}

.movie-detail-card {
  position: relative;
  min-height: 100px;

  .quote {
    font-style: italic;
    font-size: 16px;
    font-weight: 300;
    line-height: 20px;

    @include respond(tab-port) {
      font-size: 14px;
      line-height: 16px;
    }
  }
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
}
</style>

<style lang="scss">
.genreOption .v-input--selection-controls__input {
  margin-right: 4px;
  width: 20px;
  height: 20px;

  & + .v-label {
    font-size: 12px;
  }
}
</style>