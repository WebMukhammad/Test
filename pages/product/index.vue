<template>
  <div>
    <StickyFilter>
      <InputText
        v-model="query"
        placeholder="Поиск по товарам"
        icon-position="right"
        :icon="queryTyping ? 'loading-oval' : null"
        class="product-filter__input mr-10"
        @input="onInput"
      />
      <TreeSelect
        :data="convertArray(categories)"
        :value="activeCategories"
        placeholder="Категории"
        class="product-filter__input mr-10"
        :search-adapter="searchCategories"
        :is-selected-children="false"
        empty-search-text="Категории не найдены"
        search
        multiple
        @change="onChangeSelect"
      >
        <template #selectedText="{ count }"> {{ getSelectedText(count) }} </template>
      </TreeSelect>
      <Select
        v-if="statusesInsideSelect"
        :value="$route.query.state"
        class="product-filter__input mr-auto"
        :data="statusList"
        placeholder="Выберите статус товара"
        @change="onStatusChange"
      />
      <RadioBar v-else class="mr-10" :list="statusList" scroll-to-selector=".layout__content" @change="onStatusChange">
        <template #default="{ data }">
          {{ data.name }}
          <span v-if="data.productCount !== 0" class="product-count">{{ data.productCount }}</span>
        </template>
      </RadioBar>
      <nuxt-link to="/product/create">
        <Button icon="add" class="ml-auto product-filter__button"> Добавить товар </Button>
      </nuxt-link>
    </StickyFilter>
    <Table
      :items="productList"
      :cols="cols"
      scroll-to-selector=".layout__content"
      :local-save="{ version: 3, name: 'product-list' }"
      :state="state"
      @sort="sort"
    >
      <template #images="{ data, notEmpty }">
        <div class="product-image">
          <img :src="notEmpty ? data[0].url : require('~/assets/img/icon/no-photo.svg')" class="product-image__image" />
        </div>
      </template>
      <template #name="{ data, item }">
        <p>{{ data }}</p>
        <p v-if="hasComment(item)" class="fz-12 lh-15 p_crop-2"><span class="red-text">Ошибки:</span> {{ item.status.comment }}</p>
      </template>
      <template #price="{ id, data, item }">
        <TinyInput
          :value="hasValue(data)"
          type="number"
          postfix="₽"
          :disabled="['yml', 'yaml'].some((el) => el === item.imported)"
          :error="getActiveError(id, 'price')"
          @input="onChangePrice(item, $event)"
          @blur="onBlur('price', id, data)"
        />
      </template>
      <template #quantity="{ id, data, item }">
        <TinyInput
          :value="hasValue(data)"
          type="number"
          postfix="шт."
          :disabled="['yml', 'yaml'].some((el) => el === item.imported)"
          :error="getActiveError(id, 'quantity')"
          @input="data = $event"
          @blur="onBlur('quantity', id, +data)"
        />
      </template>
      <template #created_at="{ data }">
        <span>
          {{ getDate(data) }}
        </span>
      </template>
      <template #tariff="{ data, item }">
        <div class="comission">
          <div class="comission__col">
            <div class="comission__row">
              <template v-if="data && data.cash_fee_percent">
                <div class="comission__percent">{{ data.cash_fee_percent }}%</div>
                <div class="comission__crop grey-text" :title="getFee(data.online_fee_percent, data.minimal_fee, item.price)">
                  {{ getFee(data.cash_fee_percent, data.minimal_fee, item.price) }}₽
                </div>
              </template>
              <template v-else> - </template>
            </div>
            <div class="comission__row">
              <div class="comission__text">Наличными</div>
            </div>
          </div>
          <div class="comission__col">
            <div class="comission__row">
              <template v-if="data && data.online_fee_percent">
                <div class="comission__percent">{{ data.online_fee_percent }}%</div>
                <div class="comission__crop grey-text" :title="getFee(data.online_fee_percent, data.minimal_fee, item.price)">
                  {{ getFee(data.online_fee_percent, data.minimal_fee, item.price) }}₽
                </div>
              </template>
              <template v-else> - </template>
            </div>
            <div class="comission__row">
              <div class="comission__text">Безналичными</div>
            </div>
          </div>
        </div>
      </template>
      <template #isvisible="{ data, id, item }">
        <Checkbox
          :checked="!data"
          class="product-checkbox"
          :disabled="['yml', 'yaml'].some((el) => el === item.imported)"
          @change="onVisiblePropChange($event, id)"
        />
      </template>
      <template #tool="{ selected, resetSelected, selectedState }">
        <Button
          theme="transparent"
          size="h-33"
          icon="archive"
          class="table__selected-fixed-button mr-23"
          @click="archiveSelected({ selected, resetSelected })"
        >
          {{ getSelectedState(selectedState) }} {{ declOfNumGoods(selected.length) }}
        </Button>
      </template>
      <template #more="{ id, item, resetItemSelected }">
        <Tooltip v-if="['yml', 'yaml'].some((el) => el === item.imported)" class="product__tooltip" placement="left">
          <template #handler>
            <div class="icon-question product__icon-question" />
          </template>
          <template #content> Сведения об этом товаре синхронизируются автоматически с вашей учетной системой </template>
        </Tooltip>
        <ToggleHover v-else class="product__more" toggle-parent-class="product__more_active">
          <div class="icon-more product__icon-more" />
          <Popup class="popup_more">
            <span class="popup__header-text">Действия</span>
            <nuxt-link :to="`/product/${id}/edit`" class="popup-list__item">Редактировать</nuxt-link>
            <div class="popup-list__item" @click="archiveByID(id, item), resetItemSelected(id)">
              {{ getStateArchive(item.archived) }}
            </div>
          </Popup>
        </ToggleHover>
      </template>
      <template #empty>
        <div class="h3 mb-8">Нет товаров</div>
        <div class="p mb-12">Время добавить первый и начать продавать</div>
        <nuxt-link to="/product/create">
          <Button size="39" theme="white"> Добавить </Button>
        </nuxt-link>
      </template>
    </Table>
    <client-only>
      <InfiniteLoading v-if="enableInfiniteLoading && isActiveInfinite" @infinite="infiniteHandler" />
    </client-only>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import InfiniteLoading from 'vue-infinite-loading'
