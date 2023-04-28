/* 
class OsmWay {
    constructor(vertices, width = 1) {
      let dx, dz, len, dxperp, dzperp, nextVtxProvisional = [], thisVtxProvisional;
      const k = vertices.length - 1;
      const realVertices = [];
      
      for (let i = 0; i < k; i++) {
        dx = vertices[i + 1][0] - vertices[i][0];
        dz = vertices[i + 1][2] - vertices[i][2];
        len = this.distance(vertices[i], vertices[i + 1]);
        dxperp = -(dz * (width / 2)) / len;
        dzperp = dx * (width / 2) / len;
        
        thisVtxProvisional = [
          vertices[i][0] - dxperp,
          vertices[i][1],
          vertices[i][2] - dzperp,
          vertices[i][0] + dxperp,
          vertices[i][1],
          vertices[i][2] + dzperp,
        ];
        
        if (i > 0) {
          thisVtxProvisional = thisVtxProvisional.map((vtx, j) => {
            return (vtx + nextVtxProvisional[j]) / 2;
          });
        }
        
        realVertices.push(...thisVtxProvisional);
        nextVtxProvisional = [
          vertices[i + 1][0] - dxperp,
          vertices[i + 1][1],
          vertices[i + 1][2] - dzperp,
          vertices[i + 1][0] + dxperp,
          vertices[i + 1][1],
          vertices[i + 1][2] + dzperp,
        ];
      }
      
      dxperp = -(dz * (width / 2)) / len;
      dzperp = dx * (width / 2) / len;
      
      realVertices.push(
        vertices[k][0] - dxperp,
        vertices[k][1],
        vertices[k][2] - dzperp,
        vertices[k][0] + dxperp,
        vertices[k][1],
        vertices[k][2] + dzperp,
      );
  
      let indices = [];
      for (let i = 0; i < k; i++) {
        indices.push(i * 2, i * 2 + 1, i * 2 + 2);
        indices.push(i * 2 + 1, i * 2 + 3, i * 2 + 2);
      }
  
      let geom = new THREE.BufferGeometry();
      let bufVertices = new Float32Array(realVertices);
      geom.setIndex(indices);
      geom.setAttribute('position', new THREE.BufferAttribute(bufVertices, 3));
      geom.computeBoundingBox();
      this.geometry = geom;
    }
  
    distance(v1, v2) {
      const dx = v2[0] - v1[0];
      const dy = v2[1] - v1[1];
      const dz = v2[2] - v1[2];
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
  }
  */

  class OsmWay {
    constructor(vertices, width = 1) {
        const shape = new THREE.Shape();
        const k = vertices.length - 1;
        const points = [];
        for (let i = 0; i <= k; i++) {
            const p = new THREE.Vector2(vertices[i][0], vertices[i][2]);
            points.push(p);
            if (i === 0) {
                shape.moveTo(p.x, p.y);
            } else {
                shape.lineTo(p.x, p.y);
            }
        }
        const extrudeSettings = {
            depth: width,
            bevelEnabled: false,
        };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const bufVertices = geom.getAttribute('position').array;
        const realVertices = [];
        for (let i = 0, len = bufVertices.length; i < len; i += 3) {
            realVertices.push(bufVertices[i], bufVertices[i + 1], bufVertices[i + 2]);
        }
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(realVertices), 3));
    }
}
