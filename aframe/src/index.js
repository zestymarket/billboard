/* global AFRAME */

import { fetchNFT, fetchActiveBanner, sendOnLoadMetric, sendOnClickMetric, analyticsSession } from '../../utils/networking';
import { formats, defaultFormat, defaultStyle } from '../../utils/formats';
import { openURL, parseProtocol } from '../../utils/helpers';
import './visibility_check';
import { version } from '../package.json';

console.log('Zesty SDK Version: ', version);

AFRAME.registerComponent('zesty-banner', {
  data: {},
  schema: {
    adSpace: { type: 'string' },
    space: { type: 'string' },
    creator: { type: 'string' },
    network: { type: 'string', default: 'polygon', oneOf: ['matic', 'polygon', 'rinkeby'] },
    adFormat: { type: 'string', oneOf: ['tall', 'wide', 'square'] },
    format: { type: 'string', oneOf: ['tall', 'wide', 'square'] },
    style: { type: 'string', default: defaultStyle, oneOf: ['standard', 'minimal'] },
    height: { type: 'float', default: 1 },
    beacon: { type: 'boolean', default: true },
  },

  init: function() {
    if (this.data.creator) {
      console.warn(`'creator' is no longer a required property of the Zesty Banner and can be omitted.`);
    }
    this.tick = AFRAME.utils.throttleTick(this.tick, 30000, this);
    this.registerEntity();
  },

  registerEntity: function() {
    const space = this.data.space ? this.data.space : this.data.adSpace;
    const format = (this.data.format ? this.data.format : this.data.adFormat) || defaultFormat;
    createBanner(this.el, space, this.data.network, format, this.data.style, this.data.height, this.data.beacon);
  },

  // Every 30sec check for `visible` component
  tick: function() {
    if (this.data.space) {
      analyticsSession(this.data.space);
    }
  },
});

AFRAME.registerComponent('zesty-ad', {
  data: {},
  schema: {
    adSpace: { type: 'string' },
    space: { type: 'string' },
    creator: { type: 'string' },
    network: { type: 'string', default: 'polygon', oneOf: ['matic', 'polygon', 'rinkeby'] },
    adFormat: { type: 'string', oneOf: ['tall', 'wide', 'square'] },
    format: { type: 'string', oneOf: ['tall', 'wide', 'square'] },
    style: { type: 'string', default: defaultStyle, oneOf: ['standard', 'minimal'] },
    height: { type: 'float', default: 1 },
    beacon: { type: 'boolean', default: true },
  },

  init: function() {
    if (this.data.creator) {
      console.warn(`'creator' is no longer a required property of the Zesty Banner and can be omitted.`);
    }
    this.tick = AFRAME.utils.throttleTick(this.tick, 30000, this);
    this.registerEntity();
  },

  registerEntity: function() {
    const space = this.data.space ? this.data.space : this.data.adSpace;
    const format = (this.data.format ? this.data.format : this.data.adFormat) || defaultFormat;
    createBanner(this.el, space, this.data.network, format, this.data.style, this.data.height, this.data.beacon);
  },

  // Every 30sec check for `visible` component
  tick: function() {
    if (this.data.space) {
      analyticsSession(this.data.space);
    }
  },
});

async function createBanner(el, space, network, format, style, height, beacon) {
  const scene = document.querySelector('a-scene');
  let assets = scene.querySelector('a-assets');
  if (!assets) {
    assets = document.createElement('a-assets');
    scene.appendChild(assets);
  }

  const bannerPromise = loadBanner(space, network, format, style, beacon).then(banner => {
    if (banner.img) {
      assets.appendChild(banner.img);
    }
    if (banner.url === 'https://www.zesty.market') {
      banner.url = `https://app.zesty.market/space/${space}`;
    }
    return banner;
  });

  bannerPromise.then(banner => {
    // don't attach plane if element's visibility is false
    if (el.getAttribute('visible') !== false) {
      const plane = document.createElement('a-plane');
      if (banner.img) {
        plane.setAttribute('src', `#${banner.img.id}`);
        plane.setAttribute('width', formats[format].width * height);
        plane.setAttribute('height', height);
        // for textures that are 1024x1024, not setting this causes white border
        plane.setAttribute('transparent', 'true');
        plane.setAttribute('shader', 'flat');
      } else {
        // No banner to display, hide the plane texture while still leaving it accessible to raycasters
        plane.setAttribute('material', 'opacity: 0');
      }
      plane.setAttribute('side', 'double');
      plane.setAttribute('class', 'clickable'); // required for BE

      if (beacon) {
        sendOnLoadMetric(space);
      }

      // handle clicks
      plane.onclick = async () => {
        const scene = document.querySelector('a-scene');
        await scene.exitVR();
        // Open link in new tab
        if (banner.url) {
          openURL(banner.url);
          if (beacon) {
            sendOnClickMetric(space);
          }
        }
      };
      el.appendChild(plane);

      // Set ad properties
      el.bannerURI = banner.uri;
      el.imgSrc = banner.img.src;
      el.url = banner.cta;
    }
  })
}

async function loadBanner(space, network, format, style) {
  const activeNFT = await fetchNFT(space, network);
  const activeBanner = await fetchActiveBanner(activeNFT.uri, format, style, space);

  // Need to add https:// if missing for page to open properly
  let url = activeBanner.data.url;
  url = url.match(/^http[s]?:\/\//) ? url : 'https://' + url;

  let image = activeBanner.data.image;
  image = image.match(/^.+\.(png|jpe?g)/i) ? image : parseProtocol(image);

  const img = document.createElement('img');
  img.setAttribute('id', activeBanner.uri + Math.random());
  img.setAttribute('crossorigin', '');
  if (activeBanner.data.image) {
    img.setAttribute('src', image);
    return new Promise((resolve, reject) => {
      img.onload = () => resolve({ img: img, uri: activeBanner.uri, url: url });
      img.onerror = () => reject(new Error('img load error'));
    });
  } else {
    return { id: 'blank' };
  }
}

AFRAME.registerPrimitive('a-zesty', {
  defaultComponents: {
    'zesty-banner': { space: '' },
    'visibility-check': {}
  }
});