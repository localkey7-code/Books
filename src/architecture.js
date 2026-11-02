export function masonry(b,x,y,z,w,h,d,mat='stone'){
  b.add('box',mat,[x,y+h/2,z],[w,h,d]);
}
export function column(b,x,y,z,h=5,w=1){
  b.add('column','stone',[x,y,z],[w,h,w]);
  masonry(b,x,y-.1,z,w*1.2,.22,w*1.2,'darkStone');
  masonry(b,x,y+h-.08,z,w*1.3,.25,w*1.3,'lightStone');
}
export function shrine(b,x,y,z,size=4,h=6){
  masonry(b,x,y,z,size,.45,size,'darkStone');
  masonry(b,x,y+.45,z,size*.85,h*.55,size*.85);
  masonry(b,x,y+.6,z+size*.43,size*.37,h*.4,.08,'recess');
  for(const side of [-1,1])column(b,x+side*size*.33,y+.6,z+size*.44,h*.43,size*.16);
  for(let i=0;i<3;i++)masonry(b,x,y+h*.55+i*h*.1,z,size*(1.05-i*.2),h*.1,size*(1.05-i*.2),'lightStone');
  b.add('dome','stone',[x,y+h*.87,z],[size*.6,h*.5,size*.6]);
  b.add('sphere','accent',[x,y+h*1.1,z],[size*.17,h*.2,size*.17]);
}
