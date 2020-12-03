/** Data structure for the data associated with an individual country. */
// class InfoBoxData {
   
//     constructor(country, region, indicator_name) {
//         this.country = country;
//         this.region = region;
//         this.indicator_name = indicator_name;
        
//     }
// }


class InfoBox {
    
    constructor(data) {
        this.data = data;
        console.log(data);
    }

    updateTextDescription(activeCountry) {
        
        console.log(activeCountry);
        
        this.clearHighlight();

        let that = this;

        // if (! that.data.population.find(d => d.id == activeCountry)) {
        //     return undefined;
        // }

        let group_info = Object.keys(this.data).map(function (key) {
        
        let acountry = that.data[key].find(d => d.geo == activeCountry);

        

        
           
        let cregion = that.data['population'].find(d => d.geo == activeCountry);
           
       // let nindicator = acountry.indicator_name;
            
        
            
        // let infoBoxData = new InfoBoxData(acountry.country, cregion.region, nindicator);
           
        //     return infoBoxData;
         });


        let aregion = group_info[0];

        let title = d3.select('#country-detail').selectAll('span#infoTitle')
                      .data([{'country' : aregion.country, 'region' : aregion.region}]);
        
        
        title.exit().remove();
        
        
        let new_title = title.enter()
                             .append('div')
                             .classed('label', true);
        
        title = new_title.merge(title);

        
        
        
        title.append('i')
             .attr('class', d => d.region)
             .classed('fas fa-globe-asia', true);
        
        title.append('span')
             .attr('id', 'infoTitle')
             .attr('style', 'color:black')
             .text(d => ' ' + d.country);
        
        
        let text_info = d3.select('#country-detail').selectAll('div#info').data(group_info);
        text_info.exit().remove();
        
        
        let new_text = text_info.enter()
                                .append('div')
                                .classed('stat', true)
                                .attr('id', 'info');
        
        text_info = new_text.merge(text_info);
    
        text_info.append('text')
                 .text(d => d.indicator_name );
    }

    clearHighlight() {

       
        d3.select('#country-detail').html('');
    }

}



