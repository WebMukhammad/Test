<template>
  <AuthBlock title="Вход в личный кабинет поставщика">
    <template #default>
      <ValidationObserver v-slot="{ handleSubmit }">
        <Form type="vertical" @submit="handleSubmit(onSubmit)">
          <ValidationProvider v-slot="{ errors }" rules="required|email" name="почту">
            <FormElement title="Почта" :error="errors[0]">
              <InputText v-model="data.email" :error="!!errors[0]" />
            </FormElement>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" rules="required" name="пароль">
            <FormElement :error="errors[0]">
              <template #title>
                Пароль
                <nuxt-link to="/auth/forgot" class="link link_black"> Забыли пароль? </nuxt-link>
              </template>
              <InputText v-model="data.password" type="password" :error="!!errors[0]" />
            </FormElement>
          </ValidationProvider>
          <Note v-if="error" class="p mb-20">
            {{ error }}
          </Note>
          <Button v-if="submited" theme="submited" size="49" icon="tick" disabled>Перенаправляю в админку</Button>
          <Button v-else theme="red" size="49"> Войти </Button>
        </Form>
      </ValidationObserver>
    </template>
    <template #footer> Нет аккаунта? <nuxt-link class="link link_blue link_wu" to="/sign-up">Зарегистрируйтесь</nuxt-link> </template>
  </AuthBlock>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { Form, FormElement, InputText, Button, Note } from '...'

export default {
  components: {
    Form,
    FormElement,
    InputText,
    Button,
    ValidationProvider,
    ValidationObserver,
    Note
  },
  layout: 'promo',
  middleware: ['checkUser'],
  data() {
    return {
      data: {},
      submited: false,
      error: null
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.error = false
        const data = await this.$api.auth.login({
          email: this.data.email,
          password: this.data.password
        })
        this.$store.commit('token/setToken', data.access_token)
        this.$store.commit('user/setData', data)

        this.submited = true
        this.resetWatcher = this.$watch(
          'data',
          function () {
            this.submited = false
            this.resetWatcher()
          },
          {
            deep: true
          }
        )

        this.$router.push('/product')
      } catch (e) {
        this.error = e.response.data.error || 'Ошибка, попробуйте авторизоваться позже'
      }
    }
  }
}
</script>
