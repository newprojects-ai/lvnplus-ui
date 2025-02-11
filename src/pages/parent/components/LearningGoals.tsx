import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { LearningGoal } from '../../../types/parent';

interface LearningGoalsProps {
  childId: string;
  goals: LearningGoal[];
}

export const LearningGoals: React.FC<LearningGoalsProps> = ({ childId, goals }) => {
  const [open, setOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    description: '',
    subject: '',
    targetDate: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      // Add API call to create new goal
      handleClose();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Learning Goals</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Goal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} key={goal.id}>
            <Paper sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {goal.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Subject: {goal.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip
                  label={goal.status}
                  color={getStatusColor(goal.status)}
                  size="small"
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Learning Goal</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={newGoal.subject}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, subject: e.target.value })
                    }
                    label="Subject"
                  >
                    {/* Add mapped subject options */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Target Date"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetDate: e.target.value })
                  }
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Goal
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
