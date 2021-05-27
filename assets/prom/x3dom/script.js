/**
 * @author Jordi Orquin
 * @author Enrique Aleixandre
 *
 *
 */

 var script = (function(window, document){


    var id = 0;
    var selected;

    document.getElementById('Insert').addEventListener('click', insertarFigura);
    document.getElementById('Modify').addEventListener('click', modificarFigura);

    function insertarFigura(event)
    {
        event.preventDefault();
        var typeShape = getTypeShape();

        trans = document.createElement('Transform');
        shape = document.createElement('shape');
        material = document.createElement('material');
        appearance = document.createElement('appearance');
        model = document.createElement(typeShape);


        // Asignación de atributos
        for (var [attr, value] of Object.entries(getShapeAttributes(typeShape)))
        {
          model.setAttribute(attr, value);
        }

        trans.setAttribute("translation", getTranslation());

        // Asignación de la idea
        trans.setAttribute("id", id);


        // Asignación de evento click
        //shape.addEventListener("click", onSelectedEvent, false);
        shape.setAttribute("onclick", "script.onSelectedEvent(" + id + ")");
        id++;

        material.setAttribute("diffuseColor", getShapeColor());

        appearance.appendChild(material);
        shape.appendChild(appearance);
        shape.appendChild(model);
        trans.appendChild(shape);

        document.getElementsByTagName('scene')[0].appendChild(trans);
    }

    /**
    * Comprueba cada checkbox para ver qué figura se quiere instanciar
    **/
    function getTypeShape()
    {
        var shape;
        var form = document.getElementById("form");
        var box = form.querySelector("#box"),
            sphere = form.querySelector("#sphere"),
            cone = form.querySelector("#cone"),
            torus = form.querySelector("#torus");


        if (box.checked) {
          shape = box.value;
        } else if (sphere.checked) {
          shape = sphere.value;
        } else if (cone.checked) {
          shape = cone.value;
        } else if (torus.checked) {
          shape = torus.value;
        }

        return shape;
    }

    /**
    * Obtiene los atributos necesarios según el tipo de figura
    **/
    function getShapeAttributes(shape)
    {
      var form = document.getElementById("form");

      var attrs = {

      };

      switch (shape)
      {
        case "box":
          var side = form.querySelector("#Lado").value;
          attrs["size"] = side + " " + side + " " + side;
          break;
        case "sphere":
          var radius = form.querySelector("#RadioEsfera").value;
          attrs["radius"] = radius;
          break;
        case "cone":
          var radius = form.querySelector("#RadioCono").value;
          var height = form.querySelector("#AltoCono").value;

          attrs["bottomRadius"] = radius;
          attrs["height"] = height;

          break;
        case "torus":
          var rint = form.querySelector("#Rint").value;
          var rout = form.querySelector("#Rext").value;
          attrs["innerRadius"] = rint;
          attrs["outerRadius"] = rout;
          break
      }

      return attrs;
    }

    function getTranslation() {
        var form = document.getElementById("form");

        var translation = form.querySelector("#posX").value + " " + form.querySelector("#posY").value + " " + form.querySelector("#posZ").value;

        return translation;
    }

    /**
    * Devuelve el color elegido en el inuput para figuras nuevas
    **/
    function getShapeColor()
    {
      return document.getElementById("color").value;
    }

    /**
    * Establece el objeto seleccionado como la id del shape al que se ha hecho click
    **/
    function onSelectedEvent(id) {
      try {
        var trans = document.getElementById(selected),
          material = trans.querySelector("material");

          material.setAttribute("transparency", "0.0");
      } catch (e) {
          console.warn("No había figura seleccionada");
      }

      selected = id;

      var trans = document.getElementById(selected),
          material = trans.querySelector("material");

      material.setAttribute("transparency", "0.4");
    }
    /**
     * Modifica los atributos de la figura seleccionada,
     * según los datos recogidos en el formulario
     */
    function modificarFigura(event)
    {
        event.preventDefault();
        var newColor = getNewColor();
        var newTranslateValue = getNewTranslate();
        var newScaleValue = getNewScale();

        try{
            var trans = document.getElementById(selected);

            trans.querySelector('material').setAttribute('diffuseColor', newColor);
            trans.setAttribute('translation', newTranslateValue);
            trans.setAttribute('scale', newScaleValue);
        } catch(e){
            console.warn("No había figura seleccionada");
        }

    }

    /**
     * Devuelve el nuevo valor del color del formulario
     * @returns Color en formato hexadecimal
     */
    function getNewColor()
    {
        return (document.getElementById('cambiarColor').value);
    }

    /**
     * Recoge el nuevo valor de traslacion del formulario
     * @returns valores "X Y Z" del traslado
     */
    function getNewTranslate()
    {
        var X = document.getElementById('posXT').value;
        var Y = document.getElementById('posYT').value;
        var Z = document.getElementById('posZT').value;

        var value = X + " " + Y + " " + Z;

        return value;
    }

    /**
     * Recoge el nuevo valor de escalado del formulario
     * @returns valores "X Y Z" del escalado
     */
    function getNewScale()
    {
        var X = document.getElementById('posXE').value;
        var Y = document.getElementById('posYE').value;
        var Z = document.getElementById('posZE').value;

        var value = X + " " + Y + " " + Z;

        return value;
    }

    // Se puede devolver un objeto con funciones / atributos
    return {onSelectedEvent: onSelectedEvent};
})(window, document);