import { Checkbox, InputText, Button, TinyInput, Tooltip, Select, TreeSelect } from '...'
import declOfNum from '../../helper/declOfNum'

export default {
  components: {
    Checkbox,
    Select,
    InputText,
    Button,
    TinyInput,
    Tooltip,
    TreeSelect,
    InfiniteLoading
  },
  async asyncData({ $api, query, $sentry }) {
    let statusList, productList, state, isActiveInfinite, categories
    try {
      statusList = await $api.product.getStatusList()
      categories = await $api.category.get({ include: 'children' })
    } catch (e) {
      console.log('Ошибка при получении статуса товаров', e)
      $sentry.captureException(e)
    }
    try {
      if (query.state || query.q || query.categories) {
        const state = query.state === 'all' ? null : query.state
        productList = await $api.product.search({
          query: query.q,
          state,
          categories: query.activeCategoriesIds
        })
      } else {
        productList = await $api.product.get()
      }
      isActiveInfinite = productList.length >= 50
    } catch (e) {
      console.log('Ошибка при получении списка товаров', e)
      $sentry.captureException(e)
      state = 'error'
    }
    if (state === 'error') {
      return {
        state,
        items: [],
        statusList,
        categories
      }
    } else {
      return {
        productList,
        statusList,
        categories,
        isActiveInfinite
      }
    }
  },
  data() {
    return {
      tableError: {},
      page: 1,
      statusesInsideSelect: false,
      enableInfiniteLoading: true,
      categories: [],
      isActiveInfinite: false,
      productList: [],
      query: this.$route.query?.q || null,
      queryTyping: false,
      sortName: null,
      sortOrder: null,
      status: 'all',
      state: 'visible',
      statusList: [],
      activeCategories: [],
      cols: [
        {
          title: 'артикул',
          name: 'slug',
          minWidth: 120,
          sort: 'slug'
        },
        {
          title: 'фото',
          name: 'images',
          minWidth: 80
        },
        {
          title: 'штрихкод',
          name: 'barcode',
          minWidth: 150
        },
        {
          title: 'наименование',
          name: 'name',
          minWidth: 430,
          sort: 'name'
        },
        {
          title: 'дата создания',
          name: 'created_at',
          minWidth: 120,
          sort: 'date'
        },
        {
          title: 'цена',
          name: 'price',
          minWidth: 90,
          sort: 'price'
        },
        {
          title: 'комиссия',
          name: 'tariff',
          minWidth: 230
        },
        {
          title: 'на складе',
          name: 'quantity',
          minWidth: 120,
          sort: 'quantity'
        },
        {
          title: 'на складе test.ru',
          name: 'test.ru',
          minWidth: 120
        },
        {
          title: 'скрыт',
          name: 'isvisible',
          minWidth: 80
        }
      ]
    }
  },
  created() {
    this.onVisiblePropChange = debounce(this.onVisiblePropChange, 200)
    this.searchProduct = debounce(this.searchProduct, 500)
    this.onChangePrice = debounce(this.onChangePrice, 200)
    this.searchCategories = debounce(this.searchCategories, 400)
  },
  mounted() {
    this.statusesInsideSelect = window.innerWidth < 1480
  },
  computed: {
    activeCategoriesIds() {
      return this.activeCategories?.length ? this.activeCategories.map(({ value }) => value).join() : null
    }
  },
  methods: {
    async onVisiblePropChange(state, productID) {
      const type = state ? 'hidden' : 'visible'
      try {
        await this.$api.product.patch(productID, { state: type })
        if (this.status !== 'all') {
          this.productList = this.productList.filter((el) => el.id !== productID)
        }
        this.statusList = await this.$api.product.getStatusList()
      } catch (e) {
        console.error('Ошибка при изменении видимости товара', e)
      }
    },
    onStatusChange(val) {
      this.status = val
      this.searchProduct()
    },
    onInput() {
      this.queryTyping = true
      this.searchProduct({
        onComplete: () => {
          this.queryTyping = false
        },
        onError: () => {
          this.queryTyping = false
        }
      })
    },
    async searchProduct({ onComplete = () => {}, onError = () => {} } = {}) {
      try {
        this.addRouteParams()
        this.enableInfiniteLoading = false
        this.page = 1
        this.state = 'loading'
        const param = {
          page: this.page,
          sort: this.sortName,
          order: this.sortOrder,
          categories: this.activeCategoriesIds
        }

        if (this.query) param.query = this.query
        if (this.status !== 'all') param.state = this.status

        const type = this.query || this.activeCategoriesIds || this.sortName || this.status !== 'all' ? 'search' : 'get'
        this.productList = await this.$api.product[type](param)

        this.isActiveInfinite = this.productList.length >= 50
        this.enableInfiniteLoading = true
        this.state = 'visible'
        onComplete()
      } catch (e) {
        this.state = 'error'
        console.error('Ошибка при загрузке отсортированных товаров', e)
        onError()
      }
    },
    async archiveSelected({ selected, resetSelected } = {}) {
      try {
        const typeSelect = selected.find((el) => el.archived === false) ? 'archive' : 'unarchive'
        const data = selected.map((el) => el.id)
        await this.$api.product[typeSelect]({ products: data })
        this.statusList = await this.$api.product.getStatusList()
        if (!this.query && this.status !== 'all') {
          this.productList = this.productList.filter((el) => {
            if (!data.includes(el.id)) {
              return el
            }
          })
        } else {
          this.productList.map((el) => {
            if (data.includes(el.id)) el.archived = typeSelect === 'archive'
          })
        }
        resetSelected()
      } catch (e) {
        console.error('Ошибка при обновлении статуса товара', e)
      }
    },
    async archiveByID(id, item) {
      try {
        item.archived = !item.archived
        const type = item.archived ? 'archived' : 'unarchived'
        await this.$api.product.patch(id, { state: type })
        if (this.status !== 'all') {
          this.productList = this.productList.filter((el) => el.id !== item.id)
        }
        this.getStateArchive(item.archived)
        this.statusList = await this.$api.product.getStatusList()
      } catch (e) {
        console.error(`Ошибка при обновлении статуса товара под ID ${id}`, e)
      }
    },
    async infiniteHandler({ loaded }) {
      try {
        let pageCount = this.page
        const param = {
          page: ++pageCount,
          sort: this.sortName,
          order: this.sortOrder
        }
        if (this.status !== 'all') param.state = this.status
        if (this.query) param.query = this.query
        const type = this.query || this.status !== 'all' ? 'search' : 'get'
        const data = await this.$api.product[type](param)

        if (data.length !== 0) {
          this.page += 1
          this.productList.push(...data)
          loaded()
        }
        this.isActiveInfinite = data.length >= 50
      } catch (e) {
        console.error('Ошибка при подгрузке данных', e)
      }
    },
    async onBlur(name, productID, val) {
      if (val !== null) {
        try {
          await this.$api.product.patch(productID, { [name]: val })
          if (this.tableError?.[productID]?.[name]) {
            this.$delete(this.tableError[productID], name)
          }
        } catch (e) {
          console.error('Ошибка при отправке данных', e)
          if (!this.tableError[productID]) {
            this.$set(this.tableError, productID, {})
          }
          this.$set(this.tableError[productID], name, true)
        }
      }
    },
    getActiveError(id, name) {
      return this.tableError?.[id]?.[name]
    },
    hasValue(val) {
      return +val || 0
    },
    sort(name, order) {
      this.sortName = name
      this.sortOrder = order
      this.searchProduct()
    },
    getFee(percent, minimal, price) {
      const expression = (price / 100) * percent
      return expression > minimal ? Math.round(expression) : Math.round(minimal)
    },
    getDate(date) {
      return new Intl.DateTimeFormat('ru-RU').format(new Date(date))
    },
    getStateArchive(archived) {
      return archived ? 'Разархивировать' : 'Архивировать'
    },
    declOfNumGoods(count) {
      return count + ' ' + declOfNum(count, ['товар', 'товара', 'товаров'])
    },
    getSelectedState(selectedState) {
      return selectedState ? 'В архив' : 'Разархивировать'
    },
    addRouteParams() {
      const query = {}
      if (this.status !== 'all') query.state = this.status
      if (this.query) query.q = this.query
      if (this.activeCategoriesIds) query.categories = this.activeCategoriesIds
      this.$router.push({ query })
    },
    hasComment(item) {
      return item.status?.comment
    },
    onChangePrice(item, event) {
      return (item.price = event)
    },
    async searchCategories(val) {
      try {
        const result = await this.$api.category.search({ name: val })
        return await result.map((el) => ({
          name: `${el.id}. ${el.name}`,
          value: el.id.toString()
        }))
      } catch (e) {
        console.error('Ошибка при получении списка категорий для компонента выбора категории', e)
      }
    },
    convertArray(data) {
      const element = (el) => {
        let children = []
        if (Array.isArray(el.children) && el.children.length) {
          children = el.children.map(element)
        }
        return {
          name: `${el.id}. ${el.name}`,
          value: el.id.toString(),
          children,
          disabled: !el.properties
        }
      }
      return data ? data.map(element) : []
    },
    onChangeSelect(data) {
      this.activeCategories = data
      this.searchProduct()
    },
    getSelectedText(count) {
      return declOfNum(count, [`Выбрана ${count} категория`, `Выбрано ${count} категории`, `Выбрано ${count} категорий`])
    }
  }
}
</script>

