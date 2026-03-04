---
title: Fog
---
A common issue faced by many mods is that their fog shaders are overwritten by Iris. As such, Supplemental Patches provides an interface which makes it easy to define new fogs to ensure compatibility.

There are 2 steps to defining a new fog -- defining the fog function and patching that function into `/shaders/lib/atmospherics/fog/mainFog.glsl`.

## Fog Function

Fog functions are GLSL files which are defined in under `atmospherics/fog/functions`. An example is the following.

```glsl
void DoDoomAndGloomFog(inout vec4 color, float lViewPos, float fogOverride) {  
    #if DOOM_AND_GLOOM_FOG == 1  
        float fog = lViewPos * FOG_INTENSITY;  
    #elif defined MOD_DOOM_AND_GLOOM && (DOOM_AND_GLOOM_FOG == 0)  
        float fog = lViewPos * FOG_INTENSITY * doomAndGloomFog;  
    #else  
        float fog = 0.0;  
    #endif  
  
    fog *= fog;  
    fog = 1.0 - exp(-fog);  
  
    color.rgb = mix(color.rgb, vec3(0.5), fog * (1 - fogOverride));  
}
```

The function defined should take in the colour and the distance to the point that is being rendered (i.e. `lViewPos`). It can also take in other parameters if you want, as shown here. This function will be called when it is patched into `mainFog.glsl`.

Breaking down this function, we see that the fog factor is defined as the distance mulitplied by some fog intensity. Then, the final factor is computed as `1.0 - exp(fog^2)`. This is fairly standard for fogs which should fade to the uniform fog colour exponentially with distance. The colour fade is defined in the final line, where the existing colour is mixed with some factor colour.

## Fog Injection

To get a good idea of how this works, it is recommended to take a look at the code in `/shaders/lib/atmospherics/fog/mainFog.glsl` and in particular, the `DoFog` function where all this code will be injected.

To inject the code, all that needs to be defined is a code snippet and calls the fog function defined above. This GLSL code file should be placed under `atmospherics/fog/fogs`. An example is shown below.

```glsl
#if DOOM_AND_GLOOM_FOG == 1  
    DoDoomAndGloomFog(color, lViewPos, fogOverride);  
#elif defined MOD_DOOM_AND_GLOOM && (DOOM_AND_GLOOM_FOG == 0)  
    if (doomAndGloomFog > 0.0001) DoDoomAndGloomFog(color, lViewPos, fogOverride); 
#endif
```

The structure is fairly simple. There is usually a check to determine if the fog should or should not be enabled, followed by calling the function with `color` and `lViewPos`, along with any parameters that need to be inputted. As previously mentioned, look at the code in the `/shaders/lib/atmospherics/fog/mainFog.glsl` to get a better picture of how this works.