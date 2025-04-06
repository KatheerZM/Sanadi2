const unique_mudafs = [
    "ابن",
    "بنت",
    "بن",
    "ءبو",
    "ءخت",
    "ءخو",
    "ءم",
    "ءمة",
    "ابن",
    "ابنا",
    "ابنة",
    "اسم",
    "امرءة",
    "امرء",
    "بنت",
    "جد",
    "جدة",
    "حبيب",
    "خال",
    "خالة",
    "ذو",
    "ست",
    "شمس",
    "ضوء",
    "عبد",
    "عبيد",
    "عم",
    "عمة",
    "عيد",
    "موضع",
    "مولى",
    "نور",
    "هبة",
    "والد",
    "والدة",
    "وهب",
];
const allah_names = [
    "الأحد",
    "الأشهل",
    "الأعلى",
    "الأكرم",
    "الأواه",
    "الأول",
    "الباري",
    "الباقي",
    "البديع",
    "البر",
    "الجبار",
    "الجد",
    "الجليل",
    "الجواد",
    "الحبار",
    "الحق",
    "الحكم",
    "الحكيم",
    "الحميد",
    "الخالق",
    "الخبير",
    "الخلاق",
    "الدائم",
    "الرحمن",
    "الرحيم",
    "الرزاق",
    "الرشيد",
    "الساتر",
    "السلام",
    "السميع",
    "السيد",
    "الشارق",
    "الصبور",
    "الصمد",
    "العزيز",
    "العظيم",
    "العلي",
    "الغافر",
    "الغالب",
    "الغفار",
    "الغفور",
    "الغنى",
    "الغني",
    "القادر",
    "القاهر",
    "القدوس",
    "القوي",
    "القيوم",
    "الكبير",
    "الكريم",
    "اللطيف",
    "الله",
    "المؤمن",
    "المتعال",
    "المجيد",
    "المحسن",
    "المحمود",
    "المطلب",
    "المعز",
    "المعطي",
    "المغيث",
    "الملك",
    "المنان",
    "المنعم",
    "المهيمن",
    "النور",
    "الهادي",
    "الواحد",
    "الوارث",
    "الودود",
    "الوهاب",
];
const bin_words = ["ابن", "بن", "بنت"]

