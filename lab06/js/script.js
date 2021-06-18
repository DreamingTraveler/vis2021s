window.onload = function() {
  	var margin = {top: 20, right: 160, bottom: 35, left: 30};

	var width = 1000 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	// var colors = ["rgba(13, 74, 41, 0.8)", "rgba(92, 125, 90, 0.8)", "rgba(119, 217, 179, 0.8)", 
	//   "rgba(138, 209, 145, 0.8)", "rgba(230, 250, 180, 0.8)"]

	var colors = ["#07000E", "#8A2C02", "#D75404", "#F08B33", "#EECC8D"];

	var container = d3.select("#inner-block").append("div").attr("id", "container");

	var svg = container
	  .append("svg")
	  .attr("viewBox", [50, 0, width-30, height+50])
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .attr("class", "svg")
	  .append("g")
	  .attr("class", "bars")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var dataset;
	var newDataset;

	var dataLen = 0;
	var winSize = 50;
	var divNum = 0;
	var optionList = [];

	d3.csv("data.csv", function(data){
	  dataset = d3.layout.stack()(["國文", "英文", "法文", "德文", "日文"].map(function(lang) {
	    return data.map(function(d) {
	      return {x: d["編號"], y: +d[lang], z1: d["屬性一"], z2: d["屬性二"]};
	    });
	  }));

	  dataLen = dataset[0].length;
	  
	  // var colors = ["#b33040", "#d25c4d", "#f2b447", "#d9d574", "#7de3e1"];
	  
	  var updateChart = function(selectedGroupId, isInitial){
	    selectedGroupId = parseInt(selectedGroupId)
	    var startIdx = selectedGroupId * winSize
	    var endIdx = (selectedGroupId + 1) * winSize
	    var newData = data.slice(startIdx, endIdx)

	    newDataset = d3.layout.stack()(["國文", "英文", "法文", "德文", "日文"].map(function(lang) {
	      return newData.map(function(d) {
	        return {x: d["編號"], y: +d[lang], z1: d["屬性一"], z2: d["屬性二"]};
	      });
	    }));

	    var x = d3.scale.ordinal()
	    .domain(newDataset[0].map(function(d) { return d.x; }))
	    .rangeRoundBands([0, width], 0.05);

	    var y = d3.scale.linear()
	      .domain([0, d3.max(newDataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
	      .range([height, 0]);

	    // Define and draw axes
	    var yAxis = d3.svg.axis()
	      .scale(y)
	      .orient("left")
	      .ticks(10)
	      .tickSize(-width, 0, 0)
	      .tickFormat( function(d) { return d } );

	    var xAxis = d3.svg.axis()
	      .scale(x)
	      .orient("bottom");

	    if (isInitial){
	      svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);

	        svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);
	    }
	    
	    else {
	      svg.selectAll("g .y.axis")
	        .call(yAxis);

	      svg.selectAll("g .x.axis")
	        .call(xAxis);
	    }
	    

	    var newGroups = svg.selectAll("g.cost")
	      .data(newDataset)

	    newGroups
	      .enter().append("g")
	      .attr("class", "cost")
	      .style("fill", function(d, i) { return colors[i]; });

	    var rect = newGroups.selectAll("rect")
	      .data(function(d) { return d; })

	    rect
	      .enter()
	      .append("rect")
	      .attr("class", "bar")
	      
	    // update
	    svg.selectAll(".bar")
	      .transition()
	      .ease("sin-out")
	      .duration(300)
	      .delay(function(d,i){ return(i*3)})
	      .attr("x", function(d) { return x(d.x) })
	      .attr("y", function(d) { return y(d.y0 + d.y); })
	      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
	      .attr("width", x.rangeBand() - 3)

	    svg.selectAll(".bar")
	      .style("stroke", "black")
	      .style("stroke-width", "0.8")
	      .on("mouseover", function() { 
	        tooltip.style("display", null); 
	      })
	      .on("mouseout", function() { 
	        tooltip.style("display", "none"); 
	        d3.select(this)
	          .style("opacity", 1)
	          .style("-webkit-filter", "invert(0%)")
	          .style("filter", "invert(0%)")
	          .style("stroke", "black")
	      })
	      .on("mousemove", function(d) {
	        var xPosition = d3.mouse(this)[0] - 15;
	        var yPosition = d3.mouse(this)[1] - 25;

	        d3.select(this)
	          .transition()
	          .duration(300)


	        d3.select(this)
	          .style("opacity", 0.5)
	          .style("-webkit-filter", "invert(50%)")
	          .style("filter", "invert(50%)")
	          .style("stroke", "green")

	        
	        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
	        tooltip.select("text").text(d.y);
	        tooltip.select("#type1").text("attr1:"+d.z1);
	        tooltip.select("#type2").text("attr2:"+d.z2);
	      });

	    rect
	      .exit()
	      .remove()
	      
	  }

	  var settings = d3.select("#inner-block")
	    .append("div")
	    .attr("id", "settings")

	  var dropdownArea = settings
	    .append("div")
	    .attr("id", "dropdown-area")


	  var dropdownLabel = dropdownArea
	    .append("label")
	    .html("Data range: ")
	    .attr("id", "dropdown-label")

	  var dropdown = dropdownArea
	    .append("select")
	    .attr("id", "dropdown-list")
	    .on("change", function(){
	      updateChart(this.value, false)
	    })

	  var setOptionList = function(_winSize){
	    winSize = _winSize
	    divNum = Math.ceil(dataLen / winSize)
	    optionList = [...Array(divNum).keys()]
	  }

	  setOptionList(winSize)
	  

	  var options = dropdown.selectAll("option")
	    .data(optionList)
	    .enter()
	    .append("option")

	  var setOptionText = function(targetOptions){
	    targetOptions.text(function(groupId){
	      var start = groupId*winSize+1
	      var end = (groupId+1)*winSize

	      if (groupId == divNum - 1) { // the last group
	        end = dataLen
	      }

	      return start.toString()+ "~" + end.toString()
	    })
	    .attr("value", function(groupId){
	      return groupId
	    })
	  }
	  setOptionText(options)
	  
	  updateChart(0, true) // initialize the bar chart 

	  var inputBinArea = d3.select("#settings")
	    .append("div")
	    .attr("id", "input-bin-area")

	  var inputBinLabel = inputBinArea
	      .append("label")
	      .html("Number of bins: ")
	      .attr("id", "input-bin-label")

	  var inputBinNum = inputBinArea
	    .append("input")
	    .attr("type", "number")
	    .attr("min", 10)
	    .attr("max", 50)
	    .attr("step", 10)
	    .attr("value", 50)
	    .attr("id", "num-bins")

	  d3.select("#num-bins").on("input", function() {
	    winSize = +this.value
	    setOptionList(winSize)
	    
	    var updatedOptions = dropdown.selectAll("option")
	      .data(optionList)

	    updatedOptions
	      .exit()
	      .remove()

	    updatedOptions
	      .enter()
	      .append("option")

	    var currDropDownVal = d3.select("#dropdown-list").node().value

	    setOptionText(updatedOptions)
	    updateChart(currDropDownVal, false)
	  });

	  // Draw legend
	  var legend = svg.selectAll(".legend")
	    .data(colors)
	    .enter().append("g")
	    .attr("class", "legend")
	    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
	   
	  legend.append("rect")
	    .attr("x", width)
	    .attr("width", 18)
	    .attr("height", 18)
	    .style("fill", function(d, i) {return colors.slice().reverse()[i];});
	   
	  legend.append("text")
	    .attr("x", width + 25)
	    .attr("y", 9)
	    .attr("dy", ".35em")
	    .style("text-anchor", "start")
	    .text(function(d, i) { 
	      switch (i) {
	        case 0: return "國文";
	        case 1: return "英文";
	        case 2: return "法文";
	        case 3: return "德文";
	        case 4: return "日文";
	      }
	  });

	  // Prep the tooltip bits, initial display is hidden
	  var tooltip = svg.append("g")
	    .attr("class", "tooltip")
	    .style("display", "none");
	      
	  tooltip.append("rect")
	    .attr("x", 30)
	    .attr("width", 60)
	    .attr("height", 80)
	    .attr("fill", "white")
	    .style("opacity", 0.5);

	  tooltip.append("text")
	    .attr("x", 60)
	    .attr("dy", "1.2em")
	    .style("text-anchor", "middle")
	    .style("letter-spacing", "1px")
	    .attr("font-size", "20px")
	    .attr("font-weight", "bold");

	  tooltip.append("text")
	    .attr("x", 60)
	    .attr("dy", "2.4em")
	    .attr("id", "type1")
	    .style("text-anchor", "middle")
	    .style("letter-spacing", "1px")
	    .attr("font-size", "20px")
	    .attr("font-weight", "bold");

	  tooltip.append("text")
	    .attr("x", 60)
	    .attr("dy", "3.6em")
	    .attr("id", "type2")
	    .style("text-anchor", "middle")
	    .style("letter-spacing", "1px")
	    .attr("font-size", "20px")
	    .attr("font-weight", "bold");
	})
};
