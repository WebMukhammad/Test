<template>
  <AuthBlock>
    <div class="marketplace-auth__block mt-43">
      <div class="marketplace-auth__content">
        <div class="marketplace-auth__block-bg" />
        <h3 class="marketplace-auth__block-title h3">Регистрация прошла успешно</h3>
        <p class="p mb-27">
          Вам предоставлен ограниченный доступ к личному кабинету продавца. Заполните сведения в разделе "О компании", чтобы ваши товары
          появились на <a href="https://test" class="link link_blue link_wu">test</a>
        </p>
        <Note v-if="error" class="p mt-16">
          {{ error }}
        </Note>
      </div>
      <Button v-if="submited" class="mx-auto" theme="submited" size="49" icon="tick" disabled>Перенаправляю в админку</Button>
      <Button v-else size="49" class="mx-auto" @click="onClick"> К личному кабинету </Button>
    </div>
  </AuthBlock>
</template>

<script>
import { Button, Note } from '...'

export default {
  components: {
    Button,
    Note
  },
  layout: 'promo',
  data() {
    return {
      submited: false,
      error: null
    }
  },
  methods: {
    async onClick() {
      const token = this.$route.query.code
      if (token) {
        try {
          this.error = false
          const data = await this.$api.auth.confirm({
            token
          })
          this.$store.commit('token/setToken', data.access_token)
          this.$store.commit('user/setData', data)
          this.submited = true
          this.$router.push('/product')
        } catch (e) {
          this.error = e.response.data.error || 'Ошибка, попробуйте войти позже'
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.marketplace-auth {
  &__block {
    padding: 46px 0 55px;
    text-align: center;
    &-bg {
      width: 86px;
      height: 86px;
      border: 1px solid #22a767;
      border-radius: 50%;
      background-image: url(~@/assets/img/icon/accept-green.svg);
      background-position: 50% 50%;
      background-size: 30px;
      background-repeat: no-repeat;
      margin: 0 auto;
    }
    &-title {
      margin: 17px 0 11px;
    }
  }
  &__content {
    padding: 0 30px;
  }

  @media (max-width: 800px) {
    &__block {
      padding: 10px 0px 20px;
      &-title {
        font-size: 24px;
      }
    }
    &__content {
      padding: 0;
    }
  }
}
</style>
