<template>
  <span class="btn-copy">
    <v-btn icon @click="copy">
      <v-icon>mdi-content-copy</v-icon>
    </v-btn>
    <span
      v-if="snackbar"
      class="snackbar"
    >
      {{ snackbarText }}
    </span>
  </span>
</template>

<script>
import { mixin } from "@/utils/mixin";

export default {
  mixins: [mixin],
  props: ["quote", "movie"],
  data() {
    return {
      snackbar: false,
      snackbarText: ""
    }
  },
  computed: {
    movieQuote() {
      return `${this.quote} - <${this.movie}>`;
    }
  },
  methods: {
    copy() {
      this.$copyText(this.movieQuote)
      .then(async (e) => {
        console.log(e);
        this.snackbarText = "Copied"
        this.snackbar = true;
        await this.wait(3000);
        this.snackbarText = ""
        this.snackbar = false;
      })
      .catch(async (e) => {
        console.log('Can not copy', e.text);
        this.snackbarText = "Failed..."
        this.snackbar = true;
        await this.wait(3000);
        this.snackbarText = ""
        this.snackbar = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-copy {
  position: relative;
}

.snackbar {
  position: absolute;
  top: -2px;
  left: -50px;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  background-color: rgba(#DBDBDB, .6);
}
</style>