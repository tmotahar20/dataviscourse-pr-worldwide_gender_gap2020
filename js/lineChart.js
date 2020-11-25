class lineChart{

	constructor(data){
	this.data = data;
	this.nameArray = data["literacy_women"].map(d => d.Country_Code);
    this.nameArrayMale = data["literacy_men"].map(d => d.Country_Code);

	}

	drawPlot(country_region,data){
		try{
		let that = this;
		let indicatorSelected = this.findIndicator();
        let indicatorData_women = this.data[indicatorSelected+"_women"];
		let indicatorData_men = this.data[indicatorSelected+"_men"];
		this.nameArray = data[indicatorSelected+"_women"].map(d => d.Country_Code);
        this.nameArrayMale = data[indicatorSelected+"_men"].map(d => d.Country_Code);
        var tooltip = d3.select("#linechart").append("div").attr("class", "tooltip");

		let margin = {top: 40, right: 40, bottom: 40, left: 40},
		    width = 1250 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;

		let x = d3.scaleTime()
    	.domain([new Date(2000, 0, 1), new Date(2017, 0, 1)])
		    .range([0, width]);

		let y = d3.scaleLinear()
			.domain([0,100])
		    .range([height, 0]);

		d3.select("#men-line").remove();
		d3.select("#lineChartSVG").remove();

		let svg = d3.select("#linechart").append("svg").attr("id","lineChartSVG")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
			.append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("g")
		    .attr("class", "x_axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(d3.axisBottom(x)
		    	.tickFormat(d3.timeFormat("%Y"))
		    	.ticks(d3.timeYear)
		    	)
		    .selectAll("text")
		    .attr("y", 0)
    		.attr("x", -20)
    		.attr("dy", ".35em")
		    .attr("transform", "rotate(-90)");

		svg.append("g").attr("class", "y_axis").call(d3.axisLeft(y));

		let index = this.nameArrayMale.indexOf(country_region);
		let country_data = indicatorData_men[index];
		let plotData = [];
		let plotDataItem = [];
		for(let i=2000;i<2020;i++){
			let yr_csv = "yr_" + i;
			let value = country_data[yr_csv];
			plotDataItem = [];
			plotDataItem.push(x(new Date(i, 0, 1)));
			if(value == "")
				plotDataItem.push(null);
			else
				plotDataItem.push(y(parseFloat(value)));
			plotDataItem.push(i);
			plotDataItem.push(parseFloat(value).toFixed(2));
			plotData.push(plotDataItem)
		}

		var line = d3.line().defined(function (d) { return d[1] !== null; });


  		var filteredData = plotData.filter(line.defined());
  		d3.select("#men-line").remove();
  		d3.select('#lineChartSVG')
  			.append("path")
  			.attr("id","men_line")
  			.attr('d', line(filteredData))
  			.attr("class", "line")
  			.style("opacity",1)
  			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		let points = plotData.filter(d=>d[1]!=null);
		d3.select("#lineChartSVG")
			.selectAll("circle")	
			.data(points)
			.enter()		  			
  			.append("circle")
  			.on("mouseover",function(d){
                let y = d[2];
                let z = d[3];
                tooltip
                .style("visibility","visible")
                .html(country_region+"</br>"+"Year: "+y+"</br>" + " Men " + indicatorSelected+": "+ d[3]+ "%");
            })
            .on("mouseout", function(d) {
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function(d) {
                tooltip
                .style("top", (d3.event.pageY - 20) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
            })
  			.attr("r",3)
  			.attr("class","dot")
  			.attr("cx",function(d){return d[0]})
  			.attr("cy",function(d){return d[1]})
  			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		let g = svg.append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		index = this.nameArray.indexOf(country_region);
		country_data = indicatorData_women[index];
		plotData = [];
		plotDataItem = [];
		for(let i=2000;i<2020;i++){
			let yr_csv = "yr_" + i;
			let value = country_data[yr_csv];
			plotDataItem = [];
			plotDataItem.push(x(new Date(i, 0, 1)));
			if(value == "")
				plotDataItem.push(0);
			else
				plotDataItem.push(y(parseFloat(value)));
			plotDataItem.push(i);
			plotDataItem.push(parseFloat(value).toFixed(2));
			plotData.push(plotDataItem)
		}

		let bars = g.selectAll("rect")
					.data(plotData);

		bars.enter()
			.append("rect")
			.attr("class",country_region)
			.attr("id","rectg")
			.style("fill","steelblue")
			.on("mouseover",function(d){
                let x = indicatorData_women[that.nameArray.indexOf(country_region)]["Country_Name"];
                let y = d[2];
                let z = d[3];
                tooltip
                .style("visibility","visible")
                .html("Country/Region: "+x+"</br>"+"Year: "+y+"</br>" + indicatorSelected+" : "+d[3]+"%");
            })
            .on("mouseout", function(d) {
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function(d) {
                tooltip
                .style("top", (d3.event.pageY - 20) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
            }) 
			.attr("x",function(d){return d[0]-47;})
            .attr("y",function(d){return d[1]-40;})
			.attr("width",14)
            .attr("height",function(d){
            	if(d[1]==0)
            		return 0;
            	else
            		return 420 - d[1]});


					
}//try
catch(err){}
	}



findIndicator(){
	let selectValue = d3.select('select').property('value');
	switch(selectValue){
		case "Education(%)":
			return "literacy";
		case "Wages(%)":
			return "employment";
		case "Land Ownership(%)":
			return "indicator3";
	}
}
}
