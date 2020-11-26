<template>
  <div class="page-new-quote d-flex justify-center">
    <v-card class="card-new-quote px-2 pb-2">
      <v-card-title>New Quote</v-card-title>
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <label for="movieName" class="form-item-label">Movie</label>
          <v-text-field
            v-model="movie.name"
            :color="mainColor"
            id="movieName"
            hide-details
            class="mt-0 pt-0"
          ></v-text-field>
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
      <v-card-actions class="justify-end px-4">
        <v-btn
          color="#FFF"
          small
          depressed
          @click="clearForm"
        >
          Clear
        </v-btn>
        <v-btn
          :color="mainColor"
          small
          dark
          depressed
          @click="upload"
        >
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar">
      <div class="text-center">{{ snackbarText }}</div>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";
import { db } from '@/assets/firebase.js';

export default {
  metaInfo: {
    title: 'New Quote | Meet a Movie'
  },
  mixins: [mixin],
  data() {
    return {
      isFormValid: true,
      movie: {
        name: "",
        imdbId: "",
        year: null,
        genre: [],
        quote: ""
      },
      genreOptions: [
        "Action",
        "Adventure",
        "Animation",
        "Biography",
        "Comedy",
        "Crime",
        "Drama",
        "Family",
        "Fantasy",
        "Film-Noir",
        "History",
        "Horror",
        "Music",
        "Musical",
        "Mystery",
        "Romance",
        "Sci-Fi",
        "Sport",
        "Thriller",
        "War",
        "Western"
      ],
      snackbar: false,
      snackbarText: "",
    }
  },
  computed: {
    ...mapState(["user"]),
    validForm() {
      return this.movie.name && this.movie.imdbId && this.movie.year && this.movie.genre.length > 0 && this.movie.quote ? true : false;
    }
  },
  methods: {
    clearForm() {
      this.movie.name = "";
      this.movie.imdbId = "";
      this.movie.year = null;
      this.movie.genre = [];
      this.movie.quote = "";
    },
    upload() {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.page-new-quote {
  padding: 30px 10px;
}

.card-new-quote {
  width: 500px;
  background-color: rgba(#fff, 0.8);
  max-height: calc(var(--vh, 1vh) * 100 - 110px);
  overflow-y: scroll;
}

.form-item-label {
  margin-right: 10px;
}

.genre {
  width: 130px;
}
</style>