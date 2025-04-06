function object_to_graph(nodesList, edgeList) {
  // Convert edge list
  const edges = edgeList.map(edge => ({
    to: edge[0],
    from: edge[1]
  }));

  // Convert names to nodes
  const nodes = nodesList.map((name, index) => ({
    id: index, // Assumes IDs are zero-indexed and match the edge list
    label: name
  }));

  const edgesDataset = new vis.DataSet(edges);

  const container = document.getElementById('mynetwork');
  const data = {
    nodes: nodes,
    edges: edgesDataset
  };
  const options = {
    layout: {
      hierarchical: {
		direction: "DU", // LR, UD, DU, RL
		sortMethod: 'directed', // hubsize, directed
		nodeSpacing: 200,
		levelSeparation: 200,
		blockShifting: true, // Disables shifting blocks to fit better but keeps nodes aligned at each level
		edgeMinimization: true, // Disables minimization of edge length, can help in aligning nodes vertically
		parentCentralization: true // Disables centralizing parents above children, can help maintain vertical alignment

      }
    },
    edges: {
      arrows: {
        to: { enabled: true, scaleFactor: 1.2 }
      }
    }, 
	physics: {
		enabled: true,
		solver: 'forceAtlas2Based',
		forceAtlas2Based: {
		  gravitationalConstant: -50,
		  centralGravity: 0.01,
		  springConstant: 0.08,
		  springLength: 100,
		  damping: 0.4,
		  avoidOverlap: 0.4
		},
		maxVelocity: 50,
		minVelocity: 0.1,
		timestep: 0.35
	  } 
  };
  const network = new vis.Network(container, data, options);
  return network;
}

function parseBezierEndpoints(pathData) {
    const commands = pathData.match(/[MLC][^MLC]*/g); // Split the path data into commands
    const points = [];

    commands.forEach((command) => {
        const parts = command.trim().split(/\s+/);
        const type = parts[0].charAt(0);

        if (type === 'M' || type === 'L') {
            // For 'M' and 'L', take the last point directly
            points.push(parts[parts.length - 1]);
        } else if (type === 'C') {
            // For 'C', the endpoint is the last item
            points.push(parts[parts.length - 1]);
        }
    });

    // Convert the points string to coordinates
    const coordinates = points.map(point => {
        const [x, y] = point.split(',');
        return [parseFloat(x), parseFloat(y)];
    });

    return coordinates;
}

function extractSubsequentCurveStarts(d) {
    const segments = d.split(" ");  // Extract segments of the path

    const points = [];
	for (let i = 0; i < segments.length - 1; i++) {
		if (segments[i] == segments[i + 1]) {
			let x = parseFloat(segments[i].split(",")[0]);
			let y = parseFloat(segments[i].split(",")[1]);
			points.push([x, y]);
			i+=1;
		}
	}

    return points;
}

function addLineBreaks(text, maxWidth, fontSize) {
    // Estimating average character width based on font size
    const avgCharWidth = fontSize * 0.2; // This factor might need adjustment for different fonts
    const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);
    
    let currentLineLength = 0;
    let result = '';

    // Split the input text into words
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        // Check if adding this word exceeds the line width
        if (currentLineLength + word.length > maxCharsPerLine) {
            // Start a new line unless it's the very first word
            if (i > 0) {
                result += '\n';
            }
            result += word;
            currentLineLength = word.length;
        } else {
            // Append word to current line
            if (currentLineLength > 0) { // Not the first word on the line
                result += ' ' + word;
                currentLineLength += 1; // for the space
            } else {
                result += word;
            }
            currentLineLength += word.length;
        }
    }

    return result;
}

async function getConversionFactor() {
	let dotString = `digraph G { 
  graph [splines=polyline, nodesep=0.8, ranksep=2.5, rankdir=LR, ];
  node [shape=rect, width=1, height=1]; 
  0
}`;
	const viz = await Viz.instance();
	// Render the graph to SVG
	const svg = await viz.renderSVGElement(dotString, { engine: 'dot' });
	const serializer = new XMLSerializer();
	const svgString = serializer.serializeToString(svg);
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
	
	const nodes = svgDoc.querySelectorAll('g.node');
	const node = nodes[0];
	
	const rect = node.querySelector('polygon');
	const points = rect.getAttribute('points').split(" ");
	let min_x = Infinity;
	let min_y = Infinity;
	let max_x = -Infinity;
	let max_y = -Infinity;
	for (let p = 0; p < points.length; p++) {
		min_x = Math.min(min_x, parseInt(points[p].split(",")[0]));
		min_y = Math.min(min_y, parseInt(points[p].split(",")[1]));
		
		max_x = Math.max(max_x, parseInt(points[p].split(",")[0]));
		max_y = Math.max(max_y, parseInt(points[p].split(",")[1]));
	}
	let dx = max_x - min_x; 
	let dy = max_y - min_y; 
	if (dx != dy) {
		console.log("ERROR: Average of x and y doesn't match.");
	}
	return dx; 
}

