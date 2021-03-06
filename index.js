const wiki_API_URL = "https://en.wikipedia.org/w/api.php"
// State Department API disabled, may no longer be available in current form
// const state_API_URL = "https://history.state.gov/api/v1/catalog/search"
const server_URL = "https://stark-hamlet-33607.herokuapp.com/countrysearch"

var $el, $ps, $up, totalHeight;

function getDataForYoutube(searchTerm, callback) {
  const query = searchTerm
  $.getJSON(server_URL, query, callback)
} 


function getDataForWiki(searchTerm, callback) {
  wikiSearch = searchTerm.replace(" ", "_")
  const query = {
    action: 'query',
    prop: 'extracts',
    format: 'json',
    titles: wikiSearch,
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
  stateSearch = searchTerm.replace(" ", "-").toLowerCase()
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
    //getDataForState(searchQuery, renderStateData)
  })
}

function renderContentBoxes() {
  $('main').html('');
  $('main').html(`
    <div id="youtube-results" class="results"></div>
    <div id="wiki-results" class="results"></div>
    <!-- <div id="state-results" class="results"></div> -->
    `)
}


function renderYoutubeData(data) {
  $('#youtube-results').html('');
  $('#youtube-results').html(`
  <h2 class="youtube-result-title">Youtube Results</h2>
  `)
  for (i=0; i<=2; i++) {
    const titleResult = data.items[i];
    $('#youtube-results').append(`
    <div class='youtube-data'>
      <a href="https://www.youtube.com/watch?v=${titleResult.id.videoId}"><p class="videotitle">${titleResult.snippet.title}</p></a>
      <a href="https://www.youtube.com/watch?v=${titleResult.id.videoId}"><img class="youtube-thumbnail" src="${titleResult.snippet.thumbnails.medium.url}" alt="Thumbnail for search result ${i}"></a>
    </div>
    `)
  } 
}

function renderWikiData(data) {
  const keys = Object.keys(data.query.pages);
  const page_html = data.query.pages[keys[0]].extract;
  $('#wiki-results').html('')
  $('#wiki-results').append(`
  <a name="wikipedia"><h2 class='wiki-results-title'>Wikipedia Results</h2></a>
  `)
  if (page_html.length > 1) {
    $('#wiki-results').append(`
    <div class="wiki-contents-wrapper">
      ${page_html}
      <p class="wiki-read-more"><a href="#" class="read-more-button">Read More</a></p>
    </div>
    `)
  }
  else {
    $('#wiki-results').append(`
    <p>Sorry, no results at this time. Try modifying your search.</p>
    `)
  }

  $(".wiki-contents-wrapper .read-more-button").click(function() {
      
    totalHeight = 0
  
    $el = $(this);
    $p  = $el.parent();
    $up = $p.parent();
    $ps = $up.find("p:not('.wiki-read-more')");
    
    $ps.each(function() {
      totalHeight += $(this).outerHeight();
    });
          
    $up
      .css({
        "height": $up.height(),
        "max-height": 'none'
      })
      .animate({
        "height": totalHeight
      });
    
    $p.fadeOut();
    
    return false;
      
  });
  
}

function renderStateData(data) {
  $('#state-results').html('')
  $('#state-results').html(`
    <a name="statedepartment"><h2 class='state-results-title'>State Department Results</h2></a>
  `)
  if (data.country_fact_sheets) {
    const title = data.country_fact_sheets[0].title;
    const content = data.country_fact_sheets[0].content_html;
    $('#state-results').append(`
      <div class="state-contents-wrapper">
        ${content}
        
      </div>
    `);
  }
  else {
    $('#state-results').append(`
    <p>No travel advisories exist for this country at this time.</p>
  `);
  }

  $(".state-contents-wrapper .read-more-button").click(function() {
      
    totalHeight = 0
  
    $el = $(this);
    $p  = $el.parent();
    $up = $p.parent();
    $ps = $up.find("p:not('.read-more')");
    
    $ps.each(function() {
      totalHeight += $(this).outerHeight();
    });
          
    $up
      .css({
        "height": $up.height(),
        "max-height": 'none'
      })
      .animate({
        "height": totalHeight
      });
    
    $p.fadeOut();
    
    return false;
      
  });
  
}




watchForSubmit()