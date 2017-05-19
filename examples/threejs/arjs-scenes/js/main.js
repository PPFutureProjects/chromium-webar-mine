function removeLoadSpinner() {
	document.body.classList.add('loaded');
	setTimeout(function() {
		document.body.removeChild(document.getElementById("loader-wrapper"));
	}, 5000);
}

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var cameraOrtho, cameraPersp, sceneCamera, scene, renderer, cameraMesh;

var pointCloud, showPointCloud = false;
var vrDisplay;
var model;

var lastX, lastY;

var USE_CUBE_AS_MODEL = false;

var gui;

//////////////////////////////////////////////////////////////////////////////
//		start application if vrDisplay is "Tango VR Device"
//////////////////////////////////////////////////////////////////////////////
if (navigator.getVRDisplays) {
	navigator.getVRDisplays().then(function(vrDisplays) {
		if (vrDisplays && vrDisplays.length > 0) {
			for (var i = 0; i < vrDisplays.length; i++) {
				vrDisplay = vrDisplays[i];
				if (vrDisplay.displayName === "Tango VR Device") {
					startApplication()
					break
				}
			}
		}
	});
} else {
	alert("No navigator.getVRDisplays");
}

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
function startApplication(){

	// create demo scenes
	var demoScenes = new THREEx.ARjsDemoScenes()
	requestAnimationFrame(function animate(){
		requestAnimationFrame(animate)
		demoScenes.update(1/60)
	});
	
	// create the markerScene based on sceneName
	var sceneName = location.hash.substring(1) || 'torus'

	var markerRoot = new THREE.Group()	
	markerRoot.rotation.z = -Math.PI/2	
	if(sceneName === 'minecraft'){
		markerRoot.scale.set(1,1,1).multiplyScalar(1.5)
	}else{
		markerRoot.scale.set(1,1,1).multiplyScalar(0.7)		
	}

	var markerScene = demoScenes.createMarkerScene(sceneName)
	markerRoot.add( markerScene )

	// function to dynamically switch demoScenes
	window.switchDemoScene = function(newSceneName){
		// remove previous markerScene if suiltabled
		var previousParent = markerScene.parent || smoothedRoot
		if( demoScenes ){
			markerScene.parent.remove( markerScene )
			demoScenes.dispose()			
		}
		// create the new markerScene
		markerScene = demoScenes.createMarkerScene(newSceneName)	
		previousParent.add( markerScene )
		// update the location.hash
		location.hash = '#'+newSceneName
	}



// window.markerScene = markerScene
// markerScene.add(new THREE.AxisHelper())

// TODO why do i need this model
	model = new THREE.Group()
	markerScene.add(new THREE.AxisHelper())
	model.add(markerRoot);
	model.visible = false

	removeLoadSpinner();
	init(vrDisplay);
	updateAndRender();	
}

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
function init(vrDisplay) {
	
	//////////////////////////////////////////////////////////////////////////////
	//		dat.GUI
	//////////////////////////////////////////////////////////////////////////////

	function GUI() {
		this.showPointCloud = showPointCloud;
		this.showSeeThroughCamera = true;
		this.pointsToSkip = 0;
		return this;
	}

	// Initialize the dat.GUI.
	var datGUI = new dat.GUI()
	datGUI.close();
	gui = new GUI();
	datGUI.add(gui, "showPointCloud").onFinishChange(function(value) {
		if (value) {
			scene.add(points)
			showPointCloud = true;
		}
		else {
			scene.remove(points);
			showPointCloud = false;
		}
	});
	datGUI.add(gui, "showSeeThroughCamera");
	datGUI.add(gui, "pointsToSkip", 0, 10);
	
	
	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////
	// Initialize everything related to ThreeJS.
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	// Create the see through camera scene and camera
	sceneCamera = new THREE.Scene();
	cameraOrtho = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1000 );
	cameraMesh = THREE.WebAR.createVRSeeThroughCameraMesh(vrDisplay);
	sceneCamera.add(cameraMesh);
	
	// Create the 3D scene and camera
	scene = new THREE.Scene();
	cameraPersp = THREE.WebAR.createVRSeeThroughCamera(vrDisplay, 0.01, 100);

	// if (!model) {
	// 	model = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 0.1, 0.01), new THREE.MeshLambertMaterial( {color: 0x888888 } ));
	// }
	// model.position.set(Infinity, Infinity, Infinity);
	// model.position.set(0, 0, 1);

	console.assert(model)
	scene.add(model);


	var material = new THREE.PointsMaterial( { size: 0.01, vertexColors: THREE.VertexColors } );
	material.depthWrite = false;
	pointCloud = new THREE.WebAR.VRPointCloud(vrDisplay, true);
	points = new THREE.Points( pointCloud.getBufferGeometry(), material );
	points.frustumCulled = false;
	points.renderDepth = 0;
	if (showPointCloud){
		scene.add(points);		
	}

	vrControls = new THREE.VRControls(cameraPersp);

	// var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	// directionalLight.position.set( 0, 1, 0);
	// scene.add( directionalLight );

	var ambient = new THREE.AmbientLight( 0x666666 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0x887766 );
	directionalLight.position.set( -1, 1, 1 ).normalize();
	scene.add( directionalLight );
	
		
	// Create the renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;
	document.body.appendChild( renderer.domElement );

// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true;
	
	// Create a way to measure performance
	stats = new Stats();
	// container.appendChild( stats.dom );
	
	// Control the resizing of the window to correctly display the scene.
	window.addEventListener( 'resize', function onWindowResize() {
		// TODO: Accordingly update the perspective camera.
		// cameraPersp.aspect = window.innerWidth / window.innerHeight;
		// cameraPersp.updateProjectionMatrix();
		THREE.WebAR.resizeVRSeeThroughCamera(vrDisplay, cameraPersp);

		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );
	
	
	// drag left/right to rotate the model
	renderer.domElement.addEventListener("touchstart", function(event) {
		if (event.changedTouches.length > 0)
		lastX = event.changedTouches[0].pageX;
	});
	
	renderer.domElement.addEventListener("touchmove", function(event) {
		if (event.changedTouches.length > 0 && vrDisplay) {
			var x = event.changedTouches[0].pageX;
			var diffX = x - lastX;
			lastX = x;
			model.rotateX(THREE.Math.degToRad(diffX));
		}
	});
	
	renderer.domElement.addEventListener("click", function(event) {
		var pos = new THREE.Vector3();



		if (vrDisplay) {
			pos.x = event.pageX / window.innerWidth;
			pos.y = event.pageY / window.innerHeight;
			
			var pointAndPlane = vrDisplay.getPickingPointAndPlaneInPointCloud(pos.x, pos.y);
			// console.log("x = " + lastX + ", y = " + lastY + ", window.innerWidth = " + window.innerWidth + ", window.innerHeight = " + window.innerHeight + ", uvx = " + x + ", uvy = " + y + ", point[0] = " + pointAndPlane.point[0] + ", point[1] = " + pointAndPlane.point[1] + ", point[2] = " + pointAndPlane.point[2] + ", plane[0] = " + pointAndPlane.plane[0] + ", plane[1] = " + pointAndPlane.plane[1] + ", plane[2] = " + pointAndPlane.plane[2] + ", plane[3] = " + pointAndPlane.plane[3]);  
			
			if (pointAndPlane) {
				model.visible = true 
					// alert(pointAndPlane.point);
				// model.position.set(pointAndPlane.point[0], pointAndPlane.point[1], pointAndPlane.point[2]);
				THREE.WebAR.positionAndRotateObject3DWithPickingPointAndPlaneInPointCloud(pointAndPlane, model, 0.0);
			}
			else {
				// alert("Could not retrieve the correct point and plane.");
			}
		}
	});
	
}


//
function updateAndRender() {
	stats.update();
	
	// UPDATE
	
	// Update the perspective scene
	vrControls.update();
	
	pointCloud.update(showPointCloud, gui.pointsToSkip);
	
	// Update the see through camera scene
	// IMPORTANT: This call makes sure that the camera mesh (quad) uses the correct texture coordinates depending on the camera and device orientations.
	THREE.WebAR.updateCameraMeshOrientation(vrDisplay, cameraMesh);
	
	// RENDER
	
	// Render the see through camera scene
	renderer.clear();
	
	if (gui.showSeeThroughCamera)
	renderer.render( sceneCamera, cameraOrtho );
	
	// Render the perspective scene
	renderer.clearDepth();
	
	renderer.render( scene, cameraPersp );
	
	requestAnimationFrame( updateAndRender );
}
