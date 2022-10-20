//queremos que algunas variables sean usables en este archivo para ello usamos un IIFI
(function() {
    //variable que guardara informacion de la base de datos
    let DB;

    //cargar funciones
    document.addEventListener('DOMContentLoaded', () => {
        //llamar funcion para crear base de datos
        crearDB();

        //solo traera los registro si y solo si existe la base de datos CRM
        if ( window.indexedDB.open('crm', 1)  ) {
            obtenerCliente();
        }

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

    //funcion para obtener los cleintes desde la base de datos
    function obtenerCliente() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.log("hubo en error");
        }
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function( e ) {
                
                const cursor = e.target.result;

                if ( cursor ) {
                    //destructuring
                    const { nombre, empresa, email, telefono, id } = cursor.value;

                    //variable que representa donde seran mostrados los registros
                    const listadoClientes = document.querySelector('#listado-clientes');
                    //innerhtml
                    listadoClientes.innerHTML += ` 
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
                        </td>
                    </tr>
                                            `;

                    //traer el siguiente registro
                    cursor.continue();
                } else {
                    console.log("no hay mas registros");
                }
            }
        }
    }

})();