class heatmap{

    constructor(data){
      this.data = data;
      this.nameArray = data["literacy_women"].map(d => d.Country_Code);

    }


    drawLegend(){
      let color = d3.scaleQuantize()
                    .domain([1, 100])
                    .range(d3.schemeYlGnBu[9]);

            let x = d3.scaleLinear()
                    .domain(d3.extent(color.domain()))
                    .rangeRound([650, 900]);

            let format = d3.format("");

            let gg = d3.select("#maplegend").append("svg").attr("id","#leg_svg").attr("width",1200).attr("height",40).append("g")
                    .attr("transform", "translate(-100,0)");

        gg.selectAll("rect")
          .data(color.range().map(d => color.invertExtent(d)))
          .enter()
          .append("rect")
          .attr("height", 15)
          .attr("x", d => x(d[0]))
          .attr("width", d => x(d[1]) - x(d[0]))
          .attr("fill", d => color(d[0]));


        gg.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(format)
        .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))
        .select(".domain")
        .remove();
    }
  

    plotheat_country(data) {
      
      let indicatorSelected = this.findIndicator();
      if (indicatorSelected == undefined){
        indicatorSelected="literacy";
      }
      let indicatorData = this.data[indicatorSelected+"_women"];
      this.nameArray = data[indicatorSelected+"_women"].map(d => d.Country_Code);


            d3.select("#allcells").remove();
            var tooltip = d3.select("#heatmap").append("div").attr("class", "tooltip");
            let that =this;
            let years = [];
            let year_axes = [];
            let country_codes = ["ABW","AFG","AGO","ALB","AND","ARE","ARG","ARM","ASM","ATG","AUS","AUT","AZE","BDI","BEL","BEN","BFA","BGD","BGR","BHR","BHS","BIH","BLR","BLZ","BMU","BOL","BRA","BRB","BRN","BTN","BWA","CAF","CAN","CHE","CHI","CHL","CHN","CIV","CMR","COD","COG","COL","COM","CPV","CRI","CUB","CUW","CYM","CYP","CZE","DEU","DJI","DMA","DNK","DOM","DZA","ECU","EGY","ERI","ESP","EST","ETH","FIN","FJI","FRA","FRO","FSM","GAB","GBR","GEO","GHA","GIN","GMB","GNB","GNQ","GRC","GRD","GRL","GTM","GUM","GUY","HKG","HND","HRV","HTI","HUN","IDN","IMN","IND","IRL","IRN","IRQ","ISL","ISR","ITA","JAM","JOR","JPN","KAZ","KEN","KGZ","KHM","KIR","KNA","KOR","KWT","LAO","LBN","LBR","LBY","LCA","LIE","LKA","LSO","LTU","LUX","LVA","MAC","MAF","MAR","MCO","MDA","MDG","MDV","MEX","MHL","MKD","MLI","MLT","MMR","MNE","MNG","MNP","MOZ","MRT","MUS","MWI","MYS","NAM","NCL","NER","NGA","NIC","NLD","NOR","NPL","NZL","OMN","PAK","PAN","PER","PHL","PLW","PNG","POL","PRI","PRK","PRT","PRY","PSE","PYF","QAT","ROU","RUS","RWA","SAU","SDN","SEN","SGP","SLB","SLE","SLV","SMR","SOM","SRB","SSD","STP","SUR","SVK","SVN","SWE","SWZ","SXM","SYC","SYR","TCA","TCD","TGO","THA","TJK","TKM","TLS","TON","TTO","TUN","TUR","TUV","TZA","UGA","UKR","URY","USA","UZB","VCT","VEN","VIR","VNM","VUT","WSM","XKX","YEM","ZAF","ZMB","ZWE"];
            let country_axes = ["Aruba","Afghanistan","Angola","Albania","Andorra","United Arab Emirates","Argentina","Armenia","American Samoa","Antigua and Barbuda","Australia","Austria","Azerbaijan","Burundi","Belgium","Benin","Burkina Faso","Bangladesh","Bulgaria","Bahrain","Bahamas, The","Bosnia and Herzegovina","Belarus","Belize","Bermuda","Bolivia","Brazil","Barbados","Brunei Darussalam","Bhutan","Botswana","Central African Republic","Canada","Switzerland","Channel Islands","Chile","China","Cote d'Ivoire","Cameroon","Congo, Dem. Rep.","Congo, Rep.","Colombia","Comoros","Cabo Verde","Costa Rica","Cuba","Curacao","Cayman Islands","Cyprus","Czech Republic","Germany","Djibouti","Dominica","Denmark","Dominican Republic","Algeria","Ecuador","Egypt, Arab Rep.","Eritrea","Spain","Estonia","Ethiopia","Finland","Fiji","France","Faroe Islands","Micronesia, Fed. Sts.","Gabon","United Kingdom","Georgia","Ghana","Guinea","Gambia, The","Guinea-Bissau","Equatorial Guinea","Greece","Grenada","Greenland","Guatemala","Guam","Guyana","Hong Kong SAR, China","Honduras","Croatia","Haiti","Hungary","Indonesia","Isle of Man","India","Ireland","Iran, Islamic Rep.","Iraq","Iceland","Israel","Italy","Jamaica","Jordan","Japan","Kazakhstan","Kenya","Kyrgyz Republic","Cambodia","Kiribati","St. Kitts and Nevis","Korea, Rep.","Kuwait","Lao PDR","Lebanon","Liberia","Libya","St. Lucia","Liechtenstein","Sri Lanka","Lesotho","Lithuania","Luxembourg","Latvia","Macao SAR, China","St. Martin (French part)","Morocco","Monaco","Moldova","Madagascar","Maldives","Mexico","Marshall Islands","Macedonia, FYR","Mali","Malta","Myanmar","Montenegro","Mongolia","Northern Mariana Islands","Mozambique","Mauritania","Mauritius","Malawi","Malaysia","Namibia","New Caledonia","Niger","Nigeria","Nicaragua","Netherlands","Norway","Nepal","New Zealand","Oman","Pakistan","Panama","Peru","Philippines","Palau","Papua New Guinea","Poland","Puerto Rico","Korea, Dem. People’s Rep.","Portugal","Paraguay","West Bank and Gaza","French Polynesia","Qatar","Romania","Russian Federation","Rwanda","Saudi Arabia","Sudan","Senegal","Singapore","Solomon Islands","Sierra Leone","El Salvador","San Marino","Somalia","Serbia","South Sudan","Sao Tome and Principe","Suriname","Slovak Republic","Slovenia","Sweden","Swaziland","Sint Maarten (Dutch part)","Seychelles","Syrian Arab Republic","Turks and Caicos Islands","Chad","Togo","Thailand","Tajikistan","Turkmenistan","Timor-Leste","Tonga","Trinidad and Tobago","Tunisia","Turkey","Tuvalu","Tanzania","Uganda","Ukraine","Uruguay","United States","Uzbekistan","St. Vincent and the Grenadines","Venezuela, RB","Virgin Islands (U.S.)","Vietnam","Vanuatu","Samoa","Kosovo","Yemen, Rep.","South Africa","Zambia","Zimbabwe"];
            
            let index1 =0;
            let index2 =2;
            for(let i =2000; i<2018; i++){
              years[index1++] = "yr_"+i;
              year_axes[index2++] = i;
            }
         

            var n = country_codes.length; 
            var m = years.length; 
            var matrix = new Array(n);
            for(var i = 0; i < n; i++) {
              matrix[i] = new Array(m);
              let index = that.nameArray.indexOf(country_codes[i]);
              for(var j = 0; j < m; j++) {
                if(indicatorData[index][years[j]]!="")
                  matrix[i][j] = parseFloat(indicatorData[index][years[j]]);
                else 
                  matrix[i][j] = 0;
              }
            }
            var width = (20*m)+50; 
            var height = (20*n)+50; 
            var gridSize = 20;

            var svg = d3.select("#heatmap").append("svg").attr("id","allcells").attr("width", width).attr("height", height).attr("transform","translate(150, 50)");
            let g = svg.append("g").attr("transform", "translate(" + 0 + "," + 0 + ")");


            var scaleRow = d3.scaleBand().rangeRound([50, height]).domain(d3.range(n));
            var scaleCol = d3.scaleBand().rangeRound([50, width]).domain(d3.range(m));

            var timeLabels = svg.selectAll(".timeLabel")
            .data(year_axes)
            .enter()
            .append("text")
            .attr("class","timeLabel")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", function(d,i){
              let x = i *gridSize + 20;
              return "rotate(-90,"+ x +",0)";});

            svg.selectAll(".countryLabel")
            .data(country_codes)
            .enter()
            .append("text")
            .attr("class","countryLabel")
            .text(function(d) { return d; })
            .on("mouseover",function(d,i){
  
                tooltip
                .style("visibility","visible")
                .html(country_axes[i]);
                
              })
              .on("mouseout", function(d) {
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function(d) {
                tooltip
                .style("top", (d3.event.pageY - 20) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
            })
            .attr("x", 0)
            .attr("y", function(d, i) { return i * gridSize; })
            .style("text-anchor", "middle")
            .attr("transform","translate(20,70)");

             let color = d3.scaleQuantize()
                    .domain([1, 100])
                    .range(d3.schemeYlGnBu[9]);
        var tooltip = d3.select("#heatmap").append("div").attr("class", "tooltip");

            g.selectAll(".row")
              .data(matrix)
              .enter()
              .append("g")
              .attr("class", "row")
              .attr("transform", function(d, i) { return "translate(0," + scaleRow(i) + ")"; })
              .selectAll(".cell")
              .data(function(d) { return d })
              .enter()
              .append("rect")
              .on("mouseover",function(d,i){
                if(d!=0){
                  let x = year_axes[i]+2;
                tooltip
                .style("visibility","visible")
                .html("Year: "+ x+"</br>" +parseFloat(d).toFixed(2)+"%");
                }
              })
              .on("mouseout", function(d) {
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function(d) {
                tooltip
                .style("top", (d3.event.pageY - 20) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
            })
              .attr("class", "cell")
              .attr("x", function(d, i) { return scaleCol(i); })
              .attr("width", scaleCol.bandwidth())
              .attr("height", scaleRow.bandwidth())
              .attr("opacity", 0.9)
              .attr("fill", function(d) {
                if (d==0) 
                  return "#bababa";
                else
                  return color(d); });

      }



      findIndicator(){
        try{
        let selectValue = d3.select('select').property('value');
        switch(selectValue){
          case "Education(%)":
            return "literacy";
          case "Wages(%)":
            return "employment";
          case "Labour Force(%)":
            return "labour";
        }
      }//try
      catch(err){}
    }

}
