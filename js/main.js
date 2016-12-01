$.noConflict();

jQuery(document).ready(function($) {
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

