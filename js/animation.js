/*

    USE DAT.GUI for GUI MENU
    http://learningthreejs.com/blog/2011/08/14/dat-gui-simple-ui-for-demos/



*/

// =============================================================
//  XXX   XXXXX  XXXXX  X   X  XXXX           XXXX  X   X  XXXXX
// X      X        X    X   X  X   X         X      X   X    X
//  XXX   XXXXX    X    X   X  XXXX          X  XX  X   X    X
//     X  X        X    X   X  X             X   X  X   X    X
//  XXX   XXXXX    X     XXX   X              XXX    XXX   XXXXX
// =============================================================


var gui = new dat.GUI({autoPlace : false, width : 300})
var container = document.getElementById('outer');
container.appendChild(gui.domElement);



var planetsGui = gui.addFolder('Planets');
planetsGui.open();
var obj = {NewPlanet:function(){alert('planet added')}};
gui.add(obj,'NewPlanet');


// SETUP THE SCENE

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 1000 / 1000, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( 1000, 1000);
container.appendChild( renderer.domElement );
var controls = new THREE.OrbitControls( camera )

var planets = [];

function createPlanet(name,hexColor,radius,orbitalGeometry,framerPerRevolution){
    var p = new Planet(name,hexColor,radius,orbitalGeometry,framerPerRevolution);
    //p.folder = ....
    planets.push(p);
    scene.add(p.mesh);
    var folder = planetsGui.addFolder(name);
    folder.add(p,'xRadius',0,100);
    var moons = folder.addFolder("Moons");
    
    return p;
}

function addMoon(planet,moon){
    planet.addMoon(moon);
}

var root = createPlanet(
    "Sun",
    0xffff00,
    10,
    {xRadius : 0, yRadius : 0, zRadius : 0},
    0
);

var earth = createPlanet(
    "Earth",
    0x0000ff,
    3,
    {xRadius : 30, yRadius: 30},
    240
)

addMoon(root,earth);

var moon = createPlanet(
    "Moon",
    0xffffff,
    1,
    {xRadius:10,yRadius:10},
    60
)

addMoon(earth,moon)

console.log(root)

var size = 200;
var divisions = 30;
var grid = new THREE.GridHelper(size, divisions, 0xff0000, 0xffffff);
scene.add(grid);
grid.rotation.x += Math.PI/2;


camera.position.set(0,-50,50);
camera.lookAt(new THREE.Vector3(0,0,0));
controls.update();
function animate(){
    requestAnimationFrame( animate );
    root.update()//recursive
    controls.update();
    renderer.render( scene, camera );
}
animate();


