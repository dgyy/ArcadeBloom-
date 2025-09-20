package;

import js.Browser.window;
import js.Browser.document;

class Main {
    public static var instance:Main;

    static function main() {
        window.onload = ()->new Main();
    }

    var canvas:js.html.CanvasElement;
    public var ctx:js.html.CanvasRenderingContext2D;
    var images:Map<String, js.html.Image> = new Map();
    var engine:ecs.Engine;
    var lastTime = 0.0;
    public var keys:Dynamic = {};
    public var previousKeys:Dynamic = {};

    public var session = new game.Session();

    function new() {
        instance = this;
        loadImages();
        initHtml();
        initGame();
        loop(0);
    }

    function initHtml() {
        canvas = cast document.getElementById("c");
        ctx = canvas.getContext("2d");
        canvas.width = canvas.height = 64;
        untyped onkeydown = onkeyup = function(e) {
            keys[e.key] = e.type[3] == 'd';
        }
    }

    function initGame() {
        engine = new ecs.Engine();
        engine.addSystem(new game.GameSystem(), 0);
        engine.addSystem(new game.FallSystem(), 3);
        engine.addSystem(new game.PlayerSystem(), 4);
        engine.addSystem(new game.BotSystem(), 4);
        engine.addSystem(new game.ControlSystem(), 5);
        engine.addSystem(new game.PuyoSystem(), 6);
        engine.addSystem(new game.BlinkSystem(), 9);
        engine.addSystem(new game.CheckSystem(), 10);
        engine.addSystem(new game.PuyoDisplaySystem(), 100);
        engine.addSystem(new game.HudSystem(), 101);
    }

    function loadImages() {
        loadImage("background");
    }

    function loadImage(name) {
        var image = new js.html.Image();
        image.src = "./data/" + name + ".png";
        images[name] = image;
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images["background"], 0, 0);
    }

    function loop(time:Float) {
        var deltaTime = (time - lastTime) / 1000;
        lastTime = time;
        render();
        engine.update(deltaTime);
        previousKeys = js.lib.Object.assign({}, keys);
        js.Browser.window.requestAnimationFrame(loop);
    }

    public function draw(image, x, y) {
        ctx.drawImage(images[image], x, y);
    }

    public function isPressed(k:String) {
        return untyped keys[k];
    }

    public function isJustPressed(k:String) {
        return untyped !previousKeys[k] && untyped keys[k];
    }

    public function countEntities(team, type) {
        var es = engine.getMatchingEntities(type);
        var result = 0;

        for(e in es) {
            if(e.get(game.Puyo).team == team) {
                result++;
            }
        }

        return result;
    }

    public function getEntities(team, type) {
        var es = engine.getMatchingEntities(type);
        var result = [];

        for(e in es) {
            if(e.get(game.Puyo).team == team) {
                result.push(e);
            }
        }

        return result;
    }

    public function getRandomInt(seed, max):Int {
        var x = (Math.sin(seed++) + 1) * 9999;
        return Std.int(x) % max;
    }

    public function win(team) {
        trace(session.playerNames[team] + " has won!");
        engine.suspendSystem(game.GameSystem);
        engine.suspendSystem(game.FallSystem);
        session.winner = team;
        session.gameFinished = true;
        sfx(1.58, 0, 261.6256, .05, .25, .48, 1, .36, .1, 0, -50, .01, .01, .2, -1, -0.1, .03, .3, .12, .23);
    }

    public function start() {
        engine.resumeSystem(game.GameSystem);
        engine.resumeSystem(game.FallSystem);
        session = new game.Session();
        var es = engine.getMatchingEntities(game.Puyo);

        for(e in es) {
            engine.removeEntity(e);
        }
    }

    public function sfx(...args:Float) {
        var func:Dynamic = js.Syntax.code("zzfx");
        func.apply(null, args);
    }
}
