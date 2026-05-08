import { useState, useRef, useEffect } from "react";

const CATS = {
  insurance: { label: "Versicherungen", icon: "🛡️", color: "#6366F1", dim: "rgba(99,102,241,0.13)" },
  mobile:    { label: "Handy-Abos",     icon: "📱", color: "#14B8A6", dim: "rgba(20,184,166,0.13)" },
  internet:  { label: "Internet & TV",  icon: "🌐", color: "#F59E0B", dim: "rgba(245,158,11,0.13)" },
};
const MOBILE_PROVIDERS  = ["Swisscom","Sunrise","Salt","Yallo","Wingo","M-Budget","Aldi Mobile","Digitec Mobile"];
const INTERNET_PROVIDERS = ["Swisscom","Sunrise","Salt","Init7","iWay","Wingo","Quickline","UPC/Sunrise"];
const INSURANCE_PROVIDERS = ["CSS","Helsana","Swica","Concordia","Zurich","AXA","Helvetia","Mobiliar","Dextra","TCS"];
const MOBILE_ICONS = ["📱","📲","☎️","💬","📡"];
const INTERNET_ICONS = ["🌐","📺","💻","📶","🔌"];
const INSURANCE_ICONS = ["🏥","🏠","🛡️","🚗","⚖️","✈️","🐾","🦷"];
const COMPARE = {
  mobile: [
    {name:"Wingo",price:19,extra:"5 GB",tag:"💰 Günstig",rating:4.1},
    {name:"Yallo",price:22,extra:"10 GB",tag:"⭐ Top",rating:4.2},
    {name:"M-Budget",price:19,extra:"5 GB",tag:"",rating:3.9},
    {name:"Salt",price:29,extra:"∞ GB",tag:"Top Netz",rating:4.3},
    {name:"Sunrise",price:35,extra:"∞ GB",tag:"",rating:4.4},
    {name:"Swisscom",price:45,extra:"∞ GB",tag:"Bestes Netz",rating:4.6},
  ],
  internet: [
    {name:"Init7",price:39,extra:"1 Gbit/s",tag:"💰 Günstig",rating:4.7},
    {name:"Wingo",price:39,extra:"100 Mbit/s",tag:"",rating:4.0},
    {name:"iWay",price:49,extra:"1 Gbit/s",tag:"⭐ Top",rating:4.5},
    {name:"Salt",price:55,extra:"1 Gbit/s",tag:"",rating:4.2},
    {name:"Sunrise",price:65,extra:"1 Gbit/s",tag:"",rating:4.3},
    {name:"Swisscom",price:79,extra:"1 Gbit/s",tag:"Top Service",rating:4.5},
  ],
  insurance: [
    {name:"Concordia",price:385,extra:"Krankenkasse",tag:"💰 Günstig",rating:4.0},
    {name:"Helsana",price:398,extra:"Krankenkasse",tag:"⭐ Top",rating:4.5},
    {name:"CSS",price:420,extra:"Krankenkasse",tag:"",rating:4.2},
    {name:"Swica",price:435,extra:"Krankenkasse",tag:"Top Service",rating:4.7},
  ],
};

const DEFAULT = [
  {id:1,cat:"insurance",name:"Krankenkasse",provider:"CSS",price:420,icon:"🏥",deadline:"2025-11-30",extra:"Grundversicherung",notes:""},
  {id:2,cat:"insurance",name:"Hausrat & Haftpflicht",provider:"AXA",price:80,icon:"🏠",deadline:"2025-12-31",extra:"CHF 5 Mio.",notes:""},
  {id:3,cat:"mobile",name:"Handy-Abo",provider:"Sunrise",price:35,icon:"📱",deadline:"2025-09-30",extra:"Unlimited",notes:""},
  {id:4,cat:"internet",name:"Heiminternet",provider:"Swisscom",price:79,icon:"🌐",deadline:"2026-01-31",extra:"1 Gbit/s",notes:""},
];

function days(d){return Math.ceil((new Date(d)-new Date())/86400000);}

