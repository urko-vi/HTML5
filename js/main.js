$.noConflict();
const URL = "http://localhost:2403/alumnos";
/*
 var dnies = ["45751880G", "16087431N"];
 var nombres = new Array();
 nombres['45751880G'] = "Imanol";
 nombres['16087431N'] = "Marta";
 var apellidos = new Array();
 apellidos["45751880G"] = "jimenez lopez";
 apellidos["16087431N"] = "rivera del amo";
 var nUF1841 = new Array();
 nUF1841['45751880G'] = 7;
 nUF1841['16087431N'] = 8;
 var nUF1842 = new Array();
 nUF1842['45751880G'] = 5;
 nUF1842['16087431N'] = 5;
 var nUF1843 = new Array();
 nUF1843['45751880G'] = 5;
 nUF1843['16087431N'] = 5;
 var nUF1844 = new Array();
 nUF1844['45751880G'] = 5;
 nUF1844['16087431N'] = 5;
 var nUF1845 = new Array();
 nUF1845['45751880G'] = 5;
 nUF1845['16087431N'] = 5;
 var nUF1846 = new Array();
 nUF1846['45751880G'] = 5;
 nUF1846['16087431N'] = 5;
 */
jQuery(document).ready(function($) {
    function ajax(opciones) {
        return new Promise(function (resolve, reject) {
            $.ajax(opciones).done(resolve).fail(reject);
        });
    }

    function cargarAlumnos(data) {
        for (var i = 0; i < data.length; i++) {
            var id = data[i].id;
            // var dni = data[i].dni;
            var nombre = data[i].nombre;
            var apellido = data[i].apellidos;
            var notas = {};
            if (data[i].notas != undefined) {
                notas['UF1841'] = data[i].notas.UF1841;
                notas['UF1842'] = data[i].notas["UF1842"];
                notas['UF1843'] = data[i].notas.UF1843;
                notas['UF1844'] = data[i].notas.UF1844;
                notas['UF1845'] = data[i].notas.UF1845;
                notas['UF1846'] = data[i].notas.UF1846;
            } else {
                notas['UF1841'] = "-";
                notas['UF1842'] = "-";
                notas['UF1843'] = "-";
                notas['UF1844'] = "-";
                notas['UF1845'] = "-";
                notas['UF1846'] = "-";
            }

            insertarAlumnoTabla(id, nombre, apellido, notas);
        }
        mostrarNAlumnos(data.length);
    }

    function recogerErrorAjax(jqXHR, textStatus, errorThrown) {
        alert("Error:" + jqXHR.toString() + textStatus + errorThrown);
    }

    ajax({url: URL, type: "GET"})
        .then(cargarAlumnos, recogerErrorAjax)
        .catch(function errorHandler(error) {
            alert(error);
        });
    //  var promesaCarga = $.ajax('http://localhost:2403/alumnos',{type: "GET"});
    /*
     promesaCarga.success(function (data) {
     for(var i = 0; i< data.length; i++){
     console.log(data[i]);
     var id = data[i].id;
     var dni = data[i].dni;
     var nombre=  data[i].nombre;
     var apellido=  data[i].apellidos;
     var notas = new Array();
     notas['UF1841'] = data[i].notas.UF1841;
     notas['UF1842'] =data[i].notas["UF1842"];
     notas['UF1843'] = data[i].notas.UF1843;
     notas['UF1844'] = data[i].notas.UF1844;
     notas['UF1845'] = data[i].notas.UF1845;
     notas['UF1846'] = data[i].notas.UF1846;
     insertarAlumnoTabla(id,dni, nombre, apellido, notas);
     }
     mostrarNAlumnos();
     });
     */
    /*
     function cargarAlumnos() {
     var cantidad = dnies.length;
     for (var i = 0; i < cantidad; i++) {
     var id = '';
     var dni = dnies[i];
     var nombre = nombres[dni];
     var apellido = apellidos[dni];
     var notas = new Array();
     notas['UF1841'] = nUF1841[dni];
     notas['UF1842'] = nUF1842[dni];
     notas['UF1843'] = nUF1843[dni];
     notas['UF1844'] = nUF1844[dni];
     notas['UF1845'] = nUF1845[dni];
     notas['UF1846'] = nUF1846[dni];
     insertarAlumnoTabla(id,dni, nombre, apellido, notas);
     }
     mostrarNAlumnos();
     }
     */
    $('#listado-alumnos').find("tbody button").click(function (e) {
        e.preventDefault();
        alert("HAs pulsado en editar click");
    });
    $('#listado-alumnos').find('tbody').on("click", "button", function (e) {
        e.preventDefault();
        // alert("HAs pulsado en editar con ON");
        var datos = {id: '', nombre: '', dni: '', apellidos: '', notas: {}};
        ajax({url: URL, type: "PUT", data: datos})
            .then(cargarMensaje("El alumno ha sido modificado"), recogerErrorAjax)
            .catch(function errorHandler(error) {

            });
    });
    $("#listado-alumnos thead input").click(function (e) {
        // $("#listado-alumnos tbody input[type='checkbox']").checked(true);
        //attr vs (prop e is) ---> tiempo de carga
        // prop vs is ---> prop identifica elementos cargados dinamicamente mientras is no
        var $input = $("#listado-alumnos").find('tbody input');
        if ($(this).prop("checked")) {
            $input.prop("checked", true);
        } else {
            $input.prop("checked", false);
        }
    });
    //cargarAlumnos();
    $("a[href='s1'],a[href='#s2']").click(function (e) {
        e.preventDefault();

    });
    $('#productos').find("a.btn").click(function (e) {
        var dni = $('#dni').val();
        var letra =calcularLetra(parseInt(dni,10));
        $('#productos').find("span.resultado").text(letra);
        e.preventDefault();
        return false;
    });
    $("#alumnos").find('div button.btn-info').on("click", function (e) {
        e.preventDefault();
        $('#formAlumno').find('input').val("");
        $("#myModal").css("display", "block");
    });
    $("#alumnos").find("div button.btn-danger").on("click", function (e) {
        e.preventDefault();
        //0 Recoger el dni de la vista
        $("#listado-alumnos").find("tbody input:checked").each(function (e) {
            var codigo = $(this).val();
            console.log(codigo);
            ajax({url: URL, type: "DELETE", data: {id: codigo}})
                .then(cargarMensaje("El alumno ha sido borrado"), recogerErrorAjax)
                .catch(function errorHandler(error) {

                });
        });
        //2Borrado de la vista
        borradoVista();
        //3 Actulizar el nº de Alumnos
        mostrarNAlumnos();
    });
    $("#myModal button.btn-info,#myModal .close").click(function (e) {
        e.preventDefault();
        $("#myModal").css("display", "none");
    });
    $('#myModal').find(".btn-success").on("click", function (e) {
        e.preventDefault();
        var valido = true;
        var dni = $("#dni").val();
        var nombre = $("#nombre").val();
        var apellido = $("#apellidos").val();
        var nuf1841 = parseInt($("#nuf1841").val());
        var nuf1842 = parseInt($("#nuf1842").val());
        var nuf1843 = parseInt($("#nuf1843").val());
        var nuf1844 = parseInt($("#nuf1844").val());
        var nuf1845 = parseInt($("#nuf1845").val());
        var nuf1846 = parseInt($("#nuf1846").val());

        if (!validarDNI(dni)) {
            // mensajes de error
            valido = false;
        }
        if (!validarTexto(nombre, 3)) {
            valido = false;
        }
        if (!validarTexto(apellido, 7)) {
            valido = false;
        }
        if (!validarNotas(nuf1841)) {
            valido = false;
        }
        if (!validarNotas(nuf1842)) {
            valido = false;
        }
        if (!validarNotas(nuf1843)) {
            valido = false;
        }
        if (!validarNotas(nuf1844)) {
            valido = false;
        }
        if (!validarNotas(nuf1845)) {
            valido = false;
        }
        if (!validarNotas(nuf1846)) {
            valido = false;
        }
        if (valido) {
            //insert en la BBBDD
            var notas = {
                'UF1841': nuf1841,
                'UF1842': nuf1842,
                'UF1843': nuf1843,
                'UF1844': nuf1844,
                'UF1845': nuf1845,
                'UF1846': nuf1846
            };
            /*
             notas[] = ;
             notas[] = ;
             notas['UF1843'] = nuf1843;
             notas['UF1844'] = nuf1844;
             notas['UF1845'] = nuf1845;
             notas['UF1846'] = nuf1846;
             */
            datos = {nombre: nombre, apellidos: apellido, dni: dni, notas: notas};
            console.log(datos);
            var id = '';
            ajax({url: URL, type: "POST", data: datos})
                .then(function (data) {
                    id = data.id;
                    console.log(id);
                    insertarAlumnoTabla(id, nombre, apellido, notas)
                    cargarMensaje("El alumno ha sido Guardado");
                }, recogerErrorAjax)
                .catch(function errorHandler(error) {

                });
            //   addAlumno(dni, nombre, apellido, notas);
            //añadirlo a la tabla

            //actualizar el numero de alumnos
            mostrarNAlumnos();
            $("#myModal").css("display", "none");
        } else {
            console.log("tiene errores");
        }
    });
    function insertarAlumnoTabla(id, nombre, apellido, notas) {
        var html_text = "<tr>" +
            "<td align='center'><input type='checkbox' value='" + id + "'/></td>" +
            "<td>" + nombre + "</td>" +
            "<td>" + apellido + "</td>" +
            "<td>" + notas.UF1841 + "</td>" +
            "<td>" + notas.UF1842 + "</td>" +
            "<td>" + notas.UF1843 + "</td>" +
            "<td>" + notas.UF1844 + "</td>" +
            "<td>" + notas.UF1845 + "</td>" +
            "<td>" + notas.UF1846 + "</td>" +//GET ByID (dni)-->
            "<td>" + calcularMedia([notas['UF1841'], notas['UF1842'], notas['UF1843'], notas['UF1844'], notas['UF1845'], notas['UF1846']]).toFixed(2) + "</td>" +
            "<td align='center'><button>Editar</button></td>" +
            "</tr>";
        $('#listado-alumnos').find('tbody').append(html_text);
        console.log(html_text);
    }

    function mostrarNAlumnos(longitud) {
        //   var trs = $("#listado-alumnos tbody tr").length;

        $('#alumnos').find('div span:eq(0)').text("Número de Alumnos: " + longitud);
    }

    function borradoVista() {
        $('#listado-alumnos').find('tbody tr input:checked').parents('tr').remove();
    }

    $("#formAlumno").submit(function (e) {
        e.preventDefault();
        return false;
    })
});
/*
 function addAlumno(dni, nombre, apellido, notas) {
 dnies.push(dni);
 nombres[dni] = nombre;
 apellidos.push(dni, apellido);
 nUF1841.push(dni, notas['UF1841']);
 nUF1842.push(dni, notas['UF1842']);
 nUF1843.push(dni, notas['UF1843']);
 nUF1844.push(dni, notas['UF1844']);
 nUF1845.push(dni, notas['UF1845']);
 nUF1846.push(dni, notas['UF1846']);
 }
 */
