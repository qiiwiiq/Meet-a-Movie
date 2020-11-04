<template>
  <div class="page-collections">
    <div>
      my collections
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["isLogin"]),
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
