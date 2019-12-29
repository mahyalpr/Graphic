import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const style = {
  height: 500, // we can control scene size by setting container dimensions
 
};

class Another extends React.Component{
    componentDidMount() {
        this.sceneSetup();
        this.addCustomSceneObjects();
        this.startAnimationLoop();
        window.addEventListener("resize", this.handleWindowResize);
      }
      componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        this.controls.dispose();
      }
       // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  sceneSetup = () => {
      
    // get container dimensions and use them for scene sizing
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.scene = new THREE.Scene();
    const near = 0.5;
    const far = 7;
    const color = 'lightblue';
    this.scene.fog = new THREE.Fog(color, near, far);
    this.scene.background = new THREE.Color(color);
    this.camera = new THREE.PerspectiveCamera(
      100, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      5000 // far plane
    );
    this.camera.position.z =7; // is used here to set some distance from a cube that is located at z = 0
    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls
    this.controls = new OrbitControls(this.camera, this.el);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.el.appendChild(this.renderer.domElement); // mount using React ref
  };

    // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry
  addCustomSceneObjects = () => {
    const loader = new THREE.TextureLoader();
    var loaderModel = new GLTFLoader();
    let _this=this;
    loaderModel.load('https://huan1tech.github.io/img/suicune.gltf', function ( gltf ) {
      gltf.scene.scale.set( 0.02, 0.02, 0.02 );
      gltf.scene.position.x = 2;				    //Position (x = right+ left-)
      gltf.scene.position.y = 0;				    //Position (y = up+, down-)
      gltf.scene.position.z = 3;
    _this.scene.add( gltf.scene );
      gltf.scene.traverse(function (mesh) {
        if (mesh instanceof THREE.Mesh) {

          gltf.push(mesh);
        }

    });


}, undefined, function (error) {

    console.error("e",error);

    
    });

    this.geom = new THREE.Geometry();
    const v=[]
     v[0] = new THREE.Vector3(0,0,0);
     v[1] = new THREE.Vector3(1,0,0);
     v[2] = new THREE.Vector3(1,1,0);

this.geom.vertices.push(v[0]);
this.geom.vertices.push(v[1]);
this.geom.vertices.push(v[2]);

this.geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
this.geom.computeFaceNormals();

this.triangle = new THREE.Mesh( this.geom, new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
}) );
this.triangle.castShadow = true; //default is false
this.triangle.receiveShadow=false;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
        color: 0x156289,
      //   emissive: 0x072534,
        side: THREE.DoubleSide,
      //   flatShading: true
      });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.castShadow = true; //default is false
    this.cube.receiveShadow = false;

    const groundGeometry = new THREE.BoxGeometry(10, 5, 0.5);
    const groundMaterial = new THREE.MeshLambertMaterial({
       map: loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg'),
        // color: 0xFF0000
      });
 
    this.ground = new THREE.Mesh(groundGeometry,groundMaterial)
    this.ground.receiveShadow = true;
    
 


    this.scene.add(this.cube);
    this.scene.add(this.ground);
    this.scene.add(this.triangle);

    this.triangleContainer = new THREE.Object3D();
    this.triangleContainer.add( this.triangle );
    

    this.ground.position.set(1,1,1)
    this.cube.position.set(0,2,3)
    this.triangle.position.set(0,1,1)
    this.triangleContainer.position.copy(this.cube.position)

    this.scene.add(this.triangleContainer)

    const lights = [];
    // lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    // lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    // lights[2] = new THREE.PointLight(0xffffff, 1, 0);
    lights[3] = new THREE.AmbientLight(0x404040);
    lights[4] = new THREE.DirectionalLight( 0xffffff, 1);
    lights[5] = new THREE.SpotLight( 0xffffff );
    
      




    // lights[0].position.set(0, 200, 0);
    // lights[1].position.set(100, 200, 100);
    // lights[2].position.set(-100, -200, -100);
    // lights[4].position.set( 1, 20, 10 );
    // lights[4].castShadow = true;
    lights[5].position.set( 2, 2, 10 ); 
    lights[5].castShadow=true;
   

    // this.scene.add(lights[0]);
    // this.scene.add(lights[1]);
    // this.scene.add(lights[2]);
    this.scene.add(lights[3]);
    // this.scene.add(lights[4]);
    this.scene.add( lights[5] );

    // this.spotLightHelper = new THREE.SpotLightHelper( lights[5] );
    // this.scene.add( this.spotLightHelper );
    
//     lights[4].shadow.mapSize.width = 1000;  // default
// lights[4].shadow.mapSize.height = 512; // default
// lights[4].shadow.camera.near = 0.5;    // default
// lights[4].shadow.camera.far = 500; 
  };

  startAnimationLoop = () => {
    this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    // this.triangle.rotation.y +=0.01
    this.triangleContainer.rotation.z += 0.05;
    // this.triangle.translate(0, 1, 2);
    this.renderer.render(this.scene, this.camera);

    // The window.requestAnimationFrame() method tells the browser that you wish to perform
    // an animation and requests that the browser call a specified function
    // to update an animation before the next repaint
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    this.camera.updateProjectionMatrix();
  };
    render(){
        return(
           <div style={style} ref={ref => (this.el = ref)} />
        )
    }
}
export default Another;