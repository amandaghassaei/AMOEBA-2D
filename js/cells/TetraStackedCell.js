/**
 * Created by aghassaei on 5/26/15.
 */


define(['underscore', 'three', 'threeModel', 'lattice', 'appState', 'cell'],
    function(_, THREE, three, lattice, appState, DMACell){

    var unitGeo = new THREE.TetrahedronGeometry(Math.sqrt(3/8));
    unitGeo.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/4));
    unitGeo.applyMatrix(new THREE.Matrix4().makeRotationX((Math.PI-Math.atan(2*Math.sqrt(2)))/2));
    unitGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,Math.sqrt(3/8)-2/Math.sqrt(6)));
    unitGeo.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));

    function TetraStackedCell(index, superCell){
        DMACell.call(this, index, superCell);
    }
    TetraStackedCell.prototype = Object.create(DMACell.prototype);

    TetraStackedCell.prototype._getGeometry = function(){//abstract mesh representation of cell
        return unitGeo;
    };

    TetraStackedCell.prototype._rotateCell = function(object3D){
        var absIndex = this.getAbsoluteIndex();
        if (absIndex.z%2 != 0) object3D.rotateX(Math.PI);
        var mod4 = absIndex.z%4;
        if (mod4 > 1 || (mod4 < 0 && mod4 > -3)) object3D.rotateZ(Math.PI);
        return object3D;
    };

    TetraStackedCell.prototype.calcHighlighterParams = function(face){
        var direction = face.normal;
        if (direction.z<-0.95) direction = new THREE.Vector3(0,0,-1);
        else direction = new THREE.Vector3(0,0,1);
        direction.applyQuaternion(this.getAbsoluteOrientation());
        var position = this.getAbsolutePosition();
        position.z += direction.z*this.zScale()/2;
        return {position:position, direction: direction};
    };

    return TetraStackedCell;
});