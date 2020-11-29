((c, d, w) => {
    const marcadores = [],
        $mapa = d.querySelector('.mapa'),
        $buscador = d.querySelector('#buscador'),
        $latitud = d.getElementById('latitud'),
        $longitud = d.getElementById('longitud'),
        $imagenMarcador = 'https://icon-icons.com/icons2/165/PNG/48/mapmarker_marker_outside_pink_23005.png';
    const infoUbicación = `<div id="content">
            <div id="siteNotice">
            </div>
            <h1 class="firstHeading" id="firstHeading">
                Code
            </h1>
            <div id="bodyContent">
                <p>
                    <b>
                        Codero
                    </b>
                    , also referred to as
                    <b>
                        Ayers Rock
                    </b>
                    , is a large    sandstone rock formation in the southern part of the
    Northern Territory, central Australia. It lies 335 km (208 mi)
    south west of the nearest large town, Alice Springs; 450 km
    (280 mi) by road. Kata Tjuta and Uluru are the two major
    features of the Uluru - Kata Tjuta National Park. Uluru is
    sacred to the Pitjantjatjara and Yankunytjatjara, the
    Aboriginal people of the area. It has many springs, waterholes,
    rock caves and ancient paintings. Uluru is listed as a World
    Heritage Site.
                </p>
                <p>
                    Attribution: Code,
                    <a href="#">
                        www.dominio.com
                    </a>
                    (last visited June 22, 2020).
                </p>
            </div>
        </div>`;
    let latitud = -12.0484605,
        longitud = -77.0264055;
    const geolocalizacion = (e) => {
        const optionsgeo = {
            enableHighAccuracy: true,
            timeout: 5000,
            maxmumAge: 0,
        };
        const success = (position) => {
            let cord = position.coords;
            latitud = cord.latitude;
            longitud = cord.longitude;
        };
        const error = (error) => {
            alert('Su navegagor no soporta la geolocalizacion');
        };
        navigator.geolocation.getCurrentPosition(success, error, optionsgeo);
    };
    const posicion = {
        lat: latitud,
        lng: longitud
    }
    const moverMarcador = (marker) => {
        google.maps.event.addListener(marker, 'dragend', function(e) {
            $latitud.value = e.latLng.lat();
            $longitud.value = e.latLng.lng();
            setInfoUbicacion.setContent(`<div><strong>${place.name}</strong><br>${direccion}</div>`);
            setInfoUbicacion.open(map, marcador);
        });
    }
    const agregarMarcadorMap = (location) => {
        const marcador = new google.maps.Marker({
            position: location,
            map: map,
            // icon: $imagenMarcador,
            draggable: true,
            animation: google.maps.Animation.DROP,
        });
        for (let i in marcadores) {
            marcadores[i].setMap(null);
        }
        $latitud.value = location.lat();
        $longitud.value = location.lng();
        marcadores.push(marcador);
        buscadorAutocomplete(marcador);
        moverMarcador(marcador);
    }
    const setInfoUbicacion = new google.maps.InfoWindow({
        content: infoUbicación,
        maxWidth: 300
    });
    const buscadorAutocomplete = (marcador) => {
        const autoCompletado = new google.maps.places.Autocomplete($buscador);
        autoCompletado.bindTo('bounds', map);
        autoCompletado.addListener('place_changed', () => {
            let place = autoCompletado.getPlace();
            if (!place.geometry.viewport) {
                alert('Error al cargar el lugar');
                return;
            }
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.viewport);
                mapa.setZoom(17);
            }
            marcador.setPosition(place.geometry.location);
            $latitud.value = place.geometry.location.lat();
            $longitud.value = place.geometry.location.lng();
            let direccion = "";
            if (place.address_components) {
                direccion = [
                    place.address_components[0] && place.address_components[0].short_name || 'No registrado',
                    place.address_components[0] && place.address_components[0].short_name || 'No registrado',
                    place.address_components[0] && place.address_components[0].short_name || 'No registrado'
                ];
                setInfoUbicacion.setContent(`<div><strong>${place.name}</strong><br>${direccion}</div>`);
                setInfoUbicacion.open(map, marcador);
            }
        });
    }
    const cargarMapa = () => {
        const opciones = {
            zoom: 15,
            center: posicion,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map($mapa, opciones);
        map.addListener("click", (event) => {
            agregarMarcadorMap(event.latLng);
        });
        const marcador = new google.maps.Marker({
            position: posicion,
            map: map,
            title: 'SportBetPeru',
            // icon: $imagenMarcador,
            draggable: true,
            animation: google.maps.Animation.DROP,
        });
        marcadores.push(marcador);
        marcador.addListener("click", () => {
            setInfoUbicacion.open(map, marcador);
        });
        buscadorAutocomplete(marcador);
        moverMarcador(marcador);
    }
    geolocalizacion()
    cargarMapa();
})(console, document, window);