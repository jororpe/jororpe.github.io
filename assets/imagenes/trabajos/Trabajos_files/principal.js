/**
 * @author Jordi Orquin
 * @author Enrique Aleixandre
 *
 *
 */

var principal = (function(document){
  
    function hoverlinks() {
      document.getElementById('current_page').classList.toggle('active');
      this.classList.toggle('active');
    }
    // Menu hover/mouseleave
    var main_nav = document.getElementById('main-nav');
    var elementos = main_nav.getElementsByClassName('nav-link');
    for (var i = 0; i < elementos.length; i++)
    {
        elementos[i].addEventListener('mouseover', hoverlinks);
        elementos[i].addEventListener('mouseleave', hoverlinks);
    }

    // Se puede devolver un objeto con funciones / atributos
    return {};
})(document);
