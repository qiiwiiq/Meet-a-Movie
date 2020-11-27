<template>
  <div>
    <v-btn icon small @click="editListDialogOpened = true">
      <v-icon small>mdi-pencil</v-icon>
    </v-btn>
    <v-dialog v-model="editListDialogOpened" width="400" persistent>
      <ActionsDialog
        :actionTitle="'Modify List Name'"
        :actionText1="'Cancel'"
        :actionText2="'Modify'"
        @action1="editListDialogOpened = false"
        @action2="editList"
      >
        <div class="px-6">
          <v-text-field
            v-model="listName"
            dense
            placeholder="List Name"
            :color="mainColor"
            class="user-input"
          ></v-text-field>
        </div>
      </ActionsDialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";
import ActionsDialog from "@/components/actionsDialog";

export default {
  mixins: [mixin],
  props: {
    list: {
      default: () => {
        return {
          name: ''
        }
      }
    }
  },
  components: {
    ActionsDialog,
  },
  data() {
    return {
      listName: "",
      editListDialogOpened: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    editListDialogOpened(val) {
      if (!val) this.listName = "";
      else this.listName = this.list.name;
    },
  },
  methods: {
    editList() {
      this.$store.dispatch("dbEditCollectionList", {
        uid: this.user.uid,
        listid: this.list.id,
        listName: this.listName,
      });
      this.editListDialogOpened = false;
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.user-input {
  font-size: 14px;
}
</style>