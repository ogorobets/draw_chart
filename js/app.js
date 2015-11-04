function DrawChart() {
    this.CHART_AREA_WIDTH_PX = 500;
    this.CHART_AREA_HEIGHT_PX = 500;
    // "cu" means conventional units
    this.X_AXIS_START_CU = -50;
    this.X_AXIS_END_CU = 50; 
    this.Y_AXIS_START_CU = -50;
    this.Y_AXIS_END_CU = 50; 
    this.CHART_AREA_WIDTH_CU = this.X_AXIS_END_CU - this.X_AXIS_START_CU; // Length of x axis in cu
    this.CHART_AREA_HEIGHT_CU = this.Y_AXIS_END_CU - this.Y_AXIS_START_CU; // Length of y axis in cu
    this.CHART_SEGMENT_LENGTH_PX = 3;
    this._chartExuationText = "y = (x * x) / 10";
}

DrawChart.prototype._calculateYPoint = function(XPoint) {
    return Math.pow(XPoint, 2) / 10;
}

DrawChart.prototype.setChartEquation = function(settings) {
    this._calculateYPoint = settings.func || this._calculateYPoint;
    this._chartExuationText = settings.equationText || this._chartExuationText;
}

DrawChart.prototype.drawChart = function() {
    // debugger;
    var canvas = document.getElementById("chart-canvas");
    var context = canvas.getContext("2d");
    context.save();
    context.translate(this.CHART_AREA_WIDTH_PX/2, this.CHART_AREA_HEIGHT_PX/2);
    context.scale(1, -1);
    var segmentsAmountInXAxis = this.CHART_AREA_WIDTH_PX / this.CHART_SEGMENT_LENGTH_PX;
    var stepLengthXAxisCu = this.CHART_AREA_WIDTH_CU / segmentsAmountInXAxis;

    var currentXPoint = this.X_AXIS_START_CU;
    var currentYPoint;
    var points = []; // x1, y1, x2, y2 ...

    while (currentXPoint < this.Y_AXIS_END_CU) {
        currentYPoint = this._calculateYPoint(currentXPoint); 
        if ((currentYPoint <= this.Y_AXIS_END_CU) && 
            (currentYPoint >= this.X_AXIS_START_CU)) {
            points.push(currentXPoint);
            points.push(currentYPoint);
        }
        currentXPoint += stepLengthXAxisCu;
    }

    currentXPoint = points[0] - stepLengthXAxisCu;
    currentYPoint = this._calculateYPoint(currentXPoint);
    points.unshift(currentYPoint);
    points.unshift(currentXPoint);

    currentXPoint = points[points.length-2] + stepLengthXAxisCu;
    currentYPoint = this._calculateYPoint(currentXPoint);
    points.push(currentXPoint);
    points.push(currentYPoint);

    var chartScale = this.CHART_AREA_WIDTH_PX / this.CHART_AREA_WIDTH_CU;
    context.beginPath();
    context.moveTo(points[0] *chartScale, points[1] * chartScale);
    for (var i = 2; i < points.length; i += 2) {
        context.lineTo(points[i] * chartScale, points[i + 1] * chartScale);
    }
    context.stroke();
    context.restore();
}

