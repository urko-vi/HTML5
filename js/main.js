$.noConflict();
const URL = "http://localhost:2403/alumnos";
var nAlumno = 0;
jQuery(document).ready(function($) {
    var $tabla = $('#listado-alumnos');
    var $seccionAlumno = $("#alumnos");
    var $formAlumno = $('#formAlumno');
    var $modal = $('#myModal');
    function ajax(opciones) {
        return new Promise(function (resolve, reject) {
            $.ajax(opciones).done(resolve).fail(reject);
        });
    }
    function getPreciseLocation() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(function (position) {
                resolve({latitude: position.coords.latitude, longitude: position.coords.longitude});
            });
        });
    }

    function cargarMapa(coordenadas) {
        console.log(coordenadas);
        var element = document.getElementById('mapa');
        var myCenter = new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude);
        var mapOptions = {
            center: new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude),
            zoom: 14,
            scrollwheel: false
        };
        var infowindow = new google.maps.InfoWindow({
            content: "Aqui estamos."
        });
        var map = new google.maps.Map(element, mapOptions);
        var marker = new google.maps.Marker({position: myCenter});
        marker.setMap(map);
        infowindow.open(map, marker);
    }

    getPreciseLocation()
        .then(cargarMapa)
        .catch(function errorHandler(error) {
            console.log(error);
        });
    function parseData(data) {
        var datos = {};
        datos.id = data.id;
        datos.nombre = data.nombre;
        datos.dni = data.dni;
        datos.apellidos = data.apellidos;
        datos.fNacimiento = data.fNacimiento;
        datos.notas = {};

        if (typeof data.notas !== 'undefined') {
            datos.notas['UF1841'] = data.notas.UF1841;
            datos.notas['UF1842'] = data.notas["UF1842"];
            datos.notas['UF1843'] = data.notas.UF1843;
            datos.notas['UF1844'] = data.notas.UF1844;
            datos.notas['UF1845'] = data.notas.UF1845;
            datos.notas['UF1846'] = data.notas.UF1846;
        } else {
            datos.notas['UF1841'] = "";
            datos.notas['UF1842'] = "";
            datos.notas['UF1843'] = "";
            datos.notas['UF1844'] = "";
            datos.notas['UF1845'] = "";
            datos.notas['UF1846'] = "";
        }
        return datos;
    }

    function calcularMediaClase() {
        var valor = 0;
        var media;
        var n = 0;
        $tabla.find(".media").each(function () {
            var nota = parseFloat($(this).text()) || -1;
            if (nota > -1) {
                valor += nota;
                n++;
            }
        });
        media = valor / n;
        $tabla.find("tfoot tr td:eq(1)").text(media.toFixed(2))
    }

    function cargarAlumnos(data) {
        for (var i = 0; i < data.length; i++) {
            var datos = {};
            datos = parseData(data[i]);
            datosToHTML(datos);
        }
        nAlumno = data.length;
    }

    function cargarMensaje(mensaje) {
        alert(mensaje);
    }
    function datosToHTML(datos) {
        var media = calcularMedia([datos.notas['UF1841'], datos.notas['UF1842'], datos.notas['UF1843'], datos.notas['UF1844'], datos.notas['UF1845'], datos.notas['UF1846']]);
        if (media != '') {
            media = media.toFixed(2);
        }
        var html_text = "<tr>" +
            "<td align='center'><input type='checkbox' value='" + datos.id + "'/></td>" +
            "<td>" + datos.nombre + "</td>" +
            "<td>" + datos.apellidos + "</td>" +
            "<td>" + datos.notas.UF1841 + "</td>" +
            "<td>" + datos.notas.UF1842 + "</td>" +
            "<td>" + datos.notas.UF1843 + "</td>" +
            "<td>" + datos.notas.UF1844 + "</td>" +
            "<td>" + datos.notas.UF1845 + "</td>" +
            "<td>" + datos.notas.UF1846 + "</td>" +//GET ByID (dni)-->
            "<td class='media'>" + media + "</td>" +
            "<td align='center'><button>Editar</button></td>" +
            "</tr>";
        $tabla.find('tbody').append(html_text);
    }
    ajax({url: URL, type: "GET"})
        .then(cargarAlumnos)
        .then(mostrarNAlumnos)
        .then(calcularMediaClase)
        .catch(function errorHandler(error) {
            console.log(error);
        });
    function datosToModal(alumno) {
        $("input#id").val(alumno.id);
        $("input#dni").val(alumno.dni);
        $("input#nombre").val(alumno.nombre);
        $("input#apellidos").val(alumno.apellidos);
        $("input#fNacimiento").val(alumno.fNacimiento);
        $("input#nuf1841").val(alumno.notas.UF1841);
        $("input#nuf1842").val(alumno.notas.UF1842);
        $("input#nuf1843").val(alumno.notas.UF1843);
        $("input#nuf1844").val(alumno.notas.UF1844);
        $("input#nuf1845").val(alumno.notas.UF1845);
        $("input#nuf1846").val(alumno.notas.UF1846);
    }

    $tabla.find('tbody').on("click", "button", function (e) {
        e.preventDefault();
        var id = $(this).parent().siblings("td").find("input").val();
        ajax({url: URL, type: "GET", data: {id: id}})
            .then(function (data) {
                var datos = parseData(data);
                datosToModal(datos);
                $modal.css("display", "block");
            })
            .catch(function errorHandler(error) {
                console.log(error);
            });


    });
    $tabla.find("thead input").click(function (e) {
        e.preventDefault();
        var $input = $tabla.find('tbody input');
        if ($(this).prop("checked")) {
            $input.prop("checked", true);
        } else {
            $input.prop("checked", false);
        }
    });
    //añadir
    $seccionAlumno.find('div button.btn-info').on("click", function (e) {
        e.preventDefault();
        $formAlumno.find('input').val("");
        $formAlumno.find(".error").text('');
        $modal.css("display", "block");
    });
    //borrar
    $seccionAlumno.find("div button.btn-danger").on("click", function (e) {
        e.preventDefault();
        var nAlumnosborrados = 0;
        //0 Recoger el dni de la vista
        $tabla.find("tbody input:checked").each(function () {
            var codigo = $(this).val();
            ajax({url: URL, type: "DELETE", data: {id: codigo}})
                .catch(function errorHandler(error) {
                    console.log(error);
                });
            nAlumnosborrados += 1;
        });
        borradoVista();
        calcularMediaClase();
        mostrarNAlumnos(-nAlumnosborrados);
    });
    // $modal.find("")
    $("#myModal button.btn-info,#myModal .close").click(function (e) {
        e.preventDefault();
        $modal.css("display", "none");
    });
    function modalToData() {
        var datos = {};
        datos.id = $("#id").val();
        datos.dni = $("#dni").val();
        datos.nombre = $("#nombre").val();
        datos.apellidos = $("#apellidos").val();
        datos.fNacimiento = $("#fNacimiento").val();
        datos.notas = {};
        datos.notas.UF1841 = parseInt($("#nuf1841").val()) || '';
        datos.notas.UF1842 = parseInt($("#nuf1842").val()) || '';
        datos.notas.UF1843 = parseInt($("#nuf1843").val()) || '';
        datos.notas.UF1844 = parseInt($("#nuf1844").val()) || '';
        datos.notas.UF1845 = parseInt($("#nuf1845").val()) || '';
        datos.notas.UF1846 = parseInt($("#nuf1846").val()) || '';
        return datos;
    }

    function updateTable(alumno) {
        var $td = $tabla.find("tbody input[value='" + alumno.id + "']").parents("tr");

        var media = calcularMedia([alumno.notas['UF1841'], alumno.notas['UF1842'], alumno.notas['UF1843'], alumno.notas['UF1844'], alumno.notas['UF1845'], alumno.notas['UF1846']]);
        if (media != '') {
            media = media.toFixed(2);
        }
        $td.find("td:nth-child(2)").text(alumno.nombre);
        $td.find("td:nth-child(3)").text(alumno.apellidos);
        $td.find("td:nth-child(4)").text(alumno.notas.UF1841);
        $td.find("td:nth-child(5)").text(alumno.notas.UF1842);
        $td.find("td:nth-child(6)").text(alumno.notas.UF1843);
        $td.find("td:nth-child(7)").text(alumno.notas.UF1844);
        $td.find("td:nth-child(8)").text(alumno.notas.UF1845);
        $td.find("td:nth-child(9)").text(alumno.notas.UF1846);
        $td.find("td:nth-child(10)").text(media);
    }

    $modal.find(".btn-success").on("click", function (e) {
        e.preventDefault();
        var alumno = modalToData();
        if (validarAlumno(alumno)) {

            if (alumno.id == "") {//create
                ajax({url: URL, type: "POST", data: alumno})
                    .then(function (data) {
                        var datos = parseData(data);
                        datosToHTML(datos);
                    })
                    .then(cargarMensaje("El alumno ha sido Creado"))
                    .then(mostrarNAlumnos(1))
                    .then(calcularMediaClase)
                    .catch(function errorHandler(error) {
                        console.log(error);
                    });

            } else {//update
                ajax({url: URL, type: "PUT", data: alumno})
                    .then(function (data) {
                        var datos = parseData(data);
                        updateTable(datos);
                    })
                    .then(cargarMensaje("El alumno ha sido Guardado"))
                    .then(calcularMediaClase)
                    .catch(function errorHandler(error) {
                        cargarMensaje(error.toString());
                    });
            }
            $modal.css("display", "none");
        } else {
            console.log("tiene errores");
        }
    });
    function mostrarNAlumnos(longitud) {
        longitud = typeof longitud === 'undefined' ? 0 : longitud;
        nAlumno += longitud;
        $seccionAlumno.find('div span:eq(0)').text("Número de Alumnos: " + nAlumno);
    }
    function borradoVista() {
        $tabla.find('tbody tr input:checked').parents('tr').remove();
    }

    $formAlumno.submit(function (e) {
        e.preventDefault();
        return false;
    });
    function validarAlumno(alumno) {
        var valido = true;
        if (!validarDNI(alumno.dni)) {
            // mensajes de error
            valido = false;
            $("#dni").siblings("p.error").text("Dni incorrecto");
        }
        if (!validarFechaNacimiento(alumno.fNacimiento)) {
            valido = false;
            $("#fNacimiento").siblings("p.error").text("Fecha de Nacimiento no valida");
        }
        if (!validarTexto(alumno.nombre, 3)) {
            valido = false;
            $("#nombre").siblings("p.error").text("Nombre no valido");
        }
        if (!validarTexto(alumno.apellidos, 7)) {
            valido = false;
            $("#apellidos").siblings("p.error").text("Apellido no valido");
        }
        if (!validarNotas(alumno.notas.UF1841)) {
            valido = false;
            $("#nuf1841").siblings("p.error").text("Nota no valida");
        }
        if (!validarNotas(alumno.notas.UF1842)) {
            valido = false;
            $("#nuf1842").siblings("p.error").text("Nota no valida");
        }
        if (!validarNotas(alumno.notas.UF1843)) {
            valido = false;
            $("#nuf1843").siblings("p.error").text("Nota no valida");
        }
        if (!validarNotas(alumno.notas.UF1844)) {
            valido = false;
            $("#nuf1844").siblings("p.error").text("Nota no valida");
        }
        if (!validarNotas(alumno.notas.UF1845)) {
            valido = false;
            $("#nuf1845").siblings("p.error").text("Nota no valida");
        }
        if (!validarNotas(alumno.notas.UF1846)) {
            valido = false;
            $("#nuf1846").siblings("p.error").text("Nota no valida");
        }
        return valido;
    }
});
function calcularLetra(numero){
    var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
    var letraCalculada;
    letraCalculada = letras[numero % 23];
    return letraCalculada;
}
function calcularMedia(numeros) {
    var media = 0;
    var len = numeros.length;
    var i = 0;
    var count = 0;
    while (i < len) {
        if ((numeros[i]) > 0) {
            media += parseInt(numeros[i]);
            count++;
        }
        i++;
    }
    if (count > 0) {
        media = media / count;
    } else {
        media = '';
    }
    return media;
}
function validarFechaNacimiento(fecha) {
    var valido = false;
    if (fecha != "") {
        var date = new Date();
        var dof = new Date(fecha);

        const jubilacion = 65;
        const mayor = 18;
        var age = date.getFullYear() - dof.getFullYear();
        console.log(age);
        if (age >= mayor && age < jubilacion) {
            valido = true;
        }
    } else {
        valido = true;
    }
    return valido;
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
    if (nota == '' || (nota >= 0 && nota <= 10)) {
        valido = true;
    }
    return valido;
}
