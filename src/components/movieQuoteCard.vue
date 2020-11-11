<template>
  <v-card class="movie-quote-card d-flex pa-2">
    <div class="poster mr-2">
      <img :src="movieObj.poster" />
    </div>
    <div class="d-flex flex-column justify-space-between flex-grow-1">
      <div class="d-flex">
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
          <CollectBtn
            :isCollected="true"
            :movieObj="movieObj"
            @updateIsCollected="updateIsCollected"
          />
        </div>
      </div>
      <div class="d-flex justify-end">
        <v-btn
          text
          small
          class="btn-more text-none mr-2 px-2"
          @click="isDetailShown = true"
        >
          ... more
        </v-btn>
      </div>
    </div>

    <v-dialog
      v-model="isDetailShown"
      max-width="900"
    >
      <v-card class="pa-4">
        <MovieDetail :movieObj="movieObj">
          <template v-slot:movieInfo>
            <div>
              <a :href="movieObj.trailer.link" target="_blank">Watch Trailer</a>
            </div>
            <div class="quote text-center px-4 py-8">{{ movieObj.quote }}</div>
            <v-textarea
              outlined
              no-resize
              hide-details
              placeholder="comments ..."
              rows="2"
              :color="mainColor"
            ></v-textarea>
          </template>
        </MovieDetail>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mixin } from '@/utils/mixin';
import CollectBtn from "@/components/collectBtn";
import MovieDetail from "@/components/movieDetail";

export default {
  mixins: [mixin],
  props: ["movieObj"],
  components: {
    CollectBtn,
    MovieDetail
  },
  data() {
    return {
      isDetailShown: false
    }
  },
  computed: {
    actors() {
      if (this.movieObj.casts) {
        let casts = this.movieObj.cast.slice(0, 3);
        let actors = casts.map(casts => casts.actor);
        return actors.join(", ");
      } else {
        return "";
      }
    }
  },
  methods: {
    updateIsCollected(val) {
      this.isCollected = val;
    },
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
