<template>
  <div v-if="quoteObj" class="quote w-100 d-flex flex-column align-end">
    <div class="quote-text align-self-center">{{ quoteObj.quote }}</div>
    <div class="movie">
      <span class="movie-name pr-2">{{ quoteObj.name }}</span>
      <span class="movie-year">({{ quoteObj.year }})</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["quoteObj"],
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.quote {
  padding: 0 30px 16px 16px;

  @include respond(large-mobile) {
    padding: 0 20px 16px 8px;
  }

  &-text {
    background-clip: text;
    font-size: 20px;
    font-weight: 700;
    text-align: justify;
    margin-bottom: 12px;

    @include respond(tab-land) {
      font-size: 18px;
      line-height: 24px;
      margin-bottom: 16px;
    }

    @include respond(large-mobile) {
      font-size: 16px;
      line-height: 20px;
    }
  }
}

.movie {
  @include respond(tab-land) {
    font-size: 14px;
  }

  @include respond(large-mobile) {
    font-size: 12px;
  }

  &-year {
    font-weight: 300;
  }
}
</style>
