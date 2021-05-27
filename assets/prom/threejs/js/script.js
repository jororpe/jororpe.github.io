/**
 * @author Jordi Orquin
 * @author Enrique Aleixandre
 *
 */

//import './threex.keyboardstate.js'
import * as THREE from './three.js';
import { OBJLoader } from './OBJLoader.js';
import Parking from './parking.js';

 var script = (function(window, document){

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var renderer;
    var scene;
    var active_cam, //Indica la cámara activa de la escena en todo momento
        camera_general, //Cámara que ofrece plano general de la escena
        camera_sub; //Cámara que ofrece el punto de visto del coche

    //Objeto 3D que representa el suelo de la escena
    var floor;
    var floorWidth = 100;

    //Objeot 3D que representa el coche de la escena
    var object;
    var initCarPosition = { //Posición inicial del coche
      x: 25,
      z: -10
    }
    // Fuente
    let _font;
    var velocity = 0.6; //Velocidad de desplazamiento del coche
    const cube_size = 10;
    let parkings = [];

    const N_parking = 5; //Número de párkings a generar

    var car_movement = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    window.addEventListener('keydown', changeCamera);
    window.addEventListener('keydown', onTurning);
    window.addEventListener('keyup', onTurning);
    init();
    animate();


    /**
     * CREA E INICIALIZA VALORES DE LA ESCENA
     *  1) Renderer
     *  2) Cámara
     *  3) Escena
     *  4) Objetos
     *  5) Añade Objetos
     *  6) Añade Renderer
     */
    function init()
    {
      scene = new THREE.Scene();
      var ambientLight = new THREE.AmbientLight( 0xffffffff, 0.9 );
			scene.add( ambientLight );
      loadFont();
     


      renderer = new THREE.WebGLRenderer();
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.BasicShadowMap;
      renderer.setClearColor( 0xa0a0a0 );
      renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
      initCameras();

      generateParkings();

      createFloor();

       //keyboard = new THREEx.Sample()

      loadCar(initCarPosition.x, initCarPosition.z, 0.1);

      document.body.appendChild( renderer.domElement );

      //loadData();
    }

    /**
     * Cargar la fuente
     */
    function loadFont()
    {
      const loader = new THREE.FontLoader();
				loader.load( 'helvetiker_regular.typeface.json', function ( response ) {

					_font = response;

				} );
    }

    /**
     * Crea posiciones válidas para los parkings dentro de la escena
     */
        async function generateParkings()
         {
           const max = floorWidth / 2 - cube_size;
           const min = -floorWidth / 2 + cube_size;

           let parkingsData = await fetch('parkings.json')
                              .then(response => response.json())
                              .then(data => data.resources);

           let i = 0;
           while (i < N_parking && i  < parkingsData.length)
           {
             let rand_x = Math.random() * (max - min) + min;
             let rand_z = Math.random() * (max - min) + min;

             if (!checkParkingPosition(rand_x, rand_z))
              continue; // El parking no tiene una posición correcta 
            
             let parking = new Parking(rand_x,
                                       rand_z,
                                       parkingsData[i].nombre,
                                       parkingsData[i].plazaslib,
                                       parkingsData[i].plazastot,
                                       cube_size,
                                       _font,
                                       scene,
                                       active_cam);
             parkings.push(parking);
             i++;
           }
         }
    /**
     * Comprueba si las posiciones recibidas están muy cerca de los parkings existentes
     */
    function checkParkingPosition(x, z)
    {
      let res = true;
      const obj = {x, y: 0, z}
      for (let i = 0; i < parkings.length && res; i++)
      {
        if (calculateDistance(parkings[i], obj) < 2*cube_size)
          res = false;
      }

      return res;
    }

    /**
     * Carga el coche en la escena
     */
    function loadCar(coordx, coordz, scale)
    {
      function onLoad() {

          object.traverse( function ( child ) {
              if ( child.isMesh ) child.material.map = texture
          } );

          object.position.y = 0;
          object.add(camera_sub);
          //object.add(pointLight);
          scene.add( object );
      }

      var manager = new THREE.LoadingManager( onLoad );

      var textureLoader = new THREE.TextureLoader( manager );

      var texture = textureLoader.load( './images/1377Car.png');
      // model
      var loader = new OBJLoader( manager );

      loader.load( '1377Car.obj', function ( obj ) {

        object = obj;
        //resetCarPosition();

        object.scale.x = object.scale.y = object.scale.z = scale;
      });
    }

    /**
    * Función que controla la rotación del coche al pulsar las flechas
    **/
    function onTurning(e) {
      if (e.type === "keydown")
      {
        switch (e.key) {
          case "ArrowDown":
            car_movement.down = true;
            break;
          case "ArrowUp":
            car_movement.up = true;
            break;
          case "ArrowLeft":
            car_movement.left = true;
            break;
          case "ArrowRight":
            car_movement.right = true;
        }
      }
      else if (e.type === "keyup")
      {
        switch (e.key) {
          case "ArrowDown":
            car_movement.down = false;
            break;
          case "ArrowUp":
            car_movement.up = false;
            break;
          case "ArrowLeft":
            car_movement.left = false;
            break;
          case "ArrowRight":
            car_movement.right = false;
        }
      }
    }

    /**
     * Creates a Plane with city texture
     */
    function createFloor()
    {
        var floorGeometry = new THREE.PlaneGeometry(floorWidth, floorWidth);
        var floorTexture = new THREE.TextureLoader().load( "./images/city.jpg" );
        var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        floor = new THREE.Mesh( floorGeometry, floorMaterial );
        scene.add( floor );

        floor.rotation.z = Math.PI / 2;
        floor.rotation.x = Math.PI / 2;
        floor.receiveShadow = true;

        scene.add(floor);
    }
    /**
     * Inicializa las cámaras de la escena
     *
     * Camera_general: cámara principal de la escena. Enfoca desde arriba del suelo
     * Camera_sub: cámara subjetiva del coche.
     */
    function initCameras()
    {
        camera_general = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000 );
        camera_general.position.y = 80;
        camera_general.position.z = 0;;
        camera_general.rotation.x = -Math.PI / 2;

        camera_sub = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000 );

        active_cam = camera_general;
    }

    function animate()
    {
        requestAnimationFrame( animate );

        collisionDetect();
        checkCarPosition();

        if (car_movement.up)
          object.translateZ(velocity);
        if (car_movement.down)
          object.translateZ(-velocity);
        if (car_movement.left)
          object.rotateY(0.08);
        if (car_movement.right)
          object.rotateY(-0.08);


        if(active_cam == camera_sub)
          configSubjectiveCam();

        render();
    }

    /**
     * Comprueba si el coche se sale del escenario y lo resitúa
     */
    function checkCarPosition()
    {
      try{
          if(object.position.z + velocity + 5 > floorWidth/2 || object.position.z - velocity - 5 < -floorWidth/2)
            object.position.z = -object.position.z;

          if(object.position.x + velocity + 5 > floorWidth/2 || object.position.x - velocity - 5 < -floorWidth/2)
            object.position.x = -object.position.x;
      }catch(e){}
    }

    /**
     * Detecta si se ha producido una colisión entre el objeto coche
     * y los distintos párkings del escenario
     */
    function collisionDetect()
    {
      if (object === undefined) return;
      
      let collision = false;

      for (let i = 0; i < parkings.length && !collision; i++)
      {
         let distancia = calculateDistance(parkings[i].getCubePosition(), object.position);

        if (distancia < cube_size)
          if (parkings[i].park())
          {
            parkings[i].update(_font);
            resetCarPosition();
            collision = true;
          }
      }
    }

    /**
     * Establece la posición del coche en su posición inicial
     */
    function resetCarPosition()
    {
      object.position.x = initCarPosition.x;
      object.position.z = initCarPosition.z;
    }

    /**
     * Devuelve la distancia entre dos puntos del espacio
     * @param obj1 Objeto 1
     * @param obj2 Objeto 2
     * @returns Módulo de la distancia entre posiciones de ambos objetos
     */
    function calculateDistance(obj1, obj2)
    {
      var dist = {
        x: obj1.x - obj2.x,
        y: obj1.y - obj2.y,
        z: obj1.z - obj2.z
      };

      return Math.sqrt( (dist.x*dist.x) + (dist.y*dist.y) + (dist.z*dist.z) );
    }

    /**
     * Establece los valores de la cámara de modo que enfoque
     * en la perspectiva de tercera persona
     */
    function configSubjectiveCam()
    {
      camera_sub.lookAt(object.position);
      camera_sub.position.y = 100;
      camera_sub.position.z = -80;
      camera_sub.rotation.x -= 0.3;
    }

    function render()
    {
        renderer.render( scene, active_cam );
    }

    function changeCamera(event)
    {
        if (event.key == 'C' || event.key == 'c')
        {
            if(active_cam == camera_sub)
                active_cam = camera_general;
            else
                active_cam = camera_sub;
        }
    }

    // Se puede devolver un objeto con funciones / atributos
    return {};
})(window, document);
