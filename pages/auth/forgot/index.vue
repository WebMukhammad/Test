<template>
  <AuthBlock :title="submited ? null : 'Забыли пароль?'">
    <template #default>
      <template v-if="submited">
        <div class="marketplace-auth__block-mail">
          <div class="marketplace-auth__block-mail-bg"></div>
          <h3 class="marketplace-auth__block-title h3 mb-9">Письмо успешно отправлено.</h3>
          <p class="p">Пожалуйста, проверьте свою электронную почту</p>
        </div>
      </template>
      <template v-else>
        <ValidationObserver v-slot="{ handleSubmit }">
          <Form type="vertical" @submit="handleSubmit(onSubmit)">
            <ValidationProvider v-slot="{ errors }" rules="required|email" name="почту">
              <FormElement title="Почта" :error="errors[0]">
                <InputText v-model="email" :error="!!errors[0]" />
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
            <Button size="49"> Сбросить пароль </Button>
          </Form>
        </ValidationObserver>
      </template>
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
      email: null,
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
      try {
        this.error = false
        await this.$api.auth.sendPasswordResetEmail({ email: this.email })
        this.submited = true
      } catch (e) {
        this.error = e.response.data.errors || 'Ошибка, попробуйте востановить пароль позже'
      }
    }
  }
}
</script>

<style lang="postcss">
.marketplace-auth__block {
  &-mail {
    text-align: center;
    padding: 45px 0;
    max-width: 340px;
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
}
</style>
