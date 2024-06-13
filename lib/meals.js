import sql from "better-sqlite3";
import { error } from "node:console";
import fs from "node:fs";
import slugify from "slugify";
import { buffer } from "stream/consumers";
import XSS from "xss";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); //adding delay to add loading functionality
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  try {
    console.log(`Fetching meal with slug: ${slug}`);
    const meal = db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
    if (!meal) {
      throw new Error(`Meal not found for slug: ${slug}`);
    }
    return meal;
  } catch (error) {
    console.error(`Error fetching meal: ${error.message}`);
    return null; // Or handle the error appropriately
  }
}

export async function saveMeal(meal) {
    // Generate a URL-friendly slug from the meal title and convert it to lowercase
    // This makes the meal title suitable for URLs and file names
    meal.slug = slugify(meal.title, { lower: true });
    
    // Sanitize the meal instructions to prevent XSS (Cross-Site Scripting) attacks
    // Ensures that the instructions don't contain any malicious code
    meal.instructions = XSS(meal.instructions);
  
    // Extract the file extension from the original image file name
    // This is used to maintain the correct file format when saving the image
    const extec = meal.image.name.split(".").pop();
    
    // Create a new file name using the slug and the extracted file extension
    // Ensures the file name is unique and easily associated with the meal
    const fileName = `${meal.slug}.${extec}`;
  
    // Create a writable stream to the specified file path in the 'public/images' directory
    // The writable stream allows writing data in chunks to a file, which is memory efficient
    const stream = fs.createWriteStream(`public/images/${fileName}`);
    
    // Convert the image to a buffer for writing
    // The arrayBuffer method converts the image to a binary data buffer
    const bufferedImage = await meal.image.arrayBuffer();
    
    // Write the buffer to the file stream
    // Buffer.from converts the ArrayBuffer to a Buffer, and stream.write writes this buffer to the file
    // The error callback handles any errors that occur during the write operation
    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        // If an error occurs during writing, throw an error
        // Ensures that any write errors are properly handled and reported
        throw new Error("Cannot create a meal");
      }
    });
  
    // Set the image path to be saved in the database
    // This path is relative to the public directory and will be used to access the image later
    meal.image = `/images/${fileName}`;
  
    // Prepare and run the SQL statement to insert the meal data into the database
    // The SQL statement uses parameter placeholders to insert the meal properties
    // db.prepare prepares the statement, and run(meal) executes it with the meal object
    db.prepare(
      `INSERT INTO meals 
          (slug,
           title,
           image,
           summary,
           instructions,
           creator,
           creator_email) 
           VALUES 
           (@slug,
           @title,
           @image,
           @summary,
           @instructions,
           @creator,
           @creator_email)`
    ).run(meal);
  }
  