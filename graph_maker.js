function get5Grade(nodeId) {
  if (stateRecord.nodes5Grade[nodeId] != null) { 
    return stateRecord.nodes5Grade[nodeId];
  }
  else {
    return null;  
  }
}

function getEdge(parentId, childId) {
  return stateRecord.edges[
    stateRecord.edgesOfNodes[parentId][childId]
  ];
  for (let i = 0; i < stateRecord.edges.length; i++) {
    if (stateRecord.edges[i][1] == parentId && stateRecord.edges[i][0] == childId) { 
      return stateRecord.edges[i];
    }
  }
}

function getEdgeId(parentId, childId) {
  return stateRecord.edgesOfNodes[parentId][childId];
}

function getConnectivity(parentId, childId) {
  return getEdge(parentId, childId)[2];
}

function gradeOfParentLine(parentOfNode) {
  if (parentOfNode.parents.length == 1 && parentOfNode.parents[0].length == 0) {
    if (!edgeFromFirstPerson) {
      return {
        upstreamGrade: 0,
        upstreamConnectivity: 1
      }; 
    } 
    else {
      return { 
        upstreamGrade: get5Grade(parentOfNode.self) + 1,
        upstreamConnectivity: 1
      };  
    }  
  }
  else {
    let gradeList = [];
    for (let y = 0; y < parentOfNode.parents[0].length; y++) {
      if (get5Grade(parentOfNode.self) !== null) {
        let object = gradeOfParentLine(parentOfNode.parents[0][y]);
        gradeList.push({
          upstreamGrade: Math.max(
            object.upstreamGrade, 
            get5Grade(parentOfNode.self) + 1
          ),
          upstreamConnectivity: Math.max(
            object.upstreamConnectivity,
            getConnectivity(parentOfNode.self, parentOfNode.parents[0][y].self)
          )
        }); 
      }
      else {
        gradeList.push({
          upstreamGrade: gradeOfParentLine(parentOfNode.parents[0][y]),
          upstreamConnectivity: getConnectivity(parentOfNode.self, parentOfNode.parents[0][y].self)
        }); 
      } 
    }
    gradeList.sort(function(a, b) {
      return a.upstreamGrade - b.upstreamGrade;
    })
    return gradeList[0];
  }
}

function connectivityOfParentLine(parentOfNode) {
  if (parentOfNode.parents.length == 1 && parentOfNode.parents[0].length == 0) {
    return 1;  
  }
  else {
    let gradeList = [];
    for (let y = 0; y < parentOfNode.parents[0].length; y++) {
      gradeList.push(
        Math.max(
          getConnectivity(parentOfNode.self, parentOfNode.parents[0][y].self),
          connectivityOfParentLine(parentOfNode.parents[0][y])
        )
      )
    }
    return Math.min(...gradeList); 
  }
}

function getBestTextColor(bgColor) {
    // Remove '#' if present and convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance
    const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

    // Return white for dark backgrounds and black for light backgrounds
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function processCellColors(cells2, classifiedLevels=null) {
  var cells = graph.getModel().cells;

  if (classifiedLevels == null) {
    classifiedLevels = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],

    ]; 
  }

  stateRecord.nodes5Grade = {};
  stateRecord.nodes9Grade = {};

  // Loop through each cell
  for (var id in cells) {
    var cell = cells[id];

    let gradeLevel = -1;
    let fiveGrade = -1;

    // Check if the cell is a vertex (node) and not an edge
    if (graph.getModel().isVertex(cell)) {
      let nodeId = cell.node_id;
      // Perform some action on each node (vertex)
      // You can customize the action here, e.g., changing color, adding labels, etc.
      let classifiedResultLevel = classifiedLevels[nodeId];
      let nodeName = stateRecord.nodes[nodeId];
      let isForced = isForcedSpecial(nodeName);   
      let hasPerfect = hasPerfectCandidate(nodeName, classifiedResultLevel);
      let hasBest = hasBestCandidate(classifiedResultLevel);
      let definedLevel = null;
      if (stateRecord.nodeAttributes[nodeId].level) {
        if (!isNaN(stateRecord.nodeAttributes[nodeId].level)) {
          definedLevel = stateRecord.nodeAttributes[nodeId].level;
          definedLevel = parseInt(definedLevel);
        } 
      }

      if (isForced) {
        hasPerfect = false;
        hasBest = false;
      }


      if (colorByGrade && !nodeName.includes("Matn:") && nodeName.charAt(nodeName.length - 1) != "!") {
        if (hasPerfect || hasBest || definedLevel != null) {
          let person; 
          if (hasPerfect) {
            person = getPerfectCandidatePerson(nodeName, classifiedResultLevel);
          }
          else if (hasBest) {
            person = getBestCandidatePerson(classifiedResultLevel);
          }

          if (definedLevel != null) {
            gradeLevel = definedLevel; 
          }
          else if (person != "Prophet") {
            gradeLevel = person[6];
          }  
          else {
            gradeLevel = 1;
          }
 


          let narratorColors = [
              "#ADD8E6", // Light Blue
              "#32CD32", // Lime Green
              "#98FB98", // Pale Green
              "#FFD700", // Gold
              "#FF6347"  // Tomato
          ];
          narratorColors = [
            "#DFFFD6",  // Strong/good narrator
            "#FFFFB3",  // Slightly less strong
            "#FFF2B3",  // Neutral
            "#FFD9B3",  // Weak
            "#FFB3B3"   // Very weak
          ];
          narratorColors = [
            "#DFFFD6",  // Strong/good narrator
            "#FFFF99",  // Slightly less strong
            "#FFE680",  // Neutral
            "#FFCC80",  // Weak
            "#FF9999"   // Very weak
          ];
          narratorColors = [
            "#B3FFB3",  // Strong/good narrator (green)
            "#B3FFFF",  // Slightly less strong (blue-green)
            "#FFFFB3",  // Neutral (yellow)
            "#FFCCB3",  // Weak (light orange)
            "#FF9999"   // Very weak (red)
          ];
          narratorColors = [
            "#A8E6A3",  // Strong/good narrator (light green)
            "#BFF0B3",  // Slightly less strong (pastel green)
            "#D1F7C4",  // Neutral (very light green)
            "#E6F8DC",  // Weak (pale green)
            "#F5FDE9"   // Very weak (almost white-green)
          ];
          narratorColors = [
            "#A3D8E6",  // Strong/good narrator (light blue)
            "#B3E0F0",  // Slightly less strong (pastel blue)
            "#C4E7F7",  // Neutral (very light blue)
            "#DCEFF8",  // Weak (pale blue)
            "#E9F5FD"   // Very weak (almost white-blue)
          ];
          narratorColors = [
            "#99D699",  // Strong/good narrator (light blue)
            "#CCE6CC",  // Slightly less strong (pastel blue)
            "#e6c46a", // Yellow
            "#ff9d0a",  // Weak (light orange)
            "#FF5555",   // Very weak (red)
            "#FFFFFF"   // Very weak (red)
          ];

          let edgeColors = [
            "#0f6927",  // Strong/good narrator (light blue)
            "#96ab96",  // Slightly less strong (pastel blue)
            "#876a1e", // Yellow
            "#d6850b",  // Weak (light orange)
            "#991e08",   // Very weak (red)
            "#000000",  // Weak (light orange)
          ]; 


          fiveGrade = 5;
          if ([1, 2].includes(gradeLevel)) {
            fiveGrade = 0;
          }
          else if ([3].includes(gradeLevel)) {
            fiveGrade = 1;
          } 
          else if ([4, 5].includes(gradeLevel)) {
            fiveGrade = 2;
          }
          else if ([6, 7].includes(gradeLevel)) {
            fiveGrade = 3;
          }
          else if ([8, 9].includes(gradeLevel)) {
            fiveGrade = 4;
          }
          graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, narratorColors[fiveGrade], [cell]); // Example action: change fill color
          graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, edgeColors[fiveGrade], [cell]); // Example action: change fill color
          cell.actual_fill_color = narratorColors[fiveGrade];
          cell.actual_stroke_color = edgeColors[fiveGrade];
 
        } 
        else if (isForced) {
          
        }
        else {
          graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, defaultNodeColor, [cell]); // Example action: change fill color
          graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#000000", [cell]); // Example action: change fill color
          cell.actual_fill_color = defaultNodeColor; 
          cell.actual_stroke_color = "#000000";
        }
        if (stateRecord.nodes[nodeId] != "Prophet") {
          stateRecord.nodes5Grade[nodeId] = fiveGrade;
          stateRecord.nodes9Grade[nodeId] = gradeLevel;
        }
        else {
          stateRecord.nodes5Grade[nodeId] = 0;
          stateRecord.nodes9Grade[nodeId] = 0;
        }
      }
      else if (!nodeName.includes("Matn:") && nodeName.charAt(nodeName.length - 1) != "!") {
        graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, defaultNodeColor, [cell]); // Example action: change fill color
        graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#000000", [cell]); // Example action: change fill color
        cell.actual_fill_color = defaultNodeColor;
        cell.actual_stroke_color = "#000000";
      }   
      else if (nodeName.charAt(nodeName.length - 1) == "!") {
        cell.actual_fill_color = "lightblue"; 
        cell.actual_stroke_color = "blue"; 
      }
    } 
  }


  let nodeIds = [];
  let nodeTypes = [];
  for (let n = 0; n < stateRecord.nodes.length; n++) {
    nodeIds.push(n);
    nodeTypes.push(1);
  }

  nodeIds.sort((a, b) => {
    return stateRecord.maxTeacherLines[a] - stateRecord.maxTeacherLines[b];
  });

  let nodes2 = [];
  for (let n = 0; n < nodeIds.length; n++) {
    nodes2.push(stateRecord.nodes[nodeIds[n]]); 
  }

  for (let n = 0; n < stateRecord.nodes.length; n++) {
    let nodeId = n; 
    let parentList = stateRecord.edgesOfNodes[nodeId].teachers;
    let finalType = 1; 
    for (let p = 0; p < parentList.length; p++) {
      let parent = parentList[p]; 
      let edgeId = stateRecord.edgesOfNodes[nodeId][parent];
      let edgeType = Math.max(stateRecord.edges[edgeId][2], nodeTypes[parent]);
      finalType = edgeType > finalType ? edgeType : finalType;
    }
    nodeTypes[n] = finalType;
  }
  
  stateRecord.parentEdgeTypes = {}; 
  for (var id in cells) { 
    var cell = cells[id];
    if (graph.getModel().isEdge(cell)) {
      let edgeId = parseInt(cell.edge_id); 
      let edge = stateRecord.edges[edgeId];
      let sourceId = edge[0];
      let targetId = edge[1];

      let parentsOfNode = stateRecord.parentsOfNode;
      let parentLineToUse;
      for (let p = parentsOfNode[targetId].parents.length - 1; p >= 0; p--) {
        for (parentLineNo in parentsOfNode[targetId].parents[p]) {
          let parentLine = parentsOfNode[targetId].parents[p][parentLineNo];
          if (parentLine.self == sourceId) {
            parentLineToUse = parentLine;
            break;
          }
        }
      }

      let upstreamInfo = gradeOfParentLine(parentLineToUse);
      let upstreamEdgeType = connectivityOfParentLine(parentLineToUse);
      let parent5Grade = upstreamInfo.upstreamGrade;

      let edgeColors = [ 
        "#000000",  // black 
        "#0f6927",  // Strong/good narrator (light blue)
        "#96ab96",  // Slightly less strong (pastel blue)
        "#876a1e", // Yellow  
        "#d6850b",  // Weak (light orange)
        "#991e08"   // Very weak (red)
      ];
      
      if (linkGrading) {
        graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, edgeColors[parent5Grade], [cell]); // Example action: change fill color
        cell.actual_stroke_color = edgeColors[parent5Grade];
      }
      else {
        graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, stateRecord.edges[cell.edge_id][4], [cell]); // Example action: change fill color
        cell.actual_stroke_color = stateRecord.edges[cell.edge_id][4];  
      }
      
      if (edge[2] == 1) {
        graph.setCellStyles(mxConstants.STYLE_DASHED, 0, [cell]); // Example action: change fill color 
      }
      else if (edge[2] == 2) {
        graph.setCellStyles(mxConstants.STYLE_DASHED, 1, [cell]); // Example action: change fill color 
        graph.setCellStyles(mxConstants.STYLE_DASH_PATTERN, dashPatternValue, [cell]); // Example action: change fill color
      } 

      if (displayUpstreamEdgeType) {
        if (upstreamEdgeType == 2 && edge[2] == 1) {    
          graph.setCellStyles(mxConstants.STYLE_DASH_PATTERN, "2 2", [cell]); // Example action: change fill color
          graph.setCellStyles(mxConstants.STYLE_DASHED, 1, [cell]); // Example action: change fill color 
        }  
      }
    }
  }
}

