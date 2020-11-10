<template>
  <div v-if="quoteObj" class="quote w-100 d-flex flex-column align-end">
    <div class="quote-text pb-3 align-self-center">{{ quoteObj.quote }}</div>
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
    text-align: justify;
  }
}

.movie {
  &-year {
    font-weight: 300;
  }
}
</style>
