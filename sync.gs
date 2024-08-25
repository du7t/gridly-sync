/**
 * Synchronizes the current Google Sheet with Gridly based on its sheet name.
 * This function is triggered to perform a sync operation, ensuring that no parallel executions occur.
 * It retrieves the connection ID associated with the active sheet and initiates the sync process.
 *
 * The function:
 * 1. Acquires a lock to prevent parallel executions.
 * 2. Retrieves the active sheet's name.
 * 3. Finds the corresponding Gridly connection ID using the sheet name.
 * 4. Initiates the sync process with Gridly if a valid connection ID is found.
 */
function syncWithGridly() {
    // Use lock to ensure no parallel sync execution running
    const lock = LockService.getDocumentLock();
    if (lock.tryLock(INTEGTATION_CONFIG.lockTimeout)) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        sheetName = sheet.getName();

        // Find the corresponding Connection ID by the sheet name
        const connectionId = getConnectionId(sheetName);

        if (connectionId) {
            const gridlyWrapper = new GridlyWrapper(GRIDLY_API_CONFIG);

            console.info(`Starting sync for sheet: ${sheetName}, connectionId: ${connectionId}`);
            gridlyWrapper.sync(connectionId);
        } else {
            console.warn(`No connection ID found for the edited sheet: ${sheetName}`);
        }

        SpreadsheetApp.flush();
        lock.releaseLock();
    } else {
        console.warn("Could not acquire lock. Another execution must be already running on this doc.");
    }
}

/**
 * Retrieves the Gridly connection ID associated with a given sheet name.
 * Looks up the connection ID in the configuration object using the provided sheet name.
 *
 * @param {string} sheetName - The name of the sheet for which to retrieve the connection ID.
 * @returns {string|null} The connection ID associated with the sheet name, or null if no matching ID is found.
 */
function getConnectionId(sheetName) {
    return INTEGTATION_CONFIG.sheetNamesToGridConnectionIds[sheetName] || null;
}
