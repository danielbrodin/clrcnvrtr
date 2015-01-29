window.onload = function() {
	var
		$hex		= document.getElementById('hex'),
		$rgb		= document.getElementById('rgb'),
		$hsl		= document.getElementById('hsl'),
		inputs		= document.querySelectorAll('input'),
		random		= document.getElementById('random'),
		clrcnvrtr	= new Clrcnvrtr(),
		hash		= window.location.hash;

	new Incrementable($rgb);
	new Incrementable($hsl);

	for(var i in inputs) {
		inputs[i].onkeyup = inputChange;
	}

	random.onclick = function(e) {
		var colors = clrcnvrtr.random();

		changeColor(colors);
		e.preventDefault();
	}

	window.addEventListener('shake', function(){
		changeColor(clrcnvrtr.random());
	}, false);


	if(hash) {
		changeColor(clrcnvrtr.convert(hash, 'hex'));
	} else {
		changeColor(clrcnvrtr.random());
	}


	function changeColor(colors, skip) {
		if(skip !== 'hex') $hex.value = colors.hex;
		if(skip !== 'rgb') $rgb.value = colors.rgb;
		if(skip !== 'hsl') $hsl.value = colors.hsl;

		setBackground(colors.hex);
		setHeaderBackground(clrcnvrtr.invert(colors.hex));

		window.location.hash = colors.hex;
	}

	function setBackground(color) {
		document.body.style.background = color;
	}

	function setHeaderBackground(color) {
		var h1 = document.querySelector('h1');
		h1.style.background = color;
	}

	function inputChange(e) {
		var value = e.target.value,
			type  = e.target.getAttribute('id');

		if(type == 'hex' && value[0] != '#') { $hex.value = '#'+ value; }
		if(type == 'rgb' && value[0] != 'r') { $rgb.value = 'rgb('+ value; }
		if(type == 'hsl' && value[0] != 'h') { $hsl.value = 'hsl('+ value; }

		changeColor(clrcnvrtr.convert(value, type), type);
	}
};