import * as T from '../vendor/three.module.js';
import {BatchBuilder} from './registries.js';
import {masonry} from './architecture.js';
function animal(b,x,y,z,s,angle=0,lion=false){
  const c=Math.cos(angle),sn=Math.sin(angle);
  const p=(g,mat,px,py,pz,sx,sy,sz,rot=0)=>b.add(g,mat,[x+(px*c+pz*sn)*s,y+py*s,z+(pz*c-px*sn)*s],[sx*s,sy*s,sz*s],Array.isArray(rot)?rot:angle+rot);
  p('sphere','stone',0,1,0,1.25,1.3,2.05);
  for(const dx of [-.38,.38])for(const dz of [-.57,.57])p('cylinder','stone',dx,.45,dz,.38,.9,.38);
  p('sphere','stone',0,1.45,.88,1.02,1.25,1.12);
  if(lion){
    p('sphere','darkStone',0,1.6,.76,1.35,1.45,.9);p('sphere','stone',0,1.6,1.12,.8,.85,.65);
    p('sphere','lightStone',0,1.38,1.42,.6,.4,.3);
    p('cylinder','stone',0,1.1,-1.1,.15,1,.15);
  }else{
    for(const dx of [-.6,.6])p('sphere','stone',dx,1.4,.67,.38,1.15,.9);
    p('cylinder','stone',0,.92,1.35,.35,1.25,.35);
    p('sphere','stone',0,.35,1.5,.38,.48,.55);
    for(const dx of [-.31,.31])p('cone','lightStone',dx,1.05,1.49,.13,.55,.13,[Math.PI/2,angle,0]);
  }
  for(const dx of [-.25,.25])p('sphere','recess',dx,1.65,1.31,.09,.09,.09);
}
export function buildSculpture(engine){
  const b=new BatchBuilder(engine);
  // Large courtyard elephants remain visible at every distance.
  animal(b,-13.2,0,31,1.8,Math.PI*.8);animal(b,13.2,0,31,1.8,-Math.PI*.8);
  // Recumbent Nandi, oriented toward the main sanctuary (-Z).
  b.add('sphere','stone',[0,7.05,21],[2.7,1.65,3.9]);
  b.add('sphere','stone',[0,7.8,20.8],[1.9,1.8,1.6]); // hump
  b.add('sphere','stone',[0,7.9,19.3],[1.5,1.5,1.6]);
  b.add('sphere','lightStone',[0,7.6,18.5],[1.2,.65,.8]);
  for(const s of [-1,1]){
    b.add('sphere','stone',[s*.85,7.9,19.45],[.75,.35,.65]);
    b.add('cone','lightStone',[s*.5,8.8,19.5],[.28,1.05,.28],[0,0,s*-.25]);
    b.add('sphere','stone',[s*.9,6.65,21],[.7,.5,3.5]);
    b.add('sphere','recess',[s*.4,8.1,18.76],[.1,.1,.1]);
  }
  b.add('torus','accent',[0,7.45,19.85],[1.7,1.6,1.7],[Math.PI/2,0,0]);
  b.finish(engine.roots.Sculpture);
  const detail=new T.Group();detail.name='Interpretive carving details';detail.position.set(0,0,0);engine.roots.Sculpture.add(detail);
  const d=new BatchBuilder(engine);
  for(const side of [-1,1])for(let z=-25;z<=6;z+=2.05)animal(d,side*10.5,.9,z,.87,side*Math.PI/2,(Math.round(z*10)%3)===0);
  for(let x=-8.5;x<=8.5;x+=2.1)animal(d,x,.9,7.2,.85,0,Math.round(x*10)%3===0);
  // Abstract low-relief registers: deliberate silhouettes, not iconographic replicas.
  for(const side of [-1,1])for(let z=-24;z<7;z+=3.5){
    for(let i=-1;i<=1;i++){
      const x=side*11.02,zz=z+i*.58;
      d.add('sphere','stone',[x,4.72,zz],[.24,.3,.3]);
      d.add('sphere','stone',[x,4.3,zz],[.25,.65,.36]);
      d.add('cylinder','stone',[x,4.1,zz-.19],[.12,.65,.12],[.2,0,.3]);
    }
  }
  // Larger recessed abstract panel at the southern flank: multi-register massing.
  masonry(d,11.26,6.9,-20,.12,4,5,'recess');
  for(let i=0;i<9;i++){
    d.add('sphere','stone',[11.4,7.5+(i%3)*1.08,-21.7+Math.floor(i/3)*1.5],[.3,.85,.8]);
    d.add('sphere','lightStone',[11.44,8+(i%3)*1.08,-21.7+Math.floor(i/3)*1.5],[.4,.4,.4]);
  }
  d.finish(detail);engine.lod.register(detail,150);
}
