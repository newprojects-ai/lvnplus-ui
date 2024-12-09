# Year 7 Mathematics Learning Platform - API Requirements

## Base Configuration
- Base URL: `/api`
- Content-Type: `application/json`
- Authentication: JWT Bearer token
- CORS: Enable with credentials support

## Authentication Endpoints

### 1. Login
- **POST** `/auth/login`
```typescript
Request:
{
  email: string;
  password: string;
}

Response:
{
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
  token: string;
}
```

### 2. Register
- **POST** `/auth/register`
```typescript
Request:
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  parentId?: string;
}

Response: Same as login
```

## Test Management Endpoints

### 1. Test Plans

#### Create Test Plan
- **POST** `/tests/plans`
```typescript
Request:
{
  templateId?: number;
  boardId: number;
  testType: 'TOPIC' | 'MIXED' | 'MENTAL_ARITHMETIC';
  timingType: 'TIMED' | 'UNTIMED';
  timeLimit?: number;
  studentId: number;
  plannedBy: number;
  configuration: {
    topics: number[];
    subtopics: number[];
    questionCounts: Record<string, number>;
  }
}

Response:
{
  testPlanId: number;
  // ... all fields from request
  plannedAt: string;
}
```

#### Get Test Plan
- **GET** `/tests/plans/{planId}`
```typescript
Response: TestPlan
```

#### Update Test Plan
- **PATCH** `/tests/plans/{planId}`
```typescript
Request: Partial<TestPlan>
Response: TestPlan
```

#### Delete Test Plan
- **DELETE** `/tests/plans/{planId}`
```typescript
Response: 204 No Content
```

### 2. Test Executions

#### Create Execution
- **POST** `/tests/plans/{planId}/executions`
```typescript
Response:
{
  executionId: number;
  testPlanId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  startedAt: string;
  testData: {
    questions: Array<{
      id: number;
      content: string;
      options?: string[];
      topicId: number;
      subtopicId: number;
      difficulty: 'easy' | 'medium' | 'hard';
    }>;
    responses: Record<string, string>;
    timingData: {
      startTime: number;
      endTime?: number;
      pausedDuration?: number;
    };
  };
  score?: number;
}
```

#### Get Execution
- **GET** `/tests/executions/{executionId}`
```typescript
Response: TestExecution
```

#### Submit Answer
- **POST** `/tests/executions/{executionId}/answers`
```typescript
Request:
{
  questionId: string;
  answer: string;
}

Response: 204 No Content
```

#### Complete Test
- **POST** `/tests/executions/{executionId}/complete`
```typescript
Response:
{
  id: string;
  testSessionId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
  accuracy: number;
  topicPerformance: Array<{
    topicId: string;
    correct: number;
    total: number;
    accuracy: number;
  }>;
}
```

#### Pause Test
- **POST** `/tests/executions/{executionId}/pause`
```typescript
Response: TestExecution with updated status
```

#### Resume Test
- **POST** `/tests/executions/{executionId}/resume`
```typescript
Response: TestExecution with updated status
```

## Questions Management

### Get Questions by Topics
- **GET** `/questions`
```typescript
Query Parameters:
{
  topicIds: string[];
  subtopicIds: string[];
  count: number;
}

Response:
Array<{
  id: string;
  content: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  topicId: string;
  subtopicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}>
```

## Topics Management

### Get Topics
- **GET** `/topics`
```typescript
Query Parameters:
{
  subjectId: number;  // e.g., 1 for mathematics
}

Response:
Array<{
  id: string;
  name: string;
  subtopics: Array<{
    id: string;
    name: string;
    topicId: string;
  }>;
}>
```

## Error Handling

All endpoints should return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

Error Response Format:
```typescript
{
  message: string;
  errors?: Record<string, string[]>;
}
```

## Security Requirements

1. Authentication:
   - JWT tokens with expiration
   - Refresh token mechanism
   - Secure token storage

2. Authorization:
   - Role-based access control
   - Route protection
   - Resource ownership validation

3. Data Validation:
   - Input sanitization
   - Request payload validation
   - Type checking

4. CORS Configuration:
   - Allow credentials
   - Whitelist frontend origin
   - Proper header handling