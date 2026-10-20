/* Robot Forge V3: shared assemblies and deterministic simulation. MIT licensed. */
(function(root){
'use strict';
const catalog={
 frame:{label:'Structural frame',mass:12,hp:180,size:[2.3,.3,2.8],color:0x425363},
 armor:{label:'Armor plate',mass:8,hp:220,size:[2.4,.45,.2],color:0x8a9ba9},
 wedge:{label:'Front wedge',mass:7,hp:170,size:[2.5,.35,.8],color:0xa5b9bf},
 battery:{label:'Battery',mass:8,hp:80,size:[.8,.4,1],color:0x78e7be,power:80},
 motor:{label:'Drive motor',mass:3,hp:65,size:[.35,.35,.6],color:0xeda84a,power:1},
 wheel:{label:'Traction wheel',mass:2,hp:95,size:[.35,.65,.65],color:0x202d36,power:1},
 track:{label:'Track assembly',mass:12,hp:180,size:[.5,.65,2.8],color:0x293840,power:1},
 sprocket:{label:'Drive sprocket',mass:2,hp:70,size:[.3,.5,.5],color:0xe4b36a},
 idler:{label:'Track idler',mass:2,hp:70,size:[.3,.5,.5],color:0x7c8c9a},
 esc:{label:'ESC',mass:.4,hp:30,size:[.25,.12,.3],color:0x5ccfb1},
 flight:{label:'Flight controller',mass:.3,hp:35,size:[.4,.12,.4],color:0x65c8ff},
 sensor:{label:'Camera / sensor',mass:.4,hp:25,size:[.3,.25,.3],color:0x79c5f3},
 brushless:{label:'Lift motor',mass:1.3,hp:65,size:[.3,.3,.3],color:0xeda84a,power:140},
 propeller:{label:'Propeller',mass:.2,hp:30,size:[1.3,.07,.16],color:0x9ac7cf,power:1},
 weaponMotor:{label:'Weapon motor',mass:5,hp:80,size:[.55,.5,.65],color:0xf3ab51,power:1},
 belt:{label:'Drive belt',mass:.4,hp:40,size:[.15,.6,.7],color:0x303a47},
 shaft:{label:'Weapon shaft',mass:2,hp:65,size:[1.2,.12,.12],color:0xc4d3dc},
 bearing:{label:'Bearing',mass:.5,hp:50,size:[.2,.3,.3],color:0x73a8b5},
 mount:{label:'Weapon mount',mass:3,hp:100,size:[1,.25,.8],color:0x657c8a},
 spinner:{label:'Vertical spinner',mass:10,hp:130,size:[.25,1.1,1.1],color:0xff9159,power:1},
 projectile:{label:'Fictional pulse launcher',mass:6,hp:85,size:[.55,.45,1.4],color:0xff9159,power:1},
 actuator:{label:'Electric actuator',mass:4,hp:70,size:[.3,.35,.8],color:0xe9b863,power:1},
 flipper:{label:'Lifting arm',mass:7,hp:110,size:[1.8,.2,1.5],color:0xff9159,power:1},
 grabber:{label:'Articulated gripper',mass:8,hp:100,size:[1.6,.3,1.4],color:0xff9159,power:1},
 hammer:{label:'Hammer arm',mass:11,hp:110,size:[.35,.35,2.1],color:0xff9159,power:1},
 custom:{label:'Imported mesh',mass:4,hp:80,size:[1,.3,1],color:0x9a9eff}
};
const controls={forward:'w',reverse:'s',left:'a',right:'d',boost:'shift',weapon:' ',open:'q',close:'e',up:'r',down:'f'};
let seq=0;
function component(type,x=0,y=.5,z=0,extra={}){const d=catalog[type];return {id:'c'+(++seq),type,x,y,z,mass:d.mass,hp:d.hp,maxHp:d.hp,power:d.power||1,heat:0,yaw:0,connected:true,side:x<0?'left':'right',...extra};}
function base(name,category='GROUND'){return {version:1,name,category,controls:{...controls},components:[]};}
function templates(){
 const results=[];
 function ground(name,opts={}){let r=base(name,opts.tracked?'TRACKED':'GROUND'),c=r.components;
 c.push(component('frame'),component('battery',0,.85,.45));
 for(const side of [-1,1]){c.push(component('motor',side*.82,.6,.4,{power:opts.speed||1}));
 if(opts.tracked){c.push(component('track',side*1.4,.325,0),component('sprocket',side*1.4,.5,1),component('idler',side*1.4,.5,-1));}
 else for(const z of [-.9,.9])c.push(component('wheel',side*1.3,.325,z));}
 c.push(component('wedge',0,.43,-1.65));if(!opts.light)c.push(component('armor',0,.7,-1.38));
 results.push(r);return r;}
 const ram=ground('RAMMER',{speed:1.6});ram.components.push(component('armor',0,.75,-1.15));
 const fast=ground('SPEEDSTER',{speed:2.2,light:true});fast.components.find(c=>c.type==='battery').power=35;fast.components.find(c=>c.type==='frame').mass=6;
 function weapon(r,type){r.components.push(component('mount',0,.95,-.7),component(type,0,1.2,-1.05));}
 const rover=ground('RAPID-FIRE ROVER',{speed:1.4,light:true});weapon(rover,'projectile');
 const drone=base('COMBAT DRONE','AERIAL');drone.components.push(component('frame',0,.6,0,{mass:4,shape:'quad'}),component('battery',0,.85,0,{mass:4,power:50}),component('flight',0,1.12,.2),component('sensor',0,.85,-1.3));
 for(const x of [-1.3,1.3])for(const z of [-1.3,1.3]){const m=component('brushless',x,.8,z);drone.components.push(m,component('esc',x,.58,z,{parent:m.id}),component('propeller',x,1.03,z,{parent:m.id}));}weapon(drone,'projectile');results.push(drone);
 const tank=ground('TANK',{tracked:true,speed:.8});tank.components.find(c=>c.type==='battery').power=150;for(const x of [-1,1])tank.components.push(component('armor',x,1,0,{mass:16}));weapon(tank,'projectile');
 const spinner=ground('SPINNER');weapon(spinner,'spinner');spinner.components.push(component('weaponMotor',0,.9,.2),component('belt',.4,1,-.6),component('shaft',0,1.2,-1.1),component('bearing',-.5,1.2,-1.1),component('bearing',.5,1.2,-1.1));
 for(const [name,type] of [['FLIPPER','flipper'],['GRABBER','grabber'],['HAMMER','hammer']]){const r=ground(name);weapon(r,type);r.components.push(component('actuator',0,.9,0));}
 return results;
}
const clone=x=>JSON.parse(JSON.stringify(x));
const alive=(r,type)=>r.components.filter(c=>c.type===type&&c.hp>0);
const health=c=>Math.max(0,c.hp/c.maxHp);
function stats(r){const mass=r.components.reduce((s,c)=>s+c.mass,0),b=alive(r,'battery').filter(c=>c.connected),lift=alive(r,'brushless').filter(m=>m.connected).reduce((s,m)=>s+m.power*health(m)*(alive(r,'propeller').find(p=>p.parent===m.id)?health(alive(r,'propeller').find(p=>p.parent===m.id)):0)*(alive(r,'esc').some(e=>e.parent===m.id&&e.connected)?1:0),0);return {mass,capacity:b.reduce((s,c)=>s+c.power,0),thrust:lift,twr:lift/(Math.max(1,mass)*9.81),hp:r.components.reduce((s,c)=>s+c.hp,0),maxHp:r.components.reduce((s,c)=>s+c.maxHp,0)};}
function validate(r){if(!r||r.version!==1||!Array.isArray(r.components)||r.components.length>200)throw Error('Not a V1 robot assembly (maximum 200 components).');if(typeof r.name!=='string'||r.name.length>80)throw Error('Invalid robot name.');const ids=new Set();for(const c of r.components){if(!catalog[c.type]||typeof c.id!=='string'||!/^[-a-zA-Z0-9_]{1,64}$/.test(c.id)||ids.has(c.id))throw Error('Invalid or duplicate component.');ids.add(c.id);for(const k of ['x','y','z','mass','hp','maxHp','power'])if(!Number.isFinite(c[k]))throw Error('Invalid component values.');if(Math.abs(c.x)>10||Math.abs(c.z)>10||c.y<0||c.y>10||c.mass<=0||c.mass>500||c.maxHp<=0||c.maxHp>10000||c.hp<0||c.hp>c.maxHp||c.power<=0||c.power>1000)throw Error('Component outside supported range.');if(c.mesh&&(!Array.isArray(c.mesh)||c.mesh.length>90000||c.mesh.length%9||c.mesh.some(v=>!Number.isFinite(v)||Math.abs(v)>100)))throw Error('Invalid custom mesh.');}const bindings={...controls};for(const k of Object.keys(controls)){if(r.controls&&Object.hasOwn(r.controls,k))bindings[k]=r.controls[k];if(typeof bindings[k]!=='string'||bindings[k].length>16)throw Error('Invalid control binding.');}r.controls=bindings;for(const c of r.components){c.heat=Number.isFinite(c.heat)?Math.max(0,Math.min(200,c.heat)):0;c.connected=c.connected!==false;c.yaw=Number.isFinite(c.yaw)?c.yaw%360:0;c.shape=c.shape==='quad'?'quad':'plate';if(c.parent&&!ids.has(c.parent))delete c.parent;}if(r.handling){for(const k of ['steering','braking'])if(!Number.isFinite(r.handling[k])||r.handling[k]<.5||r.handling[k]>1.8)throw Error('Invalid handling setting.');}return r;}
function spawn(design,x,z){const r=clone(design);Object.assign(r,{x,z,angle:0,vx:0,vz:0,alt:0,vy:0,roll:0,charge:stats(r).capacity,cooldown:0,ammo:40,reload:0,spin:0,grip:false,disabled:false,targetAlt:0,pitch:0,damageTaken:0,shotsFired:0});return r;}
function hurt(r,amount,wx,wz){let best=null,score=Infinity;for(const c of r.components){if(c.hp<=0)continue;const x=r.x+Math.cos(r.angle)*c.x+Math.sin(r.angle)*c.z,z=r.z-Math.sin(r.angle)*c.x+Math.cos(r.angle)*c.z;let d=(x-wx)**2+(z-wz)**2;if(d<score){score=d;best=c;}}if(best){const actual=Math.min(best.hp,amount);best.hp=Math.max(0,best.hp-amount);r.damageTaken=(r.damageTaken||0)+actual;r.lastHit={x:wx,z:wz,part:best.id,amount:actual};return best;}}
function driveSide(r,side){let m=alive(r,'motor').filter(c=>c.side===side&&c.connected).reduce((s,c)=>s+c.power*health(c)*(c.heat>100?.25:1),0);const tr=alive(r,'track').filter(c=>c.side===side);if(r.components.some(c=>c.type==='track'&&c.side===side)){if(!alive(r,'sprocket').some(c=>c.side===side)||!alive(r,'idler').some(c=>c.side===side))return 0;return m*tr.reduce((s,c)=>s+health(c),0);}return m*Math.min(1,alive(r,'wheel').filter(c=>c.side===side).reduce((s,c)=>s+health(c),0)/2);}
function step(r,input,dt){const st=stats(r),hasFrame=alive(r,'frame').length>0;r.disabled=!hasFrame||st.capacity===0||r.charge<=0;r.cooldown=Math.max(0,r.cooldown-dt);r.reload=Math.max(0,r.reload-dt);if(r.reload===0&&r.ammo===0)r.ammo=40;
 for(const c of r.components)c.heat=Math.max(0,(c.heat||0)-dt*6);
 const powered=!r.disabled,throttle=powered?(input.forward||0):0,steer=powered?(input.steer||0):0,boost=input.boost?1.65:1;
 let consumption=.008;
 const flight=alive(r,'flight').some(c=>c.connected),isLift=r.components.some(c=>c.type==='brushless');
 if(isLift){
  if(!Number.isFinite(r.targetAlt))r.targetAlt=0;
  if(input.takeoff)r.targetAlt=r.targetAlt>.2?0:3;
  r.targetAlt=Math.max(0,Math.min(10,r.targetAlt+(input.lift||0)*3*dt));
  const active=powered&&flight;
  const correction=(r.targetAlt-r.alt)*5-r.vy*3.5;
  const requested=active?Math.max(0,st.mass*(9.81+correction)):0;
  const lift=Math.min(st.thrust,requested);
  r.vy+=(lift/Math.max(st.mass,1)-9.81)*dt;
  r.alt=Math.max(0,r.alt+r.vy*dt);
  if(r.alt>12){r.alt=12;r.vy=Math.min(0,r.vy);}
  if(r.alt===0){if(r.vy< -3)hurt(r,Math.abs(r.vy)*5,r.x,r.z);r.vy=0;}
  const airborne=active&&r.alt>.1&&lift>st.mass*4;
  if(airborne){r.angle+=steer*1.9*dt;r.vx-=Math.sin(r.angle)*throttle*8*dt;r.vz-=Math.cos(r.angle)*throttle*8*dt;}
  r.pitch+=(throttle*.15*(airborne?1:0)-r.pitch)*Math.min(1,dt*5);
  r.vx*=Math.exp(-dt*.6);r.vz*=Math.exp(-dt*.6);
  consumption+=lift*.00018;
  const motors=r.components.filter(c=>c.type==='brushless');
  const imbalance=motors.reduce((sum,c)=>sum+c.x*(1-health(c)),0)*.16;
  r.roll+=(imbalance-steer*.15*(airborne?1:0)-r.roll)*Math.min(1,dt*5);
  for(const c of motors)if(c.hp>0&&c.connected)c.heat+=lift/Math.max(motors.length,1)*.018*dt;
  if(airborne&&Math.abs(imbalance)>.1){r.vx+=imbalance*dt*2;consumption*=1.3;}
 }
 else{
  // Ground contact: strong lateral grip, motor acceleration and active braking.
  const l=driveSide(r,'left'),right=driveSide(r,'right'),tracked=r.components.some(c=>c.type==='track');
  const grounded=r.alt<=.025;
  const tuning=r.handling||{},sensitivity=Math.max(.5,Math.min(1.8,tuning.steering||1));
  if(grounded){
   const drive=(l+right)/2,asymmetry=(l-right)/Math.max(1,l+right);
   const massFactor=Math.max(.55,Math.min(1.4,Math.sqrt(60/Math.max(15,st.mass))));
   const desiredYaw=(steer*(tracked?2.4:3.4)*Math.min(1.4,drive)*massFactor+throttle*asymmetry*2.2)*sensitivity;
   r.yawRate=(r.yawRate||0)+(desiredYaw-(r.yawRate||0))*(1-Math.exp(-18*dt));
   r.angle+=r.yawRate*dt;
   const fx=-Math.sin(r.angle),fz=-Math.cos(r.angle),sx=Math.cos(r.angle),sz=-Math.sin(r.angle);
   let longitudinal=r.vx*fx+r.vz*fz,lateral=r.vx*sx+r.vz*sz;
   const grip=tracked?15:12;
   lateral*=Math.exp(-grip*dt);
   const acceleration=Math.min(22,600*drive/Math.max(20,st.mass))*boost;
   const maxSpeed=Math.min(tracked?6:15,Math.max(3,8*drive*massFactor))*boost;
   if(throttle!==0&&drive>0){
    const reverseBraking=longitudinal*throttle<-.1?1.7:1;
    longitudinal+=throttle*acceleration*reverseBraking*dt;
    longitudinal=Math.max(-maxSpeed*.65,Math.min(maxSpeed,longitudinal));
   }else{
    const braking=(powered?16:3)*(tracked?1.2:1)*Math.max(.5,Math.min(1.6,tuning.braking||1));
    longitudinal=Math.sign(longitudinal)*Math.max(0,Math.abs(longitudinal)-braking*dt);
   }
   r.vx=fx*longitudinal+sx*lateral;r.vz=fz*longitudinal+sz*lateral;
   r.roll*=Math.exp(-12*dt);r.pitch=((r.pitch||0)*Math.exp(-10*dt));
   consumption+=(Math.abs(throttle)*drive+Math.abs(steer)*drive*.4)*.045*boost;
   for(const c of alive(r,'motor'))if(c.connected){c.heat+=(Math.abs(throttle)+Math.abs(steer)*.3)*boost*9*dt;if(c.heat>140)c.hp=Math.max(0,c.hp-dt*2);}
  }else{
   r.vy-=9.81*dt;r.alt=Math.max(0,r.alt+r.vy*dt);
   if(r.alt===0){hurt(r,Math.abs(r.vy)*2,r.x,r.z);r.vy=0;r.roll=.08;}
  }
 }
 r.charge=Math.max(0,Math.min(st.capacity,r.charge-consumption*dt));if(isLift){r.vx*=Math.exp(-.32*dt);r.vz*=Math.exp(-.32*dt);}r.x+=r.vx*dt;r.z+=r.vz*dt;
 for(const axis of ['x','z'])if(Math.abs(r[axis])>17){const v=axis==='x'?'vx':'vz';hurt(r,Math.abs(r[v])*3,axis==='x'?Math.sign(r.x)*19:r.x,axis==='z'?Math.sign(r.z)*19:r.z);r[axis]=Math.sign(r[axis])*17;r[v]*=-.35;}
 if(input.open)r.grip=false;if(input.close&&powered)r.grip=true;
 const spinning=alive(r,'spinner').some(c=>c.connected)&&alive(r,'weaponMotor').some(c=>c.connected)&&['weaponMotor','belt','shaft','bearing','mount'].every(t=>alive(r,t).length);r.spin=Math.max(0,Math.min(1,r.spin+(powered&&spinning?.35:-.8)*dt));if(r.spin>0){r.charge=Math.max(0,r.charge-.025*dt);for(const c of alive(r,'bearing')){c.heat+=8*r.spin*dt;if(c.heat>110)c.hp=Math.max(0,c.hp-dt);}}
 return st;
}
function attack(r,target,dt,fire,projectiles){const dist=Math.hypot(r.x-target.x,r.z-target.z),powered=!r.disabled,mounted=alive(r,'mount').length>0;
 if(dist<3.2&&Math.abs(r.alt-target.alt)<1.5&&r.spin>.2&&mounted){hurt(target,55*r.spin*dt,r.x,r.z);hurt(r,2*r.spin*dt,target.x,target.z);}
 if(r.grip&&powered&&mounted&&alive(r,'grabber').length&&alive(r,'actuator').length&&dist<3.6&&Math.abs(r.alt-target.alt)<1.5){target.vx+=(r.vx-target.vx)*Math.min(1,dt*3);target.vz+=(r.vz-target.vz)*Math.min(1,dt*3);}
 if(!fire||!powered||!mounted||r.cooldown>0)return;
 const gun=alive(r,'projectile')[0];if(gun&&gun.connected&&gun.heat<95&&r.reload===0){const aimAngle=r.angle+(gun.yaw||0)*Math.PI/180,dx=target.x-r.x,dz=target.z-r.z;
const facing=dist>0?(-Math.sin(aimAngle)*dx-Math.cos(aimAngle)*dz)/dist:1;
const vertical=facing>.9?(target.alt-r.alt)/Math.max(1,dist-2.2):0;
const horizontal=24/Math.sqrt(1+vertical*vertical);
projectiles.push({x:r.x-Math.sin(aimAngle)*2.2,z:r.z-Math.cos(aimAngle)*2.2,y:r.alt+1.2,vx:-Math.sin(aimAngle)*horizontal,vz:-Math.cos(aimAngle)*horizontal,vy:horizontal*vertical,owner:r,life:2,damage:12*gun.power});r.shotsFired++;r.vx+=Math.sin(r.angle)*20*gun.power/stats(r).mass;r.vz+=Math.cos(r.angle)*20*gun.power/stats(r).mass;gun.heat+=10*gun.power;r.charge=Math.max(0,r.charge-.04*gun.power);r.cooldown=.16;r.ammo--;if(r.ammo<=0)r.reload=2.5;return;}
 if(!alive(r,'actuator').some(c=>c.connected))return;
 for(const type of ['flipper','hammer','grabber']){const w=alive(r,type)[0];if(!w)continue;r.cooldown=type==='hammer'?1.2:.8;w.heat+=8;r.charge=Math.max(0,r.charge-.12);r.roll=.35;const dx=target.x-r.x,dz=target.z-r.z,facing=dist===0?1:(dx*-Math.sin(r.angle)+dz*-Math.cos(r.angle))/dist;
 if(dist<4&&Math.abs(r.alt-target.alt)<2&&facing>.35){if(type==='flipper'||type==='grabber'){target.vy=8*Math.min(1.5,stats(r).mass/stats(target).mass)*w.power;target.alt+=.1;}else hurt(target,55*w.power,target.x,target.z);}break;}
}
function collide(a,b){const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d>=2.7||Math.abs(a.alt-b.alt)>1.5)return;const nx=dx/(d||1),nz=dz/(d||1),ma=stats(a).mass,mb=stats(b).mass,relative=(a.vx-b.vx)*nx+(a.vz-b.vz)*nz;const overlap=(2.7-d)/2;a.x-=nx*overlap;a.z-=nz*overlap;b.x+=nx*overlap;b.z+=nz*overlap;if(relative>0){const j=1.25*relative/(1/ma+1/mb);a.vx-=j*nx/ma;a.vz-=j*nz/ma;b.vx+=j*nx/mb;b.vz+=j*nz/mb;if(relative>1.5){hurt(a,relative*mb*.08,b.x,b.z);hurt(b,relative*ma*.08,a.x,a.z);}}}
function diagnostics(r){
 const issues=[],st=stats(r),has=t=>alive(r,t).length>0;
 const add=(level,text)=>issues.push({level,text});
 if(!has('frame'))add('error','Add a working structural frame.');
 if(st.capacity<=0)add('error','Add a connected, working battery.');
 if(r.components.some(c=>c.type==='brushless')){
  if(!alive(r,'flight').some(c=>c.connected))add('error','Flight needs a connected flight controller.');
  if(st.twr<=1)add('error','Insufficient lift: thrust / weight must exceed 1.0.');
  else if(st.twr<1.4)add('warning','Low lift margin; reduce mass or add thrust.');
  for(const m of alive(r,'brushless'))if(!alive(r,'propeller').some(c=>c.parent===m.id)||!alive(r,'esc').some(c=>c.parent===m.id&&c.connected))add('warning','Lift motor '+m.id+' needs a linked propeller and ESC.');
 }else if(!driveSide(r,'left')||!driveSide(r,'right'))add('warning','Both drive sides need connected motors and wheels/tracks.');
 for(const t of ['spinner','projectile','hammer','flipper','grabber'])if(has(t)){
  if(!has('mount'))add('warning','Weapon needs a mount.');
  if(t==='spinner')for(const req of ['weaponMotor','belt','shaft','bearing'])if(!has(req))add('warning','Spinner missing '+catalog[req].label+'.');
  if(['hammer','flipper','grabber'].includes(t)&&!alive(r,'actuator').some(c=>c.connected))add('warning','Arm needs a connected actuator.');
 }
 if(r.components.some(c=>c.hp<c.maxHp*.5))add('warning','Some components are badly damaged. Repair before testing.');
 return issues;
}
const api={catalog,controls,component,base,templates,clone,alive,stats,validate,spawn,hurt,step,attack,collide,driveSide,diagnostics};if(typeof module!=='undefined')module.exports=api;root.Forge=api;
})(typeof window!=='undefined'?window:globalThis);
