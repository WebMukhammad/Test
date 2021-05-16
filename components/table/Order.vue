<template>
  <div class="order">
    <div class="order__title">{{ declOfNumGoods(product.length) }}</div>
    <div v-if="product.length" class="order__product-list">
      <div v-for="p in product" :key="p.id" class="order__product-item">
        <div class="order__product-item-col">
          <div class="order__product-img-wrap">
            <img class="order__product-img" :src="p.photo ? p.photo : require('~/assets/img/icon/no-photo.svg')" alt="" />
          </div>
        </div>
        <div class="order__product-item-col">
          <div class="order__product-title">{{ p.name }}</div>
          <div class="order__product-price">{{ convertSum(p.price) }}₽</div>
          <div class="order__product-characteristic">{{ p.quantity }} шт.</div>
        </div>
      </div>
    </div>
    <div class="order__title mt-21">Информация о {{ getOrderText(status.name, 'заказе', 'возврате') }}</div>
    <div class="order-list mt-2">
      <div class="order-list__row">
        <div class="order-list__prop">Номер:</div>
        <div class="order-list__value">{{ number }}</div>
      </div>
      <div class="order-list__row">
        <div class="order-list__prop">Дата {{ getOrderText(status.name, 'заказа', 'возврата') }}:</div>
        <div class="order-list__value">{{ date }}</div>
      </div>
      <div class="order-list__row">
        <div class="order-list__prop">Статус:</div>
        <div class="order-list__value">{{ status.title }}</div>
      </div>
    </div>
    <div class="order-list-total__row mt-21">
      <div class="order-list-total__prop order-list-total__prop-bold">Сумма:</div>
      <div class="order-list-total__value order-list-total__value-bold">{{ convertSum(amount) }}₽</div>
    </div>
  </div>
</template>

<script>
import declOfNum from '../../helper/declOfNum'
export default {
  name: 'Order',
  props: {
    product: {
      type: Array,
      default() {
        return []
      }
    },
    amount: {
      type: String,
      default: '-'
    },
    date: {
      type: String,
      default: '-'
    },
    number: {
      type: String,
      default: '-'
    },
    status: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    declOfNumGoods(el) {
      return el + ' ' + declOfNum(el, ['товар', 'товара', 'товаров'])
    },
    getOrderText(name, val1, val2) {
      return name === 'sale' ? val1 : val2
    },
    convertSum(price) {
      return Math.round(price)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
    }
  }
}
</script>

<style lang="postcss" scoped>
.order {
  background-color: #fff;
  &__sup-text {
    font-size: 12px;
    line-height: 16px;
    color: #8616b8;
    margin-bottom: 4px;
  }
  &__title {
    font-weight: 500;
    font-size: 20px;
    line-height: 23px;
    margin-bottom: 10px;
    color: #1a1a1a;
  }
  &__product {
    &-item {
      display: flex;
      border-top: 1px solid #f3f3f3;
      padding: 9px 0 3px;
      &-col:first-child {
        margin-right: 8px;
        flex-shrink: 0;
      }
      &:last-child {
        border-bottom: 1px solid #f3f3f3;
      }
    }
    &-img {
      max-width: 100%;
      max-height: 100%;
      margin: auto;
      display: block;
      &-wrap {
        width: 58px;
        height: 58px;
      }
    }
    &-title {
      font-size: 14px;
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      display: -moz-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      -moz-box-orient: vertical;
      box-orient: vertical;
    }
    &-price {
      font-weight: 500;
      font-size: 13px;
      line-height: 15px;
      margin-top: 2px;
    }
    &-characteristic {
      display: flex;
      font-size: 13px;
      line-height: 15px;
      margin-top: 4px;
    }
    &-circle-block {
      position: relative;
      top: 3px;
      width: 9px;
      height: 9px;
      margin-right: 4px;
      background: #f81557;
      border-radius: 50%;
    }
  }
  &-list {
    &__row {
      display: flex;
      border-top: 1px solid #f3f3f3;
      padding: 4px 0 10px;
      font-size: 13px;
      line-height: 17px;
      &:last-child {
        border-bottom: 1px solid #f3f3f3;
      }
    }
    &__prop {
      color: #7d7d7d;
      margin-right: 8px;
      width: 150px;
    }
    &__value {
      color: #1a1a1a;
    }
  }
  &-list-total {
    background: #fffae5;
    overflow: hidden;
    border-radius: 4px;
    padding: 13px 15px 20px;
    &__row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 17px;
      /* &:last-child { вернем когда появятся еще элементы в блоке цены
        margin: 10px 0 0;
      } */
    }
    &__prop {
      margin-right: 8px;
      width: 150px;
    }
    &__value {
      color: #1a1a1a;
    }
    &__prop-bold,
    &__value-bold {
      font-weight: 500;
      font-size: 20px;
      line-height: 23px;
      color: #1a1a1a;
    }
  }
}
</style>
