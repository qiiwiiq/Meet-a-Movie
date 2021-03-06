<template>
  <div class="d-flex justify-center">
    <div v-if="isLogin" class="page-settings justify-space-around">
      <div class="col-left profile d-flex flex-column justify-space-between align-center">
        <div class="d-flex flex-column align-center">
          <v-hover v-slot:default="{ hover }">
            <div class="profile-image mt-2 mb-4">
              <v-img v-if="user.photo" :src="user.photo" />
              <v-img v-else src="../assets/user-default.jpg" />
              <v-btn
                small
                depressed
                color="transparent"
                class="btn-change-photo text-none"
                :class="{ 'show-btns': hover }"
                @click="editPhotoDialogOpened = true"
              >
                Edit
              </v-btn>
            </div>
          </v-hover>
          <div class="profile-name d-flex justify-center align-center mb-2">
            <span class="ml-4 mr-2">{{ user.name || 'Your Name' }}</span>
            <v-btn icon small @click="editNameDialogOpened = true">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </div>
          <div class="profile-email mb-1">{{ user.email }}</div>
          <div v-if="user.signInMethod !== 'email'" class="profile-signin">
            (sign in with
            <span class="profile-signin-method">{{ signInMethod }}</span
            >)
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
                  :clearFlag="clearFlag"
                  v-model="oldPassword"
                  @updateClearFlag="clearFlag = $event"
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
                  <v-icon v-if="validOldPassword" small :color="mainColor">
                    mdi-check-bold
                  </v-icon>
                  <v-icon v-else small color="#CF0000">
                    mdi-close-thick
                  </v-icon>
                </template>
              </div>
            </div>
            <div class="input-label">New Password</div>
            <PasswordInput
              :placeholder="'New Password (at least 6 characters)'"
              :height="40"
              :clearFlag="clearFlag"
              v-model="password.new"
              @updateClearFlag="clearFlag = $event"
              class="mb-2"
            />
            <div class="input-label">Confirm Password</div>
            <PasswordInput
              :placeholder="'Confrim Password'"
              :height="40"
              :clearFlag="clearFlag"
              v-model="password.confirm"
              @updateClearFlag="clearFlag = $event"
            />
            <div class="input-invalid py-1">
              <div
                v-if="
                  (password.new && !validPassword) || (password.confirm && !validPasswordConfirm)
                "
              >
                At least 6 characters
              </div>
              <div v-else-if="password.new && password.confirm && !samePasswords">
                Password not match
              </div>
            </div>
          </div>
          <v-btn small dark depressed :color="mainColor" class="text-none ml-2" @click="changePW">
            Change Password
          </v-btn>
        </div>
        <div>
          <div class="item-title">Delete Account</div>
          <v-divider></v-divider>
          <div class="item-desc mx-2 my-2">
            Once you delete your account, all the data will be removed from database. There is no
            going back. Please be certain.
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
    <v-dialog v-model="editPhotoDialogOpened" width="350" persistent>
      <ActionsDialog
        :actionTitle="'Edit Your Photo'"
        :actionText1="'Cancel'"
        :actionText2="'OK'"
        :disabledAcion2="photo && photo.size > 3000000"
        @action1="editPhotoDialogOpened = false"
        @action2="updatePhoto"
      >
        <div class="px-6">
          <div class="body-2 mb-4">
            Select image from your device<br />
            The image size should be smaller than 3 MB
          </div>
          <div class="d-flex">
            <div class="photo-uploader">
              <ImageUploader
                :defaultLogo="user.photo"
                @setImage="setImage"
                @resetImage="resetImage"
              />
            </div>
            <div
              v-if="photo && photo.size > 3000000"
              class="caption pt-2 red--text text--lighten-2"
            >
              The image size is larger than 5 MB
            </div>
          </div>
        </div>
      </ActionsDialog>
    </v-dialog>

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
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import { mapState } from 'vuex';
import { mixin } from '@/utils/mixin';
import ActionsDialog from '@/components/actionsDialog';
import ImageUploader from '@/components/imageUploader';
import PasswordInput from '@/components/passwordInput';

