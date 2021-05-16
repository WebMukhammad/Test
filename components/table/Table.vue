<template>
  <div class="table" :class="[{ table_selected: selected.length, table_loading: loading }]">
    <div class="table__wrap-col">
      <StickyTableHead
        :cols="colsCopy"
        :global-checkbox="hasSlot('tool')"
        :global-checkbox-state="globalCheckboxState"
        :top="top"
        @columnChange="onColumnChange"
        @checkboxChange="onGlobalCheckboxChange"
        @sort="sort"
      />
      <div v-if="state === 'loading'" class="table__info-block">
        <slot name="loading">
          <div class="h3 mb-8">Идет загрузка...</div>
          <div class="p mb-12">Пожалуйста, подождите</div>
        </slot>
      </div>
      <div v-else-if="state === 'error'" class="table__info-block">
        <slot name="error">
          <div class="h3 mb-8">Произошла ошибка</div>
          <div class="p mb-12">Попробуйте повторить запрос или сделать его позднее</div>
        </slot>
      </div>
      <div v-else-if="items.length === 0" class="table__info-block">
        <slot name="empty">
          <div class="h3 mb-8">Нет элементов</div>
          <div class="p mb-12">Сбросьте фильтры или добавьте новый элемент</div>
        </slot>
      </div>
      <div v-else class="table__wrap-list">
        <div
          v-for="item in items"
          :key="item.id"
          :class="[
            'table__list',
            {
              table__list_marked: +routeID === +item.id
            },
            { table__list_interactive: interactive }
          ]"
          @click="description(item.id)"
        >
          <div v-if="hasSlot('tool')" class="table__checkbox-wrap">
            <Checkbox
              name="count"
              :checked="getActiveID(item.id)"
              :disabled="['yml', 'yaml'].some((el) => el === item.imported)"
              @change="onItemSelect($event, item.id, item)"
            />
          </div>
          <template v-for="col in colsCopy">
            <div v-if="col.filledToViewport && col.checked" :key="col.name" class="table__col" :style="{ minWidth: `${col.minWidth}px` }">
              <slot :id="item.id" :item="item" :data="item[col.name]" :notEmpty="notEmptyColumn(item[col.name])" :name="col.name">
                <template v-if="notEmptyColumn(item[col.name])">
                  {{ item[col.name] }}
                </template>
                <div v-else class="table__empty-col">-</div>
              </slot>
            </div>
          </template>
          <div class="table__more-wrapper">
            <slot v-if="$scopedSlots.more" :id="item.id" :item="item" :resetItemSelected="resetItemSelected" name="more" />
          </div>
        </div>
      </div>
      <div v-if="selected.length" class="table__selected-fixed">
        <slot name="tool" :selected="selected" :resetSelected="resetSelected" :selectedState="selectedState" />
        <div class="ml-auto" @click="resetSelected">
          <Button theme="transparent" size="h-33" class="table__selected-fixed-button" icon="back"> Сбросить выбор </Button>
        </div>
      </div>
    </div>
    <div v-if="$slots.description && descriptionStateInner === 'active'" class="table__wrap-col table__wrap-col_w-455">
      <div class="table__wrap-col-sticky">
        <slot name="description" />
      </div>
    </div>
    <div v-else-if="$slots.descriptionDefault" class="table__wrap-col table__wrap-col_w-455">
      <div class="table__wrap-col-sticky">
        <slot name="descriptionDefault" />
      </div>
    </div>
  </div>
</template>

<script>
import { Checkbox, Button } from '...'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'

