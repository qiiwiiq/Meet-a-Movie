<template>
  <div class="page-collections d-flex justify-space-between mx-auto">
    <div class="col-left">
      <div class="text-center mb-2">
        <v-btn
          small
          rounded
          outlined
          color="#333"
          class="btn-create-group mr-2"
          @click="createNewGroupDialogOpened = true"
        >
          Create New Group
        </v-btn>
        <v-btn
          small
          icon
          outlined
          color="#333"
          class="btn-create-group"
          @click="isEditing = true"
        >
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
      </div>
      <v-list flat rounded class="groups px-0">
        <v-list-item-group
          v-model="currentGroup"
          mandatory
          color="#006064"
        >
          <template v-for="group in collectionGroups">
            <CollectionGroup
              :group="group"
              :key="group.id"
            />
          </template>
        </v-list-item-group>
      </v-list>
    </div>
    <div class="col-right">
      <div
        v-for="(item, id) in collections"
        :key="id"
        class="fav-movie"
      >
        <MovieQuoteCard
          :movieObj="item.movie"
        />
      </div>
    </div>

    <v-dialog
      v-model="createNewGroupDialogOpened"
      width="400"
    >
      <v-card class="dialog-create-group">
        <v-card-text class="dialog-create-group-title pt-5">Create New Group</v-card-text>
        <div class="px-6">
          <v-text-field
            v-model="newGroupName"
            dense
            placeholder="Group Name"
            color="#0097A7"
            class="dialog-create-group-input"
          ></v-text-field>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#0097A7"
            text
            @click="createNewGroupDialogOpened = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="#0097A7"
            text
            @click="createNewGroup"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CollectionGroup from "@/components/collectionGroup";
import MovieQuoteCard from "@/components/movieQuoteCard";

export default {
  components: {
    CollectionGroup,
    MovieQuoteCard
  },
  data() {
    return {
      currentGroup: 0,
      createNewGroupDialogOpened: false,
      newGroupName: '',
      isEditing: false
    }
  },
  computed: {
    ...mapState(["isLogin", "collectionGroups", "collections"]),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.isLogin) {
        vm.$router.replace({name: 'SignIn'});
      }
    })
  },
  watch: {
    isLogin(val) {
      if (!val) this.$router.replace({name: 'SignIn'});
    }
  },
  methods: {
    createNewGroup() {
      this.$store.dispatch("addCollectionGroups", this.newGroupName);
    }
  }
}
</script>

<style lang="scss" scoped>
.page-collections {
  max-width: 1200px;
  padding: 16px 20px;
}

.col-left, .col-right {
  height: calc(100vh - 100px);
  overflow-y: scroll;
  background-color: rgba(#FFF, .5);
  border-radius: 4px;
  padding: 12px;
}

.col-left {
  width: 30%;

  .groups {
    background-color: transparent;

    .group-item-count {
      font-weight: 400;
    }
  }

  .btn-create-group {
    background-color: rgba(#FFF, .8);
  }
}

.col-right {
  width: 68%;
}

.fav-movie {
  &:not(:last-child) {
    margin-bottom: 12px;
  }
}

.dialog-create-group {
  &-title {
    font-weight: 700;
  }

  &-input {
    font-size: 14px;
  }
}
</style>
