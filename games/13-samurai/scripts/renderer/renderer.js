const render = (meshes, camera) => {
    // Clear the color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Set the viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Set camera matrix (once per render). DO NOT BY ANY MEANS MOVE THE CAMERA DURING RENDERING.
    gl.uniformMatrix4fv(cameraMatrixLocation, false, lookAt(camera.position, camera.target, camera.up));

    for (const mesh of meshes) {
        if (mesh.off) continue;
        // Bind vertex buffer for the current mesh
        bindBufferAttribute(mesh.geometry.vertexBuffer, program.aVertexPosition);
        // Bind color buffer for the current mesh
        bindBufferAttribute(mesh.geometry.colorBuffer, program.aVertexColor);
        //Normal buffer
        bindBufferAttribute(mesh.geometry.normalBuffer, program.aNormal)
        // Update the model-view matrix for the current mesh
        gl.uniformMatrix4fv(meshMatrixLocation, false, transform(mesh.position, mesh.rotation, mesh.scale));
        // Draw the current mesh using gl.drawArrays
        gl.drawArrays(gl.TRIANGLES, 0, mesh.geometry.indicesLength);
        // Clean up
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

bindBufferAttribute = (buffer, attribute) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
}