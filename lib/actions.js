// server action 생성
"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: "invalid input",
    };
  }

  await saveMeal(meal);
  // nextjs는 npm run build시에 서버 컴포넌트를 미리 정적페이지로 만들어
  // 캐싱하기 때문에 페이지 데이터 갱신이 안일어남
  // 그래서 캐시를 리프레시 시키는 로직임
  revalidatePath("/meals");
  redirect("/meals");
}
