let isProgrammaticChange = false;
let isCodeMirrorFocused = false;

function createTextEditor() {
  // Add this in your mode definition's start state
  function narratorDefinitionToken(stream, state) {
    // Look for "Narrator" keyword
    if (stream.match(/Narrator/)) {
      stream.match(/\s+\d+:/);  // Match narrator ID followed by colon
      return "keyword";          // Style it as a keyword
    }

    // Match property names like "grade" or "level"
    if (stream.match(/\b(grade|level)\b/)) {
      return "attribute";         // Style as attribute
    }

    // Match values within quotes (e.g., "Thiqah")
    if (stream.match(/"(.*?)"/)) {
      return "string";            // Style as string
    }

    // Match commas for separating properties
    if (stream.match(/,/)) {
      return "separator";         // Style as separator
    }

    // Match numbers (for narrator IDs or levels)
    if (stream.match(/\d+/)) {
      return "number";            // Style as number
    }

    // Default: move the stream one character forward
    stream.next();
    return null;
  }
  let startedSpecialLine = false;
  CodeMirror.defineMode("chainsMarkup", function() {
    return {
      token: function(stream, state) {

        if (stream.sol()) {
          stream.eatSpace();
          // Define comments (starting with `//`)
          if (stream.match("#")) {
            stream.skipToEnd();
            return "comment"; 
          }
  
          // Define comments (starting with `//`)
          if (stream.match("@")) {
            stream.skipToEnd();
            return "js-code";
          }

          // Define comments (starting with `//`)
          if (stream.match(/[a-zA-Z]:(:|)-/)) {
            stream.skipToEnd();
            return "color-setter";
          }
          
          // Define comments (starting with `//`)
          if (stream.match(/[a-zA-Z]::/)) {
            return "color-setter";
          }
        }
        
        // Skip whitespace
        if (stream.eatSpace()) return null;

      
        // Define strings (within double quotes)
        if (stream.match(/"(?:[^\\]|\\.)*?"/)) {
          return "string";
        }

        // Define strings (within double quotes)
        if (stream.match(/\:.*$/)) { 
          return "string";
        }

        // Define strings (within double quotes)
        if (stream.match(/(?:>\d?>|>>|>\d|>)/)) {
          return "connection"; 
        }
        
        // Define keywords
        if (stream.match(/(color|narrator|Color|Narrator)\b/)) {
          startedSpecialLine = true;
          stream.skipToEnd();
          return "keyword";
        }
        

        const matchedString = stream.match(/[\w'\u0621-\u064A\u1E00-\u1EFF\u0100-\u017F\-ʾʿ]+(?= |$|>|!|:|\^)/); 
        // Define keywords
        if (matchedString) { 

          let line = matchedString[0]; 
          if (line == "Prophet") {
            return "prophet"
          }
          else {
            let possibilities = filteredPermutations(englishToArabic(simplifyHamzas(line)));								
            if (possibilities.length > 0) {
                  return "name";
            }
            else {
                return "nameError"
            } 
          }
        }

        // Move to the next character
        stream.next();
        return null;
        
      }
    };
  });


  // Initialize CodeMirror
  editor = CodeMirror.fromTextArea(document.getElementById("chains"), {
    lineNumbers: true, 
    mode: "chainsMarkup",  // Set the language mode
    lineWrapping: true,  // Enable word wrap 
    theme: "default",    // You can change the theme if desired
    tabSize: 4 ,
  });
  let typingTimer; // Timer identifier
  const typingInterval = 1000; // 1 second

  // Listen for changes in the text
  editor.on("change", function(event, doFit = false) {
    clearTimeout(typingTimer); // Clear the previous timer
    if (!isProgrammaticChange) {
      typingTimer = setTimeout(updateFunction, typingInterval); // Start a new timer
    }
  });


  // Assuming you have a CodeMirror instance named `codeMirrorInstance`
  editor.on('focus', () => {
    isCodeMirrorFocused = true;
  });

  editor.on('blur', () => {
    isCodeMirrorFocused = false;
  }); 

  document.getElementById("graphContainer").addEventListener("focusin", function() {
    isCodeMirrorFocused = false;
  });

  document.getElementById("graphContainer").addEventListener("mouseup", function() {
    isCodeMirrorFocused = false; 
  });
} 