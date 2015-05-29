/**
 * Created by aghassaei on 5/26/15.
 */


latticeSubclasses = latticeSubclasses || {};

latticeSubclasses["KelvinLattice"] = {

        _initLatticeType: function(){
            globals.basePlane = new SquareBasePlane();
            globals.highlighter = new TruncatedCubeHighlighter();
        },

        getIndexForPosition: function(absPosition){
            return this._indexForPosition(absPosition);
        },

        getPositionForIndex: function(index){
            return this._positionForIndex(index);
        },

        xScale: function(cellSeparation){
            if (cellSeparation === undefined) cellSeparation = this.get("cellSeparation").xy;
            return 2*Math.sqrt(2)+2*cellSeparation;
        },

        yScale: function(cellSeparation){
            return this.xScale(cellSeparation);
        },

        zScale: function(cellSeparation){
            if (cellSeparation === undefined) cellSeparation = this.get("cellSeparation").z;
            return 2*Math.sqrt(2)+2*cellSeparation;
        },

        makeCellForLatticeType: function(indices){
            return new KelvinCell(indices);
        },

        _undo: function(){//remove all the mixins, this will help with debugging later
            var self = this;
            _.each(_.keys(this.KelvinLattice), function(key){
                self[key] = null;
            });
        }
    }