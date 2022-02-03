import './style.css'
import * as THREE from 'three'


function main(){
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({canvas, logarithmicDepthBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x25486E );
    renderer.shadowMap.enabled = true;

    function arrayToFloat32Array(points){
        const pointsF32 = [];
        for(let index=0; index < points.length; ++index){
            const element = points[index];
            for(let key in element){
                if(key == "x" || key == "y" || key == "z")
                    pointsF32.push(parseFloat(element[key]));
            }
        }
        return Float32Array.from(pointsF32);
    }

    function makeCamera(fov = 40){
        const aspect = 2;
        const zNear = 0.1;
        const zFar = 1000;
        return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
    }

    const scene = new THREE.Scene();


    //lights
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.25);
    mainLight.position.set(25,0, 20);
    mainLight.rotation.set(Math.PI/6, 0.2,0);

    const light = new THREE.AmbientLight( 0x404040 );
    scene.add( light );

    const helper = new THREE.DirectionalLightHelper(mainLight);
    mainLight.add(helper);

    function updateLight() {
        //mainLight.target.updateMatrixWorld();
        helper.update();
    }
    updateLight();
    //
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.near = 0.001;
    mainLight.shadow.far = 10000;
    scene.add(mainLight);


    const objects = [];
    const city = new THREE.Object3D();

    const grassG = new THREE.PlaneGeometry(100, 100);
    const grassM = new THREE.MeshPhongMaterial({color: 0x8FC833, side: THREE.DoubleSide});
    const groundMesh = new THREE.Mesh(grassG, grassM);
    groundMesh.receiveShadows = true;
    city.add(groundMesh);
    objects.push(groundMesh);

    const streetG1 = new THREE.PlaneGeometry(100, 15);

    const streetG2 = new THREE.PlaneGeometry(20, 100);
    const streetM = new THREE.MeshPhongMaterial({color:0x373734, side: THREE.DoubleSide});

    //street1
    function createSep( isVertical, width, height, positionX, positionY) {
        if(isVertical) {
            var sepGeo = new THREE.PlaneGeometry(width, height)
        } else {
            var sepGeo = new THREE.PlaneGeometry(height, width)
        }
        let streetM2 = new THREE.MeshPhongMaterial({color:0xffffff, side: THREE.DoubleSide});
        const sep = new THREE.Mesh(sepGeo, streetM2);
        city.add(sep)
        sep.position.x = positionX
        sep.position.y = positionY
        sep.position.z = 0.1
    }
    createSep(true, 3 , 15, 10, 40)
    createSep(true, 3 , 15, 10, 10)
    createSep(true, 3 , 15, 10, -37.5)
    createSep(true, 3 , 15, -17.5, 40)
    createSep(true, 3 , 15, -17.5, 10)
    createSep(true, 3 , 15, -17.5, -37.5)

    createSep(false, 3 , 15, -39, -15)
    createSep(false, 3 , 15, 41, -15)

    createSep(false, 1.5 , 5, 25, -10)
    createSep(false, 1.5 , 5, 25, -13)
    createSep(false, 1.5 , 5, 25, -16)
    createSep(false, 1.5 , 5, 25, -19)
    const street1 = new THREE.Mesh(streetG1, streetM);



    street1.receiveShadows = true;

    city.add(street1);
    objects.push(street1);
    street1.position.y = -15
    street1.position.z = 0.05
    const street2 = new THREE.Mesh(streetG2, streetM);
    const street3 = new THREE.Mesh(streetG2, streetM);
    city.add(street3);
    street3.position.z = .01;
    street3.position.x = -18;
    street2.position.z = .02;
    street2.position.x = 10;
    street2.receiveShadows = true;


    city.add(street2);
    objects.push(street2);
//    city.add(street2Sep1);
    //city.add(street2Sep2);
  //  objects.push(street2Sep2);
//    objects.push(street2Sep1);

    //buildings
    const buildG = new THREE.BoxGeometry(10, 10, 20);
    const buildM = new THREE.MeshStandardMaterial( {color: 0xeeeeee, metalness: .5} );
    const bigBuilding = new THREE.BoxGeometry(20, 15, 20);
    const LightBuildM = new THREE.MeshStandardMaterial( {color: 0xB0A592, metalness: .05} );
    const noFatBuilding = new THREE.BoxGeometry(10, 25, 10);
    const YellowBuildM = new THREE.MeshStandardMaterial( {color: 0xF1883D, metalness: .05} );
    const building = new THREE.Mesh(bigBuilding, LightBuildM);
    const blueBuildM = new THREE.MeshStandardMaterial( {color: 0x303C6E, metalness: .05} );
    const smallBuild = new THREE.BoxGeometry(10, 10, 10)
    const smallBuildM = new THREE.MeshStandardMaterial( {color: 0x6E2416, metalness: .05} );
     building.castShadow = true;
     building.position.x = 36; building.position.y = -40; building.position.z = 10;
     city.add(building);
     objects.push(building);


    const building2 = new THREE.Mesh(noFatBuilding, YellowBuildM);
    building.castShadow = true;
    building2.position.x = -36; building2.position.y = -36; building2.position.z = 5;
    city.add(building2);
    // const building2 = new THREE.Mesh(buildG2, buildM);
    const building3 = new THREE.Mesh(noFatBuilding, blueBuildM);
    building3.position.x = -35; building3.position.y = 7; building3.position.z = 5;
    city.add(building3)
    // building2.position.x = 20; building2.position.y = 40; building2.position.z = 10;
    // building2.castShadow = true;
    const building4 = new THREE.Mesh(smallBuild, smallBuildM);
    building4.position.x = -35; building4.position.y = 35; building4.position.z = 5;
    city.add(building4)

    const building6 = new THREE.Mesh(smallBuild, smallBuildM);
    building6.position.x = 30; building6.position.y = 15; building6.position.z = 5;
    city.add(building6)

    const building7 = new THREE.Mesh(smallBuild, smallBuildM);
    building7.position.x = 30; building7.position.y = 35; building7.position.z = 5;
    city.add(building7)

    const building8 = new THREE.Mesh(smallBuild, smallBuildM);
    building8.position.x = 45; building8.position.y = 35; building8.position.z = 5;
    city.add(building8)

    const building9 = new THREE.Mesh(smallBuild, smallBuildM);
    building9.position.x = 45; building9.position.y = 15; building9.position.z = 5;
    city.add(building9)

    const building10 = new THREE.Mesh(smallBuild, smallBuildM);
    building10.position.x = 30; building10.position.y = 0; building10.position.z = 5;
    city.add(building10)

    const building11 = new THREE.Mesh(smallBuild, smallBuildM);
    building11.position.x = 45; building11.position.y = 0; building11.position.z = 5;
    city.add(building11)

    scene.add(city);


    //Camers
    const camera = makeCamera();
    camera.position.set(0,-45,45).multiplyScalar(3);
    camera.rotation.x = Math.PI/2;
    camera.lookAt(0, 0, 0);

    const cameraBuilding1 = makeCamera(40);
    cameraBuilding1.position.set(-45, -50, 20);
    cameraBuilding1.up.set(0,0,1);
    cameraBuilding1.lookAt(0, 0, 0);

    const cameraBuilding2 = makeCamera();
    cameraBuilding2.position.set(40, 50, 20)
    cameraBuilding2.up.set(0,0,1);
    cameraBuilding2.lookAt(0,0,0);



    const cameras = [
        { cam: camera, desc: 'Main camera' },
        {cam: cameraBuilding1, desc: "camera 1"},
        {cam: cameraBuilding2, desc: "camera 2"}
    ];
    const camerasLength = Object.keys(cameras).length;

    const infoElem = document.querySelector('#info');
    let camNumber = 0;

    let activeKey = null
    let isMouseDown = false
    let deltaMousePos = { x: 0, y: 0 }
    let mousePos = { x: 0, y: 0 }


    document.addEventListener("keypress", function(event) {
        if (event.keyCode == 32) {
            camNumber+=1
            camNumber=camNumber%camerasLength
        }
        activeKey = event.keyCode
    });

    document.addEventListener("keypress", function(event) {
        if (event.keyCode == 32) {
            camNumber+=1
            camNumber=camNumber%camerasLength
        }

    });

    document.addEventListener("keydown", function(event) {
        activeKey = event.keyCode
    })

    document.addEventListener("keyup", function(event) {
        activeKey = null
    })

    document.addEventListener("mousedown", function() {
        console.log('da')
        isMouseDown = true
    })

    document.addEventListener("mouseup", function() {
        isMouseDown = false
    })

    document.addEventListener("mousemove", function(event) {
        deltaMousePos = { x: event.clientX - mousePos.x, y: event.clientY - mousePos.y }
        mousePos = { x: event.clientX, y: event.clientY }
    })


    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time = 0.001;
        const speed = 0.0005
        const rotSpeed = 0.00005
        const dir = new THREE.Vector3();

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            cameras.forEach((cameraInfo) => {
                const camera = cameraInfo.cam;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;

                camera.updateProjectionMatrix();
            });
        }

        if (activeKey && activeKey === 119) {
            cameras[0].cam.position.y += 0.5
        }
        if (activeKey && activeKey === 115) {
            cameras[0].cam.position.y -= 0.5
        }
        if (activeKey && activeKey === 97) {
            cameras[0].cam.position.x -= 0.5
        }
        if (activeKey && activeKey === 100) {
            cameras[0].cam.position.x += 0.5
        }

        console.log(isMouseDown)
        if (isMouseDown) {
            cameras[0].cam.rotation.x += deltaMousePos.y / 1000
            cameras[0].cam.rotation.y += deltaMousePos.x / 1000
            deltaMousePos = { x: 0, y: 0 }
        }


        const camera = cameras[camNumber];
        infoElem.textContent = camera.desc

        renderer.render(scene, camera.cam)

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
main();
