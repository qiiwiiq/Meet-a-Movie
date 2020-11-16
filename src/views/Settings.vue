<template>
  <div class="d-flex justify-center">
    <div class="page-settings py-3 d-flex justify-space-around w-100">
      <div class="col-left profile d-flex flex-column align-center">
        <v-hover v-slot:default="{ hover }">
          <div class="profile-image mt-2 mb-4">
            <v-img
              v-if="user.photoURL"
              :src="user.photoURL"
            />
            <v-img
              v-else
              src="../assets/user-default.jpg"
            />
            <v-btn
              small
              depressed
              color="transparent"
              class="btn-change-photo text-none"
              :class="{ 'show-btns': hover }"
            >
              Edit
            </v-btn>
          </div>
        </v-hover>
        <div v-if="user.name && !isEditName" class="profile-name d-flex justify-center mb-2">
          <span class="ml-4 mr-2">{{ username }}</span>
          <v-btn
            icon
            small
            @click="isEditName = true"
          >
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
        </div>
        <div v-else class="profile-name--edit d-flex align-center mb-2">
          <input
            v-model="username"
            class="user-input"
            type="text"
            placeholder="Your Name"
            autofocus
          />
          <v-btn
            x-small
            dark
            depressed
            :color="mainColor"
            class="btn-update-name text-none"
            @click="updateUser"
          >
            Update
          </v-btn>
        </div>
        <div class="profile-email mb-1">{{ user.email }}</div>
        <div v-if="user.signInMethod !== 'email'" class="profile-signin">
          (sign in with 
          <span class="profile-signin-method">{{ signInMethod }}</span>)
        </div>
      </div>
      <div class="divider"></div>
      <div class="col-right">
        <v-btn
          small
          depressed
          class="text-none mb-2"
        >
          Delete Account
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";

export default {
  mixins: [mixin],
  data() {
    return {
      isEditName: false,
      username: "",
      originUsername: ""
    }
  },
  mounted() {
    this.username = this.user.name;
    this.originUsername = this.username;
  },
  computed: {
    ...mapState(["user"]),
    signInMethod() {
      let result = '';
      switch(this.user.signInMethod) {
        case "fb":
          result = "Facebook";
          break;
        case "google":
          result = "Google";
          break;
      }
      return result;
    },
  },
  watch: {
    user: {
      handler: function() {
        this.username = this.user.name;
        this.originUsername = this.username;
      },
      deep: true
    }
  },
  methods: {
    updateUser() {
      if (this.username !== this.originUsername) {
        this.$store.dispatch("dbUpdateUser", {
          uid: this.user.uid,
          obj: {
            name: this.username,
          },
        });
      }
      this.isEditName = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.page-settings {
  max-width: 900px;
  margin: 16px 20px;
  border-radius: 4px;
  background-color: rgba(#fff, 0.6);
}

.divider {
  width: 1px;
  border-right: 1px dashed #757575;
}

.col-left,
.col-right {
  height: calc(100vh - 120px);
  overflow-y: scroll;
  padding: 0 12px;
}

.col-left {
  width: 36%;
}

.col-right {
  width: 60%;
}

.profile {
  &-image {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }

    .btn-change-photo {
      width: 100%;
      position: absolute;
      bottom: 0;
      color: transparent;
    }
  }

  &-name {
    font-size: 20px;
    font-weight: 700;
  }

  &-name--edit {
    position: relative;

    .btn-update-name {
      position: absolute;
      right: 0;
    }
  }

  &-signin {
    font-size: 12px;

    &-method {
      font-weight: 500;
    }
  }
}

.user-input {
  display: block;
  width: 280px;
  height: 30px;
  color: #000;
  font-size: 20px;
  font-weight: 500;
  outline: none;
  border-radius: 4px;
  text-align: center;
}

.show-btns {
  color:  #0097A7 !important;
}
</style>
