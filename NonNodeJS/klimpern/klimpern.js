class Reader {
    constructor () {
        this.storage = window.localStorage;
    }

    load_game () {
        return this.storage.getItem('klimpern');
    }

    save_game (game) {
        this.storage.setItem('klimpern', game);
    }

    clear () {
        this.storage.clear();
    }

    load_player (name) {
        return JSON.parse(this.storage.getItem(name));
    }

    save_player (player) {
        this.storage.setItem(player.name, JSON.stringify(player));
        var players = JSON.parse(this.storage.getItem('player'));
        if (!players) {
            var players = []
        }
        players.indexOf(player.name) == -1 ? players.push(player.name) : 'nope';
        this.storage.setItem('player', JSON.stringify(players));
    }
}

class Player {
    constructor (name) {
        this.name = name;
        this.trinker = 0;
        this.treffer = 0;
        this.strafen = 0;
        new Reader().save_player(this)
    }

    punkte () {
        return this.treffer * 2 + this.trinker - this.strafen
    }
}

function add_player() {
    var name = prompt("Name?");
    player = new Player(name);
}
function start() {

}
function clear() {
    new Reader().clear()
}