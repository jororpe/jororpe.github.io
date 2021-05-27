/**
 * @author Jordi Orquin
 * @author Enrique Aleixandre
 *
 */

//import './threex.keyboardstate.js'
import * as THREE from './three.js';
import { OBJLoader } from './OBJLoader.js';


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

    var velocity = 0.6; //Velocidad de desplazamiento del cohce
    let parking_cube = []; //Cubos
    var keyboard //Objeto Teclado que registrará los eventos de este mismos
    const cube_size = 10;
    let parking_positions = [];
    let parking_places = [];
    let parking = {
      cube: new THREE.Object3D,
      x: 0,
      z: 0,
      places: 0
    }
    let parkingArray = [];
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

     /* pointLight = new THREE.PointLight(0xff0000, 20);
      pointLight.position.set(0,2,0);
      
      pointLight.castShadow = true;
      pointLight.shadow.camera.near = 0.1;
      pointLight.shadow.camera.far = 10;*/
    

      renderer = new THREE.WebGLRenderer();
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.BasicShadowMap;
      renderer.setClearColor( 0xa0a0a0 );
      renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

      generateParkings();

      initCameras();

      createFloor();

       //keyboard = new THREEx.Sample()

      loadCar(initCarPosition.x, initCarPosition.z, 0.1);

      document.body.appendChild( renderer.domElement );

      loadData();
    }

    /**
     * Carga la información de los párkings
     */
    function loadData()
    {
      fetch('parkings.json')
      .then(response => response.json())
      .then(data => {
        //leer el objeto data.resources para recoger la información de los parkings
        console.log(data.resources)
        var i = 0;

        while(i < N_parking && i < data.resources.length)
        {
          parking_places[i] = JSON.parse(JSON.stringify(data.resources[i].plazaslib));
          console.log("Parking " + i + " --> " + parking_places[i]);
          i++;
        }
      });
    }

    /**
     * Crea un cubo con textura de párking en la coordenada (X,Z) indicada
     * @param coordx Posición final cubo eje X
     * @param coordy Posición final cubo eje Z
     */
    function createParking(coordx, coordz)
    {
        var cubeGeometry = new THREE.BoxGeometry(cube_size, cube_size, cube_size, 1, 1, 1 );
        var cubeTexture = new THREE.TextureLoader().load( "../images/parking.png" );
        var cubeMaterial = new THREE.MeshPhongMaterial( { map: cubeTexture, side: THREE.DoubleSide } );
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.receiveShadow = true;
        cube.castShadow = true;

        cube.position.y = 5;
        cube.position.x = coordx;
        cube.position.z = coordz;
        

        scene.add(cube);

        return cube;
    }

    /**
     * Crea posiciones válidas para los parkings dentro de la escena
     */
         function generateParkings()
         {
             //Crea posiciones predeterminadas para los parkings
             parking_positions[0] = { x: 40, y: -10};
             parking_positions[1] = { x: -25, y: -25};
             parking_positions[2] = { x: 25, y: 30};
             parking_positions[3] = { x: 25, y: -40};
             parking_positions[4] = { x: -30, y: 25};
             parking_positions[5] = { x: -30, y: 0};
             parking_positions[6] = { x: 5, y: -10};
             parking_positions[7] = { x: -2.5, y: -35};
             parking_positions[8] = { x: 45, y: 12.5};
             parking_positions[9] = { x: 20, y: 12.5};
             parking_positions[10] = { x: 45, y: -40};
             parking_positions[11] = { x: -2.5, y: 10};
     
             var n = parking_positions.length;
             var i = 0;
             var hist = [];
     
             while(i < N_parking)
             {
                 //Generamos número aleatorio
                 var random = Math.floor(Math.random() * n);
     
                 //Comprobamos que no se repite el número aleatorio
                 // y generamos en cubo/párking en dicha posición aleatoria "predeterminada"
                 if(!hist.includes(random))
                 {
                     parking_cube[i] = createParking(parking_positions[random].x, parking_positions[random].y);
                     i++;
                     hist.push(random);
                 }
             }
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


          const Helper = new THREE.AxesHelper( 200 );
             object.add( Helper );
          object.position.y = 0;
          object.add(camera_sub);
          //object.add(pointLight);
          scene.add( object );
      }

      var manager = new THREE.LoadingManager( onLoad );

      var textureLoader = new THREE.TextureLoader( manager );

      var texture = textureLoader.load( '../images/1377Car.png');
      // model
      var loader = new OBJLoader( manager );

      loader.load( '1377Car.obj', function ( obj ) {

        object = obj;
        resetCarPosition();

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
        var floorTexture = new THREE.TextureLoader().load( "../images/city.jpg" );
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
      for(var i = 0; i < parking_cube.length; i++)
      {
        try{
            var distancia = calculateDistance(parking_cube[i].position, object.position)
    
            if(distancia < cube_size){
              console.log("Colisiona con cubo " + i);
              resetCarPosition();
              parking_places[i]--;
            }

        }catch(e){}
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
