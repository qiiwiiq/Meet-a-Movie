<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>
        <span>{{ group.name }}</span>
        <v-text-field
          v-model="groupName"
          v-if="isEditName"
        ></v-text-field>
        <span class="group-item-count ml-1">({{countGroupItems(collections, group.id)}})</span>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["group"],
  data() {
    return {
      groupName: '',
      isEditName: false
    }
  },
  mounted() {
    this.groupName = this.group.name;
  },
  computed: {
    ...mapState(["collections"]),
  },
  methods: {
    countGroupItems(collections, groupid) {
      const groupItems = collections.filter(item => item.groupid === groupid);
      return groupItems.length;
    },
  }
}
</script>
