<template>
  <div class="d-flex justify-center h-100">
    <div class="page-collections w-100">
      <div class="col-left">
        <div class="col-left-header d-flex align-center">
          <div class="collection-lists--mobile align-center">
            <v-select
              dense
              hide-details
              v-model="currentListId"
              :items="collectionLists"
              item-text="name"
              item-value="id"
              item-color="blue-grey"
              :menu-props="{ bottom: true, offsetY: true }"
              class="lists-selector mr-2"
              color="#333"
              solo
              flat
              prepend-inner-icon="mdi-sort-variant"
            ></v-select>
            <EditListBtn :list="collectionLists[currentList]" class="mr-1" />
            <DeleteListBtn :list="collectionLists[currentList]" />
          </div>
          <v-btn
            small
            rounded
            :icon="windowWidth <= 450"
            outlined
            color="#333"
            class="btn-create-list"
            @click="createNewListDialogOpened = true"
          >
            <span v-if="windowWidth > 768">Create New List</span>
            <span v-else-if="windowWidth > 450">NEW</span>
            <v-icon small v-else>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div class="list-item-count--mobile caption px-2 py-1">Total {{ listCollections.length }} items</div>
        <v-list dense flat rounded class="lists px-0">
          <v-list-item-group v-model="currentList" mandatory color="#006064">
            <template v-for="list in collectionLists">
              <CollectionList :list="list" :key="list.id" />
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
        >
          Go explore some movies !
        </div>
      </div>

      <v-dialog v-model="createNewListDialogOpened" width="400" persistent>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mixin } from "@/utils/mixin";
import ActionsDialog from "@/components/actionsDialog";
import CollectionList from "@/components/collectionList";
import DeleteListBtn from "@/components/deleteListBtn";
import EditListBtn from "@/components/editListBtn";
import MovieQuoteCard from "@/components/movieQuoteCard";

export default {
  mixins: [mixin],
  components: {
    ActionsDialog,
    CollectionList,
    DeleteListBtn,
    EditListBtn,
    MovieQuoteCard,
  },
  data() {
    return {
      currentList: 0,
      currentListId: "",
      createNewListDialogOpened: false,
      newListName: "",
    };
  },
  computed: {
    ...mapState(["isLogin", "user", "collectionLists", "collections"]),
    listCollections() {
      if (this.collectionLists.length > 0) {
        const listid = this.collectionLists[this.currentList].id;
        const fillteredCollections = this.collections.filter(
          (item) => item.movie.listid === listid
        );
        return fillteredCollections;
      } else {
        return [];
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.isLogin) {
        vm.$router.replace({ name: "SignIn" });
      }
    });
  },
  mounted() {
    let vm = this;
    vm.$nextTick(() => {
      if (vm.collectionLists.length > 0) {
        vm.currentListId = vm.collectionLists[vm.currentList].id;
      }
    })
  },
  watch: {
    isLogin(val) {
      if (!val) this.$router.replace({ name: "SignIn" });
    },
    createNewListDialogOpened(val) {
      if (!val) this.newListName = "";
    },
    collectionLists() {
      this.currentList = 0;
      if (this.collectionLists.length > 0) {
        this.currentListId = this.collectionLists[this.currentList].id;
      }
    },
    currentList(index) {
      this.currentListId = this.collectionLists[index].id;
    },
    currentListId(id) {
      this.currentList = this.collectionLists.findIndex(item => item.id === id);
    },
  },
  methods: {
    createNewList() {
      this.$store.dispatch("dbWriteCollectionList", {
        uid: this.user.uid,
        listName: this.newListName,
      });
      this.createNewListDialogOpened = false;
    },
    normalizeMovieObj(obj) {
      let movieObj = { ...obj };
      movieObj.cast = JSON.parse(movieObj.cast);
      movieObj.technical_specs = JSON.parse(movieObj.technical_specs);
      return movieObj;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/mixins.scss';

.page-collections {
  display: flex;
  justify-content: space-around;
  max-width: 1200px;
  margin: 16px 20px;
  padding: 12px 0;
  border-radius: 4px;
  background-color: rgba(#fff, 0.6);

  @include respond(tab-port) {
    display: block;
    margin: 0;
    border-radius: 0;
    padding: 8px 0;
  }
}

.divider {
  width: 1px;
  border-right: 1px dashed #757575;

  @include respond(tab-port) {
    display: none;
  }
}

.col-left,
.col-right {
  height: calc(var(--vh, 1vh) * 100 - 110px);
  overflow-y: scroll;
  padding: 0 12px;

  @include respond(tab-port) {
    height: unset;
  }
}

.col-left {
  width: 28%;

  @include respond(tab-port) {
    width: 100%;
  }

  &-header {
    justify-content: center;

    @include respond(tab-port) {
      justify-content: space-between;
    }
  }

  .collection-lists--mobile {
    display: none;

    @include respond(tab-port) {
      display: flex;
    }

    .lists-selector {
      width: 40vw;
      font-size: 14px;
      font-weight: 500;

      @include respond(large-mobile) {
        width: 50vw;
      }

      @include respond(mobile) {
        width: 55vw;
        font-size: 13px;
      }
    }
  }

  .list-item-count--mobile {
    display: none;

    @include respond(tab-port) {
      display: block;
    }
  }

  .lists {
    background-color: transparent;

    @include respond(tab-port) {
      display: none;
    }

    .list-item-count {
      font-weight: 400;
    }
  }

  .btn-create-list {
    background-color: rgba(#fff, 0.8);
  }
}

.col-right {
  width: 68%;

  @include respond(tab-port) {
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 140px);
  }
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

.v-select-list {
  padding: 0 !important;
}
</style>
