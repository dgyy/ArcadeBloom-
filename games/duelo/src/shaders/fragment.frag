#version 300 es

uniform highp float globalOpacity;
uniform highp float time;
uniform highp vec3 color;
uniform int material;
in highp vec2 vNormal;
out highp vec4 fragColor;

void main(void) {
    highp float shine = 0.0;
    highp float brightness = 1.0;

    if (material == 1 || material == 2) {
        brightness = 0.7 + 0.5 * max(0., dot(normalize(vec2(0.5, -1.)), vNormal));
    }

    if (material == 2 || material == 3) {
        highp vec2 v = gl_FragCoord.xy * 0.007;
        highp float shineFactor = 0.5 + 0.5  * cos(v.x + vNormal.x * 3. + time * 0.002) + 0.5 * cos(v.y * vNormal.y * 1. + time * 0.003);
        shine = 0.00005 * pow(2.0 * shineFactor, 8.) + 0.1 * pow(1.0 * shineFactor, 1.);
    }

    fragColor = vec4((color * brightness + vec3(shine, shine, shine)) * globalOpacity, globalOpacity);
}