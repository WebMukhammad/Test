<template>
  <div class="header">
    <nuxt-link to="/product" class="logo mr-31">
      <img srcset="~/assets/img/logo.png, ~/assets/img/logo@2x.png 2x" src="~/assets/img/logo.png" class="logo__img mr-18" alt="" />
      Тест
    </nuxt-link>
    <!-- <label class="header-input mr-31">
      <div class="header-input__icon icon-search" />
      <input
        type="text"
        class="header-input__input"
        placeholder="Поиск по тесту"
      >
    </label>
    -->
    <HeaderMenu class="mr-10" product-page />
    <div class="header__auth ml-auto">
      <UserAuth />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="postcss" scoped>
.header {
  height: 72px;
  padding: 15px 10px;
  background-color: #242424;
  display: flex;
  font-size: 17px;
  line-height: 23px;
  align-items: center;
  &-input {
    position: relative;
    display: block;
    max-width: 313px;
    width: 100%;
    &__input {
      border-radius: 19px;
      background-color: #000;
      border: none;
      color: #fff;
      outline: none;
      height: 38px;
      padding: 5px 15px;
      width: 100%;
      &::placeholder {
        color: #b9b9b9;
      }
    }
    &__icon {
      left: 14px;
      &,
      &-right {
        z-index: 2;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: text;
      }
      & + ^&__input {
        padding-left: 37px;
      }
      &-right {
        right: 14px;
        & + ^^&__input {
          padding-right: 37px;
        }
      }
    }
  }
}
.logo {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #ffffff;
  text-decoration: none;
  height: 41px;
  &__img {
    max-width: 100%;
    max-height: 100%;
    flex-shrink: 0;
  }
}
</style>
