export default {
  methods: {
    acceptAlert(aColor, aTitle, aText) {
      this.$vs.notify({
        color: aColor,
        title: aTitle,
        text: aText,
      });
    },
  },
};
