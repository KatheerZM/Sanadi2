function get_parent(edges, id) {
	for (const [parent, child] of edges) {
			if (child === id) {
					return parent;
			}
	}
	return -1;
}

function extractIdFromBrackets(string) {
	// Regular expression to match the first set of brackets containing only numbers
	const match = string.match(/\((\d*)\)/);

	// If a match is found, return the ID, otherwise return null
	if (match === null) {
		return null;
	}
	if (match[1] == "") {
		return "";
	} 
	else {
		return parseInt(match[1].replaceAll("(", "").replaceAll(")", "")) ? match[1] : null;
	}
} 

function edit_node_name(text, nodes, finalCoordinates, nodeId, replacement) {
	let lines = text.split("\n");
	let [lineNumber, index] = [finalCoordinates[nodeId].lineNumber, finalCoordinates[nodeId].index];
	let end_index = finalCoordinates[nodeId].end_index;
	let index2 = end_index;
	let line = lines[lineNumber];
	let substring = line.substring(index, index2);
	let newLine = line.substring(0, index) + replacement + line.substring(index2);
	lines[lineNumber] = newLine;
	return lines.join("\n"); 
} 

function set_node_id(text, nodes, finalCoordinates, nodeId, id) {
	let nodeName = nodes[nodeId];
	let newNodeName = "";
	let id1 = id;
	let current_id = extractIdFromBrackets(nodeName);
	if (current_id != null) {
		if (id === null) {
			newNodeName = nodeName.replace(`(${current_id})`, "").trim();
		}
		else if (id === "") {
			newNodeName = nodeName.replace(`(${current_id})`, "()").trim();
		}
		else {
			newNodeName = nodeName.replace(current_id, id.toString());
		}
	}
	else {
		if (nodeName.charAt(nodeName.length - 1) == "!") {
			newNodeName = nodeName.substring(0, nodeName.length - 1);
			newNodeName = newNodeName + " (" + id + ")!";
		}
		else {
			newNodeName = nodeName + " (" + id + ")";
		}
	}
	newNodeName = newNodeName.trim();
	let att_string = atts_to_string(stateRecord.nodeAttributes[nodeId]);
	if (att_string != "") {
		newNodeName = `${newNodeName} ${att_string}`;
	}
	return edit_node_name(text, nodes, finalCoordinates, nodeId, newNodeName);
} 

function update_node_atts(text, nodes, finalCoordinates, nodeId) {
	let nodeName = nodes[nodeId];
	newNodeName = nodeName.trim(); 
	let att_string = atts_to_string(stateRecord.nodeAttributes[nodeId]);
	if (att_string != "") {
		newNodeName = `${newNodeName} ${att_string}`;
	}
	return edit_node_name(text, nodes, finalCoordinates, nodeId, newNodeName);
}


function atts_to_string(nodeAttributes) {
	if (Object.keys(nodeAttributes).length == 0) { 
		return "";
	}
	let string = "{";
	for (att_name in nodeAttributes) {
		value = nodeAttributes[att_name];
		if (isNaN(value)) {
			value = `"${value}"`;
		}
		string += `${att_name}=${value}, `; 
	}
	string = string.substring(0, string.length - 2);
	string += "}"; 
	return string;
} 

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
		"Jarh and Ta'deel",
		"hadith-islamDb id"
];

let attributes = {
	"full_name": [1, 0], 
	"name": [1, 0], 
	"fullname": [1, 0], 
	"shuhrah": [1, 1], 
	"nisbah": [1, 3], 
	"kunya": [1, 2], 
	"kunyah": [1, 2], 
	"nickname": [1, 2], 
	"grade": [2, 0], 
	"birth": [2, 1],  
	"birth_year": [2, 1],  
	"birthyear": [2, 1], 
	"death": [2, 2],  
	"death_year": [2, 2],  
	"deathyear": [2, 2],
	"place": [2, 3],  
	"life_place": [2, 3],  
	"place_of_life": [2, 3],  
	"death_place": [2, 4],  
	"place_of_death": [2, 4],  
	"job": [2, 5],  
};

