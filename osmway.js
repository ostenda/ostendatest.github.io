class OsmWay {
    constructor(vertices, width = 1) {
      const k = vertices.length - 1;
      const points = [];
      for (let i = 0; i <= k; i++) {
        const vertex = vertices[i];
        points.push(new THREE.Vector3(vertex[0], vertex[1], vertex[2]));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const line = new THREE.Line(geometry, material);
      this.line = line;
    }
  }
  