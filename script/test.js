//Used jquery

const STRAIGHT_ANGLE = 180;
const LINE_TIME_INTERVAL = 300;
const CIRCLE_ROTATION_SPEED = 25;
const DEGREE_SHIFT = 1.5;
const LINE_PADDING_VALUE = 7;

function isZooming() {
    var newPx_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if (newPx_ratio != px_ratio) {
       px_ratio = newPx_ratio;
       return true;
    } else {
       return false;
    }
 }

function rotate(outer_circles) {
    counter = 0;
    var interval_obj = setInterval(function() {
        if (counter >= STRAIGHT_ANGLE) {
            counter = 0;
        }
        $(outer_circles).css({
            'transform': 'rotate(' + counter * DEGREE_SHIFT + 'deg)'
        });
        counter++;
    }, CIRCLE_ROTATION_SPEED);
    return interval_obj;
}

function getOffset(element) {
    var position = $(element).position();
    var xSize = $(element).width();
    var ySize = $(element).height();
    return {
        left: position.left + xSize / 2,
        top: position.top + ySize / 2
    };
}

function getTheta(x1, y1, x2, y2) {
    return Math.atan(((y2 - y1) / (x2 - x1)))
}

function getStartPos(x1, y1, r, theta, flipped) {
    if (flipped) {
        return {
            x1: x1 - Math.cos(theta) * r,
            y1: y1 - Math.sin(theta) * r
        }
    } else {
        return {
            x1: x1 + Math.cos(theta) * r,
            y1: y1 + Math.sin(theta) * r
        }
    }
}

function setEndPos(x2, y2, r, theta, flipped) {
    if (flipped) {
        return {
            x2: x2 + Math.cos(theta) * r,
            y2: y2 + Math.sin(theta) * r
        }
    } else {
        return {
            x2: x2 - Math.cos(theta) * r,
            y2: y2 - Math.sin(theta) * r
        }
    }
}


function centerLinePosition(line, x1, y1, x2, y2, r, flipped) {

    var theta = getTheta(x1, y1, x2, y2);
    var startPos = getStartPos(x1, y1, r, theta, flipped);
    var endPos = setEndPos(x2, y2, r, theta, flipped);
    $(line).attr("x1", startPos.x1);
    $(line).attr("y1", startPos.y1);
    $(line).attr("x2", endPos.x2);
    $(line).attr("y2", endPos.y2);
}

function getRadiusOfCircle(circle) {
    return ($(circle).width() / 2) + LINE_PADDING_VALUE;
}

function drawLine(departCircle, arriveCircle, line, flipped) {
    var departNodePos = getOffset(departCircle);
    var arriveNodePos = getOffset(arriveCircle);
    var r = getRadiusOfCircle(departCircle);

    //modify depart position
    x1 = departNodePos.left;
    y1 = departNodePos.top;

    //modify arrive position
    x2 = arriveNodePos.left;
    y2 = arriveNodePos.top;
    centerLinePosition(line, x1, y1, x2, y2, r, flipped);
}

function draw(circles, lines) {
    //draw dynamic lines
    var interval_obj = setInterval(function() {
        counter++;
    }, LINE_TIME_INTERVAL);

    //Draw lines between each node
    for (let i = 0; i < circles.length - 1; i++) {
        drawLine(circles[i], circles[i + 1], lines[i], false);
    }
    drawLine(circles[2], circles[0], lines[6], true);
    drawLine(circles[5], circles[4], lines[7], true);
}

$(function() {
    var outer_circles = $('.outer_circle');
    var lines = $('.line');
    var rotate_obj = rotate(outer_circles);

    //draw additional graphics
    draw(outer_circles, lines);
    //clearInterval(rotate_obj);
});