function createNarrator(id, name) {
	let narrator = [
		id,
		[
				name,
				"",
				"",
				"",
				""
		],
		[
				"",
				"",
				"",
				"",
				"",
				""
		],
		[],
		[],
		[],
		""
	];
	if (!finalNarratorData[id]) { 
		finalNarratorData[id] = narrator;  
	}
}

function setNarratorAttribute(id, attribute, value) {
	if (attributes[attribute]) {
		let [x, y] = attributes[attribute];
		finalNarratorData[id][x][y] = value;
	} 
}

function get_node_parents_multiple(chainsInNodeIds, nodeId, nodeIdList=[], edgeList=[]) {
	let relevantChains = [];
	let relevantPosition = [];
	chainLoop:
	for (let c = 0; c < chainsInNodeIds.length; c++) {
		let chain = chainsInNodeIds[c];
		for (let i = 0; i < chain.length; i++) {
			for (let j = 0; j < chain[i].length; j++) {
				if (chain[i][j] == nodeId) {
					relevantChains.push(c);
					relevantPosition.push(i);
					break chainLoop;
				}
			}
		}
	}
	
	for (let c = 0; c < relevantChains.length; c++) {
		let relevantChain = relevantChains[c];
		let chain = chainsInNodeIds[relevantChain];
		if (chain.length == relevantPosition + 1) {
			nodeIdList.push(chain[relevantPosition]);
		}
		else {
			for (let i = relevantPosition; i < chain.length - 1; i++) {
				nodeIdList.push(chain[i]);
			}
			get_node_parents_reverse(chainsInNodeIds, chain[chain.length - 1], nodeIdList, edgeList);
		}
	}
	console.log(relevantChains);
}

