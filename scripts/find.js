// http://stackoverflow.com/a/10730777
// https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker
function textNodesUnder(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
}

// a non-jquery function to select all html elements we want to replace...
function nativeSelector() {
    //hat tip: https://davidwalsh.name/nodelist-array
    var elements = [].slice.call(document.querySelectorAll("p, a, h1,h2,h3,span,li,ul,ol"));
    return elements;
}
// function to get a random number (from MDN docs)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// our "inner text" replacer..
function findAndReplace(element, targetText, options) {
    let nodeValue = element.nodeValue;
    let randomIndex = getRandomInt(0, (options.length - 1));
    let replaceText = String(options[randomIndex]);
    
    if(nodeValue.indexOf(targetText) > -1){
        element.nodeValue = nodeValue.replace(new RegExp(targetText, 'g'), replaceText);
    }

    /*
    //console.log(element,targetText,options)
    let originalText = element.innerText;
    let randomIndex = getRandomInt(0, (options.length - 1));
    let replaceText = String(options[randomIndex]);

    if (originalText && originalText.includes(targetText)) {
        // we use the split and join method instead of the string.replace
        // because the replace will only change the first value.
        // In <p> elements this was not desirable.
        console.log(element);
        console.log("replacing ", targetText, " with ", replaceText);
        let substituteText = originalText.split(targetText).join(replaceText);
        element.innerText = substituteText;
    }
    */
}

// here we're pulling the target value from storage (set on the options page)
chrome.storage.sync.get(null, function(settings) {
    let gtStyle = settings.groupThinkStyle || "belittle"
    let person = settings.targetPerson || "trump";

    let swapText = {
        trump: {
            belittle: {
                "Donald": ["Don the Con", "The Big Racist","Mango Mussolini", "The Bigot", "Professional Fearmonger", "LadyGroper", "Smallhands"],
                "Trump": ["Drumpf", "Assclown", "Trumpz","Hair Furher"],
                "TRUMP": ["ASSCLOWN"],
                "alt-right":["american Nazi moron movement"],
                "Alt-right":["American Nazi Party of Poor Racist Idiots"]
            },
            propaganda: {
                "Donald": ["The Ascendent", "Our Swampdrainer", "Very, Very Rich", "The Best", "Benevolent"],
                "Trump": ["Great Father", "Strong Leader", "Golden Celebrity Leader", "Emperor Trump"],
                "TRUMP": ["GREAT EMPEROR TRUMP"]
            }
        }
    };
    let body = document.body;
    let keyWords = Object.keys(swapText[person][gtStyle])
    let textNodes = textNodesUnder(body);

    textNodes.forEach(function(node){
        keyWords.forEach(function(word) {
            let options = swapText[person][gtStyle][word]; // the word array
            findAndReplace(node, word, options);
        })
    });

    /*
    let textnodes = nativeSelector();
    // wikipedia taking too long...
    let limitedTextNodes = textnodes.slice(0,1000);
    let keyWords = Object.keys(swapText[person][gtStyle])

    limitedTextNodes.forEach(function(node) {

        keyWords.forEach(function(word) {
            let options = swapText[person][gtStyle][word]; // the word array
            findAndReplace(node, word, options);
        })
    })
    */
})
