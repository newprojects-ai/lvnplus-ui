/**
 * Distributes a total number of questions across difficulty levels 1-5
 * @param totalQuestions Total number of questions to distribute
 * @returns Object with difficulty levels as keys and question counts as values
 */
export function distributeQuestions(totalQuestions: number): Record<string, number> {
  const difficultyLevels = [1, 2, 3, 4, 5];
  const distribution: Record<string, number> = {};
  
  // Calculate base questions per difficulty using floor division
  const baseQuestions = Math.floor(totalQuestions / difficultyLevels.length);
  
  // Calculate remainder to distribute
  const remainingQuestions = totalQuestions % difficultyLevels.length;
  
  // Distribute base questions and remainders
  difficultyLevels.forEach((level, index) => {
    // Add extra question from remainder if available
    const extra = index < remainingQuestions ? 1 : 0;
    distribution[level.toString()] = baseQuestions + extra;
  });
  
  return distribution;
}
