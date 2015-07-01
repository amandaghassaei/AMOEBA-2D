/**
 * Created by aghassaei on 6/29/15.
 */

//assume latticeESim has loaded?
define(['cell', 'lattice'], function(DMACell, lattice){

    DMACell.prototype.setConnectivityGroupNum = function(num, force){
        if (force) this._eSimConnectivityGroup = num;
        else if (this._eSimConnectivityGroup>num){
            this._eSimConnectivityGroup = num;
            this.propagateConnectivityGroupNum(num);
        }
    };

    DMACell.prototype.getConnectivityGroupNum = function(){
        return this._eSimConnectivityGroup;
    };

    DMACell.prototype.propagateConnectivityGroupNum = function(num){
        if (num===undefined) num = this._eSimConnectivityGroup;
        lattice.propagateToNeighbors(this.getAbsoluteIndex(), function(neighbor){
            if (neighbor) neighbor.setConnectivityGroupNum(num);
        });
    };

});