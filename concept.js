import * as T from './vendor/three.module.js';
export function mount(kind,scrollDriven=true){
const host=document.querySelector('#model');let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch(e){host.innerHTML='<img src="rocket-fallback.svg" alt="Rocket graphic" style="width:100%;height:100%;object-fit:contain">';document.querySelector('.exploration').style.height='100svh';return;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;host.append(renderer.domElement);const scene=new T.Scene(),camera=new T.PerspectiveCamera(30,1,.1,100);camera.position.set(0,0,23);scene.add(new T.HemisphereLight(0xe4e8ee,0x131820,.8));for(const [x,y,z,p] of [[-7,8,8,45],[7,1,3,18],[-3,-5,-3,40]]){const l=new T.PointLight(0xffffff,p,0,1);l.position.set(x,y,z);scene.add(l);}
const pearl=new T.MeshStandardMaterial({color:0xc4c9ce,metalness:.42,roughness:.44}),dark=new T.MeshStandardMaterial({color:0x242a31,metalness:.4,roughness:.48}),edge=new T.MeshStandardMaterial({color:0x797f88,metalness:.85,roughness:.22});const rocket=new T.Group();scene.add(rocket);const modules=[];
function cylinder(g,r1,r2,h,y,mat=pearl){const m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,80),mat);m.position.y=y;g.add(m);return m;}function module(y){const g=new T.Group();g.position.y=y;g.userData.base=y;rocket.add(g);modules.push(g);return g;}
const radius=kind==='suborbital'?.43:.49,nose=module(3.0),points=[];for(let i=0;i<=40;i++){const t=i/40;points.push(new T.Vector2(Math.sqrt(Math.pow((1.7*1.7+radius*radius)/(2*radius),2)-Math.pow(t*1.7,2))+radius-(1.7*1.7+radius*radius)/(2*radius),t*1.7));}nose.add(new T.Mesh(new T.LatheGeometry(points,96),pearl));cylinder(nose,radius-.004,radius-.004,.025,.012,edge);
const upper=module(1.55);cylinder(upper,radius,radius,2.9,0);cylinder(upper,radius+.001,radius+.001,.018,1.42,edge);cylinder(upper,radius+.001,radius+.001,.018,-1.42,edge);const join=module(-.31);cylinder(join,radius,.49,.82,0,dark);cylinder(join,radius+.015,radius+.015,.07,.38,edge);cylinder(join,.505,.505,.07,-.38,edge);const booster=module(-2.47);cylinder(booster,.49,.49,3.5,0);cylinder(booster,.49,.42,.45,-1.95,dark);cylinder(booster,.24,.33,.28,-2.28,edge);cylinder(booster,.491,.491,.025,1.70,edge);
const shape=new T.Shape();shape.moveTo(.47,-.55);shape.lineTo(1.04,-1.72);shape.lineTo(1.04,-2.12);shape.lineTo(.47,-1.74);shape.closePath();const fg=new T.ExtrudeGeometry(shape,{depth:.065,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:2,steps:1});fg.translate(0,0,-.0325);for(let i=0;i<4;i++){const fin=new T.Mesh(fg,dark);fin.rotation.y=i*Math.PI/2;booster.add(fin);}
// Purpose-built illustration; no printable CAD is loaded or modified.
// Transparent ink decal avoids a mismatched rectangular patch on the body.
const label=document.createElement('canvas');label.width=512;label.height=2048;
const ctx=label.getContext('2d');ctx.fillStyle='#303740';ctx.textAlign='center';ctx.font='58px Arial';
[...'astraL'].forEach((c,i)=>ctx.fillText(c,256,460+i*120));
ctx.font='23px Arial';ctx.fillText(kind==='suborbital'?'03':kind==='high-altitude'?'02':'01',256,1500);
const texture=new T.CanvasTexture(label);texture.colorSpace=T.SRGBColorSpace;
const badge=new T.Mesh(new T.CylinderGeometry(.492,.492,2.65,48,1,true,-.30,.60),new T.MeshStandardMaterial({map:texture,transparent:true,depthWrite:false,roughness:.55,polygonOffset:true,polygonOffsetFactor:-1}));
badge.position.y=.08;booster.add(badge);
if(kind!=='suborbital'){join.children.forEach(m=>m.material=pearl);}
// Fine panel lines and restrained fasteners give scale without adding fictional mechanisms.
for(const g of [upper,booster]){
 const r=g===upper?radius:.49,y=g===upper?1.28:1.54;
 for(let i=0;i<12;i++){const a=i*Math.PI/6;const bolt=new T.Mesh(new T.SphereGeometry(.011,8,6),edge);bolt.position.set(Math.sin(a)*(r+.003),y,Math.cos(a)*(r+.003));g.add(bolt);}
}


