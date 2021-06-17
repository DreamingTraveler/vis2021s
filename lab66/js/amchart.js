am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4charts.PieChart3D);
chart.hiddenState.properties.opacity = 0;

chart.data = [
  {
    sample_type: "Tumor",
    quantity: 628
  },
  {
    sample_type: "Normal",
    quantity: 122
  }
];

chart.innerRadius = am4core.percent(25);
chart.depth = 20;



var series = chart.series.push(new am4charts.PieSeries3D());
series.interpolationDuration = 1000;
series.dataFields.value = "quantity";
series.dataFields.depthValue = "quantity";
series.dataFields.category = "sample_type";
series.slices.template.cornerRadius = 5;
series.hiddenState.properties.endAngle = -90;
series.colors.list = [
  am4core.color("#750217"),
  am4core.color("#01618a")
];

}); // end am4core.ready()

// google.charts.load("current", {packages:["corechart"]});
// google.charts.setOnLoadCallback(drawChart);
// function drawChart() {
//   var data = google.visualization.arrayToDataTable([
//     ['sample_type', 'quantity'],
//     ['Tumor', 628],
//     ['Normal',  122],
//   ]);

//   var options = {
//     is3D: true,
//   };

//   var chart = new google.visualization.PieChart(document.getElementById('chartdiv'));
//   chart.draw(data, options);
// }