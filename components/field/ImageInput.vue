<template>
  <div
    :class="['image-input', { 'image-input_active': isActive }, { 'image-input_empty': items.length === 0 }]"
    @drop.prevent="
      fileChange($event, {
        fromInput: true
      })
    "
    @dragleave.self.prevent="isActive = false"
    @dragover.prevent="isActive = true"
    @dragenter.self.prevent="isActive = true"
  >
    <draggable v-if="items.length" class="image-input__grid" tag="div" :list="items" handle=".icon-drag" @update="onDraggableUpdate">
      <div v-for="(item, index) in items" :key="item.id" class="file-item">
        <slot name="item" :data="item" :index="index" :remove="removeBlock">
          <div v-if="index === 0" class="file-item__header">
            <Tooltip event="click" class="file-item__header-tooltip">
              <template #handler>
                <span class="file-item__header-span">Главное фото</span>
              </template>
              <template #content>
                Это фото будет использоваться для карточек в каталоге товаров, также оно будет стоят первым на странице продукта и во всех
                остальных местах будет использоваться как главная фотография, которая описывает товар.
              </template>
            </Tooltip>
          </div>
          <div class="file-item__wrap">
            <img :src="item.url" class="file-item__img" />
          </div>
          <div class="file-item__bottom">
            <div class="file-item__name">
              {{ item.name }}
            </div>
            <div class="icon-drag icon-drag_hover file-item__icon" />
            <div class="icon-bin icon-bin_hover file-item__icon" @click="removeBlock(index)" />
          </div>
        </slot>
      </div>
    </draggable>
    <div v-else class="image-input__desc">
      <img src="~/assets/img/icon/file-img.svg" class="image-input__img" />
      <div class="image-input__text grey-text">
        {{ text }}
      </div>
    </div>
    <Note v-if="error" class="p mb-15" theme="reddish">
      <template v-if="typeError === 'object'">
        <ul class="dash-list">
          <template v-for="err in error">
            <li v-for="(err2, index) in err" :key="index" class="dash-list__item">
              {{ err2 }}
            </li>
          </template>
        </ul>
      </template>
      <template v-else>
        {{ error }}
      </template>
    </Note>
    <div class="image-input__wrapper">
      <label class="image-input__title">
        <input
          type="file"
          class="image-input__input"
          multiple="multiple"
          :accept="type"
          @focus="isActive = true"
          @change="
            fileChange($event, {
              fromInput: false
            })
          "
          @blur="isActive = false"
        />
        <div class="image-input__title-hidden">
          <template v-if="loading">
            <div class="image-input__icon image-input__icon_loading mr-4" />
            Идёт загрузка фото
          </template>
          <template v-else>
            <div class="image-input__icon image-input__icon_load mr-4" />
            Выберите или перетащите фото
          </template>
        </div>
      </label>
      <div class="image-input__title-visible">
        <div class="image-input__icon image-input__icon_load mr-4" />
        Выберите или перетащите фото
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { Note, Tooltip } from '...'
export default {
  name: 'ImageInput',
  components: {
    draggable,
    Note,
    Tooltip
  },
  props: {
    images: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: Array,
      default() {
        return ['image/png', 'image/jpeg', 'image/WebP']
      }
    },
    maxFileSize: {
      type: Number,
      default: Infinity
    },
    text: {
      type: String,
      default: 'Загрузите фото'
    }
  },
  data() {
    return {
      isActive: false,
      items: this.images,
      loading: false,
      error: false
    }
  },
  computed: {
    typeError() {
      return typeof this.error
    }
  },
  methods: {
    fileChange(e, { fromInput }) {
      const tempArr = []
      const files = fromInput ? e.dataTransfer.files : e.target.files
      const countFiles = this.items?.length + files?.length // количество фоток с учетом выбранных

      Array.from(files).forEach((file, index, arr) => {
        if (file.size <= this.maxFileSize && this.type.includes(file.type) && countFiles <= 10) {
          this.error = false
          this.onLoadFile({ file, arr, tempArr, index, files })
        } else {
          this.isActive = false
          // Вывод самой ошибки
          if (file.size >= this.maxFileSize) {
            this.error = 'Максимальный размер фото 2 МБ'
          } else if (!this.type.includes(file.type)) {
            this.error = 'Данный формат не поддерживается'
          } else {
            this.error = 'Максимальное количество фоток не должно превышать 10'
          }
        }
      })
    },
    onLoadFile({ file, arr, tempArr, index, files } = {}) {
      const reader = new FileReader()
      reader.onload = () => {
        tempArr.push({ name: file.name, url: reader.result, id: null })
        if (index === arr.length - 1) {
          this.onReaderLoad(tempArr, files)
        }
      }
      try {
        reader.readAsDataURL(file)
      } catch (e) {
        this.error = e.response.data.errors || 'Возникла ошибка при загрузке фотографии, попробуйте загрузить фото повторно'
        this.isActive = false
      }
    },
    async onReaderLoad(tempArr, files) {
      try {
        this.items = this.items.concat(tempArr)
        this.loading = true
        this.$emit('loading', this.loading)
        const { images } = await this.$api.product.sendImage({ images: files })
        this.items.forEach((item, index) => {
          if (!item.id) {
            this.$set(this.items[index], 'id', images.shift())
          }
        })
        const arrId = this.items.map((el) => el.id)
        this.isActive = false
        this.loading = false
        this.$emit('change', arrId)
        this.$emit('loading', this.loading)
      } catch (e) {
        this.error = e.response.data.errors || 'Возникла ошибка при загрузке фотографии, попробуйте загрузить фото повторно'
        this.loading = false
        this.isActive = false
        this.$emit('loading', this.loading)
      }
    },
    async onDraggableUpdate() {
      const arrId = await this.items.map((el) => el.id)
      this.isActive = false
      await this.$emit('change', arrId)
    },
    removeBlock(index) {
      try {
        this.error = false
        this.$api.product.deleteImage(this.items[index].id)
        const arr = this.items.map((el) => el.id)
        const arrId = arr.filter((item) => item !== this.items[index].id)
        this.items.splice(index, 1)
        this.$emit('change', arrId)
      } catch (e) {
        this.error = e.response.data.errors || 'Возникла ошибка'
        this.isActive = false
      }
    }
  }
}
</script>

