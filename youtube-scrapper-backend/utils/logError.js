export function logError(error, functionName) {
    const stackLines = new Error().stack.split('\n');
    const callerLine = stackLines[2]; // Adjust this index if necessary
    console.error(`Error in ${functionName}: ${callerLine.trim()}\nMessage: ${error.message}\nStack: ${error.stack}`);
}
