const initialiseWebGl = () => {
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(1.0);
    gl.depthFunc(gl.LEQUAL);

    // Create a shader program
    program = gl.createProgram();

    const vertexShaderSource =
        `#version 300 es
        precision mediump float;
        uniform mat4 uMeshMatrix, uCameraMatrix, uProjectionMatrix;
        in vec3 aVertexPosition, aVertexColor,aNormal ;
        out vec4 vPosition;
        out vec3 vColor,vNormal;
        void main(void) {
            gl_Position = uProjectionMatrix * uCameraMatrix * uMeshMatrix * vec4(aVertexPosition, 1.0);
            vColor = aVertexColor;
            vPosition = gl_Position;
            vNormal = aNormal;
        }`

    // Create a vertex shader and compile it
    compileShader(vertexShaderSource, gl.VERTEX_SHADER, program);

    const fragmentShaderSource =
        `#version 300 es
        precision mediump float;
        in vec4 vPosition;
        in vec3 vNormal, vColor;
        out vec4 fragColor;
        void main(void) {
            float fog = max(min(1.0 - vPosition.z / 50.0, 1.0), 0.05);
            float light = max(dot(normalize(vNormal), normalize(vec3(6.0, 6.0, 6.0))), .3);
            fragColor = vec4(vColor * light * fog, 1.0);
        }
        `

    // Create a fragment shader and compile it
    compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER, program);

    // Link program
    gl.linkProgram(program);

    // Start using the program
    gl.useProgram(program);

    // Get uniform locations/pointers
    meshMatrixLocation = gl.getUniformLocation(program, 'uMeshMatrix');
    cameraMatrixLocation = gl.getUniformLocation(program, 'uCameraMatrix');
    projectionMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');

    const uLightPosition = new Float32Array(60).fill(0).map((v, i) => i % 3 == 1 ? 0 : 40 - Math.random() * 80);
    const uConstantColorLocation = gl.getUniformLocation(program, 'uLightPosition');
    gl.uniform3fv(uConstantColorLocation, uLightPosition);

    //Bind projection matrix (must do when fov changes or when resizing)
    gl.uniformMatrix4fv(projectionMatrixLocation, false, perspective(camera.fov, camera.aspect, camera.near, camera.far));

    // Get attribute location
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(program.aVertexPosition);
    program.aVertexColor = gl.getAttribLocation(program, 'aVertexColor');
    gl.enableVertexAttribArray(program.aVertexColor);
    program.aNormal = gl.getAttribLocation(program, 'aNormal');
    gl.enableVertexAttribArray(program.aNormal);
}

compileShader = (shaderSource, shaderType, program) => {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    else
        gl.attachShader(program, shader);
}