<template>
  <v-card class="movie-quote-card d-flex pa-2">
    <div class="poster mr-2">
      <img :src="movieObj.poster" />
    </div>
    <div class="d-flex flex-column justify-space-between flex-grow-1">
      <div class="d-flex">
        <div class="flex-grow-1">
          <div class="movie-title my-1">{{ movieObj.title }}</div>
          <div class="year-and-length mb-1">
            <span class="year pr-2">{{ movieObj.year }}</span>
            <span class="length px-2">{{ movieObj.length }}</span>
            <span class="pl-2">
              <v-icon x-small color="#FFB300">mdi-star</v-icon>
              {{ movieObj.rating }}
            </span>
          </div>
          <div class="genre mb-1">{{ genres }}</div>
          <div class="quote ml-3 ml-sm-6 mt-2 mt-sm-4">{{ movieObj.quote }}</div>
        </div>
        <div class="btn-actions">
          <CollectBtn
            :movieObj="movieObj"
            class="mb-2"
          />
          <CopyBtn
            :quote="movieObj.quote"
            :movie="movieObj.title"
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

    <v-dialog v-model="isDetailShown" max-width="900" persistent>
      <v-card class="movie-detail-card pa-4">
        <v-btn
          icon
          small
          :ripple="false"
          class="btn-close"
          @click="closeDetail"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
        <MovieDetail :movieObj="movieObj" class="mr-2">
          <template v-slot:movieInfo>
            <div>
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
            </div>
            <div
              class="quote text-center px-4 py-5 py-sm-6 flex-grow-1 d-flex justify-center align-center"
            >
              {{ movieObj.quote }}
            </div>
            <v-textarea
              v-model="comments"
              outlined
              no-resize
              hide-details
              placeholder="comments ..."
              rows="3"
              :color="mainColor"
              class="comments"
            ></v-textarea>
          </template>
        </MovieDetail>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";
import CollectBtn from "@/components/buttons/collectBtn";
import CopyBtn from "@/components/buttons/copyBtn";
import MovieDetail from "@/components/movieDetail";

export default {
  mixins: [mixin],
  props: ["movieObj", "collectionId"],
  components: {
    CollectBtn,
    CopyBtn,
    MovieDetail,
  },
  data() {
    return {
      isDetailShown: false,
      comments: "",
      orignComments: "",
    };
  },
  computed: {
    ...mapState(["user"]),
    genres() {
      if (this.movieObj) {
        return this.movieObj.genre.join(", ");
      } else {
        return "";
      }
    },
  },
  mounted() {
    this.comments = this.movieObj.comments;
    this.orignComments = this.comments;
  },
  methods: {
    closeDetail() {
      if (this.comments !== this.orignComments) {
        this.$store.dispatch("dbUpdateCollectionDetail", {
          uid: this.user.uid,
          collectionId: this.collectionId,
          obj: {
            comments: this.comments,
          },
        });
      }
      this.isDetailShown = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.poster {
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  height: 150px;
  min-height: 150px;
  max-height: 150px;

  @include respond(large-mobile) {
    width: 80px;
    min-width: 80px;
    max-width: 80px;
    height: 120px;
    min-height: 120px;
    max-height: 120px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.movie-title {
  font-weight: 700;
  text-transform: uppercase;
  line-height: 18px;
}

.year-and-length,
.genre {
  font-size: 12px;
  font-weight: 300;
  line-height: 16px;
}

.year,
.length {
  border-right: 1px solid #999;
}

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

.btn-actions {
  width: 30px;
  margin-right: 8px;

  @include respond(large-mobile) {
    margin-right: 0;
  }
}

.comments {
  @include respond(tab-port) {
    font-size: 14px;
    line-height: 16px;
  }
}

.movie-detail-card {
  position: relative;
}

.btn-close {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
