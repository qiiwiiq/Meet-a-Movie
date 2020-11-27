<template>
  <span>
    <v-btn
      v-if="outlinedBtn"
      icon
      small
      outlined
      @click="filterSettingDialogOpened = true"
    >
      <v-icon small>mdi-tune</v-icon>
    </v-btn>
    <v-btn
      v-else
      fab
      x-small
      @click="filterSettingDialogOpened = true"
    >
      <v-icon>mdi-tune</v-icon>
    </v-btn>
    <v-dialog v-model="filterSettingDialogOpened" width="450" persistent>
      <ActionsDialog
        :showCloseBtn="true"
        :actionTitle="'Setting Filter'"
        :actionText1="'Reset'"
        :actionText2="'OK'"
        @close="filterSettingDialogOpened = false"
        @action1="reset"
        @action2="filter"
      >
        <div class="px-6">
          <div class="form-item-title">Publish Year</div>
          <div class="d-flex align-center mt-1 mb-4">
            <v-select
              v-model="yearFrom"
              :items="yearFromOptions"
              :color="mainColor"
              :menu-props="{ bottom: true, offsetY: true }"
              dense
              outlined
              hide-details
            ></v-select>
            <span class="dash mx-2"></span>
            <v-select
              v-model="yearTo"
              :items="yearToOptions"
              :color="mainColor"
              :menu-props="{ bottom: true, offsetY: true }"
              dense
              outlined
              hide-details
            ></v-select>
          </div>
          <div class="form-item-title">Movie Genre</div>
          <div class="d-flex flex-wrap">
            <div v-for="(genre, index) in genreOptions" :key="index" class="genre">
              <v-checkbox
                dense
                v-model="selectedGenres"
                :label="genre"
                :value="genre"
                :color="mainColor"
                :ripple="false"
                hide-details
                class="mt-0 pt-0 mr-6"
              ></v-checkbox>
            </div>
          </div>
        </div>
      </ActionsDialog>
    </v-dialog>
  </span>
</template>

<script>
import ActionsDialog from "@/components/actionsDialog";
import { mixin } from "@/utils/mixin";

export default {
  props: {
    outlinedBtn: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ActionsDialog,
  },
  mixins: [mixin],
  data() {
    return {
      filterSettingDialogOpened: false,
      yearFrom: null,
      yearTo: null,
      selectedGenres: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      const lsYearFrom = +localStorage.getItem("yearFrom");
      const lsYearTo = +localStorage.getItem("yearTo");
      const lsSelectedGenres = localStorage.getItem("selectedGenres");
      this.yearFrom = lsYearFrom ? lsYearFrom : null;
      this.yearTo = lsYearTo ? lsYearTo : null;
      this.selectedGenres = lsSelectedGenres ? lsSelectedGenres.split(",") : [];
    });
  },
  computed: {
    yearFromOptions() {
      let options = [];
      const lastOption = this.yearTo ? this.yearTo : null;
      if (lastOption) {
        for (let i = lastOption; i >= (lastOption - 9); i--) {
          options.push(i);
        }
      } else {
        for (let i = this.minYear; i <= this.currentYear; i++) {
          options.unshift(i);
        }
      }
      return options;
    },
    yearToOptions() {
      let options = [];
      const firstOption = this.yearFrom ? this.yearFrom : null;
      if (firstOption) {
        for (let i = firstOption; i <= (firstOption + 9); i++) {
          options.unshift(i);
        }
      } else {
        for (let i = this.minYear; i <= this.currentYear; i++) {
          options.unshift(i);
        }
      }
      return options;
    }
  },
  methods: {
    commitQuoteFilterParams() {
      this.$store.commit("setQuoteFilter", {
        yearFrom: this.yearFrom,
        yearTo: this.yearTo,
        genres: this.selectedGenres
      });
    },
    reset() {
      this.yearFrom = null;
      this.yearTo = null;
      this.selectedGenres = [];
      localStorage.clear();
      this.commitQuoteFilterParams();
    },
    filter() {
      localStorage.setItem('yearFrom', this.yearFrom);
      localStorage.setItem('yearTo', this.yearTo);
      localStorage.setItem('selectedGenres', this.selectedGenres);
      this.commitQuoteFilterParams();
      this.filterSettingDialogOpened = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.dash {
  background-color: grey;
  width: 15px;
  height: 1px;
}

.genre {
  width: 130px;
}
</style>