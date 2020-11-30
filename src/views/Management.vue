<template>
  <div class="page-management d-flex justify-center">
    <div v-if="user.role === 'maintainer'">
      <NewQuote />
    </div>
    <div v-else>
      <div class="remind-no-permission">Sorry, you are not allowed to access this page.</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NewQuote from "@/components/newQuote";

export default {
  components: {
    NewQuote,
  },
  computed: {
    ...mapState(["user"]),
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.page-management {
  padding: 30px 10px;
}

.remind-no-permission {
  margin-top: 30px;
  padding: 0 20px;
  font-size: 20px;
  font-weight: 500;
  color: #FFF;
  text-align: center;

  @include respond(tab-port) {
    font-size: 18px;
  }
}
</style>