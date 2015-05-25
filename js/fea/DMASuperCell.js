/**
 * Created by aghassaei on 5/15/15.
 */


var cellBrassMaterial = new THREE.MeshLambertMaterial({color:"#b5a642"});
var cellFiberGlassMaterial = new THREE.MeshLambertMaterial({color:"#fff68f"});

DMASuperCell = function(length, range, cells){
    if (range) var shouldRotate = range.max.x == range.min.x;
    this.material = globals.lattice.get("materialType");
    this.mesh = this._buildSuperCellMesh(length, shouldRotate);
    this.setVisibility(globals.appState.get("cellMode")=="cell");
    if (range) this.indices = _.clone(range.max);
    this.cells = cells;
    this.setScale();
    globals.three.sceneAdd(this.mesh);
};

DMASuperCell.prototype._buildSuperCellMesh = function(length, shouldRotate){
    var superCellGeo = new THREE.BoxGeometry(1,1,1);
    superCellGeo.applyMatrix(new THREE.Matrix4().makeScale(length, 1, 1));
    superCellGeo.applyMatrix(new THREE.Matrix4().makeTranslation(-length/2+0.5, 0, 0));
    if (shouldRotate) superCellGeo.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/2));
    var mesh = THREE.SceneUtils.createMultiMaterialObject(superCellGeo, [this.getMaterialType()]);
    var wireframe = new THREE.BoxHelper(mesh.children[0]);
    wireframe.material.color.set(0x000000);
    mesh.children.push(wireframe);
    return mesh;
};

DMASuperCell.prototype.getMaterialType = function(){
    var material = cellBrassMaterial;
    if (this.material == "fiberGlass") material = cellFiberGlassMaterial;
    return material;
};

DMASuperCell.prototype._setPosition = function(index){
    if (!index) return;
    var position = globals.lattice.getPositionForIndex(index);
    this.mesh.position.set(position.x, position.y, position.z);
};

DMASuperCell.prototype.setScale = function(scale){
    if (!scale) scale = globals.lattice.get("scale");
    this.mesh.scale.set(scale, scale, scale);
    this._setPosition(this.indices);
};

DMASuperCell.prototype.setVisibility = function(visible){
    this.mesh.visible = visible;
};

DMASuperCell.prototype.getLength = function(){
    return this.cells.length-1;
};

DMASuperCell.prototype.hide = function(){//only used in the context of stock simulation
    this.setVisibility(false);
    _.each(this.cells, function(cell){
        if (cell) cell.hide();
    });
};

DMASuperCell.prototype.draw = function(scale, cellMode, partType){
    if (this.hideForStockSimulation) return;
    if (!scale) scale = globals.lattice.get("scale");
    var partMode = cellMode == "part";

//    this.updateForScale(scale, cellMode, partType);

    //set visibility
    this.setVisibility(!partMode);
    _.each(this.cells, function(cell){
        if (cell) cell.draw(scale, cellMode, partType);
    });
};

DMASuperCell.prototype.getPosition = function(){
    return this.mesh.position.clone();
};

DMASuperCell.prototype.moveTo = function(position, axis){//used for stock simulations
    this.mesh.position[axis] = position;
    _.each(this.cells, function(cell){
        if (cell) cell.moveTo(position, axis);
    });
};

DMASuperCell.prototype.destroy = function(){
    if (this.destroyStarted) return;//prevents loop destroy from cells
    this.destroyStarted = true;
    globals.three.sceneRemove(this.mesh);
    _.each(this.cells, function(cell){
        if (cell && !cell.destroyStarted) globals.lattice.removeCell(cell);
    });
    this.cells = null;
    this.mesh = null;
    this.indices = null;
    this.material = null;
}