import {db} from "@/db"
import {categories} from "@/db/schema"

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
     "Pets and animales",
     "Science and technology",
     "Sports",
     "Travel and events",
];

async function main() {
    console.log("Seeding categories");

    try{
    const values = categoryNames.map((name) => ({
        name,
        description: `Videos related to ${name.toLocaleLowerCase()}`,
    }));

    await db.insert(categories).values(values);
    console.log("Categories seeded successfully");

    }catch (error) {
        console.error("Error seeding categories: ", error);
        process.exit(1);
    }
}

main();