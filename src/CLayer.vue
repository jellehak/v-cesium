<script>
// https://sandcastle.cesium.com/?src=GeoJSON%20and%20TopoJSON.html

export default {
  inject: ["parent"],

  props: {
    id: { type: String, default: "" },

    item: {
      type: [String, Object, Array],
      default: "",
    },

    url: {
      type: [String],
      default: "",
    },

    type: {
      type: [String],
      default: "",
    },

    show: {
      type: [Boolean],
      default: true,
    },

    options: {
      type: Object,
      default: () => {
        return {
          markerSize: 48,
          strokeWidth: 2,
          clampToGround: false,
          
          stroke: Cesium.Color.HOTPINK,
          fill: Cesium.Color.PINK.withAlpha(0.5),
          strokeWidth: 3,
        };
      },
    },
  },

  destroyed() {
    this.remove();
  },

  created() {
    const {viewer} = this.parent;

    const resolver = {
      czml: Cesium.CzmlDataSource,
      kml: Cesium.KmlDataSource,
      geojson: Cesium.GeoJsonDataSource,
      topojson: Cesium.GeoJsonDataSource,
    };

    // Create DataSource
    const entity = new Cesium.GeoJsonDataSource();

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
      async (value) => {
        // Tell parent
        this.$emit("ready", resp);
      },
      { immediate: true }
    );

    this.$watch(
      "url",
      async (url) => {
        // const layer = Cesium.GeoJsonDataSource.load(url, {
        const layer = entity.load(url, this.options);
        viewer.dataSources.add(layer);
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
  <div data-type="datasource" />
</template>
