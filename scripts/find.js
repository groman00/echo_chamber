

// a non-jquery function to select all html elements we want to replace...
function nativeSelector() {
    var elements = document.querySelectorAll("p, a, h1,h2,h3,span,li,ul,ol");
    return elements;
}
// function to get a random number (from MDN docs)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// our "inner text" replacer..
function findAndReplace(element, targetText, options) {
    //console.log(element,targetText,options)
    let originalText = element.innerText;
    let randomIndex=getRandomInt(0,(options.length-1));
    let replaceText = String(options[randomIndex]);

    if (originalText && originalText.includes(targetText)) {
        // we use the split and join method instead of the string.replace
        // because the replace will only change the first value.
        // In <p> elements this was not desirable.
        console.log("replacing ",targetText," with ",replaceText);
        let substituteText = originalText.split(targetText).join(replaceText);
        element.innerText = substituteText;
    }
}
// here we're pulling the target value from storage (set on the options page)
chrome.storage.sync.get('targetPerson', function(targetObject) {

    let person = targetObject.targetPerson || "trump";
    console.log(person);

    let swapText ={
      trump: {
        "Donald": ["Don the Con","The Big Racist", "The Bigot", "Professional Fearmonger","LadyGroper","Smallhands"],
        "Trump": ["Drumpf","Assclown","Trumpz"],
        "TRUMP": ["ASSCLOWN"]
      }
    };

  let textnodes = nativeSelector();

  let keyWords=Object.keys(swapText[person])

  textnodes.forEach(function(node) {

    keyWords.forEach(function(word){
        let options=swapText[person][word];
        findAndReplace(node, word, options);
      })
  })
})
