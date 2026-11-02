import * as T from '../vendor/three.module.js';
import {BatchBuilder} from './registries.js';
function noise(n){const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);}
function cliff(engine,side){
  const positions=[],colors=[],steps=side==='back'?28:40;
  // A continuous irregular basalt mass, not a placeholder wall box. Cross-section
  // follows the excavated face up to an eroded crest and down the outer slope.
  function vertex(i,j){const u=i/steps,n=noise(i*1.7),rear=1-u;let across,height;
    if(side==='back'){across=-41+u*82;height=32+noise(i*1.3)*2.5;}else{across=-44+u*85;height=17+rear*15+Math.sin(i*.9)*.8;}
    const cross=[[24+noise(i)*.7,0],[24.5+n,5],[25.2+n,12],[27+n*1.6,height-2.5],[31+noise(i+3)*1.2,height],[36+noise(i+6)*2,height-1.5],[42+noise(i)*1.5,0]][j];
    if(side==='back')return [across,cross[1],-cross[0]-17];
    return [(side==='left'?-1:1)*cross[0],cross[1],across];
  }
  function tri(a,b,c,i,j){positions.push(...a,...b,...c);const shade=.78+noise(i*11+j)*.28;for(let k=0;k<3;k++)colors.push(shade,shade*.99,shade*.96);}
  for(let i=0;i<steps;i++)for(let j=0;j<6;j++){const a=vertex(i,j),b=vertex(i+1,j),c=vertex(i,j+1),d=vertex(i+1,j+1);tri(a,b,c,i,j);tri(b,d,c,i,j);}
  for(const i of [0,steps])for(let j=1;j<6;j++)tri(vertex(i,0),vertex(i,j),vertex(i,j+1),i,j);
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();
  engine.materials.get('cliff').side=T.DoubleSide;
  const mesh=new T.Mesh(geo,engine.materials.get('cliff'));mesh.name=`Basalt excavation:${side}`;engine.roots.Terrain.add(mesh);
}
export function buildTerrain(engine){
  const b=new BatchBuilder(engine);b.add('box','earth',[0,-1,0],[96,2,116]);b.add('box','lightStone',[0,-.16,0],[46,.3,82]);
  // Fine cut-rock ledges / bedding planes. Undulate across the face rather than
  // erasing the natural geometry with flat bands.
  for(const s of [-1,1])for(let z=-40;z<38;z+=4)for(let j=0;j<5;j++){
    const h=3+j*3.6;const x=24.4+h*.095+noise(z+j)*.5;
    b.add('box',j%3===0?'darkStone':'stone',[s*x,h,z],[.18,.09,4.05],s*.015);
  }
  for(let x=-20;x<=20;x+=4)b.add('box','darkStone',[x,.006,0],[.024,.01,81]);
  for(let z=-40;z<41;z+=4)b.add('box','darkStone',[0,.008,z],[45,.01,.024]);
  b.finish(engine.roots.Terrain);cliff(engine,'left');cliff(engine,'right');cliff(engine,'back');
}