function Badge({n}){
  const c=n<0?"#EF4444":n<30?"#EF4444":n<90?"#F59E0B":"#10B981";
  const bg=n<0?"rgba(239,68,68,0.15)":n<30?"rgba(239,68,68,0.15)":n<90?"rgba(245,158,11,0.15)":"rgba(16,185,129,0.15)";
  return <span style={{background:bg,color:c,padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700}}>{n<0?"Abgelaufen":n<30?`⚠ ${n}T`:`${n}T`}</span>;
}

function AddModal({cat,item,onSave,onClose,onDel}){
  const cc=CATS[cat];
  const icons=cat==="insurance"?INSURANCE_ICONS:cat==="mobile"?MOBILE_ICONS:INTERNET_ICONS;
  const provs=cat==="insurance"?INSURANCE_PROVIDERS:cat==="mobile"?MOBILE_PROVIDERS:INTERNET_PROVIDERS;
  const e=item||{};
  const [name,setName]=useState(e.name||"");
  const [prov,setProv]=useState(e.provider||provs[0]);
  const [price,setPrice]=useState(e.price||"");
  const [icon,setIcon]=useState(e.icon||icons[0]);
  const [dl,setDl]=useState(e.deadline||"");
  const [extra,setExtra]=useState(e.extra||"");
  const [notes,setNotes]=useState(e.notes||"");
  const ok=name&&prov&&price&&dl;
  const save=()=>{if(!ok)return;onSave({id:e.id||Date.now(),cat,name,provider:prov,price:parseFloat(price),icon,deadline:dl,extra,notes});};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0D1524",borderRadius:"22px 22px 0 0",padding:22,width:"100%",maxWidth:430,maxHeight:"90vh",overflowY:"auto",borderTop:`2px solid ${cc.color}66`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontSize:17,fontWeight:800,color:"#EFF6FF"}}>{item?"Bearbeiten":"Neu hinzufügen"} {cc.icon}</div>
          <button onClick={onClose} style={{background:"#1A2640",border:"none",borderRadius:9,width:32,height:32,color:"#64748B",fontSize:15,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {icons.map(ic=><button key={ic} onClick={()=>setIcon(ic)} style={{width:40,height:40,borderRadius:9,fontSize:18,cursor:"pointer",border:"none",background:icon===ic?cc.dim:"#1A2640",outline:icon===ic?`2px solid ${cc.color}`:"none"}}>{ic}</button>)}
        </div>
        {[
          ["BEZEICHNUNG","text",name,setName,cat==="insurance"?"z.B. Krankenkasse":cat==="mobile"?"z.B. Handy-Abo":"z.B. Heiminternet"],
          [cat==="insurance"?"DECKUNG":cat==="mobile"?"DATENVOLUMEN":"GESCHWINDIGKEIT","text",extra,setExtra,cat==="mobile"?"z.B. 10 GB":"z.B. 1 Gbit/s"],
          ["PREIS / MONAT (CHF)","number",price,setPrice,"z.B. 39"],
          ["KÜNDIGUNG / VERTRAG BIS","date",dl,setDl,""],
          ["NOTIZEN (optional)","text",notes,setNotes,"z.B. Rufnummer..."],
        ].map(([l,t,v,s,ph])=>(
          <div key={l} style={{marginBottom:11}}>
            <div style={{fontSize:10,color:"#4B6082",fontWeight:700,letterSpacing:0.8,marginBottom:5}}>{l}</div>
            <input type={t} value={v} onChange={e=>s(e.target.value)} placeholder={ph} style={{width:"100%",background:"#111D30",border:"1px solid #1A2640",borderRadius:9,padding:"10px 13px",color:"#EFF6FF",fontSize:14,outline:"none",fontFamily:"inherit"}}/>
          </div>
        ))}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:"#4B6082",fontWeight:700,letterSpacing:0.8,marginBottom:5}}>ANBIETER</div>
          <select value={prov} onChange={e=>setProv(e.target.value)} style={{width:"100%",background:"#111D30",border:"1px solid #1A2640",borderRadius:9,padding:"10px 13px",color:"#EFF6FF",fontSize:14,outline:"none",fontFamily:"inherit"}}>
            {provs.map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:10}}>
          {item&&<button onClick={onDel} style={{padding:"11px 15px",borderRadius:11,border:"1px solid rgba(239,68,68,0.4)",background:"transparent",color:"#EF4444",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Löschen</button>}
          <button onClick={save} disabled={!ok} style={{flex:1,padding:"12px 18px",borderRadius:11,border:"none",background:ok?cc.color:"#1A2640",color:ok?"white":"#4B6082",fontWeight:700,fontSize:15,cursor:ok?"pointer":"default",fontFamily:"inherit"}}>{item?"Speichern ✓":"Hinzufügen ✓"}</button>
        </div>
      </div>
    </div>
  );
}

