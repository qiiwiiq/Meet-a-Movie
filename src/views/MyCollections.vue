<template>
  <div class="page-collections">
    <div class="collection-list">
      <div
        v-for="(item, id) in collections"
        :key="id"
        class="fav-movie"
      >
        <Movie :movieObj="item.movie" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Movie from "@/components/movie";

export default {
  components: {
    Movie
  },
  computed: {
    ...mapState(["isLogin", "collections"]),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.isLogin) {
        vm.$router.replace({name: 'SignIn'});
      }
    })
  },
  watch: {
    isLogin(val) {
      if (!val) this.$router.replace({name: 'SignIn'});
    }
  }
}
</script>

<style lang="scss" scoped>
.page-collections {
  padding: 16px 0;
}

.collection-list {
  height: calc(100vh - 100px);
  overflow-y: scroll;
}

.fav-movie {
  background-color: rgba(#FFF, .5);
  border-radius: 10px;
  padding: 12px;

  &:not(:last-child) {
    margin-bottom: 12px;
  }
}
</style>
