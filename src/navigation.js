import * as T from '../vendor/three.module.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
export function createNavigation(engine,canvas){
  const {camera,bounds}=engine;
  const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=8;controls.maxDistance=650;controls.maxPolarAngle=Math.PI*.49;controls.minPolarAngle=.12;controls.screenSpacePanning=true;controls.target.set(0,7,0);
  const keys=new Set(),direction=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(0,1,0),sphere=new T.Spherical();
  let mode='orbit',joystickX=0,joystickY=0,yaw=0,pitch=-.16,lookId=-1,lastX=0,lastY=0,vertical=0,resizeTimer;
  const joy=document.querySelector('#joystick'),knob=document.querySelector('#joy-knob');let joyId=-1,joyCX=0,joyCY=0;
  function fit(){engine.resize();const w=canvas.clientWidth,h=canvas.clientHeight;camera.clearViewOffset();if(w>1000)camera.setViewOffset(w,h,-w*.065,0,w,h);if(mode==='orbit'&&nav.isOverview)overview();}
  function overview(){mode='orbit';nav.mode=mode;nav.isOverview=true;controls.enabled=true;controls.reset();controls.target.set(0,8,0);const dist=Math.max(camera.aspect>2?200:165,185/camera.aspect);direction.set(.54,.75,.79).normalize().multiplyScalar(dist);camera.position.copy(controls.target).add(direction);controls.update();document.body.dataset.mode=mode;document.dispatchEvent(new Event('navigationchange'));}
  function setMode(next){if(next===mode)return;mode=next;nav.mode=mode;nav.isOverview=false;controls.enabled=mode==='orbit';joystickX=joystickY=0;vertical=0;keys.clear();if(mode==='explore'){camera.position.set(8,5.5,31);yaw=.12;pitch=.17;look();}else{controls.target.copy(camera.position);direction.set(0,0,-1).applyQuaternion(camera.quaternion).multiplyScalar(20);controls.target.add(direction);controls.update();}document.body.dataset.mode=mode;document.dispatchEvent(new Event('navigationchange'));}
  function look(){camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);}
  function focus(p){mode='orbit';nav.mode=mode;nav.isOverview=false;controls.enabled=true;controls.target.set(p[0],p[1],p[2]);camera.position.set(p[0]+22,p[1]+16,p[2]+28);controls.update();document.body.dataset.mode=mode;document.dispatchEvent(new Event('navigationchange'));}
  function down(e){if(mode!=='explore'||lookId!==-1)return;lookId=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);}
  function move(e){if(e.pointerId!==lookId||mode!=='explore')return;yaw-=(e.clientX-lastX)*.004;pitch=Math.max(-1.4,Math.min(1.4,pitch-(e.clientY-lastY)*.004));lastX=e.clientX;lastY=e.clientY;look();}
  function release(e){if(e.pointerId===lookId)lookId=-1;}
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  controls.addEventListener('start',()=>{nav.isOverview=false;});
  function joyMove(e){if(e.pointerId!==joyId)return;joystickX=Math.max(-1,Math.min(1,(e.clientX-joyCX)/35));joystickY=Math.max(-1,Math.min(1,(e.clientY-joyCY)/35));knob.style.transform=`translate(${joystickX*27}px,${joystickY*27}px)`;}
  joy.addEventListener('pointerdown',e=>{e.preventDefault();joyId=e.pointerId;const rect=joy.getBoundingClientRect();joyCX=rect.x+rect.width/2;joyCY=rect.y+rect.height/2;joy.setPointerCapture(joyId);joyMove(e);});joy.addEventListener('pointermove',joyMove);
  function joyEnd(){joyId=-1;joystickX=joystickY=0;knob.style.transform='translate(0,0)';}
  joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);
  const rise=document.querySelector('#rise'),lower=document.querySelector('#lower');
  for(const [button,value]of [[rise,1],[lower,-1]]){button.addEventListener('pointerdown',e=>{vertical=value;button.setPointerCapture(e.pointerId);});button.addEventListener('pointerup',()=>{vertical=0;});button.addEventListener('pointercancel',()=>{vertical=0;});}
  const accepted=['w','a','s','d','q','e','arrowup','arrowdown','arrowleft','arrowright'];
  function keydown(e){const k=e.key.toLowerCase();if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLButtonElement)return;if(accepted.includes(k)){e.preventDefault();keys.add(k);}if(k==='home'){e.preventDefault();overview();}if(k==='escape'){overview();}}
  function keyup(e){keys.delete(e.key.toLowerCase());}
  function blur(){keys.clear();joyEnd();vertical=0;lookId=-1;}
  addEventListener('keydown',keydown);addEventListener('keyup',keyup);addEventListener('blur',blur);
  function resize(){clearTimeout(resizeTimer);resizeTimer=setTimeout(fit,80);}
  addEventListener('resize',resize);
  function update(dt){if(mode==='orbit'){controls.update();controls.target.x=Math.max(-30,Math.min(30,controls.target.x));controls.target.y=Math.max(0,Math.min(35,controls.target.y));controls.target.z=Math.max(-40,Math.min(45,controls.target.z));return;}
    const forward=-joystickY+(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0);
    const strafe=joystickX+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);
    direction.set(-Math.sin(yaw),0,-Math.cos(yaw));right.set(Math.cos(yaw),0,-Math.sin(yaw));
    const speed=dt*12,normal=Math.max(1,Math.hypot(forward,strafe));camera.position.addScaledVector(direction,forward*speed/normal);camera.position.addScaledVector(right,strafe*speed/normal);camera.position.y+=(vertical+(keys.has('e')?1:0)-(keys.has('q')?1:0))*speed;bounds.clamp(camera.position);
  }
  const nav={update,overview,setMode,focus,target:controls.target,mode,isOverview:true,dispose(){controls.dispose();removeEventListener('resize',resize);removeEventListener('keydown',keydown);removeEventListener('keyup',keyup);removeEventListener('blur',blur);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);}};
  fit();overview();return nav;
}
