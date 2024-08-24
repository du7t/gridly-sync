// Configurations for Gridly API and integration
const GRIDLY_API_CONFIG = {
    apiKey: 'your_api_key', // Replace with your API Key
    apiBaseUrl: 'https://eu-central-1.api.gridly.com',
}

const INTEGTATION_CONFIG = {
    // You can get each created connection id from its url
    // Example: https://app.gridly.com/integration/connectors/connection/1276
    sheetNamesToGridConnectionIds: {
        'Static Texts': '1276',
        'Game Text': '1277',
    },
    lockTimeout: 10000  // Timeout for acquiring lock in ms
}

// Create Gridly menu
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Gridly')
        .addItem('Sync current sheet', 'syncWithGridly')
        .addToUi();
}

// Triggered
function syncWithGridly(e) {
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

function getConnectionId(sheetName) {
    return INTEGTATION_CONFIG.sheetNamesToGridConnectionIds[sheetName] || null;
}

// Gridly API wrapper
// Docs: https://www.gridly.com/docs/api/
class GridlyWrapper {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiBaseUrl = config.apiBaseUrl;
    }

    _get_options(method) {
        return {
            'method': method,
            'headers': {
                'Authorization': `ApiKey ${this.apiKey}`,
            },
        }
    }

    sync(connectionId) {
        const url = `${this.apiBaseUrl}/workflow/v1/connector/connections/${connectionId}/sync`;

        // Send sync request, get its id and start checking status
        try {
            const response = UrlFetchApp.fetch(url, this._get_options('post'));
            const syncInfo = JSON.parse(response.getContentText());
            const syncId = syncInfo.id;
            console.info(`Sync initiated, ID: ${syncId}`);
            this.checkSyncStatus(syncId);
        } catch (error) {
            console.error(`Failed initiating sync for connectionId: ${connectionId}. Error: ${error}`);
            throw error;
        }
    }
  
    checkSyncStatus(syncId) {
        const INTERVAL = 3000; // Interval between checks in ms
        const MAX_CHECKS = 20;

        const url = `${this.apiBaseUrl}/workflow/v1/connector/syncs/${syncId}`;
    
        console.info(`Checking status for sync ID: ${syncId} with ${INTERVAL}ms interval, max checks: ${MAX_CHECKS}`);

        let checks = 0;
        let status = 'pending';

        while (status !== 'succeeded' && checks < MAX_CHECKS) {
            Utilities.sleep(INTERVAL);
            try {
                const response = UrlFetchApp.fetch(url, this._get_options('get'));
                const syncInfo = JSON.parse(response.getContentText());
                status = syncInfo.status;
                console.info(`Sync ID: ${syncId} status: ${status}`);
            } catch (error) {
                console.error(`Failed checking status for sync ID: ${syncId}. Error: ${error}`);
                throw error;
            }
            checks++;
        }
  
        if (status !== 'succeeded') {
            throw new Error(`Sync ID: ${syncId} timed out or failed.`);
        } else {
            console.info(`Sync ID: ${syncId} succeeded.`);
        }
    }
}
