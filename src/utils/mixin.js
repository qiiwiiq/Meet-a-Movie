export const mixin = {
  // data () {
  //   return {
  //     mainColor: 
  //   }
  // },
  methods: {
    clearCookies() {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
    }
  }
}