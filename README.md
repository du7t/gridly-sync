<h1 align="center">
  <img src="https://www.gridly.com/upload-data/gridly/gridly_gsheet.png" 
       alt="Logo"
       style="display: block; margin: 0 auto; width: 200px; height: auto;"><br>
  Sync Google Sheets to Gridly
</h1>

<p align="center">
  Welcome to the Sync Google Sheets to Gridly Repository! This repository contains Google Apps Script source code that you can use in your projects to automatically sync Google sheets to Gridly in real time.
</p>

## Introduction

This Google Apps Script project uses Gridly REST API for running sync from Google Sheet to Grid.

New records are added and old are updated.

Sync is available through Google Sheets UI menu and can also be used in triggers.

### Prerequisites

- Google account
- Gridly account with [API key](https://www.gridly.com/docs/api/#introduction)
- Created grids columns for each source sheet
- In Gridly intergation [configured](https://help.gridly.com/409278-gridly-connectors/5281178274961-gridly-connector-google-sheets) source and connenctions for Google sheets

## How to Use

- Prepare prerequisites
- Copy this repository source files to your Google Apps Script project
- Update `config.js` with your API key, sheets name and corresponding connections IDs from Gridly
- Done. You will see new Gridly menu with Sync command in Google Sheets UI. You can use it to run sync for current sheet
- You can also [set up](https://developers.google.com/apps-script/guides/triggers/installable#manage_triggers_manually) trigger onEdit for `syncWithGridly` function

## Script main logic

  1. Acquires document lock to prevent parallel sync executions.
  2. Retrieves the active sheet's name.
  3. Finds the corresponding Gridly connection ID using the sheet name.
  4. Initiates the sync process to Gridly if a valid connection ID is found.
  5. Sync process: sends a sync request to the Gridly API, gets syncID, and then checks the status of the sync by its ID.
  6. Completes if status is succeeded, otherwise throws an error when failed or timeout.


## Important notes

- Consider not storing credentials in plaintext in the configuration. Instead, you can use some external KMS such as Google Cloud Secret Manager or env variables


## Justification

### Solution Chosen

#### Native [Google Apps Script](https://www.google.com/script/start/) making API requests to Gridly native [integration with Google Sheets](https://www.gridly.com/integrations/google-sheets/). Pull model.

    Pros:
    
    - Code seamless Integration with Google Sheets:
    
      Google Apps Script is designed specifically to integrate with Google Sheets, making it an ideal choice for automating tasks related to Sheets without requiring additional external tools or libraries. We also get native event or time based syncs.
    
    - Reduced complexity due to native Gridly integration with Google Sheets
    
    - Lower development and maintenance effort
    
    - Verified performance:
    
      Synchronizing 5 new rows takes ~ 8 seconds.
      
      Synchronizing 10,000 new rows takes ~ 40 seconds.
      
      This indicates that the synchronization time does not grow exponentially or geometrically with the increase in the number of rows, but rather scales linearly. So solution handles larger datasets efficiently without significant performance degradation.
  
    Cons:
    
    - Less flexibility and control over the synchronization process
    
    - Google Apps Script flat project structure, separate VCS

This solution meets all project needs and with consideration of cons and pros - was chosen as most effective.


### Alternatives Considered

#### Full sheet export and import to Grid

    Pros:
    
    - Lower development and maintenance effort
    
    Cons:
    
    - Transfering large datasets will become bandwidth and time-performance issue due to its size



#### Event-Driven architecture by record update with Google Apps Script only. Push model.

    Pros:
    
    - Larger flexibility and control over the synchronization process. Can create columns
    
    Cons:
    
    - Higher development and maintenance effort
    
    - Need to control the amount requests to API and conflicts resolution



#### Event-Driven architecture and queue-based processing with external service and Google Apps Script. Push model.

    Pros:
    
    - Larger flexibility and control over the synchronization process
    
    - Wide variety of options for language and libraries
    
    - Queue can help with both requests load and conflicts resolution - for example, pushes latest event on recordID
    
    Cons:
    
    - Higher development and maintenance effort
    
    - Requires additional infrastructure and hosting for the script or service
