// userId => {question: answer}
import { GeminiService } from "$lib/service/gemini/GeminiService";
interface DB {
  [userId: string]: {
    [question: string]: string;
  };
}
const db: DB = {};

const getAnswer = (userId: string, question: string) => {
  const ans = db[userId][question];
  return ans;
};

const saveResult = (
  userId: string,
  answersString: string,
) => {
  const regex = /(\d+)\.\s+\*\*(.+?)\*\*\s+([\s\S]*?)(?=\n\d+\.|$)/g;
  let match;

  while ((match = regex.exec(answersString)) !== null) {
    const question = match[2].trim();
    const answer = match[3].trim();
    if (!db[userId]) {
      db[userId] = {};
    }
    if (!db[userId][question]) {
      db[userId][question] = answer;
    }
  }

  console.log("hello", JSON.stringify(db));
};

export const QuestionService = {
  getAnswer: getAnswer,
  saveResult: saveResult,
};
