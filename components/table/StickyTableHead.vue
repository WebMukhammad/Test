<template>
  <div class="table-sticky" :style="{ top: top + 'px' }">
    <Checkbox v-if="globalCheckbox" class="table-sticky__checkbox" :checked="globalCheckboxState" @change="onCheckboxChange($event)" />
    <template v-for="el in cols">
      <div
        v-if="el.checked && el.filledToViewport"
        :key="el.name"
        :class="[
          'table-sticky__col',
          { 'table-sticky__col_icon': el.sort },
          { 'table-sticky__col_selected': activeSortEl === `${el.sort}-desc` },
          {
            'table-sticky__col_selected-asc': activeSortEl === `${el.sort}-asc`
          }
        ]"
        :style="{ minWidth: `${el.minWidth}px` }"
        @click="el.sort && sort(el.sort)"
      >
        {{ el.title }}
        <div :class="{ 'table-sticky__col-icon': el.sort }" />
      </div>
    </template>
    <ToggleHover class="table-sticky__setting" toggle-parent-class="table-sticky__setting_active">
      <span class="table-sticky__cols-count"> {{ activeColumnCount }} / {{ cols.length }} </span>
      <div class="icon-setting" />
      <Popup class="popup_setting table-sticky__popup">
        <div class="popup__header-text">Колонки</div>
        <draggable v-model="colsCopy" @end="onDragEnd">
          <div v-for="(item, index) in colsCopy" :key="item.name" class="popup-list__item">
            <Checkbox
              class="popup-list__checkbox table-sticky__popup-checkbox"
              :checked="item.checked"
              :disabled="item.checked && activeColumnCount === 1"
              @change="onColumnChange($event, index)"
            >
              {{ item.title }}
            </Checkbox>
          </div>
        </draggable>
      </Popup>
    </ToggleHover>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import draggable from 'vuedraggable'
import { Checkbox } from '...'

export default {
  name: 'StickyTableHead',
  components: {
    draggable,
    Checkbox
  },
  props: {
    globalCheckbox: {
      type: Boolean,
      default: true
    },
    globalCheckboxState: {
      type: Boolean,
      default: false
    },
    cols: {
      type: Array,
      required: true
    },
    top: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      colsCopy: this.cols,
      activeSortEl: null
    }
  },
  computed: {
    activeColumnCount() {
      let count = 0
      this.cols.forEach((el) => {
        if (el.checked && el.filledToViewport) {
          count += 1
        }
      })
      return count
    }
  },
  watch: {
    cols(val) {
      this.colsCopy = val
    }
  },
  created() {
    this.sort = debounce(this.sort, 400)
  },
  methods: {
    onCheckboxChange(state) {
      this.$emit('checkboxChange', state)
    },
    onColumnChange(state, index) {
      this.colsCopy[index].checked = state
      this.$emit('columnChange', this.colsCopy)
    },
    sort(name) {
      if (this.activeSortEl === `${name}-desc`) {
        this.activeSortEl = `${name}-asc`
        this.$emit('sort', name, 'desc')
      } else {
        this.activeSortEl = `${name}-desc`
        this.$emit('sort', name, 'asc')
      }
    },
    onDragEnd() {
      this.$emit('columnChange', this.colsCopy)
    },
    getActiveColumns(arr) {
      const a = []
      arr.forEach((el) => {
        if (el.checked) {
          a.push(el)
        }
      })
      return a
    }
  }
}
</script>

<style lang="postcss" scoped>
.table-sticky {
  z-index: 2;
  position: sticky;
  top: 66px;
  border-bottom: 1px solid #f3f3f3;
  display: flex;
  font-size: 13px;
  line-height: 14px;
  padding: 10px 15px 5px;
  color: #818181;
  background-color: #fff;
  &__col {
    display: flex;
    padding-right: 15px;
    flex: 1;
    flex-shrink: 0;
    cursor: pointer;
    &_selected,
    &_icon:hover,
    &_selected-asc {
      color: #e30614;
      ^&-icon {
        background-image: svg-load('./icon/arrow-down.svg', fill=#E30614);
      }
    }
    &_icon:hover {
      transition: color 0.2s ease-out;
      ^&-icon {
        transition: background-image 0.2s ease-out;
      }
    }
    &_selected-asc &-icon {
      transform: rotate(-180deg);
    }
    &-icon {
      position: relative;
      top: 2px;
      display: inline-block;
      width: 10px;
      height: 12px;
      flex-shrink: 0;
      background-image: url('~@/assets/img/icon/arrow-down.svg');
      background-size: contain;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      vertical-align: top;
      margin-left: 4px;
    }
  }
  &__cols-count {
    position: relative;
    top: -3px;
    left: -2px;
  }
  &__checkbox {
    flex-shrink: 0;
    min-width: 30px;
    width: 30px;
    padding-right: 11px;
    position: relative;
    top: -2px;
  }
  &__popup-checkbox {
    padding: 3px 11px;
  }
  &__setting {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    width: 60px;
    cursor: pointer;
    text-align: right;
    &_active {
      z-index: 2;
      ^^&__popup {
        display: block;
      }
    }
  }
}
</style>
