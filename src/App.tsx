// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import davidUniqueId from "david-unique-id";

interface Feedback {
  id: number; // Changed to string since `davidUniqueId` returns a string
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

const App: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk"
        );
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddFeedback = async () => {
    const feedbackData: Feedback = {
      title,
      description,
      id: davidUniqueId(),
    };

    if (editIndex !== null) {
      // Editing existing feedback
      const updatedFeedbacks = feedbacks.map((feedback, index) =>
        index === editIndex ? { ...feedback, title, description } : feedback
      );

      const updateFeedback = updatedFeedbacks[editIndex];
      try {
        const response = await axios.patch(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk",
          [updateFeedback]
        );
        if (response.status === 200) alert("Updated successfully");

        setFeedbacks(updatedFeedbacks);
        setEditIndex(null);
      } catch (error) {
        console.log(error);
      }
    } else {
      // Adding new feedback
      try {
        const response = await axios.post(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk",
          [feedbackData]
        );
        if (response.status === 200) {
          alert("Added successfully");
          setFeedbacks([...feedbacks, feedbackData]);
        }
      } catch (error) {
        console.error("Error adding feedback:", error);
      }
    }

    setTitle("");
    setDescription("");
  };

  const handleEdit = (index: number) => {
    const feedback = feedbacks[index];
    setTitle(feedback.title);
    setDescription(feedback.description);
    setEditIndex(index);
  };

  const handleDelete = async (index: number) => {
    const updatedFeedbacks = feedbacks.filter((_, i) => i !== index);
    const deleteId: number = feedbacks[index].id;

    try {
      const response = await axios.delete(
        "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk",
        {
          data: [deleteId],
        }
      );

      if (response.status === 200) {
        alert("Deleted successfully");
        setFeedbacks(updatedFeedbacks);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <h1>Feedback App</h1>
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
        onClick={handleAddFeedback}
        fullWidth
        style={{ marginTop: "10px" }}
      >
        {editIndex !== null ? "Update Feedback" : "Add Feedback"}
      </Button>

      <List style={{ marginTop: "20px" }}>
        {feedbacks.map((feedback, index) => (
          <ListItem
            key={feedback.id} // Use feedback.id as the key
            style={{
              backgroundColor: index === editIndex ? "#f0f0f0" : "transparent",
              marginBottom: "10px",
            }}
          >
            <ListItemText primary={feedback.title} secondary={feedback.description} />
            <Button onClick={() => handleEdit(index)}>Edit</Button>
            <Button onClick={() => handleDelete(index)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
