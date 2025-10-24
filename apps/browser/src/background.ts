chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {

  switch (request.type) {
    case "SAVE_ENROLLED_COURSES":
      chrome.storage.local.set({
        enrolledCourses: request.payload,
        lastSync: new Date().toISOString()
      }, () => {
        console.log("Saved enrolled course offerings to local storage:", request.payload);
      });
      break;
    case "SAVE_COMPLETED_COURSES":
      chrome.storage.local.set({
        completedCourses: request.payload,
        gradesLastSync: new Date().toISOString()
      }, () => {
        console.log("Saved completed courses to local storage:", request.payload);
      });
      break;
    case "SAVE_COURSE_SEARCH":
      chrome.storage.local.get("courseSearchSaved", (result) => {
        const courseSearchSaved = result.courseSearchSaved || [];
        courseSearchSaved.push(request.payload);
        chrome.storage.local.set({
          courseSearchSaved: courseSearchSaved,
          savedAt: new Date().toISOString()
        }, () => {
          console.log("Saved course search to local storage:", request.payload);
        });
      });
      break;
    default:
      console.log("Unknown message type:", request.type);
      sendResponse({ error: "Unknown message type" });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
