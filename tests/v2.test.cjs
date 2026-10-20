const assert=require('node:assert/strict'),F=require('../core.js');let total=0;
function test(name,fn){fn();total++;console.log('PASS',name);}
const templates=F.templates(),robot=name=>F.spawn(templates.find(r=>r.name===name),0,0),run=(r,input={},seconds=4)=>{for(let i=0;i<seconds*120;i++)F.step(r,input,1/120);};
test('Takeoff reaches 3 m then holds without further input',()=>{const r=robot('COMBAT DRONE');F.step(r,{takeoff:true},1/120);run(r,{},5);assert(Math.abs(r.alt-3)<.02);assert(Math.abs(r.vy)<.02);});
test('Landing returns to floor without damage',()=>{const r=robot('COMBAT DRONE');r.targetAlt=3;run(r,{},4);const hp=F.stats(r).hp;F.step(r,{takeoff:true},1/120);run(r,{},5);assert.equal(r.alt,0);assert.equal(F.stats(r).hp,hp);});
test('Manual climb changes setpoint, release holds new altitude',()=>{const r=robot('COMBAT DRONE');run(r,{lift:1},1);assert(Math.abs(r.targetAlt-3)<.01);run(r,{},4);assert(Math.abs(r.alt-3)<.03);});
test('Insufficient thrust prevents flight and reports why',()=>{const r=robot('COMBAT DRONE');F.alive(r,'brushless').forEach(c=>c.power=10);r.targetAlt=3;run(r,{},2);assert.equal(r.alt,0);assert(F.diagnostics(r).some(i=>i.text.includes('Insufficient lift')));});
test('Disconnected controller prevents flight and reports why',()=>{const r=robot('COMBAT DRONE');F.alive(r,'flight')[0].connected=false;r.targetAlt=3;run(r,{forward:1},2);assert.equal(r.alt,0);assert.equal(r.z,0);assert(F.diagnostics(r).some(i=>i.text.includes('controller')));});
test('Loss of lift in air causes descent',()=>{const r=robot('COMBAT DRONE');r.targetAlt=3;run(r,{},3);F.alive(r,'brushless').forEach(c=>c.hp=0);run(r,{},.25);assert(r.vy<0);});
test('Air-to-ground pulse converges on target height',()=>{const r=robot('COMBAT DRONE'),t=robot('TANK');r.alt=4;t.z=-10;const p=[];F.attack(r,t,.01,true,p);assert(p[0].vy<0);const seconds=(t.z-p[0].z)/p[0].vz;assert(Math.abs(p[0].y+p[0].vy*seconds-(t.alt+1.2))<.001);});
test('Ground-to-air pulse converges on target height',()=>{const r=robot('RAPID-FIRE ROVER'),t=robot('COMBAT DRONE');t.alt=5;t.z=-12;const p=[];F.attack(r,t,.01,true,p);assert(p[0].vy>0);});
test('Elevation assist is not active for targets behind shooter',()=>{const r=robot('RAPID-FIRE ROVER'),t=robot('COMBAT DRONE');t.alt=5;t.z=12;const p=[];F.attack(r,t,.01,true,p);assert.equal(p[0].vy,0);});
test('Weapon orientation changes projectile direction',()=>{const r=robot('RAPID-FIRE ROVER'),t=robot('TANK');F.alive(r,'projectile')[0].yaw=90;const p=[];F.attack(r,t,.01,true,p);assert(p[0].vx< -20);});
test('Every stock platform passes engineering checks',()=>{for(const r of templates)assert.deepEqual(F.diagnostics(r),[],r.name);});
test('Missing spinner dependencies are reported',()=>{const r=robot('SPINNER');F.alive(r,'belt')[0].hp=0;assert(F.diagnostics(r).some(i=>i.text.includes('Drive belt')));});
test('V1 assemblies migrate with safe rotation defaults',()=>{const r=F.clone(templates[0]);r.components.forEach(c=>delete c.yaw);F.validate(r);assert(r.components.every(c=>c.yaw===0));});
test('Damage counters count actual removed component health',()=>{const r=robot('RAMMER');F.hurt(r,100000,0,-2);assert(r.damageTaken>0&&r.damageTaken<1000);});
console.log(total+' V2 tests passed.');
