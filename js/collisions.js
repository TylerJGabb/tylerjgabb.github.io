if (!document) {
    var THREE = require('three');
}

document.getElementById('info').innerHTML =
    "Collision detection<br>"+
    "Cube's velocity is logged for every bounce<br>"+
    "Toggle Terminal Velocity to observe effects of roundoff error"
document.title = "Collision Detection"

//NOTHING ABOVE THIS LINE IS ESSENTIAL ------------------------------------

var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 1000);
camera.position.set(-0.01, 15, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera);//You don't need to know anything about this;
controls.enablePan = false; //stops you from being able to change position of camera





//===================          C O D E    G O E S        H E R E        =======================
var gridHelper = new THREE.GridHelper(20, 20, 0xff0000, 0xffffff);
scene.add(gridHelper);
gridHelper.position.y += 0.01;

var geom = new THREE.CubeGeometry(2, 2, 2);
var mat = new THREE.MeshBasicMaterial({
    color: 0x54FF9F, //seagreen
    wireframe: true
})

var localCube = new THREE.Mesh(
    new THREE.CubeGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({
        color: 0xFFFFFFD,
        wireframe: true
    })
)
localCube.position.y = 1;
scene.add(localCube);

var cube = new THREE.Mesh(geom, mat);
cube.velocityArrows = new THREE.Object3D();
cube.position.set(0, 10, 0);
scene.add(cube);
cube.checkTerminal = true;
cube.collisionArrows = new THREE.Object3D();
cube.velocity = new THREE.Vector3(0, 0, 0);
cube.acceleration = new THREE.Vector3(0, -0.005, 0);
cube.update = function () {
    if (cube.checkTerminal && cube.velocity.length() >= 0.31) {
        cube.velocity.setLength(0.3);
    }
    cube.position.add(cube.velocity);
    cube.velocity.add(cube.acceleration);
    cube.velocityArrows.update();//This function is set 
}


//add lights and collidable mesh---------------------------------------------
var light = new THREE.PointLight(0xFFFFFF, 2, 200);
scene.add(light);
light.position.set(0, 50, 0);

var collidableMesh = new THREE.Object3D();
var planeMat = new THREE.MeshStandardMaterial({
    color: 0xAAAAAA,
    side: THREE.DoubleSide
})

var planeG = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), planeMat);
planeG.rotateX(Math.PI / 2);
planeG.material.roughness = 0.95;

collidableMesh.add(planeG);
scene.add(collidableMesh)
//----------------------------------------------------------------------




camera.lookAt(new THREE.Vector3(0, 0, 0));
t = 0;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //rotateCube();
    cube.update();
    if (!cube.collide && t < 10) {//cube.collide is set to false for 10 frames when collision happens. 
        //Ugly way to handle multiple collisions before
        //mesh has a chance to move out of collision. 
        t++;
    }
    else {
        t = 0
        cube.collide = true;
    }

    updateCollisionRays();
}
renderer.render(scene, camera);//Render scene once to obtain accurate initialization
initializeCollisionArrows();
initializeVelocityArrows();

/**
 * Initializes arrows to show velocity directions. Magnitudes are too small to be feasible.
 */
function initializeVelocityArrows() {
    cube.velocityArrows.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 5, 0xff0000));//X Direction
    cube.velocityArrows.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 0, 0x00ff00));//Y Direction
    cube.velocityArrows.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 5, 0x0000ff));//Z Direction

    /**
     * called on this object3D to update its contents according to the cube
     */
    cube.velocityArrows.update = function () {
        var p = cube.position;
        var v = cube.velocity;
        cube.velocityArrows.position.set(p.x, p.y, p.z)

        //update x
        cube.velocityArrows.children[0].setDirection((new THREE.Vector3(v.x, 0, 0)).normalize());

        //update y
        cube.velocityArrows.children[1].setDirection((new THREE.Vector3(0, v.y, 0)).normalize());
        cube.velocityArrows.children[1].setLength(Math.abs(v.y) * 20);

        //update z
        cube.velocityArrows.children[2].setDirection((new THREE.Vector3(0, 0, v.z)).normalize());
    }
    scene.add(cube.velocityArrows);
}

/**
 * initializes arrows to show collision rays
 */
function initializeCollisionArrows() {
    for (var i = 0; i < cube.geometry.vertices.length; i++) {
        var localVertex = cube.geometry.vertices[i].clone();
        var globalVertex = localVertex.clone().applyMatrix4(cube.matrix);
        var directionVector = (new THREE.Vector3()).subVectors(globalVertex, cube.position)
        var ray = new THREE.Ray(cube.position, directionVector.clone().normalize());
        var arrow = new THREE.ArrowHelper(directionVector.clone().normalize(), cube.position, directionVector.length());
        cube.collisionArrows.add(arrow);
    }
    scene.add(cube.collisionArrows);
}

/**
 * called in the main animation loop, this is where the collision logic happens
 */
function updateCollisionRays() {
    var p = cube.position;
    for (var i = 0; i < cube.geometry.vertices.length; i++) {
        var localVertex = cube.geometry.vertices[i].clone();
        var globalVertex = localVertex.clone().applyMatrix4(cube.matrix);
        var directionVector = (new THREE.Vector3()).subVectors(globalVertex, cube.position)
        var ray = new THREE.Raycaster(cube.position, directionVector.clone().normalize())
        var x = collidableMesh.children;

        var collisionResults = ray.intersectObjects(collidableMesh.children);
        if (cube.collide && collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            //console.log('collision!');
            cube.velocity.y *= -1;
            cube.velocity.x = (Math.random() - 0.5) * 0.1;
            cube.velocity.z = (Math.random() - 0.5) * 0.1;
            //console.log(cube.velocity);
            cube.collide = false;
        } 
        cube.collisionArrows.children[i].position.set(p.x,p.y,p.z)
        cube.collisionArrows.children[i].setDirection(directionVector.normalize());
    }
}

animate();

var toggleTerm = document.createElement('button');
toggleTerm.innerHTML = "Terminal Velocity : ON"
toggleTerm.style.fontSize = "20px"
toggleTerm.style.position = 'absolute';
toggleTerm.style.width = '250px';
toggleTerm.style.height = '100px';
toggleTerm.style.textAlign = 'center';
toggleTerm.style.color = "#FFFFFF";
toggleTerm.style.backgroundColor = "#404040";
toggleTerm.style.zIndex = 2;
toggleTerm.style.fontFamily = 'Courier New';
toggleTerm.style.bottom = '0px'
toggleTerm.style.borderRadius = '30px'
toggleTerm.addEventListener('click', function (e) {
    cube.checkTerminal = !cube.checkTerminal;
    if (cube.checkTerminal) {
        toggleTerm.innerHTML = "Terminal Velocity : ON"
    } else {
        toggleTerm.innerHTML = "Terminal Velocity : OFF"
    }

})
document.body.appendChild(toggleTerm);
