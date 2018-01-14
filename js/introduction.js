//creating the scene



var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



//add the cube
var geometry = new THREE.SphereGeometry(2,10,10);
var material = new THREE.MeshBasicMaterial({
    color : 0xff0000,
    wireframe : true
});
var sphere = new THREE.Mesh(geometry,material);

var material2 = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true
});

var geometry2 = new THREE.SphereGeometry(1,10,10);
var orbiter = new THREE.Mesh(geometry2,material2);



var controls = new THREE.OrbitControls( camera )
camera.position.set(0,20,100);
controls.update();





scene.add(sphere);
scene.add(orbiter);

var theta = 0;
var theta_orbiter = 0;
var interval_sphere = 2*Math.PI/240;
var interval_orbiter = 2*Math.PI/90;
//tmax = 2pi; 
function animate() {
    requestAnimationFrame( animate );
    sphere.position.x = 20*Math.cos(theta);
    sphere.position.y = 20*Math.sin(theta);

    orbiter.position.x = sphere.position.x + 4*Math.cos(theta_orbiter);
    orbiter.position.y = sphere.position.y + 4*Math.sin(theta_orbiter);
    theta += interval_sphere;
    theta_orbiter += interval_orbiter;
    if(theta > 2*Math.PI){
        theta = 0;
    }

    if(theta_orbiter > 2*Math.PI){
        theta_orbiter = 0;
    }
    controls.update();
    renderer.render( scene, camera );
}
animate();