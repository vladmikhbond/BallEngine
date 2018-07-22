let box = new Box(10, 25, canvas.width - 20, canvas.height - 35 );
let controller = new Controller();

loadGalery();
box.calibrate(drawAll);
