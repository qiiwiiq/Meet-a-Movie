<template>
  <image-uploader
    class="uploader"
    :ref="id"
    :id="id"
    :debug="1"
    :maxWidth="500"
    :maxHeight="500"
    :quality="0.7"
    :autoRotate="true"
    outputFormat="file"
    :preview="true"
    :capture="false"
    accept="video/*,image/*"
    doNotResize="['gif', 'svg']"
    @input="setImage"
  >
    <label :for="id" slot="upload-label" class="file-input">
      <div v-if="!hasLogo" class="file-input-beforeupload">
        <template>
          <v-icon class="add">mdi-plus</v-icon>
          <div>Upload image</div>
        </template>
      </div>
      <div v-if="hasLogo" class="file-input-uploaded">
        <v-btn icon small class="ma-2" @click="resetImage">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </div>
    </label>
  </image-uploader>
</template>

<script>
import ImageUploader from 'vue-image-upload-resize';

export default {
  props: {
    id: {
      type: String,
      default: 'fileInput',
    },
    defaultLogo: {
      type: String,
    },
  },
  components: {
    ImageUploader,
  },
  data() {
    return {
      hasLogo: false,
    };
  },
  mounted() {
    if (this.defaultLogo) {
      this.hasLogo = true;
      console.log(this.defaultLogoUrl);
      setTimeout(() => {
        this.$refs[this.id].$el.querySelector('.img-preview').src = this.defaultLogo;
        this.$refs[this.id].$el.querySelector('.img-preview').style.display = 'block';
      }, 0);
    }
  },
  watch: {
    defaultLogo(url) {
      if (url) {
        this.hasLogo = true;
        // 使用預設圖，強迫更新套件的 scr ，因會和 hasLogo 同時更新 src 為空衝突，故預設圖的更新 src 需要放在 setTimeout 內
        setTimeout(() => {
          this.$refs[this.id].$el.querySelector('.img-preview').src = url;
          this.$refs[this.id].$el.querySelector('.img-preview').style.display = 'block';
        }, 0);
      }
    },
  },
  methods: {
    setImage: function (file) {
      this.hasLogo = true;
      this.$refs[this.id].$el.querySelector('.img-preview').style.display = 'block';
      this.$emit('setImage', file);
      // file 為 File 物件，可能如下
      //       {
      //         lastModified: 1600159234000,
      //         lastModifiedDate: 'Tue Sep 15 2020 16:40:34 GMT+0800 (台北標準時間)',
      //         name: 'ic_active.png',
      //         size: 1235,
      //         type: 'image/png',
      //         webkitRelativePath: ''
      //       }
    },
    resetImage: function () {
      this.hasLogo = false;
      this.$refs[this.id].$el.querySelector('.img-preview').style.display = 'none';
      this.$emit('resetImage');
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/mixins.scss';

.uploader {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;

  &-beforeupload {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    & .add {
      margin-bottom: 19%;
    }
  }

  &-uploaded {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<style>
.fileinput {
  display: none;
}
</style>