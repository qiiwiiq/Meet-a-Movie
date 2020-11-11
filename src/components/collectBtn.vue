<template>
  <span>
    <v-menu
      v-if="!isCollected"
      offset-x
      offset-y
      left
      nudge-left="-18"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          class="mr-2"
          :ripple="false"
          v-on="on"
        >
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>
      </template>
      <v-list
        dense
        class="py-0"
      >
        <v-list-item
          v-for="group in filteredGroups"
          :key="group.id"
          @click="addCollections(group.id)"
        >
          <v-list-item-title>
            <v-icon small class="mr-1">mdi-plus</v-icon>
            {{ group.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu
      v-if="isCollected"
      offset-x
      offset-y
      left
      nudge-left="-18"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          class="mr-2"
          :ripple="false"
          v-on="on"
        >
          <v-icon color="#B71C1C">mdi-heart</v-icon>
        </v-btn>
      </template>
      <v-list
        dense
        class="py-0"
      >
        <v-list-item @click="removeCollections()">
          <v-list-item-title>
            <v-icon small class="mr-1">mdi-minus</v-icon>
            Remove
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="group in filteredGroups"
          :key="group.id"
          @click="addCollections(group.id)"
        >
          <v-list-item-title>
            <v-icon small class="mr-1">mdi-plus</v-icon>
            {{ group.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["isCollected", "movieObj"],
  computed: {
    ...mapState(["user", "collectionGroups"]),
    filteredGroups() {
      if (this.isCollected) {
        const filteredGroups = this.collectionGroups.filter(item => item.id !== this.movieObj.groupid);
        return filteredGroups;
      } else {
        return this.collectionGroups;
      }
    }
  },
  methods: {
    addCollections(groupid) {
      this.$emit("updateIsCollected", true);
      this.$emit("updateGroupid", groupid);
      const obj = { ...this.movieObj };
      obj.groupid = groupid;
      this.$store.dispatch("dbUpdateCollections", {
        uid: this.user.uid,
        movieObj: obj
      });
    },
    removeCollections() {
      this.$emit("updateIsCollected", false);
      this.$emit("updateGroupid", '');
      this.$store.dispatch("dbDeleteCollections", {
        uid: this.user.uid,
        movieid: this.movieObj.id
      });
    }
  }
}
</script>