let storedBrackets = [];
function text_to_object(text, showMatn) {

	let match = "";
	match = text.match(/\{[^\r\n{}]*\}/);
	while (match != null) {
		storedBrackets.push(match[0]);
		let bracketId = storedBrackets.length - 1;
		text = text.replace(match[0], `(*bracket_${bracketId}*)`);
		match = text.match(/\{[^\r\n{}]*\}/);
	}
	
	const chainLines = text.split("\n").filter(x => true);
	const chains = [];
	let errors = [];

	let lineWithIds = [];
	
	let color_map = {
			r: "#FF0000",
			g: "#00DD00",
			b: "#00CCFF",
	};

	let default_color_name = null;
	
	for (let lineNo = 0; lineNo <  chainLines.length; lineNo++) {
		let line = chainLines[lineNo];
		if (line.trim().charAt(0) == "#") {
			continue;
		}
		else if (line.trim().charAt(0) == "@") {
			try {
				line = line.substring(1);
				eval(line);
			} 
			catch (error) {
				console.error("An error occurred in eval:", error.message);
			}
			continue;
		}
		let color_names = Object.keys(color_map).join("");
		let set_color_notation_match = new RegExp(`^[${color_names}]\:(\:|)\-`);
		if (line.trim() == "") {
			continue;
		}
		else if (set_color_notation_match.test(line.trim())) {
			default_color_name = line.trim().charAt(0);
			continue;
		}
		else if (line.trim() == ":-" || line.trim() == "::-") {
			default_color_name = null; 
			continue;
		}
		else if (line.trim().substring(0, 6).toLowerCase() == "color ") {
				let command = line.trim().replace("color ", "");

				if (/^[a-z] *= *#[A-Za-z0-9]+$/.test(command.trim())) {
						let col_name = command.split("=")[0].trim();
						let col_value = command.split("=")[1].trim();
						color_map[col_name] = col_value;
				} else {
						// console.log(`Color Definition failed: ${line}. ${command}`);
						errors.push(`Color Definition failed. Line ignored. Line: ${line}`);
				}
				continue;
		}
		else if (line.trim().substring(0, 9).toLowerCase() == "narrator ") {
			
			let command; 
			if (line.trim().substring(0, 9) == "Narrator ") {
				command = line.trim().replace("Narrator ", "");
			}
			else {
				command = line.trim().replace("narrator ", "");
			}
			try {
				if (/^\+[0-9]+ *(\(.+\)|) *:/.test(command.trim())) { 
					// Extract the ID after the numbers
					let match = command.match(/^\+([0-9]+) *(\((.+)\)|)/);
					let id = parseInt(match[1]);
					let name = "";
					if (match[2] != "") {
						name = match[3];
					}
	
					let atts = command.split(":")[1];
					let atts_list = atts.split(",");
					let requested_atts = [];
					for (let i = 0; i < atts_list.length; i++) {
						let att = atts_list[i];
						let att_split = att.split("=");
						let att_name = att_split[0].trim();
						let att_value = att_split[1].trim();
						if (att_value.charAt(0) == '"' && att_value.charAt(att_value.length - 1) == '"') {
							att_value = att_value.substring(1, att_value.length - 1);
						}
						if (att_value.charAt(0) == "'" && att_value.charAt(att_value.length - 1) == "'") {
							att_value = att_value.substring(1, att_value.length - 1);
						}
						requested_atts.push({
							name: att_name,
							value: att_value
						});
					}
					createNarrator(id, name);
					for (let i = 0; i < requested_atts.length; i++) {
						let att = requested_atts[i];
						setNarratorAttribute(id, att.name, att.value);
					}
					let x = 1;
				} 
				else if (/^[0-9]+ *(\(.+\)|) *:/.test(command.trim())) { 
					// Extract the ID after the numbers
					let match = command.match(/^([0-9]+) *(\((.+)\)|)/);
					let id = parseInt(match[1]);
					let name = "";
					if (match[2] != "") {
						name = match[3];
					} 
					
					let atts = command.split(":")[1];
					let atts_list = atts.split(",");
					let requested_atts = [];
					for (let i = 0; i < atts_list.length; i++) {
						let att = atts_list[i];
						let att_split = att.split("=");
						let att_name = att_split[0].trim();
						let att_value = att_split[1].trim();
						if (att_value.charAt(0) == '"' && att_value.charAt(att_value.length - 1) == '"') {
							att_value = att_value.substring(1, att_value.length - 1);
						}
						if (att_value.charAt(0) == "'" && att_value.charAt(att_value.length - 1) == "'") {
							att_value = att_value.substring(1, att_value.length - 1);
						}
						requested_atts.push({
							name: att_name,
							value: att_value
						});
					}
					createNarrator(id, name);
					for (let i = 0; i < requested_atts.length; i++) {
						let att = requested_atts[i];
						setNarratorAttribute(id, att.name, att.value);
					}
					let x = 1;
				} 
				else {
					// console.log(`Color Definition failed: ${line}. ${command}`);
					errors.push(`Narrator Definition failed. Ignored: ${line}`);
				}
			} 
			catch(error) {
				errors.push(`Narrator Definition failed. Ignored: ${line}`);
			}
			continue;
		}

		let overall_color_name = default_color_name; // Usually null
		let overall_color_notation_match = new RegExp(`^[${color_names}]::`);
		if (overall_color_notation_match.test(line)) {
				overall_color_name = line.charAt(0);
				line = line.split("::")[1];
		}

		lineWithIds.push({line_number: lineNo, string: line});
		
		let chainText, matn;
		if (line.includes(":")) {
				const splitResult = line.split(":", 1);
				chainText = splitResult[0];
				matn = line.substring(splitResult[0].length + 1);
		} else {
				chainText = line;
				matn = "";
		}

		const chain = chainText.split(">").map(name => name.trim());
		// Use a regular expression to split the string and capture the separators
		let seperator_regex = new RegExp(`((?: [${color_names}])?(?:>\\d?>|>>|>\\d|>)|\\&)`);
		const parts = chainText.split(seperator_regex);
		// Initialize arrays to hold the parts and the separators
		let items = [];
		let separators = [];
		// Iterate over the parts to separate items and separators
		parts.forEach((part, index) => {
				if (index % 2 == 1) {
						if (overall_color_name != null && !part.includes("&") && !/[A-Za-z]/.test(part.trim().charAt(0))) {
								part = overall_color_name + part.trim();
						}
						separators.push(part.trim()); // Add to separators array if it's a separator
				} else {
						items.push(part.trim()); // Add to items array if it's not an empty string
				}
		});
		// console.log([items, matn, separators]);
		if (items.length == 0 || items[0] == "") {
			
		}
		else
			chains.push([items, matn, separators]);
	}
	// console.log(chains);
	combinedChains = [];

	let listOfListOfIndices = [];
	let listOfListOfEndIndices = [];
	for (let c = 0; c < chains.length; c++) {
		let chain = chains[c];
		
		let combinedChain = [];
		let [names, matn, seps] = chain;

		let startIndex = 0;
		let listOfIndices = [];
		let listOfEndIndices = [];
		let fullLine = lineWithIds[c].string;
		for (let j = 0; j < storedBrackets.length; j++) {
			fullLine = fullLine.replace(`(*bracket_${j}*)`, storedBrackets[j]);
		}
		for (name of names) {
			for (let j = 0; j < storedBrackets.length; j++) {
				name = name.replace(`(*bracket_${j}*)`, storedBrackets[j]);
			}
			let index = fullLine.indexOf(name);
			listOfIndices.push(index + startIndex);
			listOfEndIndices.push(index + startIndex + name.length);
			startIndex += index + name.length;
			fullLine = fullLine.slice(index + name.length);
		} 
		listOfListOfIndices.push(listOfIndices);
		listOfListOfEndIndices.push(listOfEndIndices);
		
		let combinedLength = seps.length + 1;
		for (let sep of seps) {
			if (sep == "&") {
				combinedLength -= 1;
			}
		}
		for (let i = 0; i < combinedLength; i++) {
			combinedChain.push([]);
		}

		let currentPosition = 0;
		combinedChain[0].push(names[0]);
		for (let i = 0; i < seps.length; i++) {
			if (seps[i] == "&") {
				combinedChain[currentPosition].push(names[i + 1]);
			} 
			else {
				currentPosition += 1;
				combinedChain[currentPosition].push(names[i + 1]);
			}
		}
		combinedChains.push(combinedChain);
	}
	// console.log(combinedChains);


	let chains2 = chains.map(([names, matn, seps], index) => {
		return [combinedChains[index], matn, seps.filter(x => x != "&")];
	});
	// console.log(chains2);

	let nodes = [];
	let nodeCoordinates = [];
	let ranks = [];
	let edges = [];
	let parentsOfNode = [];
	let parentObject = {
		parents: [],
		parents_of_parents: [],
	};

	let nodeX = -1;
	let chainsInNodeIds = structuredClone(chains2.map(x => x[0]));
	
	let chain_no = 0;
	for (const [chain, matn, seps] of chains2) {
		chain_no += 1;
		nodeX += 1;
		
		if (matn.trim() != "" && showMatn) {
				chain.unshift(["Matn: " + matn]);
				seps.unshift(":");
		}

		let idList = [];
		for (let i = 0; i < chain.length; i++) {
			idList.push([]);
			for (let j = 0; j < chain[i].length; j++) {
				idList[i].push(-2);
			}
		}

		let nodeY = chains[nodeX][0].length;
		// First Node
		while (true) {
			lastId = chain.length - 1;
			for (let i = chain[lastId].length - 1; i >= 0; i--) {  
				nodeY -= 1;
				let name = chain[lastId][i]; 

				let lastLetter = name.charAt(name.length - 1);
				if ("^+".includes(lastLetter)) {
						name = name.substring(0, name.length - 1);
				}
				
				let findId = name_recognition(nodes, name);
				if (findId == -1  || "!+".includes(lastLetter)) {
					nodes.push(name);
					parentsOfNode.push({
						self: nodes.length - 1, 
					 	parents: [
							[]
						],
					}); 
					nodeCoordinates.push([nodeX, nodeY]);
					idList[lastId][i] = nodes.length - 1;
				}
				else {
					idList[lastId][i] = findId;
				}
			}
			break;
		}
		
		for (let n = chain.length - 2; n >= 0; n--) {
			for (let i = chain[n].length - 1; i >= 0; i--) {
				nodeY -= 1;
				let name = chain[n][i]; 
				
				let lastLetter = name.charAt(name.length - 1);
				if ("^+".includes(lastLetter)) {
						name = name.substring(0, name.length - 1);
				}

				function labelEdges(parents_lists, childId) {
					if (parents_lists[0].length == 0) {
						return;
					}
					let first_parents_list = parents_lists[0];
					for (let i = 0; i < first_parents_list.length; i++) {
						let edge = [first_parents_list[i].self, childId];
						let edgeIndex = edges.findIndex(e => e[0] === edge[0] && e[1] === edge[1]);
						if (edgeIndex > -1 && !edges[edgeIndex][3].includes(chain_no)) {
							edges[edgeIndex][3].push(chain_no); 
						}
						labelEdges(first_parents_list[i].parents, first_parents_list[i].self);
					} 
				}
				
				let findId = name_recognition(nodes, name);
				let chosenId = -3;
				// Create New Node
				if (findId == -1 || "!+".includes(lastLetter) || (!idList[n + 1].includes(get_parent(edges, findId)) && !"^".includes(lastLetter))) {
					nodes.push(name);
					let parentsList = [];
					for (let p = 0; p < idList[n + 1].length; p++) {
						let parentId = idList[n + 1][p];
						if (parentsOfNode[parentId].parents.length == 0) {
							parentsList.push({
									self: parentId, 
									parents: [
										[]
									],
							});
						}
						else {
							parentsList.push({
									self: parentId, 
									parents: [
										parentsOfNode[parentId].parents[parentsOfNode[parentId].parents.length - 1]
									],
							}); 
						}
					}
					parentsOfNode.push({  
						self: nodes.length - 1, 
						parents: [parentsList],
					});
					nodeCoordinates.push([nodeX, nodeY]);
					chosenId = nodes.length - 1;
					idList[n][i] = chosenId;

					labelEdges(parentsOfNode[chosenId].parents, chosenId);  
				}
				// Match Existing Node
				else {
					idList[n][i] = findId;
					chosenId = findId; 

					let parentsList = [];
					for (let p = 0; p < idList[n + 1].length; p++) {
						let parentId = idList[n + 1][p];
						if (parentsOfNode[parentId].parents.length == 0) {
							parentsList.push({
									self: parentId, 
									parents: [
										[]
									],
							});
						}
						else {
							parentsList.push({
									self: parentId, 
									parents: [
										parentsOfNode[parentId].parents[parentsOfNode[parentId].parents.length - 1]
									],
							});  
						}
					}

					parentsOfNode[chosenId].parents.push(parentsList);
					
					labelEdges(parentsOfNode[chosenId].parents, chosenId); 
				}
				// Make Edges
				for (let j = 0; j < chain[n + 1].length; j++) {
					let parentId = idList[n + 1][j];
					let edge = [parentId, chosenId, seps[n], [chain_no]];
					if (!edges.some(e => e[0] === edge[0] && e[1] === edge[1])) {
							edges.push(edge); 
					}
					else {
						let edgeIndex = edges.findIndex(e => e[0] === edge[0] && e[1] === edge[1]);
						if (!edges[edgeIndex][3].includes(chain_no)) {
							edges[edgeIndex][3].push(chain_no);
						}
					}
				}
			} 
		}
		chainsInNodeIds[nodeX] = idList;
		// console.log(chain, idList);
		// console.log(nodes, edges);
	} 

	for (let i = 0; i < nodes.length; i++) {
		let existingParentLists = [
			JSON.stringify(
				parentsOfNode[i][parentsOfNode[i].length - 1]
			)
		];
		for (let j = parentsOfNode[i].length - 2; j >= 0; j--) {
			let newParentLists = JSON.stringify(parentsOfNode[i][j]);
			if (existingParentLists.includes(newParentLists)) {
				existingParentLists.push(newParentLists);
				parentsOfNode[i] = parentsOfNode[i].splice(j, 1);
			}
		}
	}

	// get_node_parents(chainsInNodeIds, 0, [], [], true);

	let finalCoordinates = [];
	for (let i = 0; i < nodes.length; i++) {
		let [nodeX, nodeY] = nodeCoordinates[i];
		let index = listOfListOfIndices[nodeX][nodeY];
		let lineNumber = lineWithIds[nodeX].line_number;
		finalCoordinates.push({lineNumber: lineNumber, index: index, end_index: listOfListOfEndIndices[nodeX][nodeY]}); 
	}

	
	// NOTE: Need to add parent detection
	let edges2 = []
	for (let i = 0; i < edges.length; i++) {
		let edge = edges[i];
		let sep = edge[2];
		let edgeType = 1;
		let length = 1;
		let edge_color = "#000000";

		let color_names = `[${Object.keys(color_map).join("")}]`;
		let color_names_regex = new RegExp(color_names);

		if (color_names_regex.test(sep)) {
				edge_color = color_map[sep.charAt(0)];
				sep = sep.substring(1);
		}

		if (sep == ":") {
				edgeType = 0;
		} else if (sep.replaceAll(/\d/g, "") == ">>") {
				edgeType = 2;
		}

		try {
				length = parseInt(sep.replaceAll(">", ""));
		} catch {}
		if (isNaN(length)) length = 1;

		edges2.push([edge[0], edge[1], edgeType, length, edge_color, edge[3]]); 
	}

	// console.log(nodes, edges2, errors);
	edges = edges2;
	let coordinates = finalCoordinates;

	let edgesObj = edges.map(edge => {
		return {
			from: edge[0],
			to: edge[1],
			type: edge[2],
			length: edge[3],
			color: edge[4],
			hadithNo: edge[5],
		}; 
	});

	console.log(edges, edgesObj); 

	function splitByCommaOutsideQuotes(str) {
		let bracketCount = 0;
		let splitStrings = [];
		let splitStart = 0;
		for (let c = 0; c < str.length; c++) {
			if (str[c] == '"') {
				bracketCount += 1;
			}
			else if (str[c] == ',') {
				if (bracketCount % 2 == 0) {
					splitStrings.push(str.substring(splitStart, c));
					splitStart = c + 1;
				}
			}
		}
		splitStrings.push(str.substring(splitStart));  
		return splitStrings; 
	}


	let nodeAttributes = [];
	for (let i = 0; i < nodes.length; i++) {
		nodeAttributes.push({}); 
		for (let j = 0; j < storedBrackets.length; j++) {
			if (nodes[i].includes(`(*bracket_${j}*)`)) {
				att_string = storedBrackets[j].substring(1, storedBrackets[j].length - 1);
				let atts_list = splitByCommaOutsideQuotes(att_string); 
				for (let a = 0; a < atts_list.length; a++) {
					let att = atts_list[a];
					let equalityIndex = att.indexOf("=");
					let att_split = [att.substring(0, equalityIndex), att.substring(equalityIndex + 1)] 
					let att_name = att_split[0].trim();
					let att_value = att_split[1].trim();
					if (att_value.charAt(0) == '"' && att_value.charAt(att_value.length - 1) == '"') {
						att_value = att_value.substring(1, att_value.length - 1);
					}
					if (att_value.charAt(0) == "'" && att_value.charAt(att_value.length - 1) == "'") {
						att_value = att_value.substring(1, att_value.length - 1);
					}
					nodeAttributes[i][att_name] = att_value;
				}
				nodes[i] = nodes[i].replace(`(*bracket_${j}*)`, ""); 
			}
		}
	} 
	
	return {
		nodes, 
		edges, 
		edgesObj,
		errors, 
		coordinates,
		parentsOfNode,
		nodeAttributes,
	};  
	
	nodes = [];
	ranks = [];
	edges = [];
	// console.log(chains); 
	for (const [chain, matn, seps] of chains) {
			if (matn.trim() != "" && showMatn) {
					chain.unshift("Matn: " + matn);
					seps.unshift(":");
			}
			// console.log(chain, seps);
			let idList = [];
			let parentNode = null;
			for (let n = chain.length - 1; n >= 0; n--) {
					
				let name = chain[n].trim();
					const lastLetter = name.charAt(name.length - 1);
					if ("^+".includes(lastLetter)) {
							name = name.substring(0, name.length - 1);
					}

					const endOfChain = n === chain.length - 1;
					const rank = chain.length - n;
					let index;
				
					if (name.includes("!") || name.includes("Matn: ") || lastLetter == "+") {
							index = nodes.length;
							nodes.push(name);
							ranks.push(rank);
							idList.push(index);
							if (n != 0 && seps[n - 1] != "&") {
									parentNode = index;
							}
					} else if (false) {


					} else {
							const repeat = name_recognition(nodes, name, ranks, rank);
							if (repeat === -1 || (!endOfChain && lastLetter != "^" && get_parent(edges, repeat) !== parentNode)) {
									index = nodes.length;
									nodes.push(name);
									ranks.push(rank);
									idList.push(index);
									if (n != 0 && seps[n - 1] != "&") {
											parentNode = index;
									}
							} else {
									idList.push(repeat);
									ranks[repeat] = ranks[repeat] * 0.5 + rank * 0.5;
									if (n != 0 && seps[n - 1] != "&") {
											parentNode = repeat;
									}
							}
					}
			}

			let clusters = [
					[idList[0]]
			];
			let cluster_seps = [];
			for (let n = 1; n < chain.length; n++) {
					let sep = seps[seps.length - n];
					if (sep != "&") {
							cluster_seps.push(sep);
							clusters.push([]);
					}
					clusters[clusters.length - 1].push(idList[n]);
			}
			// console.log(clusters);
			for (let c = 0; c < clusters.length - 1; c++) {
					let cluster = clusters[c];
					let next_cluster = clusters[c + 1];
					let sep = cluster_seps[c];
					let edgeType = 1;
					let length = 1;
					let edge_color = "#000000";

					let color_names = `[${Object.keys(color_map).join("")}]`;
					let color_names_regex = new RegExp(color_names);

					if (color_names_regex.test(sep)) {
							edge_color = color_map[sep.charAt(0)];
							sep = sep.substring(1);
					}

					if (sep == ":") {
							edgeType = 0;
					} else if (sep.replaceAll(/\d/g, "") == ">>") {
							edgeType = 2;
					}

					try {
							length = parseInt(sep.replaceAll(">", ""));
					} catch {}
					if (isNaN(length)) length = 1;



					for (let n = 0; n < cluster.length; n++) {
							for (let nextN = 0; nextN < next_cluster.length; nextN++) {
									const edge = [cluster[n], next_cluster[nextN], edgeType, length, edge_color];
									// console.log(edge);
									if (!edges.some(e => e[0] === edge[0] && e[1] === edge[1])) {
											edges.push(edge);
									}
							}
					}

			}

	} 
	// console.log(nodes, edges, errors);
	return {
			nodes,
			edges,
			errors
	};
}