function recolorCells() {
  var cells = graph.getModel().cells;
  for (cellNo in cells) {
    let cell = cells[cellNo];
    if (graph.getModel().isVertex(cell)) {
      let nodeName = stateRecord.nodes[cell.node_id];
      if (!nodeName.includes("Matn:")) {
        recolorCell(cell);  
      }
    } 
    else {
      recolorCell(cell);  
    }
  } 
}

function grayCells() {
  var cells = graph.getModel().cells;
  for (cellNo in cells) {
    let cell = cells[cellNo];
    if (graph.getModel().isVertex(cell)) {
      let nodeName = stateRecord.nodes[cell.node_id];
      if (!nodeName.includes("Matn:")) {
        graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#CCCCCC", [cell]); // Example action: change fill color
        graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#000000", [cell]); // Example action: change fill color
      }
    }
    else {
      graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#CCCCCC", [cell]); // Example action: change fill color
    }
  } 
} 

function grayCell(cell) { 
  graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "#CCCCCC", [cell]); // Example action: change fill color
  graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#000000", [cell]); // Example action: change fill color
} 

function recolorCell(cell) {
  if ( cell.actual_fill_color) {
    graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, cell.actual_fill_color, [cell]); // Example action: change fill color
  }
  else {
    graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, defaultNodeColor, [cell]); // Example action: change fill color
  }
  if ( cell.actual_stroke_color) {
    graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, cell.actual_stroke_color, [cell]); // Example action: change fill color
  }
  else {  
    graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#000000", [cell]); // Example action: change fill color
  }
}

function grayNode(nodeId) {
  let cells = graph.getModel().cells;
  let cell = null;
  for (cellNo in cells) {
    cell = cells[cellNo];
    if (cell.node_id == nodeId) {
      break;
    }
  }
  grayCell(cell);
}

function recolorNode(nodeId) {
  let cells = graph.getModel().cells;
  let cell = null;
  for (cellNo in cells) {
    cell = cells[cellNo];
    if (cell.node_id == nodeId) {
      break;
    }
  }
  recolorCell(cell);
}

function recolorEdge(edgeId) {
  let cells = graph.getModel().cells;
  let cell = null;
  for (cellNo in cells) {
    cell = cells[cellNo];
    if (cell.edge_id == edgeId) {
      break;
    }
  }
  recolorCell(cell);
}

function recolorTree(parentsOfNode) {
  let self_node_id = parentsOfNode.self;
  if (!stateRecord.nodes[self_node_id].includes("Matn: "))
    recolorNode(parentsOfNode.self); 
  for (let i = 0; i < parentsOfNode.parents.length; i++) {
    for (let j = 0; j < parentsOfNode.parents[i].length; j++) {
      recolorTree(parentsOfNode.parents[i][j]);
      let edgeId = getEdgeId(parentsOfNode.parents[i][j].self, self_node_id);
      recolorEdge(edgeId);
    } 
  }
}

function getPersonFromLevels(classifiedResultLevels, id) {
  for (let i = 0; i < classifiedResultLevels.length; i++) {
    for (let j = 0; j < classifiedResultLevels[i][1].length; j++) {
      let person = classifiedResultLevels[i][1][j][1];
      let personId = person[0];
      if (personId == id) {
        return person;
      }
    }
  }
}

function getPersonFromLevelsXY(classifiedResultLevels, id) {
  for (let i = 0; i < classifiedResultLevels.length; i++) {
    for (let j = 0; j < classifiedResultLevels[i][1].length; j++) {
      let person = classifiedResultLevels[i][1][j][1];
      let personId = person[0];
      if (personId == id) {
        return [i, j];
      }
    }
  }
}