export default {
  metaInfo: {
    title: 'Settings | Meet a Movie',
  },
  mixins: [mixin],
  components: {
    ActionsDialog,
    ImageUploader,
    PasswordInput,
  },
  data() {
    return {
      photo: '',
      username: '',
      originUsername: '',
      oldPassword: '',
      validOldPassword: false,
      isChecking: false,
      isOldPasswordChecked: false,
      password: {
        new: '',
        confirm: '',
      },
      clearFlag: false,
      editPhotoDialogOpened: false,
      editNameDialogOpened: false,
      delAccountDialogOpened: false,
      snackbar: false,
      snackbarText: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.isLogin) {
        vm.$router.replace({ name: 'SignIn' });
      }
    });
  },
  mounted() {
    this.username = this.user.name;
    this.originUsername = this.username;
  },
  computed: {
    ...mapState(['isLogin', 'user']),
    signInMethod() {
      let result = '';
      switch (this.user.signInMethod) {
        case 'fb':
          result = 'Facebook';
          break;
        case 'google':
          result = 'Google';
          break;
      }
      return result;
    },
    validPassword() {
      return this.password.new && this.password.new.length >= 6 ? true : false;
    },
    validPasswordConfirm() {
      return this.password.confirm && this.password.confirm.length >= 6 ? true : false;
    },
    samePasswords() {
      if (this.password.new && this.password.confirm) {
        return this.password.new === this.password.confirm ? true : false;
      } else {
        return false;
      }
    },
    isFormFilled() {
      return this.oldPassword &&
        this.validPassword &&
        this.validPasswordConfirm &&
        this.samePasswords
        ? true
        : false;
    },
  },
  watch: {
    isLogin(val) {
      if (!val) this.$router.replace({ name: 'SignIn' });
    },
    user: {
      handler: function() {
        this.username = this.user.name;
        this.originUsername = this.username;
      },
      deep: true,
    },
    oldPassword() {
      this.validOldPassword = false;
      this.isOldPasswordChecked = false;
    },
  },
  methods: {
    setImage(file) {
      this.photo = file;
      console.log(this.photo);
    },
    resetImage() {
      this.photo = '';
    },
    updatePhoto() {
      let storageRef = firebase.storage().ref(`photo/${this.user.uid}`);
      if (this.photo) {
        storageRef
          .put(this.photo)
          .then((snapshot) => {
            this.$store.dispatch('dbUpdateUser', {
              uid: this.user.uid,
              obj: {
                photoRef: snapshot.ref.location.path_,
              },
            });
            this.editPhotoDialogOpened = false;
          })
          .catch(() => {
            this.editPhotoDialogOpened = false;
            this.snackbarText = 'Something wrong';
            this.snackbar = true;
          });
      } else {
        storageRef.delete().then(() => {
          this.$store.dispatch('dbUpdateUser', {
            uid: this.user.uid,
            obj: {
              photoRef: '',
            },
          });
        });
        this.editPhotoDialogOpened = false;
      }
    },
    updateUser() {
      if (this.username.length > 20) return;
      if (this.username !== this.originUsername) {
        this.$store.dispatch('dbUpdateUser', {
          uid: this.user.uid,
          obj: {
            name: this.username,
          },
        });
      }
      this.editNameDialogOpened = false;
    },
    checkPW(action = '') {
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
          if (error.code === 'auth/wrong-password') {
            vm.snackbarText = 'Incorrect password';
            vm.snackbar = true;
          } else {
            vm.snackbarText = error.message;
            vm.snackbar = true;
          }
        });
    },
    changePW() {
      if (!this.isFormFilled) {
        this.snackbarText = 'Please fill in the form';
        this.snackbar = true;
        return;
      }

      if (this.oldPassword === this.password.new) {
        this.snackbarText = 'New password is the same as current password. Please check.';
        this.snackbar = true;
        return;
      }

      if (!this.validOldPassword) {
        this.checkPW('changePW');
        return;
      }

      const user = firebase.auth().currentUser;
      user
        .updatePassword(this.password.new)
        .then(() => {
          this.snackbarText = 'Password updated';
          this.snackbar = true;
          this.oldPassword = '';
          this.password.new = '';
          this.password.confirm = '';
          this.clearFlag = true;
        })
        .catch(() => {
          this.snackbarText = 'Password not updated. Please try again.';
          this.snackbar = true;
        });
    },
    delAccount() {
      this.$store.dispatch('dbDeleteUser', {
        uid: this.user.uid,
        obj: this.user,
      });
      // TODO: delete user's collection lists
      // TODO: delete user's collections
      const user = firebase.auth().currentUser;
      user
        .delete()
        .then(() => {
          this.logout();
        })
        .catch(() => {
          console.log('something wrong');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.page-settings {
  display: flex;
  max-width: 900px;
  margin: 16px 20px;
  padding: 12px 0;
  border-radius: 4px;
  background-color: rgba(#fff, 0.6);

  @include respond(tab-port) {
    display: block;
    width: 80%;
    height: calc(var(--vh, 1vh) * 100 - 90px);
    padding: 12px 0 24px 0;
    overflow-y: scroll;
  }

  @include respond(mobile) {
    width: 100%;
    margin: 16px 12px;
  }
}

.divider {
  width: 1px;
  border-right: 1px dashed #757575;
}

.col-left,
.col-right {
  height: calc(var(--vh, 1vh) * 100 - 120px);
  overflow-y: scroll;

  @include respond(tab-port) {
    height: unset;
  }
}

.col-left {
  min-width: 30vw;
  padding: 0 12px;
}

.col-right {
  width: 50vw;
  padding: 0 16px;

  @include respond(tab-port) {
    width: unset;
  }

  @include respond(mobile) {
    padding: 0 12px;
  }
}

.profile {
  @include respond(tab-port) {
    margin-bottom: 16px;
  }

  &-image {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;

    @include respond(tab-port) {
      width: 100px;
      height: 100px;
    }

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

    @include respond(tab-port) {
      font-size: 16px;
      line-height: 24px;
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
  background-color: #272727 !important;
  color: #fff !important;
}

.photo-uploader {
  width: 144px;
  min-width: 144px;
  height: 144px;
  border-radius: 12px;
  border: 1px solid #979797;
  background-color: #fff;
  margin-right: 1.8vw;

  @include respond(tab-port) {
    width: 96px;
    min-width: 96px;
    height: 96px;
    margin: 0 auto;
  }
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
