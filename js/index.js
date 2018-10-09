var danceabilityRange = document.getElementById("danceabilityRange");
var danceabilityValue = document.getElementById("danceabilityValue");
danceabilityValue.innerHTML = danceabilityRange.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
danceabilityRange.oninput = function() {
    danceabilityValue.innerHTML = this.value;
}