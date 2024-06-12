"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

function invalidCheck(text) {
  return !text.trim() || text.trim() === "";
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
    invalidCheck(meal.title) ||
    invalidCheck(meal.summary) ||
    invalidCheck(meal.instructions) ||
    invalidCheck(meal.creator) ||
    invalidCheck(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return { message: "All fields are required" };
  }

  await saveMeal(meal);
  redirect("/meals");
}
