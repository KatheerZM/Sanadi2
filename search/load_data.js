// Variables to hold JSON data
let nameNumberData = {};
let numericalIndexData = {};
let finalNarratorData = {};
let possibleNamesData = {};
let gradeKeyData = {};
let hdpToSanadiData = {};

// Function to load JSON files
async function loadJSONFiles() {
    try {
        // Fetch each JSON file and store the results in the variables
        const [
            nameNumberResponse,
            numericalIndexResponse,
            finalNarratorZipResponse,
            possibleNamesResponse,
            gradeKeyResponse,
            hdpToSanadiResponse,
        ] = await Promise.all([
            fetch("name_number.json"),
            fetch("numerical_index.json"),
            fetch("final_narrator_data_3.zip"),
            fetch("possible_names.json"),
            fetch("grade_key.json"),
            fetch("hdp_to_sanadi.json"),
        ]);

        // Parse the JSON responses
        nameNumberData = await nameNumberResponse.json();
        numericalIndexData = await numericalIndexResponse.json();
        // finalNarratorData = await finalNarratorResponse.json();
        possibleNamesData = await possibleNamesResponse.json();
        gradeKeyData = await gradeKeyResponse.json(); 
        hdpToSanadiData = await hdpToSanadiResponse.json(); 


        // Read response as an ArrayBuffer
        const arrayBuffer = await finalNarratorZipResponse.arrayBuffer();

        // Load JSZip and extract the zip content
        const zip = await JSZip.loadAsync(arrayBuffer);

        // Look for "final_narrator_data_3.json" inside the zip
        const jsonFile = zip.file("final_narrator_data_3.json");
        if (!jsonFile) {
          throw new Error('JSON file not found in the zip archive.');
        }

        // Extract and parse the JSON file content
        const content = await jsonFile.async("string");
        finalNarratorData = JSON.parse(content);   

        console.log("JSON files loaded successfully.");
        document.getElementById("searchButton").disabled = false;
        document.getElementById("searchButtonText").innerHTML = "Search";
        // console.log(nameNumberData, numericalIndexData, finalNarratorData);
    } catch (error) {
        console.error("Error loading JSON files:", error);
    }
}

