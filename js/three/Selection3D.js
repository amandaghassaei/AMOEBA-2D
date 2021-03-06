/**
 * Created by ghassaei on 2/10/16.
 */


define(['backbone', 'underscore', 'lattice', 'three', 'threeModel', 'globals', 'arrow', 'appState'],
    function(Backbone, _, lattice, THREE, three, globals, Arrow, appState){

    var selectionToolMaterial = new THREE.MeshBasicMaterial({transparent:true, opacity:0.4, color:0xffffff});
    var selectedRegionMaterial = new THREE.MeshBasicMaterial({transparent:true, opacity:0.05, color:0xff0000});


    return Backbone.Model.extend({
        
        defaults: {
            bound1: null,
            bound2: null,
            min: null,
            max: null,
            size: null,
            cutMode: false,
            editMode:false,//arrows are draggable when in edit mode
            sizeIncrement: new THREE.Vector3(1,1,1)
        },
        
        initialize: function(options){
            this.set("bound1", options.bound.clone());

            if (globals.get("selectedRegion")) this.set("sizeIncrement", globals.get("selectedRegion").get("size").clone());

            var scale = lattice.getAspectRatio();
            var mesh = new THREE.Mesh(new THREE.BoxGeometry(scale.x, scale.y, scale.z), selectionToolMaterial);
            this.mesh = mesh;

            this.object3D = new THREE.Object3D();
            this.object3D.add(this.mesh);
            this.object3D.add(this._buildWireframe(mesh));
            var arrows = [];
            var highlightTargets = [];
            for (var i=0;i<4;i++){
                var direction = new THREE.Vector3(0,0,0);
                var sign = (i%2 == 0 ? 1 : -1);
                direction[this.arrowAxisForIndex(i)] = sign;
                var arrow = new Arrow(direction, 0.5, 2);
                arrows.push(arrow);
                var arrowMesh = arrow.getObject3D();
                _.each(arrowMesh.children, function(child){
                    highlightTargets.push(child);
                });

                this.object3D.add(arrowMesh);
            }
            this.highlightTargets = highlightTargets;
            this.arrows = arrows;

            this.listenTo(this, "change:min change:max", this._sizeChanged);
            //this.listenTo(appState, "change:showOneLayer", this._setArrowVis);
            //this.listenTo(globals.get("baseplane"), "change:zIndex", this._setArrowVis);

            this.setBound(options.bound);
    
            three.secondPassSceneAdd(this.object3D);

            //this._setArrowVis();
        },

        _setArrowVis: function(){
            var visibility = !appState.get("showOneLayer");
            var axis = globals.get("baseplane").getNormalAxis();
            if (!visibility){
                var height = globals.get("baseplane").get("zIndex");
                if (this.get("min")[axis] != height || this.get("max")[axis] != height){
                    globals.destroySelection3D();
                    return;
                }
            }

            var self = this;
            _.each(this.arrows, function(arrow, index){
                arrow.setVisibility(visibility || !(self.arrowAxisForIndex(index) == axis));
            });
            three.render();
        },

        _hideArrows: function(){
            _.each(this.arrows, function(arrow){
                arrow.setVisibility(false);
            });
        },

        _buildWireframe: function(mesh){
            var wireframe = new THREE.BoxHelper(mesh);
            wireframe.material.color.set(0x666666);
            return wireframe;
         },

        highlight: function(arrow, shouldHighlight){
            arrow.highlight(shouldHighlight);
        },

        getObjToIntersect: function(mouseIsDown){
            var highlighter = globals.get("highlighter");
            if (mouseIsDown && highlighter.highlightingArrow()) {
                var highlightedObject = highlighter.highlightedObject;
                var dragPlane = three.setupDragPlane(highlightedObject.getPosition(), highlightedObject.getRotation());
                return [dragPlane];
            }
            if (this.get("editMode")) {
                return this.highlightTargets;
            }
            return highlighter.getObjToIntersect();
        },

        dragArrow: function(arrow, point, shouldTranslate){

            var index = this.arrows.indexOf(arrow);
            var axis = this.arrowAxisForIndex(index);

            var dir = (index%2 == 0 ? "max" : "min");
            var bound = this.get(dir).clone();
            var oppDir = (index%2 == 0 ? "min" : "max");
            var oppBound = this.get(oppDir).clone();

            var sizeIncrement = this.get("sizeIncrement")[axis];

            var scale = lattice.getAspectRatio();
            var cellIndex = Math.round(point[axis]/scale[axis]);


            if (!shouldTranslate){
                var sign = (dir == "max") ? 1 : -1;
                cellIndex += sign*2;
                var n = Math.round((cellIndex - oppBound[axis] + sign)/sizeIncrement);
                if (n*sign <= 0) n = sign;
                cellIndex = oppBound[axis] + sizeIncrement*n - sign;
            } else {
                oppBound[axis] -= bound[axis] - cellIndex;
                this.set(oppDir, oppBound, {silent:true});
            }

            if (cellIndex == bound[axis]) return;//no change

            bound[axis] = cellIndex;
            this.set(dir, bound);
        },

        arrowAxisForIndex: function(i){
            if (Math.floor(i/2) == 0) return 'x';
            if (Math.floor(i/2) == 1) return 'y';
            return 'z';
        },
        
        setBound: function(bound){
            if (this.get("bound2") && bound.equals(this.get("bound2"))) {
                return;
            }

            var bound1 = this.get("bound1");
            var normalAxis = globals.get("baseplane").getNormalAxis();
            if (appState.get("showOneLayer") || !(bound1.x == bound.x || bound1.y == bound.y || bound1.z == bound)){
                bound[normalAxis] = bound1[normalAxis];
            }

            var sizeIncr = this.get("sizeIncrement");

            _.each(bound, function(index, axis){
                var sign = (index >= bound1[axis]) ? 1 : -1;
                var n = Math.round((index - bound1[axis] + sign)/sizeIncr[axis]);
                if (n == 0) n = sign;
                bound[axis] = bound1[axis] + sizeIncr[axis]*n - sign;
            });

            this.set("bound2", bound.clone());
    
            this.set("min", this.get("bound1").clone().min(this.get("bound2")), {silent: true});
            this.set("max", this.get("bound1").clone().max(this.get("bound2")), {silent: true});

            this._sizeChanged();
        },

        _sizeChanged: function(){
            var size = this.getSize();
            this.set("size", size);
            this.mesh.scale.set(size.x, size.y, size.z);

            var scale = lattice.getAspectRatio();
            var center = this.get("min").clone().add(this.get("max").clone().sub(this.get("min")).multiplyScalar(0.5).multiply(scale));
            this.mesh.position.set(center.x, center.y, center.z);

            this.object3D.children[1].update(this.mesh);//update box helper

            for (var i=0;i<4;i++){
                var axis = this.arrowAxisForIndex(i);
                var position = center.clone();
                if (i%2 == 0) {
                    position[axis] = this.get("max")[axis] + 1;
                } else {
                    position[axis] = this.get("min")[axis] - 1;
                }
                this.arrows[i].setPosition(position.multiply(scale));
            }
            three.render();
        },
        
        getSize: function(){
            return this.get("max").clone().sub(this.get("min")).add(new THREE.Vector3(1,1,1));
        },

        cellAtIndex: function(relIndex){
            return lattice.getCellAtIndex(this.get("min").clone().add(relIndex));
        },

        finish: function(cloneParams){
            if (globals.get("selectedRegion")) this.clone(cloneParams);
            else if (this.get("cutMode")) this.cut();
            else this.fill();
        },

        clone: function(params){
            lattice.addCellsInRange({min: this.get("min").clone(), max: this.get("max").clone()}, globals.get("selectedRegion"), params);
            appState.set("showOneLayer", true);
            globals.destroySelection3D();
        },
        
        fill: function(){
            lattice.addCellsInRange({min: this.get("min").clone(), max: this.get("max").clone()});
            appState.set("showOneLayer", true);
            globals.destroySelection3D();
        },

        cut: function(){
            lattice.removeCellsInRange({min: this.get("min").clone(), max: this.get("max").clone()});
            globals.destroySelection3D();
        },

        selectRegion: function(){
            this.mesh.material = selectedRegionMaterial;
            globals.destroySelectedRegion();
            globals.set("selectedRegion", this);
            globals.set("selection3D", null);
            this._hideArrows();
            three.render();
        },
        
        destroy: function(){
            this.off();
            this.stopListening();
            this.set("bound1", null, {silent:true});
            this.set("bound2", null, {silent:true});
            this.set("min", null, {silent:true});
            this.set("max", null, {silent:true});
            three.secondPassSceneRemove(this.object3D);
            var self = this;
            this.highlightTargets = null;
            _.each(this.arrows, function(arrow, index){
                arrow.destroy();
                self.arrows[index] = null;
            });
            this.arrows = null;
            this.mesh = null;
            this.object3D = null;
            three.render();
        }
        
        
    });

});