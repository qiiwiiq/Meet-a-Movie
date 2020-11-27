<template>
  <v-card class="dialog">
    <v-btn
      v-if="showCloseBtn"
      icon
      small
      class="close-btn"
      @click="closeDialog"
    >
      <v-icon small>mdi-close</v-icon>
    </v-btn>
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
        :disabled="disabledAcion2"
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
  props: {
    showCloseBtn: {
      type: Boolean,
      default: false
    },
    actionTitle: {
      type: String
    },
    actionText1: {
      type: String
    },
    actionText2: {
      type: String
    },
    disabledAcion2: {
      type: Boolean
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
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
  position: relative;

  .close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  &-title {
    font-weight: 700;
    font-size: 20px;

    @include respond(mobile) {
      font-size: 18px;
    }
  }
}
</style>
