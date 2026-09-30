import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PublicNav from "@/components/layout/PublicNav";
import PublicFooter from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/button";
import { listarUniversidades } from "@/services/alumniApi";
import "./planes.css";
import PlansDecoration from "@/components/public/PlansDecoration";
const API = import.meta.env.VITE_API_URL || "/api";
const LEVELS = ["Bronze", "Silver", "Gold", "Todavía no sé"];
const AREAS = ["Emprendimiento", "Vinculación con la sociedad", "Bienestar estudiantil", "Seguimiento a graduados", "Rectorado o vicerrectorado", "Otra"];
export default function SolicitarReunionPage() {
  const [params] = useSearchParams();
  const [form,setForm] = useState({nombre:"",cargo:"",universidad:"",otraUniversidad:"",area:"",correo:"",telefono:"",nivel:LEVELS.includes(params.get("nivel")) ? params.get("nivel") : "Todavía no sé",estudiantes:"",modalidad:"",mensaje:"",privacidad:false});
  const [universidades,setUniversidades] = useState([]);
  const [token,setToken] = useState(""); const [error,setError] = useState(""); const [busy,setBusy] = useState(false); const [done,setDone] = useState(false);
  const widget = useRef(null); const widgetId = useRef(null);
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  useEffect(() => { listarUniversidades().then(setUniversidades).catch(() => setUniversidades([])); }, []);
  useEffect(() => {
    if (!sitekey || done) return;
    let active = true;
    const render = () => { if(active && window.turnstile && widget.current && widgetId.current === null) widgetId.current = window.turnstile.render(widget.current,{sitekey,action:"meeting",callback:setToken,"expired-callback":()=>setToken(""),"error-callback":()=>{setToken("");setError("No se pudo completar la protección. Recarga la página para reintentar.");}}); };
    let script = document.querySelector('script[data-meeting-turnstile]');
    if(!script) { script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.dataset.meetingTurnstile="true";document.head.appendChild(script); }
    script.addEventListener("load",render); render();
    return () => {active=false;script.removeEventListener("load",render);if(widgetId.current !== null && window.turnstile){window.turnstile.remove(widgetId.current);widgetId.current=null;}};
  },[sitekey,done]);
  const change = e => setForm(f=>({...f,[e.target.name]:e.target.type === "checkbox" ? e.target.checked : e.target.value}));
  async function submit(e) {
    e.preventDefault(); if(busy) return; setError(""); setBusy(true);
    try { const response=await fetch(`${API}/reuniones`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,universidad:form.universidad === "Otra" ? form.otraUniversidad.trim() : form.universidad,turnstileToken:token}),signal:AbortSignal.timeout(45000)}); const data=await response.json(); if(!response.ok) throw new Error(data.mensaje || "No se pudo enviar la solicitud.");setDone(true); }
    catch(err) {setError(err.name === "TimeoutError" ? "El envío tardó demasiado. Inténtalo de nuevo." : err.message);setToken("");if(window.turnstile && widgetId.current !== null) window.turnstile.reset(widgetId.current);}
    finally {setBusy(false);}
  }
  const input=(name,label,required=false,type="text")=><label className="meeting-field">{label}{required ? " *" : " (opcional)"}<input name={name} type={type} required={required} maxLength={name === "correo" ? 254 : 150} value={form[name]} onChange={change} /></label>;
  const select=(name,label,options,required=false)=><label className="meeting-field">{label}{required ? " *" : " (opcional)"}<select name={name} required={required} value={form[name]} onChange={change}><option value="">Selecciona una opción</option>{options.map(value=><option key={value}>{value}</option>)}</select></label>;
  return <div className="plans-page meeting-experience"><PublicNav /><PlansDecoration /><main className="container pb-20 pt-32"><Link to="/planes#planes-universidades" className="text-trust">← Volver a los planes</Link><section className="meeting-card">
    {done ? <div role="status"><h1>Solicitud recibida</h1><p>Gracias, te escribiremos en los próximos 2 días hábiles para coordinar la reunión.</p><p>Enviamos una copia a tu correo.</p><Button asChild className="mt-6"><Link to="/universidades">Conocer el panel institucional</Link></Button></div> : <><h1>Solicitar una reunión</h1><p>Cuéntanos sobre tu universidad para ayudarte a elegir un convenio. Los campos con * son obligatorios.</p><form onSubmit={submit}>
      <fieldset disabled={busy} className="meeting-grid"><legend className="sr-only">Datos de la solicitud</legend>{input("nombre","Nombre completo",true)}{input("cargo","Cargo",true)}{select("universidad","Universidad",[...universidades.map(u=>u.nombre),"Otra"],true)}{form.universidad === "Otra" && input("otraUniversidad","Nombre de la universidad",true)}{select("area","Área o unidad",AREAS,true)}{input("correo","Correo institucional",true,"email")}{input("telefono","Teléfono",false,"tel")}{form.correo.includes("@") && !form.correo.toLowerCase().endsWith(".edu.ec") && <p className="meeting-wide text-sm text-trust" role="status">Tu correo no termina en .edu.ec. Puedes continuar; confirmaremos el vínculo institucional al contactarte.</p>}{select("nivel","Nivel que te interesa",LEVELS)}{select("estudiantes","Estudiantes emprendedores estimados",["Menos de 100","100 a 200","Más de 200","No sé"])}{select("modalidad","Modalidad de reunión",["Presencial","Virtual"])}<label className="meeting-field meeting-wide">Mensaje (opcional)<textarea name="mensaje" maxLength={2000} rows={4} value={form.mensaje} onChange={change} /></label><label className="meeting-wide flex items-start gap-3"><input name="privacidad" type="checkbox" required checked={form.privacidad} onChange={change} /><span>Acepto la Política de Privacidad. <a href="#privacidad-reunion" className="underline text-trust">Leer cómo usamos estos datos</a></span></label></fieldset>
      <details id="privacidad-reunion" className="my-5"><summary>Privacidad de esta solicitud</summary><p>Usaremos tus datos para responder a tu solicitud y coordinar la reunión. No se publicarán en el directorio. Para consultar o solicitar la eliminación de esta información, escribe a hola@checkbiz.ec.</p></details><div ref={widget} />{!sitekey && <p className="text-sm text-muted-foreground">El envío todavía no está habilitado. Puedes solicitar la reunión escribiendo a <a href="mailto:hola@checkbiz.ec" className="underline">hola@checkbiz.ec</a>.</p>}{error && <p role="alert" className="my-4 text-danger">{error}</p>}<Button type="submit" variant="trust" size="lg" className="mt-5" disabled={busy || !token}>{busy ? "Enviando…" : "Enviar solicitud"}</Button>
    </form></>}
  </section></main><PublicFooter /></div>;
}