function defaultGrade(nodeId, grade) {
  document.getElementById("status").value = grade;
  delete stateRecord.nodeAttributes[nodeId]["grade"];
  let text = editor.getValue();
  let new_text = update_node_atts(text, stateRecord.nodes, stateRecord.coordinates, nodeId)
  let object = text_to_object(new_text);
  stateRecord.coordinates = object.coordinates;
  isProgrammaticChange = true;
  editor.setValue(new_text);
  isProgrammaticChange = false;
  // processCellColors();
}

function defaultLevel(nodeId, gradeLevel) {
  document.getElementById("grade-level").value = gradeLevel;
  delete stateRecord.nodeAttributes[nodeId]["level"];
  let text = editor.getValue();
  let new_text = update_node_atts(text, stateRecord.nodes, stateRecord.coordinates, nodeId)
  let object = text_to_object(new_text);
  stateRecord.coordinates = object.coordinates;
  isProgrammaticChange = true;
  editor.setValue(new_text);
  isProgrammaticChange = false;
  processCellColors("", stateRecord.classifiedLevels);  
} 

function setGrade(nodeId) {
  let grade = document.getElementById("status").value; 
  stateRecord.nodeAttributes[nodeId]["grade"] = grade;
  let text = editor.getValue();
  let new_text = update_node_atts(text, stateRecord.nodes, stateRecord.coordinates, nodeId);
  let object = text_to_object(new_text);
  stateRecord.coordinates = object.coordinates;
  isProgrammaticChange = true;
  editor.setValue(new_text);
  isProgrammaticChange = false;
  // processCellColors();
}

let gradeTimeout = null;
function setGradeWithTimeout(nodeId) {
  if (gradeTimeout != null) {
    clearTimeout(gradeTimeout);
  }
  gradeTimeout = setTimeout(function() {
    setGrade(nodeId);
  }, 500); 
}

function setLevel(nodeId) {
  let gradeLevel = document.getElementById("grade-level").value;
  stateRecord.nodeAttributes[nodeId]["level"] = gradeLevel;
  let text = editor.getValue();
  let new_text = update_node_atts(text, stateRecord.nodes, stateRecord.coordinates, nodeId);
  isProgrammaticChange = true;
  editor.setValue(new_text);
  isProgrammaticChange = false;  let object = text_to_object(new_text);
  stateRecord.coordinates = object.coordinates;
  processCellColors("", stateRecord.classifiedLevels);  
}

function fullEntry(person, nodeAttributes, nodeId) {
  let labels = [
        "ID",
        [
            "Full name",
            "Known as",
            "Kunya",
            "Nisbah",
            "Mawla"
        ],
        [
            "Grade",
            "Birth year:",
            "Death year",
            "Place of life",
            "Place of death",
            "Job"
        ],
        "Students",
        "Teachers",
        "Hadith.Islam-DB",
        "Jarh and Ta'deel",
    ];
  let all_entries = "";

  let info, label; 
  function getLabelInfo(x, y=-1) {
    if (y == -1) {
      return [person[x], labels[x]];
    } 
    else {
      return [person[x][y], labels[x][y]];
    }
  }

  // Known as, Grade, Birth Year, Death Year  
  all_entries += `
  <div class="entry">
    <div class="entry-name">Known as</div>
    <div class="entry-detail">${person[1][1]}</div> 
  </div>`;
  let grade = person[2][0];
  let defaultG = grade;
  if (nodeAttributes.grade) {
    grade = nodeAttributes.grade;
  }
  all_entries += `
  <div class="entry">
    <div class="entry-name">${labels[2][0]} (<a href="javascript:defaultGrade(${nodeId}, \`${defaultG}\`)">Default</a>)</div>
    <input type="text" class="entry-detail"  autocomplete="off"   
    id="status" placeholder="Enter status" onkeypress="setGradeWithTimeout(${nodeId})" 
    style="margin-left: 15px; align-content: center;"
    value="${grade}">
  </div>`; 
  let currentValue = -1;
  var gradeLevel = 0;
  let defaultL = 0;
  if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(person[6])) {
    gradeLevel = person[6];
    defaultL = gradeLevel;  
  }
  if (nodeAttributes.level && !isNaN(nodeAttributes.level)) {
    gradeLevel = nodeAttributes.level;
  } 
  function getValueAttribute() {
    currentValue++;
    return `value="${currentValue}" ${gradeLevel == currentValue ? "selected" : ""}`;
  }
  all_entries += `
  <div class="entry">
    <div class="entry-name">Grade Level  (<a href="javascript:defaultLevel(${nodeId}, ${defaultL})">Default</a>)</div>
    <select id="grade-level" value="${gradeLevel}" onchange="setLevel(${nodeId})" required>
      <option ${getValueAttribute()}>0. Undecided</option> 
      <option ${getValueAttribute()}>1. Sahabi</option> 
      <option ${getValueAttribute()}>2. Thiqah Thiqah</option>
      <option ${getValueAttribute()}>3. Thiqah</option> 
      <option ${getValueAttribute()}>4. Sadūq</option>
      <option ${getValueAttribute()}>5. Maqbūl</option>
      <option ${getValueAttribute()}>6. Majhūl</option>
      <option ${getValueAttribute()}>7. Da'īf</option>
      <option ${getValueAttribute()}>8. Matrūk</option>
      <option ${getValueAttribute()}>9. Kazzāb</option>  
    </select>
    <!--
      <div class="entry-detail">${gradeLevel}</div>  
    -->
  </div>`;
  all_entries += `
  <div class="entry">
    <div class="entry-name">Birth (AH)</div>
    <div class="entry-detail">${person[2][1]}</div> 
  </div>`;
  all_entries += `
  <div class="entry">
    <div class="entry-name">Death (AH)</div>
    <div class="entry-detail">${person[2][2]}</div> 
  </div>`;

  all_entries += `<div class="entry">
  </div>`

  let infoLabel;
  infoLabel = getLabelInfo(0);
  info = infoLabel[0];
  label = infoLabel[1];
  if (info != "") {
    all_entries += `
    <div class="entry">
      <div class="entry-name">${label}</div>
      <div class="entry-detail">${info}</div> 
    </div>`;
  }
  infoLabel = getLabelInfo(1, 0);
  info = infoLabel[0];
  label = infoLabel[1];
  if (info != "") {
    all_entries += `
    <div class="entry">
      <div class="entry-name">${label}</div>
      <div class="entry-detail">${info}</div> 
    </div>`;
  }
  infoLabel = getLabelInfo(1, 2);
  info = infoLabel[0];
  label = infoLabel[1];
  if (info != "") {
    all_entries += `
    <div class="entry">
      <div class="entry-name">${label}</div>
      <div class="entry-detail">${info}</div> 
    </div>`;
  }
  infoLabel = getLabelInfo(1, 3);
  info = infoLabel[0];
  label = infoLabel[1];
  if (info != "") {
    all_entries += `
    <div class="entry">
      <div class="entry-name">${label}</div>
      <div class="entry-detail">${info}</div> 
    </div>`;
  }
  infoLabel = getLabelInfo(1, 4);
  info = infoLabel[0];
  label = infoLabel[1];
  if (info != "") {
    all_entries += `
    <div class="entry">
      <div class="entry-name">${label}</div>
      <div class="entry-detail">${info}</div> 
    </div>`;
  }

  all_entries += `<div class="entry">
  </div>`

  infoLabel = getLabelInfo(2, 3);
  info = infoLabel[0];
  label = infoLabel[1];
  if (info != "") {
    all_entries += `
    <div class="entry">
      <div class="entry-name">${label}</div>
      <div class="entry-detail">${info}</div> 
    </div>`;
  }
  infoLabel = getLabelInfo(2, 4);
  info = infoLabel[0];
  label = infoLabel[1];
  if (info != "") {
    all_entries += `
    <div class="entry">
      <div class="entry-name">${label}</div>
      <div class="entry-detail">${info}</div> 
    </div>`;
  }
  infoLabel = getLabelInfo(2, 5);
  info = infoLabel[0];
  label = infoLabel[1]; 
  if (info != "") {
    all_entries += `
    <div class="entry">
      <div class="entry-name">${label}</div>
      <div class="entry-detail">${info}</div> 
    </div>`;
  }
  infoLabel = getLabelInfo(5);
  info = infoLabel[0];
  label = infoLabel[1]; 
  if (info != "") {
    all_entries += `
    <div class="entry">
      <div class="entry-name">${label}</div>
      <div class="entry-detail"><a href="https://hadith.islam-db.com/narrators/${info}/a" target="_blank">Link</a></div>  
    </div>`;
  }
  return all_entries;
}

