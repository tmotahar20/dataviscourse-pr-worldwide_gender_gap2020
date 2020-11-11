loadData().then(data => {

    
    this.activeCountry = null;
    this.activeYear = '2000';
    let that = this;

    
    function updateCountry() {

        if(that.activeCountry ==null){
            return undefined;
        }

        let countryID = that.activeCountry;


        worldMap.updateHighlightClick(countryID);
      
    }

    
    function updateYear(year) {


        that.activeYear = year;
       
    }
   

   
    const worldMap = new Map(data, updateCountry);
    
    

    let group_id = data.gdp.map(d => d.geo);
  
   
    d3.json('data/world.json').then(mapData => {

                 
               
           worldMap.drawMap(mapData);
           
           

    });

    
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
    let pur = await loadFile('data/purchase.csv');
   
    return {
        'population': pop,
        'gdp': gdp,
        'purchase-decision': pur,
            };
}
