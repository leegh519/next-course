import sql from "better-sqlite3";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  //   throw new Error("Error!!!");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  //   throw new Error("Error!!!");
  // sql injection 막기 위해 string에 이어붙이지 않음
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}
