(function() {
    //variable usada para base de datos
    let DB;
    //variable que representa el formulario
    const formulario = document.querySelector('#formulario');

    //cargar listeners
    document.addEventListener('DOMContentLoaded', () => {
        //llamar funcion para conectar a la base de datos
        conectarDB();
        //añadir un listener a formulario
        formulario.addEventListener('submit', validarCliente);
    });

    //funcion para conectarse a base de datos
    function conectarDB(){
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

    //funcion para vlaidar el formulario
    function validarCliente( e ) {
        //prevenir la accion por defecto
        e.preventDefault();

        //leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if ( nombre === '' || email === '' || telefono === '' || empresa === '') {
             //llamr funcion para imprimir alerta
             imprimirAlerta('TODOS LOS CAMPOS SON OBLIGATORIOS', 'error');
             return;
        }
        //crear un objeto con la informacion
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        }
        //si el objeto no esta sellado
        //podemos agregar el ID de la siguiente forma
        //cliente.id = Date.now();

        //llamar funcion para crear al nuevo cliente
        crearNuevoCliente( cliente );
    }
    //funcion para crear el nuevo cliente
    function crearNuevoCliente( cliente ) {
        //usamos transacciones
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');
        //añadir a la base de datos
        objectStore.add( cliente );
        //en caso de un error
        transaction.onerror = function() {
            //imprimir alerta error
            imprimirAlerta('EL CORREO YA EXISTE', 'error');
        }
        //en caso de completar el registro
        transaction.oncomplete = function() {
            //imprimir alerta
            imprimirAlerta('EL CLIENTE HA SIDO REGISTRADO EXITOSAMENTE');

            //redirigir despues de agregar un clinete
            setTimeout(() => {
                //redirigir
                window.location.href = 'index.html';
            }, 3000);
        }

    }

    //funcion para imprimir alerta
    function imprimirAlerta( mensaje, tipo ) {

        const alerta = document.querySelector('.alerta');
        //comprobar que no haya otras apertas previas
        //esto evita que se muestran mas alertas
        if (!alerta) {
            //crear la alerta
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta' );
            //se verifica si el tipo de alerta es igual a 'error'
            if ( tipo === 'error') {
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            }else {
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }
            //añadimos el mensaje
            divMensaje.textContent = mensaje;
            //renderizar
            formulario.appendChild( divMensaje );
            //quitar  la alerta
            setTimeout(() => {
                //quitar la alerta
                divMensaje.remove();
            }, 3000);

        }
        
    }
})();