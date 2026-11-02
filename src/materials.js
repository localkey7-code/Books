import * as T from '../vendor/three.module.js';
export function registerMaterials(engine){
  const palette={stone:0x9d8d76,lightStone:0xb5a38a,darkStone:0x746653,recess:0x423e33,earth:0x9d927d,cliff:0x827866,accent:0xc6b18d};
  for(const [key,color] of Object.entries(palette))engine.materials.get(key,()=>{
    const mat=new T.MeshStandardMaterial({color,roughness:1,metalness:0,flatShading:key==='cliff',vertexColors:key==='cliff'});
    // Local position noise: no texture fetches, stable carved-rock grain.
    mat.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vRock;').replace('#include <begin_vertex>','#include <begin_vertex>\nvRock = (modelMatrix * vec4(position,1.)).xyz;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vRock;').replace('#include <color_fragment>','#include <color_fragment>\nfloat grain = fract(sin(dot(floor(vRock*19.),vec3(12.9898,78.233,45.17)))*43758.5453);\nfloat bands=sin(vRock.y*13. + sin(vRock.x*1.7)*.6);\ndiffuseColor.rgb *= .94 + grain*.10 + bands*.025;');};
    return mat;
  });
}
