import { useDrag } from "react-dnd";
import { useState, useEffect, useContext } from "react";
import { ItemTypes } from "./Constants/ItemTypes";
import { Resolution } from "./Board";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck, faPencil } from '@fortawesome/free-solid-svg-icons';

export function Note({itemID,xPos,yPos,text,isEditing,updateFunc,deleteFunc})
{
    const clientSize = useContext(Resolution);
    const [position, setPosition] = useState({x: xPos, y: yPos});
    const [editing, setEditing] = useState(isEditing);
    const [itemText, setItemText] = useState(text);

    const[{}, drag] = useDrag(() => ({
        type: ItemTypes.NOTE,
        end: (item,monitor) => {
            const dropResult = monitor.getDropResult();
            if(dropResult)
            {
                setPosition(position => position = {x: (dropResult.coords.x / clientSize.width) * 100, y: (dropResult.coords.y / clientSize.height) * 100});
                setEditing(editing => editing = dropResult.isNew);
            }
        }
    }));

    useEffect(() => {
        updateFunc(itemID,position.x,position.y,itemText,editing);
    },[position,itemText,editing])
    
    const saveEdit = editing ? <FontAwesomeIcon title="Submit" className="btn" icon={faCheck} onClick={() => setEditing(editing => editing = !editing)}/> : <FontAwesomeIcon title="Edit" className="btn" icon={faPencil} onClick={() => setEditing(editing => editing = !editing)}/>
    const textElem = editing ? <textarea maxLength={500} onKeyDown={e => {if(e.key === "Enter") setEditing(false)}} onInput={e => {setItemText(itemText => itemText = e.target.value)}}>{itemText}</textarea> : <p>{itemText}</p>;

    return(
        <div ref={editing ? null : drag} key={itemID} className={editing ? "note editing" : "note"} 
        style={{
            position: 'absolute',
            top: position.y + 'vh',
            left: position.x + 'vw',
            cursor: 'grab',
        }}
        >
            {saveEdit}
            <FontAwesomeIcon title="Delete" className="btn" icon={faTrash} onClick={() => deleteFunc(itemID)} />
            {textElem}
        </div>
    )
}