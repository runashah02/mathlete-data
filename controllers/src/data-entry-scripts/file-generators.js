const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const dbConfig = {
  host: "103.45.246.56",
  port: 3306,
  user: "mathlete",
  password: "password",
  database: "mathlete",
};

// Function to generate files based on source_detail
async function generateFiles(moduleId) {
  const conn = await mysql.createConnection(dbConfig);
  const query = `SELECT exercise_title, exercise_desc, source_detail FROM qc_exercises WHERE module_id = ?`;

  console.log(query);
  const [rows] = await conn.execute(query, [moduleId]);

  console.log(rows);
  // Loop through results and create files
  rows.forEach((row) => {
    const fileName = row.source_detail;

    // Sanitize the filename to prevent invalid characters
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, " ");

    // Add a newline character after every full stop in the exercise description
    const formattedDesc = row.exercise_desc ? row.exercise_desc.replace(/\. /g, '.\n') : "";

    // Full path for the file
    const filePath = path.join(__dirname, sanitizedFileName);

    // Content for the file with exercise_title and formatted exercise_desc as comments
    const fileContent = `// ${row.exercise_title}\n// ${formattedDesc}\n`;

    // Create the file with comments
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error(`Error creating file "${sanitizedFileName}":`, err);
      } else {
        console.log(`File created: ${sanitizedFileName}`);
      }
    });
  });

  // Close the database connection
  conn.end(() => {
    console.log("Database connection closed.");
  });
}

// Call the function with the desired module_id
const moduleId = 1; // Replace with the required module_id
generateFiles(moduleId);
