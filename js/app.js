//queremos que algunas variables sean usables en este archivo para ello usamos un IIFI
(function() {
    //variable que guardara informacion de la base de datos
    let DB;

    //cargar funciones
    document.addEventListener('DOMContentLoaded', () => {
        //llamar funcion para crear base de datos
        crearDB();
    });

    //funcion para crear base de datos INDEXED DB
    function crearDB() { 
        //.open() recibe 2 parametros
        //.opne( 'nombre de la base de datos', 'version de la DB' )
        const crearDB = window.indexedDB.open('crm', 1);
        //si hay un error
        crearDB.onerror = function() {
            console.log("hubo un error");
        }
        //en caso de que si se pudo crear
        crearDB.onsuccess = function() {
            //guardamos en DB .result;
            DB = crearDB.result;
        }
        //por defecto onupgradeneeded toma un evento(e)
        //aqui definimos las columnas
        crearDB.onupgradeneeded = function( e ) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('db lista y creada');
        }

    }

})();