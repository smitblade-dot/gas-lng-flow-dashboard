/* Operating evidence policy v1. A refresh timestamp is not asset verification. */
(function(root){
  const uncertainty = /presum|not confirmed|not independently confirmed|unconfirmed|data gap|unknown|unavailable|no .*disruption identified/i;
  function classify(row, now=new Date()) {
    const status=row.map_status;
    if(!['Green','Amber','Red','Blue','Unknown'].includes(status)) return 'Unknown';
    if(status!=='Green') return status;
    if(uncertainty.test([row.status,row.watch_item].filter(Boolean).join(' '))) return 'Unknown';
    const date=row.verified_at;
    if(row.verification!=='confirmed' || !row.source || !/^\d{4}-\d{2}-\d{2}$/.test(date||'')) return 'Unknown';
    const when=new Date(date+'T00:00:00Z'), age=(now-when)/86400000;
    if(isNaN(age) || when.toISOString().slice(0,10)!==date || age<0 || age>30) return 'Unknown';
    return 'Green';
  }
  function normalise(data, now=new Date()) {
    data.infrastructure.forEach(row=>{
      row.reported_map_status=row.reported_map_status||row.map_status||null;
      row.map_status=classify(row,now);
    });
    return data;
  }
  const api={classify,normalise,isException:row=>classify(row)!=='Green'};
  if(typeof module!=='undefined') module.exports=api;
  root.OperatingStatus=api;
})(typeof window==='undefined'?globalThis:window);
