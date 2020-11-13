<template>
  <div class="page-collections py-3 d-flex justify-space-around">
    <div class="col-left">
      <div class="text-center mb-2">
        <v-btn
          small
          rounded
          outlined
          color="#333"
          class="btn-create-list mr-2"
          @click="createNewListDialogOpened = true"
        >
          Create New List
        </v-btn>
      </div>
      <v-list dense flat rounded class="lists px-0">
        <v-list-item-group
          v-model="currentList"
          mandatory
          color="#006064"
        >
          <template v-for="list in collectionLists">
            <CollectionList
              :list="list"
              :key="list.id"
            />
          </template>
        </v-list-item-group>
      </v-list>
    </div>
    <div class="divider"></div>
    <div class="col-right">
      <div
        v-for="item in listCollections"
        :key="item.collectionId"
        class="fav-movie"
      >
        <MovieQuoteCard
          :movieObj="normalizeMovieObj(item.movie)"
          :collectionId="item.collectionId"
        />
      </div>
      <div
        v-if="listCollections.length === 0"
        class="reminder text-center mt-4"
      >Go explore some movies !</div>
    </div>

    <v-dialog
      v-model="createNewListDialogOpened"
      width="400"
      persistent
    >
      <ActionsDialog
        :actionTitle="'Create New List'"
        :actionText1="'Cancel'"
        :actionText2="'Create'"
        @action1="createNewListDialogOpened = false"
        @action2="createNewList"
      >
        <div class="px-6">
          <v-text-field
            v-model="newListName"
            dense
            placeholder="List Name"
            :color="mainColor"
            class="dialog-create-list-input"
          ></v-text-field>
        </div>
      </ActionsDialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from '@/utils/mixin';
import ActionsDialog from "@/components/actionsDialog";
import CollectionList from "@/components/collectionList";
import MovieQuoteCard from "@/components/movieQuoteCard";

export default {
  mixins: [mixin],
  components: {
    ActionsDialog,
    CollectionList,
    MovieQuoteCard
  },
  data() {
    return {
      currentList: 0,
      createNewListDialogOpened: false,
      newListName: '',
    }
  },
  computed: {
    ...mapState(["isLogin", "user", "collectionLists", "collections"]),
    listCollections() {
      if (this.collectionLists.length > 0) {
        const listid = this.collectionLists[this.currentList].id;
        const fillteredCollections = this.collections.filter(item => item.movie.listid === listid);
        return fillteredCollections;
      } else {
        return [];
      }
    }
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
    createNewListDialogOpened(val) {
      if (!val) this.newListName = '';
    }
  },
  methods: {
    createNewList() {
      this.$store.dispatch("dbWriteCollectionList", {
        uid: this.user.uid,
        listName: this.newListName
      });
      this.createNewListDialogOpened = false;
    },
    normalizeMovieObj(obj) {
      let movieObj = { ...obj };
      movieObj.cast = JSON.parse(movieObj.cast);
      movieObj.technical_specs = JSON.parse(movieObj.technical_specs);
      return movieObj;
    }
  }
}
</script>

<style lang="scss" scoped>
.page-collections {
  max-width: 1200px;
  margin: 16px 20px;
  border-radius: 4px;
  background-color: rgba(#FFF, .6);
}

.divider {
  width: 1px;
  border-right: 1px dashed #757575;
}

.col-left, .col-right {
  height: calc(100vh - 120px);
  overflow-y: scroll;
  padding: 0 12px;
}

.col-left {
  width: 28%;

  .lists {
    background-color: transparent;

    .list-item-count {
      font-weight: 400;
    }
  }

  .btn-create-list {
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

.dialog-create-list {
  &-title {
    font-weight: 700;
  }

  &-input {
    font-size: 14px;
  }
}

.reminder {
  font-weight: 300;
  color: #212121;
}
</style>
