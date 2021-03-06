/**
 * Created by aghassaei on 9/24/15.
 */


define([], function(){

    return {
        allMaterialClasses:{
            element:{
                elementMech: "Elemental Mechanical",
                elementElectronic: "Elemental Electronic"
            },
            function:{
                em: "Functional Bricks"
            },
            module:{
                module: "Robotic Modules"
            },
            system:{
                system: "Systems"
            }
        },

        allMaterials:{
            em:{
                insulating: {
                    name: "Structural",
                    color: "#fcefb5",
                    altColor: "#fcefb5",
                    properties:{
                        conductive: false,
                        density: 3500,//kg/m^3
                        longitudalK:{x:80,y:80,z:80},
                        conductiveAxes: [
                            {x:0, y:0, z:1},
                            {x:0, y:0, z:-1},
                            {x:1, y:0, z:0},
                            {x:-1, y:0, z:0},
                            {x:0, y:1, z:0},
                            {x:0, y:-1, z:0}
                        ],
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                bending1DOF: {
                    name: "1 DOF Hinge",
                    color: "#cda4f3",
                    altColor: "#cda4f3",
                    texture: "stripes",
                    mesh: "bending1dof",
                    properties:{
                        conductive: false,
                        density: 3500,//kg/m^3
                        conductiveAxes: [
                            {x:1, y:0, z:0},
                            {x:-2, y:0, z:0}
                        ],
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:2},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                shear1DOF: {
                    name: "Shear Flexure",
                    color: "#cda4f3",
                    altColor: "#cda4f3",
                    texture: "cubeTextureShearFlex",
                    properties:{
                        conductive: false,
                        density: 3500,//kg/m^3
                        conductiveAxes: [
                            {x:0, y:1, z:0},
                            {x:0, y:-1, z:0}
                        ],
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:2,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                isoFlex: {
                    name: "Iso-Flexible",
                    color: "#cda4f3",
                    altColor: "#cda4f3",
                    texture: "stripes",
                    properties:{
                        conductive: false,
                        conductiveAxes: [
                            {x:0, y:0, z:1},
                            {x:0, y:0, z:-1},
                            {x:1, y:0, z:0},
                            {x:-1, y:0, z:0},
                            {x:0, y:1, z:0},
                            {x:0, y:-1, z:0}
                        ],
                        density: 3500,//kg/m^3
                        longitudalK:{x:10,y:10,z:10},
                        shearK:{xy:10,xz:10,yx:10,yz:10,zx:10,zy:10},
                        bendingK:{x:10,y:10,z:10},
                        torsionK:{x:10,y:10,z:10}
                    }
                },
                conductive:{
                    name: "Conductive",
                    color: "#b5a642",
                    altColor: "#857B64",
                    properties:{
                        conductive: true,
                        conductiveAxes: [
                            {x:1, y:0, z:0},
                            {x:-1, y:0, z:0},
                            {x:0, y:1, z:0},
                            {x:0, y:-1, z:0},
                            {x:0, y:0, z:1},
                            {x:0, y:0, z:-1}
                        ],
                        density: 3500,//kg/m^3
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                conductiveStraight:{
                    name: "Electronic Routing (Straight)",
                    color: "#b5a642",
                    altColor: "#857B64",
                    mesh: "wireStraight",
                    properties:{
                        conductive: true,
                        conductiveAxes: [
                            {x:0, y:1, z:0},
                            {x:0, y:-1, z:0}
                        ],
                        density: 3500,//kg/m^3
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                conductiveBend:{
                    name: "Electronic Routing (Bend)",
                    color: "#b5a642",
                    altColor: "#857B64",
                    mesh: "wireBent",
                    properties:{
                        conductive: true,
                        conductiveAxes: [
                            {x:1, y:0, z:0},
                            {x:0, y:1, z:0}
                        ],
                        density: 3500,//kg/m^3
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                conductiveJunction1:{
                    name: "Electronic Routing (Split Type 1)",
                    color: "#b5a642",
                    altColor: "#857B64",
                    mesh: "wireJunction1",
                    properties:{
                        conductive: true,
                        conductiveAxes: [
                            {x:1, y:0, z:0},
                            {x:-1, y:0, z:0},
                            {x:0, y:1, z:0}
                        ],
                        density: 3500,//kg/m^3
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                conductiveBending1DOF: {
                    name: "Conductive 1 DOF Hinge",
                    color: "#b4ac9c",
                    altColor: "#b4ac9c",
                    texture: "stripes",
                    mesh: "bending1dof",
                    properties:{
                        conductive: true,
                        density: 3500,//kg/m^3
                        conductiveAxes: [
                            {x:1, y:0, z:0},
                            {x:-2, y:0, z:0}
                        ],
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:2},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                conductiveShear1DOF: {
                    name: "Conductive Shear Flexure",
                    color: "#b4ac9c",
                    altColor: "#b4ac9c",
                    texture: "cubeTextureShearFlex",
                    properties:{
                        conductive: true,
                        density: 3500,//kg/m^3
                        conductiveAxes: [
                            {x:0, y:1, z:0},
                            {x:0, y:-1, z:0}
                        ],
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:2,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                actuatorLinear1DOF: {
                    name: "Linear Actuator",
                    color: "#FFCC00",
                    altColor: "#FFCC00",
                    texture: "cubeTexture",
                    properties:{
                        conductive: false,
                        actuator: true,
                        conductiveAxes: [
                            {x:1, y:0, z:0},
                            {x:-1, y:0, z:0}
                        ],
                        density: 3500,//kg/m^3
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                actuatorBending1DOF: {
                    name: "Bending Actuator",
                    color: "#FFCC00",
                    altColor: "#FFCC00",
                    mesh: "bending1dof",
                    properties:{
                        conductive: false,
                        actuator: true,
                        conductiveAxes: [
                            {x:1, y:0, z:0},
                            {x:-1, y:0, z:0}
                        ],
                        density: 3500,//kg/m^3
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                actuatorShear: {
                    name: "Shear Actuator",
                    color: "#FFCC00",
                    altColor: "#FFCC00",
                    texture: "cubeTextureShear",
                    properties:{
                        conductive: false,
                        actuator: true,
                        conductiveAxes: [
                            {x:0, y:1, z:0},
                            {x:0, y:-1, z:0}
                        ],
                        density: 3500,//kg/m^3
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                },
                signal: {
                    name: "Signal Generator",
                    color: "#0EE3B8",
                    altColor: "#0EE3B8",
                    mesh: "siliconModule",
                    properties:{
                        conductive: false,
                        silicon: true,
                        conductiveAxes: [
                            {x:1, y:0, z:0},
                            {x:-1, y:0, z:0}
                        ],
                        density: 3500,//kg/m^3
                        longitudalK:{x:80,y:80,z:80},
                        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                        bendingK:{x:80,y:80,z:80},
                        torsionK:{x:80,y:80,z:80}
                    }
                }//,
                //transistor: {
                //    name: "Transistor (Coming Soon)",
                //    color: "#0EE3B8",
                //    altColor: "#0EE3B8",
                //    mesh: "wireJunction1",
                //    properties:{
                //        conductive: false,
                //        density: 6500,//kg/m^3
                //        longitudalK:{x:80,y:80,z:80},
                //        shearK:{xy:80,xz:80,yx:80,yz:80,zx:80,zy:80},
                //        bendingK:{x:80,y:80,z:80},
                //        torsionK:{x:80,y:80,z:80}
                //    }
                //}
            },
            elementMech: {
                brass: {
                    name: "Brass",
                    color: "#b5a642",
                    altColor: "#ababcc",
                    properties: {
                        conductive: true,
                        density: 8500,//kg/m^3
                        elasMod: 1000,//Gpascals (kg/(s^2*m)/10000000000)
                        k: 500
                    }
                },
                alum: {
                    name: "Aluminum",
                    color: "#9CC9CB",
                    altColor: "#9CC9CB",
                    properties: {
                        conductive: true,
                        density: 8500,//kg/m^3
                        elasMod: 1000,//Gpascals (kg/(s^2*m)/10000000000)
                        k: 1000
                    }
                },
                fiberglass: {
                    name: "Fiberglass",
                    color: "#8a2be2",
                    altColor: "#8a2be2",
                    properties: {
                        conductive: false,
                        density: 3500,//kg/m^3
                        elasMod: 17.2,
                        k: 500
                    }
                },
                rubber: {
                    name: "Rubber",
                    color: "#cda4f3",
                    altColor: "#f5e8d0",
                    texture: "stripes",
                    properties: {
                        conductive: false,
                        density: 3500,//kg/m^3
                        elasMod: 0.01,
                        k: 30
                    }
                },
                //heatResist: {
                //    name: "Kapton",
                //    color: "#9CC9CB",
                //    altColor: "#9CC9CB",
                //    properties:{
                //        conductive: false,
                //        density: 500,//kg/m^3
                //        elasMod: 17.2
                //    }
                //},
                piezo: {
                    name: "Piezo",
                    color: "#FFCC00",
                    altColor: "#FFCC00",
                    properties: {
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 200
                    }
                }
            },
            elementElectronic:{
                brass: {
                    name: "Brass",
                    color: "#b5a642",
                    altColor: "#857B64",
                    properties: {
                        conductive: true,
                        density: 8500,//kg/m^3
                        elasMod: 1000,//Gpascals (kg/(s^2*m)/10000000000)
                        k: 500
                    }
                },
                alum: {
                    name: "Aluminum",
                    color: "#9CC9CB",
                    altColor: "#9CC9CB",
                    properties: {
                        conductive: true,
                        density: 8500,//kg/m^3
                        elasMod: 1000,//Gpascals (kg/(s^2*m)/10000000000)
                        k: 1000
                    }
                },
                fiberglass: {
                    name: "Fiberglass",
                    color: "#8a2be2",
                    altColor: "#8a2be2",
                    properties: {
                        conductive: false,
                        density: 3500,//kg/m^3
                        elasMod: 17.2,
                        k: 500
                    }
                },
                carbon: {
                    name: "Resistive",
                    color: "#222",
                    altColor: "#000",
                    properties:{
                        conductive: false,
                        density: 500,//kg/m^3
                        elasMod: 181,
                        k: 1000
                    }
                },
                nmos: {
                    name: "NMOS",
                    color: "#F99987",
                    altColor: "#F99987",
                    properties:{
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                pmos: {
                    name: "PMOS",
                    color: "#0EE3B8",
                    altColor: "#0EE3B8",
                    properties:{
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                //diode: {
                //    name: "Diode",
                //    color: "#dfccaf",
                //    altColor: "#dfccaf",
                //    properties:{
                //        conductive: false,
                //        density: 6500,//kg/m^3
                //        elasMod: 50,
                //        k: 1000
                //    }
                //},
                //zener: {
                //    name: "Zener Diode",
                //    color: "#bf390b",
                //    altColor: "#bf390b",
                //    properties:{
                //        conductive: false,
                //        density: 6500,//kg/m^3
                //        elasMod: 50,
                //        k: 1000
                //    }
                //}
            },
            module: {
                routing: {
                    name: "Routing",
                    color: "#dfccaf",
                    altColor: "#857B64",
                    properties: {
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                clamp: {
                    name: "Clamp",
                    color: "#dfccaf",
                    altColor: "#dfccaf",
                    properties: {
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                actuator: {
                    name: "Linear Actuator",
                    color: "#dfccaf",
                    altColor: "#dfccaf",
                    properties: {
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                gripper: {
                    name: "Gripper",
                    color: "#dfccaf",
                    altColor: "#dfccaf",
                    properties: {
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                readHead: {
                    name: "Read Head",
                    color: "#dfccaf",
                    altColor: "#dfccaf",
                    properties: {
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                writeHead: {
                    name: "Write Head",
                    color: "#dfccaf",
                    altColor: "#dfccaf",
                    properties: {
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                script: {
                    name: "Micro Controller",
                    color: "#dfccaf",
                    altColor: "#dfccaf",
                    properties: {
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                }
            },
            system: {
                structural: {
                    name: "Structural",
                    color: "#bf390b",
                    altColor: "#bf390b",
                    properties:{
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                mobile: {
                    name: "Mobile",
                    color: "#bf390b",
                    altColor: "#bf390b",
                    properties:{
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                },
                register: {
                    name: "Register",
                    color: "#bf390b",
                    altColor: "#bf390b",
                    properties:{
                        conductive: false,
                        density: 6500,//kg/m^3
                        elasMod: 50,
                        k: 1000
                    }
                }
            }
        }
    }

});