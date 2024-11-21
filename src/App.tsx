import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid2,
} from "@mui/material";
import axios from "axios";
import davidUniqueId from "david-unique-id";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Feedback {
  id: number; // `davidUniqueId` returns a string
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
  const [errors, setErrors] = useState<{ title?: string; description?: string }>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk"
        );
        setFeedbacks(response.data);
      } catch (error) {
        toast.error("Error fetching feedbacks. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const validateFields = (): boolean => {
    const validationErrors: { title?: string; description?: string } = {};
    if (!title) validationErrors.title = "Name is required.";
    if (!description) validationErrors.description = "Feedback is required.";
    if (description.length < 10)
      validationErrors.description = "Feedback must be at least 10 characters.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleAddFeedback = async () => {
    if (!validateFields()) return;

    const feedbackData: Feedback = {
      title,
      description,
      id: davidUniqueId(),
    };

    if (editIndex !== null) {
      const updatedFeedbacks = feedbacks.map((feedback, index) =>
        index === editIndex ? { ...feedback, title, description } : feedback
      );
      try {
        const response = await axios.patch(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk",
          [updatedFeedbacks[editIndex]]
        );
        if (response.status === 200) toast.success("Updated successfully.");
        setFeedbacks(updatedFeedbacks);
        setEditIndex(null);
      } catch (error) {
        toast.error("Error updating feedback. Please try again.");
      }
    } else {
      try {
        const response = await axios.post(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk",
          [feedbackData]
        );
        if (response.status === 200) {
          toast.success("Feedback added successfully.");
          setFeedbacks([...feedbacks, feedbackData]);
        }
      } catch (error) {
        toast.error("Error adding feedback. Please try again.");
      }
    }

    setTitle("");
    setDescription("");
    setErrors({});
  };

  const handleEdit = (index: number) => {
    const feedback = feedbacks[index];
    setTitle(feedback.title);
    setDescription(feedback.description);
    setEditIndex(index);
    setErrors({});
  };

  const handleDelete = async (index: number) => {
    const deleteId = feedbacks[index].id;
    const updatedFeedbacks = feedbacks.filter((_, i) => i !== index);

    try {
      const response = await axios.delete(
        "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk",
        { data: [deleteId] }
      );
      if (response.status === 200) {
        toast.success("Feedback deleted successfully.");
        setFeedbacks(updatedFeedbacks);
        setEditIndex(null);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      toast.error("Error deleting feedback. Please try again.");
    }
  };

  const isDisabled = (title: string): boolean => {
    const lowerCaseTitle = title?.toLocaleLowerCase();
    return (
      lowerCaseTitle === "subramanian" ||
      lowerCaseTitle === "karthick raja" ||
      lowerCaseTitle === "surendar"
    );
  };

  return (
    <>
      <ToastContainer />
      <Container maxWidth="sm" style={{ marginTop: "20px" }}>
        <h1>Share your Feedback</h1>
        <TextField
          label="Your Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          label="Your Feedback"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description}
        />
        <Button
          variant="contained"
          onClick={handleAddFeedback}
          fullWidth
          style={{
            marginTop: "10px",
            backgroundColor: editIndex !== null ? "#3d6efaf5" : "#2e7d32",
            color: "#fff",
          }}
        >
          {editIndex !== null ? "Update Feedback" : "Add Feedback"}
        </Button>
        <Grid2 style={{ height: "225px", overflowY: "scroll", marginTop: "20px" }}>
          <List>
            {feedbacks.map((feedback, index) => (
              <ListItem
                key={feedback.id}
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
                  disabled={isDisabled(feedback.title)}
                  onClick={() => handleEdit(index)}
                  style={{
                    backgroundColor: "#f4e563",
                    color: "#333",
                    marginRight: "8px",
                  }}
                >
                  Edit
                </Button>
                <Button
                  disabled={isDisabled(feedback.title)}
                  onClick={() => handleDelete(index)}
                  style={{
                    backgroundColor: "#ffcdd2",
                    color: "#b71c1c",
                  }}
                >
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid2>
      </Container>
    </>
  );
};

export default App;
