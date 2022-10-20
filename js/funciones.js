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