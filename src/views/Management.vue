<template>
  <div class="view d-flex justify-center h-100">
    <div class="page-management w-100">
      <div v-if="user.role === 'maintainer'">
        <!-- <NewQuote /> -->
        <v-card flat class="page-header">
          <v-card-title class="pa-0">Quotes Management</v-card-title>
          <div class="d-flex">
            <div class="filter">
              <div class="d-flex mb-2">
                <div class="form-item form-item-small d-flex align-center mr-4">
                  <label for="movieName" class="form-item-label mr-2">Movie</label>
                  <v-text-field
                    v-model="filter.movie"
                    :color="mainColor"
                    id="movieName"
                    hide-details
                    class="mt-0 pt-0"
                  ></v-text-field>
                </div>
                <div class="form-item form-item-small d-flex align-center">
                  <label for="imdbId" class="form-item-label mr-2">IMDB ID</label>
                  <v-text-field
                    v-model="filter.imdbId"
                    :color="mainColor"
                    id="imdbId"
                    hide-details
                    class="mt-0 pt-0"
                  ></v-text-field>
                </div>
              </div>
              <div class="d-flex mb-3">
                <div class="form-item form-item-small d-flex align-center mr-4">
                  <label for="movieQuote" class="form-item-label mr-2">Quote</label>
                  <v-text-field
                    v-model="filter.quote"
                    :color="mainColor"
                    id="movieQuote"
                    hide-details
                    class="mt-0 pt-0"
                  ></v-text-field>
                </div>
                <div class="form-item form-item-medium d-flex align-center">
                  <label for="movieQuote" class="form-item-label mr-2">Year</label>
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
              <div>
                <div class="form-item form-item-large d-flex align-start">
                  <label class="form-item-label mr-2">Genre</label>
                  <div class="d-flex flex-wrap">
                    <div v-for="(genre, index) in genreOptions" :key="index" class="genreOption">
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
            <v-simple-checkbox v-model="item.checked" :ripple="false"></v-simple-checkbox>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        
        </v-data-table>
      </div>
      <div v-else>
        <div class="remind-no-permission">Sorry, you are not allowed to access this page.</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import NewQuote from "@/components/newQuote";
import { mixin } from "@/utils/mixin";
import { db } from '@/assets/firebase.js';

let unsubscribe;

export default {
  mixins: [mixin],
  metaInfo: {
    title: 'Management | Meet a Movie'
  },
  components: {
    // NewQuote,
  },
  data() {
    return {
      filter: {
        movie: "",
        imdbId: "",
        yearFrom: null,
        yearTo: null,
        genre: [],
        quote: "",
        checked: false
      },
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
          align: 'start',
          sortable: false,
          value: 'actions',
        },
      ],
      quotes: []
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
  mounted() {
    this.getQuote();
  },
  destroyed() {
    unsubscribe();
  },
  methods: {
    getQuote() {
      unsubscribe = db.collection("quote").orderBy("timestamp", "desc").limit(30)
        .onSnapshot((querySnapshot) => {
            this.quotes = [];
            querySnapshot.forEach((doc) => {
                this.quotes.push(doc.data());
            });
        });
    },
    editItem(item) {
      console.log(item);
    },
    deleteItem(item) {
      console.log(item);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.view {
  background-color: rgba(#fff, 0.6);
}

.page-management {
  max-width: 1100px;
  height: calc(var(--vh, 1vh) * 100 - 56px);
  padding: 12px 20px;
  overflow: scroll;
}

.page-header {
  padding: 8px 16px 12px 16px;
  margin-bottom: 12px;
}

.filter {
  width: 85%;

  .form-item {
    font-size: 12px;

    &-small {
      width: 220px;
    }

    &-medium {
      width: 300px;
    }
    
    &-large {
      width: 600px;
    }

    &-label {
      font-weight: 500;
      width: 40px
    }

    .genreOption {
      width: 90px;
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