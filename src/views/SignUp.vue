<template>
  <div class="page-sign-up d-flex flex-column align-center">
    <v-card class="card-sign-up d-flex flex-column pa-4">
      <Loading
        :active="loading"
        :is-full-page="false"
        :color="mainColor"
        loader="dots"
      />
      <div class="title-sign-up text-center mb-6">Create New Account</div>
      <div class="section">
        <input
          v-model="user.email"
          class="user-input input-email"
          type="text"
          placeholder="Email"
          @keyup.enter="signup"
        />
      </div>
      <div class="input-invalid pl-2 mb-1">
        <div v-if="user.email && !validEmail">
          Invalid email
        </div>
      </div>
      <div class="section">
        <input
          v-model="user.password"
          class="user-input input-pw"
          :type="showPW1 ? 'text' : 'password'"
          placeholder="Password (at least 6 characters)"
          @keyup.enter="signup"
        />
        <v-btn
          icon
          v-if="user.password"
          class="reveal-pw"
          @click="showPW1 = !showPW1"
        >
          <v-icon>mdi-{{ showPW1 ? "eye-off" : "eye" }}</v-icon>
        </v-btn>
      </div>
      <div class="section">
        <input
          v-model="user.passwordConfirm"
          class="user-input input-pw-confirm"
          :type="showPW2 ? 'text' : 'password'"
          placeholder="Confirm Password"
          @keyup.enter="signup"
        />
        <v-btn
          icon
          v-if="user.passwordConfirm"
          class="reveal-pw"
          @click="showPW2 = !showPW2"
        >
          <v-icon>mdi-{{ showPW2 ? "eye-off" : "eye" }}</v-icon>
        </v-btn>
      </div>
      <div class="input-invalid pl-2 mb-1">
        <div
          v-if="
            (user.password && !validPassword) ||
              (user.passwordConfirm && !validPasswordConfirm)
          "
        >
          At least 6 characters
        </div>
        <div
          v-else-if="user.password && user.passwordConfirm && !samePasswords"
        >
          Password not match
        </div>
      </div>
      <v-btn
        dark
        depressed
        :color="mainColor"
        class="btn-sign-up mb-4"
        @click="signup"
      >
        Sign Up
      </v-btn>
      <div class="signin mb-2">
        <span>Already have an account? </span>
        <router-link class="link-signin" tag="a" :to="{ name: 'SignIn' }">
          Sign in here
        </router-link>
      </div>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      color="blue-grey"
      rounded="pill"
      :timeout="-1"
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
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  components: {
    Loading,
  },
  mixins: [mixin],
  data() {
    return {
      loading: false,
      user: {
        email: "",
        password: "",
        passwordConfirm: "",
      },
      showPW1: false,
      showPW2: false,
      snackbar: false,
      snackbarText: "",
    };
  },
  computed: {
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
    validPassword() {
      return this.user.password && this.user.password.length >= 6
        ? true
        : false;
    },
    validPasswordConfirm() {
      return this.user.passwordConfirm && this.user.passwordConfirm.length >= 6
        ? true
        : false;
    },
    samePasswords() {
      if (this.user.password && this.user.passwordConfirm) {
        return this.user.password === this.user.passwordConfirm ? true : false;
      } else {
        return false;
      }
    },
    // disableAction() {
    //   if (this.safeUserEmail && !this.validEmail) return true;
    //   if (this.user.password && !this.validPassword) return true;
    //   if (this.user.passwordConfirm && !this.validPasswordConfirm) return true;
    //   if (this.user.password && this.user.passwordConfirm && !this.samePasswords) return true;
    //   if (this.isSubmitted) return true;
    //   return false;
    // }
  },
  watch: {
    user: {
      handler: function() {
        this.snackbarText = "";
        this.snackbar = false;
      },
      deep: true,
    },
  },
  methods: {
    signup() {
      const vm = this;
      if (!this.isFormFilled) {
        this.snackbarText = "Please fill in the form";
        this.snackbar = true;
        return;
      }

      if (!this.validEmail || !this.samePasswords) return;

      this.loading = true;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.safeUserEmail, this.user.password)
        .then((result) => {
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
        .catch((error) => {
          vm.loading = false;
          vm.snackbarText = error.message;
          vm.snackbar = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-sign-up {
  height: 100%;
  padding: 30px 10px;
}

.card-sign-up {
  position: relative;
  margin-top: 3vh;
  background-color: rgba(#fff, 0.6);
}

.title-sign-up {
  font-size: 24px;
  font-weight: 700;
}

.section {
  position: relative;
}

.user-input {
  display: block;
  width: 280px;
  height: 50px;
  padding-left: 1.3vw;
  color: #868686;
  font-size: 14px;
  font-weight: 300;
  outline: none;
  background-color: #f2f2f2;
  border-radius: 4px;
}

.input-pw {
  margin-bottom: 10px;
}

.input-invalid {
  width: 280px;
  height: 25px;
  line-height: 25px;
  word-spacing: 1px;
  font-size: 14px;
  color: #c62828;
}

.reveal-pw {
  position: absolute;
  top: 7px;
  right: 10px;
}

.btn-sign-up {
  width: 280px;
}

.signin {
  color: #151515;
  font-size: 14px;
  font-weight: 300;
  text-align: center;

  .link-signin {
    color: #000;
    font-weight: 400;
    text-decoration-skip-ink: none;
  }
}
</style>
