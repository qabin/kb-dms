<template>
  <q-item :to="to">
    <!--icon-->
    <q-item-side :icon="icon">
      <q-tooltip
        class="font-md q-pa-sm"
        self="center left"
        anchor="center right"
        :offset="[18,0]">
        {{label}}
      </q-tooltip>
    </q-item-side>
    <!--title-->
    <q-item-main :label="label"
                 :sublabel="sublabel"/>
  </q-item>
</template>

<script>
  export default {
    'name': 'left-menu-item',
    components: {},
    props: {
      to: String,
      icon: String,
      label: String,
      sublabel: String
    }
  }
</script>
