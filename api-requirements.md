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

## Gamification Endpoints

### 1. Student Progress

#### Get Progress
- **GET** `/gamification/progress`
```typescript
Response:
{
  userId: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streakDays: number;
  lastActivityDate: string;
  totalPoints: number;
  subjectMastery: Record<string, number>;
}
```

#### Add XP
- **POST** `/gamification/xp`
```typescript
Request:
{
  amount: number;
  source: 'test_completion' | 'achievement' | 'daily_login';
}

Response:
{
  newXP: number;
  totalXP: number;
  level: number;
  leveledUp: boolean;
}
```

#### Update Streak
- **POST** `/gamification/streak`
```typescript
Response:
{
  streakDays: number;
  streakBonus: number;
}
```

### 2. Achievements

#### Get Achievements
- **GET** `/gamification/achievements`
```typescript
Response: Array<{
  id: string;
  title: string;
  description: string;
  category: 'Practice' | 'Performance' | 'Consistency' | 'Mastery';
  requiredCriteria: {
    type: 'TestCount' | 'Score' | 'Streak' | 'TopicMastery';
    target: number;
    progress: number;
  };
  points: number;
  unlockedAt?: string;
}>
```

#### Unlock Achievement
- **POST** `/gamification/achievements/{achievementId}/unlock`
```typescript
Response:
{
  achievement: Achievement;
  xpAwarded: number;
}
```

#### Get Achievement Progress
- **GET** `/gamification/achievements/progress`
```typescript
Response:
{
  achievements: Array<{
    id: string;
    progress: number;
    target: number;
  }>;
}
```

### 3. Rewards

#### Get Available Rewards
- **GET** `/gamification/rewards`
```typescript
Response: Array<{
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'Avatar' | 'Theme' | 'Badge' | 'Certificate';
  unlocked: boolean;
}>
```

#### Purchase Reward
- **POST** `/gamification/rewards/{rewardId}/purchase`
```typescript
Response:
{
  success: boolean;
  newBalance: number;
  unlockedReward: Reward;
}
```

### 4. Level System

#### Get Level Info
- **GET** `/gamification/levels`
```typescript
Response:
{
  currentLevel: number;
  xpProgress: number;
  xpRequired: number;
  availablePerks: string[];
}
```

#### Level Up Notification
- **POST** `/gamification/levels/up`
```typescript
Response:
{
  newLevel: number;
  unlockedRewards: string[];
  xpBonus: number;
}
```

## Database Schema Updates

### 1. Student Progress Table
```sql
CREATE TABLE student_progress (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  next_level_xp INTEGER NOT NULL DEFAULT 1000,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date TIMESTAMP WITH TIME ZONE,
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_progress_user_id ON student_progress(user_id);
```

### 2. Achievements Tables
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  icon VARCHAR(100),
  required_criteria JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_achievements (
  user_id UUID REFERENCES users(id),
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  progress INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, achievement_id)
);

CREATE INDEX idx_student_achievements_user ON student_achievements(user_id);
CREATE INDEX idx_achievements_category ON achievements(category);
```

### 3. Rewards Tables
```sql
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  cost INTEGER NOT NULL,
  icon VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_rewards (
  user_id UUID REFERENCES users(id),
  reward_id UUID REFERENCES rewards(id),
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, reward_id)
);

CREATE INDEX idx_student_rewards_user ON student_rewards(user_id);
CREATE INDEX idx_rewards_category ON rewards(category);
```

### 4. Subject Mastery Table
```sql
CREATE TABLE subject_mastery (
  user_id UUID REFERENCES users(id),
  subject_id UUID REFERENCES subjects(id),
  mastery_level INTEGER NOT NULL DEFAULT 0,
  total_questions_attempted INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  last_test_date TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (user_id, subject_id)
);

CREATE INDEX idx_subject_mastery_user ON subject_mastery(user_id);
```

### 5. Activity Log Table
```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  activity_type VARCHAR(50) NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_user_date ON activity_log(user_id, created_at);
```

### 6. Level Configuration Table
```sql
CREATE TABLE level_config (
  level INTEGER PRIMARY KEY,
  xp_required INTEGER NOT NULL,
  perks JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Populate with initial levels
INSERT INTO level_config (level, xp_required, perks)
VALUES 
  (1, 1000, '{"unlocks": ["basic_achievements"]}'),
  (2, 2000, '{"unlocks": ["daily_challenges"]}'),
  (3, 4000, '{"unlocks": ["special_rewards"]}');
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
```