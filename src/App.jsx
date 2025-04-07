import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    const storedTheme = localStorage.getItem("theme");

    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (e) {
        console.error("Failed to parse todos:", e);
      }
    }

    if (storedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  // Save todos
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.body.classList.toggle("dark", newMode);
  };

  // Add todo
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
      isEditing: false,
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Toggle completion
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Edit todo
  const submitEdits = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
      )
    );
  };

  return (
    <>
      <button className="toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <h1>Todo List</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="todoAdd"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a task..."
          />
          <button type="submit">Add</button>
        </form>

        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {todo.isEditing ? (
                <input
                  type="text"
                  defaultValue={todo.text}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitEdits(todo.id, e.target.value);
                    }
                  }}
                />
              ) : (
                <>
                  <span
                    onClick={() => toggleComplete(todo.id)}
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#999" : "#333",
                    }}
                  >
                    {todo.text}
                  </span>
                  <div className="button-group">
                    <button className="delete" onClick={() => deleteTodo(todo.id)}>Delete</button>
                    <button className="edit" onClick={() =>
                      setTodos(
                        todos.map((t) =>
                          t.id === todo.id
                            ? { ...t, isEditing: true }
                            : t
                        )
                      )
                    }>
                      Edit
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <footer>Made By Satyam Singh</footer>
      </div>
    </>
  );
};

export default App;
