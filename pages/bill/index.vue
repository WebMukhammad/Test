<template>
  <div>
    <Table :items="billList" :cols="cols" :local-save="{ version: 1, name: 'bill-list' }" :state="state" top="0">
      <template #empty>
        <div class="h3 mb-8">Нет выплат</div>
        <div class="p mb-12">На этой странице будут показаны ваши выплаты</div>
      </template>
      <template #created_at="{ data }">
        <span> {{ getDate(data) }} </span>
      </template>
      <template #amount="{ data }">
        <span>{{ getAmount(data) }}₽</span>
      </template>
    </Table>
    <client-only>
      <InfiniteLoading v-if="isActiveInfinite" @infinite="infiniteHandler" />
    </client-only>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    InfiniteLoading
  },
  async asyncData({ $api, $sentry }) {
    try {
      const billList = await $api.bill.get()
      const isActiveInfinite = billList.length >= 50
      return {
        billList,
        isActiveInfinite
      }
    } catch (e) {
      console.log('Ошибка при получении списка расчетов', e)
      $sentry.captureException(e)
      return {
        state: 'error'
      }
    }
  },
  data() {
    return {
      page: 2,
      billList: [],
      state: 'visible',
      isActiveInfinite: false,
      cols: [
        {
          title: 'Дата',
          name: 'created_at',
          minWidth: 120
        },
        {
          title: 'Номер',
          name: 'number',
          minWidth: 120
        },
        {
          title: 'Сумма выплаты',
          name: 'amount',
          minWidth: 150
        }
      ]
    }
  },
  methods: {
    async infiniteHandler({ loaded }) {
      try {
        const data = await this.$api.product.get({
          page: this.page
        })
        if (data.length !== 0) {
          this.page += 1
          this.billList.push(...data)
          loaded()
        }
        this.isActiveInfinite = data.length >= 50
      } catch (e) {
        console.error('Ошибка при подгрузке данных', e)
      }
    },
    getDate(date) {
      return new Intl.DateTimeFormat('ru-RU').format(new Date(date))
    },
    getAmount(val) {
      return Math.round(val)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
    }
  }
}
</script>

<style lang="postcss" scoped></style>