<style lang="postcss">
.image-input {
  width: 100%;
  padding: 12px;
  background-color: #f9f9f9;
  border: 1px solid transparent;
  &_active {
    border: 1px solid #0e49fb;
  }
  &_empty {
    position: relative;
    &:hover {
      ^^&__wrapper {
        color: #eb0010;
        transition: color 0.2s ease-out;
      }
      ^^&__icon {
        background-image: svg-load('./icon/load.svg', fill=#eb0010);
        transition: background-image 0.2s ease-out;
      }
    }
    ^&__title {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }
    ^&__title-hidden {
      display: none;
    }
    ^&__title-visible {
      display: block;
    }
  }
  &__title-visible {
    display: none;
  }
  &__desc {
    padding: 65px 0 58px;
  }
  &__img {
    display: block;
    width: 90px;
    max-height: 100%;
    margin: 0 auto 12px;
  }
  &__text {
    font-weight: 500;
    max-width: 300px;
    width: 100%;
    margin: 0 auto;
    font-size: 21px;
    line-height: 27px;
    text-align: center;
  }
  &__wrapper {
    font-weight: 500;
    display: block;
    border-top: 1px solid #eaeaea;
    padding: 12px 0 2px;
    font-size: 16px;
    line-height: 21px;
    text-align: center;
    margin: 0 -12px;
  }
  &__icon {
    position: relative;
    display: inline-block;
    width: 18px;
    height: 18px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 16px;
    vertical-align: top;
    &_load {
      background-image: url('~@/assets/img/icon/load.svg');
    }
    &_loading {
      top: 1px;
      background-image: svg-load('./icon/grid-loader.svg', fill=#000);
    }
  }
  &__input {
    z-index: -10;
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    position: absolute;
    &:focus .image-input__text {
      color: red;
    }
  }
  &__title {
    cursor: pointer;
    &:hover {
      color: #eb0010;
      transition: color 0.2s ease-out;
      ^^&__icon_load {
        background-image: svg-load('./icon/load.svg', fill=#eb0010);
        transition: background-image 0.2s ease-out;
      }
      ^^&__icon_loading {
        background-image: svg-load('./icon/grid-loader.svg', fill=#eb0010);
        transition: background-image 0.2s ease-out;
      }
    }
  }
  &__grid {
    display: flex;
    flex-wrap: wrap;
  }
}
.file-item {
  display: flex;
  flex-direction: column;
  width: calc(25% - 8px);
  height: 257px;
  padding: 10px;
  background-color: #fff;
  border-radius: 3px;
  margin: 0 10px 15px 0;
  &:first-child {
    border: 1px solid #4584e5;
  }
  &:nth-child(4n + 4) {
    margin-right: 0;
  }
  &__wrap {
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 173px;
    flex-shrink: 0;
    padding: 0 7px;
  }
  &__header {
    text-align: center;
    color: #3b5ae0;
    font-size: 11px;
    line-height: 15px;
    position: relative;
    top: -6px;
    &-tooltip {
      text-align: left;
    }
    &-span {
      border-bottom: 1px dashed #daddeb;
    }
  }
  &__img {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
  &__bottom {
    display: flex;
    margin-top: auto;
    flex-shrink: 0;
    font-size: 12px;
    line-height: 17px;
    text-align: left;
  }
  &__name {
    display: block;
    flex: 1;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__icon {
    flex-shrink: 0;
    cursor: pointer;
    margin-left: 12px;
  }
}
</style>
