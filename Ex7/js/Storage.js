const KEY = "BallEngine-scenes";
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
        controller.g = g;
        controller.W = W;
        controller.K = K;
    }
}


//
exportScenesButton.addEventListener("click", function ()
{
    scenesExport.value = localStorage.getItem(KEY);
});


//
importScenesButton.addEventListener("click", function ()
{
    //
    try {
        let newScenes = JSON.parse(scenesExport.value);
        let oldScenes = JSON.parse(localStorage.getItem(KEY));
        // add new to old
        for (let key in newScenes) {
            oldScenes[key] = newScenes[key]
        }
        // save
        localStorage.setItem(KEY, JSON.stringify(oldScenes));
        loadGalery();
    } catch (e) {
       alert(e.message)
    }
});


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
    img.setAttribute("onclick", `restoreScene('${img.id}', this)`);
    img.className = "thumbnail";
    scenesDiv.appendChild(img);

    scenes[img.id] = new Scene();
    localStorage.setItem(KEY, JSON.stringify(scenes));
});


// реконструкция сцены из макета с заданным id или удаление макета
//
function restoreScene(id, img)
{
    let p = {x: event.pageX - img.offsetLeft, y: event.pageY - img.offsetTop};
    // удаление
    if (100 - p.x < 10 && p.y < 10) {
        delete scenes[id];
        scenesDiv.removeChild(img);
        localStorage.setItem(KEY, JSON.stringify(scenes));
        return;
    }
    // реконструкция
    scenes[id].restore();
    controller.mode = MODE_STOP;

    drawAll();
}

// извлечение макетов из локального хранилища
//
function loadGalery() {
    try {
        scenes = JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
        alert(e.message)
        return;
    }

    scenesDiv.innerHTML = '';
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
        img.className = "thumbnail";
        scenesDiv.appendChild(img);
    }

}