function Home({items,setItems}){
  const [modal,setModal]=useState(null);
  const total=items.reduce((s,i)=>s+i.price,0);
  const urgent=items.filter(i=>{const d=days(i.deadline);return d>0&&d<60;});
  const bycat=k=>items.filter(i=>i.cat===k);
  const save=item=>{setItems(p=>p.find(x=>x.id===item.id)?p.map(x=>x.id===item.id?item:x):[...p,item]);setModal(null);};
  const del=id=>{setItems(p=>p.filter(x=>x.id!==id));setModal(null);};
  return(
    <div style={{padding:15,display:"flex",flexDirection:"column",gap:13}}>
      <div style={{background:"linear-gradient(135deg,#1E1B4B,#2D3A8C,#1D4ED8)",borderRadius:18,padding:18}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.55)",fontWeight:700,letterSpacing:1}}>TOTAL PRO MONAT</div>
        <div style={{fontSize:36,fontWeight:900,color:"#fff",marginTop:3,letterSpacing:-1}}>CHF {total.toLocaleString("de-CH")}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:2}}>CHF {(total*12).toLocaleString("de-CH")}/Jahr · {items.length} Verträge</div>
        <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
          {Object.entries(CATS).map(([k,v])=>{const s=bycat(k).reduce((a,i)=>a+i.price,0);return s>0?<div key={k} style={{background:"rgba(255,255,255,0.1)",borderRadius:9,padding:"5px 11px"}}><div style={{fontSize:9,color:"rgba(255,255,255,0.45)"}}>{v.icon}</div><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>CHF {s}</div></div>:null;})}
        </div>
      </div>
      {urgent.length>0&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:13,padding:13}}>
        <div style={{fontWeight:700,color:"#EF4444",fontSize:13,marginBottom:7}}>⚠ Bald ablaufende Fristen</div>
        {urgent.map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:13,color:"#EFF6FF"}}>{i.icon} {i.name}</span><Badge n={days(i.deadline)}/></div>)}
      </div>}
      <div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:11,padding:11,display:"flex",gap:9,alignItems:"center"}}>
        <span>🔒</span><span style={{fontSize:12,color:"#10B981"}}>Daten bleiben <strong>nur auf deinem Gerät</strong> — kein Server, keine Cloud.</span>
      </div>
      {Object.entries(CATS).map(([k,v])=>(
        <div key={k}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:28,height:28,borderRadius:8,background:v.dim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{v.icon}</div>
              <span style={{fontSize:12,fontWeight:700,color:v.color}}>{v.label.toUpperCase()}</span>
              <span style={{fontSize:11,color:"#4B6082"}}>CHF {bycat(k).reduce((s,i)=>s+i.price,0)}/Mo</span>
            </div>
            <button onClick={()=>setModal({cat:k})} style={{background:v.dim,border:`1px solid ${v.color}44`,borderRadius:9,padding:"5px 12px",color:v.color,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>+ Neu</button>
          </div>
          {bycat(k).length===0
            ?<div onClick={()=>setModal({cat:k})} style={{border:`1.5px dashed ${v.color}30`,borderRadius:13,padding:18,textAlign:"center",color:"#4B6082",fontSize:13,cursor:"pointer"}}>Tippe "+ Neu" zum Hinzufügen</div>
            :<div style={{display:"flex",flexDirection:"column",gap:8}}>
              {bycat(k).map(item=>(
                <div key={item.id} onClick={()=>setModal({cat:k,item})} style={{background:"#0D1524",border:"1px solid #1A2640",borderRadius:13,padding:"12px 14px",display:"flex",alignItems:"center",gap:11,cursor:"pointer"}}>
                  <div style={{width:42,height:42,borderRadius:11,background:v.dim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{item.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:14,color:"#EFF6FF"}}>{item.name}</div>
                    <div style={{fontSize:11,color:"#4B6082",marginTop:1}}>{item.provider}{item.extra?` · ${item.extra}`:""}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:800,fontSize:16,color:v.color}}>CHF {item.price}</div>
                    <div style={{fontSize:10,color:"#4B6082"}}>/Mo</div>
                  </div>
                </div>
              ))}
            </div>}
        </div>
      ))}
      {modal&&<AddModal cat={modal.cat} item={modal.item||null} onSave={save} onClose={()=>setModal(null)} onDel={()=>del(modal.item.id)}/>}
    </div>
  );
}

