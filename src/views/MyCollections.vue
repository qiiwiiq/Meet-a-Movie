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
      persistent
    >
      <ActionsDialog
        :actionTitle="'Create New Group'"
        :actionText1="'Cancel'"
        :actionText2="'Create'"
        @action1="createNewGroupDialogOpened = false"
        @action2="createNewGroup"
      >
        <div class="px-6">
          <v-text-field
            v-model="newGroupName"
            dense
            placeholder="Group Name"
            color="#0097A7"
            class="dialog-create-group-input"
          ></v-text-field>
        </div>
      </ActionsDialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ActionsDialog from "@/components/actionsDialog";
import CollectionGroup from "@/components/collectionGroup";
import MovieQuoteCard from "@/components/movieQuoteCard";

export default {
  components: {
    ActionsDialog,
    CollectionGroup,
    MovieQuoteCard
  },
  data() {
    return {
      currentGroup: 0,
      createNewGroupDialogOpened: false,
      newGroupName: '',
    }
  },
  computed: {
    ...mapState(["isLogin", "user", "collectionGroups", "collections"]),
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
    },
    createNewGroupDialogOpened(val) {
      if (!val) this.newGroupName = '';
    }
  },
  methods: {
    createNewGroup() {
      this.$store.dispatch("dbWriteCollectionGroups", {
        uid: this.user.uid,
        groupName: this.newGroupName
      });
      this.createNewGroupDialogOpened = false;
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
