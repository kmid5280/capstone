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
    key: '',
    q: `${searchTerm} in:name`,
  }
  $.getJSON(youtube_API_URL, query, callback);
} 


function getDataForWiki(searchTerm, callback) {
  const query = {
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    format: 'json',
    formatversion: 2,
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
    get_country_fact_sheets: searchTerm,
    per_page: 1,
  }
  $.getJSON(state_API_URL, query, callback)
}

function watchForSubmit() {
  $('.js-search-button').on('click', event => {
    event.preventDefault();
    const searchQuery = $('#form-query').val();
    renderContentBoxes();
    //getDataForYoutube(searchQuery, returnResults)
    getDataForWiki(searchQuery, returnResults) 
    //getDataForState(searchQuery, returnResults)
    $('#form-query').val('');
  })
}

function renderContentBoxes() {
  $('main').html('');
  $('main').html(`
    <div id="youtube-results" class="results col-12">youtube results</div>
    <div id="wiki-results" class="results col-6">wiki results</div>
    <div id="state-results" class="results col-6">state results here</div>
    `)
}


function renderYoutubeData(data) {
  $('#youtube-results').html('youtube results here');
  /*$('.youtube-results').html(`
  <p>Total results: ${data.pageInfo.totalResults}</p>
  `)
  for (i=0; i<data.items.length; i++) {
    const titleResult = data.items[i];
    $('.youtube-results').append(`
    <p class="videotitle">${titleResult.snippet.title}</p>
    <a href="https://www.youtube.com/watch?v=${titleResult.id.videoId}"><img src="${titleResult.snippet.thumbnails.medium.url}" alt="Thumbnail for search result ${i}"></a>
    `)
  } */
}

function renderWikiData(data) {
  $('#wiki-results').html('wiki results here');
  const titleResult = data.query.pages[0];
  $('#wiki-results').append(`
    <p>${titleResult.title}</p>
    `) 
  
}

function renderStateData(data) {
  $('#state-results').html('state results here');
  
  
}


renderForm()
watchForSubmit()