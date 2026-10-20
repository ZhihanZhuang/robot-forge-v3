const assert=require('node:assert/strict'),F=require('../core.js');let count=0;
const stock=F.templates(),robot=(name='RAMMER')=>F.spawn(stock.find(r=>r.name===name),0,0),run=(r,input,time)=>{for(let i=0;i<time*120;i++)F.step(r,input,1/120);};
function test(n,fn){fn();count++;console.log('PASS',n);}
test('Release brakes from 8 m/s to a stop in under one second',()=>{const r=robot();r.vz=-8;run(r,{},1);assert(Math.hypot(r.vx,r.vz)<.01);assert(Math.abs(r.z)<3);});
test('Sideways slip decays by over 99% in half a second',()=>{const r=robot();r.vx=8;run(r,{},.5);assert(Math.abs(r.vx)<.03);});
test('Steering responds in the first tenth of a second',()=>{const r=robot();run(r,{steer:1},.1);assert(r.angle>.1);});
test('Yaw settles promptly after releasing steering',()=>{const r=robot();run(r,{steer:1},.5);run(r,{},.3);assert(Math.abs(r.yawRate)<.03);});
test('Reverse input first brakes then reverses',()=>{const r=robot();r.vz=-8;run(r,{forward:-1},.2);assert(r.vz> -5);run(r,{forward:-1},1);assert(r.vz>0);});
test('Heavy tracks turn more slowly than a light speedster',()=>{const t=robot('TANK'),s=robot('SPEEDSTER');run(t,{steer:1},.5);run(s,{steer:1},.5);assert(s.angle>t.angle*1.5);});
test('Ground drive does not accelerate airborne chassis',()=>{const r=robot();r.alt=5;r.vx=2;run(r,{forward:1,steer:1},.2);assert.equal(r.vz,0);assert.equal(r.angle,0);assert.equal(r.vx,2);});
test('Failed side produces asymmetric steering',()=>{const r=robot('TANK');r.components.find(c=>c.type==='motor'&&c.side==='left').hp=0;run(r,{forward:1},.5);assert(Math.abs(r.angle)>.2);});
test('Steering tuning changes response',()=>{const a=robot(),b=robot();a.handling={steering:.5,braking:1};b.handling={steering:1.5,braking:1};run(a,{steer:1},.3);run(b,{steer:1},.3);assert(b.angle>a.angle*2.9);});
test('Invalid imported handling is rejected',()=>{const r=F.clone(stock[0]);r.handling={steering:20,braking:1};assert.throws(()=>F.validate(r));});
test('Stock tires and tracks touch the floor',()=>{for(const r of stock)for(const c of r.components.filter(c=>['wheel','track'].includes(c.type)))assert(Math.abs(c.y-F.catalog[c.type].size[1]/2)<.001);});
console.log(count+' V3 tests passed.');
