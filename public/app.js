/* Configure eslint for browser */
/* eslint-env browser, jquery */
/* eslint func-names:0, prefer-arrow-callback:0, no-var:0, prefer-template:0, object-shorthand:0 */

var notesModal = {
  $modal: function () { return $('.modal'); },

  // removes all notes and returns the notes container
  clear: function () { return $('#notesContainer').empty(); },

  // returns jQuery obj for a note element
  createNote: function (note) {
    var $newNote = $(notesModal.template);
    $newNote.find('.text').text(note.text);
    $newNote.find('.delete').attr('data-id', note.id);
    return $newNote;
  },

  // methods to show and hide the modal
  hide: function () { notesModal.$modal().removeClass('active'); },
  show: function () { notesModal.$modal().addClass('active'); },

  // populates the modal with notes
  populate: function (notes) {
    var $container = $('#notesContainer');
    notesModal.clear(); // clear all notes

    // append a note element to container for each element in notes
    notes.forEach(function (el) {
      $container.append(notesModal.createNote(el));
    });
  },

  // template html for a note
  template:
    '<div class="note"><button class="btn btn-sm btn-primary btn-action ' +
    'circle float-right delete note" data-id=""><i class="icon icon-cross">' +
    '</i></button><p class="note text"></p></div>'
};

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

// Requests notes for an article
function getNotes(event) {
  // get the request url
  var url = '/comments/' + $(event.target).attr('data-id');

  // send a request for the notes
  $.get(url)
  // TODO implement a modal for displaying errors instead of using alerts
    .done(function (notes, status, response) {
      if (response.status === 200) {
        // TODO populate notes modal with notes
        notesModal.populate(notes);
        notesModal.show();
      } else alert('unexpected response: ' + response.status);
    })
    .fail(function (response) {
      alert('unable to fetch notes');
      console.log(response);
    });
}

// Operations to run when page loads
function pageReady() {
  $('#scrapeNew').on('click', scrapeNew);
  $('.save').on('click', saveArticle);
  $('.notes').on('click', getNotes);
  $('.close-modal').on('click', notesModal.hide);
}
$(document).ready(pageReady);
