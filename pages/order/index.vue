<template>
  <div>
    <StickyFilter>
      <RadioBar :list="statusList" scroll-to-selector=".layout__content" @change="onStatusChange" />
    </StickyFilter>
    <Table
      :items="orderList"
      :cols="cols"
      interactive
      :local-save="{ version: 2, name: 'order-list' }"
      :state="state"
      :description-state="descriptionState"
      @description="description"
    >
      <template #empty>
        <div class="h3 mb-8">Нет заказов</div>
        <div class="p mb-12">На этой странице будут показаны ваши продажи и возвраты</div>
      </template>
      <template #date="{ data }">
        <template v-if="data">{{ getDate(data) }}</template>
        <template v-else>-</template>
      </template>
      <template #status="{ data }">
        <template v-if="data && data.title"> {{ data.title }}</template>
        <template v-else>-</template>
      </template>
      <template #amount="{ data }">
        <template v-if="data">{{ getSum(data) }}₽</template>
        <template v-else>-</template>
      </template>
      <template #description>
        <Order
          v-if="descriptionData"
          :product="descriptionData.products"
          :amount="descriptionData.amount"
          :date="descriptionData.date"
          :status="descriptionData.status"
          :number="descriptionData.number"
        />
        <Loader v-else />
      </template>
    </Table>
    <client-only>
      <InfiniteLoading v-if="isActiveInfinite" @infinite="infiniteHandler" />
    </client-only>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    InfiniteLoading
  },
  async asyncData({ $api, $sentry }) {
    try {
      const data = await $api.order.get()
      const isActiveInfinite = data.length >= 50
      return {
        list: data,
        orderList: [...data],
        isActiveInfinite
      }
    } catch (e) {
      console.log('Ошибка при получении списка заказов', e)
      $sentry.captureException(e)
      return {
        state: 'error',
        items: []
      }
    }
  },
  data() {
    return {
      page: 1,
      orders: [],
      list: [],
      orderList: [],
      descriptionState: 'initial',
      status: 'all',
      state: 'visible',
      isActiveInfinite: false,
      descriptionData: null,
      statusList: [
        { name: 'Все', value: 'all' },
        { name: 'Возврат', value: 'return' },
        { name: 'Продажа', value: 'sale' }
      ],
      cols: [
        {
          title: 'Номер заказа',
          name: 'number',
          minWidth: 120
        },
        {
          title: 'Статус',
          name: 'status',
          minWidth: 150
        },
        {
          title: 'Дата',
          name: 'date',
          minWidth: 120
        },
        {
          title: 'Кол-во товаров',
          name: 'product_count',
          minWidth: 200
        },
        {
          title: 'Сумма заказа',
          name: 'amount',
          minWidth: 90
        }
      ]
    }
  },
  created() {
    this.searchOrder = debounce(this.searchOrder, 500)
  },
  methods: {
    onStatusChange(val) {
      this.status = val
      this.descriptionState = 'initial'
      this.page = 1
      this.searchOrder()
    },
    async searchOrder({ onComplete = () => {}, onError = () => {} } = {}) {
      try {
        if (this.status !== 'all') {
          this.state = 'loading'
          const list = await this.$api.order.search({
            page: this.page,
            state: this.status
          })
          this.orderList = list
        } else {
          this.orderList = this.list
        }
        this.isActiveInfinite = this.orderList.length >= 50
        this.state = 'visible'
        onComplete()
      } catch (e) {
        this.state = 'error'
        console.error('Ошибка при загрузке отсортированных заказов', e)
        onError()
      }
    },
    async infiniteHandler({ loaded }) {
      try {
        let pageCount = this.page
        const type = this.status !== 'all' ? 'search' : 'get'
        const param = {
          page: ++pageCount
        }

        if (this.status !== 'all') param.state = this.status
        const data = await this.$api.order[type](param)

        if (data.length !== 0) {
          this.page += 1
          this.orderList.push(...data)
          loaded()
        }
        this.isActiveInfinite = data.length >= 50
      } catch (e) {
        console.error('Ошибка при подгрузке данных', e)
      }
    },
    getSum(data) {
      return Math.round(data)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
    },
    getDate(date) {
      return new Intl.DateTimeFormat('ru-RU').format(new Date(date))
    },
    async description(id) {
      try {
        if (this.descriptionState === 'initial') {
          this.descriptionState = 'active'
        }
        this.descriptionData = await this.$api.order.getByID(id)
      } catch (e) {
        console.log('При получении подробного описания заказа возникла ошибка')
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.product-filter {
  &__input {
    max-width: 260px;
    width: 100%;
  }
  &__button {
    flex-shrink: 0;
  }
}
</style>
