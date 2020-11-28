

class CountryData {
   
    constructor(type, id, properties, geometry, region, income) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
        this.income=income;
    }
}


class Map {

    constructor(data, updateCountry) {
        this.projection = d3.geoLagrange()
                            .scale(170)
                            .translate([365, 225]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.literacy_women= data.literacy_women;
        this.updateCountry = updateCountry;
    }

    drawMap(world) {

        let that = this;
        d3.select('#country-detail').style('opacity', 0);
        let geojson = topojson.feature(world, world.objects.countries);

        let countryData = geojson.features.map(d => {
            let index = this.nameArray.indexOf(d.id);
            let regiondata = index > -1 ? this.populationData[index].region : 'none';
            let income= index > -1 ? this.literacy_women[index].Income_Code : 'none';
           
            

            return new CountryData(d.type, d.id, d.properties, d.geometry, regiondata, income);
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

           // console.log(this.literacy_women);
            //console.log(this.populationData);
            console.log(countryData);

        let countries = map.selectAll('path')
            .data(countryData)
            .enter().append('path')
            .attr('d', path)
            .attr('id', (d) => d.id)
            .attr('class', (d) => d.region)
            .classed('countries', true)
            .attr('fill', function(d){
                console.log(d.income);
                if(d.income=='HIC') {               
                return '#B0E0E6';
                }
                 else if(d.income=='UMC')
                 return "#00BFFF";
                 else if(d.income=='LMC')
                 return "#1E90FF"; 
                 else if(d.income=='LIC')
                 return "#6495ED" ;
                  
                 else
                 return "#DCDCDC";            

            });
           // 


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
        .append('div').attr('id', 'GDPbar');

    this.drawBar();


    }

    updateHighlightClick(activeCountry) {
       
        this.clearHighlight();

        let div1 = d3.select('#map-chart svg').append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
        
        d3.select('#map-chart svg')
        .select('#' + activeCountry.toUpperCase())
        .classed('selected-country',true);

        

        //displayDetail(activeCountry);


         
		
          //console.log(activeCountry);

    }

    clearHighlight() {
        d3.selectAll('#map-chart svg')
          .selectAll('.countries')
           .classed('selected-country',false);
        
    }

    displayDetail(d) {
        d3.select('#map-chart')
        .html(function() {
            
            return `<h4>${d}</h4>
                <p><span class="stats">Cas confirmés</span> ${d.Confirmed}</p>
                <p><span class="stats">Décès</span> ${d.Deaths}</p>
                <p><span class="stats">Rétablissements</span> ${d.Recovered}</p>
            `;})
            .style('opacity', 1);
        }


    drawBar() {

       
        let that = this;

       
        let yearScale = d3.scaleLinear().domain([2000, 2016]).range([30, 700]);

        let yearSlider = d3.select('#GDPbar')
            .append("div")
            .append("rect")
            .attr("class", '.hic_rect');
            //.classed('slider', true)
            //.attr('type', 'range');
            //.attr('min',  )
            //.attr('max', 2016)
            //.attr('value', this.activeYear);

            // yearSlider.on('input', function () {           
            //     that.activeYear= this.value;
            //     sliderText.text(that.activeYear);
            //     sliderText.attr('x',yearScale(that.activeYear));   
            //     that.updateYear(this.value);
               
    
    
           // });

        // let sliderLabel = d3.select('.slider-wrap')
        //     .append('div').classed('slider-label', true)
        //     .append('svg');

        // let sliderText = sliderLabel.append('text').text(this.activeYear);

        // sliderText.attr('x', yearScale(this.activeYear));
        // sliderText.attr('y', 30);

        

        //  yearSlider.on('click',function(){
        //      d3.event.stopPropagation();
        // });
    }


}
