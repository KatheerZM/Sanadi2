let currentPage = 0;
let maxPage = 0;
let lastSearch = '';
let isSearching = false;

// Event listener for search button
document.getElementById('searchButton').addEventListener('click', () => {
    if (!isSearching) {
        performSearch(0);
    }
});

// Add event listeners for both top and bottom pagination controls
['Top', 'Bottom'].forEach(position => {
    document.getElementById(`prevPage${position}`).addEventListener('click', () => changePage(-1));
    document.getElementById(`nextPage${position}`).addEventListener('click', () => changePage(1));
    document.getElementById(`pageSelect${position}`).addEventListener('change', (e) => {
        const page = parseInt(e.target.value);
        if (page >= 0 && page <= maxPage) {
            performSearch(page);
        }
    });
});

async function performSearch(page = 0) {
    if (isSearching) return; // Prevent multiple simultaneous searches

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchSpinner = document.getElementById('searchSpinner');
    const searchButtonText = document.getElementById('searchButtonText');

    let searchTerm = searchInput.value.trim();
    if (!searchTerm) return;

    try {
        // Set loading state
        isSearching = true;
        searchButton.disabled = true;
        searchInput.disabled = true;
        searchSpinner.classList.remove('d-none');
        searchButtonText.textContent = 'Searching...';

        let conditions = parseSearch(searchTerm);

        for (let i = 0; i < conditions.length; i++) {
            let narratorList = [];
            let chainsObject = text_to_object(conditions[i].narrators.replaceAll(",", "\n"));
            let nodeSigns = [];
            for (let n = 0; n < chainsObject.nodes.length; n++) {
                let node = chainsObject.nodes[n];
             
    console.log(narratorList);   if (node.charAt(0) == "!") {
                    nodeSigns.push(-1);
                    chainsObject.nodes[n] = node.substring(1, node.length);
                }
                else {
                    nodeSigns.push(1);
                }
            }
            let narratorIdentities = processNarratorRecognition(chainsObject.nodes, chainsObject.edges, false);
            for (let n = 0; n < chainsObject.nodes.length; n++) {
                let bestPossibilities = narratorIdentities[n][0][1];
                let bestPossibilityList = [];
                if (nodeSigns[n] == -1) {
                    bestPossibilityList.push(-1);
                }
                for (let b = 0; b < bestPossibilities.length; b++) {
                    bestPossibilityList.push(bestPossibilities[b][1][5]);
                }
                narratorList.push(bestPossibilityList);
            }
            conditions[i].narrators = JSON.stringify(narratorList);
        }

        searchTerm = stringifySearch(conditions);
        searchTerm = searchTerm.substring(0, searchTerm.length - 1);

        lastSearch = searchTerm;
        currentPage = page;

        const encodedSearch = encodeURIComponent(searchTerm);
        const response = await fetch(`https://python.fussilat.com/hadith_api_2?page_no=${currentPage}&search_string=${encodedSearch}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Search error:', error);
        displayError('An error occurred while fetching results.');
    } finally {
        // Reset loading state
        isSearching = false;
        searchButton.disabled = false;
        searchInput.disabled = false;
        searchSpinner.classList.add('d-none');
        searchButtonText.textContent = 'Search';
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    const paginationControls = document.getElementsByClassName('pagination-controls');

    if (!data.success) {
        resultsDiv.innerHTML = '<div class="alert alert-info">There are no results.</div>';
        Array.from(paginationControls).forEach(control => control.classList.add('d-none'));
        return;
    }

    maxPage = data.max_page;

    // Display results
    resultsDiv.innerHTML = data.results.map(([reference, content]) => {
        // Parse the string into a DOM structure
        let parser = new DOMParser();
        let doc = parser.parseFromString(content, 'text/html');

        // Find all <a> elements with class="rawy"
        let rawyLinks = doc.querySelectorAll('a.rawy');

        // Add the href attribute to each matching element
        rawyLinks.forEach(link => {
          link.setAttribute('href', `javascript:clickNarrator(${link.getAttribute('id')})`);
        });

        // Serialize the updated DOM back to a string
        content = doc.body.innerHTML;

        return `
            <div class="hadith-entry">
                <div class="hadith-text">${content}</div>
                <div class="hadith-reference">Reference: ${reference}</div>
            </div>
        `
    }).join('');

    // Update both top and bottom pagination controls
    ['Top', 'Bottom'].forEach(position => {
        const select = document.getElementById(`pageSelect${position}`);
        select.innerHTML = Array.from({ length: maxPage + 1 }, (_, i) => 
            `<option value="${i}" ${i === currentPage ? 'selected' : ''}>Page ${i + 1}</option>`
        ).join('');

        document.getElementById(`prevPage${position}`).disabled = currentPage === 0;
        document.getElementById(`nextPage${position}`).disabled = currentPage >= maxPage;
    });

    Array.from(paginationControls).forEach(control => control.classList.remove('d-none'));
}

function changePage(delta) {
    const newPage = currentPage + delta;
    if (newPage >= 0 && newPage <= maxPage) {
        performSearch(newPage);
    }
}

function displayError(message) {
    document.getElementById('results').innerHTML = `
        <div class="alert alert-danger">${message}</div>
    `;
    Array.from(document.getElementsByClassName('pagination-controls')).forEach(control => 
        control.classList.add('d-none')
    );
}

let popovers = [];
document.addEventListener("click", function(event) {
    for (let popover of popovers) {
        if (!popover.contains(event.target)) {
            popover.remove();
        }
    }
});

let mouseX = 0, mouseY = 0;

document.addEventListener("mousemove", function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Function that retrieves the latest mouse position
function getMousePosition() {
    return { x: mouseX, y: mouseY };
}


function clickNarrator(hdp_id) {
    let sanadi_id = hdpToSanadiData[hdp_id]; 
    let person = finalNarratorData[sanadi_id];
    let entry = fullEntry(person);

    var popoverWidth = 300;
    var popoverHeight = 400; 

    let mousePosition = getMousePosition();

    // Calculate the exact position to place the popover near the clicked cell
    // Account for scrolling by including window.pageXOffset and pageYOffset
    var popoverX = mousePosition.x + 10;
    var popoverY = mousePosition.y + window.scrollY; //+ cellHeight / 2;

    if (popoverX + popoverWidth > window.innerWidth) { 
        // If it would exceed the window's right edge, position it to the left of the cell
        popoverX = mousePosition.x - popoverWidth - 10;
    }
    
    var popoverWidth = 300;
    var popoverHeight = 400; 

    var popover = document.createElement('div');
    popovers.push(popover);
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

    popover.innerHTML = `  <!-- Tab Selector --> 
      <!-- Tab Content -->
      <div class="tab-content"> 
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
}

function fullEntry(person) {
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
        all_entries += `
          <div class="entry">
            <div class="entry-name">Grade</div>
            <div class="entry-detail">${grade}</div> 
          </div>`;
    
      if (person[2][1] != "")
      all_entries += `
      <div class="entry">
        <div class="entry-name">Birth (AH)</div>
        <div class="entry-detail">${person[2][1]}</div> 
      </div>`;
        if (person[2][2] != "")
      all_entries += `
      <div class="entry">
        <div class="entry-name">Death (AH)</div>
        <div class="entry-detail">${person[2][2]}</div> 
      </div>`;
    
      all_entries += `<div class="entry">
      </div>`
    
      let infoLabel;
      
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

function parseSearch(text) {
    const conditions = [];

    text.split(";").forEach(term => {
        term = term.trim();
        term = " " + term + " ";

        let byPart = "";
        if (term.includes(" by ")) {
            byPart = term.split(" by ")[1];
            if (byPart.includes(" in ")) {
                byPart = byPart.split(" in ")[0];
            }
        }

        let inPart = "";
        if (term.includes(" in ")) {
            inPart = term.split(" in ")[1];
            if (inPart.includes(" by ")) {
                inPart = inPart.split(" by ")[0];
            }
        }

        let searchPart = term.split(" by ")[0].split(" in ")[0].trim();
        byPart = byPart.trim();
        inPart = inPart.trim();

        let narratorsString = "";
        if (byPart !== "") {
          if (byPart.charAt(0) == "(" && byPart.charAt(byPart.length - 1) == ")") {
            byPart = byPart.substring(1, byPart.length - 1);
          }
          let narrators = byPart.trim();
          narratorsString = narrators;
        }

        let booksList = [];
        let booksString = "";
        if (inPart !== "") {
            let books = inPart.replaceAll("(", " ").replaceAll(")", " ").trim();
            booksString = books;
            if (books !== "") {
                books.split(",").forEach(book => {
                    booksList.push(book.trim());
                });
            }
        }

        conditions.push({
            search: searchPart,
            normalized_search: searchPart,
            narrators: narratorsString, 
            books: booksString
        });
    });

    return conditions;
}

function stringifySearch(conditions) {
  let searchesString = "";
  for (let c = 0; c < conditions.length; c++) {
    let condition = conditions[c];
    let searchString = `${condition.search} by ${condition.narrators} in ${condition.books};`;
    searchesString += searchString;
  }
  return searchesString;
}