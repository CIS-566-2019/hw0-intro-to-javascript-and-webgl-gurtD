#version 300 es

// This is a fragment shader. If you've opened this file first, please
// open and read lambert.vert.glsl before reading on.
// Unlike the vertex shader, the fragment shader actually does compute
// the shading of geometry. For every pixel in your program's output
// screen, the fragment shader is run for every bit of geometry that
// particular pixel overlaps. By implicitly interpolating the position
// data passed into the fragment shader by the vertex shader, the fragment shader
// can compute what color to apply to its pixel based on things like vertex
// position, light position, and vertex color.
precision highp float;

uniform vec4 u_Color; // The color with which to render this instance of geometry.

// These are the interpolated values out of the rasterizer, so you can't know
// their specific values without knowing the vertices that contributed to them
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec4 fs_Col;

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.

void main()
{
    // Material base color (before shading)
        vec4 diffuseColor = u_Color;

        float t = dot(normalize(fs_Nor), normalize(fs_LightVec));
        
        vec3 a = vec3(0.5f, 0.5f, 0.5f);
        vec3 b = vec3(0.5f, 0.5f, 0.5f);
        vec3 c = vec3(1.0f, 1.0f, 1.0f);
        vec3 d = vec3(0.0f, 0.33f, 0.67f);
        vec3 gradient = a + b + cos(2.0f * 3.14f * (t * c + d));

        out_Col = vec4(gradient, diffuseColor.a);

        }
