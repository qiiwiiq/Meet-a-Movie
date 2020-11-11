<template>
  <div>
    <v-list-item class="px-2">
      <v-list-item-content>
        <v-list-item-title>
          <span>{{ group.name }}</span>
          <span class="group-item-count ml-1">({{countGroupItems(collections, group.id)}})</span>
        </v-list-item-title>
      </v-list-item-content>
      <v-btn icon small @click="editGroupDialogOpened = true">
        <v-icon small>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon small @click="deleteGroupDialogOpened = true">
        <v-icon small>mdi-trash-can-outline</v-icon>
      </v-btn>
    </v-list-item>
    <v-dialog
      v-model="editGroupDialogOpened"
      width="400"
      persistent
    >
      <ActionsDialog
        :actionTitle="'Modify Group Name'"
        :actionText1="'Cancel'"
        :actionText2="'Modify'"
        @action1="editGroupDialogOpened = false"
        @action2="editGroup"
      >
        <div class="px-6">
          <v-text-field
            v-model="groupName"
            dense
            placeholder="Group Name"
            :color="mainColor"
            class="dialog-create-group-input"
          ></v-text-field>
        </div>
      </ActionsDialog>
    </v-dialog>

    <v-dialog
      v-model="deleteGroupDialogOpened"
      width="400"
      persistent
    >
      <ActionsDialog
        :actionTitle="'Delete Group'"
        :actionText1="'No'"
        :actionText2="'Yes'"
        @action1="deleteGroupDialogOpened = false"
        @action2="deleteGroup"
      >
        <div class="px-6 pb-4">
          <div class="body-2">Are you share to delete this group ({{ group.name }}) ?</div>
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
  props: ["group"],
  components: {
    ActionsDialog,
  },
  data() {
    return {
      groupName: '',
      editGroupDialogOpened: false,
      deleteGroupDialogOpened: false
    }
  },
  mounted() {
    this.groupName = this.group.name;
  },
  computed: {
    ...mapState(["user", "collections"]),
  },
  watch: {
    editGroupDialogOpened(val) {
      if (!val) this.groupName = '';
    }
  },
  methods: {
    countGroupItems(collections, groupid) {
      const groupItems = collections.filter(item => item.groupid === groupid);
      return groupItems.length;
    },
    editGroup() {
      this.$store.dispatch("dbEditCollectionGroups", {
        uid: this.user.uid,
        groupid: this.group.id,
        groupName: this.groupName
      });
      this.editGroupDialogOpened = false;
    },
    deleteGroup() {
      this.$store.dispatch("dbDeleteCollectionGroups", {
        uid: this.user.uid,
        groupid: this.group.id
      });
      this.deleteGroupDialogOpened = false;
    }
  }
}
</script>
