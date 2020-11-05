<template>
  <v-card class="movie-quote-card d-flex pa-2">
    <div class="poster mr-2">
      <img :src="movieObj.poster" />
    </div>
    <div class="flex-grow-1">
      <div class="movie-title mt-1">{{ movieObj.title }}</div>
      <div class="year-and-length mb-1">
        <span class="year pr-2">{{ movieObj.year }}</span>
        <span class="length px-2">{{ movieObj.length }}</span>
        <span class="pl-2">
          <v-icon x-small color="#FFB300">mdi-star</v-icon>
          {{ movieObj.rating }}
        </span>
      </div>
      <div class="cast mb-1">{{ actors }}</div>
      <div class="quote ml-6 mt-4">{{ movieObj.quote }}</div>
    </div>
    <div>
      <v-btn
        icon
        :ripple="false"
        @click="updateCollections"
      >
        <v-icon>mdi-heart{{ isCollected ? '' : '-outline'}}</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  props: ["movieObj"],
  data() {
    return {
      isCollected: true,
    }
  },
  computed: {
    actors() {
      if (this.movieObj) {
        let casts = this.movieObj.cast.slice(0, 3);
        let actors = casts.map(casts => casts.actor);
        return actors.join(", ");
      } else {
        return "";
      }
    }
  },
  methods: {
    updateCollections() {
      this.isCollected = !this.isCollected;
      if (this.isCollected) {
        const favMovieObj = {
          groupid: 'cg0',
          movie: this.movieObj
        };
        this.$store.commit("addMovieIntoGroup", favMovieObj);
      } else {
        const quote = this.movieObj.quote;
        this.$store.commit("removeMovieFromGroup", quote);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.poster {
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  height: 150px;
  min-height: 150px;
  max-height: 150px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.movie-title {
  font-weight: 700;
  text-transform: uppercase;
}

.year-and-length, .cast {
  font-size: 12px;
  font-weight: 300;
  line-height: 16px;
}

.year, .length {
  border-right: 1px solid #999;
}

.quote {
  font-style: italic;
  font-size: 16px;
  font-weight: 300;
  line-height: 20px;
}
</style>
