<template>
  <v-card class="dialog">
    <v-card-text class="dialog-title pt-5">{{ actionTitle }}</v-card-text>
    <slot></slot>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="#0097A7"
        text
        @click="action1"
      >
        {{ actionText1 }}
      </v-btn>
      <v-btn
        color="#0097A7"
        text
        @click="action2"
      >
        {{ actionText2 }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: [
    "actionTitle",
    "actionText1",
    "actionText2"
  ],
  methods: {
    action1() {
      this.$emit("action1");
    },
    action2() {
      this.$emit("action2");
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  &-title {
    font-weight: 700;
    font-size: 20px;
  }

  &-input {
    font-size: 14px;
  }
}
</style>