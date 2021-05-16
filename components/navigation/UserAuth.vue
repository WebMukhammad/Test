<template>
  <div class="user-auth">
    <div class="user-auth__wrap-name">
      <ToggleHover class="user-auth__name" toggle-parent-class="user-auth__name_active">
        <div class="user-auth__name-link-wrap">
          <span class="user-auth__name-link">
            {{ name }}
          </span>
          <Popup class="popup_user-auth user-auth__popup">
            <nuxt-link to="/company" class="popup-list__item"> Данные о компании </nuxt-link>
            <nuxt-link to="/faq" class="popup-list__item"> Справка </nuxt-link>
            <span class="popup-list__item" @click="logout"> Выйти </span>
          </Popup>
        </div>
        <span :class="['user-auth__sale-marker', { 'user-auth__sale-marker_no-active': isUser }]">{{ statusTitle }}</span>
      </ToggleHover>
      <div v-if="balance !== null" class="user-auth__cash">{{ balance }}₽</div>
    </div>
    <Popover width="350px" padding="0" border="0">
      <template #handler>
        <div class="user-auth__action">
          <div v-if="notificationCount" class="user-auth__sup-text">{{ notificationCount }}</div>
          <div class="icon-notification user-auth__icon" />
        </div>
      </template>
      <template #content>
        <NotificationData #default="{ list, count, remove, mark, error, success, pending }">
          <InfoBlock v-if="error" description="При получении уведомлений произошла ошибка. Пожалуйста, попробуйте позже" />
          <InfoBlock v-else-if="pending" icon="loading" title="Пожалуйста, подождите" />
          <Notification v-else-if="success" :list="list" :count="count" @remove="remove" @mark="mark" />
        </NotificationData>
      </template>
    </Popover>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Popover } from '...'

export default {
  name: 'UserAuth',
  components: {
    Popover
  },
  async fetch() {
    const data = await this.$api.auth.getUserData()
    this.$store.commit('user/setData', data)
  },
  computed: {
    ...mapState({
      statusTitle: (state) => state.user?.data?.store?.status?.title,
      notificationCount: (state) => state.user?.data?.unreadNotificationsCount
    }),
    ...mapGetters({
      isUser: 'user/isUser',
      name: 'user/name',
      balance: 'user/balance'
    })
  },
  methods: {
    logout() {
      this.$store.commit('user/logout')
    }
  }
}
</script>

<style lang="postcss" scoped>
.user-auth {
  display: flex;
  &__wrap-name {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  &__name {
    position: relative;
    z-index: 4;
    display: flex;
    margin: auto 0;
    padding-left: 15px;
    padding-right: 15px;
    align-items: center;
    font-weight: 500;
    &_active {
      ^&-link-wrap {
        color: #000;
      }
      ^&-link {
        color: #000;
        background-image: svg-load('./icon/arrow.svg', fill=#000);
      }
      ^^&__popup {
        display: block;
      }
    }
    &-link {
      position: relative;
      z-index: 4;
      background-image: url(~@/assets/img/icon/arrow.svg);
      background-repeat: no-repeat;
      background-position: top 66% right;
      background-size: 7px;
      padding-right: 11px;
      display: block;
      max-width: 320px;
      color: #ffffff;
      text-decoration: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    &-link-wrap {
      display: flex;
      align-items: center;
      color: #ffffff;
      text-decoration: none;
    }
  }
  &__action {
    position: relative;
    width: 23px;
    height: 33px;
    margin: 4px 0 0 8px;
    cursor: pointer;
  }
  &__cash {
    color: #ffffff;
    font-size: 12px;
    line-height: 14px;
    padding-left: 15px;
  }
  &__sup-text {
    position: absolute;
    top: -4px;
    right: -4px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 14px;
    height: 14px;
    font-size: 9px;
    line-height: 14px;
    color: #ffffff;
    background-color: #e4010c;
    border-radius: 50%;
    z-index: 1;
  }
  &__icon {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    background-size: contain;
  }
  &__sale-marker {
    flex-shrink: 0;
    font-size: 9px;
    line-height: 10px;
    margin: 4px 0 0 8px;
    padding: 1px 5px;
    background-color: #52ee75;
    text-transform: lowercase;
    color: #000;
    border-radius: 8px;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    text-decoration: none;
    &_no-active {
      background-color: #ff9330;
    }
  }
}
</style>
