export function dateKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}`;
}
export function dailyRadius(key) { return 0.24 + ([...key].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,0)%7)*0.008; }
export function scoreCircle(points, target = null) {
  if (points.length < 12) return { valid:false, message:'Too short. Draw one full loop around the center.' };
  const radii = points.map(p=>Math.hypot(p.x-.5,p.y-.5));
  const radius = radii.reduce((a,b)=>a+b,0)/radii.length;
  if (radius < .09) return { valid:false, message:'Too small. Try a bigger circle.' };
  let travel=0, winding=0, length=0;
  for(let i=1;i<points.length;i++) {
    let angle=Math.atan2(points[i].y-.5,points[i].x-.5)-Math.atan2(points[i-1].y-.5,points[i-1].x-.5);
    angle=Math.atan2(Math.sin(angle),Math.cos(angle)); travel+=Math.abs(angle); winding+=angle;
    length+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);
  }
  if(Math.abs(winding)<Math.PI*1.45 || travel>Math.PI*2.8) return {valid:false,message:'Draw once around the center, without doubling back.'};
  const deviation=Math.sqrt(radii.reduce((a,r)=>a+(r-radius)**2,0)/radii.length)/radius;
  const gap=Math.hypot(points[0].x-points.at(-1).x,points[0].y-points.at(-1).y)/radius;
  const coverage=Math.abs(2*Math.PI-Math.abs(winding))/(2*Math.PI);
  const roughness=Math.max(0,length/(2*Math.PI*radius)-1.025);
  const sizeError=target?Math.abs(radius-target)/target:0;
  const score=Math.max(0,Math.min(100,100*(1-deviation*1.65-gap*.12-coverage*.3-roughness*.25-sizeError*.45)));
  return {valid:true,score:Math.round(score*10)/10,radius};
}
export function readChallenge(search) {
  const p=new URLSearchParams(search), score=Number(p.get('score')), mode=p.get('mode');
  if(!p.has('score') || !Number.isFinite(score) || score<0 || score>100 || !['free','daily'].includes(mode))return null;
  const day=p.get('day');
  if(mode==='daily' && (!/^\d{4}-\d{2}-\d{2}$/.test(day||'') || !Number.isFinite(Date.parse(day))))return null;
  return {score,mode,day};
}
