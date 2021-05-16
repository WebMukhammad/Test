<template>
  <div class="create">
    <template v-if="fieldError">
      <h5 class="h5">
        {{ fieldError }}
      </h5>
    </template>
    <template v-else>
      <div v-if="false" class="create__sidebar">
        <div class="sidebar-nav">
          <h5 class="sidebar-nav__title h5 mb-19">Разделы</h5>
          <div class="sidebar-nav__block">
            <div class="sidebar-nav__block-title">Основная информация</div>
            <ul class="dash-list fz-15">
              <li class="dash-list__item">Цена на товар</li>
              <li class="dash-list__item">Вес и габариты товара</li>
            </ul>
          </div>
          <div class="sidebar-nav__block">
            <div class="sidebar-nav__block-title">Фотографии</div>
          </div>
          <div class="sidebar-nav__block">
            <div class="sidebar-nav__block-title">Категория</div>
          </div>
        </div>
      </div>
      <div class="create__main">
        <div class="create__content">
          <Note v-if="field.comment" class="mb-40" theme="reddish">
            <div class="create__note-wrap">
              <h3 class="h3">Есть ошибки в описании товара</h3>
              <p class="p mt-6">{{ field.comment }}</p>
              <!-- Временно закомментировано, пока не появятся данные с апи -->
              <!-- <div class="mt-20">
                <h5 class="h5">В каких полях ошибки</h5>
                <ul class="dash-list p mt-8">
                  <li class="dash-list__item">Первый пункт списка, Первый пункт списка</li>
                  <li class="dash-list__item">Второй пункт списка, Второй пункт списка</li>
                  <li class="dash-list__item">Третий пункт списка, Третий пункт списка</li>
                </ul>
              </div> -->
            </div>
          </Note>
          <ValidationObserver ref="observerRef" v-slot="{ invalid }">
            <Form width-title="180" @submit="onSubmit">
              <div class="create__block">
                <h1 class="create__block-title h1 mb-27">Основная информация</h1>
                <ValidationProvider v-slot="{ errors }" rules="required" name="название">
                  <FormElement title="Название:" :error="errors[0]" required>
                    <InputText v-model.trim="field.name" />
                  </FormElement>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" rules="min:8" name="штрихкод">
                  <FormElement :error="errors[0]" title="Штрихкод:">
                    <div class="create__form-row_w-350">
                      <InputText v-model.trim="field.barcode" />
                    </div>
                  </FormElement>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" rules="required" name="бренд">
                  <FormElement :error="errors[0]" title="Бренд:" required>
                    <div class="create__form-row_w-350">
                      <Select v-model="field.brand_id" search :data="convertToArray(brands)" />
                    </div>
                    <template #helper>
                      если в списке нет нужного вам бренда,
                      <span class="create__form-helper" @click="openChat">напишите нам в чат</span> и мы оперативно его добавим
                    </template>
                  </FormElement>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" rules="required" name="артикул">
                  <FormElement :error="errors[0]" title="Артикул:" class="create__form-row_w-470" required>
                    <InputText v-model.trim="field.slug" />
                  </FormElement>
                </ValidationProvider>
                <FormElement title="Описание:">
                  <Textarea v-model="field.description" resize="vertical" />
                </FormElement>
                <h3 class="h3 mt-20 mb-28">Цена на товар</h3>
                <ValidationProvider v-slot="{ errors }" rules="required|min_value:1" name="цену">
                  <FormElement :error="errors[0]" title="Цена:" class="create__form-row_w-470" required>
                    <RangeInput
                      v-model.trim="field.price"
                      :max="1000000"
                      postfix="₽"
                      helper="Цена, которую покупатель увидит на сайте. Если на товар есть скидка, укажите цену после ее применения."
                    />
                  </FormElement>
                </ValidationProvider>
                <h3 class="h3 mt-35 mb-29">Вес и габариты товара</h3>
                <ValidationProvider v-slot="{ errors }" rules="required|min_value:1" name="вес">
                  <FormElement :error="errors[0]" title="Вес товара с упаковкой:" class="create__form-row_w-470" required>
                    <RangeInput
                      v-model.trim="field.weight"
                      postfix="г"
                      :max="100000"
                      helper="Вес товара вместе с упаковкой в граммах (для одного SKU)."
                    />
                  </FormElement>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" rules="required|min_value:1" name="длинну упаковки">
                  <FormElement :error="errors[0]" title="Длина товара в упаковке:" class="create__form-row_w-470" required>
                    <RangeInput
                      v-model.trim="field.length"
                      :max="100000"
                      postfix="мм"
                      helper="Перед измерением длины:  одежда, текстиль, наборы для вышивания — сложить пополам. карты и интерьерные наклейки — скрутить в рулон. длина рулона — это его самая большая величина. длина книжного комплекта — это длина всей стопки книг"
                    />
                  </FormElement>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" rules="required|min_value:1" name="ширину упаковки">
                  <FormElement :error="errors[0]" title="Ширина товара в упаковке:" class="create__form-row_w-470" required>
                    <RangeInput v-model.trim="field.width" :max="100000" postfix="мм" />
                  </FormElement>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" rules="required|min_value:1" name="высоту упаковки">
                  <FormElement :error="errors[0]" title="Высота товара в упаковке:" class="create__form-row_w-470" required>
                    <RangeInput v-model.trim="field.height" :max="100000" postfix="мм" />
                  </FormElement>
                </ValidationProvider>
              </div>
              <div class="create__block">
                <h2 class="create__block-title h1 mb-18">Фотографии</h2>
                <h5 class="h5 mb-12">Требования к фото</h5>
                <ul class="numeric-list fs-14 mb-20">
                  <li class="numeric-list__item">Формат: JPEG, PNG или WebP;</li>
                  <li class="numeric-list__item">Разрешение: от 700 до 1600 пикселей по любой стороне;</li>
                  <li class="numeric-list__item">Фон: белый — белые поля не более 2 пикселей от границы товара;</li>
                  <li class="numeric-list__item">
                    Запрещены: логотипы, водяные знаки, цены, надписи, алкогольная тематика и эскизы товара (например, 3D-модель);
                  </li>
                </ul>
                <h5 class="h5 mb-12">Список файлов</h5>
                <p class="p mb-25">
                  Первая фотография станет заглавной, она будет видна как основная в карточке товара в каталоге и на странице продукта. В
                  слайдере на странице продукта фотографии будут расположены в таком же порядке. Если нужно, вы можете изменить порядок:
                </p>
                <ImageInput
                  :images="field.images"
                  :max-file-size="2097152"
                  text="Загрузите фото для страницы товара и каталога"
                  @change="onImageChange"
                  @loading="onLoadingImage"
                />
              </div>
              <div class="create__block">
                <h2 class="create__block-title h1 mb-25">Характеристики</h2>
                <ValidationProvider v-slot="{ errors }" rules="required" name="категорию">
                  <CategorySelect v-model="field.category_id" :type="!!errors[0]" @change="onChange" />
                </ValidationProvider>
                <div v-if="properties && properties.length" class="mt-37">
                  <div v-for="property in properties" :key="property.id" class="mt-20">
                    <h2 v-if="property.group" class="h2 mb-30">
                      {{ property.group }}
                    </h2>
                    <template v-if="Array.isArray(property.list)">
                      <Property
                        v-for="props in property.list"
                        :id="props.id"
                        :key="props.id"
                        :name="props.name"
                        :value="field.properties"
                        :values="props.values"
                        :type="props.type"
                        @change="onChangeProp"
                      />
                    </template>
                  </div>
                </div>
              </div>
              <Note v-if="error" class="p mt-20" :size="noteSize">
                <template v-if="typeError === 'object'">
                  <h3 class="h3 mb-10">Пожалуйста, проверьте поля:</h3>
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
              <div class="create__total">
                <Button v-if="submited" size="49" theme="submited" icon="tick" disabled> Товар обновлен </Button>
                <Button v-else size="49" theme="red" :disabled="isDisabledButton || loading"> Сохранить изменения </Button>
                <div v-if="invalid" class="create__total-text">
                  Заполните
                  <span class="span red-text"> все обязательные поля </span>
                </div>
                <!-- <div class="create__total-preview">
                <div class="icon-note create__total-preview-icon" />
                Предпросмотр
              </div> -->
              </div>
            </Form>
          </ValidationObserver>
        </div>
        <div class="create__hint-sticky">
          <Hint title="Используйте хоткеи для продуктивной работы">
            <div class="p">
              По полям формы можно перемещаться через Tab, выбирать пункты в раскрывающихся списках можно через стрелочки.
            </div>
            <!-- <nuxt-link to="/" class="link link_wu link_blue"> Больше информации в разделе «Помощь» </nuxt-link> -->
          </Hint>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { Form, FormElement, InputText, RangeInput, Button, Note, Select, Textarea } from '...'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    Form,
    FormElement,
    InputText,
    RangeInput,
    Button,
    Note,
    Select,
    Textarea
  },
  async asyncData({ params, $api }) {
    try {
      const data = await $api.product.getByID(params.productID)
      const brands = await $api.brand.get()
      let properties
      if (data.category) {
        properties = (await $api.category.getByID({ id: data.category.id, include: 'children,props' })).properties
      }
      return {
        field: {
          name: data.name,
          slug: data.slug,
          id: data.id,
          barcode: data.barcode,
          description: data.description,
          price: +data.price,
          weight: +data.weight,
          length: +data.length,
          height: +data.height,
          width: +data.width,
          brand_id: data.brand?.id,
          comment: data.status?.comment,
          images: data.images,
          category_id: data.category?.id,
          properties: data.properties.map((el) => ({
            property_id: el.id,
            value: el.value,
            is_value_id: el.is_value_id
          }))
        },
        brands,
        properties
      }
    } catch (e) {
      console.log('Ошибка при получении товара', e)
      return {
        fieldError: 'Не удалось получить товар'
      }
    }
  },
  data() {
    return {
      submited: false,
      error: null,
      fieldError: null,
      isDisabledButton: true,
      loading: false
    }
  },
  computed: {
    typeError() {
      return typeof this.error
    },
    noteSize() {
      return this.typeError === 'object' ? 'm' : 's'
    }
  },
  mounted() {
    if (this.field?.images?.length) {
      this.$set(
        this.field,
        'images',
        this.field.images.map((el) => el.id)
      )
    }

    // watch прописан здесь, потому что в этом хуке объект будет полностью сформирован
    this.dataResetWatcher = this.$watch(
      'field',
      function () {
        this.isDisabledButton = false
        this.dataResetWatcher()
      },
      {
        deep: true
      }
    )
  },
  methods: {
    onChangeProp(prop) {
      if (this.field.properties.find((p) => p.property_id === prop.property_id)) {
        const propIndex = this.field.properties.findIndex((p) => p.property_id === prop.property_id)
        this.field.properties[propIndex].value = prop.value
      } else {
        this.field.properties.push(prop)
      }
    },
    onImageChange(val) {
      this.$set(this.field, 'images', val)
    },
    onSubmit() {
      this.$refs.observerRef.validateWithInfo().then(({ errors, isValid }) => {
        isValid ? this.postData() : this.scrollToInvalidEl(errors)
      })
    },
    scrollToInvalidEl(errors) {
      const err = Object.entries(errors)
        .map(([key, value]) => ({ key, value }))
        .filter((error) => error.value.length)
      scrollIntoView(this.$refs.observerRef.refs[err[0].key].$el, {
        behavior: 'smooth',
        block: 'start'
      })
    },
    async postData() {
      try {
        this.error = false
        await this.$api.product.update(this.$route.params.productID, this.field)

        this.submited = true
        this.resetWatcher = this.$watch(
          'field',
          function () {
            this.submited = false
            this.resetWatcher()
          },
          {
            deep: true
          }
        )

        this.$router.push(`/product?state=checking&id=${this.field.id}`)
      } catch (e) {
        console.log('Ошибка при редактировании товара', e)
        this.error = e.response.data.errors || 'Ошибка, попробуйте отредактировать товар позже'
      }
    },
    onChange(id, { props }) {
      this.properties = props
      this.field.properties = []
    },
    convertToArray(items) {
      return items.map((el) => ({
        name: el.name,
        value: el.id
      }))
    },
    openChat() {
      this.$store.commit('openChat')
    },
    onLoadingImage(state) {
      this.loading = state
    }
  }
}
</script>

