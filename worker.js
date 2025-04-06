importScripts(`narrator_recognition.js?version=${Date.now()}`); // Import the external script
importScripts(`text_to_object.js?version=${Date.now()}`); // Import the external script 

// Variables to hold JSON data
let nameNumberData = {};
let numericalIndexData = {};
let finalNarratorData = {};
let possibleNamesData = {};
let gradeKeyData = {};

let stateRecord = {};

// worker.js
self.onmessage = function(object) {
    let [nodes, edges, nameNumberDataGiven, numericalIndexDataGiven, finalNarratorDataGiven, possibleNamesDataGiven, gradeKeyDataGiven] = object.data;

    nameNumberData = nameNumberDataGiven;
    numericalIndexData = numericalIndexDataGiven;
    finalNarratorData = finalNarratorDataGiven;
    possibleNamesData = possibleNamesDataGiven;
    gradeKeyData = gradeKeyDataGiven; 
    
    const result = processNarratorRecognition(nodes, edges); // Your computation function
    self.postMessage([result, stateRecord.maxTeacherLines, stateRecord.edgesOfNodes]); 
   
};
