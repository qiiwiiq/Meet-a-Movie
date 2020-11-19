<template>
  <div class="d-flex justify-center">
    <div class="page-settings py-3 d-flex justify-space-around">
      <div class="col-left profile d-flex flex-column justify-space-between align-center">
        <div class="d-flex flex-column align-center">
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
        <div class="profile-created">Joined at {{ formatTime(user.created) }}</div>
      </div>
      <div class="divider"></div>
      <div class="col-right settings">
        <div class="mb-4" v-if="user.signInMethod === 'email'">
          <div class="item-title">Change Password</div>
          <v-divider></v-divider>
          <div class="item-desc mx-2 my-2">
            Setting new password
          </div>
          <div class="mx-2">
            <PasswordInput
              :placeholder="'Current Password'"
              :height="40"
              @value="password.old = $event"
              class="mb-2"
            />
            <PasswordInput
              :placeholder="'New Password (at least 6 characters)'"
              :height="40"
              @value="password.new = $event"
              class="mb-2"
            />
            <PasswordInput
              :placeholder="'Confrim Password'"
              :height="40"
              @value="password.confirm = $event"
              class="mb-2"
            />
          </div>
          <v-btn
            small
            dark
            depressed
            :color="mainColor"
            class="text-none ml-2"
          >
            Change Password
          </v-btn>
        </div>
        <div>
          <div class="item-title">Delete Account</div>
          <v-divider></v-divider>
          <div class="item-desc mx-2 my-2">
            Once you delete your account, all your data will be removed from database.
            There is no going back. Please be certain.
          </div>
          <v-btn
            small
            dark
            depressed
            color="#CF0000"
            class="text-none ml-2"
            @click="delAccountDialogOpened = true"
          >
            Delete Account
          </v-btn>
        </div>
      </div>
    </div>
    <v-dialog v-model="delAccountDialogOpened" width="400" persistent>
      <ActionsDialog
        :actionTitle="'Delete Account'"
        :actionText1="'No'"
        :actionText2="'YES'"
        @action1="delAccountDialogOpened = false"
        @action2="delAccount"
      >
        <div class="px-6 pb-4">
          <div class="body-2">
            Are you sure to delete this account? <br />
            [ {{ user.email }} ]
          </div>
          <div class="caption pt-2 red--text text--lighten-2">
            Note: Once you delete your account, there is no going back. Please be certain.
          </div>
        </div>
      </ActionsDialog>
    </v-dialog>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";
import ActionsDialog from "@/components/actionsDialog";
import PasswordInput from "@/components/passwordInput";

export default {
  mixins: [mixin],
  components: {
    ActionsDialog,
    PasswordInput,
  },
  data() {
    return {
      isEditName: false,
      username: "",
      originUsername: "",
      password: {
        old: "",
        new: "",
        confirm: ""
      },
      delAccountDialogOpened: false
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
    },
    delAccount() {
      this.$store.dispatch("dbDeleteUser", this.user.uid);
      // TODO: delete user's collection lists
      // TODO: delete user's collections
      const user = firebase.auth().currentUser;
      user.delete().then(() => {
        this.logout();
      }).catch(() => {
        console.log("something wrong");
      });
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
}

.col-left {
  width: 30vw;
  padding: 0 12px;
}

.col-right {
  width: 50vw;
  padding: 0 16px;
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

  &-created {
    font-size: 12px;
  }
}

.settings {
  .item-title {
    font-weight: 500;
  }

  .item-desc {
    font-size: 14px;
    color: #555;
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
