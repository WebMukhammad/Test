<template>
  <div class="category-select-item-search">
    <div class="category-select-item-search__list">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="['category-select-item-search__item', { 'category-select-item-search__item_active': +item.id === activeIndex }]"
        @click="$emit('select', item.id)"
      >
        <span class="category-select-item-search__name">
          {{ item.name }}
        </span>
        <div v-if="item.tree && item.tree.length" class="category-select-item-search__parents">
          <span v-for="(tree, idx) in item.tree" :key="+tree.id"> {{ getName(tree.name, item.tree[idx + 1]) }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategorySelectItemSearch',
  props: {
    items: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      default: null
    }
  },
  methods: {
    getName(name, item) {
      return `${name} ${item ? '»' : ''}`
    }
  }
}
</script>

<style lang="postcss" scoped>
.category-select-item-search {
  overflow: hidden;
  width: 100%;
  &__list {
    position: relative;
    padding: 9px 0 19px;
    max-height: 340px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &__item {
    padding: 8px 5px 8px 19px;
    cursor: pointer;
    &_active {
      ^^&__name {
        color: #eb0010;
        transition: color 0.2s ease-out;
        &:after {
          background-image: svg-load('./icon/arrow-right.svg', fill=#eb0010);
          transition: background-image 0.2s ease-out;
        }
      }
    }

    &:hover {
      transition: background-color 0.2s ease-out;
      background-color: #fffae5;
    }
  }
  &__name {
    position: relative;
    color: #000;
    text-decoration: none;
    font-size: 14px;
    line-height: 17px;
    display: flex;
    align-items: center;
    z-index: 1;
    &:after {
      content: '';
      position: absolute;
      right: 10px;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      width: 11px;
      height: 11px;
      margin-left: 5px;
      background-image: url('~@/assets/img/icon/arrow-right.svg');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  &__parents {
    font-size: 11px;
    line-height: 14px;
    color: #818181;
  }
}
</style>
