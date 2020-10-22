<template>
  <div v-if="movieObj" class="d-flex">
    <div class="poster">
      <img :src="movieObj.poster" />
    </div>
    <div>
      <div class="d-flex">
        <div class="title">{{ movieObj.title }}</div>
        <div>
          <div class="rating">{{ movieObj.rating }}</div>
          <div class="rating_votes">{{ movieObj.rating_votes }}</div>
        </div>
      </div>
      <div class="d-flex">
        <div class="year">{{ movieObj.year }}</div>
        <div class="length">{{ movieObj.length }}</div>
      </div>
      <div class="cast">{{ actors }}</div>
      <div class="plot">{{ movieObj.plot }}</div>
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
  height: 500px;
  
  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
