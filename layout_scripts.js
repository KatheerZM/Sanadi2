const layoutConfig = {
  content: [{
      type: 'column',
      content: [
        {
          type: 'component',
          componentName: 'mainScreen',
          title: 'Script',
          isClosable: false,  // Disable closing for Main Screen
          maximizable: false,
          popout: false     // Disable maximize
        },
        {
            type: 'component',
            componentName: 'extraScreen1',
            title: 'Diagram', 
            isClosable: false,  // Disable closing for Main Screen
            maximizable: false,
            popout: false     // Disable maximize
        },
      ] 
  }]
};

const myLayout = new GoldenLayout(layoutConfig, document.getElementById('layoutContainer'));

window.addEventListener('resize', function() {
    myLayout.updateSize();
});

/*
var layoutSettings = myLayout.layoutManager.config.settings;
layoutSettings.showMaximiseIcon = false;
layoutSettings.showPopoutIcon = false;	
*/

myLayout.registerComponent('mainScreen', function(container, componentState) {
  container.getElement().html(`
  <textarea id="chains" name="chains" class="chains-textarea" placeholder="Enter Hadith chains here..." required></textarea>



  `);
});

myLayout.registerComponent('extraScreen1', function(container, componentState) {
  container.getElement().html(`
      <div id="graphContainer"></div>
        
      <div class="container-buttons" style="display: none;">
          <button id="directionToggle" class="direction-button">

              <img id="directionIcon" src="icons/tree-lr.png" alt="Graph Direction">
          </button> 
          <!--
          <div class="spacing-controls">
              <label for="nodeSeparation">Node Spacing:</label>
              <input type="range" id="nodeSeparation" name="nodeSeparation" min="0.5" max="5" step="0.01" value="0.8">

              <label for="rankSeparation">Rank Spacing:</label>
              <input type="range" id="rankSeparation" name="rankSeparation" min="1" max="10" step="0.01" value="2.5">  
          </div>
          -->
      </div>
  `);
});

myLayout.init();

// Track the last component opened in a new window
let lastOpenedComponentType = null;


myLayout.registerComponent('tools', function(container, componentState) {
  container.getElement().html(` 
<div id="toolskit" class="toolkit-container">

  <div class="button-group">
    <button id="openDrawIo" onclick="openDrawIo();" class="primary-button">Open in draw.io</button>
    <button id="copyToClipboard" onclick="copyToClipboard();" class="primary-button">Copy for draw.io</button>
    <button id="shareLink" onclick="saveContent();" class="primary-button">Share this diagram</button> 
  </div>
  <div class="container-buttons">
    <div class="direction-toggle-container">
      <label for="directionToggle" class="toggle-label">Direction:</label>
      <button id="directionToggle" class="direction-button" onclick="directionClick()">  
        <img id="directionIcon" src="${icons[currentDirectionIndex]}" alt="Graph Direction"> 
      </button> 
    </div>

    <div class="spacing-controls">
      <label for="nodeSeparation">Node Spacing:</label>
      <input oninput="spacingChange()" type="range" id="nodeSeparation" name="nodeSeparation" min="0.5" max="5" step="0.01" value="0.8">

      <label for="rankSeparation">Rank Spacing:</label>
      <input oninput="spacingChange()" type="range" id="rankSeparation" name="rankSeparation" min="1" max="10" step="0.01" value="2.5">  
    </div> 
  </div>

  <!-- Color Picker Section -->
  <div class="color-picker-group">
    <label for="colorPicker" class="color-picker-label">Default Node Color:</label>
    <input type="color" id="defaultNodeColor" name="colorPicker" class="color-picker" value="${defaultNodeColor}" onchange="setDefaultNodeColor()"> 
  </div> 


  <div class="checkbox-group">
    
    <label class="switch">
      <input type="checkbox" id="showMatnOnGraph" onclick="toggleShowMatn()" ${showMatn ? "checked" : ""}>
      <span class="slider round"></span>
      <span class="switch-label">Show Matn Comments</span> 
    </label>
  
    <label class="switch">
      <input type="checkbox" id="colorByGrade" onclick="toggleColorByGrade()" ${colorByGrade ? "checked" : ""}>
      <span class="slider round"></span>
      <span class="switch-label">Color By Grade</span>
    </label>
    
    <label class="switch">
      <input type="checkbox" id="linkGrading" onclick="toggleLinkGrading()" ${linkGrading ? "checked" : ""}>
      <span class="slider round"></span>
      <span class="switch-label">Link Grading</span>
    </label>
    
    <label class="switch">
      <input type="checkbox" id="edgeFromFirstPerson" onclick="toggleEdgeFromFirstPerson()" ${edgeFromFirstPerson ? "checked" : ""}>
      <span class="slider round"></span>
      <span class="switch-label">Grade Links From First Person</span>
    </label>
    
    <label class="switch">
      <input type="checkbox" id="displayUpstreamEdgeType" onclick="toggleDisplayUpstreamEdgeType()" ${displayUpstreamEdgeType ? "checked" : ""}>
      <span class="slider round"></span>
      <span class="switch-label">Show Upstream Breakage on Links</span> 
    </label>
    
    <!--
    <label class="switch">
      <input type="checkbox" id="snapToGrid" onclick="toggleSnap()">
      <span class="slider round"></span>
      <span class="switch-label">Snap to Grid</span>
    </label>
    -->
    
  </div>
  
</div>

  `); 
}); 

let showMatn = true;
function toggleShowMatn() {
  showMatn = document.getElementById("showMatnOnGraph").checked;
  updateFunction(null, false, true);  
}

