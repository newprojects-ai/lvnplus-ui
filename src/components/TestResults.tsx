import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface TestResultsProps {
  testResult: {
    executionId: string;
    testPlanId: string;
    studentId: string;
    status: string;
    startedAt: string;
    score: number;
    testData: {
      totalQuestions: number;
      correctAnswers: number;
      questions: {
        question_id: number;
        subtopic_id: number;
        question_text: string;
        options: string[];
        difficulty_level: number;
        correct_answer: string;
        correct_answer_plain: string;
      }[];
      responses: {
        question_id: number;
        student_answer: string;
        is_correct: boolean;
        time_spent: number;
      }[];
    };
  };
}

const TestResults: React.FC<TestResultsProps> = ({ testResult }) => {
  // Add a safety check
  if (!testResult) {
    console.error('No test result data provided');
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" color="error" align="center">
            No test results available
          </Typography>
        </Paper>
      </Container>
    );
  }

  console.log('Test Result Data:', testResult);

  const { executionId, testPlanId, studentId, status, startedAt, score, testData } = testResult;
  const { totalQuestions, correctAnswers, questions, responses } = testData;

  // Calculate test duration
  const startTime = new Date(startedAt);
  const endTime = new Date();
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  // Pie chart data
  const pieChartData = [
    { 
      name: 'Correct', 
      value: correctAnswers, 
      color: '#4CAF50' 
    },
    { 
      name: 'Incorrect', 
      value: totalQuestions - correctAnswers, 
      color: '#F44336' 
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Test Results
        </Typography>
        
        <Grid container spacing={3}>
          {/* Summary Statistics */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Performance Overview</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={`Score: ${score}%`} 
                  color={score >= 60 ? 'success' : 'error'} 
                />
              </Box>
            </Box>
          </Grid>

          {/* Detailed Statistics */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6">Test Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>
                  Total Questions: {totalQuestions}
                </Typography>
                <Typography>
                  Correct Answers: {correctAnswers}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  Started: {startTime.toLocaleString()}
                </Typography>
                <Typography>
                  Duration: {durationMinutes} minutes
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Detailed Question Breakdown */}
            <Typography variant="h6">Question Breakdown</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Your Answer</TableCell>
                    <TableCell>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {responses.map((response, index) => {
                    const question = questions.find(
                      q => q.question_id === response.question_id
                    );
                    
                    return (
                      <TableRow key={response.question_id}>
                        <TableCell>{question?.question_text}</TableCell>
                        <TableCell>{response.student_answer}</TableCell>
                        <TableCell>
                          {response.is_correct ? (
                            <CheckCircleOutlineIcon color="success" />
                          ) : (
                            <HighlightOffIcon color="error" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TestResults;
