loadData().then(data => {

    
    let that = this;

    let dropdown_data = ["Education(%)" ,"Wages(%)", "Land Ownership(%)"];

    let lineObject = new lineChart(data);
    lineObject.drawPlot("WLD");
    
    function updateCountry() {

        if(that.activeCountry ==null){
            return undefined;
        }

        let countryID = that.activeCountry;


        worldMap.updateHighlightClick(countryID);
        lineObject.drawPlot(countryID);
        //infoBox.updateTextDescription(countryID.toLowerCase(), that.activeYear);
      
    }

    function updateYear(year) {

       
        that.activeYear = year;
       
        // if (that.activeCountry) {
        //     infoBox.updateTextDescription(that.activeCountry.toLowerCase(), year);
        // }
    }


    

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
    //const infoBox = new InfoBox(data);
    
    

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
            country_name= e.target.id.split('.')[2];
        }
        else{
            country_id= e.target.id;
        }
         console.log(country_id);

        if(country_id !='' && group_id.includes(country_id.toLowerCase())){
            that.activeCountry = country_id;
           // let country_stat = data.literacy_women.map(d => d.Income_Group);
             
            updateCountry();
        }

        else{
            that.activeCountry= null;
            worldMap.clearHighlight();
            //infoBox.clearHighlight();
         
        
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
        'literacy_women': literacy_women,

            };
}
