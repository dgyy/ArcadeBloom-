const Geometry = (vertices, indices, colors) => {
    // Necessary for webgl calls, update if IBO is modified
    var indicesLength = indices.length;

    let finalVertices = [], finalColors = [];

    for (let index of indices) finalVertices.push(vertices[index * 3], vertices[index * 3 + 1], vertices[index * 3 + 2]);

    for (let i = 0; i < colors.length; i += 3)  finalColors.push(colors[i], colors[i + 1], colors[i + 2], colors[i], colors[i + 1], colors[i + 2], colors[i], colors[i + 1], colors[i + 2]);

    //Set up VBO
    const vertexBuffer = CreateAndBindBufferData(finalVertices);
    //Color buffer
    const colorBuffer = CreateAndBindBufferData(finalColors);
    //Normal buffer
    const normalBuffer = CreateAndBindBufferData(getNormals(finalVertices));
    //Cleanup
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return { vertices, indices, colors, indicesLength, vertexBuffer, colorBuffer, normalBuffer };
}

getNormals = (vertices) => {
    let normals = [];
    for (let index = 0; index < vertices.length; index += 9) {
        let faceNormal = cross(normalize(vector3(vertices[index + 3] - vertices[index], vertices[index + 3 + 1] - vertices[index + 1], vertices[index + 3 + 2] - vertices[index + 2])), normalize(vector3(vertices[index + 6] - vertices[index], vertices[index + 6 + 1] - vertices[index + 1], vertices[index + 6 + 2] - vertices[index + 2])));
        normals.push(faceNormal.x, faceNormal.y, faceNormal.z, faceNormal.x, faceNormal.y, faceNormal.z, faceNormal.x, faceNormal.y, faceNormal.z);
    }
    return normals;
}

CreateAndBindBufferData = (bufferArray) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferArray), gl.STATIC_DRAW);
    return buffer;
}