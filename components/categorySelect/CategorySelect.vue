<template>
  <div :class="['category-select', { 'category-select_error': type }]">
    <h3 class="category-select__title h3">
      <span class="category-select__title-text-error">Выберите категорию</span>
      с характеристиками
    </h3>
    <p class="p mb-26">
      Список характеристик зависит от категории товаров, поэтому перед заполнением хар-ик нужно выбрать категорию. Если в списке нет нужной
      категории, <span class="category-select__button" @click="openChat">напишите нам в чат</span> и мы оперативно её добавим.
    </p>
    <InputText
      v-model.trim="query"
      placeholder="Поиск по категориям"
      icon-left="search"
      :icon-right="isLoading ? 'loading-oval' : null"
      border-radius="4px 4px 0 0"
      @input="onInput"
    />
    <div v-if="state === 'success'" class="category-select-list">
      <template v-if="query">
        <CategorySelectItemSearch
          v-if="categoriesSearch && categoriesSearch.length"
          :active-index="activeID"
          :items="categoriesSearch"
          @select="onSelectSearch"
        />
        <div v-else-if="!isLoading" class="category-select-list__not-product">Категорий не найдено</div>
      </template>
      <template v-else>
        <template v-for="(item, index) in 5">
          <CategorySelectItem
            v-if="index === 0 ? true : getHaveItem(index - 1)"
            :key="index"
            :active-index="getActiveID(index)"
            :items="index === 0 ? categories : categoriesID[index - 1].children"
            @select="onSelect($event, index)"
          />
        </template>
      </template>
    </div>
    <div v-else-if="state === 'error'" class="category-select-list category-select-list_error">
      <div class="h3 mb-5"><span class="red-text">Ошибка</span> при получении списка категорий</div>
      <div class="p">Пожалуйста попробуйте позднее</div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { InputText } from '...'

export default {
  name: 'CategorySelect',
  components: {
    InputText
  },
  model: {
    props: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    type: {
      type: Boolean,
      default: false
    }
  },
  async fetch() {
    try {
      this.categories = await this.$api.category.get()
      if (this.value) {
        this.categoriesID = await this.getActiveCategoriesIds(this.value)
      }
    } catch (e) {
      this.state = 'error'
      console.error('Ошибка при получении списка категорий для компонента выбора категории', e)
    }
  },
  data() {
    return {
      categories: [],
      categoriesSearch: [],
      isLoading: false,
      categoriesID: [],
      query: null,
      activeID: null,
      // Свойство, которое определяет, нужно ли делать запрос на получение дерева активныз категорий
      isActiveRequestCategories: false,
      state: 'success'
    }
  },
  created() {
    this.getCategory = debounce(this.getCategory, 400)
  },
  methods: {
    onInput() {
      this.isLoading = true
      this.getCategory()
    },
    async getCategory() {
      try {
        this.categoriesSearch = this.query ? await this.$api.category.search({ name: this.query }) : []
        if (!this.query && this.isActiveRequestCategories) {
          this.categoriesID = await this.getActiveCategoriesIds(this.activeID)
        }
        this.state = 'success'
        this.isLoading = false
      } catch (e) {
        this.state = 'error'
        console.error('Ошибка при получении списка категорий для компонента выбора категории', e)
      }
    },
    async getActiveCategories(item, result = []) {
      try {
        if (item.parent_id === null) {
          return result
        } else {
          const parent = await this.$api.category.getByID({ id: item.parent_id })
          return this.getActiveCategories(parent, [parent, ...result])
        }
      } catch (e) {
        console.error('Ошибка при получении списка категорий для компонента выбора категории', e)
        this.state = 'error'
      }
    },
    async getActiveCategoriesIds(id) {
      const activeCategoryID = await this.$api.category.getByID({ id })
      const activeCategories = await this.getActiveCategories(activeCategoryID)
      const activeCategoriesNested = [...activeCategories, activeCategoryID]
      return activeCategoriesNested.map((el) => ({
        id: el.id,
        children: el.children
      }))
    },
    async onSelect(id, index) {
      try {
        const categories = await this.$api.category.getByID({
          id,
          include: 'children,props'
        })
        if (categories) {
          this.categoriesID.splice(index, this.categoriesID.length)
          this.categoriesID[index] = {
            id,
            children: categories.children
          }
          this.activeID = categories.properties?.length ? id : null
          this.isActiveRequestCategories = false
          this.$emit('change', this.activeID, { props: categories.properties })
        }
        this.state = 'success'
      } catch (e) {
        this.state = 'error'
        console.error('Ошибка при получении списка категорий для компонента выбора категории', e)
      }
    },
    async onSelectSearch(id) {
      if (this.activeID !== id) {
        this.isActiveRequestCategories = true
        this.categoriesID = []
      }
      this.activeID = +id
      const props = (
        await this.$api.category.getByID({
          id,
          include: 'children,props'
        })
      )?.properties

      this.$emit('change', id, { props })
    },
    openChat() {
      this.$store.commit('openChat')
    },
    getActiveID(num) {
      return +this.categoriesID?.[num]?.id || null
    },
    getHaveItem(num) {
      return this.categoriesID?.[num]?.children?.length
    }
  }
}
</script>

<style lang="postcss" scoped>
.category-select {
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 30px 30px 40px;
  border: 1px solid #f9f9f9;
  &_error {
    border: 1px solid #f03d3d;
    ^&__title-text-error {
      color: #f03d3d;
    }
  }
  &__title {
    margin-bottom: 12px;
  }
  &-list {
    display: flex;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-top: none;
    height: 340px;
    overflow-x: scroll;
    &_error {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    &__not-product {
      padding: 14px;
    }
    &__wrapper-list_fluid {
      width: 100%;
    }
  }
  &__button {
    cursor: pointer;
    color: #3b5ae1;
  }
}
</style>
