<template>
  <!-- 左侧侧滑面板 -->
  <q-list no-border highlight class="no-scroll pp-qlist">
    <component v-for="item in menu_data" :key="item.label"
               :is="item.children&&item.children.length>0?'q-collapsible':'left-menu-item'"
               v-bind="item" indent unread>
      <q-list no-border v-if="item.children&&item.children.length>0">
        <left-menu-item v-for="child_item in item.children" :key="child_item.label"
                        v-bind="child_item"/>
      </q-list>
    </component>
  </q-list>
</template>

<script>
  import {left_menu_data} from '../layouts/left_menu_data'
  import LeftMenuItem from '../layouts/left-menu-item'
  import QToolbarTitle from "quasar-framework/src/components/toolbar/QToolbarTitle";

  export default {
    'name': 'left-menu',
    components: {QToolbarTitle, LeftMenuItem},
    data: () => {
      return {
        left_menu_data: left_menu_data
      }
    },
    computed: {
      menu_data() {
        try {
          return left_menu_data;
        } catch (e) {
          return left_menu_data;
        }
      }
    }
  }
</script>
<style scoped>
  .diy-drawer .q-item, .diy-drawer .q-collapsible {
    min-height: 50px;
  }
</style>
