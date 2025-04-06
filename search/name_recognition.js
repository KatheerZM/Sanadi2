function replaceSpecialUs(str) {
  return str.replace(/[\u00FA\u00FB\u00FC\u00F9\u0169\u0171\u01D4\u01DA]/g, 'u');
}

function name_recognition(nodes, entry, ranks = null, rank = null) {
    const results = [];
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
		if (!node.includes("Matn: ")) {
			const cleanNode = replaceSpecialUs(node.toLowerCase())
								  .replaceAll(`abu ${entry.toLowerCase()}`, "")
								  .replaceAll(`ibn ${entry.toLowerCase()}`, "")
								  .replaceAll(`أبو ${entry.toLowerCase()}`, "")
								  .replaceAll(`بن ${entry.toLowerCase()}`, "")
								  .replaceAll(`of ${entry.toLowerCase()}`, "")
								  .replaceAll(`from ${entry.toLowerCase()}`, "")
								  .replaceAll(`b. ${entry.toLowerCase()}`, "")
								  .replaceAll(`Abdil ${entry.toLowerCase()}`, "")
								  .replaceAll(`Abdul ${entry.toLowerCase()}`, "")
								  .replaceAll(`Abdal ${entry.toLowerCase()}`, "");

			if (cleanNode.includes(entry.toLowerCase())) {
				results.push([i, node]);
			}
		}
    }
    if (results.length >= 1) {
        let lastNode = results[results.length - 1];
        return lastNode[0];
    } else {
        return -1;
    }
}