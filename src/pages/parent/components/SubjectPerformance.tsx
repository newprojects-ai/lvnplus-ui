import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import { Subject } from '../../../types/parent';

interface SubjectPerformanceProps {
  childId: string;
  subjects: Subject[];
}

export const SubjectPerformance: React.FC<SubjectPerformanceProps> = ({
  childId,
  subjects,
}) => {
  return (
    <Grid container spacing={3}>
      {subjects.map((subject) => (
        <Grid item xs={12} md={6} key={subject.id}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">{subject.name}</Typography>
              <Chip
                label={subject.proficiencyLevel}
                color={
                  subject.proficiencyLevel === 'Advanced'
                    ? 'success'
                    : subject.proficiencyLevel === 'Intermediate'
                    ? 'warning'
                    : 'info'
                }
                size="small"
              />
            </Box>

            {subject.focusAreas.map((area, index) => (
              <Box key={index} mb={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2">{area}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(Math.random() * 100)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.round(Math.random() * 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}

            <Box mt={3}>
              <Typography variant="body2" color="text.secondary">
                Recent Topics:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                {subject.focusAreas.map((area, index) => (
                  <Chip
                    key={index}
                    label={area}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
