let scenes;
//localStorage.removeItem("BallEngine-scenes");

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
        lines: box.lines.map(l => l.toString())
    };
    scenes[img.id] = scene;
    localStorage.setItem("BallEngine-scenes", JSON.stringify(scenes));


});



// восстановление n-ой сцены
function restoreScene(id, img)
{

    let p = {x: event.pageX - img.offsetLeft, y: event.pageY - img.offsetTop};

    if (100 - p.x < 10 && p.y < 10) {
        delete scenes[id];
        scenesDiv.removeChild(img);
        localStorage.setItem("BallEngine-scenes", JSON.stringify(scenes));
        return;
    }

    let scene = scenes[id];
    box.balls = [];
    scene.balls.forEach(s => box.addBall(Ball.fromString(s)));
    box.lines = [];
    scene.lines.forEach(s => box.addLine(Line.fromString(s)));
    drawAll();
}

