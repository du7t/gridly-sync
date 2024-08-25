/**
 * Gridly API wrapper
 * Docs: https://www.gridly.com/docs/api/
 */
class GridlyWrapper {
    /**
     * @param {Object} config - The configuration object for Gridly API.
     * @param {string} config.apiKey - The API key for authenticating requests to Gridly.
     * @param {string} config.apiBaseUrl - The base URL of the Gridly API.
     */
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiBaseUrl = config.apiBaseUrl;
    }

    /**
     * @param {string} method - The HTTP method to use for the request (e.g., 'get', 'post', 'delete').
     * @returns {Object} An options object to be used with the HTTP request.
     */
    _get_options(method) {
        return {
            'method': method,
            'headers': {
                'Authorization': `ApiKey ${this.apiKey}`,
            },
        }
    }

    /**
     * Initiates a synchronization process for a specified connection in Gridly.
     * Sends a sync request to the Gridly API and then checks the status of the sync process.
     *
     * @param {string} connectionId - The ID of the connection to sync.
     * @throws {Error} Throws an error if the sync request fails or if an error occurs during the process.
     */
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

    /**
     * Monitors the status of a sync process until it succeeds or reaches the maximum number of checks.
     * Checks the sync status at regular intervals and logs the status updates.
     *
     * @param {string} syncId - The ID of the sync process to monitor.
     * @throws {Error} Throws an error if the sync process fails or times out.
     */
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
