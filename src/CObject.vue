<script>
export default {
  inject: ["parent"],

  props: {
    id: { type: String, default: "" },

    item: {
      type: [String, Object, Array],
      default: "",
    },

    show: {
      type: [Boolean],
      default: true,
    },

    // options: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       markerSize: 48,
    //       strokeWidth: 2,
    //       clampToGround: false,
    //     };
    //   },
    // },
  },

  destroyed() {
    this.remove();
  },

  created() {
    const { viewer } = this.parent;

    // Create DataSource
    const entity = new Cesium.CzmlDataSource();

    // Set to vue
    const datasource = entity;

    // Add to viewer
    const resp = viewer.dataSources.add(entity);

    // Watchers
    this.$watch(
      "id",
      (e) => {
        entity._id = e;
      },
      { immediate: true }
    );

    this.$watch(
      "show",
      (e) => {
        entity.show = e;
      },
      { immediate: true }
    );

    this.$watch(
      "item",
      async (newValue) => {
        const csml = [
          {
            id: "document",
            version: "1.0",
          },
          newValue,
        ];

        const loaded = await entity.load(csml);

        // console.log(resp, loaded);
        // Tell parent
        this.$emit("ready", resp);
      },
      { immediate: true }
    );

    this.remove = () => {
      viewer.dataSources.remove(datasource);
      this.$emit("removed");
    };
  },
};
</script>

<template>
  <div data-type="object" />
</template>
