import { NewNote } from "./NewNote"
import { Note } from "./Note";
import { useDrop } from "react-dnd"
import { ItemTypes } from "./Constants/ItemTypes"
import { useState, useEffect, createContext } from "react";

export const Resolution = createContext();

export function Board()
{
    function calculateCoords(monitor)
    {
        const diff = monitor.getDifferenceFromInitialOffset();
        const initial = monitor.getInitialSourceClientOffset();
    
        return(
            {
                x: diff.x + initial.x,
                y: diff.y + initial.y
            }
        )
    }

    function deleteNote(id)
    {
        setNotes((notes) => notes.filter((note) => note.id !== id));
    }

    function updateNote(id, xPos, yPos, text, editing)
    {
        setNotes(notes => notes.map(note => {
            if(note.id === id)
            {
                return{
                    ...note,
                    x: xPos,
                    y: yPos,
                    text: text,
                    editing: editing
                };
            }
            else
                return note;
        }));
    }

    const [clientSize, setClientSize] = useState({height: window.innerHeight, width: window.innerWidth});
    const [notes, setNotes] = useState(localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : []);
    const [{}, drop] = useDrop(() => ({
        accept: [ItemTypes.NOTE, ItemTypes.NEW_NOTE],
        drop: (item,monitor) => {
            const coords = calculateCoords(monitor);
            if(monitor.getItemType() === ItemTypes.NEW_NOTE)
            {
                setNotes(notes => [...notes, {id: Date.now(),x: (coords.x / clientSize.width) * 100, y: (coords.y / clientSize.height) * 100, text: "", editing: true}]);
                return {coords: coords, isNew: true};
            }
            else
                return {coords: coords, isNew: false};
        },
    }));

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));

        const resize = () => {
            setClientSize({height: window.innerHeight, width: window.innerWidth});
            window.location.reload();            
        }

        window.addEventListener('resize', resize);

        return () => {window.removeEventListener('resize', resize);}

    },[notes, clientSize]);

    const noteElems = notes.map(note => <Note key={note.id} itemID={note.id} xPos={note.x} yPos={note.y} text={note.text} isEditing={note.editing} updateFunc={updateNote} deleteFunc={deleteNote}></Note>);

    return(
        <Resolution.Provider value={clientSize}>
            <div ref={drop} className="board">
                <NewNote></NewNote>
                {noteElems}
            </div>
        </Resolution.Provider>
    )
}