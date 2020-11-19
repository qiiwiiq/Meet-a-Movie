<template>
  <span>
    <v-menu v-if="!isCollected" offset-x offset-y left nudge-left="-18">
      <template v-slot:activator="{ on }">
        <v-btn icon :ripple="false" v-on="on">
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>
      </template>
      <v-list dense class="py-0">
        <v-list-item
          v-for="list in filteredLists"
          :key="list.id"
          @click="addCollections(list.id)"
        >
          <v-list-item-title>
            <v-icon small class="mr-1">mdi-plus</v-icon>
            {{ list.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu v-if="isCollected" offset-x offset-y left nudge-left="-18">
      <template v-slot:activator="{ on }">
        <v-btn icon :ripple="false" v-on="on">
          <v-icon color="#B71C1C">mdi-heart</v-icon>
        </v-btn>
      </template>
      <v-list dense class="py-0">
        <v-list-item @click="removeCollections()">
          <v-list-item-title>
            <v-icon small class="mr-1">mdi-minus</v-icon>
            Remove
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="list in filteredLists"
          :key="list.id"
          @click="addCollections(list.id)"
        >
          <v-list-item-title>
            <v-icon small class="mr-1">mdi-plus</v-icon>
            {{ list.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["movieObj"],
  data() {
    return {
      isCollected: false
    }
  },
  computed: {
    ...mapState(["user", "collections", "collectionLists"]),
    filteredLists() {
      if (this.isCollected) {
        const filteredLists = this.collectionLists.filter(
          (item) => item.id !== this.movieObj.listid
        );
        return filteredLists;
      } else {
        return this.collectionLists;
      }
    },
  },
  mounted() {
    let vm = this;
    vm.$nextTick(() => {
      if (vm.collections.length > 0 && vm.movieObj) {
        vm.isCollected = vm.checkIfMovieCollected(vm.movieObj, vm.collections);
      }
    })
  },
  watch: {
    movieObj() {
      if (this.movieObj) {
        this.isCollected = this.checkIfMovieCollected(this.movieObj, this.collections);
      }
    },
    collections() {
      this.isCollected = this.checkIfMovieCollected(this.movieObj, this.collections);
    }
  },
  methods: {
    checkIfMovieCollected(movieObj, collections) {
      const value = collections.some(item => item.quote === movieObj.quote);
      return value;
    },
    addCollections(listid) {
      const obj = { ...this.movieObj };
      obj.listid = listid;
      if (this.isCollected) {
        this.$store.dispatch("dbUpdateCollections", {
          uid: this.user.uid,
          collectionId: obj.collectionId,
          movieObj: obj,
        });
      } else {
        this.$store.dispatch("dbAddCollections", {
          uid: this.user.uid,
          movieObj: obj,
        });
      }
    },
    removeCollections() {
      this.$store.dispatch("dbDeleteCollections", {
        uid: this.user.uid,
        collectionId: this.movieObj.collectionId,
      });
    },
  },
};
</script>
