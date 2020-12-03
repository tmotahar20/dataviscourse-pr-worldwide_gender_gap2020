



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
        this.projection = d3.geoMercator()
                            .scale(120)
                            .translate([400, 270]);
        this.nameArray_pop = data.population.map(d => d.geo.toUpperCase());
        this.nameArray_gdp = data.gdp.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.gdp= data.gdp;
        

        this.nameArray_wolit = data.literacy_women.map(d => d.Country_Code.toUpperCase());
        this.nameArray_melit = data.literacy_men.map(d => d.Country_Code.toUpperCase());
        this.literacy_women= data.literacy_women;
        this.literacy_men= data.literacy_men;
        this.nameArray_woemp = data.employment_women.map(d => d.Country_Code.toUpperCase());
        this.nameArray_meemp = data.employment_men.map(d => d.Country_Code.toUpperCase());
        this.employment_women= data.employment_women;
        this.employment_men= data.employment_men;
        
        this.nameArray_wolab = data.labour_women.map(d => d.Country_Code.toUpperCase());
        this.nameArray_melab = data.labour_men.map(d => d.Country_Code.toUpperCase());
        this.labour_women= data.labour_women;
        this.labour_men= data.labour_men;


        this.updateCountry = updateCountry;
        
    }

    drawMap(world) {

        let current_selection;

        

        let that = this;
        d3.select('#country-detail').style('opacity', 0);
        let geojson = topojson.feature(world, world.objects.countries);

        let countryData = geojson.features.map(d => {

           
            let index = this.nameArray_pop.indexOf(d.id);
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
                            
                   legend.selectAll("#aBarLeg")
                    .data(legData)
                    .enter()
                    .append("text")
                      .attr("x", function(d, i) { return i * 150 + 70; })
                      .attr("y", 8) 
                      .text(function(d){ return d})
                      .attr("text-anchor", "middle")
                      .attr("font-size", "15px")
                      .style("alignment-baseline", "middle");
            
            
        

        //let selectValue = d3.select('select').property('value');

       
                       
                     
           let colorsScheme=["#08519c","#3182bd", "#6baed6", "#bdd7e7", "#DCDCDC"];


           d3.select('select')
			.on("change", function () {
                d3.select("#max-info").selectAll('text').remove();
                d3.select("#info").selectAll('text').remove();

                current_selection = that.findIndicator();
               
                //let sect = document.getElementById("select");
                
                
                
                
                
                if(current_selection=='literacy'){

                   
                   
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

              if(current_selection=='employment'){

               
                    
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

             if(current_selection=='labour'){

                d3.select("#max-info").selectAll('text').remove();
                
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

                
                let leg= d3.select("#aBarLeg")
                           .selectAll("text");

                leg.remove();

                leg.select("#aBarLeg")
                           .data(legData)
                           .enter()
                           .append("text")
                             .attr("x", function(d, i) { return i * 150 + 87; })
                             .attr("y", 8) 
                             .text(function(d){ return d})
                             .attr("text-anchor", "middle")
                             .attr("font-size", "15px")
                             .style("alignment-baseline", "middle");

                
                
                


                });

         

          
        
        

        
        countries.on('click', function(d) {
            d3.select("#info").selectAll('text').remove();
            d3.select("#max-info").selectAll('text').remove();
           
            let countryID = { id: d.id, region: d.region };
            that.clearHighlight();
            //that.info_clearHighlight();
            that.updateCountry(countryID);

            current_selection = that.findIndicator();

            console.log(current_selection); 
            
           let countryName; 
           let infr_women;
           let infr_men;
           let infr_gap;

                

           
           if(current_selection ==='gdp'){

                let index = that.nameArray_gdp.indexOf(countryID.id);
                let name = index > -1 ? that.gdp[index].country : 'none';
                let gdp_all  =  that.gdp[index];
                let info= gdp_all[2016];

                

                countryName=name;


                let inf= d3.select("#info")
                .append('text')
                .attr('style', 'color:black')
                .text(d => 'In ' + countryName +" , current "+ current_selection+ "  is  : " 
                  + info );
                
            }

            if(current_selection === 'literacy'){

                

                let index = that.nameArray_wolit.indexOf(countryID.id);
                let name = index > -1 ? that.literacy_women[index].Country_Name : 'none';

               

                
                let lit_women  =  that.literacy_women[index].yr_2011 > 0 ? that.literacy_women[index].yr_2011 : 'Unknown';
                let lit_men  =  that.literacy_men[index].yr_2011 > 0 ? that.literacy_men[index].yr_2011 : 'Unknown';

                

                

                let all_data=[];
                let max= 0;
                let max_country="";
        
                 for(let i = 1;i< 241;i++){ 

                   
                    if(that.literacy_women[i].yr_2011>0)  {                   
                  

                     if (max <that.literacy_women[i].yr_2011){
                      max = that.literacy_women[i].yr_2011 ;

                     
                         max_country=that.literacy_women[i].Country_Name;
                         
                     }
                    }


                 }

                        
                
                
                countryName=name;
                infr_women=d3.format(",.2f")(lit_women);
                infr_men=d3.format(",.2f")(lit_men);
                infr_gap=d3.format(",.2f")(lit_men-lit_women)*-1;

                       

                if (lit_men!= 'Unknown' && lit_women!= 'Unknown'){


                    let inf= d3.select("#info")
                              .append('text')
                              .attr('style', 'color:black')
                              //.text("Hi");
                             .text(d => 'In ' + countryName +": , women's "+ current_selection+ "  is  : " 
                                + infr_women + ", which is "+ infr_gap + "  % less than men");
    
                    }
    
                    else{
    
                        let inf= d3.select("#info")
                              .append('text')
                              .attr('style', 'color:black')
                              .text(d => 'Country' + countryName +" , women's  "+ current_selection+ "  is  :" 
                                + "Unknown ");
                                

                       
    
                    }

                    let max_info= d3.select("#max-info")
                                     .append('text')
                                    .attr('style', 'color:black')
                                    //.text("Hi")
                                    .text(d => 'Maximum Women Literacy is in :' + max_country +" :  "+ d3.format(",.2f")(max)+ " %"  )
                                    .attr("font-size", "30px");
            }

            if(current_selection =='employment'){

                let index = that.nameArray_woemp.indexOf(countryID.id);
                let name = index > -1 ? that.employment_women[index].Country_Name : 'none';

                
                let emp_women  =  that.employment_women[index].yr_2016 > 0 ? that.employment_women[index].yr_2016 : 'Unknown';
                let emp_men  =  that.employment_men[index].yr_2016 > 0 ? that.employment_men[index].yr_2016 : 'Unknown';
                
                let all_data=[];
                let max= 0;
                let max_country="";
        
                 for(let i = 1;i< 241;i++){ 

                   
                    if(that.employment_women[i].yr_2016>0)  {                   
                  

                     if (max <that.employment_women[i].yr_2016){
                      max = that.employment_women[i].yr_2016 ;

                     
                         max_country=that.employment_women[i].Country_Name;
                         
                     }
                    }


                 }

                
     
                countryName=name;

                infr_women=d3.format(",.2f")(emp_women);
                infr_men=d3.format(",.2f")(emp_men);
                infr_gap=d3.format(",.2f")(emp_men-emp_women)*-1;


                if (emp_men!= 'Unknown' && emp_women!= 'Unknown'){


                    let inf= d3.select("#info")
                              .append('text')
                              .attr('style', 'color:black')
                              .text(d => 'In ' + countryName +" , women "+ current_selection + "  is  : " 
                                + infr_women + ", which is "+ infr_gap + "  % less than men");
    
                    }
    
                    else{
    
                        let inf= d3.select("#info")
                              .append('text')
                              .attr('style', 'color:black')
                              .text(d => 'Country' + countryName +" , women's  "+ current_selection+ "  is  :" 
                                + "Unknown ");
                               
    
                    }

                    let max_info= d3.select("#max-info")
                                    .append('text')
                                    .attr('style', 'color:black')
                                    //.text("Hi")
                                    .text(d => 'Maximum Women Employment is in :' + max_country +" :  "+ d3.format(",.2f")(max)+ " %"  )
                                    .attr("font-size", "30px");
            }

            if(current_selection =='labour'){

                let index = that.nameArray_wolab.indexOf(countryID.id);
                let name = index > -1 ? that.labour_women[index].Country_Name : 'none';

                
                let lab_women  =  that.labour_women[index].yr_2016 > 0 ? that.labour_women[index].yr_2016 : 'Unknown';

                let lab_men  =  that.labour_men[index].yr_2016 > 0 ? that.labour_men[index].yr_2016 : 'Unknown';

                let all_data=[];
                let max= 0;
                let max_country="";
        
                 for(let i = 1;i< 241;i++){ 

                   
                    if(that.labour_women[i].yr_2016>0)  {                   
                  

                     if (max <that.labour_women[i].yr_2016){
                      max = that.labour_women[i].yr_2016 ;

                     
                         max_country=that.labour_women[i].Country_Name;
                         
                     }
                    }


                 }

                 
     
                countryName=name;
                infr_women=d3.format(",.2f")(lab_women);
                infr_men=d3.format(",.2f")(lab_men);
                infr_gap=d3.format(",.2f")(lab_men-lab_women)*-1;
                

                if (lab_men!= 'Unknown' && lab_women!= 'Unknown'){


                let inf= d3.select("#info")
                          .append('text')
                          .attr('style', 'color:black')
                          .text(d => 'In ' + countryName +" , women in "+ current_selection+ "  is  : " 
                            + infr_women + ", which is "+ infr_gap + "  % less than men");

                }

                else{

                    let inf= d3.select("#info")
                          .append('text')
                          .attr('style', 'color:black')
                          .text(d => 'Country' + countryName +" , women in "+ current_selection+ "  is  :" 
                            + "Unknown ");

                }

                let max_info= d3.select("#max-info")
                                .append('text')
                                .attr('style', 'color:black')
                                // .text("Hi")
                                 .text(d => 'Maximum Women labor is in :' + max_country +" :  "+ d3.format(",.2f")(max)+ " %" )
                                 .attr("font-size", "30px");
            }
            
          
       
           
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
        
        

    
      


    }

    updateHighlightClick(activeCountry) {
       
        this.clearHighlight();

        let div1 = d3.select('#map-chart svg').append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
        
        d3.select('#map-chart svg')
        .select('#' + activeCountry.toUpperCase())
        .classed('selected-country',true);

        


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
            case "Employment(%)":
                return "employment";
            case "Labour Force(%)":
                return "labour";
                case "GDP":
                return "gdp";

        }

       
    }

    

}




