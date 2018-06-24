// главная программа
const box = new Box(50, 50, canvas.width - 100, canvas.height - 100 );

box.addBall(new Ball(200, 100, 25, 'red', 3.3, 10 ));
box.addBall(new Ball(300, 100, 50, 'black', 0, 0));
box.addLine(new Line(0, 0, 350, 350));
box.addLine(new Line(400, 0, 350, 350));

box.start(draw);
