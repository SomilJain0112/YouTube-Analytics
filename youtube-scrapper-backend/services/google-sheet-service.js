
//./services/googleSheetsService.js
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const auth = new google.auth.GoogleAuth({
    keyFile: "youtubescrapper-431208-79880c50ef01.json",
    scopes: SCOPES,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = '1GXfduwlIDTgyenmA3ooy0wkRledEQUkje0eu4LlcTH4'; // Replace with your spreadsheet ID


export const appendToSheet=async(sheetname,row)=>{

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetname, // Adjust the range as needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [row],
      },
    });

  } catch (error) {
   console.log({ error: error.message });
  }

}
