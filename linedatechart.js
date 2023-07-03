var getScriptPromisify = (src) => {
    return new Promise((resolve) => {
      $.getScript(src, resolve)
    })
  }
  const parseMetadata = metadata => {
  const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } = metadata
  const dimensions = []
  for (const key in dimensionsMap) {
    const dimension = dimensionsMap[key]
    dimensions.push({ key, ...dimension })
  }
  const measures = []
  for (const key in measuresMap) {
    const measure = measuresMap[key]
    measures.push({ key, ...measure })
  }
  return { dimensions, measures, dimensionsMap, measuresMap }
 }

  (function(){
   let template= document.createElement("template");
   template.innerHTML=`
   <div id="chart_div" style="width: 100%; height: 100%"></div>
   `;

   class LineChart extends HTMLElement{
    constructor(){
        super();
        this._shadowRoot=this.attachShadow({mode:"open"});
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this._root=document.getElementById("chart_div");
        this._props={};
    }
    onCustomWidgetAfterUpdate(changedProps){
        this.render()
    }
    async render () {
        await getScriptPromisify("https://cdn.amcharts.com/lib/4/core.js");
		await getScriptPromisify("https://cdn.amcharts.com/lib/4/charts.js");
		await getScriptPromisify("https://cdn.amcharts.com/lib/4/themes/animated.js");
        
        am4core.useTheme(am4themes_animated);
        const { data, metadata } = dataBinding
        const { dimensions, measures } = parseMetadata(metadata)
        // dimension
        const categoryData = []
  
        // measures
        const series = measures.map(measure => {
          return {
            data: [],
            key: measure.key,
            type: 'line',
            smooth: true
          }
        })
  
        data.forEach(row => {
          // dimension
          categoryData.push(dimensions.map(dimension => {
            return row[dimension.key].label
          }).join('/'))
          // measures
          series.forEach(series => {
            series.data.push(row[series.key].raw)
          })
        })


        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

            // Create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            // Create series
            // var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.dateX = "date";
            series.tooltipText = "{value}"
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

            dateAxis.start = 0.79;
            dateAxis.keepSelection = true;
    }

   }
   customElements.define("sap-sample-linechart", LineChart);

  })();
