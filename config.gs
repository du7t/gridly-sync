/**
 * Config for Gridly API.
 */
const GRIDLY_API_CONFIG = {
    // Replace with your API Key
    apiKey: 'your_api_key',
    apiBaseUrl: 'https://api.gridly.com',
}

/**
 * Config for Google Sheets integration with Gridly.
 */
const INTEGTATION_CONFIG = {
    // You can get each created connection id from its url
    // Example: https://app.gridly.com/integration/connectors/connection/1276
    sheetNamesToGridConnectionIds: {
        'Static Texts': '1276',
        'Game Text': '1277',
    },

    // Timeout for acquiring doc lock in ms
    lockTimeout: 90000
}
