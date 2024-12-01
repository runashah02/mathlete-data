const { google } = require('googleapis');
const path = require('path');
const mysql = require("mysql2/promise");
const dbService = require("../dbService");
const dbConfig = dbService.dbConfig;

// Path to your service account key file
const KEYFILEPATH = path.join(__dirname, 'google-api-credentials.json');

// Scopes for Google Drive and Sheets API
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/spreadsheets.readonly'];

// Authenticate using the service account key file
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
});

const drive = google.drive({ version: 'v3', auth });
const sheets = google.sheets({ version: 'v4', auth });

// Replace 'your-folder-id' with the actual folder ID
const folderId = '1xb_SaElkdCrbUn_1kKCjDtWC9kG7NfLx';

async function listFilesInFolder(folderId, fileName, sheetName) {
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents`,
            fields: 'files(id, name)',
            orderBy: 'name'
        });
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            for (const file of files) {
                console.log(`${file.name} (${file.id})`);
                if (file.name == fileName) await listSheetsInFile(file.id, sheetName);
            }
        } else {
            console.log('No files found.');
        }
    } catch (err) {
        console.error('Error listing files:', err);
    }
}

async function listSheetsInFile(spreadsheetId, reqSheetName) {
    try {
        const res = await sheets.spreadsheets.get({
            spreadsheetId,
        });
        const sheetNames = res.data.sheets.map(sheet => sheet.properties.title);
        console.log(`Sheets in spreadsheet ${spreadsheetId}:`);
        let order = 5;
        for (const sheetName of sheetNames) {
            if (sheetName == reqSheetName) {
            console.log(` - ${sheetName}`);
                let moduleId = await addModule(sheetName, order);
                order = order + 5;
                await displaySheetData(spreadsheetId, sheetName, moduleId);
            }
        }
    } catch (err) {
        console.error(`Error listing sheets in file ${spreadsheetId}:`, err);
    }
}

async function addModule(moduleName, order) {
    /*
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        await conn.beginTransaction();
        const [result] = await conn.query(
            "INSERT INTO qc_modules (subject_id, module_name, module_order_no) VALUES (?, ?, ?)",
            [1, moduleName, order]
        );
        await conn.commit();
        return result.insertId; // Return the inserted ID or any other necessary data
    } catch (error) {
        if (conn) {
            await conn.rollback();
        }
        throw error;
    } finally {
        if (conn) {
            await conn.end();
        }
    }*/
}

async function addTopic(moduleId, topicTitle, order, grades) {
    /*let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        conn.beginTransaction();
        const [result] = await conn.query(
            `INSERT INTO qc_topics (module_id, topic_title, is_milestone_topic, topic_order_no, topic_status) VALUES (?, ?, ?, ?, ?)`, [moduleId, topicTitle, 'YES', order, 'CURRENT']
        );

        let gradeArr = grades.split(",");
        for (let i = 0; i < gradeArr.length; ++i) {
            if (gradeArr[i]) {
                await conn.query(
                    `INSERT INTO qc_topic_grades (topic_id, grade) VALUES (?, ?)`, [result.insertId, gradeArr[i]]
                );
            }
        }
        await conn.commit();
        return result.insertId;;
    } catch (error) {
        if (conn) {
            await conn.rollback();
        }
        throw error;
    } finally {
        if (conn) {
            await conn.end();
        }
    }*/
}

async function deleteAllData() {
    /*
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        conn.beginTransaction();
        await conn.query(`DELETE FROM qc_topic_grades where topic_grade_id < 10000`);
        await conn.execute(`ALTER TABLE qc_topic_grades AUTO_INCREMENT = 1`);
        await conn.query(`DELETE FROM qc_topics where topic_id < 10000`);
        await conn.execute(`ALTER TABLE qc_topics AUTO_INCREMENT = 1`);
        await conn.query(`DELETE FROM qc_modules where module_id < 10000`);
        await conn.execute(`ALTER TABLE qc_modules AUTO_INCREMENT = 1`);
        await conn.commit();
    } catch (error) {
        if (conn) {
            await conn.rollback();
        }
        throw error;
    } finally {
        if (conn) {
            await conn.end();
        }
    }*/
}

async function displaySheetData(spreadsheetId, sheetName, moduleId) {
    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName,
        });
        const rows = res.data.values;
        if (rows && rows.length) {
            console.log(`Data in sheet ${sheetName}:`);
            let order = 5;
            for (let i = 0; i < rows.length; ++i) {
                let row = rows[i];
                if (row.length >= 2) {
                    const topic = row[0] || 'Undefined Topic';
                    const grades = row[1] || 'Undefined Grades';
                    await addTopic(moduleId, topic, order, grades);// add a row in topics, add rows in topic_grades
                    //if (grades == 'Undefined Grades') {
                        console.log(`\tTopic: ${topic} \tGrades: ${grades}`);
                    //}

                }
            }
        } else {
            console.log(`No data found in sheet ${sheetName}.`);
        }
    } catch (err) {
        console.error(`Error getting data from sheet ${sheetName} in file ${spreadsheetId}:`, err);
    }



}

console.log("Listing files in folder...");
//deleteAllData();
listFilesInFolder(folderId, "01Arithmetic Topics", "Comparing Numbers", moduleId);
