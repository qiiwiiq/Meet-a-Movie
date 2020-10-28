<template>
  <div v-if="quoteObj" class="d-flex flex-column align-end">
    <div class="quote align-self-center pb-2">
      <v-icon large class="quote-mark-pre">
        mdi-format-quote-open
      </v-icon>
      <span class="quote-text px-2">{{ quoteObj.quote }}</span>
      <v-icon large class="quote-mark-post">
        mdi-format-quote-close
      </v-icon>
    </div>
    <div class="movie pb-4">
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
  &-mark-pre {
    margin-top: -15px;
  }

  &-text {
    background-clip: text;
    font-size: 20px;
    font-weight: 700;
  }

  // &-mark-post {
  //   margin-bottom: -5px;
  // }
}

.movie {
  &-name {
  }

  &-year {
    font-weight: 300;
  }
}
</style>
