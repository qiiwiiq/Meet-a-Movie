<template>
  <div class="view d-flex justify-center h-100">
    <div class="links">
      <v-card
        href="https://www.imdb.com/"
        class="btn-link"
      >
        <img src="../assets/imdblogo.png">
      </v-card>
      <v-card
        href="https://www.rottentomatoes.com/"
        class="btn-link"
        color="#FA3209"
      >
        <img src="../assets/rtlogo.png">
      </v-card>
    </div>
    <div v-if="isLogin" class="page-management w-100">
      <v-card flat class="page-header">
        <v-card-title class="pa-0 mb-2">
          Quotes Library
          <span class="note">Note: 10 quotes at most for each search</span>
        </v-card-title>
        <div class="d-flex justify-center">
          <div class="filter">
            <div class="d-flex mb-3">
              <div class="form-item d-flex align-center mr-8">
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
              <div class="form-item d-flex align-center">
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
            <div class="mr-4">
              <v-btn
                :outlined="!isFiltered"
                :depressed="isFiltered"
                :dark="isFiltered"
                color="#424242"
                class="btn-actions--rect mb-2"
                @click="filterQuotes"
              >
                Filter
              </v-btn>
              <v-btn
                outlined
                color="#424242"
                class="btn-actions--rect"
                @click="reset"
              >
                Reset
              </v-btn>
            </div>
            <v-btn
              outlined
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
      </v-data-table>
    </div>
    <v-dialog v-model="newQuoteDialogOpened" width="550" persistent>
      <div class="quote-dialog">
        <v-btn
          icon
          small
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import QuoteEditor from "@/components/quoteEditor";
import { mixin } from "@/utils/mixin";
import { db } from '@/assets/firebase.js';

export default {
  mixins: [mixin],
  metaInfo: {
    title: 'Library | Meet a Movie'
  },
  components: {
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
          width: 180
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
      ],
      quotes: [],
    }
  },
  computed: {
    ...mapState(["isLogin", "user"]),
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
    }
  },
  methods: {
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
        let years = [];
        for (let i = this.filter.yearFrom; i<=this.filter.yearTo; i++) {
          years.push(i);
        }
        queryRef = queryRef.where("year", 'in', years)
      }

      if (this.filter.yearFrom && !this.filter.yearTo) {
        let years = [];
        for (let i = this.filter.yearFrom; i<=this.currentYear; i++) {
          years.push(i);
        }
        queryRef = queryRef.where("year", 'in', years)
      }

      if (!this.filter.yearFrom && this.filter.yearTo) {
        let years = [];
        for (let i = this.minYear; i<=this.filter.yearTo; i++) {
          years.push(i);
        }
        queryRef = queryRef.where("year", 'in', years)
      }

      if (this.filter.genre.length > 0) {
        queryRef = queryRef.where("genre", "array-contains-any", this.filter.genre);
      }

      this.unsubscribe = queryRef.orderBy("timestamp", "desc").limit(10)
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.view {
  position: relative;
  background-color: rgba(#fff, 0.6);
}

.links {
  position: absolute;
  top: 12px;
  right: 0;
  padding: 12px 8px;
  background-color: rgba(#000, .8);
  border-radius: 4px 0 0 4px;
  z-index: 10;

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
  min-width: 970px;
  height: calc(var(--vh, 1vh) * 100 - 56px);
  padding: 12px 20px;
  overflow: scroll;
}

.page-header {
  padding: 8px 16px 12px 16px;
  margin-bottom: 12px;

  .note {
    font-size: 14px;
    font-weight: 400;
    margin-left: 8px;
  }
}

.filter {
  .form-item {
    font-size: 12px;

    &-label {
      font-weight: 500;
      width: 50px
    }

    &-content {
      &--small {
        width: 180px;
      }

      &--medium {
        width: 260px;
      }

      &--large {
        width: 630px;
      }
    }

    .genreOption {
      width: 90px;
    }
  }
}

.actions {
  display: flex;

  .btn-actions {
    &--rect {
      display: block;
      width: 90px;
      text-transform: none;
    }

    &--square {
      height: 80px;
      text-transform: none;
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