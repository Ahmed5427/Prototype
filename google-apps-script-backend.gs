/**
 * SQUAD Automation Request Form - Google Apps Script Backend (Updated v2.1)
 * 
 * This script is designed to be embedded directly in your Google Sheet.
 * It handles form submissions from the React frontend and formats data
 * according to the specified Google Sheets structure with new features:
 * - Custom process type names
 * - File attachment support
 * - Enhanced formatting functions
 */

const SHEET_NAME = "Form Submissions"; // You can change this to your preferred sheet name

function doPost(e) {
  try {
    const formData = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    
    const formatProcessSteps = (steps) => {
      if (!steps || steps.length === 0) return 'No process steps added';
      
      return steps.map((step, index) => {
        let formatted = `Step ${index + 1}:\n`;
        formatted += `• Current Process: ${step.description || 'Not specified'}\n`;
        if (step.automationVision) formatted += `• Automation Vision: ${step.automationVision}\n`;
        if (step.estimatedTime) formatted += `• Time: ${step.estimatedTime}\n`;
        if (step.peopleInvolved) formatted += `• People: ${step.peopleInvolved}\n`;
        if (step.frequency) formatted += `• Frequency: ${step.frequency}\n`;
        if (step.painPoints && step.painPoints.length > 0) {
          formatted += `• Pain Points: ${step.painPoints.join(', ')}\n`;
        }
        if (step.attachments && step.attachments.length > 0) {
          formatted += `• Attachments: ${step.attachments.map(file => file.name).join(', ')}\n`;
        }
        return formatted;
      }).join('\n---\n');
    };
    
    const formatPainPoints = (categories, impactAssessment) => {
      if (!categories || categories.length === 0) return 'No pain points selected';
      
      const painPointTitles = {
        'time_consumption': 'Takes Too Long',
        'too_many_mistakes': 'Too Many Mistakes', 
        'needs_many_people': 'Needs Too Many People',
        'costs_too_much': 'Costs Too Much',
        'hard_to_grow': 'Hard to Handle More Work',
        'bad_experience': 'Bad User Experience',
        'compliance_risk': 'Compliance Risk',
        'poor_visibility': 'Poor Visibility'
      };
      
      let result = categories.map(cat => painPointTitles[cat] || cat).join(', ');
      
      if (impactAssessment && Object.keys(impactAssessment).length > 0) {
        result += '\n\nImpact Assessment:';
        Object.entries(impactAssessment).forEach(([category, impact]) => {
          const title = painPointTitles[category] || category;
          result += `\n• ${title}: ${getImpactLabel(impact)} (${impact}/100)`;
        });
      }
      return result;
    };
    
    const formatAutomationGoals = (goals) => {
      if (!goals || goals.length === 0) return 'No automation goals selected';
      
      const goalTitles = {
        'reduce_time': 'Save Time',
        'eliminate_errors': 'Reduce Mistakes',
        'improve_compliance': 'Follow Rules Better',
        'scale_operations': 'Handle More Work',
        'enhance_experience': 'Make People Happier',
        'increase_visibility': 'Better Tracking'
      };
      
      return goals.map(goal => goalTitles[goal] || goal).join(', ');
    };
    
    const formatProjectPriorities = ({timelinePriority, qualityPriority, costPriority}) => {
      const getSliderLabel = (value) => {
        if (value <= 20) return 'Low Priority';
        if (value <= 40) return 'Medium Priority';
        if (value <= 60) return 'High Priority';
        if (value <= 80) return 'Very High Priority';
        return 'Critical Priority';
      };
      
      return `Timeline: ${getSliderLabel(timelinePriority)} (${timelinePriority}/100)\nQuality: ${getSliderLabel(qualityPriority)} (${qualityPriority}/100)\nCost: ${getSliderLabel(costPriority)} (${costPriority}/100)`;
    };
    
    const getProcessTypeDisplay = (processType, otherProcessName) => {
      const processTypeMap = {
        'hr_recruitment': 'HR & Hiring',
        'customer_service': 'Customer Support', 
        'sales_process': 'Sales & Leads',
        'finance_admin': 'Finance & Admin',
        'custom_process': otherProcessName || 'Other Process'
      };
      
      return processTypeMap[processType] || processType || '';
    };
    
    const rowData = [
      new Date().toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }), // 1. Timestamp
      formData.companyName || '', // 2. Company Name
      formData.department || '', // 3. Department
      formData.projectName || '', // 4. Project Name
      formData.requesterName || '', // 5. Requester Name
      formData.email || '', // 6. Email
      getProcessTypeDisplay(formData.processType, formData.otherProcessName), // 7. Process Type
      formatProcessSteps(formData.processSteps), // 8. Process Steps
      formatPainPoints(formData.painPointCategories, formData.impactAssessment), // 9. Pain Points
      formData.frequency || '', // 10. Process Frequency
      formData.businessImpact ? `${getImpactLabel(formData.businessImpact)} (${formData.businessImpact}/100)` : '', // 11. Business Impact
      formatAutomationGoals(formData.automationGoals), // 12. Automation Goals
      formData.successMetrics || '', // 13. Success Metrics
      formatProjectPriorities({
        timelinePriority: formData.timelinePriority || 50,
        qualityPriority: formData.qualityPriority || 50,
        costPriority: formData.costPriority || 50
      }), // 14. Project Priorities
      formData.additionalGoals || '' // 15. Additional Goals
    ];
    
    // Append row and format it
    const newRowIndex = sheet.appendRow(rowData).getLastRow();
    formatNewRow(sheet, newRowIndex);
    
    return createCORSResponse({
      success: true,
      message: 'Form submitted successfully',
      timestamp: new Date().toISOString(),
      rowIndex: newRowIndex
    });
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return createCORSResponse({
      success: false,
      error: error.toString(),
      message: 'Failed to submit form'
    });
  }
}

