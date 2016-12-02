$.noConflict();
var nombres = ["imanol"];
var apellidos = ["jimenez lopez"];
var nUF1841 = new Array();
nUF1841['imanol'] = 5;
var nUF1842 = new Array();
nUF1842['imanol'] = [5];
var nUF1843 = [5];
var nUF1844 = [5];
var nUF1845 = [5];
var nUF1846 = [5];

jQuery(document).ready(function($) {
    function cargarAlumnos() {
        for (var i = 0; i < nombres.length; i++) {
            var nombre = nombres[i];
            var apellido = apellidos[i];
            var html_text = "<tr>" +
                "<td><input type='checkbox' value=''/> </td>" +
                "<td>" + nombre + "</td>" +
                "<td>" + apellido + "</td>" +
                "<td>" + nUF1841[nombre] + "</td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td><button>Editar</button></td>" +
                "</tr>";
            $('#listado-alumnos tbody').append(html_text);
        }
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
        if ($("#listado-alumnos thead input").prop("checked")) {
            $("#listado-alumnos tbody input").prop("checked", true);
        } else {
            $("#listado-alumnos tbody input").prop("checked", false);
        }


    });
    cargarAlumnos();
    /*
    function tracear(){
        // boolean, numericas, texto, Array (Object)
        var valor = $('#busqueda').val();//
        //== equivalente if("5"==5) true
        //=== identico if("5"===5) false
        // && and || or
        //!=
        //!!
        //Urko
        // var genero = 1=="1" ? "hombre" : "mujer";
        console.log(valor);

        $('#busqueda').val("Erasmo");
        valor = $('#busqueda').attr("value");//
        //Urko
        console.log(valor);
        //Erasmo
        valor =   $('#busqueda').val();
        console.log(valor);
    }
     */
    $("a[href='s1'],a[href='#s2']").click(function (e) {
        e.preventDefault();

    });
    $('#productos').find("a.btn").click(function (e) {
        console.log("pasa");
        var dni = $('#dni').val();
        var letra =calcularLetra(parseInt(dni,10));
        $('#productos').find("span.resultado").text(letra);
        e.preventDefault();
        return false;
    });
    //tracear();
});
function calcularLetra(numero){
    var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
    var letraCalculada;
    letraCalculada = letras[numero % 23];
    return letraCalculada;
}

