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
          <div class="profile-name d-flex justify-center mb-2">
            <span class="ml-4 mr-2">{{ user.name || "Your Name" }}</span>
            <v-btn
              icon
              small
              @click="editNameDialogOpened = true"
            >
              <v-icon small>mdi-pencil</v-icon>
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
          <div class="mt-2 mx-2">
            <div class="input-label">Current Password</div>
            <div class="d-flex align-center mb-2">
              <div class="section">
                <PasswordInput
                  :placeholder="'Current Password'"
                  :height="40"
                  @value="oldPassword = $event"
                />
                <v-progress-linear
                  v-if="isChecking"
                  indeterminate
                  rounded
                  :color="mainColor"
                  class="loading-bar"
                ></v-progress-linear>
              </div>
              <div v-if="oldPassword" class="ml-2">
                <v-btn
                  v-if="!isOldPasswordChecked"
                  small
                  rounded
                  outlined
                  :color="mainColor"
                  height="24px"
                  class="btn-check text-none"
                  @click="checkPW"
                >
                  Check
                </v-btn>
                <template v-else>
                  <v-icon
                    v-if="validOldPassword"
                    small
                    :color="mainColor"
                  >
                    mdi-check-bold
                  </v-icon>
                  <v-icon
                    v-else
                    small
                    color="#CF0000"
                  >
                    mdi-close-thick
                  </v-icon>
                </template>
              </div>
            </div>
            <div class="input-label">New Password</div>
            <PasswordInput
              :placeholder="'New Password (at least 6 characters)'"
              :height="40"
              @value="password.new = $event"
              class="mb-2"
            />
            <div class="input-label">Confirm Password</div>
            <PasswordInput
              :placeholder="'Confrim Password'"
              :height="40"
              @value="password.confirm = $event"
            />
            <div class="input-invalid py-1">
              <div
                v-if="
                  (password.new && !validPassword) ||
                    (password.confirm && !validPasswordConfirm)
                "
              >
                At least 6 characters
              </div>
              <div
                v-else-if="password.new && password.confirm && !samePasswords"
              >
                Password not match
              </div>
            </div>
          </div>
          <v-btn
            small
            dark
            depressed
            :color="mainColor"
            class="text-none ml-2"
            @click="changePW"
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
    <v-dialog v-model="editNameDialogOpened" width="350" persistent>
      <ActionsDialog
        :actionTitle="'Edit Your Name'"
        :actionText1="'Cancel'"
        :actionText2="'OK'"
        @action1="editNameDialogOpened = false"
        @action2="updateUser"
      >
        <div class="px-6">
          <v-text-field
            v-model="username"
            dense
            placeholder="Your Name"
            :color="mainColor"
            class="user-input"
            counter="20"
          ></v-text-field>
        </div>
      </ActionsDialog>
    </v-dialog>

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
          <div class="note caption pt-2 red--text text--lighten-2">
            Note: Once you delete your account, there is no going back. Please be certain.
          </div>
        </div>
      </ActionsDialog>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      <div class="text-center">{{ snackbarText }}</div>
    </v-snackbar>
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
      username: "",
      originUsername: "",
      oldPassword: "",
      validOldPassword: false,
      isChecking: false,
      isOldPasswordChecked: false,
      password: {
        new: "",
        confirm: ""
      },
      editNameDialogOpened: false,
      delAccountDialogOpened: false,
      snackbar: false,
      snackbarText: "",
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
    validPassword() {
      return this.password.new && this.password.new.length >= 6
        ? true
        : false;
    },
    validPasswordConfirm() {
      return this.password.confirm && this.password.confirm.length >= 6
        ? true
        : false;
    },
    samePasswords() {
      if (this.password.new && this.password.confirm) {
        return this.password.new === this.password.confirm ? true : false;
      } else {
        return false;
      }
    },
    isFormFilled() {
      return this.oldPassword && this.validPassword && this.validPasswordConfirm && this.samePasswords ? true : false;
    },
  },
  watch: {
    user: {
      handler: function() {
        this.username = this.user.name;
        this.originUsername = this.username;
      },
      deep: true
    },
    oldPassword() {
      this.validOldPassword = false;
      this.isOldPasswordChecked = false;
    }
  },
  methods: {
    updateUser() {
      if (this.username.length > 20) return;
      if (this.username !== this.originUsername) {
        this.$store.dispatch("dbUpdateUser", {
          uid: this.user.uid,
          obj: {
            name: this.username,
          },
        });
      }
      this.editNameDialogOpened = false;
    },
    checkPW(action = "") {
      const vm = this;
      vm.isChecking = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.user.email, this.oldPassword)
        .then(function() {
          vm.isChecking = false;
          vm.isOldPasswordChecked = true;
          vm.validOldPassword = true;

          if (action === 'changePW') vm.changePW();
        })
        .catch(function(error) {
          vm.isChecking = false;
          vm.isOldPasswordChecked = true;
          vm.validOldPassword = false;
          if (error.code === "auth/wrong-password") {
            vm.snackbarText = "Incorrect password";
            vm.snackbar = true;
          } else {
            vm.snackbarText = error.message;
            vm.snackbar = true;
          }
        });
    },
    changePW() {
      if (!this.isFormFilled) {
        this.snackbarText = "Please fill in the form";
        this.snackbar = true;
        return;
      }

      if (this.oldPassword === this.password.new) {
        this.snackbarText = "New password is the same as current password. Please check.";
        this.snackbar = true;
        return;
      }

      if (!this.validOldPassword) {
        this.checkPW('changePW')
        return;
      }

      const user = firebase.auth().currentUser;
      user.updatePassword(this.password.new)
        .then(() => {
          this.snackbarText = "Password updated";
          this.snackbar = true;
        })
        .catch(() => {
          this.snackbarText = "Password not updated. Please try again.";
          this.snackbar = true;
        });
      
    },
    delAccount() {
      this.$store.dispatch("dbDeleteUser", this.user.uid);
      // TODO: delete user's collection lists
      // TODO: delete user's collections
      const user = firebase.auth().currentUser;
      user.delete()
      .then(() => {
        this.logout();
      })
      .catch(() => {
        console.log("something wrong");
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

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
  min-width: 30vw;
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
    max-width: 100%;
    font-size: 20px;
    font-weight: 700;
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
    line-height: 18px;
  }

  .btn-check {
    background-color: rgba(#f2f2f2, 0.9);
  }

  .input-label {
    font-size: 12px;
    font-weight: 500;
    color: #333;
    margin-bottom: 2px;
  }

  .input-invalid {
    width: 280px;
    height: 25px;
    padding-left: 1.3vw;
    line-height: 1rem;
    word-spacing: 1px;
    font-size: 12px;
    color: #c62828;

    @include respond(small-mobile) {
      width: 250px;
    }
  }
}

.show-btns {
  color:  #0097A7 !important;
}

.user-input {
  font-size: 14px;
}

.note {
  line-height: 1rem;
}

.section {
  position: relative;
}

.loading-bar {
  position: absolute;
  bottom: 0;
}
</style>
