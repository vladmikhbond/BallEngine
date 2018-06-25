// главная программа
const box = new Box(50, 50, canvas.width - 100, canvas.height - 100 );

box.addBall(new Ball(25, 100, 25, 'black', 0, 0));
box.addBall(new Ball(200, 10, 50, 'red', 3.3, 10 ));
box.addBall(new Ball(300, 100, 25, 'black', 0, 0));

box.addLine(new Line(0, 0, 350, 350));
box.addLine(new Line(400, 0, 350, 350));

//box.addLink(new Link(box.balls[0], box.balls[1]));
//box.addLink(new Link(box.balls[1], box.balls[2]));
//box.addLink(new Link(box.balls[2], box.balls[0]));


box.start(draw);
