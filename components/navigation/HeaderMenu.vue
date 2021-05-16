<template>
  <div class="header-menu">
    <div class="header-menu__item">
      <ToggleHover class="header-menu__item-wrap" toggle-parent-class="header-menu__item-wrap_active">
        <nuxt-link to="/product" class="header-menu__item-link">
          <div class="header-menu__icon header-menu__icon_product" />
          Товары
          <div class="header-menu__icon-arrow" />
        </nuxt-link>
        <Popup>
          <div class="popup-list">
            <nuxt-link to="/product" class="popup-list__item popup-list__item_selected"> Список товаров </nuxt-link>
            <nuxt-link to="/product/create" class="popup-list__item"> Добавление </nuxt-link>
            <nuxt-link to="/xls" class="popup-list__item"> Импорт из XLS </nuxt-link>
          </div>
        </Popup>
      </ToggleHover>
    </div>
    <nuxt-link to="/order" class="header-menu__item">
      <div class="header-menu__icon header-menu__icon_cash" />
      Заказы
    </nuxt-link>
    <nuxt-link to="/bill" class="header-menu__item">
      <div class="icon-new icon-new_white header-menu__icon header-menu__icon_bill" />
      Расчеты
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'HeaderMenu'
}
</script>

<style lang="postcss" scoped>
.header-menu {
  display: flex;
  align-items: center;
  &__icon {
    width: 16px;
    height: 16px;
    background-position: 50% 50%;
    background-size: 16px;
    background-repeat: no-repeat;
    background-size: auto 16px;
    margin-right: 7px;
    flex-shrink: 0;
    display: inline-block;
    position: relative;
    top: 1px;
    &_product {
      background-image: url('~@/assets/img/icon/product.svg');
    }
    &_cash {
      background-image: url('~@/assets/img/icon/cash.svg');
    }
    &_bill {
      background-image: url('~@/assets/img/icon/bill.svg');
    }
    &_news {
      background-image: url('~@/assets/img/icon/news.svg');
    }
    &_equalizer {
      background-image: url('~@/assets/img/icon/equalizer.svg');
    }
    &-arrow {
      position: relative;
      top: 1px;
      display: inline-block;
      width: 8px;
      height: 8px;
      background-image: url('~@/assets/img/icon/arrow.svg');
      background-position: 50% 50%;
      background-repeat: no-repeat;
      margin-left: 5px;
      flex-shrink: 0;
    }
  }
  &__item {
    position: relative;
    z-index: 4;
    display: flex;
    align-items: center;
    font-weight: 500;
    color: #ffffff;
    text-decoration: none;
    padding: 9px 0;
    margin-right: 27px;
    &:last-child {
      margin-right: 0;
    }
    &-link {
      color: #fff;
      text-decoration: none;
    }
    &-wrap {
      display: flex;
      align-items: center;
      &_active {
        color: #000;
        ^^^&__icon_product {
          background-image: svg-load('./icon/product.svg', fill=#E30613);
        }
        ^^^&__icon-arrow {
          background-image: svg-load('./icon/arrow.svg', fill=#000);
        }
        ^^^&__item-link {
          color: #000;
        }
        & .popup {
          display: block;
        }
      }
    }
  }
}
</style>
