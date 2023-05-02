AFRAME.registerComponent('osm', {
    schema: {
      latitude: { type: 'number', default: 0 },
      longitude: { type: 'number', default: 0 }
    },
    init: function () {
      this.downloaded = false;
      this.camera = document.querySelector('[gps-new-camera]');
      this.camera.addEventListener('gps-camera-update-position', this.handleCameraUpdate.bind(this));
    },
    update: function () {
      const { latitude, longitude } = this.data;
      if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
        this.readOsm(latitude, longitude);
      }
    },
    handleCameraUpdate: function (event) {
      if (!this.downloaded) {
        const { latitude, longitude } = event.detail.position;
        this.readOsm(latitude, longitude);
        this.downloaded = true;
      }
    },
    readOsm: function (lat, lon) {
      const gpsCameraComponent = this.camera.components['gps-new-camera'];
      if (!gpsCameraComponent) {
        console.warn('gps-new-camera component not initialized');
        return;
      }
      const bbox = `${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}`;
      const url = `https://hikar.org/webapp/map?bbox=${bbox}&layers=ways&outProj=4326`;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          const drawProps = {
            'footway': { color: '#000000' },
            'path': { color: '#000000' },
            'bridleway': { color: '#000000' },
            'byway': { color: '#000000' },
            'track': { color: '#000000' },
          };
          const objectIds = [];
          json.features.forEach((feature, index) => {
            const { geometry, properties } = feature;
            if (geometry.type !== 'LineString' || geometry.coordinates.length < 2) {
              return;
            }
            const line = [];
            geometry.coordinates.forEach(coord => {
              const [x, y] = gpsCameraComponent.threeLoc.lonLatToWorldCoords(coord[0], coord[1]);
              line.push([x, 0, y]);
            });
            const highway = properties.highway;
            const color = drawProps[highway] ? drawProps[highway].color || '#000000' : '#000000';
            const width = drawProps[highway] ? drawProps[highway].width || 2 : 2;
            const material = new THREE.MeshBasicMaterial({ color });
            const mesh = new THREE.Mesh(new Way(line, width).geometry, material);
            this.el.setObject3D(properties.osm_id, mesh);
            objectIds.push(properties.osm_id);
          });
          this.el.emit('vector-ways-loaded', { objectIds });
        })
        .catch(error => {
          console.error('Failed to fetch OSM data:', error);
        });
    }
  });
  