function calcularLetra(numero){
    var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
    var letraCalculada;
    letraCalculada = letras[numero % 23];
    return letraCalculada;
}
/*
 function borradoBBDD(codigo) {
 var i = 0;
 var len = dnies.length;
 var found = false;
 var pos = -1;
 while (i < len && found == false) {
 if (codigo == dnies[i]) {
 found = true;
 pos = i;
 }
 i++;
 }
 if (pos != -1) {
 dnies.splice(pos, 1);
 delete nombres[codigo];
 delete apellidos[codigo];
 delete nUF1841[codigo];
 delete nUF1842[codigo];
 delete nUF1843[codigo];
 delete nUF1844[codigo];
 delete nUF1845[codigo];
 delete nUF1846[codigo];
 //....
 }
 }
 */
function calcularMedia(numeros) {
    var media = 0;
    var len = numeros.length
    for (var i = 0; i < len; i++) {
        if ((numeros[i])) {
            media += parseInt(numeros[i]);
        }
    }
    media = media / len;
    return media;
}
function validarDNI(dni) {
    var REGEX = /^\d{8}[a-zA-Z]$/;// \d ==> [0-9]
    //var REGEX = new RegExp("\d{8}[a-zA-Z]");// \d ==> [0-9]
    //  var len = 9;
    var valido = false;
    if (REGEX.test(dni)) {
        var dniNumero = dni.substring(0, dni.length - 1);
        var dniLetra = dni.substring(dni.length - 1, dni.length).toUpperCase();
        var letraCalculada = calcularLetra(parseInt(dniNumero, 10));
        if (letraCalculada == dniLetra) {
            valido = true;
        }
    }
    return valido;
}
function validarTexto(texto, nLen) {
    var valido = false;
    if (texto.length >= nLen) {
        valido = true;
    }
    return valido;
}
function validarNotas(nota) {
    var valido = false;
    if (nota >= 0 && nota <= 10) {
        valido = true;
    }
    return valido;
}
