import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "$env/static/private";
import { allPossibleQuestions } from "$lib/service/question/QuestionConstant";
import { QuestionService } from "$lib/service/question/QuestionService";

// assume that this is cache or db
const chatSessions = new Map<string, any>();

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-pro"
});

const getOrCreateChat = (userId: string) => {
  let chat = chatSessions.get(userId);
  if (!chat) {
    chat = geminiModel.startChat();
    chatSessions.set(userId, chat);
  }
  return chat;
};

const search = async (userId: string, message: string) => {
  let chat = getOrCreateChat(userId);
  return await chat.sendMessage(message);
};

const generateContent = async (userId: string, base64Pdf: string) => {
  const text = allPossibleQuestions
    .map((q, index) => `${index + 1}. ${q}`)
    .join("\n");
  const finalText =
    "This is construction plan of the building.\n" + text;
  const parts = [
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64Pdf,
      },
    },
    {
      text: finalText,
    },
  ];

  console.log('finalText', finalText)
  console.log()
  const result = await geminiModel.generateContent({
    contents: [{ role: "user", parts }],
  });
  console.log('result', result.response.text())
  QuestionService.saveResult(userId, result.response.text());
};

const startNewChatWithPdf = async (
  userId: string,
  prompt: string,
  base64Pdf: string,
) => {
  const chat = geminiModel.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Pdf,
            },
          },
          { text: prompt },
        ],
      },
    ],
  });

  chatSessions.set(userId, chat);

  // Get the response from the initial prompt and PDF
  // Note: We don't need to send another message. The response is generated on start.
  const result = await chat.getHistory();
  return result;
};

export const GeminiService = {
  search: search,
  startNewChatWithPdf: startNewChatWithPdf,
  generateContent: generateContent,
};
