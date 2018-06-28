function setListeners(box) {
    modeButton.addEventListener("click", function ()
    {
       box.mode = (box.mode + 1) % 2;
    });



    canvas.addEventListener("drawAll", function (e) {
        drawAll();
    })



}