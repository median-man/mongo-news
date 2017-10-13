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

    // listen for add note form event
    $('#addNote').submit(function (event) {
      var articleId = notesModal.article().id;
      var noteText = $('#txtNewNote').val();
      console.log(noteText);
      event.preventDefault();

      $.ajax({
        method: 'POST',
        url: '/comments/' + articleId,
        data: { text: noteText }
      })
        // TODO: use modal or popups instead of alerts for displaying errors
        .done(function (note, status, response) {
          if (response.status === 200) notesModal.createNote(note);
          else alert('unexpected response status: ' + response.status);
        })
        .fail(function (response) {
          alert('Unable to add the note.');
          console.log(response);
        });

    });
  },

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
  hide: function () { notesModal.$modal.removeClass('active'); },
  show: function () { notesModal.$modal.addClass('active'); },

  // populates the modal with notes
  populate: function (notes, article) {
    var $container = $('#notesContainer');

    notesModal.clear(); // clear all notes    
    notesModal.article(article); // set modal article props

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
