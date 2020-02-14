<template>
  <!-- 页眉的第一行是一个QToolbar -->
  <div>
    <q-toolbar style="max-height: 50px">
      <q-icon
        size="30px"
        name="mdi-medium"/>
      <span class="q-ml-md q-mr-md text-weight-bold">数据库在线管理平台</span>

      <component
        :class="comp.class"
        :style="comp.style"
        v-if="routeComp"
        v-for="(comp,i) in routeComp"
        :key="i"
        :is="comp.is"
        v-bind="comp.vBind"
        v-on="comp.vOn"
      />

      <div class="absolute-right">
        <q-btn class="full-height shadow-0"
               @click.native=user_info_btn_click
               size="24px"
               style="padding: 4px"
               icon="account_circle">
          <q-tooltip :offset="[5,5]">{{user_info_btn_tip()}}</q-tooltip>
        </q-btn>
        <q-btn
          class="shadow-0 full-height"
          icon="settings"
          size="14px"
          style="padding: 4px"
          @click.native="$router.push('/config/system_config')"
        >
          <q-tooltip :offset="[5,5]">配置</q-tooltip>
        </q-btn>
        <q-btn
          class="full-height"
          icon="help_outline"
          flat
          size="14px"
          style="padding: 4px"
          @click="navigate_to_csdn"
        >
          <q-tooltip :offset="[5,5]">使用手册(或按F1查看)</q-tooltip>
        </q-btn>
        <q-btn class="full-height"
               size="14px"
               style="padding: 4px"
               flat icon="exit_to_app"
               @click="logOut">
          <q-tooltip :offset="[5,5]">退出</q-tooltip>

        </q-btn>
      </div>
    </q-toolbar>
  </div>
</template>

<script>
  import HeaderDataMixin from "./header_data"

  export default {
    name: "header-menu",
    mixins: [HeaderDataMixin],
    components: {},
    props: {
      defaultMiniMenu: false,
    },
    data: () => {
      return {
        icoUrl: '../../static/superman.ico'
      }
    },
    computed: {
      showMenu() {
        return this.$store.state.main.show_menu;
      },
      userName() {
        return this.$store.state.user.name
      },
      isAdmin() {
        return this.$store.state.user.is_admin
      },
    },
    methods: {
      clickShowMenu() {
        this.$store.state.main.show_menu = !this.showMenu;
      },
      user_info_btn_click() {
        if (this.userName) {
          //this.$router.push({path: '/user/update'})
        } else {
          this.$router.push(({path: '/login'}))
        }
      },
      user_info_btn_tip() {
        if (this.userName) {
          return '欢迎，' + this.userName
        } else {
          return '登录'
        }
      },
      logOut() {
        this.$store.dispatch('user/logout').then().catch();
      },
      navigate_to_csdn() {
        window.open('https://blog.csdn.net/a787373009/category_9717949.html', '_blank');
      },
    }
  }
</script>

<style scoped>
  .q-toolbar {
    padding-top: 0;
    padding-bottom: 0;
  }

  a {
    color: white;
    text-decoration: none;
  }

  .menu_toggle {
    cursor: pointer !important;
    padding: 12px;
    transition: transform 0.2s;
    width: 50px;
    font-size: 26px;
  }

  .menu_toggle.active {
    transform: rotate(90deg);
  }

  .icon {
    padding: 0px 40px;
    max-width: 25px
  }

</style>
