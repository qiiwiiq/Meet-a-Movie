<template>
  <v-app>
    <v-app-bar app dark height="56" class="navbar">
        <router-link to="/" class="app-logo d-flex align-center" tag="div">
          <v-img width="40" height="40" src="./assets/movie-logo.png"></v-img>
          <div class="app-title">Meet a Movie</div>
        </router-link>

      <v-spacer></v-spacer>
      <v-btn
        dark
        :text="windowWidth > 560"
        :icon="windowWidth <= 560"
        :small="windowWidth > 560"
        class="btn-nav"
        active-class="cyan--text"
        :to="{ name: 'Home' }"
        exact
      >
        <v-icon class="btn-nav--icon">mdi-movie-open</v-icon>
        <span class="btn-nav--text">Quote / Movie</span>
      </v-btn>
      <v-btn
        dark
        :text="windowWidth > 560"
        :icon="windowWidth <= 560"
        :small="windowWidth > 560"
        class="btn-nav"
        active-class="cyan--text"
        :to="{ name: 'MyCollections' }"
      >
        <v-icon class="btn-nav--icon">mdi-heart-outline</v-icon>
        <span class="btn-nav--text">Collections</span>
      </v-btn>
      <v-btn
        v-if="!isLogin"
        outlined
        small
        class="mx-1"
        :to="{ name: 'SignIn' }"
      >
        Sign in
      </v-btn>
      <v-menu
        v-else
        bottom
        offset-y
        z-index="9999"
        close-delay="300"
        nudge-bottom="4"
        content-class="user-menu"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon class="mr-1" v-on="on">
            <v-avatar v-if="user.photo" size="36">
              <img :src="user.photo" />
            </v-avatar>
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list tile dense dark color="#333" class="pa-0">
          <v-list-item  v-if="user.name || user.email" class="menu-list-item" two-line>
            <v-list-item-content>
              <v-list-item-title class="menu-list-item-account text-right">{{ user.name }}</v-list-item-title>
              <v-list-item-title class="menu-list-item-account text-right">{{ user.email }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="user.role === 'maintainer'"
            class="menu-list-item"
            :to="{ name: 'Management' }"
          >
            <v-list-item-title class="menu-list-item-text d-flex justify-end">
              <div class="menu-action d-flex justify-space-between">
                <v-icon small>mdi-unicorn-variant</v-icon>
                Management
              </div>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            class="menu-list-item"
            :to="{ name: 'Library' }"
          >
            <v-list-item-title class="menu-list-item-text d-flex justify-end">
              <div class="menu-action d-flex justify-space-between">
                <v-icon small>mdi-web</v-icon>
                Library
              </div>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            class="menu-list-item"
            :to="{ name: 'Settings' }"
          >
            <v-list-item-title class="menu-list-item-text d-flex justify-end">
              <div class="menu-action d-flex justify-space-between">
                <v-icon small>mdi-cog</v-icon>
                Settings
              </div>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            class="menu-list-item"
            @click="signOutDialogOpened = true"
          >
            <v-list-item-title class="menu-list-item-text d-flex justify-end">
              <div class="menu-action d-flex justify-space-between">
                <v-icon small>mdi-logout-variant</v-icon>
                Sign Out
              </div>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="main">
      <router-view />
    </v-main>

    <v-dialog v-model="signOutDialogOpened" width="400">
      <ActionsDialog
        :actionTitle="'Sign Out'"
        :actionText1="'No'"
        :actionText2="'Yes'"
        @action1="signOutDialogOpened = false"
        @action2="signOut"
      >
        <v-card-text>
          Are you sure to leave?
        </v-card-text>
      </ActionsDialog>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";
import ActionsDialog from "@/components/actionsDialog";

export default {
  name: "App",
  mixins: [mixin],
  components: {
    ActionsDialog,
  },
  data() {
    return {
      signOutDialogOpened: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "movieObj"]),
  },
  mounted() {
    this.initUserFromCookies();
  },
  methods: {
    initUserFromCookies() {
      const uid = this.$cookies.get("uid");
      const user = {
        isNewUser: false,
        uid,
      };
      this.$store.dispatch("init", user);
    },
    signOut() {
      localStorage.clear();
      this.logout();
      this.signOutDialogOpened = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.navbar {
  background-image: linear-gradient(
    #111 0%,
    #333 70%,
    #444 80%,
    #555 90%,
    #444 100%
  );
}

.app-logo {
  cursor: pointer;
}

.app-title {
  font-family: 'Luckiest Guy', cursive;
  font-size: 20px;
  color: #FFF;
  margin-left: 8px;
  padding-top: 4px;

  @include respond(tab-port) {
    font-size: 16px;
    line-height: 16px;
  }
}

.main {
  background-image: url("./assets/bg.jpg");
  background-size: cover;
}

.user-menu {
  border-radius: 0;
}

.menu-list-item {
  border-radius: 0;
  max-width: 150px;
  min-height: 40px !important;

  &:not(:first-child) {
    border-top: 1px dashed #ccc;
  }

  &-account {
    font-size: 12px !important;
    color: #26C6DA;
  }

  &-text {
    font-size: 12px !important;
    text-transform: uppercase;
  }

  .menu-action {
    width: 105px;
  }
}

.btn-nav,
.v-btn:before {
  background-color: transparent;
}

.btn-nav {
  margin-right: 4px;

  @include respond(large-mobile) {
    margin-right: 8px;
  }

  &--icon {
    margin-right: 4px;

    @include respond(large-mobile) {
      margin-right: 0;
    }
  }

  &--text {
    @include respond(large-mobile) {
      display: none;
    }
  }
}
</style>

<style lang="scss">
@import "./scss/global.scss";
</style>
