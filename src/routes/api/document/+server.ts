import { type RequestHandler } from "@sveltejs/kit";
import { GeminiService } from "$lib/service/gemini/GeminiService";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const formData = await request.formData();
  const file = formData.get("pdfDocument");
  const userId = cookies.get("user_id")!;
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "Invalid file" }), {
      status: 400,
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const text = buffer.toString("base64");
  await GeminiService.startNewChatWithPdf(userId, 'This is construction plan of the building.', text)
  // await GeminiService.generateContent(userId, text);
  return new Response(JSON.stringify({}), { status: 200 });
};
