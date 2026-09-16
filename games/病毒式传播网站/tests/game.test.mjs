import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreCircle,dailyRadius,readChallenge,dateKey} from '../game.js';
test('daily challenge uses the same UTC date across time zones',()=>{
  assert.equal(dateKey(new Date('2026-09-17T01:00:00+08:00')),'2026-09-16');
  assert.equal(dateKey(new Date('2026-09-16T17:00:00Z')),'2026-09-16');
});
const circle=(radius=.28,turns=1)=>Array.from({length:181},(_,i)=>({x:.5+radius*Math.cos(i/180*Math.PI*2*turns),y:.5+radius*Math.sin(i/180*Math.PI*2*turns)}));
test('a full circle scores highly in either direction',()=>{assert.equal(scoreCircle(circle()).score,100);assert.equal(scoreCircle(circle().reverse()).score,100)});
test('reject short strokes, tiny loops, arcs and repeated loops',()=>{assert.equal(scoreCircle(circle().slice(0,5)).valid,false);assert.equal(scoreCircle(circle(.02)).valid,false);assert.equal(scoreCircle(circle(.28,.5)).valid,false);assert.equal(scoreCircle(circle(.28,2)).valid,false)});
test('imperfect and open circles receive lower scores',()=>{const oval=circle().map(p=>({...p,x:.5+(p.x-.5)*.65}));assert.ok(scoreCircle(oval).score<90);assert.ok(scoreCircle(circle(.28,.9)).score<100)});
test('daily size matters and is deterministic',()=>{const radius=dailyRadius('2026-09-17');assert.equal(radius,dailyRadius('2026-09-17'));assert.equal(scoreCircle(circle(radius),radius).score,100);assert.ok(scoreCircle(circle(radius*.6),radius).score<90)});
test('challenge URLs are validated',()=>{assert.deepEqual(readChallenge('?mode=free&score=95.2'),{mode:'free',score:95.2,day:null});for(const q of ['?score=NaN&mode=free','?score=101&mode=free','?score=90&mode=bad','?score=90&mode=daily&day=abc','?mode=free'])assert.equal(readChallenge(q),null);assert.equal(readChallenge('?score=90&mode=daily&day=2026-09-17').day,'2026-09-17')});
