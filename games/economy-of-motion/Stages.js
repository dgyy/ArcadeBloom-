export class Stages {
  constructor() {
    /*IGNORE{*/
    if (false)
    /*}IGNORE*/
    this.v = Array.from(document.getElementsByTagName("stage")).map(e => e.innerText);
  }
  
  /*IGNORE{*/
  /* Before minification, we find all the <stage> tags, download their referred files,
   * and compile the same way our minifier would.
   * It's a heavy and duplicative process, but it's ok to be wasteful on these dev-only builds.
   * Same idea as Audio with songs.
   */
  loadUncompiledStages() {
    return Promise.all(Array.from(document.getElementsByTagName("stage")).map(e => {
      const href = e.getAttribute("href");
      return fetch(href).then(rsp => {
        if (!rsp.ok) throw rsp;
        return rsp.text();
      }).then(src => this.compile(src, href));
    })).then(compiled => {
      this.v = compiled;
    });
  }
  compile(src, href) {
    let dst="", lineno=1;
    const base65_div4 = (src) => {
      let n = +src;
      if (isNaN(n) || (n < 0) || (n > 256) || (n & 3)) {
        throw new Error(`${href}:${lineno}: Expected multiple of 4 in 0..256, found ${JSON.stringify(src)}`);
      }
      n >>= 2;
           if (n < 26) dst += String.fromCharCode(0x41 + n);
      else if (n < 52) dst += String.fromCharCode(0x61 + n - 26);
      else if (n < 62) dst += String.fromCharCode(0x30 + n - 52);
      else if (n === 62) dst += "+";
      else if (n === 63) dst += "/";
      else if (n === 64) dst += "?";
      else throw new Error(`${href}:${lineno}: Illegal value ${n} for base65`);
    }
    for (let srcp=0; srcp<src.length; lineno++) {
      let nlp = src.indexOf("\n", srcp);
      if (nlp < 0) nlp = src.length;
      const line = src.substring(srcp, nlp).trim();
      srcp = nlp + 1;
      if (!line) continue;
      const words = line.split(/\s+/g);
      switch (words[0]) {
      
        case "hero": {
            dst += "h";
            base65_div4(words[1]);
            base65_div4(words[2]);
          } break;
      
        case "wall": {
            dst += "w";
            base65_div4(words[1]);
            base65_div4(words[2]);
            base65_div4(words[3]);
            base65_div4(words[4]);
          } break;
        
        // "bg" and "song" are vestigial. Accept but ignore.
        case "bg": {
            //dst += "b";
            //if (words[1].length !== 3) throw new Error(`${href}:${lineno}: Expected "RGB" after "bg"`);
            //dst += words[1];
          } break;
        case "song": {
            //dst += "s";
            //dst += words[1];
            //dst += ".";
          } break;
          
        case "platform": {
            dst += "p";
            base65_div4(words[1]);
            base65_div4(words[2]);
            base65_div4(words[3]);
            base65_div4(+words[4] + 128);
            base65_div4(+words[5] + 128);
          } break;
          
        case "ladder": {
            dst += "l";
            base65_div4(words[1]);
            base65_div4(words[2]);
            base65_div4(words[3]);
          } break;
          
        case "win": {
            dst += "e";
            base65_div4(words[1]);
            base65_div4(words[2]);
            base65_div4(words[3]);
            base65_div4(words[4]);
          } break;
      
        default: throw new Error(`${href}:${lineno}: Unexpected command ${JSON.stringify(words[0])}`);
      }
    }
    return dst;
  }
  /*}IGNORE*/
}
