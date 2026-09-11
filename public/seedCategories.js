// seedCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const PostCategory = require('./model/PostCategory'); // adapte le chemin


const categories = [
    { name: "Technology", icon: "", desc: "" },
    { name: "News",       icon: "", desc: "" },
    { name: "Lifestyle",  icon: "", desc: "" },
  ];

async function seed() {
  try {
    await connectDB();
    await PostCategory.deleteMany();      // vide d'abord
    await PostCategory.insertMany(categories);
    console.log("✅ Categories seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
