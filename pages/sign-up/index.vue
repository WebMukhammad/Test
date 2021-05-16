<template>
  <AuthBlock :title="submited ? null : 'Регистрация'">
    <template #default>
      <template v-if="submited">
        <div class="marketplace-auth__block-mail">
          <div class="marketplace-auth__block-mail-bg"></div>
          <h3 class="marketplace-auth__block-title h3 mb-9">Проверьте почту</h3>
          <p class="p">Перейдите по ссылке в письме для подтверждения почты</p>
        </div>
      </template>
      <template v-else>
        <ValidationObserver v-slot="{ handleSubmit }">
          <Form type="vertical" @submit="handleSubmit(onSubmit)">
            <ValidationProvider v-slot="{ errors }" rules="required" name="название магазина">
              <FormElement title="Название магазина" :error="errors[0]">
                <InputText v-model="data.name" :error="!!errors[0]" />
              </FormElement>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" rules="required|phone" name="телефон">
              <FormElement title="Телефон" :error="errors[0]">
                <InputText v-model="data.phone" v-mask="'+7 (###) ###-##-##'" placeholder="+7 (XXX) XXX-XX-XX" :error="!!errors[0]" />
              </FormElement>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" rules="required|email" name="почту">
              <FormElement title="Почта" :error="errors[0]">
                <InputText v-model="data.email" :error="!!errors[0]" />
              </FormElement>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" rules="required|password|min:8" name="пароль">
              <FormElement title="Пароль" :error="errors[0]">
                <InputText v-model="data.password" type="password" :error="!!errors[0]" />
              </FormElement>
            </ValidationProvider>
            <Note v-if="error" class="p mb-20">
              <template v-if="typeError === 'object'">
                <ul class="dash-list">
                  <template v-for="err in error">
                    <li v-for="(err2, index) in err" :key="index" class="dash-list__item">
                      {{ err2 }}
                    </li>
                  </template>
                </ul>
              </template>
              <template v-else>
                {{ error }}
              </template>
            </Note>
            <Button theme="red" size="49"> Создать аккаунт </Button>
          </Form>
        </ValidationObserver>
      </template>
    </template>
    <template #footer> Есть аккаунт? <nuxt-link class="link link_blue link_wu" to="/sign-in">Войдите</nuxt-link> </template>
  </AuthBlock>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { Form, FormElement, InputText, Button, Note } from '...'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    Form,
    FormElement,
    InputText,
    Button,
    Note
  },
  layout: 'promo',
  middleware: ['checkUser'],
  data() {
    return {
      submited: false,
      error: null,
      data: {}
    }
  },
  computed: {
    typeError() {
      return typeof this.error
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.error = false
        await this.$api.auth.register({
          name: this.data.name,
          phone: this.data.phone,
          email: this.data.email,
          password: this.data.password
        })
        this.submited = true
      } catch (e) {
        this.error = e.response.data.errors || 'Ошибка, попробуйте зарегистрироваться позже'
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.marketplace-auth__block {
  &_center {
    text-align: center;
  }
  &-mail {
    text-align: center;
    padding: 46px 0 59px;
    max-width: 290px;
    width: 100%;
    margin: 0 auto;
    &-bg {
      width: 86px;
      height: 86px;
      margin: 0 auto 17px;
      background-image: url('~@/assets/img/icon/mail-box.svg');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  &-bottom {
    font-size: 19px;
    line-height: 21px;
    margin: 36px -40px 0;
    padding: 21px 15px 0;
    text-align: center;
    border-top: 1px solid #f3f3f3;
  }

  @media (max-width: 800px) {
    &-title {
      font-size: 24px;
    }
    &-bottom {
      margin: 20px -15px 0;
      padding: 16px 15px 6px;
      font-size: 16px;
      line-height: 18px;
    }
  }
}
</style>
