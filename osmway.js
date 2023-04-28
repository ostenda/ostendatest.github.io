// Define a class called OsmWay
class OsmWay {
    // The constructor function takes an array of vertices and a width as arguments
    constructor(vertices, width = 1) {
        // Define two empty arrays to hold the actual vertices and indices of the geometry
        const realVertices = [];
        const indices = [];

        // Loop through each vertex in the input array, except for the last one
        for (let i = 0; i < vertices.length - 1; i++) {
            // Get the current vertex and the next one in the array
            const p1 = vertices[i];
            const p2 = vertices[i + 1];

            // Calculate the x and z differences between the two vertices, and the length of the line segment connecting them
            const dx = p2[0] - p1[0];
            const dz = p2[2] - p1[2];
            const len = Math.sqrt(dx * dx + dz * dz);

            // Calculate the x and z components of the perpendicular vector to the line segment
            const dxperp = -dz * (width / (2 * len));
            const dzperp = dx * (width / (2 * len));

            // Calculate the four corners of a rectangle that extends width/2 units to either side of the line segment and is perpendicular to it
            const v1 = [p1[0] + dxperp, p1[1], p1[2] + dzperp];
            const v2 = [p1[0] - dxperp, p1[1], p1[2] - dzperp];
            const v3 = [p2[0] + dxperp, p2[1], p2[2] + dzperp];
            const v4 = [p2[0] - dxperp, p2[1], p2[2] - dzperp];

            // Add the four corner vertices to the realVertices array, and keep track of their index offset
            const offset = realVertices.length / 3;
            realVertices.push(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2], v4[0], v4[1], v4[2]);

            // Add the indices of the four vertices to the indices array, to define two triangles that make up a rectangle
            indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2);
        }

        // Create a new BufferGeometry object and set its position attribute to the realVertices array, and its index attribute to the indices array
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(realVertices), 3));
        geom.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
        geom.computeBoundingBox();

        // Set the geometry property of this object to the newly created BufferGeometry object
        this.geometry = geom;
    }
}
