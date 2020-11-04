export const mixin = {
  methods: {
    clearCookies() {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
    }
  }
}