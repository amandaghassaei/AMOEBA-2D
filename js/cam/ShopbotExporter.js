/**
 * Created by aghassaei on 3/10/15.
 */

function ShopbotExporter() {
}

ShopbotExporter.prototype.makeHeader = function(){
    var data = "";
    data += this.addLine("FG", [], "single step mode");
    data += this.goHome();
    data += this.addLine("SA", [], "absolute distances");
    data += this.addLine("SM", [], "move/cut mode");
    data += this.addLine("JS", [4, 1], "jog speed xy, z");
    data += this.addLine("MS", [2, 0.5], "move speed xy, z");
    return data;
};

ShopbotExporter.prototype.addLine = function(command, params, comment){
    var data = "";
    data += command + " ";
    _.each(params, function(param){
        data += param + ", ";
    });
    if (comment) data += "'" +comment;
    data += "\n";
    return data;
};

ShopbotExporter.prototype.addComment = function(comment){
    return "'" + comment + "\n";
};

ShopbotExporter.prototype.rapid3 = function(x, y, z){
    return this.addLine("J3", [x,y,z]);
};

ShopbotExporter.prototype.move3 = function(x, y, z){
    return this.addLine("M3", [x,y,z]);
};

ShopbotExporter.prototype.goHome = function(){
    return this.addLine("JH", [], "go home");
};

ShopbotExporter.prototype.moveZ = function(z){
    return this.move3("", "", z);
};

ShopbotExporter.prototype.makeFooter = function(){
    var data = "";
    data += this.goHome();
    return data;
};

ShopbotExporter.prototype.save = function(data){
    var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "ShopbotExport" + ".sbp");
};
