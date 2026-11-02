import * as T from '../vendor/three.module.js';
import {MaterialRegistry,GeometryRegistry,LODManager,SceneBounds,registerGeometry} from './registries.js';
export function createEngine(canvas){
  const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setClearColor(0xdad7ca);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  const scene=new T.Scene();scene.fog=new T.Fog(0xdad7ca,600,950);
  const camera=new T.PerspectiveCamera(42,1,.3,1200);camera.position.set(88,74,112);
  scene.add(new T.HemisphereLight(0xe3ebef,0x706249,2.3));
  const sun=new T.DirectionalLight(0xffe5bc,3.3);sun.position.set(-65,85,40);scene.add(sun);
  const roots={};for(const name of ['Terrain','Court','Temple','Entrance','Nandi','Galleries','Sculpture']){roots[name]=new T.Group();roots[name].name=name;scene.add(roots[name]);}
  const stats={frames:0,fps:0,drawCalls:0,triangles:0,dpr:1,quality:'balanced',instances:0,materials:0};
  const materials=new MaterialRegistry(),geometries=new GeometryRegistry(),lod=new LODManager(),bounds=new SceneBounds();registerGeometry(geometries);
  let update=null,last=0,elapsed=0,frames=0,sample=0,running=false;
  const mobile=matchMedia('(pointer: coarse)').matches || innerWidth<768;
  const capabilities={webgl2:renderer.capabilities.isWebGL2,maxTextureSize:renderer.capabilities.maxTextureSize,maxAttributes:renderer.capabilities.maxAttributes,maxSamples:renderer.capabilities.maxSamples,coarsePointer:mobile,deviceMemoryGiB:navigator.deviceMemory??null,logicalCores:navigator.hardwareConcurrency??null};
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  function setQuality(q){stats.quality=q;stats.dpr=Math.min(devicePixelRatio||1,q==='low'?1:q==='high'?1.5:mobile?1.25:1.5);renderer.setPixelRatio(stats.dpr);resize();}
  function loop(t){const dt=last?Math.min((t-last)/1000,.05):0;last=t;elapsed+=dt;if(update)update(dt,elapsed);lod.update(camera);renderer.render(scene,camera);stats.frames++;stats.drawCalls=renderer.info.render.calls;stats.triangles=renderer.info.render.triangles;stats.materials=materials.items.size;frames++;if(t-sample>=1000){stats.fps=frames*1000/(t-sample);sample=t;frames=0;}}
  function start(){if(running)return;running=true;renderer.setAnimationLoop(loop);}
  addEventListener('resize',resize);setQuality('balanced');
  return {scene,camera,renderer,roots,materials,geometries,lod,bounds,stats,mobile,capabilities,setQuality,resize,start,setUpdate(fn){update=fn;}};
}
