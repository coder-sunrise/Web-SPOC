// import React from 'react'

// // report-viewer
// import '@syncfusion/reporting-javascript/Scripts/reports/ej.report-viewer.min'

$(function () {
  console.log('inside function', $('#reportViewerContainer'))
  console.log(ej.ReportViewer.ProcessingMode.Remote)
  console.log($().ejReportViewer)
  $('#reportViewerContainer').ejReportViewer({
    reportServiceUrl: 'http://js.syncfusion.com/ejservices/api/ReportViewer',
    processingMode: ej.ReportViewer.ProcessingMode.Remote,
    reportPath: 'GroupingAgg.rdl',
    // toolbarSettings: window.Globals.TOOLBAR_OPTIONS,
    // toolBarItemClick: window.Globals.EDIT_REPORT,
  })
})
