const strToB64 = str => {
    
    const buff = Buffer.from(str);  
    return buff.toString('base64');
    
}

const encode = (b64, chars = []) => {
    
    chars = chars.length == 0 ? ["a", "1"] : chars;
    chars = chars.length % 2 == 0 ? chars : chars.slice(0, -1);
    let magicString = "";
    let magicStringB64 = "";
    
    for (i = 0; i < chars.length ; i = i + 2) {
        
        magicString = chars[i] + chars[i+1];
        magicStringB64 = strToB64(magicString)
        b64 = b64.replace(magicString, magicStringB64)
        
    }
    
    return b64;
    
}

module.exports.encode = encode;
