
const THREE = require('three');
require('./loaders/OBJLoader.js');
require('./controls/OrbitControls');


let camera, scene, renderer, controls;
let geometry, material, ring;

let gemBackMaterial;

const ringColors = [
    {text: "Gold", value: "0xb19e0a"},
    {text: "Dark Gold", value: "0x916e0a"},
    {text: "Red Gold", value: "0x914e0a"},
    {text: "Silver", value: "0x607d8b"}
];

const gemColors = [
    {text: "Light blue", value: "0xffffff"},
    {text: "Blue", value: "0x0088ff"},
    {text: "Red", value: "0xff0000"},
    {text: "Orange", value: "0xff9900"},
    {text: "Green", value: "0x00ff00"},
    {text: "Purple", value: "0x9c27b0"},
    {text: "Yellow", value: "0xffeb3b"}
];

const modelList = [
    {text: "Ring 1", value: "../models/ring3/OBJ.obj"},
    {text: "Ring 2", value: "../models/ring1/OBJ.obj"},
    {text: "Ring 3", value: "../models/ring2/OBJ.obj"},
    {text: "Ring 4", value: "../models/ring4/OBJ.obj"},
    {text: "Necklace", value: "../models/pendalt/OBJ.obj"},
    {text: "Set", value: "../models/MINISET/OBJ.obj"},
    {text: "Earing", value: "../models/earing/OBJ.obj"}
];

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera.position.z = 1;
    camera.position.y = 0.5;
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    let ambient = new THREE.AmbientLight( 0xefefff );
    scene.add( ambient );

    let dirLight = new THREE.DirectionalLight( 0xeeeeff );
    dirLight.name = 'Dir. Light';
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 8;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.top	= 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    dirLight.position.set( 2, 2, 1 );
    dirLight.lookAt(0, 0, 0);
    scene.add( dirLight );

    let geometryg = new THREE.BoxGeometry( 100, 0.15, 100 );
    let materialg = new THREE.MeshPhongMaterial( {
        color: 0xa0adaf,
        shininess: 150,
        specular: 0x111111
    } );

    let ground = new THREE.Mesh( geometryg, materialg );
    ground.position.y = -0.94;
    ground.scale.multiplyScalar( 3 );
    ground.castShadow = false;
    ground.receiveShadow = true;
    scene.add( ground );


    const path = "../assets/textures/cube/";
    const format = '.jpg';
    let urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    let reflectionCube = new THREE.CubeTextureLoader().load( urls );
    reflectionCube.format = THREE.RGBFormat;


    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshStandardMaterial( {
        color: new THREE.Color( 0xb19e0a ),
        emissive: new THREE.Color( 0x9e9e9e ),
        emissiveIntensity: 0.6,
        envMap: reflectionCube,
        envMapIntensity: 2,
        metalness: 0.8,
        roughness: 0.2,
    } );


    gemBackMaterial = new THREE.MeshPhysicalMaterial( {
        map: null,
        color: null,
        metalness: 1.0,
        roughness: 0,
        opacity: 0.5,
        side: THREE.FrontSide,
        transparent: true,
        envMapIntensity: 6,
        premultipliedAlpha: true,
        envMap: reflectionCube,
    } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;

    loadModel(modelList[0].value);

    document.body.appendChild( renderer.domElement );
    initColorChanging(ringColors, material, "Metal");
    initColorChanging(gemColors, gemBackMaterial, "Gem");
    initModelChanging(modelList);

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function loadModel(path) {
    let loader = new THREE.OBJLoader();

    if (ring) {
        scene.remove(ring);
    }

    loader.load(
        path,
        ( object ) => {
            scene.add( object );
            object.scale.set(0.025, 0.025, 0.025);
            object.traverse( ( child ) => {

                if ( child instanceof THREE.Mesh ) {

                    if (isGem(child)) {
                        child.material = gemBackMaterial;
                    } else {
                        child.material = material;
                    }


                    child.castShadow = true;
                    child.receiveShadow = true;
                }

            } );

            object.rotation.x = -Math.PI / 2.0;
            object.position.y = -0.7;

            controls.target = object.position;
            camera.lookAt(object.position);

            ring = object;
        },
        ( xhr ) => {},
        ( error ) => {}
    );
}

function isGem(object) {
    return object.name.search( /gem/i ) !== -1;
}

function initModelChanging(models) {
    let select = document.createElement("select");
    let label = document.createElement("label");
    models.forEach((model) => {
        let opt = document.createElement("option");
        opt.value = model.value;
        opt.innerHTML = model.text;
        select.appendChild(opt);
    });

    label.innerText = "Model";
    document.body.appendChild(label);
    document.body.appendChild(select);

    select.onchange = ()=>{
        loadModel(select.value);
    }
}

function initColorChanging(colors, material, labelContent) {
    let select = document.createElement("select");
    let label = document.createElement("label");
    colors.forEach((color) => {
        let opt = document.createElement("option");
        opt.value = color.value;
        opt.innerHTML = color.text;
        select.appendChild(opt);
    });

    label.innerText = labelContent;
    document.body.appendChild(label);
    document.body.appendChild(select);

    select.onchange = () => {
        if (material) {
            console.log(select.value);
            material.color = new THREE.Color( parseInt(select.value) );
        }
    }
}

function animate() {

    requestAnimationFrame( animate );

    if (ring) {
        ring.rotation.z += 0.01;
    }

    renderer.clear();
    renderer.render( scene, camera );

}
