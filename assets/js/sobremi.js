/**
 * @author Jordi Orquin
 * @author Enrique Aleixandre
 *
 *
 */
var principal = (function(document){
    var umbral_SCROLL = 300;
    var show_indicator = true;

    // Scroll
    window.onscroll = function() {scrollBanner()};
    window.onload = function() {displayScrollIndicator()};
    //Redimensionado de la página
    window.addEventListener('resize', displayScrollIndicator);

    function scrollBanner() {
        if (document.body.scrollTop > umbral_SCROLL || document.documentElement.scrollTop > umbral_SCROLL) {
            document.getElementById("header").style.backgroundColor = "#1c1c1c";
            show_indicator = true;
            displayScrollIndicator();
        }
        else if(document.body.scrollTop <= umbral_SCROLL || document.documentElement.scrollTop <= umbral_SCROLL){
            document.getElementById("header").style.backgroundColor = "";
            show_indicator = false;
            displayScrollIndicator();
        }
        
    }


    function displayScrollIndicator(){

        if  (window.innerWidth > 1400 && !show_indicator)
            document.getElementById("scroll-indicator").style.display = "block";
        else
            document.getElementById("scroll-indicator").style.display = "none";           
    }

    // Se puede devolver un objeto con funciones / atributos
    return {};
})(document);