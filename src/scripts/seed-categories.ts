import { db } from "@/db";
import { categories } from "@/db/schema";
import { sql } from "drizzle-orm"; // 👈 IMPORTANT

const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Entertainment",
  "Film and animation",
  "Gaming",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
  "Videoblogging",
];

async function main() {
  console.log("Seeding categories...");

  const values = categoryNames.map((name) => ({
    name,
    description: `Videos related to ${name.toLowerCase()}`,
  }));

  await db
    .insert(categories)
    .values(values)
    .onConflictDoUpdate({
      target: categories.name,
      set: {
        description: sql`excluded.description`,
        updatedAt: new Date(),
      },
    });

  console.log("Categories seeded successfully");
  process.exit(0);
}

main();
