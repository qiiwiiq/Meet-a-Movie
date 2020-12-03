<template>
  <div class="view h-100">
    <div class="page-management w-100">
      <div v-if="user.role === 'maintainer'">
        <v-card flat class="page-header">
          <v-btn
            outlined
            small
            color="#E57373"
            class="btn-new-quote--mobile"
            @click="newQuoteDialogOpened = true"
          >
            New<br />Quote
          </v-btn>
          <v-card-title class="page-title pa-0 mb-2">
            <span>Quotes Management</span>
            <span class="note">Note: 30 quotes at most for each search</span>
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
          <template v-slot:[`item.checked`]="{ item }">
            <v-simple-checkbox
              v-model="item.checked"
              :ripple="false"
              disabled
            ></v-simple-checkbox>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editQuote(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </div>
      <div v-else>
        <div class="remind-no-permission">Sorry, you are not allowed to access this page.</div>
      </div>
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
    <v-dialog v-model="editQuoteDialogOpened" width="550" persistent>
      <div class="quote-dialog">
        <v-btn
          icon
          small
          class="close-btn"
          @click="closeEditQuoteDialog"
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
        <QuoteEditor
          :title="'Edit Quote'"
          :purpose="'edit'"
          :quote="selectedQuote"
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
    title: 'Management | Meet a Movie'
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
      editQuoteDialogOpened: false,
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
          width: 80
        },
        {
          text: 'Genres',
          align: 'start',
          sortable: false,
          value: 'genre',
          width: 88
        },
        {
          text: 'Quote',
          align: 'start',
          sortable: false,
          value: 'quote',
        },
        {
          text: 'Checked',
          align: 'center',
          sortable: true,
          value: 'checked',
          width: 100
        },
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
      quotes: [],
      selectedQuote: undefined
    }
  },
  computed: {
    ...mapState(["user"]),
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
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  watch: {
    filter: {
      handler: function() {
        if (this.filter.yearFrom && !this.filter.yearTo) {
          this.filter.yearTo = this.filter.yearFrom;
        }

        if (this.filter.To && !this.filter.yearFrom) {
          this.filter.yearFrom = this.filter.yearTo;
        }
      },
      deep: true
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

      this.unsubscribe = queryRef.orderBy("timestamp", "desc").limit(30)
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
    editQuote(item) {
      this.selectedQuote = item;
      this.editQuoteDialogOpened = true;
    },
    closeEditQuoteDialog() {
      this.editQuoteDialogOpened = false;
      this.selectedQuote = undefined;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.view {
  background-color: rgba(#fff, 0.6);
  display: flex;
  justify-content: center;
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
  position: relative;
  padding: 8px 16px 12px 16px;
  margin-bottom: 12px;

  .btn-new-quote--mobile {
    display: none;

    @include respond(tab-port) {
      display: block;
      position: absolute;
      top: 8px;
      right: 16px;
      width: 65px;
      height: 65px;
      text-transform: none;
    }

    @include respond(large-mobile) {
      width: 56px;
      height: 56px;
    }
  }

  .page-title {
    word-break: unset;

    @include respond(tab-port) {
      display: block;
    }
  }

  .note {
    font-size: 14px;
    font-weight: 400;
    margin-left: 8px;

    @include respond(tab-port) {
      display: block;
      margin-left: 0;
      line-height: 12px;
    }

    @include respond(large-mobile) {
      font-size: 12px;
    }
    
    @include respond(small-mobile) {
      width: 60%;
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
}



.actions {
  display: flex;

  @include respond(tab-land) {
    display: block;
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
        margin: 0 0 0 16px;
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

.genre {
  font-size: 12px;
}

.dash {
  background-color: grey;
  width: 15px;
  height: 1px;
}

.remind-no-permission {
  margin-top: 30px;
  padding: 0 20px;
  font-size: 20px;
  font-weight: 500;
  color: #FFF;
  text-align: center;

  @include respond(tab-port) {
    font-size: 18px;
  }
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