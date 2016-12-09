/*
 0º limpiar campos de la ventana modal antes de mostrar
 1º ventana modal: Guardar y Cancelar (cierre sin hacer nada)
 2º formulario en la ventana modal --> nombre, dni, apellidos y las notas de todos los modulos
 3º Validacion JavaScript: notas entre 0 y 10(si esta con datos), nombre al 3 caracteres, apellidos al 7, dni con 9 caracteres.
 4.1º Si esta bien se añade a la vista
 4.2º Si esta mal se muestra el error en la ventana modal
 5º se Añade a la BBDD (Array)
 6º Se oculta la ventana modal
 */

$.noConflict();
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

jQuery(document).ready(function($) {
    function cargarAlumnos() {
        var cantidad = dnies.length;
        for (var i = 0; i < cantidad; i++) {
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
            insertarAlumnoTabla(dni, nombre, apellido, notas);
        }
        mostrarNAlumnos();
    }

    $("#listado-alumnos tbody button").click(function (e) {
        alert("HAs pulsado en editar click");
    });
    $("#listado-alumnos tbody").on("click", "button", function (e) {
        alert("HAs pulsado en editar con ON");
    });
    $("#listado-alumnos thead input").click(function (e) {
        // $("#listado-alumnos tbody input[type='checkbox']").checked(true);
        //attr vs (prop e is) ---> tiempo de carga
        // prop vs is ---> prop identifica elementos cargados dinamicamente mientras is no

        if ($(this).prop("checked")) {
            $("#listado-alumnos tbody input").prop("checked", true);
        } else {
            $("#listado-alumnos tbody input").prop("checked", false);
        }
    });
    cargarAlumnos();
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
    $("#alumnos div button.btn-info").on("click", function (e) {
        $("#formAlumno input").val("");
        $("#myModal").css("display", "block");
        //$("#myModal").css("display");
        //$("#myModal").addClass("");
        //$("#myModal").removeClass("")


    });
    $("#alumnos div button.btn-danger").on("click", function (e) {
        //0 Recoger el dni de la vista
        $("#listado-alumnos tbody input:checked").each(function (e) {
            var codigo = $(this).val();
            //1 Borrado de la BBDD
            borradoBBDD(codigo);
        });
        //2Borrado de la vista
        borradoVista();
        //3 Actulizar el nº de Alumnos
        mostrarNAlumnos();
    });
    $("#myModal button.btn-info,#myModal .close").click(function (e) {
        $("#myModal").css("display", "none");
    });
    $("#myModal .btn-success").on("click", function (e) {
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
            var notas = new Array();
            notas['UF1841'] = nuf1841;
            notas['UF1842'] = nuf1842;
            notas['UF1843'] = nuf1843;
            notas['UF1844'] = nuf1844;
            notas['UF1845'] = nuf1845;
            notas['UF1846'] = nuf1846;
            addAlumno(dni, nombre, apellido, notas);
            //añadirlo a la tabla
            insertarAlumnoTabla(dni, nombre, apellido, notas)
            //actualizar el numero de alumnos
            mostrarNAlumnos();
            $("#myModal").css("display", "none");
        } else {
            console.log("tiene errores");
        }
    });
    function insertarAlumnoTabla(dni, nombre, apellido, notas) {
        var html_text = "<tr>" +
            "<tr>" +
            "<td align='center'><input type='checkbox' value='" + dni + "'/></td>" +
            "<td>" + nombre + "</td>" +
            "<td>" + apellido + "</td>" +
            "<td>" + notas['UF1841'] + "</td>" +
            "<td>" + notas['UF1842'] + "</td>" +
            "<td>" + notas['UF1843'] + "</td>" +
            "<td>" + notas['UF1844'] + "</td>" +
            "<td>" + notas['UF1845'] + "</td>" +
            "<td>" + notas['UF1846'] + "</td>" +//GET ByID (dni)-->
            "<td>" + calcularMedia([notas['UF1841'], notas['UF1842'], notas['UF1843'], notas['UF1844'], notas['UF1845'], notas['UF1846']]).toFixed(2) + "</td>" +
            "<td align='center'><button>Editar</button></td>" +
            "</tr>";
        $('#listado-alumnos tbody').append(html_text);
    }
    function mostrarNAlumnos() {
        $("#alumnos div span:eq(0)").text("Número de Alumnos: " + dnies.length)
    }

    function borradoVista() {
        $("#listado-alumnos tbody tr input:checked").parents("tr").remove();
    }

    $("#formAlumno").submit(function (e) {
        return false;
    })
    //tracear();
});
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
function calcularLetra(numero){
    var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
    var letraCalculada;
    letraCalculada = letras[numero % 23];
    return letraCalculada;
}
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
function calcularMedia(numeros) {
    var media = 0;
    var len = numeros.length
    for (var i = 0; i < len; i++) {
        media += numeros[i];
    }
    media = media / len;
    return media;
}
function validarDNI(dni) {
    var REGEX = /^\d{8}[a-zA-Z]$/;// \d ==> [0-9]
    //var REGEX = new RegExp("/^\d{8}[a-zA-Z]$/");// \d ==> [0-9]
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
