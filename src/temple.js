import {BatchBuilder} from './registries.js';
import {masonry,column,shrine} from './architecture.js';
export function buildTemple(engine){
  const b=new BatchBuilder(engine);
  // Alternating receding plinth courses, broad elephant-bearing adhisthana.
  const courses=[[0,23,37,.6],[.6,22.4,36.4,.35],[.95,21.5,35.5,2.25],[3.2,22.5,36.5,.4],[3.6,21.8,35.8,1.5],[5.1,23,37,.4],[5.5,22.4,36.4,.55]];
  for(const [y,w,d,h]of courses)masonry(b,0,y,-10,w,h,d,y===3.6?'darkStone':'stone');
  // Deeply framed niches on the base, front and long flanks.
  for(const side of [-1,1])for(let z=-25;z<8;z+=3.5){
    masonry(b,side*10.95,3.9,z,.1,1.05,2.25,'recess');
    for(const t of [-1,1])column(b,side*11.08,3.8,z+t*1.24,1.45,.42);
  }
  for(let x=-8;x<=8;x+=4){masonry(b,x,3.9,8.23,2.7,1.05,.1,'recess');column(b,x-1.4,3.8,8.38,1.45,.45);column(b,x+1.4,3.8,8.38,1.45,.45);}
  // Upper mandapa: sixteen columns, dark ceiling and stone perimeter beams.
  masonry(b,0,6,-3,19,.4,18,'lightStone');
  for(const x of [-7,-2.4,2.4,7])for(const z of [-9,-4.5,0,4.5])column(b,x,6.4,z,5.1,1.22);
  masonry(b,0,11.5,-3,19.4,.4,18.4,'darkStone');
  for(let i=0;i<4;i++)masonry(b,0,11.9+i*.33,-3,20.7-i*.42,.32,19.7-i*.42,i%2?'stone':'lightStone');
  // Rhythm of projecting eave dentils, carved rather than smooth boxes.
  for(let x=-9.3;x<10;x+=.9)for(const z of [-12.7,6.7])masonry(b,x,11.65,z,.45,.45,.6);
  for(let z=-12;z<7;z+=.9)for(const x of [-10.15,10.15])masonry(b,x,11.65,z,.6,.45,.45);
  // Roof pavilion and miniature corner shrines.
  masonry(b,0,13.22,-3,13,.5,12,'darkStone');
  for(let i=0;i<3;i++)masonry(b,0,13.72+i*.45,-3,12-i*1.4,.45,11-i*1.4);
  b.add('dome','stone',[0,15.1,-3],[5.5,2.7,5.5]);
  for(const x of [-7.8,7.8])for(const z of [-10.2,4.1])shrine(b,x,13.2,z,2.3,2.7);
  // Sanctuary walls: repeated recesses and engaged columns.
  // Hollow sanctuary permits interpretive interior inspection in free-flight.
  masonry(b,0,6,-21,14,.3,14,'darkStone');
  for(const x of [-6.5,6.5])masonry(b,x,6,-21,1,7,14);
  masonry(b,0,6,-27.5,14,7,1);
  for(const x of [-4.35,4.35])masonry(b,x,6,-14.5,5.3,7,1);
  masonry(b,0,11.4,-14.5,3.4,1.6,1);
  b.add('cylinder','darkStone',[0,6.6,-21],[3.4,.6,2.8]);
  b.add('cylinder','recess',[0,7.4,-21],[1.35,1.2,1.35]);
  b.add('dome','recess',[0,8,-21],[1.35,1.35,1.35]);
  for(const side of [-1,1])for(let z=-26;z<=-16;z+=3.3){masonry(b,side*7.02,7,z,.12,3.3,2.2,'recess');column(b,side*7.16,6.3,z-1.3,5.5,.7);}
  masonry(b,0,6.2,-13.92,3.1,5.6,.15,'recess');
  for(const x of [-2.1,2.1])column(b,x,6.3,-13.5,5.5,.9);
  // Square, rhythmically receding Dravidian tiers; crown is octagonal/domed.
  for(let tier=0;tier<5;tier++){
    const y=13+tier*2.65,w=15-tier*2.05;
    masonry(b,0,y,-21,w,.32,w,'lightStone');
    masonry(b,0,y+.32,-21,w-.5,.35,w-.5,'darkStone');
    masonry(b,0,y+.67,-21,w-1.3,1.35,w-1.3);
    masonry(b,0,y+2.02,-21,w+.15,.38,w+.15,'lightStone');
    const n=tier<2?5:3;
    for(let j=0;j<n;j++){
      const t=(j-(n-1)/2)*(w-1.5)/n;
      for(const s of [-1,1]){
        masonry(b,t,y+.8,-21+s*(w-1.22)/2,.7,.9,.12,'recess');
        masonry(b,s*(w-1.22)/2,y+.8,-21+t,.12,.9,.7,'recess');
        b.add('dome','stone',[t,y+1.8,-21+s*(w-.9)/2],[1.25,1.05,.7]);
        b.add('dome','stone',[s*(w-.9)/2,y+1.8,-21+t],[.7,1.05,1.25]);
      }
    }
    for(const x of [-1,1])for(const z of [-1,1])shrine(b,x*(w/2-.75),y+.6,-21+z*(w/2-.75),1.7,1.8);
  }
  b.add('cylinder','darkStone',[0,27,-21],[5.1,.6,5.1]);
  b.add('dome','lightStone',[0,27.3,-21],[5.8,4.8,5.8]);
  b.add('cylinder','stone',[0,29.85,-21],[1.2,1,1.2]);
  b.add('sphere','accent',[0,30.7,-21],[1.35,1.4,1.35]);
  // Small rear subsidiary shrines on the raised circumambulatory terrace.
  for(const x of [-8.7,8.7])shrine(b,x,6,-24,4.2,6.8);
  shrine(b,0,6,-30,4.2,6.8);
  // Broad front approach flight to the hall, visible split stair on side.
  for(let i=0;i<18;i++)masonry(b,-7.4,i*.34,13.5-i*.48,3.4,.35,.52,'lightStone');
  masonry(b,-9.3,0,9.5,.5,2,9,'darkStone');
  b.finish(engine.roots.Temple);
}