function doOptions(e) {
  return createCORSResponse('');
}

function doGet(e) {
  return createCORSResponse({
    message: 'SQUAD Automation Form Backend is running',
    timestamp: new Date().toISOString(),
    version: '2.1'
  });
}

function createCORSResponse(content) {
  const output = ContentService.createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
  
  return output;
}

function getImpactLabel(value) {
  if (value <= 20) return 'Small Problem';
  if (value <= 40) return 'Medium Problem';
  if (value <= 60) return 'Big Problem';
  if (value <= 80) return 'Major Problem';
  return 'Huge Problem';
}

function formatNewRow(sheet, rowIndex) {
  // 1. Set row height for multi-line content
  sheet.setRowHeight(rowIndex, 100);
  
  // 2. Get the entire row range
  const range = sheet.getRange(rowIndex, 1, 1, 15);
  
  // 3. Enable text wrapping for all cells
  range.setWrap(true);
  
  // 4. Align content to top of cells
  range.setVerticalAlignment('top');
  
  // 5. Alternate row colors for readability
  if (rowIndex % 2 === 0) {
    range.setBackground('#F8F9FA'); // Light gray for even rows
  }
  
  // 6. Special formatting for detailed columns
  const processStepsRange = sheet.getRange(rowIndex, 8); // Column H
  processStepsRange.setFontFamily('Courier New'); // Monospace for structure
  
  const painPointsRange = sheet.getRange(rowIndex, 9); // Column I
  painPointsRange.setFontFamily('Courier New');
  
  const prioritiesRange = sheet.getRange(rowIndex, 14); // Column N
  prioritiesRange.setFontFamily('Courier New');
}

function getSheet() {
  // Get the active spreadsheet (this script is embedded in the sheet)
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get or create the target sheet
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    setupSheetHeaders(sheet);
  } else {
    ensureHeadersExist(sheet);
  }
  
  return sheet;
}

function ensureHeadersExist(sheet) {
  const expectedHeaders = [
    'Timestamp', 'Company Name', 'Department', 'Project Name', 'Requester Name', 'Email',
    'Process Type', 'Process Steps', 'Pain Points & Impact', 'Process Frequency',
    'Business Impact', 'Automation Goals', 'Success Metrics', 'Project Priorities', 'Additional Goals'
  ];
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  let needsHeaders = false;
  
  if (lastRow === 0) {
    needsHeaders = true;
  } else {
    const firstRowValues = sheet.getRange(1, 1, 1, Math.max(expectedHeaders.length, lastCol)).getValues()[0];
    
    let headersMatch = true;
    for (let i = 0; i < expectedHeaders.length; i++) {
      if (firstRowValues[i] !== expectedHeaders[i]) {
        headersMatch = false;
        break;
      }
    }
    
    if (!headersMatch) {
      if (lastRow > 0) {
        sheet.insertRowBefore(1);
      }
      needsHeaders = true;
    }
  }
  
  if (needsHeaders) {
    setupSheetHeaders(sheet);
  }
}

