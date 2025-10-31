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
    default:
      console.log("Unknown message type:", request.type);
      sendResponse({ error: "Unknown message type" });
  }
});