// Presentation-only shapes in arbitrary units, without engineering geometry.
let started=performance.now(),modelReady=true;const assembly=[];

if(kind==='demonstrator'){
 rocket.clear();
 const sections=[[-2.4,2.0],[-.8,1.2],[.65,1.7],[2.0,1.0]];
 for(const [y,h] of sections){const g=new T.Group();g.position.y=y;g.userData.base=y;rocket.add(g);assembly.push(g);cylinder(g,.57,.57,h,0);cylinder(g,.60,.60,.08,-h/2+.04,edge);}
 const tip=new T.Group();tip.position.y=2.5;tip.userData.base=2.5;rocket.add(tip);assembly.push(tip);tip.add(new T.Mesh(new T.ConeGeometry(.57,1.45,80).translate(0,.725,0),pearl));
 cylinder(assembly[0],.57,.35,.55,-1.275);cylinder(assembly[0],.36,.36,.18,-1.64,edge);
 const outline=new T.Shape();outline.moveTo(.55,.7);outline.lineTo(1.5,-.45);outline.lineTo(1.5,-1.1);outline.lineTo(.55,-.9);outline.closePath();
 const geom=new T.ExtrudeGeometry(outline,{depth:.07,bevelEnabled:false});geom.translate(0,0,-.035);
 for(let i=0;i<4;i++){const fin=new T.Mesh(geom,pearl);fin.rotation.y=i*Math.PI/2;assembly[0].add(fin);}
}


const upperModules=[];
if(kind==='suborbital'){
 upper.clear();
 for(const [height,y] of [[1.65,-.625],[.5,.45],[.75,1.075]]){
  const section=new T.Group();section.position.y=y;section.userData.base=y;
  cylinder(section,radius,radius,height,0);
  cylinder(section,radius+.002,radius+.002,.018,height/2-.012,edge);
  cylinder(section,radius+.002,radius+.002,.018,-height/2+.012,edge);
  upper.add(section);upperModules.push(section);
 }
 // Upper-stage fins stay with the aft upper-stage module during separation.
 const upperFinOutline=new T.Shape();
 upperFinOutline.moveTo(.425,.22);
 upperFinOutline.lineTo(.86,-.49);
 upperFinOutline.lineTo(.86,-.75);
 upperFinOutline.lineTo(.425,-.69);
 upperFinOutline.closePath();
 const upperFinGeometry=new T.ExtrudeGeometry(upperFinOutline,{depth:.045,bevelEnabled:true,bevelThickness:.008,bevelSize:.01,bevelSegments:2,steps:1});
 upperFinGeometry.translate(0,0,-.0225);
 for(let i=0;i<4;i++){
  const fin=new T.Mesh(upperFinGeometry,edge);
  fin.rotation.y=i*Math.PI/2;
  upperModules[0].add(fin);
 }
}

if(kind==='suborbital'){
 // A distinct two-stage silhouette, separate from the single-stage vehicle.
 nose.clear();
 const fairingProfile=[];
 for(let i=0;i<=16;i++){
  const t=i/16;fairingProfile.push(new T.Vector2(.43+.10*(t*t*(3-2*t)),.24*t));
 }
 for(let i=1;i<=64;i++){
  const t=i/64,y=t*1.55,r=.53,R=(1.55*1.55+r*r)/(2*r);
  fairingProfile.push(new T.Vector2(Math.max(0,Math.sqrt(R*R-y*y)+r-R),.24+y));
 }
 nose.add(new T.Mesh(new T.LatheGeometry(fairingProfile,128),pearl));
 cylinder(nose,.432,.432,.024,.015,edge);
 join.clear();
 cylinder(join,.43,.62,.82,0,pearl);
 cylinder(join,.433,.433,.035,.395,dark);
 cylinder(join,.622,.622,.035,-.395,dark);
 booster.clear();
 cylinder(booster,.62,.62,3.50,0,pearl);
 cylinder(booster,.62,.46,.40,-1.95,pearl);
 cylinder(booster,.46,.46,.09,-2.18,dark);
 // Recessed engine bell, visually subordinate to the airframe.
 const bell=[new T.Vector2(.16,0),new T.Vector2(.17,-.09),new T.Vector2(.23,-.20),new T.Vector2(.31,-.30)];
 const engine=new T.Mesh(new T.LatheGeometry(bell,64),new T.MeshStandardMaterial({color:0x424953,metalness:.8,roughness:.3,side:T.DoubleSide}));
 engine.position.y=-2.12;booster.add(engine);
 for(const y of [1.71,-1.68])cylinder(booster,.622,.622,.022,y,edge);
 cylinder(booster,.623,.623,.16,1.40,dark);
 const finShape=new T.Shape();
 finShape.moveTo(.60,-.50);finShape.lineTo(1.20,-1.50);
 finShape.quadraticCurveTo(1.23,-1.55,1.23,-1.62);
 finShape.lineTo(1.23,-2.03);finShape.lineTo(.59,-1.81);finShape.closePath();
 const finGeometry=new T.ExtrudeGeometry(finShape,{depth:.055,bevelEnabled:true,bevelThickness:.012,bevelSize:.015,bevelSegments:3,steps:1});
 finGeometry.translate(0,0,-.0275);
 for(let i=0;i<4;i++){const fin=new T.Mesh(finGeometry,edge);fin.rotation.y=i*Math.PI/2;booster.add(fin);}
 const lettering=new T.Mesh(new T.CylinderGeometry(.622,.622,2.65,48,1,true,-.30,.60),badge.material);
 lettering.position.y=.03;booster.add(lettering);
}