export default {
  name: 'Table',
  components: {
    Checkbox,
    Button
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    localSave: {
      type: Object,
      default: null
    },
    cols: {
      type: Array,
      required: true
    },
    interactive: {
      type: Boolean,
      default: false
    },
    descriptionState: {
      type: String,
      default: 'initial'
    },
    top: {
      type: String,
      default: null
    },
    scrollToSelector: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: 'visible',
      validator(val) {
        return ['visible', 'loading', 'error'].some((el) => el === val)
      }
    }
  },
  data() {
    return {
      selected: [],
      colsCopy: this.cols,
      activeDescriptionID: null,
      globalCheckboxState: false,
      descriptionStateInner: this.descriptionState,
      loading: true
    }
  },
  computed: {
    selectedState() {
      return this.selected.find((el) => el.archived === false) || false
    },
    routeID() {
      return this.$route.query.id
    }
  },
  watch: {
    descriptionState(val) {
      this.descriptionStateInner = val
    }
  },
  created() {
    this.colsCopy.forEach((el) => {
      this.$set(el, 'checked', true)
      this.$set(el, 'filledToViewport', true)
    })
  },
  mounted() {
    if (this.localSave) {
      try {
        const fromStore = JSON.parse(window.localStorage.getItem(this.localSave.name))
        if (fromStore?.version && fromStore.version !== this.localSave.version) {
          window.localStorage.removeItem(this.localSave.name)
          this.colsCopy.forEach((el) => {
            this.$set(el, 'checked', true)
            this.$set(el, 'filledToViewport', true)
          })
        } else if (fromStore?.version) {
          this.colsCopy = fromStore.cols
        } else {
          this.colsCopy.forEach((el) => {
            this.$set(el, 'checked', true)
            this.$set(el, 'filledToViewport', true)
          })
        }
      } catch (e) {
        console.log(e)
      }
    }

    this.recalculateColumnViewportVisibility = this.recalculateColumnViewportVisibility.bind(this)
    this.recalculateColumnViewportVisibility()
    window.addEventListener('resize', this.recalculateColumnViewportVisibility)
    this.loading = false
  },
  methods: {
    hasSlot(name = 'default') {
      return !!this.$slots[name] || !!this.$scopedSlots[name]
    },
    onGlobalCheckboxChange(state) {
      this.globalCheckboxState = state
      if (state) {
        this.selected = this.items.filter((el) => !['yml', 'yaml'].includes(el.imported))
      } else {
        this.selected = []
      }
    },
    resetItemSelected(id) {
      const activeindex = this.selected.findIndex((el) => el.id === id)
      if (activeindex !== -1) {
        this.selected.splice(activeindex, 1)
      }
    },
    onItemSelect(state, id, item) {
      const activeindex = this.selected.findIndex((el) => el.id === id)
      if (!state && activeindex !== -1) {
        this.selected.splice(activeindex, 1)
      } else {
        this.selected.push(item)
      }
      this.globalCheckboxState = this.selected.length === this.items.length
    },
    onColumnChange(arr) {
      this.colsCopy = arr
      this.recalculateColumnViewportVisibility()
      if (this.localSave) {
        window.localStorage.setItem(
          this.localSave.name,
          JSON.stringify({
            version: this.localSave.version,
            cols: this.colsCopy
          })
        )
      }
    },
    resetSelected() {
      this.globalCheckboxState = false
      this.selected = []
    },
    notEmptyColumn(el) {
      if (Array.isArray(el)) {
        return !!el.length
      } else if (el instanceof Object) {
        return !!Object.keys(el).length
      } else {
        return !!el
      }
    },
    recalculateColumnViewportVisibility() {
      const offset = 120
      const maxWidth = this.$el.offsetWidth - offset
      let currentWidth = 0
      let filled = false
      this.colsCopy = this.colsCopy.map((el) => {
        if (filled) {
          el.filledToViewport = false
        } else if (el.checked) {
          currentWidth += el.minWidth
          if (currentWidth > maxWidth) {
            currentWidth -= el.maxWidth
            filled = true
            el.filledToViewport = false
          } else {
            el.filledToViewport = true
          }
        } else {
          el.filledToViewport = false
        }
        return el
      })
    },
    getActiveID(id) {
      const arr = this.selected.map((el) => {
        if (el.id === id) return el.id
      })
      return arr.includes(id)
    },
    description(id) {
      if (this.$slots.description && this.interactive) {
        if (this.activeDescriptionID === id && this.descriptionStateInner === 'active') {
          this.activeDescriptionID = null
          this.descriptionStateInner = 'initial'
        } else {
          this.activeDescriptionID = id
          this.descriptionStateInner = 'active'
          this.$emit('description', id)
        }
      }
    },
    sort(name, order) {
      if (this.scrollToSelector) {
        const $el = document.querySelector(this.scrollToSelector)
        scrollIntoView($el, {
          behavior: 'smooth',
          block: 'start'
        })
      }
      this.$emit('sort', name, order)
    }
  }
}
</script>

<style lang="postcss" scoped>
.table {
  font-size: 14px;
  line-height: 21px;
  color: #000;
  background: #fff;
  display: flex;
  &_loading {
    background: url(~@/assets/img/loading.svg) no-repeat top 300px center;
    ^&__wrap-list {
      opacity: 0;
    }
  }
  &_selected {
    padding-bottom: 39px;
  }
  &__wrap-col {
    &:first-child {
      flex: 1;
    }
    &_w-455 {
      width: 455px;
      padding: 20px 23px;
      border-left: 1px solid #f3f3f3;
    }
    &-sticky {
      position: sticky;
      top: 86px;
    }
  }
  &__wrap-list {
    transition: opacity 0.2s ease-out;
    opacity: 1;
  }
  &__info-block {
    height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &__list {
    display: flex;
    padding: 7px 14px 14px;
    border-top: 1px solid #f3f3f3;
    font-size: 14px;
    line-height: 21px;
    border-bottom: none;
    &_interactive {
      cursor: pointer;
      &:hover {
        background-color: #f9f9f9;
        transition: background-color 0.2s ease-out;
      }
    }
    &:first-child {
      border-top: none;
    }
    &_marked {
      background-color: #f3fdf7;
    }
  }
  &__col {
    padding-right: 15px;
    flex: 1;
    flex-shrink: 0;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &__empty-col {
    color: #818181;
  }
  &__checkbox-wrap {
    padding-right: 11px;
    flex-shrink: 0;
    min-width: 30px;
    width: 30px;
  }
  &__img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
  }
  &__checkbox-wrap-right {
    flex-shrink: 0;
    min-width: 63px;
    flex: 1;
    margin-right: 15px;
  }
  &__more-wrapper {
    width: 60px;
    display: flex;
    justify-content: flex-end;
  }
  &__selected-fixed {
    z-index: 3;
    position: fixed;
    bottom: 0;
    left: 10px;
    right: 10px;
    padding: 13px 20px;
    border-top: 1px solid #f0ebd3;
    background-color: #fffae5;
    display: flex;
    &-button {
      font-weight: 500;
      background-color: transparent;
      border: none;
      color: #000;
    }
  }
}
</style>
