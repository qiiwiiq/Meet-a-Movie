<template>
  <v-card class="dialog">
    <v-card-text class="dialog-title pt-5">{{ actionTitle }}</v-card-text>
    <slot></slot>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        :small="windowWidth <= 450"
        :color="mainColor"
        @click="action1"
      >
        {{ actionText1 }}
      </v-btn>
      <v-btn
        text
        :small="windowWidth <= 450"
        :color="mainColor"
        @click="action2"
      >
        {{ actionText2 }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mixin } from "@/utils/mixin";

export default {
  mixins: [mixin],
  props: ["actionTitle", "actionText1", "actionText2"],
  methods: {
    action1() {
      this.$emit("action1");
    },
    action2() {
      this.$emit("action2");
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.dialog {
  &-title {
    font-weight: 700;
    font-size: 20px;

    @include respond(mobile) {
      font-size: 18px;
    }
  }
}
</style>
