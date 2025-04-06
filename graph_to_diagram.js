function diagramHeader() {
    return `
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

    `;
}

function diagramFooter() {
    return `</root>
    </mxGraphModel>
    `;
}

function diagramNode(id, value, style, parent = "1", x = 100, y = 100, shape, nodeId) {
    return `<mxCell id="${id}" node_id="${nodeId}" value="${value}" style="${style}" vertex="1" parent="${parent}">
          <mxGeometry x="${x}" y="${y}" ${shape} as="geometry"/>
        </mxCell>`;
}

function diagramEdge(id, value, style, source, target, parent, bends, edgeId) {
    let xmlString = `<mxCell id="${id}" edge_id="${edgeId}" value="${value}" style="${style}" edge="1" source="${source}" target="${target}" parent="${parent}">
          <mxGeometry width="50" height="50" as="geometry">`;
	
	if (bends.length > 0) {
		xmlString += `<Array as="points">`;
		for (let b = 0; b < bends.length; b++) {
			let [x, y] = bends[b];
			xmlString += `<mxPoint x="${x}" y="${y}"/>`;
		}
		xmlString += `</Array>`;
	}
    xmlString += `</mxGeometry></mxCell>`;
	return xmlString;
}

function removeTextWithinBraces(text) {
    // Regular expression to match any text within {}, non-nested
    let pattern = /\{[^{}]*\}/g;
    // Initialize oldText to differentiate from the result after replacement
    let oldText;
    do {
        oldText = text;
        // Replace the matched text with an empty string
        text = text.replace(pattern, '');
    } while (text !== oldText); // Continue until no more replacements are made
    return text;
}

function parseDimensions(dimString) {
	const widthMatch = dimString.match(/width='(\d+)'/);
	const heightMatch = dimString.match(/height='(\d+)'/);
	
	const width = widthMatch ? parseInt(widthMatch[1], 10) : 0;
	const height = heightMatch ? parseInt(heightMatch[1], 10) : 0;

	return [width, height];
}

function escapeForXMLAttribute(str) {
    return str.replace(/&/g, '&amp;')  // Must be first
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
}

let dashPatternValue = "";
function generateDiagramXml(nodes, edges, positions, bendCoordinates, narratorStyle, narratorShape, compilerStyle, compilerShape, matnStyle, matnShape) {
    let startId = 100;
    let diagramXml = diagramHeader();
	
	let [compilerWidth, compilerHeight] = parseDimensions(compilerShape);
	let [narratorWidth, narratorHeight] = parseDimensions(narratorShape);
	let cXCorrection = (narratorWidth - compilerWidth) / 2;
	let cYCorrection = (narratorHeight - compilerHeight) / 2;


  nodes.forEach((node, i) => {
    node = removeTextWithinBraces(node).trim();
    let style = "";
    let shape = "";		
    if (node.includes("!")) {
      shape = compilerShape;
      style = compilerStyle + "";
      positions[i][0] += cXCorrection;
      positions[i][1] += cYCorrection;
    }
    else if (node.includes("Matn: ")) {
      shape = matnShape;
      style = matnStyle;
    }
    else {
      shape = narratorShape;
      style = narratorStyle;
    }
    node = escapeForXMLAttribute(node.replaceAll("!", "").replace("Matn: ", ""));
    node = node.replaceAll(`(${extractIdFromBrackets(node)})`, "");
    diagramXml += diagramNode(
      `node-${i}`,
      node,
      style + ";strokeWidth=2;rounded=1;",
      "1",
      positions[i][0],
      positions[i][1],
      shape,
      i
    );
  });

  dashPatternValue = "5 5";
  edges.forEach((edge, i) => {
    let sourceId = edge[0];
    let targetId = edge[1];
		let strokeColor = edge[2] == 0 ? "#FF0000" : edge[4];
		let dashPattern = edge[2] == 2 ? `;dashed=1;dashPattern=${dashPatternValue};` : ""; 
		let bends = bendCoordinates[i];
    diagramXml += diagramEdge(
      `edge-${i}`,
      "", 
      `edgeStyle=straight;strokeColor=${strokeColor};${dashPattern};strokeWidth=4;rounded=1;fontSize=19;labelBackgroundColor=#FFFFFF;`,
      `node-${sourceId}`,
      `node-${targetId}`, 
      "1",
			bends,
      i
    );
		if (i == 0 && false) {
			diagramXml += diagramEdge(
				startId + nodes.length + i + 200,
				"",
				`edgeStyle=straight;strokeColor=${strokeColor};${dashPattern}`,
				sourceId,
				targetId,
				"1",
				bends
			);
		}
  });

    diagramXml += diagramFooter();
    return diagramXml;
}

function convertPositionsToArray(positions) {
	return Object.keys(positions).map(key => [positions[key].x, positions[key].y]);
}