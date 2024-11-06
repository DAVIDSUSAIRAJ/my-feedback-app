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
    if(title === "" || description === "") return alert("Please fill in both the name and feedback.");
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
        setTitle("");
        setDescription("");
        setFeedbacks(updatedFeedbacks);
        setEditIndex(null);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <h1>Share your feedback</h1>
      <TextField
        label="Your name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Your feedback"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={handleAddFeedback}
        fullWidth
        style={{
          marginTop: "10px",
          backgroundColor: editIndex !== null ? "#3d6efaf5" : "#2e7d32", // Dark green for update, dark blue for add
          color: "#fff", // White text color for contrast
        }}
      >
        {editIndex !== null ? "Update Feedback" : "Add Feedback"}
      </Button>

      <List style={{ marginTop: "20px" }}>
        {feedbacks.map((feedback, index) => (
          <ListItem
            key={feedback.id} // Use feedback.id as the key
            style={{
              backgroundColor: index === editIndex ? "#EBE4E9" : "#f5f5f5",
              marginBottom: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ListItemText
              primary={feedback.title}
              secondary={feedback.description}
            />
            <Button
              onClick={() => handleEdit(index)}
              style={{
                backgroundColor: "#f4e563", // Light yellow for Edit
                color: "#333", // Dark text for readability
                marginRight: "8px",
                textTransform: "none", // To keep text style simple
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(index)}
              style={{
                backgroundColor: "#ffcdd2", // Light red for Delete
                color: "#b71c1c", // Dark red text for contrast
                textTransform: "none",
              }}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
