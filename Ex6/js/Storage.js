let scenes;
//localStorage.removeItem("BallEngine-scenes");

// добавление макета сцены в массив и сохранение массива в локальном хранилище
saveSceneButton.addEventListener("click", function ()
{
    let img = new Image();
    img.id = Date.now().toString();
    drawAll(5);
    drawRedCross();
    img.src = canvas.toDataURL();
    drawAll();
    img.setAttribute("onclick", `restoreScene("${img.id}", this)`);
    scenesDiv.appendChild(img);

    let scene = {
        balls: box.balls.map(b => b.toString(), box),
        lines: box.lines.map(l => l.toString()),
        links: box.links.map(l => l.toString())
    };
    scenes[img.id] = scene;
    localStorage.setItem("BallEngine-scenes", JSON.stringify(scenes));


});



// реконструкция сцены с заданным id или удаление макета
function restoreScene(id, img)
{
    let p = {x: event.pageX - img.offsetLeft, y: event.pageY - img.offsetTop};
    // удаление и пересохранение массива
    if (100 - p.x < 10 && p.y < 10) {
        delete scenes[id];
        scenesDiv.removeChild(img);
        localStorage.setItem("BallEngine-scenes", JSON.stringify(scenes));
        return;
    }
    // реконструкция
    let scene = scenes[id];
    box.balls = [];
    scene.balls.forEach(s => box.addBall(Ball.fromString(s)));
    box.lines = [];
    scene.lines.forEach(l => box.addLine(Line.fromString(l)));
    box.links = [];
    scene.links.forEach(l => box.addLink(Link.fromString(l)));
    drawAll();
}

// извлечение макетов из локального хранилища
function restoreScenes() {
    let item = localStorage.getItem("BallEngine-scenes");
    scenes = JSON.parse(item);
    if (!scenes)
        scenes = {};
    for(let id in scenes) {
        let scene = scenes[id];
        box.balls = [];
        scene.balls.forEach(s => box.addBall(Ball.fromString(s)));
        box.lines = [];
        scene.lines.forEach(s => box.addLine(Line.fromString(s)));
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