let colorByGrade = true;
function toggleColorByGrade() {
  colorByGrade = document.getElementById("colorByGrade").checked;
  processCellColors(graph.getModel().cells, stateRecord.classifiedLevels); 
}

let edgeFromFirstPerson = false;
function toggleEdgeFromFirstPerson() {
  edgeFromFirstPerson = document.getElementById("edgeFromFirstPerson").checked;
  processCellColors(graph.getModel().cells, stateRecord.classifiedLevels); 
}

let linkGrading = true;
function toggleLinkGrading() {
  linkGrading = document.getElementById("linkGrading").checked;
  processCellColors(graph.getModel().cells, stateRecord.classifiedLevels); 
}

let defaultNodeColor = "#FFFFFF";
function setDefaultNodeColor() {
  defaultNodeColor = document.getElementById("defaultNodeColor").value;
  processCellColors(graph.getModel().cells, stateRecord.classifiedLevels); 
}

let displayUpstreamEdgeType = true;
function toggleDisplayUpstreamEdgeType() {
  displayUpstreamEdgeType = document.getElementById("displayUpstreamEdgeType").checked;
  processCellColors(graph.getModel().cells, stateRecord.classifiedLevels); 
}

const directions = ['LR', 'TB', 'RL', 'BT'];
const icons = ['icons/tree-lr.png', 'icons/tree-tb.png', 'icons/tree-rl.png', 'icons/tree-bt.png'];
let currentDirectionIndex = 0;  

function openSettings() {
  // To check if a component with a specific ID exists
  const item = document.getElementById('toolskit');
  if (item) {
    
  } 
  else { 
    const element = document.getElementById('directionToggle');
    if (element) {
        element.remove();
    } 
    
    const newItemConfig = {
      type: 'component',
      componentName: "tools", 
      title: "Tools",
      isClosable: true,
      maximizable: false,
      popoutEnabled: false  // Disables the popout button
    };
  
    // Add the component back into the layout
    myLayout.root.contentItems[0].addChild(newItemConfig);
    document.getElementById('directionIcon').src = icons[currentDirectionIndex];
    document.getElementById('nodeSeparation').value = currentNodeSpace;
    document.getElementById('rankSeparation').value = currentRankSpace;   


    document.getElementById("floating-tools-button").style.display = "none"; 
  }
}

myLayout.on('itemDestroyed', function (item) {
  // let toolskit = document.getElementById('toolskit'); 
  if (item.isComponent && item.componentName == "tools") { 
    document.getElementById("floating-tools-button").style.display = "flex";
  }
});

function directionClick() {
  currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
  document.getElementById('directionIcon').src = icons[currentDirectionIndex];

  // Set the direction value in your form (if needed)
  document.getElementById('direction').value = directions[currentDirectionIndex];
  updateFunction(null, false, true);  
}

// Update displayed value for Node Spacing
/*
const nodeSeparationInput = document.getElementById('nodeSeparation');
const nodeSeparationValue = document.getElementById('nodeSeparationValue');
const nodeFormValue = document.getElementById('node_separation');

// Update displayed value for Rank Spacing
const rankSeparationInput = document.getElementById('rankSeparation');
const rankSeparationValue = document.getElementById('rankSeparationValue') ;
const rankFormValue = document.getElementById('rank_separation');
*/

function spacingChange() {
  const nodeSeparationInput = document.getElementById('nodeSeparation');
  const nodeSeparationValue = document.getElementById('nodeSeparationValue');
  const nodeFormValue = document.getElementById('node_separation');
  const rankSeparationInput = document.getElementById('rankSeparation');
  const rankSeparationValue = document.getElementById('rankSeparationValue') ;
  const rankFormValue = document.getElementById('rank_separation');
  
  nodeFormValue.value = document.getElementById('nodeSeparation').value;
  rankFormValue.value = document.getElementById('rankSeparation').value; 
  respaceWithoutUpdate(directions[currentDirectionIndex], nodeFormValue.value, rankFormValue.value);  
}

function openDrawIo() {
  var encoder = new mxCodec();
  var result = encoder.encode(graph.getModel());
  var xml = mxUtils.getXml(result);

  // Send the XML to the server to save it
  saveDiagramOnServer(xml, function(response) {
    console.log(response);
    // If the file was saved successfully, open it in draw.io
    if (response.startsWith("File saved successfully")) {
      var urlPart = response.split("URL: ")[1].trim();
      var url = "https://app.diagrams.net/?#U" + encodeURIComponent(urlPart);
      window.open(url, '_blank');
    } else {
      console.error("Could not save the diagram on the server.");
    }
  });
}

function copyToClipboard() {
  var encoder = new mxCodec();
  var result = encoder.encode(graph.getModel());
  var xml = mxUtils.getXml(result);

  if (navigator.clipboard && window.isSecureContext) {
    // Use the Clipboard API to copy text
    navigator.clipboard.writeText(xml)
      .then(function() {
        console.log('Graph XML copied to clipboard successfully!');
      })
      .catch(function(error) {
        console.error('Error in copying text: ', error);
        alert('Failed to copy graph XML.');
      });
  } else {
    // Fallback for older browsers
    var textarea = document.createElement('textarea');
    textarea.value = xml;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

  }
}


function saveDiagramOnServer(xml, callback) {
  fetch('https://blog.fussilat.com/hadith/save_xml.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'xmlData=' + encodeURIComponent(xml)
  })
  .then(response => response.text())
  .then(data => callback(data))
  .catch(error => console.log('Error:', error));
}