function resizeCell(cell, scaleFactor) {
  if (cell != null) {
    var geometry = graph.getCellGeometry(cell);

    if (geometry != null) { 
      // graph.getModel().beginUpdate();
      try {
        geometry = geometry.clone(); // Clone the geometry for safe modification

        // Calculate the change in width and height
        var newWidth = geometry.width * scaleFactor;
        var newHeight = geometry.height * scaleFactor;

        // Adjust x and y to keep the center of the cell the same
        geometry.x -= (newWidth - geometry.width) / 2;
        geometry.y -= (newHeight - geometry.height) / 2;

        // Set the new width and height
        geometry.width = newWidth;
        geometry.height = newHeight;

        // Apply the modified geometry back to the cell
        graph.getModel().setGeometry(cell, geometry);
      } 
      finally {
        // graph.getModel().endUpdate();
      }
    }
  }
}		

// Check the currently selected cells
function getSelectedNodes() {
    var selectedNodes = graph.getSelectionCells().filter(function(cell) {
          return graph.getModel().isVertex(cell);
      }); 
    if (selectedNodes.length > 0) {
        return selectedNodes;
    } else {
        return null;
    }
}

function existingNarratorToggle(nodeId) {
  let nodeName = stateRecord.nodes[nodeId];
  let toggle = document.getElementById("existingNarratorToggle");
  let text = editor.getValue();
  if (!toggle.checked) {
    if (extractIdFromBrackets(nodeName) == "") {
      return;
    }
    else {
      let new_text = set_node_id(text, stateRecord.nodes, stateRecord.coordinates, nodeId, "");
      editor.setValue(new_text);
      closePopover();  
      // createPopover(popoverCell, popoverState);
      return;
    }
  }
  else {
    let new_text = set_node_id(text, stateRecord.nodes, stateRecord.coordinates, nodeId, null); 
    editor.setValue(new_text);
    closePopover();  
    // createPopover(popoverCell, popoverState);
    return;
  }
}

function closePopover() {
  document.getElementById("graphPopover").remove();
} 

let popoverCell = null;
let popoverState = null;
function createPopover(cell, state) { 
  popoverCell = cell;
  popoverState = state;
  // Get the coordinates and size of the cell in the graph
    var cellX = state.x;
    var cellY = state.y;
    var clicked_nodeId = cell.node_id;

    if (stateRecord.nodes[clicked_nodeId] == "Prophet") {
      return;
    }

    var cellWidth = state.width;
    var cellHeight = state.height;
    var popoverWidth = 300;
    var popoverHeight = 400; 
    // Get the graph container's bounding box for positioning relative to the container
    var containerRect = graph.container.getBoundingClientRect();
    // Calculate the exact position to place the popover near the clicked cell
    // Account for scrolling by including window.pageXOffset and pageYOffset
    var popoverX = containerRect.left + window.pageXOffset + cellX + cellWidth + 10;
    var popoverY = containerRect.top + window.pageYOffset + cellY; //+ cellHeight / 2;

    if (popoverX + popoverWidth > window.innerWidth) { 
        // If it would exceed the window's right edge, position it to the left of the cell
        popoverX = containerRect.left + window.pageXOffset + cellX - popoverWidth - 10;
    }

    if (popoverY + popoverHeight > window.innerHeight) { 
      // If it would exceed the window's right edge, position it to the left of the cell
      popoverY = window.innerHeight - popoverHeight;     
      if (popoverY < 0) { 
        popoverY = containerRect.top + window.pageYOffset + cellY - popoverHeight / 2 + cellHeight;   
      } 
    } 

    // console.log(containerRect.left + window.pageXOffset + cellX, containerRect.top + window.pageYOffset + cellY)
    // console.log(cellWidth, cellHeight)
    // Create a popover element (this could be a simple div with styling)
    var popover = document.createElement('div');
    popover.id = 'graphPopover';
    popover.style.position = 'absolute';
    popover.style.left = popoverX + 'px';
    popover.style.top = popoverY + 'px';
    // popover.style.transform = 'translate(-50%, -50%)'; // Center the popover horizontally and vertically
    popover.style.background = '#f8f9fa';
    popover.style.border = '1px solid #dee2e6';
    popover.style.padding = '10px';
    popover.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
    popover.style.zIndex = '9999';  
    popover.style.width = popoverWidth;   
    popover.style.height = popoverHeight;  


    popover.className = 'popover';

    let nodeId = clicked_nodeId;
    let classifiedResultLevel = stateRecord.classifiedLevels[nodeId];
    let nodeAttributes = stateRecord.nodeAttributes[nodeId];

    let chosenLevel = 0;
    let chosenLevelIndex = 0;
    let extractedId = extractIdFromBrackets(stateRecord.nodes[nodeId]);
    let idChosen = false;
    if (extractedId != null && extractedId != "") {
      chosenXY = getPersonFromLevelsXY(classifiedResultLevel, extractedId);
      chosenLevel = chosenXY[0];
      chosenLevelIndex = chosenXY[1];
      idChosen = true;
    }
    else if (extractedId == "") {
      chosenLevelIndex = -1;
    } 

    let entry = ``;
    classifiedResultLevel.forEach((nodeResultLevel, index2) => {
      if (index2 < 35 || true) { 
        let levelName = nodeResultLevel[0];
        let currentLevelList = nodeResultLevel[1];
  
        // Check whether to keep <details> open or closed by default
        if (index2 != chosenLevel) {
          entry += `<div class="styled-details">
                    <details><summary>${levelName}</summary>`;
        } 
        else {
          entry += `<div class="styled-details">
                    <details open><summary>${levelName}</summary>`;
        }
  
        currentLevelList.forEach((personChoice, index) => {
          let value = personChoice[0];
          if (isNaN(value)) value = 1;
          let person = personChoice[1];
          let personName = person[1][1];
          let hadithdb_id = person[5];
          let id = person[0];
          let gradeWithIds = personChoice.length >= 4 ? personChoice[3] : "";
          if (gradeWithIds == null) {
            gradeWithIds = "Different from id";
          } 
  
          // Wrap each option in a div with a specific class for highlighting and selection
          entry += `<div class="option ${chosenLevel == index2 && chosenLevelIndex == index && idChosen ? "selected" : ""}" data-person-id="${id}" clicked-node-id="${clicked_nodeId}">
                      <p><a href="https://hadith.islam-db.com/narrators/${hadithdb_id}/a">${personName}</a> 
                      (%${value*100})<br/>
                      ${person[2][0]}<br/> 
                      ${personChoice.length >= 4 ? "With id(s): " + gradeWithIds +  "<br/>" : ""}
                      عدة الطلاب والشيوخ: ${personChoice[2]}
                      </p>
                    </div>`;
        });
  
        entry += `</details></div>`;  
      }
    });
    // console.log(entry); 


    let personId = 4824;
    let person = finalNarratorData[personId];
    let all_entries = "";
    let nodeName = stateRecord.nodes[nodeId];

    if (isForcedSpecial(nodeName)) {
      all_entries += `
      <div class="entry">Self-Made Narrator</div>`;
      let grade;
      if (nodeAttributes.grade) {
        grade = nodeAttributes.grade;
      }
      else {
        grade = "";
      }
      all_entries += `
      <div class="entry">
        <div class="entry-name">${labels[2][0]}</div> 
        <input type="text" class="entry-detail"  autocomplete="off"   
        id="status" placeholder="Enter status" onkeypress="setGradeWithTimeout(${nodeId})" 
        style="margin-left: 15px; align-content: center;"
        value="${grade}">
      </div>`; 
      let currentValue = -1;
      let gradeLevel = 0;
      let defaultL = 0;  
      if (nodeAttributes.level && !isNaN(nodeAttributes.level)) {
        gradeLevel = nodeAttributes.level;
      } 
      function getValueAttribute() {
        currentValue++;
        return `value="${currentValue}" ${gradeLevel == currentValue ? "selected" : ""}`;
      } 
      all_entries += `
      <div class="entry">
        <div class="entry-name">Grade Level  (<a href="javascript:defaultLevel(${nodeId}, ${defaultL})">Default</a>)</div>
        <select id="grade-level" value="${gradeLevel}" onchange="setLevel(${nodeId})" required>
          <option ${getValueAttribute()}>0. Undecided</option> 
          <option ${getValueAttribute()}>1. Sahabi</option> 
          <option ${getValueAttribute()}>2. Thiqah Thiqah</option>
          <option ${getValueAttribute()}>3. Thiqah</option> 
          <option ${getValueAttribute()}>4. Sadūq</option>
          <option ${getValueAttribute()}>5. Maqbūl</option>
          <option ${getValueAttribute()}>6. Majhūl</option>
          <option ${getValueAttribute()}>7. Da'īf</option>
          <option ${getValueAttribute()}>8. Matrūk</option>
          <option ${getValueAttribute()}>9. Kazzāb</option>  
        </select>
        <!--
          <div class="entry-detail">${gradeLevel}</div>  
        -->
      </div>`;
    }
    else if (hasPerfectCandidate(nodeName, classifiedResultLevel)) {
      person = getPerfectCandidatePerson(nodeName, classifiedResultLevel);
      all_entries += fullEntry(person, nodeAttributes, nodeId);
    }
    else if (hasBestCandidate(classifiedResultLevel)) {
      person = getBestCandidatePerson(classifiedResultLevel);
      all_entries += fullEntry(person, nodeAttributes, nodeId); 
    } 
    else {
      all_entries += `
      <div class="entry">No narrator identified. Use the other tab.</div>`;
    }

    all_entries += `
        <span>Use existing narrator: <input type="checkbox" style="width: unset;" id="existingNarratorToggle" ${!isForcedSpecial(nodeName) ? "checked" : ""} onchange="existingNarratorToggle(${nodeId})">
   </span>`;  

    popover.innerHTML = `  <!-- Tab Selector -->
      <div class="tab-selector">
        <button id="tab-details" class="tab active">Details</button>
        <button id="tab-info" class="tab">Narrator Options</button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Details Tab -->
        <div id="details-tab" class="tab-pane active">
          <div class="details-list" id="details-list">
            ${all_entries}
            <!-- Add more entries as needed -->
          </div>
        </div>

        <!-- Info & Edit Tab -->
        <div id="info-tab" class="tab-pane">
          <div class="info-block">
            ${entry}
          </div>
        </div>
      </div>
    `;
    // Append the popover to the body
    document.body.appendChild(popover); 
    // Add a close button listener to remove the popover

    document.getElementById('tab-details').addEventListener('click', function() {
      // Switch to Details Tab
      switchTab('details-tab', 'tab-details');
    });

    document.getElementById('tab-info').addEventListener('click', function() {
      // Switch to Info & Edit Tab
      switchTab('info-tab', 'tab-info');
    });

    // Add event listeners to all the .option elements for selection
    document.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', function() {
        let selected = false;
        let id = parseInt(this.getAttribute('data-person-id'));

        if (this.classList.contains('selected')) {
          selected = true;
        }

        // Remove 'selected' class from all options
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        let node_id = this.getAttribute('clicked-node-id');
        // Add 'selected' class to the clicked option 
        if (!selected) {
          this.classList.add('selected');  
          document.getElementById('details-list').innerHTML = fullEntry(
            getPersonFromLevels(stateRecord.classifiedLevels[node_id], id), 
            nodeAttributes, 
            node_id      
          ); 
          let text = editor.getValue();
          let new_text = set_node_id(text, stateRecord.nodes, stateRecord.coordinates, node_id, id);
          editor.setValue(new_text);
          let object = text_to_object(new_text);
          stateRecord.nodes = object.nodes;
          stateRecord.coordinates = object.coordinates;

          runNarratorRecognitionInBackground(stateRecord.nodes, stateRecord.edges, graph);
          // Get all cells in the graph model

        }
        else {
          let text = editor.getValue();
          let new_text = set_node_id(text, stateRecord.nodes, stateRecord.coordinates, node_id, null);
          editor.setValue(new_text);
          let object = text_to_object(new_text);
          stateRecord.nodes = object.nodes;
          stateRecord.coordinates = object.coordinates;

          runNarratorRecognitionInBackground(stateRecord.nodes, stateRecord.edges, graph);
        }
      });
    });

    function switchTab(tabId, buttonId) {
      // Hide all tab content
      document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('active');
      });

      // Remove active class from all buttons
      document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
      });

      // Show the clicked tab content and set button to active
      document.getElementById(tabId).classList.add('active');
      document.getElementById(buttonId).classList.add('active');
    }
}

