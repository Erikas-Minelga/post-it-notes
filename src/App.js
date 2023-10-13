import './App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import { Board } from './Board';

function App() {

  function isMobile()
  {
    return navigator.maxTouchPoints === 1;    //1 touchpoint- mobile, 0 touchpoints- mouse and keyboard
  }

  return (
    <DndProvider backend={isMobile() ? TouchBackend : HTML5Backend}>
      <Board></Board>
    </DndProvider>
  );
}

export default App;
