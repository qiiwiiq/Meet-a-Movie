<template>
  <div class="login d-flex flex-column align-center">
    <v-btn
      dark
      color="#3b5998"
      class="btn-login ma-2 text-none"
      @click="loginFB"
    >
      <v-icon left>mdi-facebook</v-icon> Login with FACEBOOK
    </v-btn>
    <v-btn
      dark
      color="#ea4335"
      class="btn-login ma-2 text-none"
    >
      <v-icon left>mdi-google</v-icon> Login with GOOGLE
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    loginFB () {
      let vm = this;
      window.FB.login(function (res) {
        console.log('FB login', res);
        vm.getFBProfile();
      }, {
        scope: 'email, public_profile',
        return_scopes: true
      });
    },
    getFBProfile () {
      window.FB.api('/me?fields=name,id,email', 
      (res) => {
        res.loginMethod = 'fb';
        this.$store.commit("setProfile", res);
        this.$emit("closeLoginDialog");
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.login {
  background-color: #FFF;
  padding: 30px 10px;
}

.btn-login {
  width: 220px;
}
</style>