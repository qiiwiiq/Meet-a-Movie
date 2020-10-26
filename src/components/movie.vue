<template>
  <div v-if="movieObj" class="d-flex justify-center">
    <div class="poster mr-4">
      <img :src="movieObj.poster" />
    </div>
    <div class="movie-info">
      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="movie-title">{{ movieObj.title }}</div>
          <div>
            <span class="year pr-2">{{ movieObj.year }}</span>
            <span class="length pl-2">{{ movieObj.length }}</span>
          </div>
        </div>
        <div class="text-center">
          <div class="rating">
            <div class="rating-bg"></div>
            <div class="rating-text">{{ movieObj.rating }}</div>
          </div>
          <div class="rating_votes">{{ movieObj.rating_votes }}</div>
        </div>
      </div>
      <div class="cast my-2">{{ actors }}</div>
      <div class="plot mb-4">{{ movieObj.plot }}</div>
      <a :href="movieObj.trailer.link" target="_blank">Watch Trailer</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ["movieObj"],
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
  }
};
</script>

<style lang="scss" scoped>
.poster {
  width: 40%;
  
  & img {
    width: 100%;
    object-fit: contain;
  }
}

.movie-info {
  width: 45%;

  .movie-title {
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .year {
    border-right: 1px solid #999;
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
      -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
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
  }

  .cast {
    font-weight: 300;
    font-style: italic;
  }

  .plot {
    text-align: justify;
    line-height: 20px;
  }
}
</style>
