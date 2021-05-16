<template>
  <div class="product-prorerty">
    <div class="product-prorerty__row">
      <div class="product-prorerty__block">
        <div class="product-prorerty__bg" />
      </div>
      <div class="product-prorerty__block">
        <h5 class="product-prorerty__title h5">Нет нужных свойств?</h5>
        <div class="product-prorerty__add-property" @click="onClick">
          Добавьте свои
          <div class="product-prorerty__add-property-arrow" />
        </div>
      </div>
    </div>
    <div v-show="isActiveProrerty" class="product-prorerty__properties">
      <Form>
        <FormElement title="Название свойства:">
          <InputText v-model="inputVal" />
        </FormElement>
        <FormElement title="Значение:">
          <InputText v-model="inputVal" />
        </FormElement>
        <FormElement title="К какой группе принадлежит:">
          <Select v-model="selectVal" :data="selectItems" />
        </FormElement>
        <FormElement>
          <Button>Добавить новое свойсто</Button>
        </FormElement>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, FormElement, InputText, Select, Button } from '...'

export default {
  name: 'ProductProrerty',
  components: {
    Form,
    FormElement,
    InputText,
    Select,
    Button
  },
  data() {
    return {
      inputVal: null,
      selectVal: null,
      isActiveProrerty: false,
      selectItems: [
        { name: 'Значение 1', value: '1' },
        { name: 'Значение 2', value: '2' },
        { name: 'Значение 2', value: '3' }
      ]
    }
  },
  methods: {
    onClick() {
      this.isActiveProrerty = !this.isActiveProrerty
    }
  }
}
</script>

<style lang="postcss" scoped>
.product-prorerty {
  background-color: #fffae4;
  padding: 16px 29px 0;
  &__row {
    display: flex;
  }
  &__block {
    &:last-child {
      margin-left: 25px;
    }
  }
  &__bg {
    width: 67px;
    height: 85px;
    background-image: url('~@/assets/img/icon/noun-creative.svg');
    background-repeat: no-repeat;
    background-size: contain;
  }
  &__title {
    margin-top: 10px;
  }
  &__add-property {
    color: #2b5ead;
    margin-top: 7px;
    font-size: 14px;
    line-height: 21px;
    cursor: pointer;
    &-arrow {
      position: relative;
      display: inline-block;
      width: 9px;
      height: 22px;
      margin-left: 3px;
      vertical-align: top;
      background-image: svg-load('./icon/arrow-bottom.svg', fill=#2B5EAD);
      background-position: 50% 50%;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  &__properties {
    /* margin-top: 16px; */
    padding: 25px 0 7px;
    border-top: 1px solid #e9e4ce;
  }
}
</style>
