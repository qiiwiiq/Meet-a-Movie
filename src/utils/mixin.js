export const mixin = {
  data () {
    return {
      mainColor: "#0097A7"
    }
  },
  methods: {
    clearCookies() {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
    }
  }
}