//Used jquery

const STRAIGHT_ANGLE = 240;
const CIRCLE_ROTATION_SPEED = 25;
const FASTER_CIRCLE_ROTATION_SPEED = 15;
const DEGREE_SHIFT = 1.5;
const LINE_PADDING_VALUE = 7;
const BACKWARD_MULTIPLIER = 19;

function isZooming() {
    var newPx_ratio = window.devicePixelRatio
     || window.screen.availWidth
      / document.documentElement.clientWidth;
    if (newPx_ratio != px_ratio) {
       px_ratio = newPx_ratio;
       return true;
    } else {
       return false;
    }
 }

function rotate(outer_circles, faster) {
    counter = 0;
    var interval_obj = setInterval(function() {
        if (counter >= STRAIGHT_ANGLE) {
            counter = 0;
        }
        $(outer_circles).css({
            'transform': 'rotate('
              + counter * DEGREE_SHIFT + 'deg)'
        });
        counter++;
    }, (faster) ? FASTER_CIRCLE_ROTATION_SPEED
         : CIRCLE_ROTATION_SPEED );
    return interval_obj;
}

//returns center points
function getOffset(element) {
    var position = $(element).position();
    var xSize = $(element).width();
    var ySize = $(element).height();
    return {
        x: position.left + xSize / 2,
        y: position.top + ySize / 2
    };
}

function getTheta(x1, y1, x2, y2) {
    console.log("x: " + (x2 - x1));
    console.log("y: " + -(y2 - y1));
    console.log("Theta: " + Math.atan(-(y2 - y1) / (x2 - x1)));
    return Math.atan(-(y2 - y1) / (x2 - x1));
}

function getWidth(r, theta) {
    return Math.cos(theta) * r * 0.90;
}

function getHeight(r, theta) {
    return Math.sin(theta) * r * 0.90;
}

//starts at the contour of the circle
function getStartPos(x1, y1, r, theta) {
    return {
        left: x1 + getWidth(r, theta),
        top: y1 - getHeight(r, theta)
    }
}

function getStartPosOpposite(x1, y1, r, theta) {
    return {
        left: x1 - getWidth(r, theta),
        top: y1 + getHeight(r, theta)
    }
}

//ends at the contour of the circle
function getEndPos(x2, y2, r, theta) {
    return {
        left: x2 - getWidth(r, theta),
        top: y2 + getHeight(r, theta)
    }
}

function getEndPosOpposite(x2, y2, r, theta) {
    return {
        left: x2 + getWidth(r, theta),
        top: y2 - getHeight(r, theta)
    }
}

function getRadiusOfCircle(circle) {
    return ($(circle).width() / 2) + LINE_PADDING_VALUE;
}

//Get coordinations of the points
function getCoordinations(startCir, endCir) {
    var startCenter = getOffset(startCir);
    var endCenter = getOffset(endCir);
    var theta = getTheta(startCenter.x, startCenter.y,
        endCenter.x, endCenter.y);
    var r = getRadiusOfCircle(startCir);

    //right-ward direction
    if (startCenter.x <= endCenter.x) {
        var startPos = getStartPos(startCenter.x, startCenter.y, r, theta);
        var endPos = getEndPos(endCenter.x, endCenter.y, r, theta);
    } else { //left-ward direction
        var startPos = getStartPosOpposite(startCenter.x, startCenter.y, r, theta);
        var endPos = getEndPosOpposite(endCenter.x, endCenter.y, r, theta);
    }
    return {
        startPos,
        endPos
    }
}

//Origin point of y starts from the top not the bottom
function drawLine(startPos, endPos, line) {

    var start_x = startPos.left;
    var start_y = startPos.top;
    var end_x = endPos.left;
    var end_y = endPos.top;

    $(line).attr("x1", start_x);
    $(line).attr("y1", start_y);
    $(line).attr("x2", end_x);
    $(line).attr("y2", end_y);
}

function initialize_and_draw_line(circles, lines) {
    //Draw lines between each node
    let i = 0;
    for (i = 0;i < circles.length - 1; i++) {
        var coord = getCoordinations(circles[i], circles[i + 1]);
        drawLine(coord.startPos, coord.endPos, lines[i]);
    }
    //line 7: index 6
    var coord = getCoordinations(circles[2], circles[0]);
    drawLine(coord.startPos, coord.endPos, lines[++i]);
    //line 8: index 7
    var coord = getCoordinations(circles[4], circles[2]);
    drawLine(coord.startPos, coord.endPos, lines[++i]);
    //line 9: index 8
    var coord = getCoordinations(circles[3], circles[2]);
    drawLine(coord.startPos, coord.endPos, lines[++i]);
}



$(function() {
    var outer_circles = $('.outer_circle');
    var lines = $('.line');

    //setup gradual points
    initialize_and_draw_line(outer_circles, lines);


    var rotate_obj = rotate(outer_circles, false);
    //clearInterval(rotate_obj);
});
