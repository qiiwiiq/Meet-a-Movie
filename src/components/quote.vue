<template>
  <div v-if="quoteObj">
    <div class="quote">{{ quoteObj.quote }}</div>
    <div>
      <span class="movieName">{{ quoteObj.movie }}</span>
      <span class="movieYear">({{ quoteObj.year }})</span>
    </div>
    <a @click="goToIntro">Check it!</a>
  </div>
</template>

<script>
export default {
  props: ["quoteObj"],
  methods: {
    goToIntro() {
      this.$router.push({ name: "Intro" }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
