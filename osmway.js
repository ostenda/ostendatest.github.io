class OsmWay {
    constructor(vertices, width = 1) {
        const realVertices = [];
        const indices = [];

        for (let i = 0; i < vertices.length - 1; i++) {
            const p1 = vertices[i];
            const p2 = vertices[i + 1];

            const dx = p2[0] - p1[0];
            const dz = p2[2] - p1[2];
            const len = Math.sqrt(dx*dx + dz*dz);

            const dxperp = -dz * (width / (2 * len));
            const dzperp = dx * (width / (2 * len));

            const v1 = [p1[0] + dxperp, p1[1], p1[2] + dzperp];
            const v2 = [p1[0] - dxperp, p1[1], p1[2] - dzperp];
            const v3 = [p2[0] + dxperp, p2[1], p2[2] + dzperp];
            const v4 = [p2[0] - dxperp, p2[1], p2[2] - dzperp];

            const offset = realVertices.length / 3;
            realVertices.push(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2], v4[0], v4[1], v4[2]);

            indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2);
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(realVertices), 3));
        geom.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
        geom.computeBoundingBox();

        this.geometry = geom;
    }
}
