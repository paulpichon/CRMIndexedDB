(function() {
    //variable para base de datos
    let DB;

    //variables para representar los inputs donde se pondran los datos
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    document.addEventListener('DOMContentLoaded', () => {
        //conectarnos a la base de datos
        conectarDB();

        //verificar el ID de la URL
        //existe una API URLSearchParams para obtener los parametros en la URL
        const parametrosURL = new URLSearchParams( window.location.search );
        //con .get() podemos obtener el valor del id que viene en la URL
        const idCliente = parametrosURL.get('id');
        //si viene el idCliente 
        if ( idCliente ) {
            //se podria arreglar con programacion asincrona
            //por ahora pondremos un settimeout para que se pueda conectar la base de datos
            setTimeout(() => {
                //llamar funcion para traer datos del cliente
                obtenerCliente( idCliente );
            }, 100);
        }

    });

    //funcion para obtener el cliente
    function obtenerCliente( id ) { 
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');
        
        const cliente = objectStore.openCursor();
        //para el cursor se pasa e(event)
        cliente.onsuccess = function( e ) {
            const cursor = e.target.result;

            if ( cursor ) {
                //console.log( cursor.value );
                //verificar si el id del cursor es igual que el id del parametro
                if ( cursor.value.id === Number( id ) ) {
                    //llamar funcion para llenar el formualrio con los datos traidos de la BD
                    //con el argumento cursor.value que trae toda la info del id seleccionado
                    llenarFormulario( cursor.value );
                }
                //iterar el siguiente
                cursor.continue();
            }
        }
    }
    //funcion para llenar el formualrio
    function llenarFormulario( datosCliente ) {
        //destructuring
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    //funcion para conectarnos a la base de datos
    function conectarDB() {
        //.open('nombre de la DB', version de la base de datos) 
        const abrirConexion = window.indexedDB.open('crm', 1);
        //en caso de error
        abrirConexion.onerror = function() {
            console.log("hubo un error");
        }   
        //en caso de exito
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }

})();