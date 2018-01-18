
//Solar System Body
class SSB {
    constructor(name,color,radius,orbitalGeometry){
        this.parameters = {name,color,radius,orbitalGeometry}
        this.name = name;
        this.color = color;
        this.radius = radius;
        this.xRadius = orbitalGeometry.xRadius == undefined ? 0 : orbitalGeometry.xRadius;
        this.yRadius = orbitalGeometry.yRadius == undefined ? 0 : orbitalGeometry.yRadius;
        this.zRadius = orbitalGeometry.zRadius == undefined ? 0 : orbitalGeometry.zRadius;

        var geom = new THREE.SphereGeometry(radius,16,16);
        var mat = new THREE.MeshBasicMaterial({
            color : color,
            lambert : true
        });

        this.mesh = new THREE.Mesh(geom,mat);
    }

    setRadius(val){
        this.mesh.geometry = new THREE.SphereGeometry(val,16,16);
    }
};

class Star extends SSB {
    constructor(name,color,radius){
        super(name,color,radius,{xRadius:0,yRadius:0,zRadius:0},scene);
        this.planets = [];

        //Below fields are for new moon controlls
        //they offer a way to store them
        this.Name = "pick a name for a new planet";
        this.Radius = 1;
        this.Color = "#ffffff";
        this.FramesPerRevolution = 180;
    }

    addPlanet(planet){
        this.planets.push(planet);
        planet.setStar(this);
    }

    update(){
        for(var i = 0; i < this.planets.length; i++){
            this.planets[i].update();
        }
    }

    resetGuiUtilities(){
        this.Name = "pick a name for a new planet";
        this.Radius = 1;
        this.Color = "#ffffff";
        this.FramesPerRevolution = 180;
    }
}


//Planet inherits from SSB. Has aray of moons
class Planet extends SSB {
    constructor(name,color,radius,orbitalGeometry,framesPerRevolution){
        super(name,color,radius,orbitalGeometry);
        this.moons = [];
        this.theta = 0;
        this.interval = 2*Math.PI/framesPerRevolution;
        this.folder = null;

        //Below fields are for new moon controlls
        //they offer a way to store them
        this.Name = "pick a name for " + name + "'s new moon";
        this.Radius = 1;
        this.Color = "#ffffff";
        this.FramesPerRevolution = 180;
    }

    resetGuiUtilities(){
        this.Name = "pick a name for " + name + "'s new moon";
        this.Radius = 1;
        this.Color = "#ffffff";
        this.FramesPerRevolution = 180;
    }

    setStar(star){
        this.star = star;
    }


    addMoon(moon){
        this.moons.push(moon);
        moon.setPlanet(this);
    }

    //updates the x,y and z positions of this planet's mesh using simple trigonometric functions.
    //it is quite primitive and will be changed once the model is working with this method
    update(){
        this.mesh.position.x = this.xRadius*Math.cos(this.theta);
        this.mesh.position.y = this.yRadius*Math.sin(this.theta);
        this.mesh.position.z = this.zRadius*Math.sin(this.theta);//SOO CHEEZY
        this.theta += this.interval;
        if(this.theta >= 2*Math.PI){
            this.theta = 0;
        }
        for(var i = 0; i < this.moons.length; i++){
            this.moons[i].update();
        }
    }
}

//Moon inherits from SSB. Can not have orbiters
class Moon extends SSB {
    constructor(name,color,radius,orbitalGeometry,framesPerRevolution){
        super(name,color,radius,orbitalGeometry);
        this.theta = 0;
        this.interval = 2*Math.PI/framesPerRevolution;
        this.folder = null;
    }

    update(){
        this.mesh.position.x = this.planet.mesh.position.x + this.xRadius*Math.cos(this.theta);
        this.mesh.position.y = this.planet.mesh.position.y + this.yRadius*Math.sin(this.theta);
        this.mesh.position.z = this.planet.mesh.position.z + this.zRadius*Math.sin(this.theta);
        this.theta += this.interval;
        if(this.theta >= 2*Math.PI){
            this.theta = 0;
        }
    }

    setPlanet(planet){
        this.planet = planet;
    }


}
