// @ts-nocheck
import type { PageServerLoad } from "../../.svelte-kit/types/src/routes/$types";
import { v4 } from "uuid";

export const load = async ({ url, cookies, request }: Parameters<PageServerLoad>[0]) => {
  let userId = cookies.get("user_id");
  if (!userId) {
    userId = v4();
    cookies.set("user_id", v4(), {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  return {
    userId: userId,
  };
};
