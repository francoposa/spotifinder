let danceabilityRange = document.getElementById('danceabilityRange');
let danceabilityValue = document.getElementById('danceabilityValue');
danceabilityValue.innerHTML = danceabilityRange.value; // Display the default slider value

let energyRange = document.getElementById('energyRange');
let energyValue = document.getElementById('energyValue');
energyValue.innerHTML = energyRange.value; // Display the default slider value

let loudnessRange = document.getElementById('loudnessRange');
let loudnessValue = document.getElementById('loudnessValue');
loudnessValue.innerHTML = loudnessRange.value; // Display the default slider value

let tempoRange = document.getElementById('tempoRange');
let tempoValue = document.getElementById('tempoValue');
tempoValue.innerHTML = tempoRange.value; // Display the default slider value

let valenceRange = document.getElementById('valenceRange');
let valenceValue = document.getElementById('valenceValue');
valenceValue.innerHTML = valenceRange.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
danceabilityRange.oninput = function () {
    danceabilityValue.innerHTML = this.value;
}
danceabilityRange.onchange = function () {
    danceabilityValue.innerHTML = this.value;
}
energyRange.oninput = function () {
    energyValue.innerHTML = this.value;
}
energyRange.onchange = function () {
    energyValue.innerHTML = this.value;
}
loudnessRange.oninput = function () {
    loudnessValue.innerHTML = this.value;
}
loudnessRange.onchange = function () {
    loudnessValue.innerHTML = this.value;
}
tempoRange.oninput = function () {
    tempoValue.innerHTML = this.value;
}
tempoRange.onchange = function () {
    tempoValue.innerHTML = this.value;
}
valenceRange.oninput = function () {
    valenceValue.innerHTML = this.value;
}
valenceRange.onchange = function () {
    valenceValue.innerHTML = this.value;
}

document.getElementById('searchBtn').onclick = function (e) {
    e.preventDefault();
    analyze_track()
}

const ANALYSIS_URL = 'https://spotifinder-app-kv5p4.ondigitalocean.app/analyze?spotify_uri='
const RECOMMEND_URL = 'https://spotifinder-app-kv5p4.ondigitalocean.app/recommend'
const EMBED_URL = 'https://open.spotify.com/embed/track/'
const LIMIT = 12

let raw_analysis = null
let normalized_analysis = null

async function analyze_track() {
    let raw_input = document.getElementById('searchInput').value;
    if (raw_input.length < 1) { return; }
    let uri = parse_uri(raw_input);
    console.log(uri);
    console.log(ANALYSIS_URL + uri)
    raw_analysis = await get(ANALYSIS_URL + uri);
    update_embed_object(uri, 'seedObject');
    console.log("Raw Analysis");
    console.log(raw_analysis);
    recommend(raw_analysis);
    normalized_analysis = await normalize_analysis(raw_analysis);
    set_sliders(normalized_analysis);
}

async function recommend(raw_analysis) {
    let param_dict = prep_recommendation_params(raw_analysis);
    console.log("Raw analysis params for Recommend API");
    console.log(param_dict)
    let query_string = '?';
    for (let key in param_dict) {
        if (param_dict.hasOwnProperty(key)) {
            query_string += key + '=' + String(param_dict[key]) + '&';
        }
    }
    console.log(RECOMMEND_URL + query_string)
    let recommendations = await get(RECOMMEND_URL + query_string);
    update_recommendations(recommendations);
}

function parse_uri(raw_input) {
    url_without_query_string = raw_input.split(/[?#]/)[0];
    url_no_trailing_slash = url_without_query_string.endsWith('/') ? url_without_query_string.slice(0, -1) : url_without_query_string;
    url_sections = url_no_trailing_slash.split('/');
    uri = url_sections[url_sections.length - 1];
    return uri
}

function update_embed_object(new_uri, id_to_update) {
    obj = document.getElementById(id_to_update);
    current_uri = parse_uri(obj.data);
    if (current_uri == new_uri) {
        return;
    } else {
        embed_url = EMBED_URL + new_uri;
        obj.outerHTML = obj.outerHTML.replace(/data="(.+?)"/, 'data="' + embed_url + '"');
    }
}

function normalize_analysis(raw_analysis) {
    danceability = Math.round(raw_analysis['danceability'] * 100);
    energy = Math.round(raw_analysis['energy'] * 100);
    loudness = Math.round(((-60 - raw_analysis['loudness']) / -60) * 100);
    tempo = Math.round(raw_analysis['tempo']);
    valence = Math.round(raw_analysis['valence'] * 100);
    return {
        'danceability': danceability,
        'energy': energy,
        'loudness': loudness,
        'tempo': tempo,
        'valence': valence
    };
}

//TODO denormalize analysis
function denormalize_analysis(normalized_analysis) {
    danceability = (normalized_analysis['danceability'] / 100);
    energy = normalized_analysis['energy'] / 100;
    loudness = Math.round(-60 - ((normalized_analysis['loudness'] / 100) * -60));
    tempo = normalized_analysis['tempo'];
    valence = Math.round(normalized_analysis['valence'] / 100);
    return {
        'danceability': danceability,
        'energy': energy,
        'loudness': loudness,
        'tempo': tempo,
        'valence': valence
    };
}

function set_sliders(normalized_analysis) {
    danceabilityRange.value = normalized_analysis['danceability'];
    danceabilityRange.onchange();
    energyRange.value = normalized_analysis['energy'];
    energyRange.onchange();
    loudnessRange.value = normalized_analysis['loudness'];
    loudnessRange.onchange();
    tempoRange.value = normalized_analysis['tempo'];
    tempoRange.onchange();
    valenceRange.value = normalized_analysis['valence'];
    valenceRange.onchange();
}


function prep_recommendation_params(raw_analysis) {
    rec_params = {};
    rec_params['seed_tracks'] = raw_analysis['id'];
    rec_params['danceability'] = raw_analysis['danceability'];
    rec_params['energy'] = raw_analysis['energy'];
    rec_params['loudness'] = raw_analysis['loudness'];
    rec_params['tempo'] = raw_analysis['tempo'];
    rec_params['valence'] = raw_analysis['valence'];
    rec_params['limit'] = LIMIT;
    return rec_params;
}


function update_recommendations(raw_recommendations) {
    console.log(raw_recommendations)
    tracks = raw_recommendations['tracks'];
    for (let i = 0; i < LIMIT; i++) {
        track = tracks[i];
        id = track['id'];
        update_embed_object(id, 'recommendObject' + String(i + 1), function () { })
    }
}


function get(url) {
    // Return a new Promise
    return new Promise(function (resolve, reject) {
        // Do the usual XHR stuff
        req = new XMLHttpRequest();
        req.open('GET', url)
        req.onload = function () {
            // This is called on 4xx errors so check status
            if (req.status == 200) {
                // Resolve promise with the response text
                resolve(JSON.parse(req.response));
            }
            else {
                reject(Error(req.statusText));
            }
        }
        // Handle network errors
        req.onerror = function () {
            reject(Error('Network Error'))
        }
        // Make the request
        req.send()
    })
}

