
const romanToUrduMap = {
    
  "AA":"آ",
  "A":"ا", 
  "B":"ب", 
  "P":"پ", 
  "T":"ت",  
  "J":"ج", 
  "CH":"چ", 
  "KH":"خ", 
  "D":"د", 
  "Z":"ذ", 
  "R":"ر",  
  "SH":"ش", 
  "GH":"غ", 
  "F":"ف", 
  "K":"ک", 
  "G":"گ", 
  "L":"ل", 
  "M":"م", 
  "N":"ن", 
  "O":"و", 
  "H":"ہ", 
  "Y":"ی",
  "S":"س",
  "E":"ے",
  ".":"",
  "?":"",
};
function roman2urdu(word1) {
    let word = word1;
    let uw = '';
    
    //Defining Some Rules
    if (/^\d+$/.test(word)) {
        return word;
    }
    if (word === 'B') {
        word = word.replace('B','BY');
    }    
    if (word === 'K') {
        word = word.replace('K','KE');
    }
    if (word === 'WO') {
        word = word.replace('WO','OH');
    }
    if (word === 'C') {
        word = word.replace('C','SY');
            
    }
    
    if (word.startsWith("AA")) {
        word = word.replace('AA',romanToUrduMap['AA'],1);
        
    }
    //If the word Starts with a vovel replace it with A => alif    
    if (word.startsWith("E")) {
        word = word.replace('E','AE',1);
    }
    if (word.startsWith("I")) {
        word = word.replace('I','A',1);
    }
    if (word.startsWith("O")) {
        word = word.replace('O','AO',1);
    }
    if (word.startsWith("U")) {
        word = word.replace('U','A',1);
            
    }
        
    if (word.startsWith("OI")) {
        word = word.replace('OI','AY',1);
                
        
    }
        
    if (word.includes("W")) {
        word = word.replace('W','O');
    }
    if (word.includes("V")) {
        word = word.replace('V','O');
        
        
    }
        
        
    if (word.includes("SH")) {
        word = word.replace('SH',romanToUrduMap['SH']);
    }
    if (word.includes("CH")) {
        word = word.replace('CH',romanToUrduMap['CH']);
    }
    if (word.includes("KH")) {
        word = word.replace('KH',romanToUrduMap['KH']);
    }
    if (word.includes("GH")) {
        word = word.replace('GH',romanToUrduMap['GH']);
    }
    
    //Changes vowel sequence     
    if (word.includes("AA")) {
        word = word.replace('AA','A');
    }
    if (word.includes("AI")) {
        word = word.replace('AI','Y');
    }
    if (word.includes("EI")) {
        word = word.replace('EI','Y');
    }
    if (word.includes("EE")) {
        word = word.replace('EE','Y');
    }
    if (word.includes("IE")) {
        word = word.replace('IE','Y');
    }
    if (word.includes("OO")) {
        word = word.replace('OO','O');
    }
    if (word.includes("AU")) {
        word = word.replace('AU','O');
    }
    if (word.includes("OU")) {
        word = word.replace('OU','O');
    }
    if (word.includes("U")) {
        word = word.replace('U','O');
    }

    if (word.endsWith("I")) {
        word = word.replace('I','Y') ;
    }
    if (word.includes("I")) {
        word = word.replace('I','Y');
    }
    if (!word.endsWith("E")) {
        word = word.replace('E','Y',1);
    }
    if (word.includes("C")) {
        word = word.replace('C','K');
    }
    if (word.endsWith("EY")) {
        word = word.replace('EY','Y') ;
    }
    if (word.includes("X")) {
        word = word.replace('X','KS');
        
    }
        
    //Mapping from dictionary    
    for (let char of word) {
        if (romanToUrduMap[char]) {
            word = word.replace(char,romanToUrduMap[char]);    
        }
    
    }
    
    return word;
}


function rem_consec_dup(word) {
    let new_w = "";
    let prev = "";
    for (let c of word) {
        if (new_w.length === 0) {
            new_w += c;
            prev = c;
        }
        if (c === prev) {
            continue;
        } else {
            new_w += c;
            prev = c;
        }
    }
    return new_w;
}



function romanUrduConverter(sentance){
  const sen2 = sentance;
  const upperCaseSen2 = sen2.toUpperCase();
  let urduSen = '';
  const wordList2 = upperCaseSen2.split(' ');
  
  for (const word of wordList2) {
      const noConsecDupWord = rem_consec_dup(word);
      urduSen += ` ${roman2urdu(noConsecDupWord)}`;
  }
  return urduSen;
}