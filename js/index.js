
var danceabilityRange = document.getElementById('danceabilityRange');
var danceabilityValue = document.getElementById('danceabilityValue');
danceabilityValue.innerHTML = danceabilityRange.value; // Display the default slider value

var energyRange = document.getElementById('energyRange');
var energyValue = document.getElementById('energyValue');
energyValue.innerHTML = energyRange.value; // Display the default slider value

var loudnessRange = document.getElementById('loudnessRange');
var loudnessValue = document.getElementById('loudnessValue');
loudnessValue.innerHTML = loudnessRange.value; // Display the default slider value

var tempoRange = document.getElementById('tempoRange');
var tempoValue = document.getElementById('tempoValue');
tempoValue.innerHTML = tempoRange.value; // Display the default slider value

var valenceRange = document.getElementById('valenceRange');
var valenceValue = document.getElementById('valenceValue');
valenceValue.innerHTML = valenceRange.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
danceabilityRange.oninput = function() {
    danceabilityValue.innerHTML = this.value;
}
danceabilityRange.onchange = function() {
    danceabilityValue.innerHTML = this.value;
}
energyRange.oninput = function() {
    energyValue.innerHTML = this.value;
}
energyRange.onchange = function() {
    energyValue.innerHTML = this.value;
}
loudnessRange.oninput = function() {
    loudnessValue.innerHTML = this.value;
}
loudnessRange.onchange = function() {
    loudnessValue.innerHTML = this.value;
}
tempoRange.oninput = function() {
    tempoValue.innerHTML = this.value;
}
tempoRange.onchange = function() {
    tempoValue.innerHTML = this.value;
}
valenceRange.oninput = function() {
    valenceValue.innerHTML = this.value;
}
valenceRange.onchange = function() {
    valenceValue.innerHTML = this.value;
}

document.getElementById('searchBtn').onclick = function(e) {
	e.preventDefault();
	analyze()
}

document.addEventListener('DOMContentLoaded', function() {
    analyze()
});




function analyze() {
	raw_input = document.getElementById('searchInput').value
	uri = parse_input(raw_input)	
	do_get_analysis(uri)
}

function parse_input(raw_input) {
	url_without_query_string = raw_input.split(/[?#]/)[0];
	url_no_trailing_slash = url_without_query_string.endsWith('/') ? url_without_query_string.slice(0, -1) : url_without_query_string;
	document.getElementById('searchInput').value = url_no_trailing_slash
	url_sections = url_no_trailing_slash.split('/')
	uri = url_sections[url_sections.length - 1]
	console.log(uri)
	return uri
}

function do_get_analysis(uri) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://spotifinder-backend.herokuapp.com/analyze?spotify_uri=' + uri);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = handle_analysis_response;
	xhr.send();
}

function handle_analysis_response() {
	if (this.status === 200) {
        	analysis = JSON.parse(this.responseText)['analysis'];
        	analysis = normalize_analysis(analysis)
        	set_sliders(analysis)
    	}
}

function normalize_analysis(raw_analysis) {
	danceability = Math.round(analysis['danceability'] * 100)
	energy = Math.round(analysis['energy'] * 100)
	loudness = Math.round((analysis['loudness'] / -60) * 100)
	tempo = Math.round(analysis['tempo'])
	valence = Math.round(analysis['valence'] * 100)
	return {
		'danceability': danceability,
		'energy': energy,
		'loudness': loudness,
		'tempo': tempo,
		'valence': valence
	}
}

function set_sliders(normalized_analysis) {
	danceabilityRange.value = normalized_analysis['danceability']
	danceabilityRange.onchange()
	energyRange.value = normalized_analysis['energy']
	energyRange.onchange()
	loudnessRange.value = normalized_analysis['loudness']
	loudnessRange.onchange()
	tempoRange.value = normalized_analysis['tempo']
	tempoRange.onchange()
	valenceRange.value = normalized_analysis['valence']
	valenceRange.onchange()
}