function createGradePopover(cell, state) { 
  popoverCell = cell;
  popoverState = state;
  // Get the coordinates and size of the cell in the graph
    var cellX = state.x;
    var cellY = state.y;
    var clicked_nodeId = cell.node_id;

    if (stateRecord.nodes[clicked_nodeId] == "Prophet") {
      return;
    }

    var cellWidth = state.width;
    var cellHeight = state.height;
    var popoverWidth = 300;
    var popoverHeight = 400; 
    // Get the graph container's bounding box for positioning relative to the container
    var containerRect = graph.container.getBoundingClientRect();
    // Calculate the exact position to place the popover near the clicked cell
    // Account for scrolling by including window.pageXOffset and pageYOffset
    var popoverX = containerRect.left + window.pageXOffset + cellX + cellWidth + 10;
    var popoverY = containerRect.top + window.pageYOffset + cellY; //+ cellHeight / 2;

    if (popoverX + popoverWidth > window.innerWidth) { 
        // If it would exceed the window's right edge, position it to the left of the cell
        popoverX = containerRect.left + window.pageXOffset + cellX - popoverWidth - 10;
    }

    if (popoverY + popoverHeight > window.innerHeight) { 
      // If it would exceed the window's right edge, position it to the left of the cell
      popoverY = window.innerHeight - popoverHeight;     
      if (popoverY < 0) { 
        popoverY = containerRect.top + window.pageYOffset + cellY - popoverHeight / 2 + cellHeight;   
      } 
    } 

    // console.log(containerRect.left + window.pageXOffset + cellX, containerRect.top + window.pageYOffset + cellY)
    // console.log(cellWidth, cellHeight)
    // Create a popover element (this could be a simple div with styling)
    var popover = document.createElement('div');
    popover.id = 'graphPopover';
    popover.style.position = 'absolute';
    popover.style.left = popoverX + 'px';
    popover.style.top = popoverY + 'px';
    // popover.style.transform = 'translate(-50%, -50%)'; // Center the popover horizontally and vertically
    popover.style.background = '#f8f9fa';
    popover.style.border = '1px solid #dee2e6';
    popover.style.padding = '10px';
    popover.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
    popover.style.zIndex = '9999';  
    popover.style.width = popoverWidth;   
    popover.style.height = popoverHeight;  


    popover.className = 'popover';

    let nodeId = clicked_nodeId;
    let classifiedResultLevel = stateRecord.classifiedLevels[nodeId];
    let nodeAttributes = stateRecord.nodeAttributes[nodeId];

    let chosenLevel = 0;
    let chosenLevelIndex = 0;
    let extractedId = extractIdFromBrackets(stateRecord.nodes[nodeId]);
    let idChosen = false;
    if (extractedId != null && extractedId != "") {
      chosenXY = getPersonFromLevelsXY(classifiedResultLevel, extractedId);
      chosenLevel = chosenXY[0];
      chosenLevelIndex = chosenXY[1];
      idChosen = true;
    }
    else if (extractedId == "") {
      chosenLevelIndex = -1;
    } 

    let entry = ``;
    classifiedResultLevel.forEach((nodeResultLevel, index2) => {
      if (index2 < 35 || true) { 
        let levelName = nodeResultLevel[0];
        let currentLevelList = nodeResultLevel[1];

        // Check whether to keep <details> open or closed by default
        if (index2 != chosenLevel) {
          entry += `<div class="styled-details">
                    <details><summary>${levelName}</summary>`;
        } 
        else {
          entry += `<div class="styled-details">
                    <details open><summary>${levelName}</summary>`;
        }

        currentLevelList.forEach((personChoice, index) => {
          let value = personChoice[0];
          if (isNaN(value)) value = 1;
          let person = personChoice[1];
          let personName = person[1][1];
          let hadithdb_id = person[5];
          let id = person[0];
          let gradeWithIds = personChoice.length >= 4 ? personChoice[3] : "";
          if (gradeWithIds == null) {
            gradeWithIds = "Different from id";
          } 

          // Wrap each option in a div with a specific class for highlighting and selection
          entry += `<div class="option ${chosenLevel == index2 && chosenLevelIndex == index && idChosen ? "selected" : ""}" data-person-id="${id}" clicked-node-id="${clicked_nodeId}">
                      <p><a href="https://hadith.islam-db.com/narrators/${hadithdb_id}/a">${personName}</a> 
                      (%${value*100})<br/>
                      ${person[2][0]}<br/> 
                      ${personChoice.length >= 4 ? "With id(s): " + gradeWithIds +  "<br/>" : ""}
                      عدة الطلاب والشيوخ: ${personChoice[2]}
                      </p>
                    </div>`;
        });

        entry += `</details></div>`;  
      }
    });
    // console.log(entry); 


    let personId = 4824;
    let person = finalNarratorData[personId];
    let all_entries = "";
    let nodeName = stateRecord.nodes[nodeId];

    if (isForcedSpecial(nodeName)) {
      all_entries += `
      <div class="entry">Self-Made Narrator</div>`;
      let grade;
      if (nodeAttributes.grade) {
        grade = nodeAttributes.grade;
      }
      else {
        grade = "";
      }
      all_entries += `
      <div class="entry">
        <div class="entry-name">${labels[2][0]}</div> 
        <input type="text" class="entry-detail"  autocomplete="off"   
        id="status" placeholder="Enter status" onkeypress="setGradeWithTimeout(${nodeId})" 
        style="margin-left: 15px; align-content: center;"
        value="${grade}">
      </div>`; 
      let currentValue = -1;
      let gradeLevel = 0;
      let defaultL = 0;  
      if (nodeAttributes.level && !isNaN(nodeAttributes.level)) {
        gradeLevel = nodeAttributes.level;
      } 
      function getValueAttribute() {
        currentValue++;
        return `value="${currentValue}" ${gradeLevel == currentValue ? "selected" : ""}`;
      } 
      all_entries += `
      <div class="entry">
        <div class="entry-name">Grade Level  (<a href="javascript:defaultLevel(${nodeId}, ${defaultL})">Default</a>)</div>
        <select id="grade-level" value="${gradeLevel}" onchange="setLevel(${nodeId})" required>
          <option ${getValueAttribute()}>0. Undecided</option> 
          <option ${getValueAttribute()}>1. Sahabi</option> 
          <option ${getValueAttribute()}>2. Thiqah Thiqah</option>
          <option ${getValueAttribute()}>3. Thiqah</option> 
          <option ${getValueAttribute()}>4. Sadūq</option>
          <option ${getValueAttribute()}>5. Maqbūl</option>
          <option ${getValueAttribute()}>6. Majhūl</option>
          <option ${getValueAttribute()}>7. Da'īf</option>
          <option ${getValueAttribute()}>8. Matrūk</option>
          <option ${getValueAttribute()}>9. Kazzāb</option>  
        </select>
        <!--
          <div class="entry-detail">${gradeLevel}</div>  
        -->
      </div>`;
    }
    else if (hasPerfectCandidate(nodeName, classifiedResultLevel)) {
      person = getPerfectCandidatePerson(nodeName, classifiedResultLevel);
      all_entries += fullEntry(person, nodeAttributes, nodeId);
    }
    else if (hasBestCandidate(classifiedResultLevel)) {
      person = getBestCandidatePerson(classifiedResultLevel);
      all_entries += fullEntry(person, nodeAttributes, nodeId); 
    } 
    else {
      all_entries += `
      <div class="entry">No narrator identified. Use the other tab.</div>`;
    }

    all_entries += `
        <span>Use existing narrator: <input type="checkbox" style="width: unset;" id="existingNarratorToggle" ${!isForcedSpecial(nodeName) ? "checked" : ""} onchange="existingNarratorToggle(${nodeId})">
   </span>`;  

    popover.innerHTML = `  <!-- Tab Selector -->
      <div class="tab-selector">
        <button id="tab-details" class="tab active">Details</button>
        <button id="tab-info" class="tab">Narrator Options</button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Details Tab -->
        <div id="details-tab" class="tab-pane active">
          <div class="details-list" id="details-list">
            ${all_entries}
            <!-- Add more entries as needed -->
          </div>
        </div>

        <!-- Info & Edit Tab -->
        <div id="info-tab" class="tab-pane">
          <div class="info-block">
            ${entry}
          </div>
        </div>
      </div>
    `;
    // Append the popover to the body
    document.body.appendChild(popover); 
    // Add a close button listener to remove the popover

    document.getElementById('tab-details').addEventListener('click', function() {
      // Switch to Details Tab
      switchTab('details-tab', 'tab-details');
    });

    document.getElementById('tab-info').addEventListener('click', function() {
      // Switch to Info & Edit Tab
      switchTab('info-tab', 'tab-info');
    });

    // Add event listeners to all the .option elements for selection
    document.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', function() {
        let selected = false;
        let id = parseInt(this.getAttribute('data-person-id'));

        if (this.classList.contains('selected')) {
          selected = true;
        }

        // Remove 'selected' class from all options
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        let node_id = this.getAttribute('clicked-node-id');
        // Add 'selected' class to the clicked option 
        if (!selected) {
          this.classList.add('selected');  
          document.getElementById('details-list').innerHTML = fullEntry(
            getPersonFromLevels(stateRecord.classifiedLevels[node_id], id), 
            nodeAttributes, 
            node_id      
          ); 
          let text = editor.getValue();
          let new_text = set_node_id(text, stateRecord.nodes, stateRecord.coordinates, node_id, id);
          editor.setValue(new_text);
          let object = text_to_object(new_text);
          stateRecord.nodes = object.nodes;
          stateRecord.coordinates = object.coordinates;

          runNarratorRecognitionInBackground(stateRecord.nodes, stateRecord.edges, graph);
          // Get all cells in the graph model

        }
        else {
          let text = editor.getValue();
          let new_text = set_node_id(text, stateRecord.nodes, stateRecord.coordinates, node_id, null);
          editor.setValue(new_text);
          let object = text_to_object(new_text);
          stateRecord.nodes = object.nodes;
          stateRecord.coordinates = object.coordinates;

          runNarratorRecognitionInBackground(stateRecord.nodes, stateRecord.edges, graph);
        }
      });
    });

    function switchTab(tabId, buttonId) {
      // Hide all tab content
      document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('active');
      });

      // Remove active class from all buttons
      document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
      });

      // Show the clicked tab content and set button to active
      document.getElementById(tabId).classList.add('active');
      document.getElementById(buttonId).classList.add('active');
    }
}


