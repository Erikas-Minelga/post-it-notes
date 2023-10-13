import { ItemTypes } from "./Constants/ItemTypes";
import { useDrag } from "react-dnd";

export function NewNote()
{
    const[{}, drag] = useDrag(() => ({
        type: ItemTypes.NEW_NOTE,
    }));
    
    return(
        <div ref={drag} 
        className="new-note"
        style={{
            position: 'absolute',
            left: 50,
            top: 50,
            cursor: 'grab',
        }}
        >
            <p>Drag me and drop me anywhere to create a new note</p>
        </div>
    )
}