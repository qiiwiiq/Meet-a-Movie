import dayjs from 'dayjs';

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
  }
}