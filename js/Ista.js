if (!document) {
    var THREE = require('three');
}

//NOTHING ABOVE THIS LINE IS ESSENTIAL ------------------------------------

var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(-50,50,50,-50,0.01,150);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

COM = {
    gravity : 0.07,
    position : new THREE.Vector3(0,0,0),
    mesh: new THREE.Mesh(new THREE.SphereGeometry(1,5,5), new THREE.MeshBasicMaterial({color: 0xFF0000}))
}

COM.update = function(x,y){
    this.mesh.position.set(x, y, 0);
    this.position.set(x,y,0);
}

COM.init = function(){
    scene.add(this.mesh);
}


class Orbiter{
    constructor(){
        this.velocity = new THREE.Vector2(0,0.3*Math.random());
        let geom = new THREE.SphereGeometry(0.5,5,5);
        let mat = new THREE.MeshBasicMaterial({
            color: 0x54FF9F, //seagreen
            wireframe: true
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.position.set(Math.random()*10,Math.random()*10,0);
        scene.add(this.mesh);
    }

    update(){
        let acc = new THREE.Vector2(0,0);
        acc.subVectors(COM.position,this.mesh.position);
        acc.normalize();
        acc.multiplyScalar(COM.gravity);

        let vel = new THREE.Vector2(0,0);
        vel.addVectors(this.velocity, acc);
        if(vel.length() > 1) vel.setLength(1);
        this.velocity.set(vel.x, vel.y);

        let pos = new THREE.Vector2(0,0);
        pos.addVectors(this.mesh.position, this.velocity);
        this.mesh.position.set(pos.x, pos.y, 0);
    }
}

orbiters = []
for(let i = 0; i < 50; i++){
    orbiters.push(new Orbiter());
}

fixClustering = function(){
    let x = 0;
    let y = 0;
    orbiters.forEach(o => {
        x += o.mesh.position.x;
        y += o.mesh.position.y;
    });
    let centr = new THREE.Vector2(x/orbiters.length, y/orbiters.length);
    let totDist = 0;
    let dist = new THREE.Vector2(0,0);
    orbiters.forEach(o => {
        dist.subVectors(centr, o.mesh.position)
        totDist += dist.length();
    });
    avgDist = totDist/orbiters.length;
    //console.log(avgDist);
    if(avgDist < 1){
        let deltaPos = new THREE.Vector2(0,0);
        orbiters.forEach(o => {
            deltaPos.subVectors(o.mesh.position, centr);
            deltaPos.setLength(0.5);
            o.velocity.set(deltaPos.x, deltaPos.y);
        });
    }
}

camera.position.set(0,0,100);
camera.lookAt(new THREE.Vector3(0, 0, 0));
function animate() {
    requestAnimationFrame(animate);
    orbiters.forEach(o => o.update());
    fixClustering();
    renderer.render(scene, camera);
}
COM.init();
animate();

function update(x, y){
    var ruler = new THREE.Vector2(0,0);
    ruler.subVectors(COM.position, new THREE.Vector2(x*50,y*50));
    COM.update(x*50, y*50);
    console.log(ruler.length());
}

function increaseGravity(){
    if(COM.gravity < 0.145) return COM.gravity += 0.01;
    return COM.gravity;
}

function decreaseGravity(){
    if(COM.gravity > 0.015) return COM.gravity -= 0.01;
    return COM.gravity;
}

var calming = false;
function calm(){
    if(calming) return;
    setTimeout(() => calming = false, 4000);
    calming = true;
    COM.gravity = 0.1;
    for(let i = 1; i < 4; i++){
        setTimeout(() => decreaseGravity(), 1000*i); //0.1, 0.09, 0.08, 0.07
    }
    COM.gravity = 0.07;
}

var paused = false;
function pauseRandom(){
    if(paused) return;
    paused = true;
    setTimeout(() => {
        paused = false;
    }, 1000)
}

document.addEventListener('mousemove', (snd) => {
    pauseRandom();
    x = 1 - 2*snd.clientX/window.innerWidth;
    y = 1 - 2*snd.clientY/window.innerHeight;
    COM.update(-x*50,y*50);
});


timeout = function(){
    if(!paused) COM.update(45 - 90*Math.random(), 45 - 90*Math.random());
    setTimeout(() => {
        timeout();
    }, 500 + 4500*Math.random());
}
timeout();