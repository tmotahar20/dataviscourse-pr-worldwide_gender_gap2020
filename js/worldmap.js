
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
                     
                     console.log(nCountry);
                   
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

    this.drawYearBar();


    }

    updateHighlightClick(activeCountry) {
       
        this. clearHighlight();
        
        d3.select('#map-chart svg')
          .select('#' + activeCountry.toUpperCase())
          .classed('selected-country',true);

    }

    clearHighlight() {
        d3.selectAll('#map-chart svg')
          .selectAll('.countries')
           .classed('selected-country',false);
    }

    drawYearBar() {

       
        let that = this;

       
        let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 720]);

        let yearSlider = d3.select('#activeYear-bar')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 2000)
            .attr('max', 2016)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 25);

        yearSlider.on('input', function () {
           

            that.activeYear= this.value;
            sliderText.text(that.activeYear);
            sliderText.attr('x',yearScale(that.activeYear));



        });

         yearSlider.on('click',function(){
             d3.event.stopPropagation();
        });
    }


}
