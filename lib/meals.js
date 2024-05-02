import fs from "node:fs";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

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

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const buffuredImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(buffuredImage), (error) => {
    if (error) {
      throw new Error("saving image failed");
    }
  });

  meal.image = `/images/${fileName}`;
  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title, 
      @summary, 
      @instructions, 
      @creator, 
      @creator_email, 
      @image, 
      @slug
    )`
  ).run(meal);
}
