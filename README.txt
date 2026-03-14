IT Capability Maturity Assessment Tool
======================================
Aligned with IVI IT-CMF v2.0

FIRST RUN
---------
macOS:
  If you see "cannot be opened because the developer cannot be verified":
    Right-click the file > Open, or run:
      xattr -cr assessment-tool

  Then double-click or run from terminal:
      ./assessment-tool

Windows:
  If you see "Windows protected your PC":
    Click "More info" > "Run anyway"

  Or unblock via PowerShell:
      Unblock-File .\assessment-tool.exe

  Then double-click assessment-tool.exe

USAGE
-----
1. The tool opens your default browser automatically
2. Fill in client information on the first page
3. Navigate through 37 Critical Capabilities organized in 4 Macro-Capabilities
4. Score each item 1-5 using the scoring buttons or keyboard shortcuts
5. View progress on the Dashboard with radar and bar charts
6. Export deliverables (DOCX, XLSX, PPTX) from the Export page

KEYBOARD SHORTCUTS
------------------
1-5           Set score on focused item
N             Toggle N/A
H / M / L     Set confidence (High / Medium / Low)
Up/Down       Navigate between items
Cmd+K         Open command palette (quick search)
Cmd+\         Toggle sidebar

DATA
----
Assessment data auto-saves to data.json in this folder.
A backup (data.json.bak) is created on each save.

NEW CLIENTS
-----------
Copy the entire folder for each new client engagement.
Each copy maintains its own independent data.json.

EXPORTS
-------
Generated files are saved to the exports/ subfolder with timestamps.

Available exports:
  - Assessment Findings (DOCX)
  - Executive Summary (DOCX) with radar chart
  - Gap Analysis & Roadmap (DOCX)
  - Scored Assessment Workbook (XLSX)
  - Out-Brief Presentation (PPTX)
  - Maturity Heatmap (XLSX)
  - Quick Wins Report (DOCX)
  - CC Improvement Roadmap (DOCX)

TROUBLESHOOTING
---------------
Port conflict:
  The tool tries ports 8761-8770. If all are busy,
  close other applications using those ports.

Data recovery:
  If data.json is corrupted, rename data.json.bak to data.json
  to restore from the last backup.

Framework:
  The framework/ folder contains the read-only assessment structure.
  Do not modify these files.
