const loadList = require('./apiLoadList');
const loadDetails = require('./apiLoadDetails');
const getDetailsContentLayout = require('./details');
const createFilterControl = require('./filter');

const initMap = function(ymaps, containerId) {
    const myMap = new ymaps.Map(containerId, {
        center: [
            55.76,
            37.64
        ],
        controls: [],
        zoom: 10
    });

    const objectManager = new ymaps.ObjectManager({
        clusterize: true,
        gridSize: 64,
        clusterIconLayout: 'default#pieChart',
        clusterDisableClickZoom: false,
        geoObjectOpenBalloonOnClick: false,
        geoObjectHideIconOnBalloonOpen: false,
        geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps)
    });

    loadList().then((data) => {
        objectManager.add(data);
    });

    myMap.geoObjects.add(objectManager);

    // details
    objectManager.objects.events.add('click', (event) => {
        const objectId = event.get('objectId');
        const obj = objectManager.objects.getById(objectId);

        objectManager.objects.balloon.open(objectId);

        if (!obj.properties.details) {
            loadDetails(objectId).then((data) => {
                obj.properties.details = data;
                objectManager.objects.balloon.setData(obj);
            });
        }
    });

    // filters
    const listBoxControl = createFilterControl(ymaps);

    myMap.controls.add(listBoxControl);

    const filterMonitor = new ymaps.Monitor(listBoxControl.state);

    filterMonitor.add('filters', (filters) => {
        objectManager.setFilter((obj) => filters[obj.isActive
            ? 'active'
            : 'defective']);
    });
};

module.exports = initMap;
