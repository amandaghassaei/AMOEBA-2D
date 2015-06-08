/**
 * Created by aghassaei on 6/2/15.
 */

//globals namespace, not sure if there's a way to get around this

define(['underscore', 'three'], function(_, THREE){

    var materials = {
        deleteMaterial: new THREE.MeshLambertMaterial({color:"#ff0000", shading:THREE.FlatShading})
    };

    return {
        baseplane: null,
        highlighter: null,
        materials: materials
    };
});