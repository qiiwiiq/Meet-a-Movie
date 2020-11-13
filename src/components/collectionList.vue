<template>
  <div>
    <v-list-item class="px-2">
      <v-list-item-content>
        <v-list-item-title>
          <span>{{ list.name }}</span>
          <span class="list-item-count ml-1">({{countListItems(collections, list.id)}})</span>
        </v-list-item-title>
      </v-list-item-content>
      <v-btn icon small @click="editListDialogOpened = true">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon small @click="deleteListDialogOpened = true">
        <v-icon small>mdi-trash-can-outline</v-icon>
      </v-btn>
    </v-list-item>
    <v-dialog
      v-model="editListDialogOpened"
      width="400"
      persistent
    >
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
            class="dialog-create-list-input"
          ></v-text-field>
        </div>
      </ActionsDialog>
    </v-dialog>

    <v-dialog
      v-model="deleteListDialogOpened"
      width="400"
      persistent
    >
      <ActionsDialog
        :actionTitle="'Delete List'"
        :actionText1="'No'"
        :actionText2="'Yes'"
        @action1="deleteListDialogOpened = false"
        @action2="deleteList"
      >
        <div class="px-6 pb-4">
          <div class="body-2">Are you share to delete this list ({{ list.name }}) ?</div>
          <div class="caption pt-2 red--text text--lighten-2">Note: The collections will be deleted together.</div>
        </div>
      </ActionsDialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from '@/utils/mixin';
import ActionsDialog from "@/components/actionsDialog";

export default {
  mixins: [mixin],
  props: ["list"],
  components: {
    ActionsDialog,
  },
  data() {
    return {
      listName: '',
      editListDialogOpened: false,
      deleteListDialogOpened: false
    }
  },
  mounted() {
    this.listName = this.list.name;
  },
  computed: {
    ...mapState(["user", "collections"]),
  },
  watch: {
    editListDialogOpened(val) {
      if (!val) this.listName = '';
    }
  },
  methods: {
    countListItems(collections, listid) {
      const listItems = collections.filter(item => item.movie.listid === listid);
      return listItems.length;
    },
    editList() {
      this.$store.dispatch("dbEditCollectionList", {
        uid: this.user.uid,
        listid: this.list.id,
        listName: this.listName
      });
      this.editListDialogOpened = false;
    },
    deleteList() {
      this.$store.dispatch("dbDeleteCollectionList", {
        uid: this.user.uid,
        listid: this.list.id
      });
      this.deleteListDialogOpened = false;
    }
  }
}
</script>
