<template>
  <div v-if="movieObj" class="d-flex justify-center">
    <div class="col-left">
      <img :src="movieObj.poster" />
    </div>
    <div class="col-right d-flex flex-column">
      <div class="movie-info d-flex">
        <div class="poster--mobile">
          <img :src="movieObj.poster" />
        </div>
        <div class="flex-grow-1">
          <div class="movie-title mb-2">{{ movieObj.title }}</div>
          <div>
            <v-icon small color="#455A64" class="icon-film mr-1">mdi-filmstrip</v-icon>
            <span class="year pr-2">{{ movieObj.year }}</span>
            <span class="length pl-2">{{ movieObj.length }}</span>
          </div>
          <div class="movie-rating--mobile align-center">
            <v-icon small color="#FFB300" class="mr-1">mdi-star</v-icon>
            <span>
              <span class="mr-1">{{ movieObj.rating }}</span>
              <span class="rating_votes">({{ formatThousands(movieObj.rating_votes) }} votes)</span>
            </span>
          </div>
        </div>
        <div class="movie-rating flex-column align-center align-self-start">
          <div class="rating">
            <div class="rating-bg"></div>
            <div class="rating-text">{{ movieObj.rating }}</div>
          </div>
          <div class="rating_votes text-center">
            {{ formatThousands(movieObj.rating_votes) }} votes
          </div>
        </div>
        <slot name="topColRight"></slot>
      </div>
      <div class="mt-2">
        <span
          v-for="(genre, i) in movieObj.genre"
          :key="i"
        >
          <v-chip
            label
            small
            class="mr-1"
          >
            {{ genre }}
          </v-chip>
        </span>
      </div>
      <div class="cast my-2">{{ actors }}</div>
      <div class="plot mb-4">{{ movieObj.plot }}</div>
      <slot name="movieInfo"></slot>
    </div>
    <slot name="colRight"></slot>
  </div>
</template>

<script>
export default {
  props: ["movieObj"],
  computed: {
    actors() {
      if (this.movieObj) {
        let casts = this.movieObj.cast.slice(0, 3);
        let actors = casts.map((casts) => casts.actor);
        return actors.join(", ");
      } else {
        return "";
      }
    },
  },
  methods: {
    formatThousands(str) {
      if (!str) return;
      return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.col-left {
  width: 40%;
  margin-right: 24px;

  @include respond(large-mobile) {
    width: 25%;
    margin-right: 20px;
  }

  @include respond(mobile) {
    display: none;
  }

  & img {
    width: 100%;
    object-fit: contain;
  }
}

.col-right {
  width: 50%;

  @include respond(large-mobile) {
    width: 65%;
  }

  @include respond(mobile) {
    width: 100%;
  }

  .movie-info {
    margin-right: 32px;
    justify-content: space-between;
    align-items: flex-end;

    @include respond(tab-port) {
      margin-right: 24px;
    }

    @include respond(mobile) {
      justify-content: flex-start;
      align-items: flex-start;
      margin-right: 0;
    }
  }

  .poster--mobile {
    display: none;

    @include respond(mobile) {
      display: block;
      width: 80px;
      min-width: 60px;
      margin-right: 8px;
    }

    & img {
      width: 100%;
      object-fit: contain;
    }
  }

  .movie-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 26px;
    text-transform: uppercase;

    @include respond(tab-port) {
      font-size: 20px;
    }

    @include respond(large-mobile) {
      font-size: 18px;
      line-height: 22px;
    }

    @include respond(small-mobile) {
      font-size: 16px;
      line-height: 20px;
    }
  }

  .icon-film {
    display: none;

    @include respond(large-mobile) {
      display: inline-flex;
    }
  }

  .year {
    border-right: 1px solid #999;

    @include respond(large-mobile) {
      font-size: 14px;
    }

    @include respond(mobile) {
      font-size: 13px;
    }
  }

  .length {
    @include respond(large-mobile) {
      font-size: 14px;
    }

    @include respond(mobile) {
      font-size: 13px;
    }
  }

  .movie-rating {
    display: flex;

    @include respond(large-mobile) {
      display: none;
    }

    .rating {
      position: relative;
      width: 50px;
      height: 50px;
      font-weight: 700;

      &-bg {
        position: absolute;
        background-color: yellow;
        width: 50px;
        height: 50px;
        clip-path: polygon(
          50% 0%,
          61% 35%,
          98% 35%,
          68% 57%,
          79% 91%,
          50% 70%,
          21% 91%,
          32% 57%,
          2% 35%,
          39% 35%
        );
        -webkit-clip-path: polygon(
          50% 0%,
          61% 35%,
          98% 35%,
          68% 57%,
          79% 91%,
          50% 70%,
          21% 91%,
          32% 57%,
          2% 35%,
          39% 35%
        );
      }

      &-text {
        position: absolute;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .rating_votes {
      font-size: 12px;
      line-height: 16px;

      @include respond(large-mobile) {
        line-height: 14px;
      }
    }
  }

  .movie-rating--mobile {
    display: none;

    @include respond(large-mobile) {
      display: inline-flex;
      font-size: 14px;
      white-space:nowrap;
    }

    @include respond(mobile) {
      font-size: 13px;
    }

    .rating_votes {
      font-size: 12px;
    }
  }
  

  .cast {
    margin-right: 32px;
    font-weight: 300;
    font-style: italic;

    @include respond(tab-port) {
      margin-right: 24px;
      font-size: 14px;
    }

    @include respond(large-mobile) {
      margin-right: 18px;
      font-size: 13px;
      line-height: 16px;
    }
  }

  .plot {
    margin-right: 32px;
    text-align: justify;
    line-height: 20px;

    @include respond(tab-port) {
      margin-right: 24px;
      font-size: 14px;
      line-height: 16px;
    }

    @include respond(mobile) {
      margin-right: 18px;
    }
  }
}
</style>