let highlightedCell = null;  // Track the currently highlighted cell
let oldCellStyle = null; 
var zoomTimeout;

// Function to load the diagram
function loadGraph(xmlString) {
  var container = document.getElementById('graphContainer');
  // Checks if the browser is supported
  if (!mxClient.isBrowserSupported()) {
    mxUtils.error('Browser is not supported!', 200, false);
  } 
  else {
    // Disables the built-in context menu
    // Creates the graph inside the given container
    var graph = container.graph;
    var parent = graph.getDefaultParent();
    // Enables rubberband selection
    var rubberband = new mxRubberband(graph);
    graph.setConnectable(false); // Disables edge creation by default
    graph.setCellsResizable(true); // Allows resizing of cells
    graph.setCellsLocked(false); // Allow edits on cells
    // Set up panning with Ctrl+click
   
    graph.panningHandler.useLeftButtonForPanning = true; // Don't pan with simple left click
    graph.setPanning(true); // Enables panning (but needs further setup)
    
    // Enables HTML labels as wrapping is only available for those
    graph.setHtmlLabels(true);
    // Listen for cell click events

    // Add zoom functionality using the 'wheel' event
    container.addEventListener('wheel', function(evt) {
        evt.preventDefault(); // Prevent default scroll behavior

        // Check if the user is holding the Ctrl key (common for zoom gestures)
        if (evt.ctrlKey) {
            clearTimeout(zoomTimeout); // Clear the previous timeout if the user is zooming rapidly

            zoomTimeout = setTimeout(function() {
                var scaleFactor = (evt.deltaY > 0) ? 0.9 : 1.1;
                var newScale = graph.view.scale * scaleFactor;


                graph.zoomTo(newScale); // Adjust the zoom level
            }, 5); // Delay the zoom operation slightly to avoid oversensitivity

            // var scaleFactor = (evt.deltaY > 0) ? 0.9 : 1.1; // Zoom in or out based on scroll direction
            // graph.zoomTo(graph.view.scale * scaleFactor); // Adjust the zoom level
        } 
        else {
          // No Ctrl key, interpret as panning
          var scale = graph.view.scale; // Get the current zoom scale
          var dx = evt.deltaX / scale; // Adjust horizontal movement by the scale
          var dy = evt.deltaY / scale; // Adjust vertical movement by the scale
  
          graph.view.setTranslate(graph.view.translate.x - dx, graph.view.translate.y - dy);
        }
    }, { passive: false });

    // Track whether panning is temporarily disabled
    var isCtrlPressed = false;

    // Listen for keydown and keyup to detect Ctrl press
    document.addEventListener('keydown', function(evt) {
        if (evt.key === 'Control') {
            isCtrlPressed = true;
            rubberband.setEnabled(true); // Explicitly enable rubberband selection
            graph.setPanning(false); // Disable panning when Ctrl is pressed
            console.log('Rubberband enabled');
        }
    });

    document.addEventListener('keyup', function(evt) {
        if (evt.key === 'Control') {
            isCtrlPressed = false;
            rubberband.setEnabled(false); // Explicitly disable rubberband selection
            graph.setPanning(true); // Re-enable panning when Ctrl is released
            console.log('Rubberband disabled');
        }
    });

    

    // Override the mouseMove function to adjust the position of the rubberband
    rubberband.mouseMove = function(sender, me) {
        var graphContainer = document.getElementById('graphContainer');
        var containerOffset = graphContainer.getBoundingClientRect();

        var x = me.getGraphX() - containerOffset.left;
        var y = me.getGraphY() - containerOffset.top; 

        // Apply the new position to the rubberband
        mxRubberband.prototype.mouseMove.apply(this, [sender, me]);
    };

    // Ensure that panning only works when the rubberband is disabled (Ctrl is not pressed)
    graph.container.addEventListener('mousedown', function(evt) {
        if (!isCtrlPressed) {
            // Only allow panning when Ctrl is not pressed
            graph.panningHandler.isActive = true;
        }
    });

    graph.container.addEventListener('mouseup', function(evt) {
        // Disable panning after mouse up to prevent accidental dragging
        graph.panningHandler.isActive = false;
    });

    // Disable the default browser right-click context menu for the graph container
    mxEvent.disableContextMenu(container);


    // Add an event listener for 'contextmenu' to block the browser's default menu
    graph.container.addEventListener('contextmenu', function(evt) {
      evt.preventDefault(); // This prevents the default context menu
      return false;
    });

    graph.addListener(mxEvent.CLICK, function(sender, evt) {
      var cell = evt.getProperty('cell'); // Get the clicked cell
      var me = evt.getProperty('event'); // Get the mouse event
      // Remove any existing popover before adding a new one
      var existingPopover = document.getElementById('graphPopover');
      if(existingPopover) {
        existingPopover.remove();
      }
      if (cell != null && graph.getModel().isVertex(cell)) {
        // Check if the right mouse button was clicked
        if (me.button === 2) { 
          me.preventDefault(); // This prevents the browser's context menu

          var state = graph.view.getState(cell);
          createPopover(cell, state);
        }
      }
      if (cell != null && graph.getModel().isEdge(cell)) {

        let edgeId = parseInt(cell.edge_id);
        let sourceId = stateRecord.edges[edgeId][0];
        let targetId = stateRecord.edges[edgeId][1];

        let source5Grade = stateRecord.nodes5Grade[sourceId];
        let source9Grade = stateRecord.nodes5Grade[sourceId];

        let target5Grade = stateRecord.nodes5Grade[targetId];
        let target9Grade = stateRecord.nodes5Grade[targetId];

        let parentsOfNode = stateRecord.parentsOfNode;
        let parentLineToUse;
        for (let p = parentsOfNode[targetId].parents.length - 1; p >= 0; p--) {
          for (parentLineNo in parentsOfNode[targetId].parents[p]) {
            let parentLine = parentsOfNode[targetId].parents[p][parentLineNo];
            if (parentLine.self == sourceId) {
              parentLineToUse = parentLine;
              break;
            }

          }
        }

        // console.log(parentLineToUse); 
        // console.log(gradeOfParentLine(parentLineToUse, 1));

      }

      
    });

    // Add an event listener to handle selection changes
    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt) {
      let selectedNodes = getSelectedNodes();
      if (selectedNodes != null) {
        // grayCells(); 
        for (cell of selectedNodes) {
          recolorTree(stateRecord.parentsOfNode[cell.node_id]); 
        }
      }
      else { 
        recolorCells();   
      }
    });

    graph.addMouseListener({
        currentState: null,

        mouseMove: function(sender, me) {
          if (getSelectedNodes() == null) {
            var cell = me.getCell();  // Get the cell under the mouse

            // If the mouse is over a new cell, apply the highlight
            let sizeScale = 1.2; 

            let toHighlight = false;
            let cellToHighlight = cell; 
            let toDelight = false;
            let cellToDelight = highlightedCell;

            let isMatn = false;

            if (cell != highlightedCell) {
              // Reset the style of the previously highlighted cell
              if (highlightedCell != null) { 
                toDelight = true;
              } 
              
              // Highlight the new cell by changing its style
              if (cell != null && graph.getModel().isVertex(cell)) {
                let nodeName = stateRecord.nodes[cell.node_id];
                if (nodeName.includes("Matn: ")) {
                  isMatn = true;
                }
                toHighlight = true;
                let style = graph.getCellStyle(cell); // Get the cell's style as an object
                oldCellStyle = style;
              } 
            }

            if (cell != null && graph.getModel().isVertex(cell)) {
              highlightedCell = cell;  // Track the new highlighted cell
            }
            else {
              highlightedCell = null;  // Reset the highlighted cell if the mouse is not over a cell
            }

            if (toDelight ) {
              graph.getModel().beginUpdate();
              try { 
                resizeCell(cellToDelight, 1 / sizeScale); // Scale the cell up by 20% 
                for (styleName in oldCellStyle) {
                  if (!["shape", "perimeter"].includes(styleName)) {
                    graph.setCellStyles(styleName, oldCellStyle[styleName], [cellToDelight]);
                  }
                }
                recolorCells(); 
              } 
              finally { 
                  graph.getModel().endUpdate(); 
              }
            } 
            if ( toHighlight) {
              graph.getModel().beginUpdate();
              try {
                resizeCell(cell, sizeScale); // Scale the cell up by 20% 
                graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 5, [cell]);  // Highlight color
                let newFont = graph.getCellStyle(cell)["fontSize"];
                graph.setCellStyles(mxConstants.STYLE_FONTSIZE, newFont * sizeScale, [cell]);  
                grayCells();
                recolorTree(stateRecord.parentsOfNode[cell.node_id]); 
              }  
              finally { 
                  graph.getModel().endUpdate();
              }
            }
          }
        },

        mouseDown: function(sender, me) {
            // Optional: Add behavior on mouse down
            if (!isCtrlPressed) {
                // Only allow panning when Ctrl is not pressed
                graph.panningHandler.isActive = true;
            }
        },

        mouseUp: function(sender, me) {
          // Disable panning after mouse up to prevent accidental dragging
          graph.panningHandler.isActive = false;
        }
    });

    // Initialize the undo manager
    var undoManager = new mxUndoManager();

    // Function to add only user actions to the undo manager
    function addUndoListener(graph) {
        // Custom listener to check for user actions
        undoListener = function(sender, evt) {
            var edit = evt.getProperty('edit');

            // Filter the edits to only add user actions
            var significantEdits = edit.changes.filter(function(change) {
                return (
                    change instanceof mxGeometryChange || // Cell geometry (move, resize)
                    change instanceof mxValueChange ||    // Value/text changes
                    change instanceof mxCellAttributeChange || // Attribute changes
                    change instanceof mxChildChange        // Cell added/removed
                ); 
            });

            // If any significant edits are found, add them to the undo manager
            if (significantEdits.length > 0) {
                undoManager.undoableEditHappened(edit);
            }
        };

        // Listen to changes made to the graph's model and view
        graph.getModel().addListener(mxEvent.UNDO, undoListener);
        graph.getView().addListener(mxEvent.UNDO, undoListener);
    }

    // Initialize the graph and add the undo manager
    var graph = container.graph;
    addUndoListener(graph);

    // Enable undo/redo using keyboard shortcuts
    document.addEventListener('keydown', function(evt) {
      if (evt.ctrlKey && (evt.key === 'z' || evt.key === 'y')) {

        if (!isCodeMirrorFocused) {
          evt.preventDefault(); // Prevent default behavior (e.g., scrolling)
        }  
 
        // Check if the active element is an input or textarea (inside a modal or elsewhere)
        const activeElement = document.activeElement;
        const isTextInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

        if (isTextInput) {
            // Let the default behavior happen in the text input and prevent graph undo
            return;
        } 

        if (evt.ctrlKey && evt.key === 'z') {
            undoManager.undo();
            console.log('Undo action performed');
        } else if (evt.ctrlKey && evt.key === 'y') {
            undoManager.redo();
            console.log('Redo action performed');
        }
      }
    });

    // Example: Making an undoable edit
    graph.getModel().beginUpdate();
    try {
        // Add cells or make changes here (these changes can be undone)
        var cell = graph.insertVertex(parent, null, 'New Node', 20, 20, 80, 30);
    } finally {
        graph.getModel().endUpdate(); // End the edit, making it undoable
    }



    // Save view state
    var scale = graph.view.scale;
    var translate = {
      x: graph.view.translate.x,
      y: graph.view.translate.y
    };
    // Gets the default parent for inserting new cells. This is normally the first child of the root (i.e., layer 0).
    var parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    try {
      // Fetches all the child vertices and edges from the default parent
      var allCells = graph.getModel().getChildCells(graph.getDefaultParent(), true, true);
      // Removes all the fetched cells from the graph
      graph.removeCells(allCells);
      // Parses the XML containing the diagram
      var doc = mxUtils.parseXml(xmlString);
      var codec = new mxCodec(doc);
      codec.decode(doc.documentElement, graph.getModel());
    } 
    finally {
      // Ends the update and ensures changes are processed
      graph.getModel().endUpdate();
    }

    // Get all cells in the graph model
    var cells = graph.getModel().cells;

    // Function to add hover listeners to existing cells
    function addHoverListenerToCell(cell) {
        var state = graph.getView().getState(cell);

        if (state && state.shape && state.shape.node) {
            // Add a listener for mouseenter (hover) on the cell's DOM element
            mxEvent.addListener(state.shape.node, 'mousemove', function(evt) {
                graph.getModel().beginUpdate();
                try {
                    graph.setCellStyles(mxConstants.STYLE_SCALE, '1.2', [cell]); // Enlarge the cell
                    graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, '#ffeb3b', [cell]); // Change color
                } finally { 
                    graph.getModel().endUpdate();
                }
            });

            // Add a listener for mouseleave on the cell's DOM element
            mxEvent.addListener(state.shape.node, 'mouseleave', function(evt) {
                graph.getModel().beginUpdate();
                try {
                    graph.setCellStyles(mxConstants.STYLE_SCALE, '1.0', [cell]); // Reset size
                    graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, defaultNodeColor, [cell]); // Reset color 
                } finally {
                    graph.getModel().endUpdate();
                }
            });
        }
    }

    // Enable HTML labels
    graph.isHtmlLabel = function(cell) {
      return true; // graph.getModel().isEdge(cell);
    };


    for (id in cells) {
      let cell = cells[id];
      if (graph.getModel().isVertex(cell)) {
        let nodeName = stateRecord.nodes[cell.node_id];
        if (!nodeName.includes("Matn: ")) {
          // addHoverListenerToCell(cell);
        }
      }
    }

    // processCellColors(cells);


    // Restore the view state
    graph.view.scale = scale;
    graph.view.setTranslate(translate.x, translate.y);
    graph.refresh();
    graph.view.validate();
  }
}

