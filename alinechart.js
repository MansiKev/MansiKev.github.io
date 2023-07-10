var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {
    let template = document.createElement("template");
    template.innerHTML = ` 
			<div id="chartdiv" style="width: 100%; height: 100%"></div>
		`;
    class ALineChart extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));
            this._root = this._shadowRoot.getElementById("chartdiv");
            this._props = {};
        }
        onCustomWidgetResize(width, height) { }

        onCustomWidgetAfterUpdate(changedProps) { }

        async render(arg,arg1) {
            await getScriptPromisify("https://cdn.amcharts.com/lib/4/core.js");
            await getScriptPromisify("https://cdn.amcharts.com/lib/4/charts.js");
            await getScriptPromisify("https://cdn.amcharts.com/lib/4/themes/animated.js");

            am4core.useTheme(am4themes_animated);

            // Create chart instance
            var chart = am4core.create(this._root, am4charts.XYChart);
            var resultset = arg;
            var measures = arg1;
            // var data = [];
            console.log(resultset);
            // resultset.forEach(e=>{
            //     var b={};

            //     b["date"]= new Date(e["Order_Date"].id);
            //     b[e["@MeasureDimension"]["description"]]=e["@MeasureDimension"]["rawValue"];
            //     data.push(b);

            // })

            // var m=[];
            //     for(var i=0;i<resultset.length;i++){
            //         if(m.indexOf(resultset[i]["Order_Date"].id)===-1){
            //             m.push(resultset[i]["Order_Date"].id);
            //             data.push({
            //                 date:new Date(resultset[i]["Order_Date"].id),
            //                 value:resultset[i]["@MeasureDimension"]["rawValue"],
            //                 value1: resultset[i + 1]["@MeasureDimension"]["rawValue"],   
            //          });
            //         }
            //     }

            var a = {};
            for (var i = 0; i < resultset.length; i++) {

                if (a[resultset[i]["Order_Date"].id]) {
                    a[resultset[i]["Order_Date"].id][resultset[i]["@MeasureDimension"]["id"]] = resultset[i]["@MeasureDimension"]["rawValue"];
                }
                else {
                    var b = {};
                    b["date"] = new Date(resultset[i]["Order_Date"].id);
                    b[resultset[i]["@MeasureDimension"]["id"]] = resultset[i]["@MeasureDimension"]["rawValue"];
                    a[resultset[i]["Order_Date"].id] = b;
                }
            }

            console.log(a);
            chart.data = Object.values(a);
            // Set input format for the dates
            chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

            // Create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            // Create series
            for(var i=0;i<measures.length;i++){
                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.valueY = measures[i];
                series.dataFields.dateX = "date";
                series.tooltipText = "Date:{dateX} / y:{valueY}";
                console.log(measures);
                series.tooltipText = "{value}";
                series.strokeWidth = 2;
                series.minBulletDistance = 15;
                // Drop-shaped tooltips
                series.tooltip.background.cornerRadius = 20;
                series.tooltip.background.strokeOpacity = 0;
                series.tooltip.pointerOrientation = "vertical";
                series.tooltip.label.minWidth = 40;
                series.tooltip.label.minHeight = 40;
                series.tooltip.label.textAlign = "middle";
                series.tooltip.label.textValign = "middle";
    
                // Make bullets grow on hover
                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.circle.strokeWidth = 2;
                bullet.circle.radius = 4;
                bullet.circle.fill = am4core.color("#fff");
    
                var bullethover = bullet.states.create("hover");
                bullethover.properties.scale = 1.3;
            }
            
            // Make a panning cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.behavior = "panXY";
            chart.cursor.xAxis = dateAxis;
            chart.cursor.snapToSeries = series;

            // Create vertical scrollbar and place it before the value axis
            chart.scrollbarY = new am4core.Scrollbar();
            chart.scrollbarY.parent = chart.leftAxesContainer;
            chart.scrollbarY.toBack();
        
            // Create a horizontal scrollbar with previe and place it underneath the date axis
            chart.scrollbarX = new am4charts.XYChartScrollbar();
            chart.scrollbarX.series.push(series);
            chart.scrollbarX.parent = chart.bottomAxesContainer;

            dateAxis.getSeriesDataItem = function(series, position) {
                var key = this.axisFieldName + this.axisLetter;
                var value = this.positionToValue(position);
                const dataItem = series.dataItems.getIndex(series.dataItems.findClosestIndex(value, function(x) {
                  return x[key] ? x[key] : undefined;
                }, "any"));
                return dataItem;
              }

            dateAxis.start = 0.79;
            dateAxis.keepSelection = true;
        }
    }
    customElements.define("com-sap-sample-alinechart", ALineChart);

})();

