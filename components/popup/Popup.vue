<template>
  <div class="popup">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Popup'
}
</script>

<style lang="postcss" scoped>
.popup {
  z-index: -1;
  display: none;
  position: absolute;
  top: -1px;
  left: -17px;
  right: 0;
  width: 164px;
  font-size: 14px;
  color: #000;
  padding: 40px 0 13px;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  text-align-last: left;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.02);
  &_right {
    left: auto;
    top: -3px;
    right: -10px;
    width: 168px;
    padding: 10px 0;
  }
  &_more {
    left: auto;
    top: -8px;
    right: -12px;
    width: 168px;
    font-size: 13px;
    padding: 10px 0;
    ^&-list__item {
      padding: 3px 11px;
    }
  }
  &_setting {
    width: 208px;
    left: auto;
    top: -10px;
    right: -10px;
    padding: 10px 0;
    ^&-list {
      &__item {
        padding: 0;
      }
      &__checkbox {
        padding: 3px 11px;
      }
    }
  }
  &_user-auth {
    z-index: 2;
    width: 100%;
    padding: 34px 0 8px;
    top: -9px;
    left: auto;
    font-size: 13px;
    line-height: 17px;
    ^&-list__item {
      padding: 5px 15px;
    }
  }
  &-list__item {
    display: block;
    text-align: left;
    font-weight: 400;
    padding: 3px 16px;
    color: #000;
    text-decoration: none;
    &.nuxt-link-exact-active {
      color: #818181;
    }
    &:hover {
      cursor: pointer;
      background-color: #fffae5;
    }
  }
  &__header-text {
    font-size: 13px;
    line-height: 15px;
    color: #818181;
    padding: 0 30px 8px 14px;
  }
}
</style>
