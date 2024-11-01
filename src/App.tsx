// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import axios from "axios";
interface Todo {
  _id?: string;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

const App: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let getFeedback = await axios.get(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk"
        );
        setTodos(getFeedback.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddTodo = async () => {
    let feedbackData = {
      title,
      description,
    };
    if (editIndex !== null) {
      // Editing existing todo
      const updatedTodos = todos.map((todo, index) =>
        index === editIndex ? { ...todo, title, description } : todo
      );
      console.log(editIndex, "editIndex");
      console.log(updatedTodos, "updatedTodos");
      let getUpdateFeedbackId = updatedTodos[editIndex]._id;
      try {
        let getFeedback = await axios.patch(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk" +
            getUpdateFeedbackId,
          feedbackData
        );
        if (getFeedback.status === 200) alert("updated successfully");

        setTodos(updatedTodos);
        setEditIndex(null);
      } catch (error) {
        console.log(error);
      }
    } else {
      // Adding new todo
      let getFeedback = await axios.post(
        "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk",
        [feedbackData]
      );
      if (getFeedback.status === 200) {
        alert("Added successfully");
      }
      setTodos([...todos, { title, description }]);
    }
    setTitle("");
    setDescription("");
  };

  const handleEdit = (index: number) => {
    const todo = todos[index];
    setTitle(todo.title);
    setDescription(todo.description);
    setEditIndex(index);
  };

  const handleDelete = async (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    let delteid: string | undefined = todos[index]._id;

    // Array of IDs to delete
    let ids = ["6721fd053c494fc6cbe9ed16", "6722107017c813b358d1e25f"];

    try {
      // Pass the IDs in the `data` property of the configuration object
      let getFeedback = await axios.delete(
        "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk",
        {
          data: [delteid],
        }
      );

      if (getFeedback.status === 200) {
        alert("Deleted successfully");
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <h1>Todo App</h1>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddTodo}
        fullWidth
        style={{ marginTop: "10px" }}
      >
        {editIndex !== null ? "Update Todo" : "Add Todo"}
      </Button>

      <List style={{ marginTop: "20px" }}>
        {todos.map((todo, index) => (
          <ListItem
            key={index}
            style={{
              backgroundColor: index === editIndex ? "#f0f0f0" : "transparent",
              marginBottom: "10px",
            }}
          >
            <ListItemText primary={todo.title} secondary={todo.description} />

            <Button onClick={() => handleEdit(index)}>Edit</Button>
            <Button onClick={() => handleDelete(index)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
