const axios = require('axios');

class Busquedas {

    historial = ['Tegucigalpa', 'Madrid', 'San Jose'];

    constructor(){
        //TODO: Leer DB si existe
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

}

module.exports = Busquedas;