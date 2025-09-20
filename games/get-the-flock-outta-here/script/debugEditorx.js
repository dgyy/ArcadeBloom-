var DebugEdit = function (context, w,h, col, debugModes = 2) {
    var lastLoop = (new Date()).getMilliseconds();
    var count = 1;
    var fps = 0;

    var lineht = 16;
    var lines = {};

    var width = w;
    var height = h;
    var ctx =context;
    var defaultCol = col || '#000';

    var mode = 0;
    var modes = debugModes > 2 ? debugModes : 2;
    //var palIndex = 0;
    function ShowFps() {
        var currentLoop = (new Date()).getMilliseconds();
        if (lastLoop > currentLoop) {
          fps = count;
          count = 1;
        } else {
          count += 1;
        }
        lastLoop = currentLoop;
        return fps;
      }

    return {
        Show: function(m)
        {
            return mode == m;
        },
        Mode: function(){
            mode++;
            if(mode==modes)
            {
                mode = 0;
            }
        },
        Print: function (id, text, col)//debug.Print("key",value);
        {
            lines[id] = {text:text, col:col || defaultCol};         
        },
        Clear: function(){
            lines = {};
        },
        Render: function(rend, showFps){
            if(Input.IsSingle('`') ) {
                DEBUG.Mode();
            }

            var x=0;
            var y=lineht;

            if(mode > 0)
            {
                if(rend == true){

                    ctx.font = lineht+"px Arial";
    
                    if(showFps == true){
                        ctx.fillStyle = defaultCol;
                        ctx.fillText(ShowFps(), x, y);
                        y+=lineht; 
                    }                
    
                    ctx.fillStyle = defaultCol;
                    ctx.fillText("mode:"+mode, x, y);
                    y+=lineht;
                    
                    for (var key in lines) {
                        ctx.fillStyle = lines[key].col;
                        ctx.fillText(key+":"+lines[key].text, x, y);
                        y+=lineht; 
                    }            
                }                 
            }
        }
    }
};


/*
    function RGBEdit(index, row, up){
        var rgb = PAL[index].split('');
        var r = parseInt(rgb[row], 16);
        if(up){
            if(r<15){
                r++;
            }
        }else{
            if(r>0){
                r--;
            }
        }
        rgb[row] = r.toString(16).toUpperCase();
        PAL[index] = rgb[0]+rgb[1]+rgb[2]+rgb[3];
    }

                case 2:
                    if(Input.IsSingle('Numpad0') ) {
                        var p = "var PAL =[";
                        for (var i = 0; i < PAL.length; i++) {
                            p += "'"+PAL[i]+"'";
                            if(i != PAL.length-1){
                                p += ",";
                            }
                        }
                        p += "]";
                        console.log(p);
                    }                    
                    if(Input.IsSingle('Numpad4') ) {
                        palIndex--;
                        if(palIndex < 0)
                        palIndex = 63;
                    }
                    if(Input.IsSingle('Numpad6') ) {
                        palIndex++;
                        if(palIndex > 63)
                            palIndex = 0;
                    }  
                    if(Input.IsSingle('Numpad7') ) {
                        RGBEdit(palIndex, 1, true);
                    }  
                    if(Input.IsSingle('Numpad1') ) {
                        RGBEdit(palIndex, 1, false);
                    } 

                    if(Input.IsSingle('Numpad8') ) {
                        RGBEdit(palIndex, 2, true);
                    }  
                    if(Input.IsSingle('Numpad2') ) {
                        RGBEdit(palIndex, 2, false);
                    }  

                    if(Input.IsSingle('Numpad9') ) {
                        RGBEdit(palIndex, 3, true);
                    }  
                    if(Input.IsSingle('Numpad3') ) {
                        RGBEdit(palIndex, 3, false);
                    } 
                    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
                    ctx.fillRect(0,0, 17*16, 8*16);

                    ctx.fillStyle = PAL[palIndex];
                    ctx.fillRect(x, y, 32, 32);
                    ctx.fillStyle = defaultCol;
                    ctx.fillText(PAL[palIndex], x+ 40, y+8);
                    y+=32;

                    for (var i = 0; i < PAL.length; i++) {
                        ctx.fillStyle = PAL[i];
                        ctx.fillRect(x + ((i%16)*16), y + (parseInt(i/16) * 16), 16, 16);
                    }

                    ctx.beginPath();
                    ctx.strokeStyle = "#000";
                    ctx.rect(x + ((palIndex%16)*16), y + (parseInt(palIndex/16) * 16), 16, 16);
                    ctx.stroke();

                    break; 


*/