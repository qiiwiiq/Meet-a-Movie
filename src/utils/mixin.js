import dayjs from 'dayjs';
import firebase from "firebase/app";
import "firebase/auth";

export const mixin = {
  data () {
    return {
      minYear: 1930,
      currentYear: dayjs().year(),
      mainColor: "#0097A7",
      windowWidth: window.innerWidth,
      genreOptions: [
        "Action",
        "Adventure",
        "Animation",
        "Biography",
        "Comedy",
        "Crime",
        "Drama",
        "Family",
        "Fantasy",
        "Film-Noir",
        "History",
        "Horror",
        "Music",
        "Musical",
        "Mystery",
        "Romance",
        "Sci-Fi",
        "Sport",
        "Thriller",
        "War",
        "Western"
      ],
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
        photoRef: "",
        uid: "",
        created: null
      };
      this.$store.commit("setUser", payload);
      this.$store.commit("setLoginStatus", false);
      this.clearCookies();
      this.$router.replace({ name: "Home" }).catch(() => {});
    }
  }
}