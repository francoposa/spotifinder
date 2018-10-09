function setup() {
	var danceabilityRange = document.getElementById("danceabilityRange");
	var danceabilityValue = document.getElementById("danceabilityValue");
	danceabilityValue.innerHTML = danceabilityRange.value; // Display the default slider value

	var energyRange = document.getElementById("energyRange");
	var energyValue = document.getElementById("energyValue");
	energyValue.innerHTML = energyRange.value; // Display the default slider value

	var loudnessRange = document.getElementById("loudnessRange");
	var loudnessValue = document.getElementById("loudnessValue");
	loudnessValue.innerHTML = loudnessRange.value; // Display the default slider value

	var tempoRange = document.getElementById("tempoRange");
	var tempoValue = document.getElementById("tempoValue");
	tempoValue.innerHTML = tempoRange.value; // Display the default slider value

	var valenceRange = document.getElementById("valenceRange");
	var valenceValue = document.getElementById("valenceValue");
	valenceValue.innerHTML = valenceRange.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	danceabilityRange.oninput = function() {
	    danceabilityValue.innerHTML = this.value;
	}
	energyRange.oninput = function() {
	    energyValue.innerHTML = this.value;
	}
	loudnessRange.oninput = function() {
	    loudnessValue.innerHTML = this.value;
	}
	tempoRange.oninput = function() {
	    tempoValue.innerHTML = this.value;
	}
	valenceRange.oninput = function() {
	    valenceValue.innerHTML = this.value;
	}
}
setup();

// function analyze(uri)