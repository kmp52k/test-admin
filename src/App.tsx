import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from '@aws-amplify/ui-react'
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";

const initialState = { name: "", description: "" };

function App() {
  const [formState, setFormState] = useState<typeof initialState>(initialState);
  const [todos, setTodos] = useState<any>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key: any, value: any) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql<any>(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
      <div style={styles.container as any}>
        <h2>Amplify Todos</h2>
        <input
          onChange={(event) => setInput("name", event.target.value)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <input
          onChange={(event) => setInput("description", event.target.value)}
          style={styles.input}
          value={formState.description}
          placeholder="Description"
        />
        <button style={styles.button} onClick={addTodo}>
          Create Todo
        </button>
        {todos.map((todo: any, index: number) => (
          <div key={todo.id ? todo.id : index} style={styles.todo as any}>
            <p style={styles.todoName}>Name: {todo.name}</p>
            <p style={styles.todoDescription}>
              Description: {todo.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todo: {
    margin: "4px 0px",
    padding: "8px 16px",
    border: "1px solid",
    textAlign: "left",
  },
  todoName: { fontSize: 20, fontWeight: "bold", margin: 0, marginBottom: 4 },
  todoDescription: { margin: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

export default withAuthenticator(App);
