const fs = require('fs');
const axios = require('axios');


class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        //TODO: Leer DB si existe
        this.leerDB();
    }

    get paramsMapbox(){
       return{
            'access_token':process.env.MAPBOX_KEY,
             'language': 'es',
             'limit': 5
        }
    }

    get paramsOpen(){
        return{
            'appid': process.env.OPEN_WEATHER_KEY,
            'lang': 'es',
            'units': 'metric'            
        }
    }

    get historialCapitalizado(){
        //Capitalizar cada palabra
        return this.historial.map( lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        });
    }

    async ciudad( lugar = '' ){
        // peticion HTTP
        // console.log('ciudad',lugar);
        try {


            const intance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();
            return resp.data.features.map( lugar =>({

                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));


             // retornar lugares que coincidan con la peticion
            
        } catch (error) {
            return[];
        }
        
    }

    async climaLugar ( lat , lon ){

        try{
            // intancia de axios.create()
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpen , lat, lon }
            });
            // resp.data 
            const respClima = await intance.get();
            const { weather, main} = respClima.data;

            return {
                descClima: weather[0].description,
                tMin: main.temp_min,
                tMax: main.temp_max,
                temp: main.temp
            };
           
        }catch(error){
            console.log(error);
        }

    }
    agregarHistorial( lugar = ''){
        //TODO: prevenir duplicadas
        if( this.historial.includes( lugar.toLocaleLowerCase())){
            return;
        }
        //limitamos a 6 nuestro Historial
        this.historial = this.historial.splice(0,5);
        //Agregamos el lugar al historial
        this.historial.unshift( lugar.toLocaleLowerCase() );
        //graba en Db
        this.guardarDb();
    }

    guardarDb(){

        const payload = {
            historial: this.historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );

    }

    leerDB(){

        //verificar si existe...
        if(!fs.existsSync( this.dbPath )){
            return;
        }
        // cargar informacion const = info readFileSync 
        const info = fs.readFileSync( this.dbPath, { encoding:'utf8' });
        // convertimos a json
        const data = JSON.parse( info );
        //regresamos la data 
        this.historial = data.historial;
    }

}

module.exports = Busquedas;