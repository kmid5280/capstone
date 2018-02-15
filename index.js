const wiki_API_URL = "https://en.wikipedia.org/w/api.php"
const youtube_API_URL = "https://www.googleapis.com/youtube/v3/search"
const state_API_URL = "https://www.state.gov/api/v1/"

function renderForm() {
  $('header').html(`
  <form class="js-search-form">
  <h2>Search</h2>
  <input type="text" id="form-query" placeholder="Search">
  <button class="js-search-button">Search</button>
  </form>
  `)
} 

function getDataForYoutube(searchTerm, callback) {
  const query = {
    part: 'snippet',
    key: 'AIzaSyDDaRbvVVP-AkYsuc2m_88PXDk81aMJWdQ',
    q: `${searchTerm}+travel`,
  }
  $.getJSON(youtube_API_URL, query, callback);
} 


function getDataForWiki(searchTerm, callback) {
  const query = {
    action: 'query',
    prop: 'extracts',
    format: 'json',
    titles: searchTerm,
  }
  $.ajax({
    url: wiki_API_URL, 
    data: query,
    jsonpCallback: "callback",
    jsonp: "callback",
    dataType: "jsonp",
  }).done(callback)
  
}

function getDataForState(searchTerm, callback) {
  const query = {
    command: 'get_country_fact_sheets',
    terms: searchTerm,
    per_page: 1,
    fields: 'title,content_html',
  }
  $.getJSON(state_API_URL, query, callback)
}

function watchForSubmit() {
  $('.js-search-button').on('click', event => {
    event.preventDefault();
    const searchQuery = $('#form-query').val();
    renderContentBoxes();
    getDataForYoutube(searchQuery, renderYoutubeData)
    getDataForWiki(searchQuery, renderWikiData) 
    getDataForState(searchQuery, renderStateData)
    $('#form-query').val('');
  })
}

function renderContentBoxes() {
  $('main').html('');
  $('main').html(`
    <div id="youtube-results" class="results col-12"></div>
    <div id="wiki-results" class="results col-6"></div>
    <div id="state-results" class="results col-6"></div>
    `)
}


function renderYoutubeData(data) {
  for (i=0; i<=4; i++) {
    const titleResult = data.items[i];
    $('#youtube-results').append(`
    <p class="videotitle">${titleResult.snippet.title}</p>
    <a href="https://www.youtube.com/watch?v=${titleResult.id.videoId}"><img src="${titleResult.snippet.thumbnails.medium.url}" alt="Thumbnail for search result ${i}"></a>
    `)
  } 
}

function renderWikiData(data) {
  const keys = Object.keys(data.query.pages);
  const page_html = data.query.pages[keys[0]].extract;
  console.log(page_html)
  $('#wiki-results').append(`
  ${page_html}
  `) 
  
}

function renderStateData(data) {
  if (data.country_fact_sheets) {
    const title = data.country_fact_sheets[0].title;
    const content = data.country_fact_sheets[0].content_html;
    $('#state-results').append(`
    <p><a href="https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/${title}-travel-advisory.html">https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/${title}-travel-advisory.html</a></p>
    ${content}
    `);
  }
  else {
    $('#state-results').append(`
    <p>No travel advisories exist for this country at this time</p>
  `);
  }
}


renderForm()
watchForSubmit()