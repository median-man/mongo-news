/* Configure eslint for browser */
/* eslint-env browser, jquery */
/* eslint func-names:0, prefer-arrow-callback:0, no-var:0, prefer-template:0, object-shorthand:0 */

var notesModal = {
  $modal: null,
  isInitialized: false,

  // returns object for article id and headline. sets them if articles
  // parameter is passed to method.
  article: function (article = false) {
    console.log(article);
    var id;
    var headline;

    // set article properties if argument parameter was passed
    if (article) {
      id = article.id;
      headline = article.headline;
      $('#articleId').val(id);
      notesModal.$modal.find('.headline').text(headline);

    // else get the properties from the modal
    } else {
      id = $('#articleId').val();
      headline = notesModal.$modal.find('.headline').text();
    }

    return { id: id, headline: headline };
  },

  // send delete request for note and delete the element
  // TODO: replace alert calls with modal or popup
  deleteNote: function (event) {
    var $target = $(event.target);
    var $note = $target.closest('div.note');
    var id = $target.attr('data-id');
    console.log(id);
    var articleId = notesModal.article().id;

    // send delete request
    $.ajax({
      method: 'DELETE',
      url: '/comments/' + articleId,
      data: { commentId: id }
    })
      .done(function (note, status, response) {
        if (response.status === 200) $note.remove();
        else alert('unexpected response status: ' + response.status);
      })
      .fail(function (response) {
        alert('Unable to delete note.');
        console.log(response);
      });
  },

  // returns jqXHR object
  getNotes: function (articleId, callback) {
    var url = '/comments/' + articleId;

    // send a request for the notes
    $.get(url)
    // TODO implement a modal for displaying errors instead of using alerts
      .done(function (notes, status, response) {
        if (response.status === 200) callback(notes);
        else alert('unexpected response: ' + response.status);
      })
      .fail(function (response) {
        alert('unable to fetch notes');
        console.log(response);
      });
  },

  // initialize properties and set event listeners
  init: function () {
    if (notesModal.isInitialized) return true; // already initialized

    // get the modal
    notesModal.$modal = $('.modal');

    // click events
    notesModal.$modal.on('click', function (event) {
      var $target = $(event.target);
      if ($target.hasClass('close-modal')) notesModal.hide();
    });

    // Add note form submit event
    // TODO: use modal or popups instead of alerts for displaying errors
    $('#addNote').submit(function (event) {
      var articleId = notesModal.article().id;
      console.log(articleId);
      var noteText = $('#txtNewNote').val();
      event.preventDefault();

      // post new note
      $.ajax({
        method: 'POST',
        url: '/comments/' + articleId,
        data: { text: noteText }
      })
        .done(function (note, status, response) {
          if (response.status === 200) {
            notesModal.populate(notesModal.article());
          }
          else alert('unexpected response status: ' + response.status);
        })
        .fail(function (response) {
          alert('Unable to add the note.');
          console.log(response);
        });
    });
    notesModal.isInitialized = true;
  },

  // removes all notes and returns the notes container
  clear: function () { return $('#notesContainer').empty(); },

  // returns jQuery obj for a note element
  addNote: function (note) {
    var $newNote = $(notesModal.template);
    $newNote.find('.text').text(note.text);
    $newNote.find('.delete').attr('data-id', note._id);

    // listen for click on delete note button
    $newNote.find('button.delete.note').on('click', notesModal.deleteNote);

    // append to containing element for notes
    return $newNote.appendTo('#notesContainer');
  },

  // methods to show and hide the modal
  hide: function () { notesModal.$modal.removeClass('active'); },
  show: function () { notesModal.$modal.addClass('active'); },

  // Populates the modal with notes. If showOnCompletion show the notes modal when done.
  // Does not hide the modal if showOnCompletion is false.
  populate: function (article, showOnCompletion = false) {

    // send request notes
    notesModal.getNotes(article.id, function(notes) {
      notesModal.clear(); // clear all notes    
      notesModal.article(article); // set modal article props

      // append a note element to container for each element in notes
      notes.forEach(function (el) { notesModal.addNote(el); });
      if (showOnCompletion) notesModal.show();
    });
  },

  // template html for a note
  template:
    '<div class="note"><button class="btn btn-sm btn-primary btn-action ' +
    'circle float-right delete note" data-id=""><i class="icon icon-cross">' +
    '</i></button><p class="note text"></p></div>'
};
