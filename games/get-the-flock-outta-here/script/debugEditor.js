
var DebugEdit = function (context, w,h, col) {
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
    var palIndex = 0;
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
    return {
        Mode: function(m){
            if(m){
                mode++;
                if(mode==3)
                {
                    mode = 0;
                }                
            }
            return mode;
        },
        Print: function (id, text, col)//debug.Print("key",value);
        {
            lines[id] = {text:text, col:col || defaultCol};
         
        },
        Render: function(rend, showFps){
            if(Input.IsSingle('`') ) {
                this.Mode(1);
            }

            var x=0;
            var y=lineht;
            switch (mode) {
                case 1:
                    if(rend == true){

                        ctx.font = lineht+"px Arial";
        
                        if(showFps == true){
                            ctx.fillStyle = defaultCol;
                            ctx.fillText(ShowFps(), x, y);
                            y+=lineht; 
                        }                
        
                        for (var key in lines) {
                            ctx.fillStyle = lines[key].col;
                            ctx.fillText(key+":"+lines[key].text, x, y);
                            y+=lineht; 
                        }            
                    } 
                    break;
                case 2:
                    if(Input.IsSingle('s') ) {
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
                    if(Input.IsSingle('a') ) {
                        palIndex--;
                        if(palIndex < 0)
                        palIndex = 63;
                    }
                    if(Input.IsSingle('d') ) {
                        palIndex++;
                        if(palIndex > 63)
                            palIndex = 0;
                    }  
                    if(Input.IsSingle('q') ) {
                        RGBEdit(palIndex, 1, true);
                    }  
                    if(Input.IsSingle('z') ) {
                        RGBEdit(palIndex, 1, false);
                    } 

                    if(Input.IsSingle('w') ) {
                        RGBEdit(palIndex, 2, true);
                    }  
                    if(Input.IsSingle('x') ) {
                        RGBEdit(palIndex, 2, false);
                    }  

                    if(Input.IsSingle('e') ) {
                        RGBEdit(palIndex, 3, true);
                    }  
                    if(Input.IsSingle('c') ) {
                        RGBEdit(palIndex, 3, false);
                    } 
                    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
                    ctx.fillRect(0,0, 17*16, 8*16);

                    ctx.fillStyle = PAL[palIndex];
                    ctx.fillRect(x, y, 32, 32);
                    ctx.fillStyle = defaultCol;
                    ctx.fillText("["+palIndex+"] "+PAL[palIndex], x+ 40, y+8);
                    y+=32;

                    var br = 7;
                    for (var i = 0; i < PAL.length; i++) {
                        ctx.fillStyle = PAL[i];
                        ctx.fillRect(x + ((i%br)*16), y + (parseInt(i/br) * 16), 16, 16);
                    }

                    ctx.beginPath();
                    ctx.strokeStyle = "#000";
                    ctx.rect(x + ((palIndex%br)*16), y + (parseInt(palIndex/br) * 16), 16, 16);
                    ctx.stroke();

                    break;                    
            
                default:
                    break;
            }

        }
    }
};
