import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const keyPath = path.join(process.cwd(), 'keys', 'service-account-key.json');
const keyFileContents = fs.readFileSync(keyPath, 'utf8');

const SPREADSHEET_ID = '1ruwUHW3P0A8m6FTNP-595nTl5Pm1e0qeITw1Re3mGbs';
const SHEET_NAME = 'SS606205_new';

export async function GET() {
  try {
    const credentials = JSON.parse(keyFileContents);

    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });
    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    // Process the data to match the CSV structure
    const data = rows.slice(1).map(row => ({
      question_id: row[0] || '',
      Question: row[1] || '',
      Matrix: row[2] || '',
      Manual_Answer: row[4] || '',
      pythoncode: row[5] || '',
      Program_Answer: row[6] || '',
      Explanation: row[7] || '',
      LLM_Answer: row[8] || ''
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return NextResponse.json({ error: 'Error fetching data from Google Sheets' }, { status: 500 });
  }
}