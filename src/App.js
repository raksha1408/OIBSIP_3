import React, { useState, useRef } from 'react';
import './App.css';

const categoriesList = ['Home', 'Personal', 'School', 'Kids', 'Office', 'Miscellaneous'];

const categoryColors = {
  Home: 'rgb(161 185 138)',
  Personal: 'rgb(232 189 125)',
  School: '#90ee90',
  Kids: 'rgb(180 225 255)',
  Office: '#9370db',
  Miscellaneous: 'rgb(228 168 201)'
};

const TodoItem = ({ item, category, handleMarkAsDone, handleDelete }) => {
  const todoStyle = {
    backgroundColor: categoryColors[category],
  };

  return (
    <div className={`todo-item ${item.done ? 'done' : ''}`} style={todoStyle}>
      <span className="todo-time">
        {item.timeAdded.toLocaleTimeString()}
      </span>
      <span className="todo-text">
        {item.text}
      </span>
      {!item.done ? (
        <button onClick={() => handleMarkAsDone(category, item)}>Mark as Done</button>
      ) : (
        <span>Done</span>
      )}
      <button onClick={() => handleDelete(category, item)}>Delete</button>
    </div>
  );
};

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const newTaskSound = useRef(null);

  const handleMarkAsDone = (category, todo) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((t) =>
        t === todo ? { ...t, done: !t.done } : t
      );
      return updatedTodos;
    });
  };

  const handleDelete = (category, todo) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((t) => t !== todo);
      updateCategories(updatedTodos);
      return updatedTodos;
    });
  };

  const updateCategories = (updatedTodos) => {
    const updatedCategories = [...new Set(updatedTodos.map((todo) => todo.category))];
    setCategories(updatedCategories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '' || selectedCategory.trim() === '') return;
    const newTodoItem = {
      text: newTodo,
      done: false,
      timeAdded: new Date(),
      category: selectedCategory,
    };
    
    const updatedTodos = [...todos, newTodoItem];
    setTodos(updatedTodos);
    setNewTodo('');

    // Update categories list
    const updatedCategories = [...new Set(updatedTodos.map((todo) => todo.category))];
    setCategories(updatedCategories);

    // Play the new task sound effect
    newTaskSound.current.play();
  };

  const handleClearCategory = (category) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((todo) => todo.category !== category);
      updateCategories(updatedTodos);
      return updatedTodos;
    });
  };

  const handleClearAll = () => {
    setTodos([]);
    setCategories([]);
  };

  const filterTodosByCategory = (category) => {
    return todos.filter((todo) => todo.category === category);
  };

  return (
    <div className="App">
      <div className="todo-title">
        <h1>MY TO-DO LIST</h1>
      </div>

      <div className="todo-content">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new todo..."
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categoriesList.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button type="submit">Add</button>
            {categories.length > 0 && (
              <button id="clear-all-btn" onClick={handleClearAll} className="custom-button">
                Clear All
              </button>
            )}
          </div>
        </form>
        {categories.map((category) => (
          <div key={category}>
            <h2>
              {category}
              <button
                className="clear-category-button"
                onClick={() => handleClearCategory(category)}
              >
                Clear Category
              </button>
            </h2>
            {filterTodosByCategory(category).map((todo) => (
              <TodoItem
                key={todo.text}
                item={todo}
                category={category}
                handleMarkAsDone={handleMarkAsDone}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        ))}
      </div>
      <audio ref={newTaskSound}>
        {/* ... (previous code) */}
      </audio>
    </div>
  );
}

export default App;
