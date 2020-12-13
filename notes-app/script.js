const editBtn = document.querySelector('.edit');
const deleteBtn = document.querySelector('.delete');
const addBtn = document.querySelector('.add');
const homeBtn = document.querySelector('.main-menu');
const saveBtn = document.querySelector('.save');
const previewBtn = document.querySelector('.preview');

const notesEl = document.querySelector('.notes');
const main = notesEl.querySelector('.main');
const textArea = notesEl.querySelector('textarea');
const textAreaDisplay = document.querySelector('.textarea-display');

const notesListEl = document.getElementById("notes-list");

var currNoteId = -1;

populateNotesList();

homeBtn.addEventListener('click', () => {
    main.classList.remove('hidden');
    textArea.classList.add('hidden');
    textAreaDisplay.classList.add('hidden');
    deleteBtn.classList.add('hidden');
    saveBtn.classList.add('hidden');
    editBtn.classList.add('hidden');
    addBtn.classList.remove('hidden');
    homeBtn.classList.add('hidden');
    previewBtn.classList.add('hidden');

    populateNotesList();
});

function populateNotesList() {
    let notesData = _getNotesFromLocalStorage();

    if (notesData.length <= 0) {
        return;
    }

    notesListEl.innerHTML = '';

    notesData.forEach(note => {
        let noteBannerEl = document.createElement('div');
        noteBannerEl.classList.add('note-banner');

        noteBannerEl.innerHTML = `
            <span class="note-banner-header">${_getNoteTitleFromContent(note.content)}</span>
        `;

        notesListEl.appendChild(noteBannerEl);

        noteBannerEl.addEventListener('click', () => {
            _editNote(note);
            currNoteId = note.id;
        });
    });

    notesListEl.appendChild;
}

// Adding a new note
addBtn.addEventListener('click', () => {
    currNoteId = -1;
    textArea.innerHTML = '';
    textArea.value = '';
    main.classList.add('hidden');
    textArea.classList.remove('hidden');
    editBtn.classList.add('hidden');
    addBtn.classList.add('hidden');
    homeBtn.classList.remove('hidden');
    previewBtn.classList.remove('hidden');
});

// Edit existing note
function _editNote(note) {
    // Show these
    homeBtn.classList.remove('hidden');
    editBtn.classList.remove('hidden');
    textAreaDisplay.classList.remove('hidden');
    deleteBtn.classList.remove('hidden');
    saveBtn.classList.remove('hidden');

    // Hide these
    main.classList.add('hidden');
    addBtn.classList.add('hidden');
    textArea.classList.add('hidden');

    textAreaDisplay.innerHTML = marked(note.content);
    textArea.value = note.content;
}

function _getNoteTitleFromContent(content) {
    const parsedContent = new DOMParser().parseFromString(marked(content), 'text/html');
    const h1TagEls = parsedContent.getElementsByTagName('h1');

    return h1TagEls[0].innerText;
}

// Editing notes content
editBtn.addEventListener('click', () => {
    // Show These
    textArea.classList.remove("hidden");
    previewBtn.classList.remove("hidden");

    // Hide these
    textAreaDisplay.classList.add("hidden");
    deleteBtn.classList.add("hidden");
    saveBtn.classList.add("hidden");
    editBtn.classList.add("hidden");
});

// Preview notes content in markdown
previewBtn.addEventListener('click', () => {
    textAreaDisplay.classList.remove("hidden");
    textArea.classList.add("hidden");
    editBtn.classList.remove("hidden");
    saveBtn.classList.remove("hidden");
    deleteBtn.classList.remove("hidden");
    previewBtn.classList.add("hidden");

    textAreaDisplay.innerHTML = marked(textArea.value);
});

// Saving a note to LS
saveBtn.addEventListener('click', () => {
    let noteContentLatest = textArea.value;
    let savedNotes = _getNotesFromLocalStorage();
    let savedNotesLength = savedNotes.length;

    if (noteContentLatest.length <= 0) {
        return;
    }

    if (currNoteId == -1) {
        // This is a new note
        let noteData = {'id': savedNotesLength+1, 'content': noteContentLatest};
        _saveNewNoteToLocalStorage(noteData);
        return;
    }

    savedNotes.forEach(note => {
        if (note.id == currNoteId) {
            note.content = noteContentLatest;
        }
    });

    // Replace new content
    localStorage.setItem('notes', JSON.stringify(savedNotes));
});

// Deleting a note
deleteBtn.addEventListener('click', () => {
    if (currNoteId == -1) {
        textAreaDisplay.innerHTML = '';
        textArea.value = '';
        editBtn.click();
    } else {
        _deleteNoteFromLocalStorage(currNoteId);
        location.reload();
    }
});

// Get notes from LS
function _getNotesFromLocalStorage() {
    let notes = JSON.parse(localStorage.getItem('notes'));
    return notes == null ? [] : notes; 
}

// Save note to LS
function _saveNewNoteToLocalStorage(noteData) {
    let notes = _getNotesFromLocalStorage();
    localStorage.setItem('notes', JSON.stringify([...notes, noteData]));
}

// Delete note from LS
function _deleteNoteFromLocalStorage(noteId) {
    let notes = _getNotesFromLocalStorage();
    localStorage.setItem('notes', JSON.stringify(notes.filter(note => note.id != noteId)));
}