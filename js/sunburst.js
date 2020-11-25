

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
        this.projection = d3.geoLagrange()
                            .scale(170)
                            .translate([365, 225]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.updateCountry = updateCountry;
    }

    drawMap(world) {

        let that = this;
        d3.select('#country-detail').style('opacity', 0);
        let geojson = topojson.feature(world, world.objects.countries);

        let countryData = geojson.features.map(d => {
            let index = this.nameArray.indexOf(d.id);
            let regiondata = index > -1 ? this.populationData[index].region : 'none';
            return new CountryData(d.type, d.id, d.properties, d.geometry, regiondata);
        });

        let path = d3.geoPath()
            .projection(this.projection);

        let map = d3.select('#map-chart').append('svg');

        map.append("defs").append("path")
            .datum({ 'type': "Sphere" })
            .attr("id", "sphere")
            .attr("d", path);

        map.append("use")
            .attr("class", "stroke")
            .attr("xlink:href", "#sphere");

        map.append("use")
            .attr("class", "fill")
            .attr("xlink:href", "#sphere");

        let countries = map.selectAll('path')
            .data(countryData)
            .enter().append('path')
            .attr('d', path)
            .attr('id', (d) => d.id)
            .attr('class', (d) => d.region)
            .classed('countries', true);


        countries.on('click', function(d) {
            let countryID = { id: d.id, region: d.region };
            that.clearHighlight();
            that.updateCountry(countryID);
        });

        // Add graticule to the map
        let graticule = d3.geoGraticule();

        let grat = map
            .append('path')
            .datum(graticule)
            .classed('graticule', true)
            .attr('d', path)
            .attr('fill', 'none');

        map.insert("path", ".graticule")
            // map.insert("path", '.test')
            .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
            .attr("class", "boundary")
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
        
        this.clearHighlight();
        //highlight map
        let countries = d3.select('#map-chart').selectAll('.countries');
        let regions = countries.filter(c => c.region === activeCountry.region).classed('selected-region', true);
        let mapTarget = countries.filter(c => c.id === activeCountry.id).classed('selected-country', true);

         
		
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
