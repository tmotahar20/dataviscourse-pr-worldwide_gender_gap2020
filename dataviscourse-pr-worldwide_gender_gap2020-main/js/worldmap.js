
class CountryData {
   
    constructor(type, id, properties, geometry, region) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
    }
}


class Map {

    constructor(data, updateCountry) {
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.updateCountry = updateCountry;
    }

    drawMap(world) {
        
        
    let geoData = topojson.feature(world, world.objects.countries);

        
    let countryArray= geoData.features.map(country =>{

      let index=this.nameArray.indexOf(country.id);
          
       


        if(index > -1){
                    
                     let nCountry = new CountryData(country.type, country.id, country.properties, country.geometry, this.populationData[index].region);
                     
                     //console.log(nCountry);
                   
                     return nCountry;
                 }
                 else {

               
                 let nCountry = new CountryData(country.type, country.id, country.properties, country.geometry, null);
            
                    return nCountry;
                 }
                       
                 });

             
        
         let svg = d3.select('#map-chart').append('svg');
        
    
        let path = d3.geoPath()
                     .projection(this.projection);

               

        svg.selectAll("path")
            .data(countryArray)
            .join("path")
            .attr("d", path)
            .attr('stroke', '#fff')
            .attr('class',function (d){
                return d.region ? d.region: "" })
            .classed("countries", true)
            .attr('id', d => d.id);
            
           

      

 let graticule = d3.geoGraticule(); 
          

     
     svg.append('path')
        .datum(graticule)
        .attr('class', "graticule")
        .attr("d", path);

        svg.append('path')
        .datum(graticule.outline)
        .attr('class', "stroke")
        .attr("d", path);
       
    
    d3.select('#map-chart')
        .append('div').attr('id', 'activeYear-bar');

    //this.drawYearBar();


    }

    updateHighlightClick(activeCountry) {
       
        this.clearHighlight();

        let div1 = d3.select('#map-chart svg').append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
        
        d3.select('#map-chart svg')
          .select('#' + activeCountry.toUpperCase())
          .classed('selected-country',true)
          .on("click", function(d) {
                  div1.transition()
                   .style("opacity", 1);
             div1.html(activeCountry.toUpperCase())
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 15) + "px");
            })
            .on('mouseout', function(d) {
                 div1.transition()
                      .style("opacity", 0);
                  
              });


         
		
          //console.log(activeCountry);

    }

    clearHighlight() {
        d3.select('#map-chart svg').selectAll('selected-country').classed('.selected-country', false);
        //d3.select('#map-chart svg').selectAll('.selected-region').classed('.selected-region', false);
        //d3.select('#map-chart svg').selectAll('.hidden').classed('hidden', false);
    }

    drawYearBar() {

       
        let that = this;

       
        let yearScale = d3.scaleLinear().domain([2000, 2016]).range([30, 700]);

        let yearSlider = d3.select('#activeYear-bar')
            .append("div").classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 2000)
            .attr('max', 2016)
            .attr('value', this.activeYear);

            yearSlider.on('input', function () {           
                console.log("hi");
                that.activeYear= this.value;
                sliderText.text(that.activeYear);
                sliderText.attr('x',yearScale(that.activeYear));   
                that.updateYear(this.value);
               
    
    
            });

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 30);

        

         yearSlider.on('click',function(){
             d3.event.stopPropagation();
        });
    }


}
