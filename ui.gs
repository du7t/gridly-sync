/**
 * Adds a custom "Gridly" menu to the Google Sheets UI.
 * This function runs automatically when the spreadsheet is opened.
 * 
 * The "Gridly" menu includes an item that triggers the `syncWithGridly` function, 
 * allowing the user to sync the current sheet with Gridly directly from the menu.
 */
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Gridly')
        .addItem('Sync current sheet', 'syncWithGridly')
        .addToUi();
}
