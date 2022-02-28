<script>
// https://github.com/zouyaoji/vue-cesium/blob/master/src/components/viewer/Viewer.vue
// https://zouyaoji.top/vue-cesium/#/en/viewer/c-viewer

export default {
  name: 'CViewer',

  provide () {
    return {
      parent: this
    }
  },

  props: {
    width: { type: [Number, String], default: null },
    height: { type: [Number, String], default: null },
    terrain: { type: Boolean, default: false },
    terrainExaggeration: { type: Number, default: 1 },
    // TODO move to component ?
    imageryProvider: { type: String, default: 'OpenStreetMapImageryProvider' },
    imageryProviderOptions: {
      type: Object,
      default: () => ({
        url: 'https://a.tile.openstreetmap.org/'
      })
    },

    // Control overlays
    credits: { type: Boolean, default: false }, // .cesium-widget-credits
    infoBox: { type: Boolean, default: true }, // .cesium-viewer-infoBoxContainer
    fullscreen: { type: Boolean, default: false },
    timeline: { type: Boolean, default: false },
    animation: { type: Boolean, default: false },
    toolbar: { type: Boolean, default: false },
    selectionWrapper: { type: Boolean, default: true },
    selectionIndicator: { type: Boolean, default: true },
    viewerBottom: { type: Boolean, default: false }
  },

  data () {
    return {
      ready: false,
      cesium: {},
      viewer: null,
      dragover: null
    }
  },

  destroyed () {
    // console.log('TODO cleanup')
    // viewer.entities.removeAll(); ?
    if (!this.viewer) {
      console.warn('No viewer')
    }

    // console.log('Destroying', this.viewer)
    // this.viewer.destroy()
  },

  async mounted () {
    const el = this.$refs.container

    // Dynamicly import Cesium
    if(!window.Cesium) {
      window.CESIUM_BASE_URL = 'https://unpkg.com/cesium/Build/Cesium';
      await import ('https://unpkg.com/cesium/Build/Cesium/Cesium.js')
    }

    const { Cesium } = window

    // # Viewer
    // https://cesium.com/docs/cesiumjs-ref-doc/Viewer.html?classFilter=viewer
    const viewer = new Cesium.Viewer(el, { })

    // Keep Ref in Vue
    this.viewer = viewer

    viewer.dataSources.dataSourceAdded.addEventListener((event) => {
      // console.log('New dataSourceAdded', event)
      this.$emit('update:datasource', event)
    })

    viewer.scene.renderError.addEventListener((event) => {
      console.warn('renderError', event)
      this.$emit('renderError', event)
    })

    // Tell parent
    this.$emit('ready', viewer)

    // Render child when ready
    this.ready = true

    // Handle events
    viewer.trackedEntityChanged.addEventListener(() => {
      this.$emit('trackedEntityChanged', viewer.trackedEntity)
      this.$emit('update:trackedEntity', viewer.trackedEntity)
    })
  },

  methods: {
    ondragover (event) {
      this.dragover = true
      // Required for ondrop
      event.preventDefault()
    },
    ondragleave (e) {
      this.dragover = false
    },
    ondrop (e) {
      this.dragover = false

      // Prevent browser open new screen
      e.preventDefault()
    }
  }
}
</script>

<template>
  <div
    ref="container"
    class="CesiumViewer"
    :style="height && width && `height: ${height}; width: ${width};`"
    :class="[
      credits && 'Viewer--credits',
      infoBox && 'Viewer--infoBox',
      fullscreen && 'Viewer--fullscreen',
      timeline && 'Viewer--timeline',
      animation && 'Viewer--animation',
      toolbar && 'Viewer--toolbar',
      selectionWrapper && 'Viewer--selectionWrapper',
      selectionIndicator && 'Viewer--selectionIndicator',
      viewerBottom && 'Viewer--viewerBottom',
      dragover && 'Viewer--dragover',
    ]"
    v-on="$listeners"
    @dragover="ondragover"
    @dragleave="ondragleave"
    @drop="ondrop"
  >
    <div class="CesiumViewer__overlay">
      <slot v-if="ready" />
    </div>
    <!-- cesium container will be injected here -->
  </div>
</template>

<style>
.CesiumViewer {
  /* For the overlay */
  position: relative;
  height: 100%;
}
.CesiumViewer__overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  /* Note overlay will block touch actions */
  /* width: 100%; */
}

.cesium-widget {
    position: relative
}

.cesium-widget, .cesium-widget canvas {
  /* Required for smooth operation */
    touch-action: none
}

.cesium-viewer,
.cesium-viewer-cesiumWidgetContainer,
.cesium-widget,
.cesium-widget canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Remove Cesium containers by default */
.cesium-widget-credits { display: none; }
.cesium-viewer-infoBoxContainer { display: none; }
.cesium-viewer-fullscreenContainer { display: none !important; }
.cesium-viewer-timelineContainer { display: none; }
.cesium-viewer-animationContainer { display: none; }
.cesium-viewer-toolbar { display: none; }
.cesium-selection-wrapper { display: none; }
.cesium-viewer-selectionIndicatorContainer { display: none; }
.cesium-viewer-bottom { display: none; }

/* Opt in widgets */
.Viewer--credits .cesium-widget-credits { display: inherit; }
.Viewer--infoBox .cesium-viewer-infoBoxContainer { display: inherit; }
.Viewer--fullscreen .cesium-viewer-fullscreenContainer { display: inherit !important; }
.Viewer--timeline .cesium-viewer-timelineContainer { display: inherit; }
.Viewer--animation .cesium-viewer-animationContainer { display: inherit; }
.Viewer--toolbar .cesium-viewer-toolbar { display: inherit; }
.Viewer--selectionWrapper .cesium-selection-wrapper { display: inherit; }
.Viewer--selectionIndicator .cesium-viewer-selectionIndicatorContainer { display: inherit; }
.Viewer--bottom .cesium-viewer-bottom { display: inherit; }

.cesium-viewer-animationContainer {
  /* On top of timeline */
  z-index: 1;
}

/* Modifiers */
.Viewer--dragover {
  border: 5px dashed green;
}
</style>