function Fristen({items}){
  const sorted=[...items].sort((a,b)=>days(a.deadline)-days(b.deadline));
  if(!sorted.length)return<div style={{padding:40,textAlign:"center",color:"#4B6082"}}><div style={{fontSize:42,marginBottom:12}}>📅</div><div>Noch keine Einträge</div></div>;
  return(
    <div style={{padding:15,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{background:"#111D30",borderRadius:11,padding:12,fontSize:12,color:"#4B6082",lineHeight:1.6}}>
        📌 <strong style={{color:"#EFF6FF"}}>Versicherungen:</strong> 3 Monate · <strong style={{color:"#EFF6FF"}}>Handy/Internet:</strong> meist 30 Tage
      </div>
      {sorted.map(item=>{
        const d=days(item.deadline);
        const pct=Math.max(0,Math.min(100,(d/365)*100));
        const cat=CATS[item.cat];
        const bc=d<0?"#EF4444":d<30?"#EF4444":d<90?"#F59E0B":"#10B981";
        return(
          <div key={item.id} style={{background:"#0D1524",border:`1px solid ${d<30?"rgba(239,68,68,0.4)":d<90?"rgba(245,158,11,0.3)":"#1A2640"}`,borderRadius:15,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:11}}>
              <div style={{width:42,height:42,borderRadius:11,background:cat.dim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{item.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:"#EFF6FF"}}>{item.name}</div>
                <div style={{fontSize:11,color:cat.color,marginTop:1}}>{cat.icon} {item.provider}</div>
              </div>
              <Badge n={d}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:10}}>
              {[["FRIST",new Date(item.deadline).toLocaleDateString("de-CH"),null],["CHF/JAHR",`CHF ${item.price*12}`,null],["NOCH",d>0?`${d}T`:"–",bc]].map(([l,v,c])=>(
                <div key={l} style={{background:"#111D30",borderRadius:8,padding:"7px 9px"}}>
                  <div style={{fontSize:9,color:"#4B6082",fontWeight:700}}>{l}</div>
                  <div style={{fontSize:12,fontWeight:700,marginTop:2,color:c||"#EFF6FF"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{height:5,background:"#111D30",borderRadius:3}}><div style={{height:"100%",width:`${pct}%`,background:bc,borderRadius:3}}/></div>
            {item.notes?<div style={{marginTop:9,fontSize:12,color:"#4B6082",background:"#111D30",borderRadius:8,padding:"7px 10px"}}>📝 {item.notes}</div>:null}
          </div>
        );
      })}
    </div>
  );
}

function Vergleich({items}){
  const [cat,setCat]=useState("mobile");
  const data=COMPARE[cat];
  const sorted=[...data].sort((a,b)=>a.price-b.price);
  const diff=sorted[sorted.length-1].price-sorted[0].price;
  const cc=CATS[cat];
  const mine=items.find(i=>i.cat===cat);
  return(
    <div style={{padding:15,display:"flex",flexDirection:"column",gap:13}}>
      <div style={{display:"flex",gap:7}}>
        {Object.entries(CATS).map(([k,v])=>(
          <button key={k} onClick={()=>setCat(k)} style={{flex:1,padding:"9px 5px",borderRadius:11,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${cat===k?v.color+"88":"#1A2640"}`,background:cat===k?v.dim:"#0D1524",color:cat===k?v.color:"#4B6082",fontWeight:700,fontSize:11}}>{v.icon}<br/>{v.label.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:13,padding:13,textAlign:"center"}}>
        <div style={{fontSize:11,color:"#10B981",fontWeight:700}}>💡 Preisunterschied im Markt</div>
        <div style={{fontSize:28,fontWeight:900,color:"#10B981",marginTop:3}}>CHF {diff}/Monat</div>
        <div style={{fontSize:11,color:"#4B6082",marginTop:2}}>= CHF {diff*12} pro Jahr</div>
      </div>
      {mine&&<div style={{background:cc.dim,border:`1px solid ${cc.color}44`,borderRadius:11,padding:11,display:"flex",alignItems:"center",gap:9}}>
        <span style={{fontSize:19}}>{mine.icon}</span>
        <div><div style={{fontSize:10,color:cc.color,fontWeight:700}}>DEIN AKTUELLES ABO</div><div style={{fontSize:14,fontWeight:700,color:"#EFF6FF",marginTop:1}}>{mine.provider} · CHF {mine.price}/Mo{mine.extra?` · ${mine.extra}`:""}</div></div>
      </div>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {sorted.map((p,i)=>{
          const cheap=i===0;
          const ismine=mine&&mine.provider===p.name;
          const saves=mine&&!ismine&&p.price<mine.price;
          return(
            <div key={p.name} style={{background:"#0D1524",border:`1px solid ${cheap?"rgba(16,185,129,0.4)":ismine?cc.color+"44":"#1A2640"}`,borderRadius:13,padding:13,display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:34,height:34,borderRadius:9,background:cheap?"rgba(16,185,129,0.15)":"#111D30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:cheap?"#10B981":"#4B6082",flexShrink:0}}>#{i+1}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontWeight:700,fontSize:14,color:"#EFF6FF"}}>{p.name}</span>
                  {p.tag&&<span style={{fontSize:10,background:"rgba(99,102,241,0.15)",color:"#6366F1",padding:"2px 7px",borderRadius:20}}>{p.tag}</span>}
                  {ismine&&<span style={{fontSize:10,background:cc.dim,color:cc.color,padding:"2px 7px",borderRadius:20}}>Deins</span>}
                </div>
                <div style={{fontSize:11,color:"#4B6082",marginTop:2}}>📦 {p.extra} · {"★".repeat(Math.round(p.rating))}{"☆".repeat(5-Math.round(p.rating))}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:17,fontWeight:800,color:cheap?"#10B981":"#EFF6FF"}}>CHF {p.price}</div>
                <div style={{fontSize:10,color:"#4B6082"}}>/Mo</div>
                {saves&&<div style={{fontSize:10,color:"#10B981",fontWeight:700}}>-CHF {mine.price-p.price}/Mo</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Chat({items}){
  const [msgs,setMsgs]=useState([{role:"assistant",text:"Hallo! 👋 Ich kenne deine Verträge und helfe dir bei:\n\n• Kündigungsfristen\n• Günstigere Anbieter finden\n• Krankenkasse wechseln\n• Handy/Internet optimieren\n\n🔒 Keine Vertragsnummern eingeben!"}]);
  const [inp,setInp]=useState("");
  const [load,setLoad]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{ref.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const sum=items.length>0?items.map(i=>`- ${CATS[i.cat].label}: ${i.name} bei ${i.provider}, CHF ${i.price}/Mo${i.extra?`, ${i.extra}`:""}, Frist: ${i.deadline}`).join("\n"):"Keine Einträge.";
  const send=async()=>{
    if(!inp.trim()||load)return;
    const t=inp.trim();setInp("");
    const nm=[...msgs,{role:"user",text:t}];setMsgs(nm);setLoad(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`Schweizer Abo- & Versicherungsberater. Nutzer hat:\n${sum}\n\nAntworte Deutsch, kurz, max 120 Wörter, freundlich. Keine Vertragsnummern erfragen.`,messages:nm.slice(1).map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}))})});
      const d=await r.json();
      setMsgs(p=>[...p,{role:"assistant",text:d.content?.map(b=>b.text||"").join("")||"Fehler."}]);
    }catch{setMsgs(p=>[...p,{role:"assistant",text:"Verbindungsfehler."}]);}
    setLoad(false);
  };
  const qs=["Wo sparen?","Handy kündigen?","Bestes Internet?","Krankenkasse wechseln?"];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 155px)"}}>
      <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:11}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:7}}>
            {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:9,background:"rgba(99,102,241,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>✦</div>}
            <div style={{maxWidth:"80%",padding:"10px 13px",lineHeight:1.55,borderRadius:m.role==="user"?"17px 17px 4px 17px":"4px 17px 17px 17px",background:m.role==="user"?"#6366F1":"#0D1524",border:m.role==="assistant"?"1px solid #1A2640":"none",fontSize:14,color:"#EFF6FF",whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>
        ))}
        {load&&<div style={{display:"flex",gap:7,alignItems:"flex-end"}}><div style={{width:28,height:28,borderRadius:9,background:"rgba(99,102,241,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✦</div><div style={{background:"#0D1524",border:"1px solid #1A2640",borderRadius:"4px 17px 17px 17px",padding:"11px 14px",display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#4B6082",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}</div></div>}
        <div ref={ref}/>
      </div>
      <div style={{padding:"6px 12px",display:"flex",gap:6,flexWrap:"wrap",borderTop:"1px solid #1A2640"}}>
        {qs.map(q=><button key={q} onClick={()=>setInp(q)} style={{background:"#111D30",border:"none",color:"#4B6082",padding:"5px 10px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>)}
      </div>
      <div style={{padding:"10px 13px 16px",display:"flex",gap:7}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Frage stellen..." style={{flex:1,background:"#111D30",border:"1px solid #1A2640",borderRadius:22,padding:"10px 15px",color:"#EFF6FF",fontSize:14,outline:"none",fontFamily:"inherit"}}/>
        <button onClick={send} disabled={!inp.trim()||load} style={{background:"#6366F1",border:"none",borderRadius:22,width:44,height:44,color:"white",fontSize:17,cursor:"pointer",opacity:!inp.trim()||load?0.4:1,flexShrink:0}}>➤</button>
      </div>
    </div>
  );
}

export default function App(){
  const [tab,setTab]=useState("home");
  const [items,setItems]=useState(DEFAULT);
  const urg=items.filter(i=>{const d=days(i.deadline);return d>0&&d<60;}).length;
  const nav=[{id:"home",icon:"⊞",label:"Übersicht"},{id:"fristen",icon:"⏰",label:"Fristen"},{id:"vergleich",icon:"⚖",label:"Vergleich"},{id:"chat",icon:"✦",label:"KI-Chat"}];
  return(
    <div style={{background:"#060B14",minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",fontFamily:"'DM Sans',system-ui,sans-serif",color:"#EFF6FF"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,700;9..40,800;9..40,900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:0}input,select,button{font-family:inherit}input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5)}@keyframes pulse{0%,100%{opacity:.3;transform:scale(.85)}50%{opacity:1;transform:scale(1.1)}}`}</style>
      <div style={{padding:"16px 16px 11px",background:"#060B14",borderBottom:"1px solid #1A2640",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:18,fontWeight:900,letterSpacing:-0.5}}>{{home:"Meine Verträge",fristen:"Kündigungsfristen",vergleich:"Vergleich",chat:"KI-Berater"}[tab]}</div>
            <div style={{fontSize:11,color:"#4B6082",marginTop:1}}>{{home:`${items.length} Abos & Versicherungen`,fristen:"Alle Vertragsenden",vergleich:"Schweizer Anbieter",chat:"Privat & lokal 🔒"}[tab]}</div>
          </div>
          <div style={{position:"relative"}}>
            <div style={{width:38,height:38,borderRadius:11,background:"#111D30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🔔</div>
            {urg>0&&<div style={{position:"absolute",top:-4,right:-4,width:17,height:17,borderRadius:"50%",background:"#EF4444",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #060B14",color:"white"}}>{urg}</div>}
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:85}}>
        {tab==="home"&&<Home items={items} setItems={setItems}/>}
        {tab==="fristen"&&<Fristen items={items}/>}
        {tab==="vergleich"&&<Vergleich items={items}/>}
        {tab==="chat"&&<Chat items={items}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(13,21,36,0.96)",backdropFilter:"blur(24px)",borderTop:"1px solid #1A2640",display:"flex",padding:"9px 5px 22px",zIndex:50}}>
        {nav.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,border:"none",cursor:"pointer",fontFamily:"inherit",background:tab===n.id?"rgba(99,102,241,0.13)":"transparent",borderRadius:11,padding:"7px 3px",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:19}}>{n.icon}</span>
            <span style={{fontSize:10,fontWeight:700,color:tab===n.id?"#6366F1":"#4B6082"}}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