function englishToArabic(input) {
    input = " " + input + " ";
    input = input.replaceAll(/ [Aa]bd[au]l /g, " Abd ")
    input = input.replaceAll("ʿ", "'");
    input = input.replaceAll("ʾ", "'");
    input = input.replaceAll(/All(a|ā)h/g, "الله");
    input = input.replaceAll(/Abd(u|a|i|o)ll(a|ā)(h|ḥ)/g, "عبد الله");
    input = input.replaceAll(/Ubaid(u|a|i|o)llah/g, "عبيد الله");
    input = input.replaceAll(/Abd(u|a|i|o)rra(h|ḥ)m(a|ā)n/g, "عبد الرحمن");
    input = input.replaceAll(/ (|'|ʿ|ʾ)Amr /g, " عمرو ");

    input = input.replaceAll(/\bibn\b|bin|b\./g, "بن");
    input = input.replaceAll(/\bIbn\b/g, "ابن");

    input = input.replaceAll(/[auio]l-/g, "ال");
    input = input.replaceAll(/[AUIO]l-/g, "ال");

    input = input.replaceAll(/u/g, "o");
    input = input.replaceAll(/ā/g, "aa");
    input = input.replaceAll(/ū/g, "oo");
    input = input.replaceAll(/ī/g, "ee");

    input = input.replaceAll(/ao/g, "(a'o|و)");
    input = input.replaceAll(/ai/g, "(a'i|ayi|ي)");
    input = input.replaceAll(/aee/g, "(a'ee|ayee)");
    input = input.replaceAll(/io/g, "(i'o|iyo|ي)");
    input = input.replaceAll(/ia/g, "(i'a|iya|ي)");
    input = input.replaceAll(/oi/g, "(o'i|ي)");

    input = input.replaceAll(/a /g, "(اء|ا|ء|ة) ");
    input = input.replaceAll(/i /g, "ي ");
    input = input.replaceAll(/o /g, "و ");

    input = input.replaceAll(/a(?=.(a|i|o|e|\b))/g, "(|ا)");
    input = input.replaceAll(/i(?=.(a|i|o|e|\b))/g, "(|ي)");
    input = input.replaceAll(/o(?=.(a|i|o|e|\b))/g, "(|و)");

    input = input.replaceAll(/Ao/g, "(A'o|و)");
    input = input.replaceAll(/Ai/g, "(A'i|ayi|ي)");
    input = input.replaceAll(/Io/g, "(I'o|iyo|ي)");
    input = input.replaceAll(/Ia/g, "(I'a|iya|ي)");
    input = input.replaceAll(/Oi/g, "(O'i|ي)");

    input = input.replaceAll(/A/g, "(عا|آ|ء|ع|ا)");
    input = input.replaceAll(/I/g, "(عي|ءي|ء|ع|ا)");
    input = input.replaceAll(/U/g, "(عو|ءو|ع|ء|ا)");
    input = input.replaceAll(/O/g, "(عو|ءو|ع|ء|ا)");
    input = input.replaceAll(/Ee/g, "ي(|ء|ع)");
    input = input.replaceAll(/Aa/g, "(آ|عا)");

    input = input.replaceAll(/'/g, "(|ء|ع)");

    const consonants = "bdfghjklmnqrstvwxyzḥṣṭḍ";
    for (let letter of consonants) {
        input = input.replaceAll(new RegExp(letter.toUpperCase(), "g"), letter);
    }

    const multis = "thkhshdhgh";
    for (let l = 0; l < multis.length; l += 2) {
        const group = multis.substring(l, l + 2);
        input = input.replaceAll(new RegExp(group + group, "g"), group);
    }

    input = input.replaceAll(/ th/g, " ث");
    input = input.replaceAll(/ kh/g, " خ");
    input = input.replaceAll(/ sh/g, " ش");
    input = input.replaceAll(/ dh/g, " (ذ|ظ|ض)");

    input = input.replaceAll(/th/g, "(تح|ته|ث)");
    input = input.replaceAll(/kh/g, "(كه|كح|خ)");
    input = input.replaceAll(/sh/g, "(سح|سه|ش)");
    input = input.replaceAll(/dh/g, "(ظ|ده|دح|ض|ذ)");
    input = input.replaceAll(/gh/g, "غ");

    for (let letter of consonants) {
        input = input.replaceAll(new RegExp(letter + letter, "g"), letter);
    }

    input = input.replaceAll(/b/g, "ب");
    input = input.replaceAll(/t/g, "(ط|ت)");
    input = input.replaceAll(/ṭ/g, "ط");
    input = input.replaceAll(/j/g, "ج");
    input = input.replaceAll(/h\b/g, "(ة|ح|ه)");
    input = input.replaceAll(/h/g, "(ح|ه)");
    input = input.replaceAll(/ḥ/g, "ح");
    input = input.replaceAll(/d/g, "(د|ض)"); 
    input = input.replaceAll(/ḍ/g, "ض");
    input = input.replaceAll(/ḏ/g, "ذ");
    input = input.replaceAll(/z/g, "(ظ|ض|ز|ذ)");
    input = input.replaceAll(/r/g, "ر");
    input = input.replaceAll(/s/g, "(ث|ص|س)");
    input = input.replaceAll(/ṣ/g, "ص");
    input = input.replaceAll(/f/g, "ف");
    input = input.replaceAll(/q/g, "ق");
    input = input.replaceAll(/k/g, "ك");
    input = input.replaceAll(/l/g, "ل");
    input = input.replaceAll(/m/g, "م");
    input = input.replaceAll(/n/g, "ن");
    input = input.replaceAll(/w/g, "و");
    input = input.replaceAll(/y/g, "ي");

    input = input.replaceAll(/ee/g, "ي");
    input = input.replaceAll(/aa/g, "ا");
    input = input.replaceAll(/oo/g, "و");

    input = input.replaceAll(/a/g, "");
    input = input.replaceAll(/i/g, "");
    input = input.replaceAll(/o/g, "");
    input = input.replaceAll(/'/g, "");

    return input.trim();
}

function simplifyHamzas(text) {
    // Replace specific Arabic characters with their simplified form
    text = text.replaceAll(/[أئؤإ]/g, "ء");
    text = text.replaceAll(/[ى]/g, "ا");
    return text;
}

function removeArabicDiacritics(text) {
    // Define a regular expression to match Arabic diacritics (Unicode range \u064B-\u0652)
    const arabicDiacritics = /[\u064B-\u0652]/g;
    // Remove the matched diacritics from the text
    return text.replace(arabicDiacritics, "");
}

function divideAbuIbnNames3(name, isFirst = true) {
    // Split the name into words
    let words = name.split(" ");
    // If the first word is "بن", add an empty string at the beginning
    if (words[0] === "بن") {
        words = ["", ...words];
    }

    // Initialize a list to store the starting indices of name segments
    let startList = [0];
    // Check if the first word is in the list of unique mudafs
    let isPreviousMudaf = unique_mudafs.includes(words[0]);

    // Iterate through the rest of the words to identify mudafs and divide names
    for (let w = 0; w < words.length - 1; w++) {
        let word = words[w + 1];
        if (!isPreviousMudaf) {
            startList.push(w + 1);
        }
        // Update the flag to check if the current word is a mudaf
        isPreviousMudaf = unique_mudafs.includes(word);
    }

    // List to store the divided name segments
    let nameList = [];
    startList.push(words.length); // Append the end of the list

    // Create name segments using the start indices
    for (let s = 0; s < startList.length - 1; s++) {
        let segment = words.slice(startList[s], startList[s + 1]);
        if (segment.length > 0) {
            nameList.push(segment.join(" "));
        }
    }

    return nameList;
}

function extractAllNames(shuhrah) {
    let nisbas = [];

    // Check if "مولى" is in the input string
    if (shuhrah.includes("مولى")) {
        // Extract and append the part after "مولى" to nisbas
        nisbas.push("مولى " + shuhrah.split("مولى")[1].trim());
        // Keep only the part before "مولى"
        shuhrah = shuhrah.split("مولى")[0].trim();
    }

    // Add spaces around the string for easier processing
    shuhrah = " " + shuhrah + " ";

    let binPattern = new RegExp(" " + bin_words.join(" | ") + " ", "g");  
    // Split the string by specific connectors
    let gens = shuhrah.split(binPattern);

    // Iterate through each segment of the split result, starting from the second
    for (let g = 1; g < gens.length; g++) {
        let gen = gens[g].trim(); // Remove extra spaces
        // Replace "ءبي " with "ءبو "
        gens[g] = gen.replace(/^ءبي | ءبي /g, "ءبو ");
    }

    // Join the segments back with " بن "
    shuhrah = gens.join(" بن ").trim();

    // Split the string into individual names
    let shuhrahSplit = shuhrah.split(" ");
    let names = shuhrahSplit.reverse(); // Reverse the order of names
    let final_n = 0;

    // Loop through the names to identify and extract nisbas
    for (let n = 0; n < names.length; n++) {
        let name = names[n];
        // Check if the name starts with "ال" and is not in the list of Allah's names
        if (name.startsWith("ال") && !allah_names.includes(name)) {
            if (names.length === n + 1) {
                // If it's the last name, add to nisbas
                final_n += 1;
                nisbas.push(name);
            } else if (unique_mudafs.includes(names[n + 1])) {
                // If the next name is a mudaf, stop processing
                break;
            } else {
                // Otherwise, add to nisbas
                final_n += 1;
                nisbas.push(name);
            }
        } else {
            break; // Stop if the name does not meet the conditions
        }
    }

    // Reconstruct the leftover name
    let leftoverName = names.slice(final_n).reverse().join(" ");
    leftoverName = leftoverName.replace(/  /g, " "); // Replace double spaces with a single space

    // Add spaces around the leftover name for easier processing
    leftoverName = " " + leftoverName + " ";

    // Split the leftover name by " بن " or "ابن "
    gens = leftoverName.split(/ بن |ابن /);

    // Initialize the final names array
    let finalNames = Array(gens.length)
        .fill()
        .map(() => []);
    finalNames[0] = nisbas;

    // Process each segment and divide using divideAbuIbnNames3 function
    for (let g = 0; g < gens.length; g++) {
        let gen = gens[g].trim();
        if (gen !== "") {
            finalNames[g] = finalNames[g].concat(divideAbuIbnNames3(gen));
        }
    }

    return finalNames;
}

function convertToIds(nameLists) {
    try {
        // Iterate through the outer list
        nameLists.forEach((nameList, l) => {
            // Iterate through each inner list (names)
            nameList.forEach((name, n) => {
                // Replace the name with its corresponding index from the name_number array
                nameLists[l][n] = nameNumberData.indexOf(name);
            });
        });
        return nameLists;
    } catch (error) {
        // Return an empty array if an error occurs
        return [];
    }
}

function checkIds(nameLists) {
    // Iterate through the outer list
    for (let g = 0; g < nameLists.length; g++) {
        let gen = nameLists[g];
        // Iterate through each inner list (names)
        for (let n = 0; n < gen.length; n++) {
            let name = gen[n];
            // Check if the name is in the name_number array
            if (!nameNumberData.includes(name)) {
                return false;
            }
        }
    }
    return true; // Return true if all names are valid
}

function findCommonNumber(lists) {
    if (!lists || lists.length === 0) {
        return null;
    }

    // Initialize the set with the first list
    let commonNumbers = new Set(lists[0]);

    // Iterate through the rest of the lists and find the intersection
    for (let i = 1; i < lists.length; i++) {
        let lst = new Set(lists[i]);
        commonNumbers = new Set([...commonNumbers].filter((x) => lst.has(x)));
    }

    // Convert the set back to an array and return the result
    if (commonNumbers.size > 0) {
        return Array.from(commonNumbers);
    } else {
        return [];
    }
}

function removeDuplicateLists(listOfLists) {
    // Convert each inner list to a string to use as a key
    let listOfStrings = listOfLists.map((lst) => JSON.stringify(lst));

    // Remove duplicates by converting to a Set and back to an array
    let uniqueStrings = new Set(listOfStrings);
    let uniqueLists = Array.from(uniqueStrings).map((str) => JSON.parse(str));

    return uniqueLists;
}

function smoothenList(list1) {
    let newList = [];

    list1.forEach((item) => {
        // Check if the last element of the item is an array
        if (Array.isArray(item[item.length - 1])) {
            // Iterate over each element of the last array and create new combinations
            item[item.length - 1].forEach((i) => {
                newList.push([...item.slice(0, -1), i]);
            });
        } else {
            // If the last element is not an array, add the item as is
            newList.push(item);
        }
    });

    return newList;
}

function convertToShuhrah(ops) {
    // Initialize an array of empty arrays, one for each element in ops
    let stringOps = Array.from({ length: ops.length }, () => []);

    ops.forEach((op, o) => {
        // Iterate through each number in the current op array
        op.forEach((num) => {
            // Access final_narrators to find the corresponding string
            stringOps[o].push(finalNarratorData[num][1][1]);
        });
    });

    return stringOps;
}

// Helper function to generate permutations from a regex-like string
function generatePermutations(regexString) {
    // This function will parse the regex-like string and generate all possible permutations
    let result = [];

    // Recursive function to build permutations
    function buildPermutations(current, remaining) {
        if (remaining.length === 0) {
            result.push(current);
            return;
        }

        let nextChar = remaining[0];
        if (nextChar === "(") {
            // Find the closing parenthesis and extract options
            let closingIndex = remaining.indexOf(")");
            let options = remaining.substring(1, closingIndex).split("|");

            // Recurse for each option
            options.forEach((option) => {
                buildPermutations(
                    current + option,
                    remaining.substring(closingIndex + 1),
                );
            });
        } else {
            // Regular character, just add it to the current string
            buildPermutations(current + nextChar, remaining.substring(1));
        }
    }

    buildPermutations("", regexString);
    return result;
}

function combineLists(lists) {
    if (lists.length === 0) return [];

    // Start with the first list
    let result = lists[0];

    // Loop through the rest of the lists
    for (let i = 1; i < lists.length; i++) {
        let temp = [];

        // Combine each element of the current result with each element of the next list
        for (let a of result) {
            for (let b of lists[i]) {
                temp.push(a + " " + b);
            }
        }

        // Update the result with the new combinations
        result = temp;
    }

    return result;
}

function filteredPermutations(regexString) {
    let words = regexString.split(" ");
    let filteredWords = [];
    words.forEach((word) => {
        filteredWords.push([]);
        let index = filteredWords.length - 1;
        let combs1 = generatePermutations(word);
        let combs2 = combs1.map((comb) => generatePermutations(comb));
        combs1 = combs2.flat();
        combs2 = combs1.map((comb) => generatePermutations(comb)); 
        combs1 = combs2.flat();
        combs2 = combs1.map((comb) => generatePermutations(comb));
        combs = combs2.flat();
        combs = removeDuplicates(combs);
        let is_zero = true;
        combs.forEach((perm) => {
            if (unique_mudafs.includes(perm) || possibleNamesData.includes(perm)) {
                filteredWords[index].push(perm);
                is_zero = false;
            }
            if (perm.length > 2 && perm.substring(0, 2) === "ال") {
                let perm2 = perm.substring(2);
                if (possibleNamesData.includes(perm2)) {
                    filteredWords[index].push(perm2);
                    is_zero = false;
                }
            }
            else if (perm.length > 2 && perm.substring(0, 2) !== "ال") {
                let perm2 = "ال" + perm;
                if (possibleNamesData.includes(perm2)) {
                    filteredWords[index].push(perm2);
                    is_zero = false;
                }
            }
        });
        if (is_zero) {
            return [];
        }
    });
    let filteredPermutations = combineLists(filteredWords);
    return filteredPermutations;
}

function getNamePossibilities(line) {
    // Convert the input line to Arabic regex string
    let regexString = englishToArabic(simplifyHamzas(line));
    let possibleNames = [];

    // Generate all possible combinations using the regex string
    // let combinations1 = filteredPermutations(regexString);
    // Create a new list of combinations by generating permutations for every elemnent in combinations1 and making a larger list of the result
    // let combinations2 = combinations1.map((comb) => filteredPermutations(comb));
    // Flatten the list of combinations2 to a single level
    // let combinations = removeDuplicates(combinations2.flat());

    let combinations = filteredPermutations(regexString);

    // console.log(combinations);
    combinations.forEach((combo) => {
        // Extract names from the generated combo after removing diacritics
        let namesExtracted = extractAllNames(removeArabicDiacritics(combo));

        // Check if the extracted names are valid
        if (checkIds(namesExtracted)) {
            // Convert valid names to their respective IDs
            possibleNames.push(convertToIds(namesExtracted));
        }
    });

    return possibleNames;
}

function getPersonPossibilities(possibleNames) {
    let options = [];
    let stringOptions = [];
    let final = [];

    // Iterate through each set of possible names
    possibleNames.forEach((possibility) => {
        let namePossibilities = [];

        // Check if all names exist in the numerical index
        let valid = possibility.every((gen, g) =>
            gen.every((name) =>
                numericalIndexData[g].hasOwnProperty(String(name)),
            ),
        );

        // Skip to the next possibility if current one is invalid
        if (!valid) return;

        // Convert names to their corresponding numerical indices
        possibility.forEach((gen, g) => {
            gen.forEach((name) => {
                namePossibilities.push(numericalIndexData[g][String(name)]);
            });
        });

        // Find common numbers among the name possibilities
        final = final.concat(findCommonNumber(namePossibilities));
    });

    return final;
}

function removeDuplicates(personPossibilities) {
    const seen = new Set();

    return personPossibilities.filter((person) => {
        const firstElement = person; // assuming the first element is the identifier
        if (seen.has(firstElement)) {
            return false;
        } else {
            seen.add(firstElement);
            return true;
        }
    });
}

function convertEnglishToPeople(englishName) {
    // Get name possibilities from the English name
    let namePossibilities = getNamePossibilities(englishName);

    // Get person possibilities from the name possibilities
    let personPossibilities = getPersonPossibilities(namePossibilities);

    // Remove duplicate person possibilities by comparing the first element of each array
    personPossibilities = removeDuplicates(personPossibilities);

    // Map each person possibility to its corresponding string in final_narrators
    let personStrings = personPossibilities.map(
        (person) => finalNarratorData[person][1][1],
    );

    let personIDs = personPossibilities.map(
        (person) => finalNarratorData[person][0],
    );

    let personObjs = personPossibilities.map(
        (person) => finalNarratorData[person],
    );

    return personObjs;
}

// Example usage of the loaded data in a function
function processInput() {
    // Get the input from the textarea
    const inputText = document.getElementById("inputText").value;

    // Process the input using the dummy function
    const processedStrings = dummyFunction(inputText);

    // Get the output list element with direction as rtl
    const resultList = document.getElementById("resultList");
    resultList.style.direction = "rtl";

    // Clear any previous output
    resultList.innerHTML = "";

    // Display the processed strings
    processedStrings.forEach((str) => {
        const listItem = document.createElement("li");
        listItem.textContent = str;
        resultList.appendChild(listItem);
    });

    // Example of using loaded JSON data
    // console.log("Example usage of JSON data:");
    // console.log(nameNumberData, numericalIndexData, finalNarratorData);
}

function generateBooleanCombinationsOrdered(n) {
    const result = [];

    // Generate all combinations using binary numbers
    for (let i = 1; i < (1 << n) - 1; i++) { // From 1 to 2^n - 2 to avoid all True or all False
        const combination = [];

        // Convert the number `i` to its binary representation and create the boolean list
        for (let j = 0; j < n; j++) {
            combination.push((i & (1 << j)) ? true : false);
        }

        // Push the combination to the result list
        result.push(combination);
    }

    // Sort combinations by the number of 'false' values (ascending)
    result.sort((a, b) => {
        const falseCountA = a.filter(x => !x).length;
        const falseCountB = b.filter(x => !x).length;
        return falseCountA - falseCountB;
    });

    return result;
}

function isStudentsTeacher(student, teacher) {
    if (student[4].includes(teacher[0])) {
        return true;
    }
    else if (teacher[3].includes(student[0])) {
        return true;
    }
    else return false;
}

function isTeachersStudent(teacher, student) {
    return isStudentsTeacher(student, teacher);
}

function getMaxStudentLine(edgesOfNodes, knownStudentMaxes, nodeId) {
    if (knownStudentMaxes[nodeId] !== -1) {
        return knownStudentMaxes[nodeId];
    }
    let students = edgesOfNodes[nodeId].students;
    if (students.length === 0) {
        return 0;
    }
    let max = 0;
    students.forEach((student) => {
        let studentLine = 0;
        if (knownStudentMaxes[student] !== -1) {
            studentLine = knownStudentMaxes[student];
        }
        else {
            studentLine = getMaxStudentLine(edgesOfNodes, knownStudentMaxes, student);
            knownStudentMaxes[student] = studentLine;
        }
        if (studentLine + 1 > max) {
            max = studentLine + 1;
        }
    });
    knownStudentMaxes[nodeId] = max;
    return max;
}

function getMaxTeacherLine(edgesOfNodes, knownTeacherMaxes, nodeId) {
    if (knownTeacherMaxes[nodeId] !== -1) {
        return knownTeacherMaxes[nodeId];
    }
    let teachers = edgesOfNodes[nodeId].teachers;
    if (teachers.length === 0) {
        return 0;
    }
    let max = 0;
    teachers.forEach((teacher) => {
        let teacherLine = 0;
        if (knownTeacherMaxes[teacher] !== -1) {
            teacherLine = knownTeacherMaxes[teacher];
        }
        else {
            teacherLine = getMaxTeacherLine(edgesOfNodes, knownTeacherMaxes, teacher);
            knownTeacherMaxes[teacher] = teacherLine;
        }
        if (teacherLine + 1 > max) {
            max = teacherLine + 1;
        }
    });
    knownTeacherMaxes[nodeId] = max;
    return max;
}

function removeBracketedParts(string) {
    let result = "";
    let bracketCount = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i] === "(") {
            bracketCount++;
        }
        else if (string[i] === ")") {
            bracketCount--;
        }
        else if (bracketCount === 0) {
            result += string[i];
        }
    }
    return result;
}

function rankPropagation(nodes, edgesOfNodes, resultLevels, isCompiler, setStateRecord=false) {
    resultLevels = structuredClone(resultLevels);
    for (let i = 0; i < 100; i++) { // Rank Testing
        for (let j = 0; j < nodes.length; j++) {
            let edgesOfNode = edgesOfNodes[j];
            if (resultLevels[j].length <= i) {
                continue;
            }
            if (resultLevels[j][0].length > 1 && resultLevels[j][0][0][1] == "Prophet") {
                resultLevels[j].push(
                    [[1, "Prophet"]]
                );
                continue; 
            }
            let currentRankPossibilities = resultLevels[j][i].filter((person) => {
                return person[0] === 1;
            });
            let nextRankPossibilities = [];
            for (let k = 0; k < currentRankPossibilities.length; k++) {
                let currentRankPossibility = currentRankPossibilities[k][1];

                let totalTests = 0;
                let totalMatches = 0;
                let totalEmpties = 0;
                for (let k = 0; k < edgesOfNode.students.length; k++) {
                    let student = edgesOfNode.students[k];
                    if (resultLevels[student].length <= i) {
                        continue;
                    }
                    let studentPossibilities = resultLevels[student][i].filter((person) => {
                            return person[0] === 1;
                        });
                    totalTests += 1;
                    for (let l = 0; l < studentPossibilities.length; l++) {
                        let studentPossibility = studentPossibilities[l][1];
                        if (isStudentsTeacher(studentPossibility, currentRankPossibility)) {
                            totalMatches += 1;
                            break;
                        }
                    }
                    if (studentPossibilities.length === 0) {
                        totalEmpties += 1;
                    }
                }
                for (let k = 0; k < edgesOfNode.teachers.length; k++) {
                    let teacher = edgesOfNode.teachers[k];
                    if (resultLevels[teacher].length <= i) {
                        continue;
                    }
                    let teacherPossibilities = resultLevels[teacher][i].filter((person) => {
                            return person[0] === 1;
                        });
                    totalTests += 1;
                    for (let l = 0; l < teacherPossibilities.length; l++) {
                        let teacherPossibility = teacherPossibilities[l][1];
                        if (teacherPossibility == "Prophet" 
                            && currentRankPossibility[2][0].includes("صحابي"))
                        {
                            totalMatches += 1;
                            break;
                        }
                        else if (isTeachersStudent(teacherPossibility, currentRankPossibility)) {
                            totalMatches += 1;
                            break;
                        }
                    }
                    if (teacherPossibilities.length === 0) {
                        totalEmpties += 1;
                    } 

                }
                if (isCompiler[j]) {
                    if (compilerList.includes(currentRankPossibility[0])) {
                        totalMatches += 1;
                        totalTests += 1;
                    }
                    else {
                        totalTests += 1;
                    }
                }
                if (totalTests * totalMatches !== 0) {
                    nextRankPossibilities.push([Math.round((totalMatches + totalEmpties) / totalTests * 100) / 100, currentRankPossibility]);
                }
                else if (totalTests === 0) {
                    nextRankPossibilities.push([1, currentRankPossibility]); 
                }
            }
            if (nextRankPossibilities.length !== 0 || true) {
                resultLevels[j].push(nextRankPossibilities);
            }
        }

        let noChange = true;
        for (let j = 0; j < nodes.length; j++) {
            let currentRankPossibilities = resultLevels[j];
            let crpLength = currentRankPossibilities.length;
            if (currentRankPossibilities.length > 1 && currentRankPossibilities[crpLength - 1].length !== currentRankPossibilities[crpLength - 2].length) {
                noChange = false;
            }
        }
        if (noChange) {
            break;
        }
    }

    console.log(resultLevels);

    let maxStudentLines = [];
    let maxTeacherLines = [];
    for (let i = 0; i < edgesOfNodes.length; i++) {
        maxStudentLines.push(-1);
        maxTeacherLines.push(-1);
    }
    for (let i = 0; i < edgesOfNodes.length; i++) {
        getMaxStudentLine(edgesOfNodes, maxStudentLines, i);
        getMaxTeacherLine(edgesOfNodes, maxTeacherLines, i);
    }
    if (setStateRecord)
        stateRecord.maxTeacherLines = maxTeacherLines;
    let maxDepth = [];
    for (let i = 0; i < edgesOfNodes.length; i++) {
        maxDepth.push(Math.max(maxStudentLines[i], maxTeacherLines[i]));
    }

    let resultDepth = [];
    for (let i = 0; i < nodes.length; i++) {
        resultDepth.push(resultLevels[i].length);
    }
    console.log(nodes, maxStudentLines, maxTeacherLines);
    console.log(maxDepth, resultDepth);


    // console.log(personPossibilities);

    // console.log(personPossibilities);
    // console.log(nodes);
    // Display the processed strings

    let isPerfect = true;
    for (let i = 0; i < nodes.length; i++) {
        nodeResultLevel = resultLevels[i];
        if (nodeResultLevel[resultDepth[i] - 1].length === 0) {
            isPerfect = false;
        }
    }
    console.log("Is perfect: " + isPerfect);

    //Remove duplicates from Result Level list
    finalResultLevels = structuredClone(resultLevels);
    for (let i = 0; i < nodes.length; i++) {
        levelsList = finalResultLevels[i];
        let countedItems = [];
        for (let j = levelsList.length - 1; j >= 0; j--) {
            let currentLevelList = levelsList[j];
            for (let k = 0; k < currentLevelList.length; k++) {
                let currentItem = currentLevelList[k];
                if (countedItems.includes(currentItem[1])) {
                    currentLevelList.splice(k, 1);
                    k--;
                }
                else {
                    countedItems.push(currentItem[1]);
                }
            }
            currentLevelList = currentLevelList.map((a) => {
                let value = a[1][3].length + a[1][4].length;
                return [a[0], a[1], value];
            });
            levelsList[j] = currentLevelList;
            currentLevelList.sort((a, b) => {
                if (b[0] - a[0] == 0) {
                    return b[2] - a[2];
                }
                else {
                    return b[0] - a[0]
                }
            });
        }
    }
    console.log(finalResultLevels);

    let classifiedLevels = [];
    for (let i = 0; i < nodes.length; i++) {
        classifiedLevels.push([]);
        let levelLength = finalResultLevels[i].length;
        let startPoint = levelLength - 1;
        if (isPerfect) {
            classifiedLevels[i].push(["Perfect", finalResultLevels[i][startPoint]]);
            startPoint--;
        }
        for (let j = startPoint; j > 0; j--) {
            let currentLevelList = finalResultLevels[i][j];
            if (currentLevelList.length !== 0) {
                classifiedLevels[i].push([`Depth ${j}/${maxDepth[i]}`, currentLevelList]);
            }
        }  
        if (finalResultLevels[i][0].length !== 0) {
            classifiedLevels[i].push([`Name Matches`, finalResultLevels[i][0]]);
        }
    }
    console.log(classifiedLevels);
    return [resultLevels, finalResultLevels, classifiedLevels, maxDepth, resultDepth, maxTeacherLines];

}

function isForcedSpecial(node) {
    if (extractIdFromBrackets(node) === "") {
        return true;
    }
    else {
        return false;
    }
}

function hasPerfectCandidate(node, classifiedLevelsNode) {
    if (extractIdFromBrackets(node) != null) {
        return true;
    }
    if (classifiedLevelsNode && classifiedLevelsNode.length > 0) { 
        if (classifiedLevelsNode[0][0] === "Perfect") {
            let options = classifiedLevelsNode[0][1];
            if (options[0].length < 4 && options.length == 1) {
                return true;
            }
            else if (options[0].length >= 4) {
                if (options.length == 1 && options[0][3] == "Perfect") {
                    return true;
                }
                else if (options[0][3] == "Perfect" && options[1][3] != "Perfect") {
                    return true;
                }
            }
        }
    }
    return false;
}


function hasBestCandidate(classifiedLevelsNode) {
    if (classifiedLevelsNode && classifiedLevelsNode.length > 0) {
        if (classifiedLevelsNode[0][1].length == 1) {
            return true;
        }
        else {
            let firstOption = classifiedLevelsNode[0][1][0];
            let secondOption = classifiedLevelsNode[0][1][1];
            if (classifiedLevelsNode[0][0] == "Name Matches" || (firstOption[0] == secondOption[0] && firstOption[2] == secondOption[2] && firstOption[3] == secondOption[3])) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    return false;
}

function getPerfectCandidate(node, classifiedLevelsNode) {
    let extractedId = extractIdFromBrackets(node);
    if (extractedId != null) {
        return extractedId;
    }
    else return classifiedLevelsNode[0][1][0][1][0];
}

function getPerfectCandidatePerson(node, classifiedLevelsNode) {
    let extractedId = extractIdFromBrackets(node);
    if (extractedId != null) {
        for (let i = 0; i < classifiedLevelsNode.length; i++) {
            for (let j = 0; j < classifiedLevelsNode[i][1].length; j++) {
                if (classifiedLevelsNode[i][1][j][1][0] == extractedId) {
                    return classifiedLevelsNode[i][1][j][1];
                }
            }
        }
    }
    else return classifiedLevelsNode[0][1][0][1];
}

function getBestCandidatePerson(classifiedLevelsNode) {
    return classifiedLevelsNode[0][1][0][1];
}

function getBestCandidate(classifiedLevelsNode) {
    return getBestCandidatePerson(classifiedLevelsNode)[0];
}

let compilerList = [
    6629,  // Bukhari
    7259,  // Muslim
    3465,  // Abu Dawud
    20049,  // Tirmidhi
    8993,  // Nasai
    20446,  // Ibn Majah
    4404,  // Abd al-Razzaq
    7429,  // Ma'mar ibn Rashid
    7873,  // Hammam ibn Munabbih
    473,  // Ahmad ibn Hanbal
    4906,  // Ibn Abu Shaibah
    1691,  // Abu Hanifah
    22075,  // Abu Yusuf
    18360,  // Muhammad al-Shaybani
    9305,  // Tahawi
    6475,  // Malik ibn Anas
    7550,  // Musa ibn Uqbah
    5593,  // Ali ibn Hijr
    983,  // Ismail ibn Ja'far
    4581,  // Abdullah ibn al-Mubarak
    5002,  // Ibn Wahb (Muwatta)
    6617,  // Shafi'i
    4565,  // Humaidi
    3303,  // Saeed ibn Mansur
    7694,  // Nuaim ibn Hammad
    901,  // Ishaq ibn Rahawayh
    4758,  // Darimi
    19341,  // Ibn Sa'd
    15998,  // Ibn Abi Dunya
    9144,  // Bazzar
    19119,  // Tabari
];

// Function to process the input
function processNarratorRecognition(nodes, edges, setStateRecord=true) {
    const edgesOfNodes = [];
    for (let i = 0; i < nodes.length; i++) {
        edgesOfNodes.push({
            teachers: [],
            students: [],
        })
    }
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        edgesOfNodes[edge[0]].students.push(edge[1]);
        edgesOfNodes[edge[0]][edge[1]] = i;
        edgesOfNodes[edge[1]].teachers.push(edge[0]);
        edgesOfNodes[edge[1]][edge[0]] = i;
    }
    
    if (setStateRecord) {
        stateRecord.edgesOfNodes = edgesOfNodes;
    }


    // console.log(edges, nodes, edgesOfNodes);
    let isCompiler = [];
    let resultLevels = [];
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let id = extractIdFromBrackets(node);
        node = removeBracketedParts(node);
        if (node.charAt(node.length - 1) == "!") {
            node = node.substring(0, node.length - 1);
            isCompiler.push(true);
        }
        else {
            isCompiler.push(false);
        }


        let possibilities;
        if (node.substring(0, 5) == "Fulan") {
            possibilities = finalNarratorData.map((n) => [1, n]);
        }
        else if (node.substring(0, 7) == "Prophet") {
            possibilities = [[1, "Prophet"]];
        }
        else {
            possibilities = convertEnglishToPeople(node).map((person) => {
                    return [1, person];
            });
            if (id != null && id != "") {
                let idExists = false;
                for (let i = 0; i < possibilities.length; i++) {
                    if (possibilities[i][1][0] == id) {
                        idExists = true;
                    }
                }
                if (!idExists) {
                    possibilities.unshift([1, finalNarratorData[id]]);
                }
            }
        }

        if (possibilities.length !== 0) {
            resultLevels.push([possibilities]);
        }
        else {
            resultLevels.push([possibilities]);
        }
    } 
    // console.log(resultLevels);

    let [, finalResultLevels, classifiedLevels, maxDepth, resultDepth, maxTeacherLines] = rankPropagation(nodes, edgesOfNodes, resultLevels, isCompiler, setStateRecord);

    let resultLevels2 = [];
    let hasId = false;
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]; 
        let id = extractIdFromBrackets(node);
        node = removeBracketedParts(node);

        if (id != null && id != "") {
            hasId = true;
            resultLevels2.push([[[1, finalNarratorData[id]]]]);
        }
        else {
            resultLevels2.push(resultLevels[i]);
        }
    } 

    let [, finalResultLevels2, classifiedLevels2, maxDepth2, resultDepth2, maxTeacherLines2] = rankPropagation(nodes, edgesOfNodes, resultLevels2, isCompiler, setStateRecord);

    // console.log(classifiedLevels, classifiedLevels2);

    function containsId(levelList, id) {
        for (let i = 0; i < levelList.length; i++) {
            let result = levelList[i];
            if (result[1][0] === id) {
                return true;
            }
        }
        return false;
    }

    function getLevel(levelsList, id) {
        for (let i = 0; i < levelsList.length; i++) {
            let levelList = levelsList[i];
            let levelName = levelList[0];
            let levelContent = levelList[1];
            if (containsId(levelContent, id)) {
                return levelName;
            }
        }
        return null;
    }

    if (hasId) {
        // Two classified levels: one without ids, one with ids

        // Remove specific character from without id if it is in with id
        for (let i = 0; i < nodes.length; i++) {
            for (let j = 0; j < classifiedLevels[i].length; j++) {
                let currentNodeLevel1 = classifiedLevels[i][j];
                let currentNodeLevel1Name = currentNodeLevel1[0];
                let currentNodeLevel1Content = currentNodeLevel1[1];
 
                for (let l = currentNodeLevel1Content.length - 1; l >= 0; l--) {
                    let item = currentNodeLevel1Content[l];
                    let id = item[1][0];
                    if (currentNodeLevel1Name === getLevel(classifiedLevels2[i], id)) {
                        // currentNodeLevel1Content.splice(l, 1);
                    }
                }
            }
        }    

        for (let i = 0; i < nodes.length; i++) {
            for (let j = 0; j < classifiedLevels[i].length; j++) {
                let currentNodeLevel1 = classifiedLevels[i][j];
                let currentNodeLevel2 = classifiedLevels2[i][j];
                let currentNodeLevel1Name = currentNodeLevel1[0];
                let currentNodeLevel1Content = currentNodeLevel1[1];

                for (let l = currentNodeLevel1Content.length - 1; l >= 0; l--) {
                    let item = currentNodeLevel1Content[l];
                    let id = item[1][0];
                    item.push(getLevel(classifiedLevels2[i], id));
                }
            }
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < classifiedLevels[i].length; j++) {
            let currentNodeLevel1 = classifiedLevels[i][j];
            let currentNodeLevel1Name = currentNodeLevel1[0];
            let currentNodeLevel1Content = currentNodeLevel1[1];

            currentNodeLevel1Content.sort((a, b) => {
                if (hasId && a[3] != b[3]) {
                    let aString = a[3];
                    let bString = b[3];
                    if (aString == "Perfect") {
                        return -1;
                    }
                    else if (bString == "Perfect") {
                        return 1;
                    }
                    else if (aString == null) {
                        return 1;
                    }
                    else if (bString == null) {
                        return -1;
                    }
                    else if (aString == "Name Matches") {
                        return 1;
                    }
                    else if (bString == "Name Matches") {
                        return -1;
                    }
                    else {
                        let num_a = parseInt(aString.split("Depth ")[1].split("/")[0]);
                        let num_b = parseInt(bString.split("Depth ")[1].split("/")[0]);
                        return num_b - num_a;
                    }
                }
                if (b[0] - a[0] == 0) {
                    return b[2] - a[2];
                }
                else {
                    return b[0] - a[0]
                }
            });
        }
    }

    for (let n = 0; n < classifiedLevels.length; n++) {
        for (let l = 0; l < classifiedLevels[n].length; l++) {
            for (let p = 0; p < classifiedLevels[n][l][1].length; p++) {
                let personOption = classifiedLevels[n][l][1][p];
                let person = personOption[1];
                let personId = person[0];
                let detailedGrade = person[2][0];
                let gradeLevel = -1;
                if (detailedGrade in gradeKeyData) {
                    gradeLevel = parseInt(gradeKeyData[detailedGrade]);
                }
                if (person == "Prophet") {
                    // person.push(1);
                }
                else {
                    person.push(gradeLevel);
                    finalNarratorData[personId].push(gradeLevel); 
                }
            }
        }
    }
    
    console.log(classifiedLevels, classifiedLevels2);
    return classifiedLevels;

    classifiedLevels2.forEach((value, index) => {
        let nodeResultLevels = value;

        // console.log(personPoss);
        const listItem = document.createElement("li");

        // variable called entry that contains paragraphs (i.e. <p>) of the listr of string in personPoss
        // console.log(personPoss);
        let entry =  "";
        entry += `<h3>${nodes[index]}</h3>`;
        nodeResultLevels.forEach((nodeResultLevel, index2) => {
            let levelName = nodeResultLevel[0];
            // entry += `<h4>${levelName}</h4>`;
            let currentLevelList = nodeResultLevel[1];
            if (index2 != 0) {
                entry += `<details><summary>${levelName}</summary>`;
            }
            else {
                entry += `<details open><summary>${levelName}</summary>`;
            }
            currentLevelList.forEach((personChoice, index) => {
                let value = personChoice[0];
                if (isNaN(value)) value = 1; 
                let person = personChoice[1];
                let personName = person[1][1];
                let hadithdb_id = person[5];
                entry += `<p><a href="https://hadith.islam-db.com/narrators/${hadithdb_id}/a">${personName}</a> (%${value*100}، ${person[2][0]}، عدة الطلاب والشيوخ: ${personChoice[2]})</p>`;
            });
            entry += `</details>`;
        });

        listItem.innerHTML = entry;

        resultList.appendChild(listItem);
    });


}

