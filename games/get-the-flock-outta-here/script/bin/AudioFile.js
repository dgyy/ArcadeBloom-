
class Sound{
    constructor(samp, musicEnabled, sfxEnabled){
        this.playing = 0;
        this.sound = new Audio(samp.src);

        if(samp.volume)
        {
            this.sound.volume = samp.volume;
        }
        this.type = samp.type;

        var m = this;
        this.enabled = (this.type == 'play' && sfxEnabled) ||
                        (this.type == 'music' && musicEnabled);
        if(samp.loop){
            this.sound.loop = true;
        }
        else{
            this.sound.addEventListener('ended', function(){
                if(m.playing == 1){                   
                    m.playing = 0;
                }
            }, false);   
        }     
    }

    Play(){
        if(!this.playing){
            this.sound.play();
            this.playing = 1;
        }
    }

    End(){
        this.playing = 0;
        this.sound.pause();
    }
}

class SoundPlayer{
    constructor(files, musicEnabled, sfxEnabled){
        this.sounds = [];

        for (var i = 0; i < files.length; i++) {
            this.sounds[files[i].key] = new Sound(files[i], musicEnabled, sfxEnabled);
        }
    }

    Play(key)
    {
        if(this.sounds[key].enabled){
            this.sounds[key].Play();
        }
    }

    Stop(key)
    {
        if(this.sounds[key].enabled){
            this.sounds[key].End();
        }
    }
}
