/**
 * Created by aghassaei on 1/17/15.
 */


define(['underscore', 'three'], function(_, THREE){

    var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 5000);
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({antialias:true});//antialiasing is not supported in ff and on mac+chrome

    var appState;
    require(['appState'], function(globalAppState){
        appState = globalAppState;
    });

    //store all meshes to highlight
    var cells = [];
    var compositeCells = [];
//    var parts = [];
    var basePlane = [];

    var animationLoopRunning = false;
    var stopAnimationFlag = false;

    var shouldRender = false;

    var initialCameraPosition = new THREE.Vector3(-15, -12, 12);

    var threeView = null;

    initialize();

    function initialize(){

        resetCameraPosition();
        camera.up.set(0,0,1);//set z axis as "up"

        var fogColor = 0xcccccc;
//        scene.fog = new THREE.FogExp2(fogColor, 0.001);

        // lights
        var color = 0x888888;
        var light = new THREE.DirectionalLight(color);
        light.position.set(0, 10, 0);
        scene.add(light);
        var light = new THREE.DirectionalLight(color);
        light.position.set(0, -10, 0);
        scene.add(light);
        var light = new THREE.DirectionalLight(color);
        light.position.set(0, 0, 300);
        scene.add(light);
        var light = new THREE.DirectionalLight(0xaaaaaa);
        light.position.set(-1, -1, -1);
        scene.add(light);
        var light = new THREE.DirectionalLight(0xaaaaaa);
        light.position.set(1, 1, -1);
        scene.add(light);
        var light = new THREE.AmbientLight(0x222222);
        scene.add(light);
        

        // renderer
        renderer.setClearColor(fogColor, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', onWindowResize, false);
    }

    function resetCameraPosition(){
        camera.position.x = initialCameraPosition.x;
        camera.position.y = initialCameraPosition.y;
        camera.position.z = initialCameraPosition.z;
        if (threeView) threeView.reset3DNavigation();
        render();
    }

    function onWindowResize(){
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function setThreeView(view){
        threeView = view;
    }

    function sceneAdd(object){
        scene.add(object);
    }

    function sceneAddBasePlane(object){
        sceneAdd(object);
        basePlane.push(object.children[0]);
    }

    function getBasePlane(){
        return basePlane;
    }

    function addCell(cell){
        cells.push(cell);
    }

    function addCompositeCell(cell){
        compositeCells.push(cell);
    }

    function removeCell(cell){
        cells.splice(cells.indexOf(cell), 1);
    }

    function removeCompositeCell(cell){
        compositeCells.splice(compositeCells.indexOf(cell), 1);
    }

    function getCells(){
        return cells;
    }

    function getCompositeCells(){
        return compositeCells;
    }

    function sceneRemove(object){
        scene.remove(object);
    }

    function sceneRemoveBasePlane(object){
        sceneRemove(object);
        basePlane = [];
    }

    function removeAllCells(){
        cells = [];
    }

    function removeAllCompositeCells(){
        compositeCells = [];
    }

    function startAnimationLoop(){
        if (appState.get("turnOffRendering") || animationLoopRunning) return;
        stopAnimationFlag = false;
        animationLoopRunning = true;
        console.log("animation started");
        _loop();
    }

    function stopAnimationLoop(){
        if (!animationLoopRunning) return;
        stopAnimationFlag = true;
    }

    function _loop(){
        _render();
        if (stopAnimationFlag) {
            animationLoopRunning = false;
            console.log("animation stopped");
            return;
        }
        requestAnimationFrame(_loop);
    }

    function render(){
        if ((appState && appState.get("turnOffRendering")) || animationLoopRunning) return;
        _render();
    }

    function _render(){
//        console.log("render");
        renderer.render(scene, camera);
    }

    function setRenderFlag(){
        shouldRender = true;
    }

    function conditionalRender(){
        if (shouldRender) render();
        shouldRender = false;
    }

    return {//return public properties/methods
        render: render,
        conditionalRender: conditionalRender,
        setRenderFlag: setRenderFlag,
        startAnimationLoop: startAnimationLoop,
        stopAnimationLoop: stopAnimationLoop,
        sceneRemove: sceneRemove,
        sceneAdd: sceneAdd,
        sceneAddBasePlane: sceneAddBasePlane,
        sceneRemoveBasePlane: sceneRemoveBasePlane,
        domElement: renderer.domElement,
        camera: camera,
        getCells: getCells,
        getCompositeCells: getCompositeCells,
        addCell: addCell,
        addCompositeCell: addCompositeCell,
        removeCell: removeCell,
        removeCompositeCell: removeCompositeCell,
        getBasePlane: getBasePlane,
        removeAllCells: removeAllCells,
        removeAllCompositeCells: removeAllCompositeCells,
        resetCameraPosition: resetCameraPosition,
        setThreeView: setThreeView
    }

});