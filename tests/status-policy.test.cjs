const {test}=require('node:test'), assert=require('node:assert/strict');
const {classify,normalise,isException}=require('../status-policy.js');
const fs=require('node:fs');
const now=new Date('2026-10-08T00:00:00Z');
const confirmed={map_status:'Green',status:'Operating normally',verification:'confirmed',source:'Operator operating report',verified_at:'2026-10-07'};
const cases=[
 ['confirmed',confirmed,'Green'],
 ['presumed',{...confirmed,status:'Presumed normal'},'Unknown'],
 ['missing evidence',{map_status:'Green',status:'Normal'},'Unknown'],
 ['month only',{...confirmed,verified_at:'2026-10'},'Unknown'],
 ['stale despite fresh dataset',{...confirmed,verified_at:'2026-09-01'},'Unknown'],
 ['boundary',{...confirmed,verified_at:'2026-09-08'},'Green'],
 ['future',{...confirmed,verified_at:'2026-10-09'},'Unknown'],
 ['invalid date',{...confirmed,verified_at:'2026-02-30'},'Unknown'],
 ['missing status',{},'Unknown'],['unrecognised',{map_status:'Purple'},'Unknown'],
 ['known disruption',{map_status:'Red',status:'Restart unknown'},'Red'],
 ['known restriction',{map_status:'Amber'},'Amber'],['new',{map_status:'Blue'},'Blue'],
 ['watch uncertainty',{...confirmed,watch_item:'Current operation not independently confirmed'},'Unknown']
];
for(const [name,row,expected] of cases)test(name,()=>assert.equal(classify(row,now),expected));
test('unknown-only regions remain exceptions',()=>assert.equal(isException({map_status:'Unknown'}),true));
test('all 19 original assessments retained individually',()=>{
 const review=JSON.parse(fs.readFileSync(__dirname+'/../status-review.json'));
 const data=JSON.parse(fs.readFileSync(__dirname+'/../data.json'));
 assert.equal(review.records.length,19);
 for(const r of review.records){const asset=data.infrastructure.find(x=>x.infrastructure_id===r.infrastructure_id);assert.equal(asset.status,r.original_status);assert.equal(asset.map_status,'Unknown');}
});
test('normalisation never uses refresh as verification and keeps original status',()=>{
 const d={meta:{generated:'2026-10-08'},infrastructure:[{map_status:'Green',status:'Presumed normal'}]};
 normalise(d,now);assert.equal(d.infrastructure[0].reported_map_status,'Green');assert.equal(d.infrastructure[0].map_status,'Unknown');assert.equal(d.infrastructure[0].status,'Presumed normal');
});

