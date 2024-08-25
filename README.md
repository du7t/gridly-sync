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

This Google Apps Script project uses Gridly REST API for running sync on Google Sheet <> Grid.

New records are added and old are updated.

Sync is available through Google Sheets UI menu and can also be used in triggers (e.g., onEdit)

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

## Contents

...

