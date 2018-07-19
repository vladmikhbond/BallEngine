let box = new Box(10, 25, canvas.width - 20, canvas.height - 35 );
let controller = new Controller();
//box.calibrate(loadGalery);
loadGalery();
drawAll();
box.calibrate(drawAll);
