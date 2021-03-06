 /**
 * Created by aghassaei on 1/7/15.
 */


define(['jquery', 'underscore', 'backbone', 'fileSaver', 'navViewMenu', 'navHierarchicalMenu', 'appState', 'plist', 'threeModel'],
    function($, _, Backbone, fileSaver, NavViewMenu, NavHierarchicalMenu, appState, plist, three){

    return Backbone.View.extend({

        el: "body",

        events: {
            "click #showHideMenu":                                  "_setMenuVisibility",
            "click .menuHoverControls":                             "_setNavSelection",
            "click .hierDropdown":                                  "_setHierarchicalLevel",
            "shown.bs.modal .modal":                                "_showModal",
            "hide.bs.modal .modal":                                 "_hideModal",

            "click .saveJSON":                                      "_save",
            "click .saveAsJSON":                                    "_saveAs",
//            "change #saveAsFileName":                               "_saveAs",//detect enter key
            "click #exportSTL":                                     "_saveSTL",

            "click #openAssembly":                                   "_openAssembly",
            "click .importJSON":                                    "_importJSON",
            "change #jsonInput":                                    "_selectJSONFiles",
            "click .jsonFile":                                      "_loadJSON",

            "click #viewMenuDropdown":                              "_renderViewMenu",
            "click #videoRendering":                                "_videoRenderingSetup",
            "click #photoSetup":                                    "_photoSetup",
            "click #undoPhotoSetup":                                "_undoPhotoSetup",
            "click #orthoCamera":                                   "_orthoCamera",
            "click #perspectiveCamera":                             "_perspectiveCamera"
        },

        initialize: function(){

            this.viewMenu = new NavViewMenu({model:this.model});
            this.hierarchicalMenu = new NavHierarchicalMenu({model:this.model});

            _.bindAll(this, "_setMenuVisibility", "_setNavSelection");

            this.listenTo(this.model, "change:currentNav", this._updateNavSelectionUI);

            this._logo();
            this._updateNavSelectionUI();
        },

        _setMenuVisibility: function(e){
            e.preventDefault();
            var state = this.model.get("menuIsVisible");
            this.model.set("menuIsVisible", !state);
            $(e.target).blur();
        },

        _setNavSelection: function(e){
            var navSelection = $(e.target).data("menuId");
            if (navSelection == "about") {
                $(e.target).blur();
                return;
            }
            e.preventDefault();
            if (navSelection == "navSim"){//choose which simulation package to pull up
                var hierLevel = appState.get("hierLevel");
                if (hierLevel == "module" || hierLevel == "system"){
                    $("#comingSoon").modal("show");
                    return;
                }
                this.model.set("currentNav", appState.get("materialClass") + "NavSim");
                return;
            } else if (navSelection == "navDesign" && appState.get("currentNav") == "navDesign"){//optionally show the design dropdown
                this.hierarchicalMenu.render();
                $(e.target).parent().addClass("open");
            }

            if (navSelection) this.model.set("currentNav", navSelection);
        },

        _updateNavSelectionUI: function(){
            this._deselectAllNavItems();
            var navSelection = this.model.get("currentNav");
            if (plist.allMenus[navSelection].parentNav) navSelection = plist.allMenus[navSelection].parentNav;
            else if (plist.allMenus[navSelection].parent) navSelection = plist.allMenus[navSelection].parent;
            _.each($(".menuHoverControls"), function(link){
                var $link = $(link);
                if ($link.data("menuId") == navSelection) $link.parent().addClass("navSelectedTab");//highlight
            });
        },

        _setHierarchicalLevel: function(e){
            e.preventDefault();
            $(".open").removeClass("open");
        },

        _logo: function(){
            var $logo = $("#logo");
            $logo.mouseover(function(){
                $logo.attr("src","assets/imgs/logo-active.png");
            });
            $logo.mouseout(function(){
                $logo.attr("src","assets/imgs/logo.png");
            });
        },

        _deselectAllNavItems: function(){
            $(".open").removeClass("open");//no highlight
            $(".navSelectedTab").removeClass("navSelectedTab");//no highlight
        },

        _showModal: function(e){
            var input = $(e.target).find("input.filename");
            input.focus();
            input.select();
        },

        _hideModal: function(e){
            $(e.target).find("input.filename").blur();
        },


        _renderViewMenu: function(){
            this.viewMenu.render();
        },

         _videoRenderingSetup: function(e){
            e.preventDefault();
            window.resizeTo(1000, 700);//todo this doesn't work
        },

        _photoSetup: function(e){
            e.preventDefault();
            appState.hideAllUi();
            var navSelection = appState.get("currentNav");
            if (plist.allMenus[navSelection].parentNav) navSelection = plist.allMenus[navSelection].parentNav;
            if (plist.allMenus[navSelection].parent) navSelection = plist.allMenus[navSelection].parent;
            if (navSelection != "navSim") appState.set("basePlaneIsVisible", false);
            appState.set("highlighterIsVisible", false);
            three.setBackgroundColor(0xffffff);
        },

        _undoPhotoSetup: function(e){
            e.preventDefault();
            appState.set("menuIsVisible", true);
            appState.set("ribbonIsVisible", true);
            appState.set("basePlaneIsVisible", true);
            if (appState.get("currentNav") == "navDesign") appState.set("highlighterIsVisible", true);
            three.setBackgroundColor(0xcccccc);
        },

        _orthoCamera: function(e){
            e.preventDefault();
            three.orthographicCamera();
        },

        _perspectiveCamera: function(e){
            e.preventDefault();
            three.perspectiveCamera();
        },



        _save: function(e){
            e.preventDefault();
            fileSaver.save();
        },

        _saveAs: function(e){
            e.preventDefault();
            var fileName = $("#saveAsFileName").val();
            fileSaver.save(fileName);
            $('#saveAsModel').modal('hide');
        },

        _saveSTL: function(e){
            e.preventDefault();
            fileSaver.saveSTL();
        },



        _openAssembly: function(e){
            e.preventDefault();
            appState.openAssembly();
        },

        _importJSON: function(e){
            e.preventDefault();
            $("#jsonInput").click();
        },

        _selectJSONFiles: function(e){
            e.preventDefault();
            var input = $(e.target),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            this._readDataURL(numFiles, label, input.get(0).files);
            input.val("");
        },

        _readDataURL: function(numFiles, filename, files){
            if (numFiles>1) console.warn("too many files selected");
            var reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = (function() {
                return function(e) {
                    var extension = filename.substr(filename.length - 5);
                    if (extension == ".json"){
                        fileSaver.loadFile(JSON.parse(e.target.result));
                    } else console.warn("file type not recognized");
                }
            })();
        },

        _loadJSON: function(e){
            e.preventDefault();
            this.model.set("currentNav", "navDesign");
            var url = $(e.target).data("file");
            $.getJSON( url, function(data) {
                fileSaver.loadFile(data);
            });
        }

    });
});