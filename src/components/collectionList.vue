<template>
  <div>
    <v-list-item class="px-2">
      <v-list-item-content>
        <v-list-item-title>
          <span>{{ list.name }}</span>
          <span class="list-item-count ml-1"
            >({{ countListItems(collections, list.id) }})</span
          >
        </v-list-item-title>
      </v-list-item-content>
      <EditListBtn :list="list" />
      <DeleteListBtn :list="list" />
    </v-list-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";
import DeleteListBtn from "@/components/buttons/deleteListBtn";
import EditListBtn from "@/components/buttons/editListBtn";

export default {
  mixins: [mixin],
  props: ["list"],
  components: {
    DeleteListBtn,
    EditListBtn
  },
  computed: {
    ...mapState(["collections"]),
  },
  methods: {
    countListItems(collections, listid) {
      const listItems = collections.filter(
        (item) => item.listid === listid
      );
      return listItems.length;
    },
  },
};
</script>
