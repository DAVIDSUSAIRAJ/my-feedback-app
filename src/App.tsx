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
  const toastDuration =()=>{
    return{
      autoClose: 1300 // 500ms
    }
   }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk"
        );
        setFeedbacks(response.data);
      } catch (error) {
        toast.error("Error fetching feedbacks. Please try again later.",toastDuration());
      }
    };

    fetchData();
  }, []);

  const validateFields = (): boolean => {
    const validationErrors: { title?: string; description?: string } = {};
    if (!title) validationErrors.title = "Name is required.";
    if (description.length < 10)
      validationErrors.description = "Feedback must be at least 10 characters.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      setTitle(value);
      if (value.length > 2) {
        setErrors((prevErrors) => ({ ...prevErrors, title: undefined }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          title: "Name must be at least 3 characters.",
        }));
      }
    }

    if (name === "description") {
      setDescription(value);
      if (value.length >= 10) {
        setErrors((prevErrors) => ({ ...prevErrors, description: undefined }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          description: "Feedback must be at least 10 characters.",
        }));
      }
    }
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
        if (response.status === 200) toast.success("Updated successfully.",toastDuration());
        setFeedbacks(updatedFeedbacks);
        setEditIndex(null);
      } catch (error) {
        toast.error("Error updating feedback. Please try again.",toastDuration());
      }
    } else {
      try {
        const response = await axios.post(
          "https://feedback-1b4u.onrender.com/CRUD/cruds/bulk",
          [feedbackData]
        );
        if (response.status === 200) {
          toast.success("Feedback added successfully.",toastDuration());
          setFeedbacks([...feedbacks, feedbackData]);
        }
      } catch (error) {
        toast.error("Error adding feedback. Please try again.",toastDuration());
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
        toast.success("Feedback deleted successfully.",toastDuration());
        setFeedbacks(updatedFeedbacks);
        setEditIndex(null);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      toast.error("Error deleting feedback. Please try again.",toastDuration());
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
        <h1 style={{ marginBottom: "10px" }}>Share your Feedback</h1>
        <p
          style={{
            color: "#555",
            fontSize: "16px",
            marginBottom: "10px",
            marginTop: "0",
          }}
        >
          Feel free to add, update, or delete your feedback—don't hesitate to
          share your thoughts!
        </p>
        <TextField
          name="title"
          label="Your Name *"
          value={title}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          name="description"
          label="Your Feedback *"
          value={description}
          onChange={handleInputChange}
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
        <Grid2
          style={{ height: "205px", overflowY: "scroll", marginTop: "20px" }}
        >
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