// Function to process the input
function processInput2() {
    const input = inputText.value;
    // Get the output list element with direction as rtl
    const resultList = document.getElementById("resultList");
    resultList.style.direction = "rtl";

    // Clear any previous output
    resultList.innerHTML = "";

    let processedStrings = convertEnglishToPeople(input);

    // Display the processed strings
    /*
      processedStrings.forEach(str => {
          const listItem = document.createElement('li');
          listItem.textContent = str;
          resultList.appendChild(listItem);
      });
      */
    processedStrings.forEach((str) => {
        const listItem = document.createElement("li");
        listItem.textContent = str[1][1];
        resultList.appendChild(listItem);
    });
}

let worker = null;
function runNarratorRecognitionInBackground(nodes, edges, graph) {
    // If there's an existing worker, terminate it
    if (worker) {
        worker.terminate(); // Terminate the previous worker
        worker = null; // Reset the worker variable
    }

    worker = new Worker('worker.js'); // Load the Web Worker
    worker.postMessage([nodes, edges, nameNumberData, numericalIndexData, finalNarratorData, possibleNamesData, gradeKeyData]); // Send data to the worker (if needed)

    worker.onmessage = function(e) {
        stateRecord.classifiedLevels = e.data[0];
        stateRecord.maxTeacherLines = e.data[1];
        stateRecord.edgesOfNodes = e.data[2];
        var cells = graph.getModel().cells;
        processCellColors(cells, stateRecord.classifiedLevels);  
    }; 
}

