loadData().then(data => {

    
    let that = this;

    let dropdown_data = ["GDP","Education(%)" ,"Wages(%)", "Labour Force(%)"];

    let lineObject = new lineChart(data);
    lineObject.drawPlot("WLD",data);
    
    function updateCountry() {

        if(that.activeCountry ==null){
            return "WLD";
        }

        let countryID = that.activeCountry;

        
        worldMap.updateHighlightClick(countryID);
        
        lineObject.drawPlot(countryID,data);
        //infoBox.updateTextDescription(countryID.toLowerCase(), that.activeYear);
      
    }

    let select = d3.select('#dropdown')
    .append('select')
    .attr('class','select')
    .on('change',onDropdownChange);

let options = select
    .selectAll('option')
    .data(dropdown_data).enter()
    .append('option')
    .text(function (d) { return d; });

function onDropdownChange() {
// d3.select('body')
//     .append('p')
//     .text(selectValue + ' is the last selected option.');
let year = d3.select("#yearslider").select('input').property('value');
mapObject.updateMap(year);
let current_selection = document.getElementById("rectg").getAttribute("class");
lineObject.drawPlot(current_selection);
heatmapObject.updateHeatMap();
};


    function onDropdownChange() {
        lineObject.drawPlot("WLD",data);
        heatmapObject.plotheat_country(data);

    );   
    }



    
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

    let heatmapObject = new heatmap(data);
heatmapObject.drawLegend();
heatmapObject.plotheat_country(data);
    
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
    let employment_men = await  loadFile('data/men_employment.csv');
    let employment_women = await  loadFile('data/women_employment.csv');
    let labour_men = await  loadFile('data/labour_men.csv');
    let labour_women = await  loadFile('data/labour_women.csv');

    //console.log(employment_women);
   
    return {
        'population': pop,
        'gdp': gdp,
        'literacy_men': literacy_men,
        'literacy_women': literacy_women,
        'employment_men': employment_men,
        'employment_women': employment_women,
        'labour_men': labour_men,
        'labour_women': labour_women,

            };
        }
