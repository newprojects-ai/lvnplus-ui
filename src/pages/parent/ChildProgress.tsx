import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { parentApi } from '../../api/parent.api';
import { PerformanceChart } from './components/PerformanceChart';
import { SubjectPerformance } from './components/SubjectPerformance';
import { LearningGoals } from './components/LearningGoals';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const ChildProgress: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [childData, setChildData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!childId) return;

      try {
        const [child, performance] = await Promise.all([
          parentApi.getLinkedChild(childId),
          parentApi.getChildPerformance(childId),
        ]);

        setChildData({
          ...child,
          performance,
        });
      } catch (error) {
        console.error('Error fetching child data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [childId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading || !childData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {childData.firstName} {childData.lastName}'s Progress
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Grade {childData.gradeLevel} • {childData.school}
        </Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="progress tabs">
          <Tab label="Overview" />
          <Tab label="Subjects" />
          <Tab label="Learning Goals" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Trend
              </Typography>
              <Box height={300}>
                <PerformanceChart childId={childId} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <SubjectPerformance childId={childId} subjects={childData.subjects} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <LearningGoals childId={childId} goals={childData.learningGoals} />
      </TabPanel>
    </Container>
  );
};