DrawChart.prototype.drawXYAxes = function() {
    // Requirement: BIG_MEASURING_DASH_DELTA_CU modulo SMALL_MEASURING_DASH_DELTA_CU should be equal to 0
    var BIG_MEASURING_DASH_LENGTH_PX = 10;
    var SMALL_MEASURING_DASH_LENGTH_PX = 5;
    var BIG_MEASURING_DASH_DELTA_CU = 10;
    var SMALL_MEASURING_DASH_DELTA_CU = 2;
    var ARROW_TRIANGLE_MEDIAN_PX = 10;
    var ARROW_TRIANGLE_BASE_PX = 10;

    var canvas = document.getElementById("chart-canvas");
    var context = canvas.getContext("2d");
    context.translate(this.CHART_AREA_WIDTH_PX / 2, this.CHART_AREA_HEIGHT_PX / 2);
    context.scale(1, -1);
    var chartScale = this.CHART_AREA_WIDTH_PX / this.CHART_AREA_WIDTH_CU;

    context.beginPath();
    context.moveTo(0, this.Y_AXIS_START_CU * chartScale);
    context.lineTo(0, this.Y_AXIS_END_CU * chartScale);
    context.stroke();

    context.beginPath();
    context.moveTo(this.X_AXIS_START_CU * chartScale, 0);
    context.lineTo(this.X_AXIS_END_CU * chartScale, 0);
    context.stroke();

    var moduloNotCountedAxis = this.CHART_AREA_WIDTH_CU % SMALL_MEASURING_DASH_DELTA_CU;

    var startBigDash = -(BIG_MEASURING_DASH_LENGTH_PX/2);
    var endBigDash = BIG_MEASURING_DASH_LENGTH_PX/2;
    var startSmallDash = -(SMALL_MEASURING_DASH_LENGTH_PX/2);
    var endSmallDash = SMALL_MEASURING_DASH_LENGTH_PX/2;

    var firstMeasuringDashXCu = Math.round(this.X_AXIS_START_CU + moduloNotCountedAxis/2);
    var currXVal = firstMeasuringDashXCu;
    if (currXVal === this.X_AXIS_START_CU) {
        currXVal += SMALL_MEASURING_DASH_DELTA_CU;
    }
    
    var endOfDashDrawingX = this.X_AXIS_END_CU - (ARROW_TRIANGLE_MEDIAN_PX * (this.CHART_AREA_WIDTH_CU / this.CHART_AREA_WIDTH_PX) + 1);
    while (currXVal <= endOfDashDrawingX) {
        if (currXVal !== 0) {
            if (currXVal % BIG_MEASURING_DASH_DELTA_CU === 0) {
                // draw big dash
                context.beginPath();
                context.moveTo(currXVal * chartScale, startBigDash);
                context.lineTo(currXVal * chartScale, endBigDash);
                context.stroke();
            } else if (currXVal % SMALL_MEASURING_DASH_DELTA_CU === 0) {
                // draw small dash
                context.beginPath();
                context.moveTo(currXVal * chartScale, startSmallDash);
                context.lineTo(currXVal * chartScale, endSmallDash);
                context.stroke();
            }
        }
        currXVal += SMALL_MEASURING_DASH_DELTA_CU;
    }

    context.beginPath();
    context.moveTo(this.X_AXIS_END_CU * chartScale, 0);
    context.lineTo((this.X_AXIS_END_CU * chartScale) - ARROW_TRIANGLE_MEDIAN_PX, -(ARROW_TRIANGLE_BASE_PX/2));
    context.lineTo((this.X_AXIS_END_CU * chartScale) - ARROW_TRIANGLE_MEDIAN_PX, ARROW_TRIANGLE_BASE_PX/2);
    context.fill();


    var firstMeasuringDashYCu = Math.round(this.Y_AXIS_START_CU + moduloNotCountedAxis/2);
    var currYVal = firstMeasuringDashYCu;
    if (currYVal === this.Y_AXIS_START_CU) {
        currYVal += SMALL_MEASURING_DASH_DELTA_CU;
    }
    
    var endOfDashDrawingY = this.Y_AXIS_END_CU - (ARROW_TRIANGLE_MEDIAN_PX * (this.CHART_AREA_HEIGHT_CU / this.CHART_AREA_HEIGHT_PX) + 1);
    while (currYVal <= endOfDashDrawingY) {
        if (currYVal !== 0) {
            if (currYVal % BIG_MEASURING_DASH_DELTA_CU === 0) {
                // draw big dash
                context.beginPath();
                context.moveTo(startBigDash, currYVal * chartScale);
                context.lineTo(endBigDash, currYVal * chartScale);
                context.stroke();
            } else if (currYVal % SMALL_MEASURING_DASH_DELTA_CU === 0) {
                // draw small dash
                context.beginPath();
                context.moveTo(startSmallDash, currYVal * chartScale);
                context.lineTo(endSmallDash, currYVal * chartScale);
                context.stroke();
            }
        }
        currYVal += SMALL_MEASURING_DASH_DELTA_CU;
    }

    context.beginPath();
    context.moveTo(0, this.Y_AXIS_END_CU * chartScale);
    context.lineTo(-(ARROW_TRIANGLE_BASE_PX/2), (this.Y_AXIS_END_CU * chartScale) - ARROW_TRIANGLE_MEDIAN_PX);
    context.lineTo(ARROW_TRIANGLE_BASE_PX/2, (this.Y_AXIS_END_CU * chartScale) - ARROW_TRIANGLE_MEDIAN_PX);
    context.fill();

    context.scale(1, -1);
    var fontHeightPx = 12;
    var numberCaptionShiftXAxisYPx = fontHeightPx + 2;
    context.font = fontHeightPx + "px Arial";

    currXVal = firstMeasuringDashXCu;
    if (currXVal === this.X_AXIS_START_CU) {
        currXVal += SMALL_MEASURING_DASH_DELTA_CU;
    }

    while (currXVal <= endOfDashDrawingX) {
        if ((currXVal !== 0) && (currXVal % BIG_MEASURING_DASH_DELTA_CU === 0)) {
            // draw axis numbers
            context.fillText(currXVal.toString(), (currXVal * chartScale) - (context.measureText(currXVal.toString()).width / 2), endBigDash - numberCaptionShiftXAxisYPx);
        } 
        currXVal += SMALL_MEASURING_DASH_DELTA_CU;
    }

    var numberCaptionShiftYAxisYPx = (fontHeightPx / 2) - 2;
    var numberCaptionShiftYAxisXPx = 3;
    currYVal = firstMeasuringDashYCu;
    if (currYVal === this.Y_AXIS_START_CU) {
        currYVal += SMALL_MEASURING_DASH_DELTA_CU;
    }

    while (currYVal <= endOfDashDrawingY) {
        if ((currYVal !== 0) && (currYVal % BIG_MEASURING_DASH_DELTA_CU === 0)) {
            // draw axis numbers
            context.fillText((currYVal * -1).toString(), endBigDash + numberCaptionShiftYAxisXPx, (currYVal * chartScale) + numberCaptionShiftYAxisYPx);
        } 
        currYVal += SMALL_MEASURING_DASH_DELTA_CU;
    }

    var chartAxisTitlePx = 15;
    context.font = "900 " + chartAxisTitlePx + "px Arial";
    var yAxisTextShiftYPx = 10;
    context.fillText("y", 20 , -(this.Y_AXIS_END_CU * chartScale) + yAxisTextShiftYPx);

    context.font = "900 " + chartAxisTitlePx + "px Arial";
    var xAxisTextShiftXPx = 15;
    context.fillText("x", this.X_AXIS_END_CU * chartScale - xAxisTextShiftXPx, -20);

    var chartEquationFontPx = 15;
    context.font = chartEquationFontPx + "px Arial";
    var textBgHeight = chartEquationFontPx + 4;
    var shiftBgYPx = 5;
    var paddingBgXPx = 5;
    var chartEquationShiftYPx = 20;
    var chartEquationShiftXPx = 20;    
    var textWidth = context.measureText(this._chartExuationText).width;
    var textXCoord = (this.X_AXIS_END_CU * chartScale) - textWidth - chartEquationShiftXPx;
    var textYCoord = -((this.Y_AXIS_END_CU * chartScale) - chartEquationShiftYPx);                
    
    context.fillStyle = '#eee';
    context.fillRect(textXCoord - paddingBgXPx, textYCoord + shiftBgYPx, textWidth + (2 * paddingBgXPx), -textBgHeight);

    context.fillStyle = '#000';
    context.fillText(this._chartExuationText, textXCoord, textYCoord);
}

DrawChart.prototype.draw = function () {
    this.drawChart();
    this.drawXYAxes();
}