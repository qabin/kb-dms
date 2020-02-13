<template>
  <q-layout view="hHr LpR lFf">
    <!--head-->
    <q-layout-header>
      <keep-alive>
        <router-view name="header" v-model="showMenu"></router-view>
      </keep-alive>
    </q-layout-header>
    <!--left menu-->
    <q-page-container style="padding-top: 0px">
      <!--bread crumbs(path bar)-->
      <div class="flex no-wrap items-center">
      </div>
      <!--main page-->
      <keep-alive>
        <router-view name="page"></router-view>
      </keep-alive>
    </q-page-container>
    <keep-alive>
      <router-view name="footer"></router-view>
    </keep-alive>
  </q-layout>
</template>

<script>
  export default {
    name: "index",
    data: () => {
      return {
        showLeft: true,
      }
    },
    computed: {
      showMenu() {
        return this.$store.state.main.show_menu;
      }
    },
    methods: {
      clickDraw() {
        this.$store.state.main.show_menu = false;
      }
    },
    mounted() {
      this.$store.dispatch('user/getUserInfo').then().catch();
    }
  }
</script>

<style scoped>
</style>
