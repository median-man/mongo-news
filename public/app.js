/* Configure eslint for browser */
/* eslint-env browser, jquery */
/* eslint func-names:0, prefer-arrow-callback:0, no-var:0, prefer-template:0, object-shorthand:0 */
/* global notesModal */

// Sends post request to save article
function saveArticle(event) {
  var articleId = $(event.target).attr('data-id')
  var data = { id: articleId };

  // send request to save the article
  $.ajax({ method: 'POST', url: '/articles/save', data: data })

  // reload the page and go to the article
    .done(function (article, status, response) {
      if (response.status === 200) {
        // window.location.href = window.location.hostname + '#article-' + articleId;
        window.location.reload();
      } else console.log('unexpected response status. status:', response.status);
    })
    .fail(function (response) {
      console.log('failed to save the article', response.status);
    });
}

// Sends request for new scraped articles from smashing magazine
function scrapeNew() {
  $.get('/articles/scrape')
    // TODO: implement a modal instead of using alert
    .done(function (data, status, response) {
      if (response.status === 200) {
        alert(data.length + ' articles were added');

        // reload the page to display articles
        window.location.reload();
      } else { alert('unexpected response: ' + response.status); }
    })
    .fail(function (response) {
      alert('unable to process request at this time');
      console.log(response);
    });
}

// Operations to run when page loads
function pageReady() {
  notesModal.init();
  $('#scrapeNew').on('click', scrapeNew);
  $('.save').on('click', saveArticle);
  $('.notes').on('click', function (event) {
    // get article properties
    var article = {
      id: $(event.target).attr('data-id'),
      headline: $(event.target).attr('data-headline')
    };
    notesModal.populate(article, true);
  });
}
$(document).ready(pageReady);
