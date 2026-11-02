import * as T from '../vendor/three.module.js';
export class MaterialRegistry {
  constructor(){this.items=new Map();this.cap=12;}
  get(key,factory){if(!this.items.has(key)){if(!factory)throw Error(`Unknown material ${key}`);if(this.items.size>=this.cap)throw Error('Material cap exceeded');this.items.set(key,factory());}return this.items.get(key);}
}
export class GeometryRegistry {
  constructor(){this.items=new Map();}
  get(key,factory){if(!this.items.has(key)){if(!factory)throw Error(`Unknown geometry ${key}`);this.items.set(key,factory());}return this.items.get(key);}
}
export class LODManager {
  constructor(){this.entries=[];this.point=new T.Vector3();}
  register(node,distance){this.entries.push({node,distance});}
  update(camera){for(let i=0;i<this.entries.length;i++){const e=this.entries[i];e.node.getWorldPosition(this.point);e.node.visible=camera.position.distanceTo(this.point)<e.distance;}}
}
export class SceneBounds {
  constructor(){this.min=new T.Vector3(-36,2,-48);this.max=new T.Vector3(36,65,57);}
  clamp(p){p.clamp(this.min,this.max);return p;}
}
export function registerGeometry(g){
  g.get('box',()=>new T.BoxGeometry(1,1,1));
  g.get('cylinder',()=>new T.CylinderGeometry(.5,.5,1,10));
  g.get('cone',()=>new T.CylinderGeometry(.12,.5,1,8));
  g.get('sphere',()=>new T.SphereGeometry(.5,10,7));
  g.get('torus',()=>new T.TorusGeometry(.5,.09,5,12));
  g.get('column',()=>new T.LatheGeometry([new T.Vector2(.50,0),new T.Vector2(.5,.06),new T.Vector2(.34,.09),new T.Vector2(.28,.16),new T.Vector2(.24,.22),new T.Vector2(.22,.72),new T.Vector2(.32,.76),new T.Vector2(.4,.81),new T.Vector2(.32,.88),new T.Vector2(.52,.94),new T.Vector2(.52,1)],8));
  g.get('dome',()=>new T.SphereGeometry(.5,16,8,0,Math.PI*2,0,Math.PI/2));
}
export class BatchBuilder {
  constructor(engine){this.engine=engine;this.groups=new Map();}
  add(geometryKey,materialKey,position,scale,rotation=0){const key=`${geometryKey}|${materialKey}`;if(!this.groups.has(key))this.groups.set(key,[]);this.groups.get(key).push({position,scale,rotation});return this;}
  finish(root){const dummy=new T.Object3D(),color=new T.Color();for(const [key,items] of this.groups){const [g,m]=key.split('|');const mesh=new T.InstancedMesh(this.engine.geometries.get(g),this.engine.materials.get(m),items.length);mesh.name=`${root.name}:${g}:${m}`;items.forEach((v,i)=>{dummy.position.set(...v.position);dummy.scale.set(...v.scale);if(Array.isArray(v.rotation))dummy.rotation.set(...v.rotation);else dummy.rotation.set(0,v.rotation,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);const variation=.89+((i*17)%23)/100;color.setRGB(variation,variation,variation);mesh.setColorAt(i,color);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();root.add(mesh);this.engine.stats.instances+=items.length;}this.groups.clear();}
}