<style lang="postcss" scoped>
.create {
  display: flex;
  color: #000;
  background-color: #fff;
  &__sidebar {
    min-width: 271px;
    background-color: #f4f4f4;
    padding: 36px 24px;
  }
  &__main {
    display: flex;
    padding: 38px 47px 38px 50px;
    flex-grow: 1;
  }
  &__content {
    max-width: 1400px;
    margin-right: auto;
    flex-grow: 1;
  }
  &__note-wrap {
    padding: 18px 16px;
  }
  &__block {
    padding: 43px 0 60px;
    border-bottom: 1px solid #e5e5e5;
    &:first-child {
      padding: 0 0 50px;
    }
  }
  &__hint-sticky {
    width: 240px;
    max-width: 100%;
    flex-shrink: 0;
    margin-left: 92px;
  }
  &__total {
    display: flex;
    align-items: center;
    padding-top: 42px;
    font-size: 17px;
    &-text {
      margin-left: 28px;
    }
    &-preview {
      margin-left: 24px;
      cursor: pointer;
      &-icon {
        top: 1px;
      }
    }
  }
  &__form-helper {
    cursor: pointer;
    border-bottom: 1px dashed #b0b0b0;
  }
  &__form-row_w-350 {
    max-width: 350px;
  }
  &__form-row_w-470 {
    max-width: 470px;
  }
  @media (max-width: 1600px) {
    &__main {
      padding: 38px 30px 38px;
    }
    &__hint-sticky {
      width: 240px;
      max-width: 100%;
      flex-shrink: 0;
      margin-left: 30px;
    }
  }
  @media (max-width: 1450px) {
    &__hint-sticky {
      display: none;
    }
  }
  @media (max-width: 1200px) {
    &__sidebar {
      display: none;
    }
  }
}

.sidebar-nav {
  position: sticky;
  top: 15px;
  &__block {
    margin-bottom: 15px;
    &-title {
      font-size: 17px;
      line-height: 19px;
      margin-bottom: 8px;
    }
  }
}
</style>