function setupSheetHeaders(sheet) {
  const headers = [
    'Timestamp',           // Column A - When form was submitted
    'Company Name',        // Column B - Client company
    'Department',          // Column C - Which department
    'Project Name',        // Column D - Name of automation project
    'Requester Name',      // Column E - Person who filled the form
    'Email',               // Column F - Contact email
    'Process Type',        // Column G - Type of process (HR, Sales, etc.)
    'Process Steps',       // Column H - Detailed process breakdown
    'Pain Points & Impact', // Column I - Problems and severity
    'Process Frequency',   // Column J - How often process runs
    'Business Impact',     // Column K - Impact score
    'Automation Goals',    // Column L - What they want to achieve
    'Success Metrics',     // Column M - How to measure success
    'Project Priorities',  // Column N - Timeline/Quality/Cost priorities
    'Additional Goals'     // Column O - Extra information
  ];
  
  // 1. Set the headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // 2. Format the header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  
  // 3. Apply SQUAD brand colors
  headerRange.setBackground('#281362'); // SQUAD purple background
  headerRange.setFontColor('#FFFFFF');  // White text
  headerRange.setFontWeight('bold');    // Bold font
  headerRange.setFontSize(12);          // 12pt font size
  headerRange.setWrap(true);            // Text wrapping enabled
  headerRange.setVerticalAlignment('middle'); // Center vertically
  
  // 4. Set optimal column widths
  const columnWidths = [
    150,  // Timestamp
    200,  // Company Name
    150,  // Department
    250,  // Project Name
    200,  // Requester Name
    250,  // Email
    150,  // Process Type
    400,  // Process Steps (wider for detailed content)
    350,  // Pain Points & Impact (wider for detailed content)
    120,  // Process Frequency
    150,  // Business Impact
    200,  // Automation Goals
    300,  // Success Metrics (wider for detailed content)
    250,  // Project Priorities
    300   // Additional Goals
  ];
  
  // Apply column widths
  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
  
  // 5. Freeze the header row
  sheet.setFrozenRows(1);
}

function testFormSubmission() {
  const testData = {
    companyName: "Test Company",
    department: "Human Resources",
    projectName: "Test Automation Project",
    requesterName: "Test User",
    email: "test@example.com",
    processType: "custom_process",
    otherProcessName: "Inventory Management",
    customProcessDescription: "This process involves tracking and managing inventory levels across multiple warehouses and ensuring stock availability for orders.",
    processSteps: [
      {
        id: 1,
        description: "Review job applications manually",
        automationVision: "AI system automatically screens applications",
        estimatedTime: "2 hours",
        peopleInvolved: "1 HR manager",
        frequency: "daily",
        painPoints: ["Time consuming", "Error prone"],
        attachments: [
          { name: "current_process.pdf" },
          { name: "sample_application.docx" }
        ]
      }
    ],
    painPointCategories: ["time_consumption"],
    impactAssessment: { "time_consumption": 80 },
    frequency: "Every day",
    businessImpact: 75,
    outcomePriorities: ["reduce_time"],
    successMetrics: "Reduce resume screening time from 2 hours to 30 minutes",
    timelinePriority: 70,
    qualityPriority: 85,
    costPriority: 60,
    additionalGoals: "Improve candidate experience and reduce bias"
  };
  
  const mockEvent = {
    postData: { contents: JSON.stringify(testData) }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}

/**
 * Instructions for deployment (Embedded in Google Sheet):
 * 
 * 1. Open your Google Sheet where you want to collect the form data
 * 2. Go to Extensions -> Apps Script
 * 3. Replace the default code with this script
 * 4. Save the project (Ctrl+S or Cmd+S)
 * 5. Click "Deploy" -> "New deployment"
 * 6. Choose "Web app" as the type
 * 7. Set "Execute as" to your account
 * 8. Set "Who has access" to "Anyone"
 * 9. Click "Deploy"
 * 10. Copy the web app URL and update it in the React frontend
 * 
 * The script will automatically:
 * - Use the current Google Sheet (no need to create or find one)
 * - Create a "Form Submissions" sheet if it doesn't exist
 * - Set up proper headers and formatting
 * - Handle all form data according to the specified structure
 * - Support custom process types and file attachments
 */