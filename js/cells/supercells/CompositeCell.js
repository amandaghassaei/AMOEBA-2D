/**
 * Created by aghassaei on 6/12/15.
 */


define(['underscore', 'three', 'threeModel', 'lattice', 'appState', 'superCell', 'globals'],
    function(_, THREE, three, lattice, appState, DMASuperCell, globals){

    CompositeCell = function(json, superCell){
        DMASuperCell.call(this, json, superCell);
    };
    CompositeCell.prototype = Object.create(DMASuperCell.prototype);

    CompositeCell.prototype._makeSubCellForIndex = function(json, callback){
//        require([], function(){
//
//        });
    };

    CompositeCell.prototype._getGeometry = function(){
        var dimensions = appState.get("superCellRange");
        var geo = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
        geo.applyMatrix(new THREE.Matrix4().makeTranslation(dimensions.x/2-0.5, dimensions.y/2-0.5, dimensions.z/2-0.5));
        return geo;
    };

    CompositeCell.prototype._buildWireframe = function(mesh){
        var wireframe = new THREE.BoxHelper(mesh);
        wireframe.material.color.set(0x000000);
        wireframe.matrixWorld = mesh.matrixWorld;
        wireframe.matrixAutoUpdate = true;
        return wireframe;
    };

    CompositeCell.prototype.getMaterial = function(){
        if (!this.material) return null;
        var material = globals.materials.compositeMaterials[this.material];
        if (!material){
            console.warn("no material "+ this.material + " found");
            return null;
        }
        return material;
    };

    return CompositeCell;
});