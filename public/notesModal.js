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
