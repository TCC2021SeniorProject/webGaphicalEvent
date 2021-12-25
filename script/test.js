//Used jquery

const CIRCLE_ROTATION_SPEED = 25;

function isZooming() {
    var newPx_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if (newPx_ratio != px_ratio) {
       px_ratio = newPx_ratio;
       return true;
    } else {
       return false;
    }
 }

function rotate(outer_circles, interval) {
    counter = 0;
    var interval_obj = setInterval(function() {
        if (counter >= 180) {
            counter = 0;
        }
        $(outer_circles).css({
            'transform': 'rotate(' + counter * 1.5 + 'deg)'
        });
        counter++;
    }, interval);
    return interval_obj;
}

function getOffset(element) {
    var position = $(element).position();
    var xSize = $(element).width();
    var ySize = $(element).height();
    console.log(position);
    console.log(xSize);
    return {
        left: position.left + xSize / 2,
        top: position.top + ySize / 2
    };
}

function getTheta(x1, y1, x2, y2) {
    //arctan(((y2 - y1) / (x2 - x1)))
    return Math.atan(((y2 - y1) / (x2 - x1)))
}

function getStartPos(x1, y1, r, theta) {
    // x1 + cos(theta) * r
    // y1 + sin(theta) * r
    return {
        x1: x1 + Math.cos(theta) * r,
        y1: y1 + Math.sin(theta) * r
    }
}

function setEndPos(x2, y2, r, theta) {
    // x2 - cos(theta) * r
    // y2 - sin(theta) * r
    return {
        x2: x2 - Math.cos(theta) * r,
        y2: y2 - Math.sin(theta) * r
    }
}

function centerLinePosition(line, x1, y1, x2, y2, r) {
    var theta = getTheta(x1, y1, x2, y2);
    var startPos = getStartPos(x1, y1, r, theta);
    var endPos = setEndPos(x2, y2, r, theta);
    $(line).attr("x1", startPos.x1);
    $(line).attr("y1", startPos.y1);
    $(line).attr("x2", endPos.x2);
    $(line).attr("y2", endPos.y2);
}

function drawLine(departCircle, arriveCircle, line) {
    departNodePos = getOffset($(departCircle));
    arriveNodePos = getOffset($(arriveCircle));
    var r = ($(departCircle).width() / 2) + 7;

    //modify depart position
    x1 = departNodePos.left;
    y1 = departNodePos.top;

    //modify arrive position
    x2 = arriveNodePos.left;
    y2 = arriveNodePos.top;
    centerLinePosition(line, x1, y1, x2, y2, r);
}

function draw(circles, lines) {
    //Draw lines between each node
    for (let i = 0; i < circles.length - 1; i++) {
        drawLine(circles[i],
                 circles[i + 1],
                 lines[i]);
    }
}

$(function() {
    var outer_circles = $('.outer_circle');
    var lines = $('.line');
    var rotate_obj = rotate(outer_circles, CIRCLE_ROTATION_SPEED);

    //draw additional graphics
    draw(outer_circles, lines);
    //clearInterval(rotate_obj);
});
