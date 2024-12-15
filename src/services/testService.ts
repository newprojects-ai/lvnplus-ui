import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const fetchTestResults = async (executionId: number) => {
  try {
    console.log(`Fetching test results for executionId: ${executionId}`);
    console.log(`Full URL: ${API_BASE_URL}/tests/executions/${executionId}/results`);
    
    const response = await axios.get(`${API_BASE_URL}/tests/executions/${executionId}/results`);
    
    console.log('API Response:', response.data);
    
    // Ensure we're returning the correct data structure
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching test results:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};
