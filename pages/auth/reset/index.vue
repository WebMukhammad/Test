<template>
  <AuthBlock title="Изменение пароля">
    <template #default>
      <ValidationObserver v-slot="{ handleSubmit }">
        <Form type="vertical" @submit="handleSubmit(onSubmit)">
          <ValidationProvider v-slot="{ errors }" rules="required|password" name="пароль">
            <FormElement title="Введите новый пароль" :error="errors[0]" hint-min-height="9px">
              <InputText v-model="password" type="password" :error="!!errors[0]" />
            </FormElement>
          </ValidationProvider>
          <Note v-if="error" class="p mb-20">
            <template v-if="typeError === 'object'">
              <ul class="dash-list">
                <template v-for="err in error">
                  <li v-for="(err2, index) in err" :key="index" class="dash-list__item">{{ err2 }}</li>
                </template>
              </ul>
            </template>
            <template v-else>
              {{ error }}
            </template>
          </Note>
          <Button v-if="submited" theme="submited" size="49" icon="tick" disabled>Перенаправляю в админку</Button>
          <Button v-else theme="red" size="49"> Изменить пароль </Button>
        </Form>
      </ValidationObserver>
    </template>
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
      password: null,
      submited: false,
      error: null
    }
  },
  computed: {
    typeError() {
      return typeof this.error
    }
  },
  methods: {
    async onSubmit() {
      const token = this.$route.query.code
      if (token) {
        try {
          this.error = false
          const data = await this.$api.auth.resetPassword({
            token,
            password: this.password
          })
          this.$store.commit('token/setToken', data.access_token)
          this.$store.commit('user/setData', data)

          this.submited = true
          this.$router.push('/product')
        } catch (e) {
          this.error = e.response.data.errors || 'Ошибка, попробуйте войти позже'
        }
      }
    }
  }
}
</script>
