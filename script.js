const saveButton = document.getElementById("savenote");
const newButton = document.getElementById("newnote");
const noteText = document.getElementById("notetext");
const noteBox = document.getElementById("notebox");

let currentNoteIndex = null;

let notes = JSON.parse(localStorage.getItem("notes")) || [];

notes = notes.map(n => {
    if (typeof n === "string") {
        return {
            title: n.split("\n")[0] || "Untitled Note",
            content: n
        };
    }
    return n;
});

renderNotes();

saveButton.addEventListener("click", () => {
    const text = noteText.value.trim();
    if (text === "") return;

    const updatedNote = {
        title: text.split("\n")[0] || "Untitled Note",
        content: text
    };

    if (currentNoteIndex !== null) {
        notes[currentNoteIndex] = updatedNote;
    } else {
        notes.push(updatedNote);
        currentNoteIndex = notes.length - 1;
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
});

newButton.addEventListener("click", () => {
    noteText.value = "";
    currentNoteIndex = null;
});

function renderNotes() {
    noteBox.innerHTML = "";

    notes.forEach((note) => {

        const index = notes.indexOf(note);

        const button = document.createElement("button");
        button.classList.add("opennote");
        button.textContent = note.title;

        button.addEventListener("click", () => {
            noteText.value = note.content;
            currentNoteIndex = index;
        });

        button.addEventListener("dblclick", () => {
            const newTitle = prompt("Rename note:", note.title);

            if (!newTitle || newTitle.trim() === "") return;

            notes[index].title = newTitle.trim();

            localStorage.setItem("notes", JSON.stringify(notes));
            renderNotes();
        });

        button.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            const confirmDelete = confirm("Delete this note?");

            if (!confirmDelete) return;

            notes.splice(index, 1);

            if (currentNoteIndex === index) {
                noteText.value = "";
                currentNoteIndex = null;
            } else if (currentNoteIndex > index) {
                currentNoteIndex--;
            }

            localStorage.setItem("notes", JSON.stringify(notes));
            renderNotes();
        });

        noteBox.appendChild(button);
    });
}