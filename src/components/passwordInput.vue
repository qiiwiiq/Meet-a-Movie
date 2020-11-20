<template>
  <div class="section">
    <input
      :value="password"
      @input="onInput"
      class="user-input"
      :style="{height: height + 'px'}"
      :type="showPW ? 'text' : 'password'"
      :placeholder="placeholder"
      @keyup.enter="onEnter"
    />
    <v-btn
      icon
      v-if="password"
      class="reveal-pw"
      :style="{top: (height - 36) / 2 + 'px'}"
      @click="showPW = !showPW"
    >
      <v-icon>mdi-{{ showPW ? "eye-off" : "eye" }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    height: {
      type: Number,
      default: 50
    },
    clearFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      password: "",
      showPW: false
    }
  },
  watch: {
    clearFlag(val) {
      if (val) {
        this.password = "";
      }
    }
  },
  methods: {
    onInput(e) {
      this.password = e.target.value;
      this.$emit("value", this.password);
      if (this.password === "") {
        this.$emit("updateClearFlag", false);
      }
    },
    onEnter() {
      this.$emit("onEnter")
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.section {
  position: relative;
  width: 280px;

  @include respond(small-mobile) {
    width: 250px;
  }
}

.user-input {
  display: block;
  width: 280px;
  padding-left: 1.3vw;
  color: #868686;
  font-size: 14px;
  font-weight: 300;
  outline: none;
  background-color: #f2f2f2;
  border-radius: 4px;

  @include respond(small-mobile) {
    width: 250px;
  }
}

.reveal-pw {
  position: absolute;
  right: 10px;
}
</style>