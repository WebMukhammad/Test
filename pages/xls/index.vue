<template>
  <div class="xls">
    <div class="xls__content">
      <ValidationObserver ref="observerRef">
        <Form width-title="180" type="vertical" @submit="onSubmit">
          <div class="xls__block">
            <h1 class="xls__block-title h1 mb-16">Загрузка данных через XLS-файл</h1>
            <p class="p">
              Таким образом вы можете быстрее выставить товары в маркетплейс на продажу, вручную заполнять все характеристики не придется,
              главное подготовить данные для шаблона в нужном формате.
            </p>
            <div class="xls__row-wrap mt-40">
              <h3 class="h3 mb-9">1. Выберите категории</h3>
              <p class="p mb-15">Эти категории будут доступны в шаблоне в виде отдельных страниц для заполнения информации о товарах</p>
              <template v-if="categories">
                <ValidationProvider v-slot="{ errors }" rules="required" name="категорию">
                  <FormElement :error="errors[0]" hint-min-height="1px" class="mb-15">
                    <TreeSelect
                      :data="categories"
                      :value="selectedCategories"
                      placeholder="Выберите категории для загрузки товаров"
                      :search-adapter="searchCategories"
                      :is-selected-children="false"
                      empty-search-text="Категории не найдены"
                      search
                      multiple
                      @change="onChangeSelect"
                    >
                      <template #selectedText="{ count }"> {{ getSelectedText(count) }}</template>
                    </TreeSelect>
                  </FormElement>
                </ValidationProvider>
                <Button :loading="isLoadingTemplate" theme="white" :icon="isLoadingTemplate ? null : 'load'">
                  Скачать шаблон для выбранных категорий
                </Button>
                <StatusBlock v-if="error" class="pt-10" :title="error" type="error" size="s"></StatusBlock>
              </template>
              <p v-else class="p">При загрузке категорий произошла ошибка. Пожалуйста, попробуйте позже</p>
            </div>
            <div class="xls__row-wrap mt-40">
              <h3 class="h3 mb-9">2. Заполните шаблон</h3>
              <p class="p">
                Обратите внимание, что товары из разных категории нужно заполнять на отдельных XLS-страницах, а в полях для фотографий нужно
                оставлять ссылку на фото.
              </p>
            </div>
            <div class="xls__row-wrap mt-40">
              <h3 class="h3 mb-16">3. Загрузите заполненный шаблон для обработки</h3>
              <FormElement>
                <FileInput
                  :upload-to="sendTemplate"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  initial-text="Загрузите заполненный шаблон"
                  :saving-text="['шаблона', 'шаблонов', 'шаблонов']"
                  :success-text="['Шаблон загружен', 'шаблона загружено', 'шаблонов загружено']"
                />
              </FormElement>
            </div>
            <Notice v-if="isActiveNotice" class="mt-25">
              <h4 class="h4 mb-7">Данные появятся в системе в течении 10 минут</h4>
              <p class="p mb-10">
                Нам требуется время, чтобы обработать все данные и добавить их в систему, поэтому товары не появятся в интерфейсе
                моментально, нужно будет немного подождать.
              </p>
            </Notice>
          </div>
        </Form>
      </ValidationObserver>
    </div>
    <div class="xls__hint-sticky">
      <Hint title="XLS это удобный формат, выгрузка в который доступна из множества систем">
        <div class="p">
          Ознакомьтесь с документацией к вашей системе или базе данных, чтобы узнать поддерживает ли она выгрузку данных в этом формате
        </div>
      </Hint>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { Form, FormElement, FileInput, TreeSelect, Button, StatusBlock } from '...'
import Tooltip from '...'
import debounce from 'lodash.debounce'
import declOfNum from '~/helper/declOfNum'

export default {
  name: 'XLS',
  components: {
    ValidationProvider,
    ValidationObserver,
    Form,
    FileInput,
    FormElement,
    TreeSelect,
    StatusBlock,
    // eslint-disable-next-line vue/no-unused-components
    Tooltip,
    Button
  },
  async fetch() {
    try {
      const categories = await this.$api.category.get({ include: 'children' })
      this.categories = this.convertArray(categories)
    } catch (e) {
      console.error('Ошибка при получении брендов', e)
    }
  },
  data() {
    return {
      categories: [],
      selectedCategories: [],
      submited: false,
      isLoadingTemplate: false,
      isActiveNotice: false,
      error: null
    }
  },
  created() {
    this.searchCategories = debounce(this.searchCategories, 400)
  },
  methods: {
    onSubmit() {
      this.$refs.observerRef.validateWithInfo().then(({ errors, isValid }) => {
        isValid ? this.downloadTemplate() : this.scrollToInvalidEl(errors)
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
    async searchCategories(val) {
      try {
        const result = await this.$api.category.search({ name: val })
        return await result.map((el) => ({
          name: `${el.id}. ${el.name}`,
          value: el.id.toString()
        }))
      } catch (e) {
        Tooltip({ title: e.response.data.error })
        console.error('Ошибка при получении списка категорий для компонента выбора категории', e)
      }
    },
    async downloadTemplate() {
      try {
        this.isLoadingTemplate = true
        const categoriesIds = this.selectedCategories.map(({ value }) => value)
        const { templateUrl } = await this.$api.product.getTemplateXLS({ categoriesIds })
        const dummy = document.createElement('a')
        dummy.href = templateUrl
        document.body.appendChild(dummy)
        dummy.click()
        this.isLoadingTemplate = false
        this.error = null
      } catch (e) {
        this.error = e.response.data.error
        this.isLoadingTemplate = false
        console.error('Ошибка при получении шаблона xlsx', e)
      }
    },
    convertArray(arr) {
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
      return arr.map(element)
    },
    async sendTemplate({ fileList }) {
      const result = await this.$api.product.sendTemplate({ file: fileList[0] })
      this.isActiveNotice = true
      return result
    },
    getSelectedText(count) {
      return declOfNum(count, [`Выбрана ${count} категория`, `Выбрано ${count} категории`, `Выбрано ${count} категорий`])
    },
    openChat() {
      this.$store.commit('openChat')
    },
    onChangeSelect(data) {
      this.selectedCategories = data
    }
  }
}
</script>

<style lang="postcss" scoped>
.xls {
  display: flex;
  color: #000;
  background-color: #fff;
  padding: 39px 47px 37px 47px;
  &__content {
    max-width: 860px;
    margin-right: auto;
    flex-grow: 1;
  }
  &__hint-sticky {
    width: 240px;
    max-width: 100%;
    flex-shrink: 0;
    margin-left: 92px;
  }
  @media (max-width: 1600px) {
    padding: 38px 30px 38px;
    &__hint-sticky {
      width: 240px;
      max-width: 100%;
      flex-shrink: 0;
      margin-left: 30px;
    }
  }
  @media (max-width: 1300px) {
    &__hint-sticky {
      display: none;
    }
  }
}
</style>
