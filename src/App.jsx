import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


const ItemType = "ToDo";

function TodoItem({ item, index, moveItem, removeItem }) {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const formatDate = (dateString) => {
    if(!dateString) return "";
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  } 

  return (
    <div ref={(node) => ref(drop(node))} className="taskBar">
      <span>{item.text} - {formatDate(item.date)}</span>
      <button onClick={() => removeItem(index)} className="deleteButton">
                X
      </button>
    </div>
  );
}

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDate, setNewDate] = useState("");

  const addTodo = () => {
    if (newTodo.trim() && newDate) {
      setTodos([...todos, { text: newTodo, date: newDate }]);
      setNewTodo("");
      setNewDate("");
    }
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedTodos = [...todos];
    const [movedItem] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, movedItem);
    setTodos(updatedTodos);
  };

  const removeItem = (index) =>{
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="barTitleArea">
        <h1 className="title">Lista de Tarefas</h1>
        <div className="aroundBar">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="bar"
            placeholder="Adicionar Tarefa..."
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="bar"
            placeholder=""
          />
          <button onClick={addTodo} className="buttonFont">
            Add
          </button>
          

        </div>
          <div>
            {todos.map((todo, index) => (
              <TodoItem 
                key={index} 
                item={todo} 
                index={index} 
                moveItem={moveItem}
                removeItem={removeItem} 
              />
            ))}
          </div>

        
      </div>
    </DndProvider>
  );
}