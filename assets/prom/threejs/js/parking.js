/***************************************************************
 *                     CLASE PARKING
 **************************************************************/
import * as THREE from './three.js';
export default class Parking
{
  constructor(_x, _z, _name, _places, _maxPlaces, cube_size, font, scene)
  {
    this.x = _x;
    this.z = _z;
    this.places = _places;
    this.maxPlaces = _maxPlaces
    this.name = _name;
    this.textmesh;
    this.color;
    this.cube;
    this.group;

    this.init(scene, cube_size, font);
  }

  getCubePosition()
  {
    return this.cube.position;
  }

  setName(_n)
  {
    this.name = _n;
    return this;
  }

  getPlaces(_p)
  {
    return this.places;
  }

  isFree()
  {
    return this.places > 0;
  }

  park() {
    if (this.isFree())
    {
      this.places--;
      return true;
    } else {
      return false;
    }
  }

  leave() {
    this.places++;
  }

  init(scene, cube_size, font) {
    this.group = new THREE.Group();
  
    this.updateColor().initCube(cube_size).initFont(font);
    
    scene.add(this.group);
  }

  initCube(cube_size) {
    var cubeGeometry = new THREE.BoxGeometry(cube_size, cube_size, cube_size, 1, 1, 1 );
    var cubeTexture = new THREE.TextureLoader().load( "./images/parking.png" );
    var cubeMaterial = new THREE.MeshPhongMaterial( { map: cubeTexture, side: THREE.DoubleSide } );
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.receiveShadow = true;
    this.cube.castShadow = true;

    this.cube.position.set(this.x, 5, this.z);

    this.group.add(this.cube);

    return this;
  }

  initFont(font) {

      this.initPlacesFont(font);

      // Esto es el nombre del párking, que nunca cambia de color
      var textgeo = new THREE.TextGeometry(this.name, {
        font,
        size: 2,
        height: 2,
        curveSegments: 12
      });

      var textmaterial = new THREE.MeshPhongMaterial( { color: 0x102030 } );

      var textmesh = new THREE.Mesh( textgeo, textmaterial );
      textmesh.position.set( this.x, 13, this.z );
      this.group.add(textmesh);

      return this;
  }
  /**
   * Actualiza el texto de las plazas
   * @param {} font 
   * @returns this
   */
  initPlacesFont(font) {
    
    
    var textgeo = new THREE.TextGeometry(this.places.toString(), {
      font,
      size: 2,
      height: 2,
      curveSegments: 12
    });

    var textmaterial = new THREE.MeshPhongMaterial( { color: this.color } );

    this.textmesh = new THREE.Mesh( textgeo, textmaterial );
    this.textmesh.position.set( this.x, 10, this.z );
    this.group.add(this.textmesh);

    return this;
  }

  updateColor() {
    if (this.places > this.maxPlaces * 0.5)
    {
      this.color = 0x009900;
    }
    else if (this.places > this.maxPlaces * 0.2)
    {
        this.color = 0xf9d71c;
    }
    else
    {
      this.color = 0x990000;
    }

    return this;
  }

  update(font) {
    this.group.remove(this.textmesh);
    this.updateColor();
    this.initPlacesFont(font);
  }
}
