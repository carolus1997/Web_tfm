var mapMain;
require([
        "esri/map",
        "esri/graphic",
       
        "esri/tasks/locator",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/TextSymbol",
        "esri/symbols/Font",

        "esri/geometry/normalizeUtils",
        "esri/tasks/GeometryService",
        "esri/toolbars/draw",

        "dojo/_base/Color",
        "dojo/_base/array",

        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dojo/ready",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"
], function(Map, Graphic,
     Locator, SimpleMarkerSymbol, TextSymbol, Font,
     normalizeUtils,GeometryService,Draw,
    Color, array,
    dom, on, parser, ready,
    BorderContainer, ContentPane){
        ready(function(){

            var locator;
            parser.parse();

            mapMain= new Map(
                'divCentro', {
                    basemap:'streets-vector',
                    center:[-3.690087,40.376478] ,
                    zoom: 6
                });

 //CREO EL LOCALIZADOR

            taskLocator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");

            //LE DIGO DONDE SE SITUA Y QUE DEBE ACCIONARSE CUANDO LE DEN CLICK A doAdressToLocations

            on(dom.byId("btnLocate"), "click", doAddressToLocations);

            // 
            taskLocator.on("address-to-locations-complete", showResults);

            function doAddressToLocations() {
                //Quita lo dibujado anteriormente
                mapMain.graphics.clear();
                //Hace que vaya a la direccion puesta en el text area
                var objAddress = {
                    "SingleLine": dom.byId("taAddress").value
                }
                var params = {
                    address: objAddress,
                    outFields: ["Loc_name"]
                }
                console.log('params', params);
                taskLocator.addressToLocations(params);

            }
            function showResults(candidates) {
                // Define la simbología del marcador
                var symbolMarker = new SimpleMarkerSymbol();
                symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
                symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
                var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Arial");

                // loop through the array of AddressCandidate objects
                var geometryLocation;
                array.every(candidates.addresses, function (candidate) {

                    // if the candidate was a good match
                    if (candidate.score > 80) {

                        // retrieve attribute info from the candidate
                        var attributesCandidate = {
                            address: candidate.address,
                            score: candidate.score,
                            locatorName: candidate.attributes.Loc_name
                        };

                        //Resultados de la geometria
                        geometryLocation = candidate.location;

                        //Mete la info geocodificada en el mapa
                        var graphicResult = new Graphic(geometryLocation, symbolMarker, attributesCandidate);
                        mapMain.graphics.add(graphicResult);

                        // Mete el candidato a la geolocalizacion como texto
                        var sAddress = candidate.address;
                        var textSymbol = new TextSymbol(sAddress, font, new Color("#FF0000"));
                        textSymbol.setOffset(0, -22);
                        mapMain.graphics.add(new Graphic(geometryLocation, textSymbol));

                        // exit the loop after displaying the first good match
                        return false;
                    }
                });

                // Center and zoom the map on the result
                if (geometryLocation !== undefined) {
                    mapMain.centerAndZoom(geometryLocation, 15);
                }
            }
// CREO EL BUFFER














        })







    })