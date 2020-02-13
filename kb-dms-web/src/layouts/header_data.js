const conf = {
};


export default {
  components: {
  },
  computed: {
    routeComp() {
      return conf[this.$route.path];
    }
  },
};