async function getGraphCoordinates(nodes, edges, rankdir, ranksep, nodesep, nodeWidth, nodeHeight, matnWidth, matnHeight) {
    // Convert edge list to DOT format
	// console.log(nodeWidth, nodeHeight);
	let factor = await getConversionFactor();
	// console.log("Factor: ", factor);
    let dotString = `digraph G { 
	graph [splines=polyline, nodesep=${nodesep}, ranksep=${ranksep}, rankdir=${rankdir}, ];
node [shape=rect]; \n` 
	+ edges.map(edge => `${edge[0]} -> ${edge[1]}` + (` [minlen=${edge[3]}]`) + ";\n" ).join(" ");
	for (let n = 0; n < nodes.length; n++) {
		if (nodes[n].includes("Matn: ")) {
			dotString += `${n} [width=${matnWidth / factor}, fontsize=24, height=${matnHeight / factor}];\n`;
		}
		else {
			dotString += `${n} [width=${nodeWidth / factor}, height=${nodeHeight / factor}];\n`;
		}
		
	}
	mermaidText = edges.map(edge => `${edge[0]}[${nodes[edge[0]]}] ` + "-".repeat(edge[3]) + `-> ${edge[1]}[${nodes[edge[1]]}]` + "\n" ).join(" ");
	// console.log(mermaidText);
	dotString += "}";
	console.log(dotString);
	const viz = await Viz.instance();
	try {
		// Render the graph to SVG
		const svg = await viz.renderSVGElement(dotString, { engine: 'dot' });
		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(svg);
		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
		
		// console.log(svg);
		
		// Extract nodes and their positions
		const nodes = svgDoc.querySelectorAll('g.node');
		const sortedNodes = Array.from(nodes).sort((a, b) => {
			const titleA = parseInt(a.querySelector('title').textContent); // Node ID
			const titleB = parseInt(b.querySelector('title').textContent); // Node ID
			return titleA - titleB; // Sort numerically by title
		});
		
		let coordinates = Array.from(sortedNodes).map(node => {
			const title = node.querySelector('title').textContent; // Node ID
			const rect = node.querySelector('polygon');
			const points = rect.getAttribute('points').split(" ");
			let x = Infinity;
			let y = Infinity;
			for (let p = 0; p < points.length; p++) {
				x = Math.min(x, parseInt(points[p].split(",")[0]));
				y = Math.min(y, parseInt(points[p].split(",")[1]));
			}
			return [parseInt(x), parseInt(y)]; // Return position as [x, y]
		});
		
		// Extract edges and their bends
		const edges = svgDoc.querySelectorAll('g.edge');
		let sortedEdges = Array.from(edges).sort((a, b) => {
			const numA = parseInt(a.getAttribute('id').replace("edge", "")); // Node ID
			const numB = parseInt(b.getAttribute('id').replace("edge", "")); // Node ID
			return numA - numB; // Sort numerically by title
		});
		let bendCoordinates = Array.from(sortedEdges).map(edge => {
			let path = edge.querySelector('path');
			const d = path.getAttribute('d');
			return extractSubsequentCurveStarts(d);
		});
		
		// Calculating the bounding rectangle of all nodes
		let minX = Infinity;
		let minY = Infinity;
		
		coordinates.forEach(pos => {
			const [x, y] = pos;

			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
		});
		
		coordinates = Array.from(coordinates).map(pos => {
			const [x, y] = pos;
			return [x - minX, y - minY]; // Return position as [x, y]
		});
		
		bendCoordinates = Array.from(bendCoordinates).map(edge => {
			return Array.from(edge).map(pos => {
				const [x, y] = pos;
				return [x - minX, y - minY]; // Return position as [x, y]
			});
		});
		
		
			
		return [coordinates.filter(coord => coord !== null), bendCoordinates];
	} catch (error) {
		console.error("Error rendering graph:", error);
		return [];
	}
}


function adjustLayout(layout, direction = "tb", rankSep = 100, nodeSep = 50) {
    // Adjusts an igraph layout based on direction, rank separation, and node separation.
    // Arguments:
    // layout (Array of Arrays): Original layout list containing [x, y] coordinates.
    // direction (String): Direction of layout ("rl", "lr", "tb", "bt").
    // rankSep (Number): Separation between ranks.
    // nodeSep (Number): Separation between nodes within the same rank.
    // Returns:
    // Array of Arrays: New layout with adjusted coordinates.

    let minX = Math.min(...layout.map(coords => coords[0]));
    let minY = Math.min(...layout.map(coords => coords[1]));
    layout = layout.map(([x, y]) => [x - minX, y - minY]);
 
    direction = direction.toLowerCase();
	
    if (direction === "lr") {
        layout = layout.map(([x, y]) => [y, x]);
    } else if (direction === "rl") {
        layout = layout.map(([x, y]) => [-y, x]);
    } else if (direction === "du") {
        layout = layout.map(([x, y]) => [x, -y]);
    }

    layout = layout.map(([x, y]) => [x * rankSep / 10, y * nodeSep / 10]);
    return layout;
}
