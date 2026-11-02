import {BatchBuilder} from './registries.js';
import {masonry,column,shrine} from './architecture.js';
export function buildPrecinct(engine){
  // Low two-storey west gateway, central architraved passage stays visibly open.
  const g=new BatchBuilder(engine);
  for(const x of [-8.2,8.2]){
    masonry(g,x,0,39,7.4,.5,6.8,'darkStone');masonry(g,x,.5,39,6.6,6.5,6);
    for(const dx of [-2.8,2.8])column(g,x+dx,.5,42.1,5.6,.85);
    masonry(g,x,1.6,42.05,3.5,3.3,.1,'recess');
    for(let i=0;i<3;i++)masonry(g,x,6.8+i*.35,39,7.6-i*.4,.35,7-i*.4,'lightStone');
  }
  masonry(g,0,7.1,39,24,.6,7.3,'darkStone');
  for(const x of [-9,-5,0,5,9])column(g,x,7.7,41.2,3.1,.8);
  for(const x of [-9,-5,0,5,9])column(g,x,7.7,36.8,3.1,.8);
  for(let i=0;i<3;i++)masonry(g,0,10.8+i*.36,39,25-i*.5,.35,8-i*.5,'lightStone');
  for(const x of [-8,0,8])shrine(g,x,11.9,39,3.7,3.2);
  for(let i=0;i<5;i++)masonry(g,0,-.4+i*.1,45-i*.48,9,.12,.5);
  for(const x of [-19,19])masonry(g,x,0,40,10,3.6,3.2);
  g.finish(engine.roots.Entrance);
  // Nandi mandapa: solid lower stage, open pillared upper, carved roof layers.
  const n=new BatchBuilder(engine);
  for(const [y,w,h]of [[0,10.4,.6],[.6,9.7,4.8],[5.4,10.6,.5],[5.9,9.8,.4]])masonry(n,0,y,21,w,h,w,y===.6?'stone':'lightStone');
  for(const x of [-4.2,4.2])for(const z of [16.8,21,25.2])column(n,x,6.3,z,4.8,1.1);
  for(const x of [0])for(const z of [16.8,25.2])column(n,x,6.3,z,4.8,1.1);
  for(let i=0;i<4;i++)masonry(n,0,11.1+i*.38,21,11-i*.5,.37,11-i*.5,i%2?'stone':'lightStone');
  masonry(n,0,12.65,21,7,.5,7);n.add('dome','stone',[0,13.1,21],[5.5,3.4,5.5]);
  n.add('sphere','accent',[0,15.1,21],[.9,1.1,.9]);
  // Axial bridge to temple porch. Deliberately no conjectural intact lateral bridges.
  masonry(n,0,5.5,11.5,3.6,.8,10);
  for(const x of [-1.9,1.9]){masonry(n,x,6.3,11.5,.35,.65,10);for(let z=7;z<16;z+=1.7)masonry(n,x,6.3,z,.48,1,.48,'lightStone');}
  for(const x of [-4.88,4.88])for(const z of [18,21,24]){masonry(n,x,1.2,z,.12,3.2,1.8,'recess');}
  n.finish(engine.roots.Nandi);
  const b=new BatchBuilder(engine);
  // Recessed arcades cut into the two sides and rear, three levels suggested.
  for(const side of [-1,1]){
    masonry(b,side*23.8,0,-3,2,13.5,76,'recess');
    for(let level=0;level<3;level++){
      const y=level*4.25;
      masonry(b,side*22,y,-3,4,.35,76,'darkStone');
      for(let z=-39;z<=33;z+=4)column(b,side*20.8,y+.35,z,3.5,.85);
      masonry(b,side*21.8,y+3.85,-3,4.3,.4,77);
    }
    // End shrines leave forecourt open.
    for(const z of [-32,-23])shrine(b,side*16.8,0,z,4.6,6.4);
  }
  masonry(b,0,0,-40.2,44,12,2.2,'recess');
  for(let level=0;level<3;level++){
    for(let x=-20;x<=20;x+=4)column(b,x,level*4.25+.35,-38.5,3.5,.85);
    masonry(b,0,level*4.25,-39.3,45,.35,3.8,'darkStone');
    masonry(b,0,level*4.25+3.85,-39.3,45,.4,3.8);
  }
  // Dhvajastambha: articulated bases, octagonal shafts, ringed capitals.
  for(const x of [-13.5,13.5]){
    masonry(b,x,0,23,3.2,.7,3.2,'darkStone');masonry(b,x,.7,23,2.5,1.5,2.5);
    masonry(b,x,2.2,23,3,.35,3,'lightStone');
    b.add('column','stone',[x,2.55,23],[1.8,10.4,1.8]);
    b.add('cylinder','lightStone',[x,12.8,23],[2.3,.6,2.3]);
    masonry(b,x,13.1,23,2.5,.5,2.5);b.add('sphere','stone',[x,14,23],[1.2,1.2,1.2]);
  }
  b.finish(engine.roots.Galleries);
}
