<template>
  <div class="category-select-item">
    <div class="category-select-item__list">
      <div
        v-for="item in items"
        :key="+item.id"
        :class="[
          'category-select-item__item',
          {
            'category-select-item__item_nested': item.children === true || (item.children && item.children.length)
          }
        ]"
      >
        <span
          :class="['category-select-item__link', { 'category-select-item__link_active': +item.id === activeIndex }]"
          @click="$emit('select', item.id)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategorySelectItem',
  props: {
    items: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      default: null
    }
  }
}
</script>

<style lang="postcss" scoped>
.category-select-item {
  overflow: hidden;
  width: 25%;
  min-width: 25%;
  border-right: 1px solid #e5e5e5;
  &__list {
    position: relative;
    padding: 5px 0 19px;
    /* Временно изменено */
    /* padding: 10px 0 19px; */
    max-height: 340px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &__item_nested &__link {
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
    &:hover:after,
    &_active:after {
      background-image: svg-load('./icon/arrow-right.svg', fill=#eb0010);
      transition: background-image 0.2s ease-out;
    }
  }
  &__link {
    position: relative;
    color: #000;
    text-decoration: none;
    font-size: 14px;
    line-height: 19px;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 1;
    padding: 7px 30px 7px 15px;
    &:hover {
      color: #eb0010;
      transition: color 0.2s ease-out;
    }
    &_active {
      color: #eb0010;
      transition: color 0.2s ease-out;
    }
  }
}
</style>
