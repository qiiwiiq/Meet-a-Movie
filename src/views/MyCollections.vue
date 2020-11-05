<template>
  <div class="page-collections d-flex justify-space-between">
    <div class="col-left">
      <div class="text-center mb-2">
        <v-btn
          small
          rounded
          outlined
          color="#333"
          class="btn-create-group"
          @click="createNewGroupDialogOpened = true"
        >
          Create New Group
        </v-btn>
      </div>
      <v-list flat rounded dense class="groups px-0">
        <v-list-item-group
          v-model="currentGroup"
          mandatory
          color="#006064"
        >
          <v-list-item
            v-for="group in collectionGroups"
            :key="group.id"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ group.name }}
                <span class="group-item-count ml-1">({{countGroupItems(collections, group.id)}})</span>
              </v-list-item-title>
            </v-list-item-content>
              <v-btn icon small>
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
          </v-list-item>
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
            v-model="groupName"
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
import MovieQuoteCard from "@/components/movieQuoteCard";

export default {
  components: {
    MovieQuoteCard
  },
  data() {
    return {
      currentGroup: 0,
      createNewGroupDialogOpened: false,
      groupName: '',
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
    countGroupItems(collections, groupid) {
      const groupItems = collections.filter(item => item.groupid === groupid);
      return groupItems.length;
    },
    createNewGroup() {
      this.$store.dispatch("addCollectionGroups", this.groupName);
    }
  }
}
</script>

<style lang="scss" scoped>
.page-collections {
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