const stars=new Float32Array(270);for(let i=0;i<90;i++){stars[i*3]=Math.sin(i*127.1)*22;stars[i*3+1]=Math.cos(i*311.7)*14;stars[i*3+2]=-8-Math.abs(Math.sin(i))*15;}const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(stars,3));scene.add(new T.Points(sg,new T.PointsMaterial({color:0x858a97,size:.015,transparent:true,opacity:.6})));
const area=document.querySelector('.exploration'),hero=document.querySelector('#hero-copy'),title=document.querySelector('.breakdown-title'),labels=[...document.querySelectorAll('.callouts article')],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let current=0,mobile=false;function resize(){const w=host.clientWidth,h=host.clientHeight;mobile=w<760;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}resize();addEventListener('resize',resize);
function frame(){requestAnimationFrame(frame);if(!scrollDriven){
 const seconds=modelReady?(performance.now()-started)/1000:0;
 const t=reduced?1:T.MathUtils.clamp(seconds/4,0,1);
 const smooth=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
 const finish=smooth((t-.45)/.55);
 rocket.position.set(mobile?.25:3.1,mobile?2.35:0,0);
 rocket.scale.setScalar(mobile?.48:.87);
 rocket.rotation.set(.06,-.4,-.12);
 camera.position.set(0,0,23);camera.lookAt(0,0,0);
 if(kind==='demonstrator'){
  assembly.forEach((g,i)=>{const lock=smooth((t-.08-i*.07)/.48);g.position.y=g.userData.base+(i-2)*.85*(1-lock);g.rotation.y=(i%2?1:-1)*.18*(1-lock);});
  rocket.rotation.y=-.95+.55*smooth(t);
  rocket.scale.multiplyScalar(.76+.24*finish);
 }else{
  const open=1-smooth((t-.10)/.78);
  modules.forEach((section,i)=>{
   section.position.y=section.userData.base+(1.5-i)*.85*open;
   section.rotation.y=(i%2?1:-1)*.12*open;
  });
  if(kind==='suborbital'){
   upperModules.forEach((section,i)=>section.position.y=section.userData.base+i*.30*open);
   nose.position.y+=.9*open;
  }
  rocket.rotation.y=-.95+.55*smooth(t);
  rocket.scale.multiplyScalar(.76+.24*finish);
 }
 renderer.domElement.style.opacity=modelReady?(reduced?1:smooth(seconds/.4)):0;
 if(!reduced&&seconds>4)rocket.rotation.y+=(seconds-4)*.12;
 renderer.render(scene,camera);return;
}const target=T.MathUtils.clamp(-area.getBoundingClientRect().top/(area.offsetHeight-innerHeight),0,1);current=reduced?target:current+(target-current)*.075;const p=T.MathUtils.smoothstep(current,.10,.86);rocket.rotation.set(.06,-.4,-.23*(1-p));rocket.position.set(mobile?.5-1.5*p:3.1*(1-p)-.3*p,mobile?2.4*(1-p):0,0);rocket.scale.setScalar(mobile?.49-.02*p:.91-.12*p);modules.forEach((m,i)=>m.position.y=m.userData.base+(1.5-i)*1.35*p);hero.style.opacity=1-T.MathUtils.smoothstep(current,0,.23);hero.style.pointerEvents=current>.2?'none':'';title.style.opacity=T.MathUtils.smoothstep(current,.20,.42);rocket.updateMatrixWorld(true);modules.forEach((m,i)=>{const v=m.localToWorld(new T.Vector3(0,i===0?.65:0,0)).project(camera);labels[i].style.top=`${(1-v.y)*host.clientHeight/2-22}px`;labels[i].style.opacity=T.MathUtils.smoothstep(current,.35,.62);});document.querySelector('#progress').style.transform=`scaleX(${current})`;renderer.render(scene,camera);}frame();}