function parseDimensions(dimString) {
  const widthMatch = dimString.match(/width='(\d+)'/);
  const heightMatch = dimString.match(/height='(\d+)'/);
  const width = widthMatch ? parseInt(widthMatch[1], 10) : 0;
  const height = heightMatch ? parseInt(heightMatch[1], 10) : 0;
  return [width, height];
}

function autoFitGraph(nodePositions, nodeDimensionsStr) {
  var containerWidth = container.clientWidth;
  var containerHeight = container.clientHeight;
  // Calculating the bounding rectangle of all nodes
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const [width, height] = parseDimensions(nodeDimensionsStr);
  nodePositions.forEach((pos, index) => {
    const [x, y] = pos;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  const graphWidth = maxX - minX;
  const graphHeight = maxY - minY;
  // Calculate scale to fit graph within container
  const xScale = containerWidth / graphWidth;
  const yScale = containerHeight / graphHeight;
  const scale = Math.min(xScale, yScale) * 0.8; // Multiplying by 0.8 to add some padding
  // Set graph scale
  graph.view.scale = scale;
  // Calculate translation to center the graph
  const translatedX = (containerWidth - graphWidth * scale) / 2 - minX * scale;
  const translatedY = (containerHeight - graphHeight * scale) / 2 - minY * scale;
  graph.view.setTranslate(translatedX, translatedY);
}


function zoomIn() {
  var graph = document.getElementById('graphContainer').graph;
  graph.zoomIn();
}

function zoomOut() {
  var graph = document.getElementById('graphContainer').graph;
  graph.zoomOut();
}

let currentNodeSpace = 0.8;
let currentRankSpace = 2.5;
function respaceWithoutUpdate(direction, nodeSpace, rankSpace) {
  
  nodeSpaceToUse = nodeSpace / currentNodeSpace;
  rankSpaceToUse = rankSpace / currentRankSpace;
  currentNodeSpace = nodeSpace;
  currentRankSpace = rankSpace;
  if (["RL", "LR"].includes(direction)) {
    nodeSpace = rankSpaceToUse;
    rankSpace = nodeSpaceToUse;   
  }
  else {
    nodeSpace = nodeSpaceToUse;
    rankSpace = rankSpaceToUse;  
  }

  // Loop through cells
  var cells = graph.getModel().cells;
  // Assuming 'graph' is your mxGraph instance, and 'cell' is the cell you want to update

  graph.getModel().beginUpdate();
  try {
    for (cellNo in cells) {
      var cell = cells[cellNo];
      if (graph.getModel().isVertex(cell))
      {
        // Get the current geometry of the cell
        var geometry = graph.getCellGeometry(cell);
  
        if (geometry != null) {
            // Update the x and y coordinates
            geometry.x = geometry.x * nodeSpace; // Replace newX with the new x position
            geometry.y = geometry.y * rankSpace; // Replace newY with the new y position
    
            // Apply the updated geometry
            graph.getModel().setGeometry(cell, geometry);
        }
      } 
      else if (graph.getModel().isEdge(cell)) {
        var geometry = graph.getCellGeometry(cell);
        if (geometry.points) {
          for (let p = 0; p < geometry.points.length; p++) {  
            let point = geometry.points[p];
            point.x = point.x * nodeSpace;
            point.y = point.y * rankSpace;  
          }
        } 
      }
    }
  } 
  finally {
      // End update and refresh the graph
      graph.getModel().endUpdate();
      graph.refresh();
      graph.view.validate(); 
  }

}
