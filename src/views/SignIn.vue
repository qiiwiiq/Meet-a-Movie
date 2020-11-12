<template>
  <div class="page-sign-in d-flex justify-center align-center">
    <v-card class="card-sign-in pa-4">
      <div class="title-sign-in text-center mb-4">Sign In</div>
      <div
        v-if="!isEmailSignin"
        class="d-flex flex-column"
      >
        <v-btn
          dark
          depressed
          color="#4CAF50"
          class="btn-sign-in ma-2 text-none"
          @click="isEmailSignin = true"
        >
          <v-icon left>mdi-email-outline</v-icon> Sign In with EMAIL
        </v-btn>
        <v-btn
          dark
          depressed
          color="#3b5998"
          class="btn-sign-in ma-2 text-none"
          @click="signIn('fb')"
        >
          <v-icon left>mdi-facebook</v-icon> Sign In with FACEBOOK
        </v-btn>
        <v-btn
          dark
          depressed
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
          depressed
          color="#F9A825"
          class="btn-sign-in ma-2 text-none"
          :to="{ name: 'SignUp' }"
        >
          Create a New Account
        </v-btn>
      </div>
      <div
        v-if="isEmailSignin"
        class="d-flex flex-column align-center"
      >
        <input
          v-model="user.email"
          class="user-input input-email"
          type="text"
          placeholder="Email"
          @keyup.enter="signup"
        />
        <div class="section">
          <input
            v-model="user.password"
            class="user-input input-pw"
            :type="showPW ? 'text' : 'password'"
            placeholder="Password"
            @keyup.enter="signup"
          />
          <v-btn
            icon
            v-if="user.password"
            class="reveal-pw"
            @click="showPW = !showPW"
          >
            <v-icon>mdi-{{ showPW ? 'eye-off' : 'eye' }}</v-icon>
          </v-btn>
        </div>
        <v-btn
          dark
          depressed
          color="#4CAF50"
          class="btn-email-sign-in ma-2 text-none"
          @click="signInEmail"
        >
          Sign In
        </v-btn>
        <div class="signin my-2">
          <span>Sign in with other methods </span>
          <button
            class="link-signin"
            @click="isEmailSignin = false"
          >
            Click here
          </button>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import "firebase/auth";
import { mapState } from "vuex";

export default {
  data() {
    return {
      isEmailSignin: true,
      user: {
        email: '',
        password: ''
      },
      showPW: false,
    }
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.isLogin) {
        vm.$router.replace({name: 'Home'});
      }
    })
  },
  methods: {
    signIn(signInMethod) {
      const vm = this;
      let provider;
      switch(signInMethod) {
        case 'fb':
          provider = new firebase.auth.FacebookAuthProvider();
          break;
        case 'google':
          provider = new firebase.auth.GoogleAuthProvider();
          break;
      }
      firebase.auth().signInWithPopup(provider)
        .then(function(result) {
          const user = result.user;
          let payload = {
            isNewUser: result.additionalUserInfo.isNewUser,
            signInMethod,
            token: result.credential.accessToken,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid
          };
          vm.$cookies.set('signInMethod', signInMethod);
          vm.$cookies.set('token', result.credential.accessToken);
          vm.$cookies.set('name', user.displayName);
          vm.$cookies.set('email', user.email);
          vm.$cookies.set('photoURL', user.photoURL);
          vm.$cookies.set('uid', user.uid);
          vm.$store.dispatch("init", payload);
          vm.$router.replace({name: 'Home'});
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    signInEmail() {
      firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(function(result) {
          const user = result.user;
          let payload = {
            isNewUser: result.additionalUserInfo.isNewUser,
            signInMethod,
            token: result.credential.accessToken,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid
          };
          vm.$cookies.set('signInMethod', signInMethod);
          vm.$cookies.set('token', result.credential.accessToken);
          vm.$cookies.set('name', user.displayName);
          vm.$cookies.set('email', user.email);
          vm.$cookies.set('photoURL', user.photoURL);
          vm.$cookies.set('uid', user.uid);
          vm.$store.dispatch("init", payload);
          vm.$router.replace({name: 'Home'});
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.page-sign-in {
  padding: 30px 10px;
}

.card-sign-in {
  margin-top: 3vh;
  background-color: rgba(#FFF, .6);
}

.title-sign-in {
  font-size: 24px;
  font-weight: 700;
}

.btn-sign-in {
  width: 220px;
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

.section {
  position: relative;
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
}

.reveal-pw {
  position: absolute;
  top: 7px;
  right: 10px;
}

.btn-email-sign-in {
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
    text-decoration: underline;
    text-decoration-skip-ink: none;
    outline: none;
  }
}
</style>