<style lang="postcss" scoped>
.comission {
  display: flex;
  &__col {
    margin-right: 21px;
    flex: 1;
    &:last-child {
      margin-right: 0;
    }
  }
  &__crop {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__row {
    display: flex;
  }
  &__percent {
    min-width: 28px;
    margin-right: 5px;
  }
  &__text {
    font-size: 11px;
    line-height: 14px;
    color: #818181;
  }
}

.product {
  &-image {
    width: 60px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    &__image {
      max-width: 100%;
      max-height: 100%;
      display: block;
    }
  }
  &-filter {
    &__input {
      max-width: 260px;
      width: 100%;
    }
    &__button {
      flex-shrink: 0;
    }
  }
  &-count {
    font-size: 9px;
    position: relative;
    top: -4px;
  }
  &-checkbox {
    display: inline-block;
  }
  &__icon-question {
    width: 14px;
    height: 14px;
  }
  &__tooltip {
    display: block;
    padding-top: 4px;
  }
  &__more {
    width: 60px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    padding-top: 4px;
    cursor: pointer;
    text-align: right;
    &_active {
      z-index: 2;
      & .popup {
        display: block;
      }
    }
  }
  &__icon-more {
    width: 23px;
    height: 15px;
    background-size: 23px;
  }
}

.product-count {
  @media (max-width: 1400px) {
    display: none;
  }
}
</style>
