loadData().then(data => {

    
    let that = this;

    let dropdown_data = ["Education(%)" ,"Wages(%)", "Land Ownership(%)"];
    
    function updateCountry() {

        if(that.activeCountry ==null){
            return undefined;
        }

        let countryID = that.activeCountry;


        worldMap.updateHighlightClick(countryID);
      
    }

    let lineObject = new lineChart(data);
    lineObject.drawPlot("WLD");

    let select = d3.select('#dropdown')
    .append('select')
    .attr('class','select')
    .on('change',onDropdownChange);

     select
    .selectAll('option')
    .data(dropdown_data).enter()
    .append('option')
    .text(function (d) { return d; });

    function onDropdownChange() {
        let current_selection = document.getElementById("rectg").getAttribute("class");
        lineObject.drawPlot(current_selection);
    };

    
    function updateYear(year) {


        that.activeYear = year;
       
    }
   
    const worldMap = new Map(data, updateCountry);
    
    

    let group_id = data.gdp.map(d => d.geo);
  
   
    d3.json('data/world.json').then(mapData => {

                 
               
           worldMap.drawMap(mapData);
           
           

    });

let sunburstObject = new Sunburst();
sunburstObject.drawSunburst(lineObject);
    
    document.addEventListener("click", function (e) {
        
        e.stopPropagation();        
        updateCountry(null, null);

        if(e.target.id.includes('.')){
            country_id= e.target.id.split('.')[1];
        }
        else{
            country_id= e.target.id;
        }

        if(country_id !='' && group_id.includes(country_id.toLowerCase())){
            that.activeCountry = country_id;
            updateCountry();
        }

        else{
            that.activeCountry= null;
            worldMap.clearHighlight();
         
        
        }
    });

});


async function loadFile(file) {
    let data = await d3.csv(file).then(d => {
        let mapped = d.map(g => {
            for (let key in g) {
                let numKey = +key;
                if (numKey) {
                    g[key] = +g[key];
                }
            }
            return g;
        });
        return mapped;
    });
    return data;
}


async function loadData() {
    let pop = await loadFile('data/pop.csv');
    let gdp = await loadFile('data/gdppc.csv');
    let literacy_men = await  loadFile('data/literacy_rate_men.csv');
    let literacy_women = await  loadFile('data/literacy_rate_women.csv');

   
    return {
        'population': pop,
        'gdp': gdp,
        'literacy_men': literacy_men,
        'literacy_women': literacy_women

            };
}
