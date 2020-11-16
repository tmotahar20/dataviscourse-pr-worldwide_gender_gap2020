class Sunburst{

	constructor(){
	}

	drawSunburst(lineObj){

      let that = this;
      this.lineObject = lineObj;
		  let width = 600;
		  let height = 400;
		  let radius = Math.min(width, height) / 2;
		  let centerRadius = 0.4 * radius;
		  let backCircleRadius = 0.1 * radius;

		  let data = this.jsonData();
      var tooltip = d3.select("#worldmap").append("div").attr("class", "tooltip");

		  let svg = d3.select("#sunburst").append("svg").attr("width", width).attr("height", height);
		  let g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

		  let colorScale = d3.scaleOrdinal().range([
        "#A93226","#8E44AD","#5DADE2","#48C9B0","#F7DC6F","#DC7633","#5D6D7E"
		  ]);
		  
		  let xScale = d3.scaleLinear().range([0, 2 * Math.PI]);
		  let rScale = d3.scaleLinear().range([0.4 * radius, radius]);

		
		  let root = d3.hierarchy(data);
		  root.sum(function(d) { return d.value; })
		    .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

		  let partition = d3.partition();
		  partition(root);

		
		  let arc = d3.arc()
		    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))); })
		    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))); })
		    .innerRadius(function(d) { return Math.max(0, rScale(d.y0)); })
		    .outerRadius(function(d) { return Math.max(0, rScale(d.y1)); });

		  g.selectAll("path")
		    .data(root.descendants())
		    .enter()
		    .append("path")
        .attr("id", function(d){return d.data.name})
        .attr("class","sunburst_nodes")
		    .attr("d", arc)
		    .attr('stroke', '#fff')
		    .attr("fill", function(d) {
		      while(d.depth > 1) d = d.parent;
		      if(d.depth == 0) return "lightgray";
		      return colorScale(d.value);
		    })
		    .attr("opacity", 1)
		    .on("click", click)
        .on("mouseover",function(d){
                tooltip
                .style("visibility","visible")
                .html(d.data.tooltip_name);                
            })
            .on("mouseout", function(d) {
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function(d) {
                tooltip
                .style("top", (d3.event.pageY - 20) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
            });

		  g.selectAll("text")
		    .data(root.descendants())
		    .enter()
		    .append("text")
		    .attr("fill", "black")
		    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
		    .attr("dy", "5px")
		    .attr("font", "10px")
		    .attr("text-anchor", "middle")
		    .on("click", click)
		    .text(function(d) { return d.data.name; })
		    .style('font-size','8px');

      
		
		  function click(d) {
		  	try{
		    let tween = g.transition()
		      .duration(500)
		      .tween("scale", function() {
		        let xdomain = d3.interpolate(xScale.domain(), [d.x0, d.x1]);
		        let ydomain = d3.interpolate(rScale.domain(), [d.y0, 1]);
		        let yrange = d3.interpolate(rScale.range(), [d.y0 ? backCircleRadius : centerRadius, radius]);
		        return function(t) {
		          xScale.domain(xdomain(t));
		          rScale.domain(ydomain(t)).range(yrange(t));
		        };
		      });

		    tween.selectAll("path")
		      .attrTween("d", function(d) {
		        return function() {
		          return arc(d);
		        };
		      });

		    tween.selectAll("text").attrTween("transform", function(d) {
		        return function() {
		          return "translate(" + arc.centroid(d) + ")";
		        };
		      })
		      .attrTween("opacity", function(d) {
		        return function() {
		          return(xScale(d.x0) < 2 * Math.PI) && (xScale(d.x1) > 0.0) && (rScale(d.y1) > 0.0) ? 1.0 : 0;
		        };
		      })
		      .attrTween("font", function(d) {
		        return function() {
		          return(xScale(d.x0) < 2 * Math.PI) && (xScale(d.x1) > 0.0) && (rScale(d.y1) > 0.0) ? "10px" : 1e-6;
		        };
		      });
          let class_id = d3.select(this).property('id');
          if(class_id != "WORLD"){

            if(event.bubbles){          
					  lineObj.drawPlot(class_id);
			console.log(class_id);	  
		   
              
        }
        } 

    }//try
    catch(err){
    	
    }
		  }

	}

	jsonData(){

     let regions = {"name": "WORLD", "tooltip_name":"World",
    "children": [
      { "name": "EAS", "tooltip_name":"East Asia & Pacific", 
        "children": [{"tooltip_name":"American Samoa","name":"ASM","value": 0.5},{"tooltip_name":"Australia","name":"AUS","value": 0.5},{"tooltip_name":"Brunei Darussalam","name":"BRN","value": 0.5},{"tooltip_name":"China","name":"CHN","value": 0.5},{"tooltip_name":"Fiji","name":"FJI","value": 0.5},{"tooltip_name":"Micronesia, Fed. Sts.","name":"FSM","value": 0.5},{"tooltip_name":"Guam","name":"GUM","value": 0.5},{"tooltip_name":"Hong Kong SAR, China","name":"HKG","value": 0.5},{"tooltip_name":"Indonesia","name":"IDN","value": 0.5},{"tooltip_name":"Japan","name":"JPN","value": 0.5},{"tooltip_name":"Cambodia","name":"KHM","value": 0.5},{"tooltip_name":"Kiribati","name":"KIR","value": 0.5},{"tooltip_name":"Korea, Rep.","name":"KOR","value": 0.5},{"tooltip_name":"Lao PDR","name":"LAO","value": 0.5},{"tooltip_name":"Macao SAR, China","name":"MAC","value": 0.5},{"tooltip_name":"Marshall Islands","name":"MHL","value": 0.5},{"tooltip_name":"Myanmar","name":"MMR","value": 0.5},{"tooltip_name":"Mongolia","name":"MNG","value": 0.5},{"tooltip_name":"Northern Mariana Islands","name":"MNP","value": 0.5},{"tooltip_name":"Malaysia","name":"MYS","value": 0.5},{"tooltip_name":"New Caledonia","name":"NCL","value": 0.5},{"tooltip_name":"New Zealand","name":"NZL","value": 0.5},{"tooltip_name":"Philippines","name":"PHL","value": 0.5},{"tooltip_name":"Palau","name":"PLW","value": 0.5},{"tooltip_name":"Papua New Guinea","name":"PNG","value": 0.5},{"tooltip_name":"Korea, Dem. People�s Rep.","name":"PRK","value": 0.5},{"tooltip_name":"French Polynesia","name":"PYF","value": 0.5},{"tooltip_name":"Singapore","name":"SGP","value": 0.5},{"tooltip_name":"Solomon Islands","name":"SLB","value": 0.5},{"tooltip_name":"Thailand","name":"THA","value": 0.5},{"tooltip_name":"Timor-Leste","name":"TLS","value": 0.5},{"tooltip_name":"Tonga","name":"TON","value": 0.5},{"tooltip_name":"Tuvalu","name":"TUV","value": 0.5},{"tooltip_name":"Vietnam","name":"VNM","value": 0.5},{"tooltip_name":"Vanuatu","name":"VUT","value": 0.5},{"tooltip_name":"Samoa","name":"WSM","value": 0.5}]
      },
      {
        "name": "ECS", "tooltip_name": "Europe & Central Asia",
        "children": [{"tooltip_name":"Albania","name":"ALB","value":0.5},{"tooltip_name":"Andorra","name":"AND","value":0.5},{"tooltip_name":"Armenia","name":"ARM","value":0.5},{"tooltip_name":"Austria","name":"AUT","value":0.5},{"tooltip_name":"Azerbaijan","name":"AZE","value":0.5},{"tooltip_name":"Belgium","name":"BEL","value":0.5},{"tooltip_name":"Bulgaria","name":"BGR","value":0.5},{"tooltip_name":"Bosnia and Herzegovina","name":"BIH","value":0.5},{"tooltip_name":"Belarus","name":"BLR","value":0.5},{"tooltip_name":"Switzerland","name":"CHE","value":0.5},{"tooltip_name":"Channel Islands","name":"CHI","value":0.5},{"tooltip_name":"Cyprus","name":"CYP","value":0.5},{"tooltip_name":"Czech Republic","name":"CZE","value":0.5},{"tooltip_name":"Germany","name":"DEU","value":0.5},{"tooltip_name":"Denmark","name":"DNK","value":0.5},{"tooltip_name":"Spain","name":"ESP","value":0.5},{"tooltip_name":"Estonia","name":"EST","value":0.5},{"tooltip_name":"Finland","name":"FIN","value":0.5},{"tooltip_name":"France","name":"FRA","value":0.5},{"tooltip_name":"Faroe Islands","name":"FRO","value":0.5},{"tooltip_name":"United Kingdom","name":"GBR","value":0.5},{"tooltip_name":"Georgia","name":"GEO","value":0.5},{"tooltip_name":"Greece","name":"GRC","value":0.5},{"tooltip_name":"Greenland","name":"GRL","value":0.5},{"tooltip_name":"Croatia","name":"HRV","value":0.5},{"tooltip_name":"Hungary","name":"HUN","value":0.5},{"tooltip_name":"Isle of Man","name":"IMN","value":0.5},{"tooltip_name":"Ireland","name":"IRL","value":0.5},{"tooltip_name":"Iceland","name":"ISL","value":0.5},{"tooltip_name":"Italy","name":"ITA","value":0.5},{"tooltip_name":"Kazakhstan","name":"KAZ","value":0.5},{"tooltip_name":"Kyrgyz Republic","name":"KGZ","value":0.5},{"tooltip_name":"Liechtenstein","name":"LIE","value":0.5},{"tooltip_name":"Lithuania","name":"LTU","value":0.5},{"tooltip_name":"Luxembourg","name":"LUX","value":0.5},{"tooltip_name":"Latvia","name":"LVA","value":0.5},{"tooltip_name":"Monaco","name":"MCO","value":0.5},{"tooltip_name":"Moldova","name":"MDA","value":0.5},{"tooltip_name":"Macedonia, FYR","name":"MKD","value":0.5},{"tooltip_name":"Montenegro","name":"MNE","value":0.5},{"tooltip_name":"Netherlands","name":"NLD","value":0.5},{"tooltip_name":"Norway","name":"NOR","value":0.5},{"tooltip_name":"Poland","name":"POL","value":0.5},{"tooltip_name":"Portugal","name":"PRT","value":0.5},{"tooltip_name":"Romania","name":"ROU","value":0.5},{"tooltip_name":"Russian Federation","name":"RUS","value":0.5},{"tooltip_name":"San Marino","name":"SMR","value":0.5},{"tooltip_name":"Serbia","name":"SRB","value":0.5},{"tooltip_name":"Slovak Republic","name":"SVK","value":0.5},{"tooltip_name":"Slovenia","name":"SVN","value":0.5},{"tooltip_name":"Sweden","name":"SWE","value":0.5},{"tooltip_name":"Tajikistan","name":"TJK","value":0.5},{"tooltip_name":"Turkmenistan","name":"TKM","value":0.5},{"tooltip_name":"Turkey","name":"TUR","value":0.5},{"tooltip_name":"Ukraine","name":"UKR","value":0.5},{"tooltip_name":"Uzbekistan","name":"UZB","value":0.5},{"tooltip_name":"Kosovo","name":"XKX","value":0.5}]
      },
      { "name": "LCN", "tooltip_name": "Latin America & Carribean",
        "children": [{"tooltip_name":"Aruba","name":"ABW","value": 0.5},{"tooltip_name":"Argentina","name":"ARG","value": 0.5},{"tooltip_name":"Antigua and Barbuda","name":"ATG","value": 0.5},{"tooltip_name":"Bahamas, The","name":"BHS","value": 0.5},{"tooltip_name":"Belize","name":"BLZ","value": 0.5},{"tooltip_name":"Bolivia","name":"BOL","value": 0.5},{"tooltip_name":"Brazil","name":"BRA","value": 0.5},{"tooltip_name":"Barbados","name":"BRB","value": 0.5},{"tooltip_name":"Chile","name":"CHL","value": 0.5},{"tooltip_name":"Colombia","name":"COL","value": 0.5},{"tooltip_name":"Costa Rica","name":"CRI","value": 0.5},{"tooltip_name":"Cuba","name":"CUB","value": 0.5},{"tooltip_name":"Curacao","name":"CUW","value": 0.5},{"tooltip_name":"Cayman Islands","name":"CYM","value": 0.5},{"tooltip_name":"Dominica","name":"DMA","value": 0.5},{"tooltip_name":"Dominican Republic","name":"DOM","value": 0.5},{"tooltip_name":"Ecuador","name":"ECU","value": 0.5},{"tooltip_name":"Grenada","name":"GRD","value": 0.5},{"tooltip_name":"Guatemala","name":"GTM","value": 0.5},{"tooltip_name":"Guyana","name":"GUY","value": 0.5},{"tooltip_name":"Honduras","name":"HND","value": 0.5},{"tooltip_name":"Haiti","name":"HTI","value": 0.5},{"tooltip_name":"Jamaica","name":"JAM","value": 0.5},{"tooltip_name":"St. Kitts and Nevis","name":"KNA","value": 0.5},{"tooltip_name":"St. Lucia","name":"LCA","value": 0.5},{"tooltip_name":"St. Martin (French part)","name":"MAF","value": 0.5},{"tooltip_name":"Mexico","name":"MEX","value": 0.5},{"tooltip_name":"Nicaragua","name":"NIC","value": 0.5},{"tooltip_name":"Panama","name":"PAN","value": 0.5},{"tooltip_name":"Peru","name":"PER","value": 0.5},{"tooltip_name":"Puerto Rico","name":"PRI","value": 0.5},{"tooltip_name":"Paraguay","name":"PRY","value": 0.5},{"tooltip_name":"El Salvador","name":"SLV","value": 0.5},{"tooltip_name":"Suriname","name":"SUR","value": 0.5},{"tooltip_name":"Sint Maarten (Dutch part)","name":"SXM","value": 0.5},{"tooltip_name":"Turks and Caicos Islands","name":"TCA","value": 0.5},{"tooltip_name":"Trinidad and Tobago","name":"TTO","value": 0.5},{"tooltip_name":"Uruguay","name":"URY","value": 0.5},{"tooltip_name":"St. Vincent and the Grenadines","name":"VCT","value": 0.5},{"tooltip_name":"Venezuela, RB","name":"VEN","value": 0.5},{"tooltip_name":"Virgin Islands (U.S.)","name":"VIR","value": 0.5}]
      },
      {
        "name": "MEA", "tooltip_name":"Middle East & North Africa",
        "children": [{"tooltip_name":"United Arab Emirates","name":"ARE","value": 0.5},{"tooltip_name":"Bahrain","name":"BHR","value": 0.5},{"tooltip_name":"Djibouti","name":"DJI","value": 0.5},{"tooltip_name":"Algeria","name":"DZA","value": 0.5},{"tooltip_name":"Egypt, Arab Rep.","name":"EGY","value": 0.5},{"tooltip_name":"Iran, Islamic Rep.","name":"IRN","value": 0.5},{"tooltip_name":"Iraq","name":"IRQ","value": 0.5},{"tooltip_name":"Israel","name":"ISR","value": 0.5},{"tooltip_name":"Jordan","name":"JOR","value": 0.5},{"tooltip_name":"Kuwait","name":"KWT","value": 0.5},{"tooltip_name":"Lebanon","name":"LBN","value": 0.5},{"tooltip_name":"Libya","name":"LBY","value": 0.5},{"tooltip_name":"Morocco","name":"MAR","value": 0.5},{"tooltip_name":"Malta","name":"MLT","value": 0.5},{"tooltip_name":"Oman","name":"OMN","value": 0.5},{"tooltip_name":"West Bank and Gaza","name":"PSE","value": 0.5},{"tooltip_name":"Qatar","name":"QAT","value": 0.5},{"tooltip_name":"Saudi Arabia","name":"SAU","value": 0.5},{"tooltip_name":"Syrian Arab Republic","name":"SYR","value": 0.5},{"tooltip_name":"Tunisia","name":"TUN","value": 0.5},{"tooltip_name":"Yemen, Rep.","name":"YEM","value": 0.5}]
      },
      { "name": "NAC", "tooltip_name":"North America", 
        "children": [{"tooltip_name":"Bermuda","name":"BMU","value":0.5},{"tooltip_name":"Canada","name":"CAN","value":0.5},{"tooltip_name":"United States","name":"USA","value":0.5}]
      },
      { "name": "SAS", "tooltip_name":"South Asia", 
        "children": [{"tooltip_name":"Afghanistan","name":"AFG","value": 0.5},{"tooltip_name":"Bangladesh","name":"BGD","value": 0.5},{"tooltip_name":"Bhutan","name":"BTN","value": 0.5},{"tooltip_name":"India","name":"IND","value": 0.5},{"tooltip_name":"Sri Lanka","name":"LKA","value": 0.5},{"tooltip_name":"Maldives","name":"MDV","value": 0.5},{"tooltip_name":"Nepal","name":"NPL","value": 0.5},{"tooltip_name":"Pakistan","name":"PAK","value": 0.5}]
      },
      { "name": "SSF", "tooltip_name":"Sub-Saharan Africa", 
        "children": [{"tooltip_name":"Angola","name":"AGO","value":0.5},{"tooltip_name":"Burundi","name":"BDI","value":0.5},{"tooltip_name":"Benin","name":"BEN","value":0.5},{"tooltip_name":"Burkina Faso","name":"BFA","value":0.5},{"tooltip_name":"Botswana","name":"BWA","value":0.5},{"tooltip_name":"Central African Republic","name":"CAF","value":0.5},{"tooltip_name":"Cote d'Ivoire","name":"CIV","value":0.5},{"tooltip_name":"Cameroon","name":"CMR","value":0.5},{"tooltip_name":"Congo, Dem. Rep.","name":"COD","value":0.5},{"tooltip_name":"Congo, Rep.","name":"COG","value":0.5},{"tooltip_name":"Comoros","name":"COM","value":0.5},{"tooltip_name":"Cabo Verde","name":"CPV","value":0.5},{"tooltip_name":"Eritrea","name":"ERI","value":0.5},{"tooltip_name":"Ethiopia","name":"ETH","value":0.5},{"tooltip_name":"Gabon","name":"GAB","value":0.5},{"tooltip_name":"Ghana","name":"GHA","value":0.5},{"tooltip_name":"Guinea","name":"GIN","value":0.5},{"tooltip_name":"Gambia, The","name":"GMB","value":0.5},{"tooltip_name":"Guinea-Bissau","name":"GNB","value":0.5},{"tooltip_name":"Equatorial Guinea","name":"GNQ","value":0.5},{"tooltip_name":"Kenya","name":"KEN","value":0.5},{"tooltip_name":"Liberia","name":"LBR","value":0.5},{"tooltip_name":"Lesotho","name":"LSO","value":0.5},{"tooltip_name":"Madagascar","name":"MDG","value":0.5},{"tooltip_name":"Mali","name":"MLI","value":0.5},{"tooltip_name":"Mozambique","name":"MOZ","value":0.5},{"tooltip_name":"Mauritania","name":"MRT","value":0.5},{"tooltip_name":"Mauritius","name":"MUS","value":0.5},{"tooltip_name":"Malawi","name":"MWI","value":0.5},{"tooltip_name":"Namibia","name":"NAM","value":0.5},{"tooltip_name":"Niger","name":"NER","value":0.5},{"tooltip_name":"Nigeria","name":"NGA","value":0.5},{"tooltip_name":"Rwanda","name":"RWA","value":0.5},{"tooltip_name":"Sudan","name":"SDN","value":0.5},{"tooltip_name":"Senegal","name":"SEN","value":0.5},{"tooltip_name":"Sierra Leone","name":"SLE","value":0.5},{"tooltip_name":"Somalia","name":"SOM","value":0.5},{"tooltip_name":"South Sudan","name":"SSD","value":0.5},{"tooltip_name":"Sao Tome and Principe","name":"STP","value":0.5},{"tooltip_name":"Swaziland","name":"SWZ","value":0.5},{"tooltip_name":"Seychelles","name":"SYC","value":0.5},{"tooltip_name":"Chad","name":"TCD","value":0.5},{"tooltip_name":"Togo","name":"TGO","value":0.5},{"tooltip_name":"Tanzania","name":"TZA","value":0.5},{"tooltip_name":"Uganda","name":"UGA","value":0.5},{"tooltip_name":"South Africa","name":"ZAF","value":0.5},{"tooltip_name":"Zambia","name":"ZMB","value":0.5},{"tooltip_name":"Zimbabwe","name":"ZWE","value":0.5}]
       }
    ]}
    return regions;
  } 
}
