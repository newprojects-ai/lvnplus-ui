import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import TestResults from '@/components/TestResults';
import { fetchTestResults } from '@/services/testService';
import { Box, CircularProgress, Typography } from '@mui/material';

interface TestResultsPageProps {
  initialTestResult?: any;
  error?: string;
}

const TestResultsPage: React.FC<TestResultsPageProps> = ({ 
  initialTestResult, 
  error 
}) => {
  const router = useRouter();
  const { executionId } = router.query;

  // State for dynamically fetched results
  const [testResult, setTestResult] = React.useState(initialTestResult);
  const [isLoading, setIsLoading] = React.useState(!initialTestResult);

  React.useEffect(() => {
    const loadTestResults = async () => {
      if (!initialTestResult && executionId) {
        try {
          setIsLoading(true);
          const result = await fetchTestResults(Number(executionId));
          setTestResult(result);
        } catch (err) {
          console.error('Failed to fetch test results', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTestResults();
  }, [executionId, initialTestResult]);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !testResult) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error || 'Unable to load test results'}
        </Typography>
      </Box>
    );
  }

  return <TestResults testResult={testResult} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { executionId } = context.params || {};

  try {
    const testResult = await fetchTestResults(Number(executionId));
    return { 
      props: { 
        initialTestResult: testResult 
      } 
    };
  } catch (error) {
    console.error('Server-side test results fetch error:', error);
    return { 
      props: { 
        error: 'Failed to fetch test results' 
      } 
    };
  }
};

export default TestResultsPage;
