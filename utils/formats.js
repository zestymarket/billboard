const assetsURL = 'https://cdn.zesty.xyz/images/zesty';

const formats = {
    'tall': {
        width: 0.75,
        height: 1,
        style: {
            'standard': `${assetsURL}/zesty-banner-tall.png`,
            'minimal': `${assetsURL}/zesty-banner-tall-minimal.png`,
            'transparent': `${assetsURL}/zesty-banner-tall-transparent.png`
        }
    },
    'wide': {
        width: 4,
        height: 1,
        style: {
            'standard': `${assetsURL}/zesty-banner-wide.png`,
            'minimal': `${assetsURL}/zesty-banner-wide-minimal.png`,
            'transparent': `${assetsURL}/zesty-banner-wide-transparent.png`
        }
    },
    'square': {
        width: 1,
        height: 1,
        style: {
            'standard': `${assetsURL}/zesty-banner-square.png`,
            'minimal': `${assetsURL}/zesty-banner-square-minimal.png`,
            'transparent': `${assetsURL}/zesty-banner-square-transparent.png`
        }
    },
    'mobile-phone-interstitial': {
        width: 0.56,
        height: 1,
        style: {
            'standard': `${assetsURL}/zesty-default-mobile-phone-interstitial.png`,
        }
    },
    'billboard': {
        width: 3.88,
        height: 1,
        style: {
            'standard': `${assetsURL}/zesty-default-billboard.png`,
        }
    },
    'medium-rectangle': {
        width: 1.2,
        height: 1,
        style: {
            'standard': `${assetsURL}/zesty-default-medium-rectangle.png`,
        }
    }
}

const defaultFormat = 'medium-rectangle';
const defaultStyle = 'standard';

export { formats, defaultFormat, defaultStyle };