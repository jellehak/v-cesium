> Cesium component binding for Vue

# Roadmap
- [ ] Terrain
- [ ] Port some other examples

# Install
```js
import VCesium from "v-cesium";

Vue.use(VCesium);
```

# Usage

## Multiple views
```html
<div>
    <c-viewer>
        Overlay

        <c-object
          :item="{
            position: {
                cartographicDegrees: [-111.0, 40.0, 0],
            },
            point: {
                color: {
                    rgba: [255, 255, 255, 255],
                },
                outlineColor: {
                    rgba: [255, 0, 0, 255],
                },
                outlineWidth: 4,
                pixelSize: 20,
            },
        }"></c-object>
    </c-viewer>
</div>
```

# Similar projects
https://github.com/zouyaoji/vue-cesium