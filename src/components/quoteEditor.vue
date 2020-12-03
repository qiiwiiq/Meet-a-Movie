<template>
  <v-card class="card-new-quote px-2 pb-2">
    <v-card-title class="px-2 px-sm-4">{{ title }}</v-card-title>
    <v-card-text class="px-2 px-sm-4">
      <div class="d-flex align-center mb-2">
        <div class="d-flex align-center w-100">
          <label for="movieName" class="form-item-label">Movie</label>
          <v-text-field
            v-model="movie.name"
            :color="mainColor"
            id="movieName"
            hide-details
            class="mt-0 pt-0"
          ></v-text-field>
        </div>
        <div v-if="purpose == 'edit'"  class="d-flex align-center ml-4">
          <label for="movieChecked" class="form-item-label">Checked</label>
          <v-checkbox
            v-model="movie.checked"
            :color="mainColor"
            :ripple="false"
            id="movieChecked"
            hide-details
            class="mt-0 pt-0"
          ></v-checkbox>
        </div>
      </div>
      <div class="d-flex align-center mb-2">
        <label for="movieImdbId" class="form-item-label">IMDB ID</label>
        <v-text-field
          v-model="movie.imdbId"
          :color="mainColor"
          id="movieImdbId"
          hide-details
          class="mt-0 pt-0"
        ></v-text-field>
      </div>
      <div class="d-flex align-center mb-3">
        <label for="movieYear" class="form-item-label">Publish Year</label>
        <v-text-field
          v-model="movie.year"
          type="number"
          :color="mainColor"
          id="movieYear"
          hide-details
          class="mt-0 pt-0"
        ></v-text-field>
      </div>
      <div class="d-flex align-start mb-3">
        <label class="form-item-label">Genre</label>
        <div class="d-flex flex-wrap">
          <div v-for="(genre, index) in genreOptions" :key="index" class="genre">
            <v-checkbox
              dense
              v-model="movie.genre"
              :label="genre"
              :value="genre"
              :color="mainColor"
              :ripple="false"
              hide-details
              class="mt-0 pt-0 mr-6"
            ></v-checkbox>
          </div>
        </div>
      </div>
      <label for="movieQuote" class="form-item-label">Quote</label>
      <v-textarea
        v-model="movie.quote"
        :color="mainColor"
        id="movieQuote"
        outlined
        hide-details
        no-resize
        class="mt-1"
      ></v-textarea>
    </v-card-text>
    <v-card-actions class="justify-end px-2 px-sm-4">
      <v-btn
        v-if="purpose == 'new'"
        color="#FFF"
        small
        depressed
        @click="clearForm"
      >
        Clear
      </v-btn>
      <v-btn
        v-if="purpose == 'new'"
        :color="mainColor"
        small
        dark
        depressed
        @click="uploadNewQuote"
      >
        Upload
      </v-btn>
      <v-btn
        v-if="purpose == 'edit'"
        :color="mainColor"
        small
        dark
        depressed
        @click="updateQuote"
      >
        Update
      </v-btn>
    </v-card-actions>
    <v-snackbar v-model="snackbar">
      <div class="text-center">{{ snackbarText }}</div>
    </v-snackbar>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";
import { db } from '@/assets/firebase.js';

export default {
  props: {
    title: {
      type: String
    },
    purpose: {
      type: String  // "new", "edit"
    },
    quote: {
      type: Object,
      default: undefined
    }
  },
  mixins: [mixin],
  data () {
    return {
      isFormValid: true,
      movie: {
        name: "",
        imdbId: "",
        year: null,
        genre: [],
        quote: "",
        checked: false
      },
      snackbar: false,
      snackbarText: "",
    }
  },
  computed: {
    ...mapState(["user"]),
    validForm () {
      return this.movie.name && this.movie.imdbId && this.movie.year && this.movie.genre.length > 0 && this.movie.quote ? true : false;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.quote) {
        this.movie.name = this.quote.name;
        this.movie.imdbId = this.quote.imdbId;
        this.movie.year = this.quote.year;
        this.movie.genre = this.quote.genre;
        this.movie.quote = this.quote.quote;
        this.movie.checked = this.quote.checked;
      }
    })
  },
  watch: {
    quote: {
      handler() {
        this.snackbar = false;
        this.snackbarText = "";
        if (this.quote) {
          this.movie.name = this.quote.name;
          this.movie.imdbId = this.quote.imdbId;
          this.movie.year = this.quote.year;
          this.movie.genre = this.quote.genre;
          this.movie.quote = this.quote.quote;
          this.movie.checked = this.quote.checked;
        }
      },
      deep: true
    }
  },
  methods: {
    clearForm () {
      this.movie.name = "";
      this.movie.imdbId = "";
      this.movie.year = null;
      this.movie.genre = [];
      this.movie.quote = "";
      this.movie.checked = false;
    },
    uploadNewQuote () {
      const vm = this;
      if (!this.validForm) {
        this.snackbarText = "Please fill in the form";
        this.snackbar = true;
      } else {
        let newQuoteRef = db.collection("quote").doc();
        newQuoteRef
          .set({
            id: newQuoteRef.id,
            imdbId: this.movie.imdbId,
            name: this.movie.name,
            year: +this.movie.year,
            quote: this.movie.quote,
            genre: this.movie.genre,
            checked: false,
            uploader: this.user.uid,
            timestamp: new Date().getTime()
          })
          .then(function() {
            vm.snackbarText = "Success!";
            vm.snackbar = true;
            vm.clearForm();
          })
          .catch(function() {
            vm.snackbarText = "Upload fail";
            vm.snackbar = true;
          })
      }
    },
    updateQuote () {
      const vm = this;
      if (!this.validForm) {
        this.snackbarText = "Please fill in the form";
        this.snackbar = true;
      } else {
        const quoteId = this.quote.id;
        let quoteRef = db.collection("quote").doc(quoteId);
        quoteRef
          .update({
            imdbId: this.movie.imdbId,
            name: this.movie.name,
            year: +this.movie.year,
            quote: this.movie.quote,
            genre: this.movie.genre,
            checked: this.movie.checked,
            updater: this.user.uid,
            updateTime: new Date().getTime()
          })
          .then(function() {
            vm.snackbarText = "Success!";
            vm.snackbar = true;
          })
          .catch(function() {
            vm.snackbarText = "Update fail";
            vm.snackbar = true;
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-new-quote {
  width: 100%;
  background-color: #FFF;
  overflow-y: scroll;
}

.form-item-label {
  margin-right: 10px;
}

.genre {
  width: 130px;
}
</style>