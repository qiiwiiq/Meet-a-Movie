<template>
  <div class="page-sign-in d-flex justify-center align-center">
    <v-card class="card-sign-in">
      <Loading
        :active="loading"
        :is-full-page="false"
        :color="mainColor"
        loader="dots"
      />
      <div class="title-sign-in text-center mb-4">Sign In</div>
      <div v-if="!isEmailSignin" class="d-flex flex-column">
        <v-btn
          dark
          outlined
          color="#4CAF50"
          class="btn-sign-in ma-2 text-none"
          @click="isEmailSignin = true"
        >
          <v-icon left>mdi-email-outline</v-icon> Sign In with EMAIL
        </v-btn>
        <v-btn
          dark
          outlined
          color="#3b5998"
          class="btn-sign-in ma-2 text-none"
          @click="signIn('fb')"
        >
          <v-icon left>mdi-facebook</v-icon> Sign In with FACEBOOK
        </v-btn>
        <v-btn
          dark
          outlined
          color="#ea4335"
          class="btn-sign-in ma-2 text-none"
          @click="signIn('google')"
        >
          <v-icon left>mdi-google</v-icon> Sign In with GOOGLE
        </v-btn>
        <p class="divider-text my-2">
          <span>or</span>
        </p>
        <v-btn
          dark
          outlined
          color="#F9A825"
          class="btn-sign-in ma-2 text-none"
          :to="{ name: 'SignUp' }"
        >
          Create a New Account
        </v-btn>
      </div>
      <div v-if="isEmailSignin" class="d-flex flex-column align-center">
        <input
          v-model="user.email"
          class="user-input input-email"
          type="text"
          placeholder="Email"
          @keyup.enter="signInEmail"
        />
        <PasswordInput
          :placeholder="'Password'"
          @value="user.password = $event"
          @onEnter="signInEmail"
          class="input-pw"
        />
        <v-btn
          dark
          depressed
          :color="mainColor"
          class="btn-email-sign-in ma-2 text-none"
          @click="signInEmail"
        >
          Sign In
        </v-btn>
        <div class="signin my-2">
          <span>Sign in with other methods </span>
          <button class="link-signin" @click="isEmailSignin = false">
            Click here
          </button>
        </div>
      </div>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      color="blue-grey"
      rounded="pill"
      :timeout="6000"
    >
      <div class="text-center">{{ snackbarText }}</div>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { mixin } from "@/utils/mixin";
import { mailRegex } from "@/utils/regex";
import { eliminateSuffixSpace } from "@/utils/utils";
import { mapState } from "vuex";
import Loading from "vue-loading-overlay";
import PasswordInput from "@/components/passwordInput";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  components: {
    Loading,
    PasswordInput
  },
  mixins: [mixin],
  data() {
    return {
      loading: false,
      isEmailSignin: false,
      user: {
        email: "",
        password: "",
      },
      snackbar: false,
      snackbarText: "",
    };
  },
  computed: {
    ...mapState(["isLogin"]),
    safeUserEmail() {
      // eliminate suffix space. Ex: 'a@b.c ' => 'a@b.c'
      return eliminateSuffixSpace(this.user.email);
    },
    validEmail() {
      return this.safeUserEmail.match(mailRegex) ? true : false;
    },
    isFormFilled() {
      return this.validEmail && this.user.password ? true : false;
    },
  },
  watch: {
    user: {
      handler: function() {
        this.snackbarText = "";
        this.snackbar = false;
      },
      deep: true,
    },
    isEmailSignin(val) {
      if (!val) {
        this.user.email = "";
        this.user.password = "";
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.isLogin) {
        vm.$router.replace({ name: "Home" });
      }
    });
  },
  methods: {
    signIn(signInMethod) {
      const vm = this;
      let provider;
      switch (signInMethod) {
        case "fb":
          provider = new firebase.auth.FacebookAuthProvider();
          break;
        case "google":
          provider = new firebase.auth.GoogleAuthProvider();
          break;
      }
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          const user = result.user;
          let payload = {
            isNewUser: result.additionalUserInfo.isNewUser,
            signInMethod,
            token: result.credential.accessToken,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
          };
          vm.$cookies.set("uid", user.uid);
          vm.$store.dispatch("init", payload);
          vm.$router.replace({ name: "Home" });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    signInEmail() {
      const vm = this;
      if (!this.isFormFilled) {
        this.snackbarText = "Please fill in the form";
        this.snackbar = true;
        return;
      }

      this.loading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.safeUserEmail, this.user.password)
        .then(function(result) {
          const user = result.user;
          let payload = {
            isNewUser: result.additionalUserInfo.isNewUser,
            signInMethod: "email",
            token: "",
            name: "",
            email: user.email,
            photoURL: "",
            uid: user.uid,
          };
          vm.$cookies.set("uid", user.uid);
          vm.$store.dispatch("init", payload);
          vm.loading = false;
          vm.$router.replace({ name: "Home" });
        })
        .catch(function(error) {
          vm.loading = false;
          vm.snackbarText = error.message;
          vm.snackbar = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.page-sign-in {
  padding: 30px 10px;
}

.card-sign-in {
  position: relative;
  margin-top: 3vh;
  background-color: rgba(#fff, 0.6);
  padding: 16px 32px;

  @include respond(small-mobile) {
    padding: 16px;
  }
}

.title-sign-in {
  font-size: 24px;
  font-weight: 700;
}

.btn-sign-in {
  width: 220px;
  background-color: rgba(#fff, 0.9);
}

.divider-text {
  position: relative;
  text-align: center;
}

.divider-text span:before,
.divider-text span:after {
  border-top: 0.5px solid #555555;
  content: "";
  position: absolute;
  height: 5px;
  top: 50%;
  width: 95px;
}

.divider-text span:before {
  right: 50%;
  margin-right: 15px;
}

.divider-text span:after {
  left: 50%;
  margin-left: 15px;
}

.user-input {
  display: block;
  width: 280px;
  height: 50px;
  padding-left: 1.3vw;
  margin-bottom: 10px;
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

.input-pw {
  margin-bottom: 10px;
}

.btn-email-sign-in {
  width: 280px;

  @include respond(small-mobile) {
    width: 250px;
  }
}

.signin {
  color: #151515;
  font-size: 14px;
  font-weight: 300;
  text-align: center;

  .link-signin {
    color: #000;
    font-weight: 400;
    text-decoration: underline;
    text-decoration-skip-ink: none;
    outline: none;
  }
}
</style>
