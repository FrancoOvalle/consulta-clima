require('dotenv').config()

const { inquirerMenu, pausa, leerInput, listadoLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
const axios = require('axios');


require('colors');

const main = async()=>{
    let opt;
    const busquedas = new Busquedas();

    do{

        opt = await inquirerMenu();

        switch(opt){
            case 1:
                //mostrar mensaje para que la persona escriba el lugar 
                const termino = await leerInput('Ciudad a buscar: ');
               
                // buscar los lugares 
                const lugares = await busquedas.ciudad( termino );

                // selecciona el lugar 
                const id  = await listadoLugares(lugares);
                if( id === '0') continue;
                
                const lugarSeleccionado = lugares.find( lugar => lugar.id === id );
                //Guardar en db
                busquedas.agregarHistorial( lugarSeleccionado.nombre ); 

                // Clima del lugar 
                const lat = lugarSeleccionado.lat;
                const lon = lugarSeleccionado.lng;

                const clima = await busquedas.climaLugar( lat , lon);

                // mostrar resultados 
                console.log('\nInformación de la Ciudad\n'.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre.green);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Long: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', clima.temp,'°');
                console.log('T° Mínima: ', clima.tMin,'°');
                console.log('T° Máxima: ', clima.tMax,'°');
                console.log('Descripción clima ', clima.descClima.green);

            break;
            case 2:
                //console.log('selecciono la opcion 2'.green);
                busquedas.historialCapitalizado.forEach( (lugar, i) =>{
                    const idx = `${ i + 1}.`.green;
                    console.log(`${idx} ${ lugar } `);
                });
            break;
            
        }
       if ( opt !== 0 ) await pausa();
    }while( opt !== 0);


}

main();