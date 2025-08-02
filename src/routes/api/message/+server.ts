import { type RequestHandler } from "@sveltejs/kit";
import { QuestionService } from "$lib/service/question/QuestionService";
import {GeminiService} from "$lib/service/gemini/GeminiService";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const data = await request.json();
  const userId = cookies.get("user_id")!;
  const result = await GeminiService.search(userId, data.message)
  // const result = QuestionService.getAnswer(userId, data.message);
  return new Response(
    JSON.stringify({
      answer: result.response.text()
    }),
    { status: 200 },
  );
};
