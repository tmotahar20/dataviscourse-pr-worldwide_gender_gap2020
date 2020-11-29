

class CountryData {
   
    constructor(type, id, properties, geometry, region, income, wo_lit, wo_wag, wo_lab) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
        this.income=income;
        this.wo_lit=wo_lit;
        this.wo_wag=wo_wag;
        this.wo_lab=wo_lab;

    }
}


class Map {

    constructor(data, updateCountry) {
        this.projection = d3.geoLagrange()
                            .scale(150)
                            .translate([365, 225]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.literacy_women= data.literacy_women;
        this.employment_women= data.employment_women;
        
        this.labour_women= data.labour_women;
        this.updateCountry = updateCountry;
    }

    drawMap(world) {

        let current_selection= "GDP";

        let that = this;
        d3.select('#country-detail').style('opacity', 0);
        let geojson = topojson.feature(world, world.objects.countries);

        let countryData = geojson.features.map(d => {

           
            let index = this.nameArray.indexOf(d.id);
            let regiondata = index > -1 ? this.populationData[index].region : 'none';
            let income= index > -1 ? this.literacy_women[index].Income_Code : 'none';
            let wo_lit= index > -1 ? this.literacy_women[index].yr_2011 : 'none';
            let wo_wag= index > -1 ? this.employment_women[index].yr_2016 : '..';
            let wo_lab= index > -1 ? this.labour_women[index].yr_2016 : '..';


           
            

            return new CountryData(d.type, d.id, d.properties, d.geometry, regiondata, income, wo_lit, wo_wag, wo_lab);
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

            console.log(world);
            //console.log(this.populationData);
            

        let countries = map.selectAll('path')
            .data(countryData)
            .enter().append('path')
            .attr('d', path)
            .attr('id', (d) => d.id)
            .attr('class', (d) => d.region)
            .classed('countries', true)
            .attr('fill', function(d){
                if(d.income=='HIC') {               
                return "#08519c";
                }
                 else if(d.income=='UMC')
                 return "#3182bd";
                 else if(d.income=='LMC')
                 return "#6baed6"; 
                 else if(d.income=='LIC')
                 return "#bdd7e7" ;
                  
                 else
                 return "#DCDCDC";            

            });

            let legData=[["High Income"], ["Upper Middle Income"], ["Lower Middle Income"], ["Lower Income"], ["Unknown"]];
            let legend = d3.select("#aBarLeg");            
                            
                   legend.selectAll("mylabels")
                    .data(legData)
                    .enter()
                    .append("text")
                      .attr("x", function(d, i) { return i * 150 + 70; })
                      .attr("y", 8) // 100 is where the first dot appeas. 25 is the distance between dots
                      //.style("fill", function(d){ return color(d)})
                      .text(function(d){ return d})
                      .attr("text-anchor", "middle")
                      .attr("font-size", "15px")
                      .style("alignment-baseline", "middle");
            
            
             

           let colorsScheme=["#08519c","#3182bd", "#6baed6", "#bdd7e7", "#DCDCDC"];

           d3.select('#select')
			.on("change", function () {

                d3.select("#aBarLeg").remove();
				let sect = document.getElementById("select");
                current_selection = sect.options[sect.selectedIndex].value;
                
                if(current_selection==="Education(%)"){
                    d3.select("#aBarLeg").remove();
                legData=[["High Literacy"], ["Upper Middle Literacy"], ["Lower Middle Literacy"], ["Lower Literacy"], ["Unknown"]];
                countries.attr("fill",function(d){

                    
                    if(d.wo_lit > 75) {               
                        return "#08519c";
                        }
                         else if((d.wo_lit < 75) && (d.wo_lit > 50))
                         return "#3182bd";
                         else if((d.wo_lit < 50) && (d.wo_lit > 25))
                         return "#6baed6"; 
                         else if(d.wo_lit < 25)
                         return "#bdd7e7" ;
                          
                         else
                         return "#DCDCDC"; 
                });
            
            
            }

             else if(current_selection==="Wages(%)"){
                    d3.select("#aBarLeg").remove();
                legData=[["High Wages"], ["Upper Middle Wages"], ["Lower Middle Wages"], ["Lower Wages"], ["Unknown"]];
                countries.attr("fill",function(d){
                    if(d.wo_wag >= 75) {               
                        return "#08519c";
                        }
                         else if((d.wo_wag < 75) && (d.wo_wag >= 50))
                         return "#3182bd";
                         else if((d.wo_wag < 50) && (d.wo_wag >= 25))
                         return "#6baed6"; 
                         else if(d.wo_wag < 25)
                         return "#bdd7e7" ;
                          
                         else
                         return "#DCDCDC"; 
                });
            
            }

            else if(current_selection==="Labour Force(%)"){
                d3.select("#aBarLeg").remove();
                legData=[["High"], ["Highly Moderate"], ["Lower Moderate"], ["Low"], ["Unknown"]];
                countries.attr("fill",function(d){

                    
                    if(d.wo_lab >= 75) {               
                        return "#08519c";
                        }
                         else if((d.wo_lab < 75) && (d.wo_lab >= 50))
                         return "#3182bd";
                         else if((d.wo_lab < 50) && (d.wo_lab>= 25))
                         return "#6baed6"; 
                         else if(d.wo_lab < 25)
                         return "#bdd7e7" ;
                          
                         else
                         return "#DCDCDC"; 
                });
            
            }

                

                                        
                

                let leg= d3.select("#legendBar")
                           .append('g')
                           .attr("Id","aBarLeg");

                leg.selectAll("mylabels")
                           .data(legData)
                           .enter()
                           .append("text")
                             .attr("x", function(d, i) { return i * 150 + 87; })
                             .attr("y", 8) // 100 is where the first dot appeas. 25 is the distance between dots
                             //.style("fill", function(d){ return color(d)})
                             .text(function(d){ return d})
                             .attr("text-anchor", "middle")
                             .attr("font-size", "15px")
                             .style("alignment-baseline", "middle");
                
                


                });

                

             
                     


           

          

            

               
        

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

    findIndicator(){
        let selectValue = d3.select('select').property('value');
        switch(selectValue){
            case "Education(%)":
                return "literacy";
            case "Wages(%)":
                return "employment";
            case "Labour Force(%)":
                return "labour";
        }
    }

    displayDetail(d) {
        // d3.select('#map-chart')
        // .html(function() {
            
        //     return `<h4>${d}</h4>
        //         <p><span class="stats">Cas confirmés</span> ${d.Confirmed}</p>
        //         <p><span class="stats">Décès</span> ${d.Deaths}</p>
        //         <p><span class="stats">Rétablissements</span> ${d.Recovered}</p>
        //     `;})
        //     .style('opacity', 1);
        }


    drawBar() {

       
        let that = this;

        
        //let data=["High Income", "Upper Middle Income", "Lower Middle Income", "Lower Income"];

                        
        
    
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
