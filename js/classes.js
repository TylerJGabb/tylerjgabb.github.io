class Planet {
    constructor(name,hexColor,radius,orbitalGeometry,framesPerRevolution){
        this.name = name;
        this.radius = radius;
        this.hexColor = hexColor; //is hex value duh
        this.moons = []; //child nodes
        this.planet = {};

        // {x-radius, y-radius, z-radius}
        this.orbitalGeometry = orbitalGeometry;
        this.xRadius = orbitalGeometry.xRadius;
        this.yRadius = orbitalGeometry.yRadius;
        this.zRadius = orbitalGeometry.zRadius;
        //allows for eliptical orbit and out of plane orbit

        var geom = new THREE.SphereGeometry(radius,16,16);
        var mat = new THREE.MeshBasicMaterial({
            color : hexColor,
            lambert : true
        });

        this.mesh = new THREE.Mesh(geom,mat);
        this.interval = 2*Math.PI/framesPerRevolution;
        this.orbitalAngle = 0;
    }

    //adds a moon to orbit
    addMoon(moon){
        this.moons.push(moon);
        moon.setPlanet(this);
    }

    setPlanet(planet){
        this.planet = planet;
    }
    //needs to start at root (the center of system);
    update(){
        //this.do_updatey_things
        if(this.xRadius != undefined){
            var xOffset = this.planet.xRadius == undefined ? 0 : this.planet.mesh.position.x; 
            this.mesh.position.x = xOffset + this.xRadius*Math.cos(this.orbitalAngle);
        }
        if(this.yRadius != undefined){
            var yOffset = this.planet.yRadius == undefined ? 0 : this.planet.mesh.position.y; 
            this.mesh.position.y = yOffset + this.yRadius*Math.sin(this.orbitalAngle);
        }
        if(this.zRadius != undefined){
            var zOffset = this.planet.zRadius == undefined ? 0 : this.planet.mesh.position.z; 
            this.mesh.position.z = zOffset + this.zRadius*Math.cos(this.orbitalAngle);
        }
        this.orbitalAngle += this.interval;
        if(this.orbitalAngle >= 2*Math.PI){
            this.orbitalAngle = 0;
        }
        for(var i = 0; i < this.moons.length; i++){
            this.moons[i].update();
        } 

    //this recursive structure allows moons which orbit moons which orbit....
    }
}
