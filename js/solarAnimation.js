var container = document.getElementById('animation-window');
var menu = document.getElementById('interactive-menu');

var gui = new dat.GUI({autoPlace : false, width : 400 });
container.appendChild(gui.domElement);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(1000,1000);
container.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls( camera , renderer.domElement);
controls.update();


function createStar(name,color,radius){
    var s = new Star(name,color,radius);
    scene.add(s.mesh);
    return s;
}

//create the root of the solarsystem structure;
var root = createStar("Sun",0xffff00,15);

function createPlanet(name,color,radius,orbitalGeometry,framesPerRevolution){
    var p = new Planet(name,color,radius,orbitalGeometry,framesPerRevolution);
    p.folder = gui.addFolder(name);
    p.folder.add(p,'xRadius',0,p.xRadius*10);
    p.folder.add(p,'yRadius',0,p.yRadius*10);
    p.folder.add(p,'zRadius',0,50);
    p.newMoonFolder = p.folder.addFolder(p.name + "'s New Moon Controlls");
    p.newMoonFolder.add(p,'Name');
    p.newMoonFolder.add(p,'Radius',1,p.radius);
    p.newMoonFolder.addColor(p,'Color');
    p.newMoonFolder.add(p,'FramesPerRevolution',60,480);
    p.planetUtility = {
        CreateNewMoon(){
            var geom = {xRadius : p.radius + p.Radius + 2, yRadius : p.radius + p.Radius + 2};
            var m = createMoon(p.Name,p.Color,p.Radius,geom,p.FramesPerRevolution,p);
            p.resetGuiUtilities();
        }
    }
    p.newMoonFolder.add(p.planetUtility,'CreateNewMoon');
    scene.add(p.mesh);
    root.addPlanet(p);
    return p;
}

var newPlanetControlls = gui.addFolder('New Planet Controlls');
newPlanetControlls.add(root,'Name');
newPlanetControlls.add(root,'Radius',1,root.radius);
newPlanetControlls.addColor(root,'Color');
newPlanetControlls.add(root,'FramesPerRevolution',120,1000);
root.starUtility = {
    CreateNewPlanet(){
        var geom = {xRadius : root.radius + root.Radius + 2, yRadius : root.radius + root.Radius + 2};
        var p = createPlanet(root.Name,root.Color,root.Radius,geom,root.FramesPerRevolution);
        root.resetGuiUtilities();
    }
}
newPlanetControlls.add(root.starUtility,'CreateNewPlanet');


//To create a moon you must first have a planet, the planet must be provided as argument
function createMoon(name,color,radius,orbitalGeometry,framesPerRevolution,planet){
    var m = new Moon(name,color,radius,orbitalGeometry,framesPerRevolution);
    planet.addMoon(m);
    m.folder = planet.folder.addFolder(name);
    m.folder.add(m,'xRadius',0,p.xRadius*5);
    m.folder.add(m,'yRadius',0,p.yRadius*5);
    m.folder.add(m,'zRadius',0,50);
    scene.add(m.mesh);
    return m;
}


//create some planets and moons to play with in browser console
var p = createPlanet("Earth",0x0000ff,4,{xRadius : 40, yRadius : 40},240);



//create a helper grid as an (0,0,1) plane normal reference
var size = 200;
var divisions = 20;
var majorColor = 0xff0000;//red
var gridColor = 0xffffff;//white

var grid = new THREE.GridHelper(size,divisions,majorColor,gridColor);
grid.rotation.x += Math.PI/2; //turn 90 degrees about x axis;
scene.add(grid);

//put the camera some place nice and look at the sun
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
console.log(root);