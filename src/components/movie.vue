<template>
  <div v-if="movieObj">
    <div class="postoer">
      <v-img :src="movieObj.poster" />
    </div>
    <div class="title">{{ movieObj.title }}</div>
    <div class="rating">{{ movieObj.rating }}</div>
    <div class="rating_votes">{{ movieObj.rating_votes }}</div>
    <div class="year">{{ movieObj.year }}</div>
    <div class="length">{{ movieObj.length }}</div>
    <div class="plot">{{ movieObj.plot }}</div>
    <div class="cast">
      <div v-for="(item, i) in actorList" :key="i">
        {{ item.actor }}
      </div>
    </div>
    <a :href="movieObj.trailer.link" target="_blank">Watch Trailer</a>
  </div>
</template>

<script>
export default {
  props: ["movieObj"],
  computed: {
    actorList() {
      if (this.movieObj) {
        return this.movieObj.cast.slice(0, 3);
      } else {
        return [];
      }
    }
  }
};
</script>