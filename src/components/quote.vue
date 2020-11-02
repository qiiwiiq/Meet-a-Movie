<template>
  <div v-if="quoteObj" class="quote d-flex flex-column align-end align-self-center">
    <div class="quote-text pb-2">{{ quoteObj.quote }}</div>
    <div class="movie">
      <span class="movie-name pr-2">{{ quoteObj.movie }}</span>
      <span class="movie-year">({{ quoteObj.year }})</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["quoteObj"]
};
</script>

<style lang="scss" scoped>
.quote {
  padding: 0 30px 16px 16px;

  &-text {
    background-clip: text;
    font-size: 20px;
    font-weight: 700;
  }
}

.movie {
  &-name {
  }

  &-year {
    font-weight: 300;
  }
}
</style>
