import dayjs from 'dayjs';
import firebase from "firebase/app";
import "firebase/auth";

export const mixin = {
  data () {
    return {
      mainColor: "#0097A7",
      windowWidth: window.innerWidth,
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    clearCookies() {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
    },
    formatTime: function (time) {
      if (time) {
        return dayjs(time).format('YYYY/MM/DD');
      }
    },
    wait(time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    },
    logout() {
      firebase.auth().signOut();
      let payload = {
        signInMethod: "",
        token: "",
        name: "",
        email: "",
        photoURL: "",
      };
      this.$store.commit("setUser", payload);
      this.$store.commit("setLoginStatus", false);
      this.clearCookies();
      this.$router.replace({ name: "Home" }).catch(() => {});
    }
  }
}