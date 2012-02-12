var $hex, $rgb, $hsl;
window.onload = function() {
	$hex = document.getElementById('hex');
	$rgb = document.getElementById('rgb');
	$hsl = document.getElementById('hsl');

	var inputs = document.querySelectorAll('input');
	var random = document.getElementById('random');

	new Incrementable($rgb);
	new Incrementable($hsl);

	window.addEventListener('shake', function(){ shakenNotStirred(true); }, false);
	random.onclick = function (e) {
		e.preventDefault();
		shakenNotStirred(true);
	};
	for(var i in inputs) { inputs[i].onkeyup = inputChange; }

	var hash = window.location.hash;
	if(hash) {
		$hex.value = hash;
		colorChange(hash, 'hex', true);
	} else {
		shakenNotStirred(false);
	}

};

function setBackground(color) {
	document.body.style.background = color;
}

function colorChange(color, type, hash) {
	var hex, rgb, hsl;
	if(type != 'hsl') {
		hex = type == 'hex' ? color : convertTo.hex(color);
		rgb = type == 'rgb' ? color : convertTo.rgb(color);
		hsl = convertTo.hsl(rgb);
	} else {
		hsl = color;
		rgb = convertTo.rgbFromHsl(hsl);
		hex = convertTo.hex(rgb);
	}
	if(type != 'hex') { $hex.value = hex; }
	if(type != 'rgb') { $rgb.value = rgb; }
	if(type != 'hsl') { $hsl.value = hsl; }

	if(hash) { window.location.hash = hex; }

	setBackground(hex);
}

function inputChange(e) {
	var value = e.target.value,
		type  = e.target.getAttribute('id');
	
	if(type == 'hex' && value[0] != '#') { $hex.value = '#'+ value; }
	if(type == 'rgb' && value[0] != 'r') { $rgb.value = 'rgb('+ value; }
	if(type == 'hsl' && value[0] != 'h') { $hsl.value = 'hsl('+ value; }

	colorChange(value, type, true);
}

function shakenNotStirred(hash) {
	var r = Math.floor(Math.random()*255),
		g = Math.floor(Math.random()*255),
		b = Math.floor(Math.random()*255),
		rgb = 'rgb('+ r +','+ g +','+ b +')';
	$rgb.value = rgb;

	colorChange(rgb, 'rgb', hash);
}

var get = {
	colorValue : function (color) {
		return color.replace(/[A-Za-z()%]/g, "").split(',');
	}
};

var convertTo = {
	rgb : function (hex) {
		var r, g, b;
		hex = hex.slice(1);
		if(hex.length == 3) { hex = hex + hex; }
		r = parseInt(hex.substr(0,2), 16);
		g = parseInt(hex.substr(2,2), 16);
		b = parseInt(hex.substr(4,2), 16);

		return 'rgb('+ r +','+ g +','+ b +')';
	},
	
	hex : function (rgb) {
		var values = get.colorValue(rgb),
			hex = '', hexValue;
		for(var i = 0, length = values.length; i < length; i++) {
			hexValue = parseInt(values[i], 10).toString(16);
			hex += hexValue.length < 2 ? '0'+ hexValue : hexValue;
		}
		return '#'+ hex;
	},

	hsl : function (rgb) {
		var values = get.colorValue(rgb),
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
		h = h * 360 + 0.5|0;
		s = s * 100 + 0.5|0;
		l = l * 100 + 0.5|0;

		return 'hsl('+ h +', '+ s +'%, '+ l +'%)';
	},

	rgbFromHsl : function (hsl) {
		var values = get.colorValue(hsl),
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
};

function hueToRgb(v1, v2, hue) {
	var v;
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