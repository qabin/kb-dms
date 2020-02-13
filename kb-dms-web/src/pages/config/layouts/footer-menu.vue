<template>
  <!-- 返回顶部按钮 -->
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn
      v-back-to-top
      round
      color="primary"
      icon="expand_less"
    />
  </q-page-sticky>
</template>

<script>
    export default {
        name: "footer-menu"
    }
</script>

<style scoped>

</style>
