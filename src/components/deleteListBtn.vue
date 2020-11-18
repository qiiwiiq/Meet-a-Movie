<template>
  <div>
    <v-btn icon small @click="deleteListDialogOpened = true">
      <v-icon small>mdi-trash-can-outline</v-icon>
    </v-btn>
    <v-dialog v-model="deleteListDialogOpened" width="400" persistent>
      <ActionsDialog
        :actionTitle="'Delete List'"
        :actionText1="'No'"
        :actionText2="'Yes'"
        @action1="deleteListDialogOpened = false"
        @action2="deleteList"
      >
        <div class="px-6 pb-4">
          <div class="body-2">
            Are you share to delete this list ({{ list.name }}) ?
          </div>
          <div class="caption pt-2 red--text text--lighten-2">
            Note: The collections will be deleted together.
          </div>
        </div>
      </ActionsDialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ActionsDialog from "@/components/actionsDialog";

export default {
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
      deleteListDialogOpened: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    deleteList() {
      this.$store.dispatch("dbDeleteCollectionList", {
        uid: this.user.uid,
        listid: this.list.id,
      });
      this.deleteListDialogOpened = false;
    },
  }
}
</script>