if (!document) {
    var THREE = require('three');
}

var scene = new THREE.Scene();
var container = document.getElementById('container');
var camera = new THREE.PerspectiveCamera(70,container.clientWidth/container.clientHeight,0.1,1000);
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.shadowMapEnabled = true;//THIS IS NECESSARY TO SEE CASTED SHADOWS
renderer.shadowMapType = THREE.PCFSoftShadowMap;

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);


var alight = new THREE.AmbientLight(0x404040,2);
scene.add(alight);

var planeGeom = new THREE.PlaneGeometry(10000, 10000);
var greyMat = new THREE.MeshPhongMaterial({
    color: 0x6c6c6c,
    side: THREE.DoubleSide
});

var plane = new THREE.Mesh(planeGeom, greyMat);
plane.receiveShadow = true;//<<----------------- @IMPORTANT for the plane to be able to receive the casted shadow
scene.add(plane);
plane.rotation.x = Math.PI / 2;

var geom = new THREE.CubeGeometry(10, 10, 10);
var mat = new THREE.MeshStandardMaterial({
    color : 0x830303
})
var cube = new THREE.Mesh(geom, mat);
cube.castShadow = true;
scene.add(cube);

cube.update = function () {
    cube.rotation.x += Math.PI / 240;
    cube.rotation.y += Math.PI / 180*2;
    cube.rotation.z += Math.PI / 360*2;
}
cube.position.y += 20;

var gridHelper = new THREE.AxisHelper(100);
scene.add(gridHelper)




//Orbit Controlls (mouse click and drag change camera angle)
var controls = new THREE.OrbitControls(camera, renderer.domElement);

//shadows appear to gain granularity if the source is far away, or too spread out with too wide of an angle.


var spotLight = new THREE.SpotLight(0xffffff, 3, 200);
spotLight.position.set(0, 100, 0);
spotLight.castShadow = true;
spotLight.angle = Math.PI / 6;
scene.add(spotLight)
spotLight.penumbra = 0.3; //softens the edge

var spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper)

var domeGeom = new THREE.SphereGeometry(100, 25, 25);
var domeMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.3,
    color: 0xaaaaaa
})

var dome = new THREE.Mesh(domeGeom, domeMat);
scene.add(dome);

var indicatorGeom = new THREE.SphereGeometry(5);
var indicator = new THREE.Mesh(indicatorGeom, domeMat);
scene.add(indicator);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
function onMouseMove(e) {
    mouse.x = (e.offsetX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (e.offsetY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    domeIntersect = raycaster.intersectObject(dome)[0];
    if (domeIntersect) {
        var p = domeIntersect.point;
        if (p.y < 5) p.y = 5;
        spotLight.position.set(p.x, p.y, p.z);
        indicator.position.set(p.x, p.y, p.z);
    }
}
document.addEventListener('mousemove', onMouseMove, false);


camera.position.set(150, 150, 150);
controls.update();
function animate(){
  requestAnimationFrame(animate);
  controls.update()
  cube.update();
  spotLightHelper.update();
  renderer.render(scene,camera);
};

animate()
