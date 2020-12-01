<template>
  <div class="coming-soon d-flex justify-center align-center h-100">
    <div class="img-coming-soon">
      <img src="../assets/coming-soon.jpeg" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.coming-soon {
  background-color: #000;

  .img-coming-soon {
    height: 80vh;

    & img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>