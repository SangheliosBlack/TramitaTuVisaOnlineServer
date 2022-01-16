const generarNombre = (nombre)=>{

    var arrayDeCadena = nombre.split(' ');

    var nombreUsuario = '';

    arrayDeCadena.forEach((value,index)=>{
        if(index == 0){
            nombreUsuario = nombreUsuario+value;
        }else{
            nombreUsuario = nombreUsuario+value.charAt(0).toUpperCase()
        }
    });

    return nombreUsuario;

}

module.exports = { generarNombre };