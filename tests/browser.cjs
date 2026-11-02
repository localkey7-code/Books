/* Optional browser QA: NODE_PATH must include playwright-core and @sparticuz/chromium.
   These QA-only tools are deliberately not dependencies of the delivered app. */
const fs=require('node:fs');const {chromium}=require('playwright-core');const packaged=require('@sparticuz/chromium');
(async()=>{
 const browser=await chromium.launch({executablePath:await packaged.executablePath(),args:packaged.args,headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true,deviceScaleFactor:2});
 const errors=[],remote=[],checks=[],samples=[];let responseFailures=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)responseFailures.push(r.url());});
 const base=process.env.BASE_URL||'http://127.0.0.1:8000';
 await page.route('**/*',route=>{const u=route.request().url();if(!u.startsWith(base+'/')||u.includes('/node_modules/')){remote.push(u);return route.abort();}return route.continue();});
 function check(ok,name,detail){checks.push({name,result:ok?'PASS':'FAIL',detail});console.log(ok?'PASS':'FAIL',name,detail??'');if(!ok)throw Error(name);}
 async function state(){return page.evaluate(()=>({stats:{...__KAILASA__.engine.stats},position:__KAILASA__.engine.camera.position.toArray(),mode:__KAILASA__.nav.mode,aspect:__KAILASA__.engine.camera.aspect}));}
 async function rendered(){const frames=(await state()).stats.frames;await page.waitForFunction(f=>__KAILASA__.engine.stats.frames>=f+3,frames);}
 async function settled(){await page.waitForTimeout(180);await rendered();await page.waitForFunction(()=>Math.abs(__KAILASA__.engine.camera.aspect-innerWidth/innerHeight)<.001);}
 await page.goto(base+'/');await page.waitForFunction(()=>window.__KAILASA__?.ready&&__KAILASA__.engine.stats.frames>8);await page.selectOption('#quality','balanced');
 let s=await state();check(s.stats.drawCalls<=150&&s.stats.triangles<=500000,'overview renderer budget',s.stats);check(s.stats.dpr<=1.5,'mobile DPR cap',s.stats.dpr);
 await page.screenshot({path:'audit/screenshots/desktop.png'});
 for(const viewport of [{width:390,height:844},{width:844,height:390},{width:360,height:740}]){
  await page.setViewportSize(viewport);await settled();await page.click('#overview-button');await rendered();
  s=await state();check(Math.abs(s.aspect-viewport.width/viewport.height)<.001,`resize ${viewport.width}×${viewport.height}`,s.aspect);
  const layout=await page.evaluate(()=>{const selectors=['#overview-button','#orbit-button','#explore-button','#guide-button','#about-button','[data-site="temple"]'];return selectors.map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {selector,w:r.width,h:r.height,inScreen:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight};});});
  check(layout.every(r=>r.w>=44&&r.h>=44&&r.inScreen),`touch targets ${viewport.width}×${viewport.height}`,layout);
  const footprint=await page.evaluate(()=>{const e=__KAILASA__.engine,camera=e.camera,v=camera.position.clone();let minX=9,maxX=-9,minY=9,maxY=-9;for(const node of e.roots.Terrain.children){if(!node.name.startsWith('Basalt excavation'))continue;const a=node.geometry.attributes.position;for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i).project(camera);minX=Math.min(minX,v.x);maxX=Math.max(maxX,v.x);minY=Math.min(minY,v.y);maxY=Math.max(maxY,v.y);}}return {minX,maxX,minY,maxY};});
  check(footprint.minX>=-1&&footprint.maxX<=1&&footprint.minY>=-1&&footprint.maxY<=1,`entire excavation in overview ${viewport.width}×${viewport.height}`,footprint);
  samples.push({viewport,...s});await page.screenshot({path:`audit/screenshots/${viewport.width}x${viewport.height}.png`});
 }
 await page.setViewportSize({width:390,height:844});await settled();await page.click('#overview-button');await page.waitForTimeout(200);
 const cdp=await page.context().newCDPSession(page);
 const before=await state();
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:165,y:400,id:1}]});
 for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:165+i*10,y:400+i*2,id:1}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(300);
 let after=await state();check(before.position.some((v,i)=>Math.abs(v-after.position[i])>1),'one-finger orbit changes camera');
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:130,y:400,id:1},{x:240,y:400,id:2}]});
 for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:130-i*5,y:400,id:1},{x:240+i*5,y:400,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(200);const pinched=await state();check(after.position.some((v,i)=>Math.abs(v-pinched.position[i])>1),'two-finger pinch changes camera');
 const targetBefore=await page.evaluate(()=>__KAILASA__.nav.target.toArray());
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:135,y:400,id:1},{x:235,y:400,id:2}]});
 for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:135+i*4,y:400+i*3,id:1},{x:235+i*4,y:400+i*3,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await rendered();
 const targetAfter=await page.evaluate(()=>__KAILASA__.nav.target.toArray());check(targetBefore.some((v,i)=>Math.abs(v-targetAfter[i])>.1),'two-finger pan changes orbit target');
 await page.click('[data-site="court"]');await page.waitForTimeout(250);s=await state();samples.push({view:'close sculpture',...s});check(s.stats.triangles<=500000&&s.stats.drawCalls<=150,'near detail renderer budget',s.stats);await page.screenshot({path:'audit/screenshots/close-detail.png'});
 await page.click('#explore-button');await page.waitForTimeout(200);s=await state();check(s.mode==='explore','explore mode activated');
 const j=await page.locator('#joystick').boundingBox();await page.mouse.move(j.x+j.width/2,j.y+j.height/2);await page.mouse.down();await page.mouse.move(j.x+j.width/2,j.y+10);await page.waitForTimeout(650);await page.mouse.up();after=await state();check(s.position.some((v,i)=>Math.abs(v-after.position[i])>.1),'thumbstick moves bounded camera');
 const old=after;await page.mouse.move(260,400);await page.mouse.down();await page.mouse.move(300,420,{steps:5});await page.mouse.up();await page.waitForTimeout(200);
 const look=await page.evaluate(()=>__KAILASA__.engine.camera.rotation.y);check(Math.abs(look-.12)>.01,'right-side drag changes look');
 await page.keyboard.down('w');await page.waitForTimeout(650);await page.keyboard.up('w');s=await state();check(old.position.some((v,i)=>Math.abs(v-s.position[i])>.1),'keyboard movement');
 const initialY=s.position[1];const r=await page.locator('#rise').boundingBox();await page.mouse.move(r.x+20,r.y+20);await page.mouse.down();await page.waitForTimeout(500);await page.mouse.up();s=await state();check(s.position[1]>initialY,'altitude touch control');await page.screenshot({path:'audit/screenshots/explore.png'});
 await page.evaluate(()=>{const e=__KAILASA__.engine;e.camera.position.set(999,-100,-999);});await page.waitForTimeout(200);s=await state();check(s.position[0]<=36&&s.position[1]>=2&&s.position[2]>=-48,'free-flight bounds clamp');
 await page.click('#overview-button');check((await state()).mode==='orbit','reset from bounds to overview');
 for(const q of ['low','high','balanced']){await page.selectOption('#quality',q);await page.waitForTimeout(100);s=await state();check(s.stats.dpr<=(q==='low'?1:q==='balanced'?1.25:1.5),`quality ${q} DPR`,s.stats.dpr);}
 await page.click('#guide-button');check(await page.locator('#guide-dialog').evaluate(d=>d.open),'guide opens');await page.click('#guide-done');check(!await page.locator('#guide-dialog').evaluate(d=>d.open),'guide closes');
 await page.click('#about-button');check((await page.locator('#notes-dialog').innerText()).includes('not a survey-grade reconstruction'),'accuracy notes visible');await page.click('#notes-dialog .dialog-close');
 await page.setViewportSize({width:844,height:390});await settled();await page.click('#explore-button');await rendered();
 const landscapeBefore=await state();const lj=await page.locator('#joystick').boundingBox();const la=await page.locator('#rise').boundingBox();check(lj.x>=0&&lj.y>=0&&lj.y+lj.height<390&&la.y>=0&&la.y+la.height<390,'landscape joystick and altitude visible');
 await page.mouse.move(lj.x+lj.width/2,lj.y+lj.height/2);await page.mouse.down();await page.mouse.move(lj.x+lj.width/2,lj.y+10);await page.waitForTimeout(700);await page.mouse.up();await rendered();const landscapeAfter=await state();check(landscapeBefore.position.some((v,i)=>Math.abs(v-landscapeAfter.position[i])>.1),'landscape thumbstick movement');await page.click('#overview-button');await rendered();
 const instanceCount=(await state()).stats.instances;await page.evaluate(()=>{for(let i=0;i<20;i++){__KAILASA__.nav.setMode('explore');__KAILASA__.nav.overview();}});check((await state()).stats.instances===instanceCount,'20 mode/reset cycles create no new instances');
 await page.reload();await page.waitForFunction(()=>window.__KAILASA__?.ready&&__KAILASA__.engine.stats.frames>3);check(remote.length===0,'no remote or node_modules request on reload',remote);check(responseFailures.length===0,'all local assets HTTP success',responseFailures);
 const f1=(await state()).stats.frames,t1=Date.now();await page.waitForTimeout(2500);const f2=(await state()).stats.frames;const softwareFps=(f2-f1)*1000/(Date.now()-t1);console.log('MEASURED software-only FPS sample',softwareFps);
 check(errors.length===0,'no JavaScript or WebGL console errors',errors);
 fs.writeFileSync('audit/BROWSER_RESULTS.json',JSON.stringify({environment:'Chromium138 headless, SwiftShader CPU renderer; NOT a physical phone benchmark',checks,samples,softwareFps,phoneFps:'UNTESTED',errors,remote},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
