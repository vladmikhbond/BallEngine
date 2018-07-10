let scenes;
let curentScene;

class Scene {
    constructor() {
        this.balls = box.balls.map(b => b.toString(), box);
        this.lines = box.lines.map(l => l.toString());
        this.links = box.links.map(l => l.toString());
        this.world = world.toString();
    }

    restore() {
        box.balls = [];
        this.balls.forEach(o => box.addBall(Ball.fromString(o)));
        box.lines = [];
        this.lines.forEach(o => box.addLine(Line.fromString(o)));
        box.links = [];
        this.links.forEach(o => box.addLink(Link.fromString(o, box.balls)));
        world.fromString(this.world);
    }
}

// добавление макета сцены в массив и сохранение массива в локальном хранилище
//
saveSceneButton.addEventListener("click", function ()
{
    let img = new Image();
    img.id = Date.now().toString();
    drawAll(5);
    drawRedCross();
    img.src = canvas.toDataURL();
    drawAll();
    img.setAttribute("onclick", `restoreScene("${img.id}", this)`);
    img.className = "thumbnail";
    scenesDiv.appendChild(img);

    scenes[img.id] = new Scene();
    localStorage.setItem("BallEngine-scenes", JSON.stringify(scenes));
});


// реконструкция сцены с заданным id или удаление макета
//
function restoreScene(id, img)
{
    let p = {x: event.pageX - img.offsetLeft, y: event.pageY - img.offsetTop};
    // удаление
    if (100 - p.x < 10 && p.y < 10) {
        delete scenes[id];
        scenesDiv.removeChild(img);
        localStorage.setItem("BallEngine-scenes", JSON.stringify(scenes));
        return;
    }
    // реконструкция
    scenes[id].restore();
    // if playing then stop
    if (Box.mode == MODE_PLAY)
        modeButton.dispatchEvent(new Event('click'));
    drawAll();
}

// извлечение макетов из локального хранилища
//
function restoreScenes() {
    let item = localStorage.getItem("BallEngine-scenes");
    scenes = JSON.parse(item);
    if (!scenes)
        scenes = {};
    for(let id in scenes) {
        scenes[id].__proto__ = Scene.prototype;
        scenes[id].restore();

        //
        let img = new Image();
        img.id = id;
        drawAll(5);
        drawRedCross();
        img.src = canvas.toDataURL();
        drawAll();
        img.setAttribute("onclick", `restoreScene("${img.id}", this)`);
        scenesDiv.appendChild(img);
    }

}

