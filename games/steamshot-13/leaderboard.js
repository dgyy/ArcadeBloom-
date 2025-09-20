export class Leaderboard{
    constructor(){
        this.namespace = "STEAMSHOT13";
        this.table = this.read();
        this.updatePanel();
    }
 
    write( value ) {
        this.table.push( value )
        this.table.sort( (a, b) => b.score - a.score );
        localStorage.setItem(this.namespace, JSON.stringify(this.table));
        this.updatePanel();
    }
 
    read() {
        const serializedData = localStorage.getItem(this.namespace);
        const data = (serializedData) ? JSON.parse(serializedData) : [];
        return data;
    }
 
    clear() {
        localStorage.setItem( this.namespace, JSON.stringify([]) );
    }

    updatePanel(){
        const leaderboard = document.getElementById("leaderboard");
        let html = '<table class="leaderboard">';
        for(let i=0; i<10; i++){
            if ( this.table[i] ){
                html = `${html}<tr><td>${this.table[i].name}</td><td>${this.table[i].score}</td></tr>`;
            }
        }
        leaderboard.innerHTML = `${html}</table>`;
    }
}