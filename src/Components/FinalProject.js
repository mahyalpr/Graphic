import React, {Component} from "react";
import ReactDOM from "react-dom";
import MaterialIcon from '@material/react-material-icon';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import './style.css'
const style = {
    height: 800, 

};
var MeshList = [];

var clock = new THREE.Clock();
var delta = clock.getDelta();
var moveDistance = delta*200;

class FinalProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            left: false,
            right: false,
            lost: false,
            intervalTime: 3000,
            level: 1,
            boxCounter: 0,
            lifeCounter: 3
        }
        this.sceneSetup = this.sceneSetup.bind(this)
        this.leftRight = this.leftRight.bind(this);
        this.setGame = this.setGame.bind(this)
        this.move = this.move.bind(this)
        this.checkCondition = this.checkCondition.bind(this)
        this.collisionDetect=this.collisionDetect.bind(this)
    }

    leftRight = () => {
        let _this = this;
        window.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                _this.setState({left: true}, function () {
                    console.log("left", _this.state.left)
                })
            }
            if (e.key === 'ArrowRight') {
                _this.setState({right: true}, function () {
                    console.log("left", _this.state.right)
                })
            }
            e.preventDefault();
        }, false);

        window.addEventListener('keyup', function (e) {
            if (e.key === 'ArrowLeft') {
                _this.setState({left: false}, function () {
                    console.log("left", _this.state.left)
                })
            }
            if (e.key === 'ArrowRight') {
                _this.setState({right: false}, function () {
                    console.log("left", _this.state.right)
                })
            }
            e.preventDefault();
        }, false);
    }

    componentDidMount() {
        this.sceneSetup();
        this.addCustomSceneObjects();
        this.startAnimationLoop();
        this.setGame()
        this.leftRight()
        window.addEventListener("resize", this.handleWindowResize);
       
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);

    }

    move = () => {
        let _this = this;
        if (_this.state.left) {
            if (_this.char.position.x > 0) {
                _this.camera.translateX();
                _this.camera.position.x += -.1;
                _this.char.position.x += -.1;
            }
        }

        if (_this.state.right) {
            if (_this.char.position.x < 5) {
                _this.camera.position.x += .1;
                _this.char.position.x += .1;
            }
        }
    }

    sceneSetup = () => {
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;
        this.scene = new THREE.Scene();
        const r = "./texture/";
      const urls = [
    r + "download.jpg",
    r + "download.jpg",
    r + "download.jpg",
    r + "download.jpg",
    r + "download.jpg",
    r + "download.jpg"
];

var skyBox = new THREE.CubeTextureLoader().load(urls);

        
        const near = 0.5;
        const far = 7;
        const color = 'black';
        this.scene.background = skyBox;
        this.camera = new THREE.PerspectiveCamera(
            75, // fov = field of view
            width / height, // aspect ratio
            0.1, // near plane
            1000  // far plane
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.el.appendChild(this.renderer.domElement); // mount using React ref
    };


    addCustomSceneObjects = () => {
       const loader = new THREE.TextureLoader();
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var charGeometry = new THREE.BoxGeometry(1, 2, 1);

        var material = new THREE.MeshLambertMaterial(0x000000);

        this.char = new THREE.Mesh(charGeometry, material);
        this.scene.add(this.char);
        this.char.position.x = 2.5;

        this.box = new THREE.Mesh(geometry, material);


        const lights = [];
        lights[1] = new THREE.PointLight(0xFFFFff);
        lights[1].position.set(5, 10, 25);
        this.scene.add(lights[1]);

        // lftlight
        lights[2] = new THREE.PointLight(0xFFFFff);
        lights[2].position.set(25, 10, 25);
        this.scene.add(lights[2]);
        //  rightLight
        lights[3] = new THREE.PointLight(0xFFFFff);
        lights[3].position.set(-25, 10, 25);
        this.scene.add(lights[3]);


        var size = 60;
        var divisions = 10;

        var gridHelper = new THREE.GridHelper(size, divisions);
        gridHelper.position.x = 2.5;
        gridHelper.position.y = -1;
        gridHelper.position.z = -29.5;
        this.scene.add(gridHelper);
        gridHelper.scale.x = .107;

        
    };

    setGame = () => {
        window.removeEventListener('click', this.setGame);

        for (let j = 1; j < 4; j++) {
            const life = document.getElementById('life' + j);
            life.style.display = 'inline-block';
        }

        document.getElementById('lost').style.display = 'none';
        ;
        this.setState({lost: false})

        this.checkCondition(this.state.intervalTime, this);
    }

    checkCondition = (interval, that) => {
        let spawnInterval = setInterval(function () {
            if (that.state.lost) {
                const lostTitle = document.getElementById('lost');
                lostTitle.style.display = 'block';
                that.setState({level:1},function(){
                    const levelTitle = document.getElementById('level');
                    levelTitle.innerHTML = `<h1>مرحله:${ that.state.level }</h1>`;
                })
                clearInterval(spawnInterval);
                window.addEventListener('click', that.setGame, false);
            } else if (that.state.boxCounter === 5) {
                that.setState({boxCounter: 0, level: that.state.level + 1, intervalTime: that.state.intervalTime - 50})
                that.checkCondition(interval, that);
                const levelTitle = document.getElementById('level');
                levelTitle.innerHTML = `<h1>مرحله:${ that.state.level }</h1>`;
                clearInterval(spawnInterval);
            } else {
                that.setState({boxCounter: that.state.boxCounter + 1})
                MeshList.push(that.box);
                that.scene.add(that.box);
                that.box.position.z = -30;
                that.box.position.x = Math.random() * 5.5;
            }
        }, interval);
    }




     collisionDetect=() => {
      var originPoint = this.char.position.clone();
      for (var vertexIndex = 0; vertexIndex < this.char.geometry.vertices.length; vertexIndex++) {
          var directionVector = new THREE.Vector3( 0, 0, 1 );
  
          var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
          var collisionResults = ray.intersectObjects(MeshList);
          if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
              MeshList=[];
              const life = document.getElementById('life' + this.state.lifeCounter);
              life.style.display = 'none';
              this.setState({lifeCounter:this.state.lifeCounter-1})
              if (this.state.lifeCounter === 0) {
                this.setState({lifeCounter:3,lost:true})
                  
              }
          }
      }
  }
    startAnimationLoop = () => {
       
        this.box.position.z += .2 * (this.state.level);

        this.collisionDetect()
        this.move();
        
        this.camera.position.set(2.5, 2, 10);
    
        this.renderer.render(this.scene, this.camera);
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    handleWindowResize = () => {
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };

    render() {
        return (
            <div style={style} ref={ref => (this.el = ref)}>
                <div className='lives'>
                    <span id='life1'>♥</span>
                    <span id='life2'>♥</span>
                    <span id='life3'>♥</span>
                </div>

                <div id='level'>
                <h1>مرحله : {this.state.level}</h1>
                </div>

                <div className='instruct'>
                    <span>برای حرکت دادن از ⇦ و ⇨ کیبرد استفاده کنید</span>
                </div>

                <div id='lost'>
                    <h1>شما باختی </h1>
                    <p> برای شروع روی صفحه کلیک کن </p>
                </div>
                
            </div>
        )
    }
}

export default FinalProject;