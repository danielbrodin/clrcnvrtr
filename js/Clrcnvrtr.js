(function(){

"use strict";

var C = window.Clrcnvrtr = function(options) {
	var settings = {
	};

	for(var option in options) {
		settings[option] = options[option];
	}

	this.settings = settings;
};

C.prototype = {
	convert: function(color, type) {
		var C = this,
			colors = {};

		switch(type) {
			case 'hex':
				colors.hex = color;
				colors.rgb = rgb(color);
				colors.hsl = hsl(colors.rgb);
				break;
			case 'rgb':
				colors.hex = hex(color);
				colors.rgb = color;
				colors.hsl = hsl(color);
				break;
			case 'hsl':
				colors.rgb = rgbFromHsl(color);
				colors.hex = hex(colors.rgb);
				colors.hsl = color;
				break;
		}

		return colors;
	},

	random: function() {
		var C = this,
			values = [],
			color;

		values.push(Math.floor(Math.random()*255));
		values.push(Math.floor(Math.random()*255));
		values.push(Math.floor(Math.random()*255));

		color = 'rgb('+ values.join(',') +')';
		return C.convert(color, 'rgb');
	},

	invert: function(color) {
		color = color.slice(1);
		color = parseInt(color, 16);
		color = 0xFFFFFF ^ color;
		color = color.toString(16);
		color = ('000000' + color).slice(-6);
		color = '#' + color;

		return color;
	}
};

function colorValue(color) {
	return color.replace(/[A-Za-z()%]/g, '').split(',');
}

function hex(rgb) {
	var	values = colorValue(rgb),
		length = values.length,
		hex = '',
		hexValue, i;

	for(i = 0; i < length; i++) {
		hexValue = parseInt(values[i], 10).toString(16);
		hex += hexValue.length < 2 ? '0'+ hexValue : hexValue;
	}

	return '#'+ hex;
}

function rgb(hex) {
	var	values = [];

	hex = hex.slice(1);

	if(hex.length === 6) {
		values.push(parseInt(hex.substr(0, 2), 16));
		values.push(parseInt(hex.substr(2, 2), 16));
		values.push(parseInt(hex.substr(4, 2), 16));
	} else {
		var r = hex.substring(0, 1) + hex.substring(0, 1);
		var g = hex.substring(1, 2) + hex.substring(1, 2);
		var b = hex.substring(2, 3) + hex.substring(2, 3);
		values.push(parseInt(r, 16));
		values.push(parseInt(g, 16));
		values.push(parseInt(b, 16));
	}

	return 'rgb('+ values.join(',') +')';
}

function hsl(rgb) {
	var	values = colorValue(rgb),
		colorValues = [],
		r = values[0] / 255,
		g = values[1] / 255,
		b = values[2] / 255,
		h, s, l,
		min = Math.min(r, g, b),
		max = Math.max(r, g, b),
		c = max - min,
		cR, cG, cB;

	l = (max + min) / 2;

	if (c === 0) {
		h = s = 0;
	} else {
		if (l < 0.5) {
			s = c / (max + min);
		} else {
			s = c / (2 - max - min);
		}

		cR = (((max - r) / 6) + (c / 2)) / c;
		cG = (((max - g) / 6) + (c / 2)) / c;
		cB = (((max - b) / 6) + (c / 2)) / c;

		if (r == max) {
			h = cB - cG;
		} else if (g == max) {
			h = ( 1 / 3 ) + cR - cB;
		} else if (b == max) {
			h = ( 2 / 3 ) + cG - cR;
		}
		if (h < 0) { h += 1; }
		if (h > 1) { h -= 1; }
	}

	colorValues.push(h * 360 + 0.5|0);
	colorValues.push((s * 100 + 0.5|0) +'%');
	colorValues.push((l * 100 + 0.5|0) +'%');

	return 'hsl('+ colorValues.join(',') +')';
}

function rgbFromHsl(hsl) {
	var	values = colorValue(hsl),
		h = values[0],
		s = values[1],
		l = values[2],
		v1, v2, hue, r, g, b;

	s /= 100;
	l /= 100;
	if (s === 0) {
		r = g = b = (l * 255);
	} else {
		if (l <= 0.5) {
			v2 = l * (s + 1);
		} else {
			v2 = l + s - l * s;
		}
		v1 = l * 2 - v2;
		hue = h / 360;
		r = hueToRgb(v1, v2, hue + 1/3)|0;
		g = hueToRgb(v1, v2, hue)|0;
		b = hueToRgb(v1, v2, hue - 1/3)|0;
	}
	return 'rgb('+ Math.round(r) +','+ Math.round(g) +','+ Math.round(b) +')';
}

function hueToRgb(v1, v2, hue) {
	var	v;

	if (hue < 0) {
		hue += 1;
	} else if (hue > 1) {
		hue -= 1;
	}
	if (6 * hue < 1) {
		v = v1 + (v2 - v1) * hue * 6;
	} else if (2 * hue < 1) {
		v = v2;
	} else if (3 * hue < 2) {
		v = v1 + (v2 - v1) * (2/3 - hue) * 6;
	} else {
		v = v1;
	}
	return 255 * v;
}

})();
