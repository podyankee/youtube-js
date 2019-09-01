const mixer = require('svg-mixer');

// Classic sprite with empty canvas and <defs> section with symbols
// Useful for inlining directly in HTML markup and refer to images via <use xlink:href="#symbol-id" />
mixer('src/sprite/*.svg', { spriteConfig: { usages: true } })
	.then(result => result.write('src/img/sprite.svg'));