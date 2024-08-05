import { appendToSheet } from "../services/google-sheet-service.js";
import { delay } from "./delay.js";
import { logError } from "./logError.js";


export const appendToSheetWithRetry = async (sheetName, data, retries = 3) => {
    console.log("appendToSheetWithRetry has called");
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await appendToSheet(sheetName, data);
            break; // Exit the loop if successful
        } catch (error) {
            logError(error, `appendToSheet - Attempt ${attempt}`);
            if (attempt < retries) {
                const backoffTime = Math.pow(2, attempt) * 60000; // Exponential backoff
                console.log(`Retrying appendToSheet for ${sheetName} in ${backoffTime / 1000} seconds...`);
                await delay(backoffTime); // Retry after the calculated backoff time
            } else {
                throw error; // Rethrow the error if all attempts fail
            }
        }
    }
};
