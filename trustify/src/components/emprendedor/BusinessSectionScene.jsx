import { useLocation } from "react-router-dom";
import { Store, Package, MessageCircle, Star, LineChart, FileCheck, QrCode, CreditCard, User, Bell, LifeBuoy, Sparkles, ShieldCheck, MousePointer2, Send, Heart, TrendingUp } from "lucide-react";
import "./businessScenes.css";

const scenes = {
  editar: ["Tu escaparate digital", "Dale personalidad a tu negocio y comparte lo que haces.", Store, MousePointer2, Sparkles, "mint"],
  catalogo: ["Ideas que se convierten en productos", "Presenta tus productos y servicios con claridad.", Package, Store, Heart, "peach"],
  solicitudes: ["Aquí empiezan las conexiones", "Una conversación puede ser el comienzo de tu próximo proyecto.", MessageCircle, Send, Heart, "blue"],
  reputacion: ["La confianza se construye", "Cada experiencia cuenta en la historia de tu negocio.", Star, ShieldCheck, Heart, "gold"],
  analitica: ["Descubre cómo creces", "Observa la actividad de tu negocio y encuentra oportunidades.", LineChart, TrendingUp, MousePointer2, "blue"],
  formalizacion: ["Dale forma a tu futuro", "Avanza en la formalización de tu emprendimiento.", FileCheck, ShieldCheck, TrendingUp, "mint"],
  qr: ["Tu negocio, a un escaneo", "Conecta el mundo físico con tu perfil en CheckBiz.", QrCode, Store, MousePointer2, "violet"],
  planes: ["Espacio para tus próximos pasos", "Encuentra el plan que acompaña a tu negocio.", CreditCard, TrendingUp, Sparkles, "gold"],
  perfil: ["Una identidad con personalidad", "Tu perfil también cuenta quién está detrás del negocio.", User, Heart, ShieldCheck, "violet"],
  notificaciones: ["Mantente cerca de tu comunidad", "Encuentra aquí las novedades de tu cuenta.", Bell, MessageCircle, Send, "peach"],
  ayuda: ["No estás solo en este camino", "Encuentra orientación para aprovechar tu panel.", LifeBuoy, MessageCircle, ShieldCheck, "blue"],
};
const fallback = ["Tu negocio tiene mucho por contar", "Construye tu presencia, conecta y haz crecer la confianza.", Store, TrendingUp, Star, "mint"];

export default function BusinessSectionScene() {
  const { pathname } = useLocation();
  const [title, description, Main, Secondary, Third, tone] = scenes[pathname.split("/")[2]] || fallback;
  return <section className={`business-scene scene-${tone}`}>
    <div className="business-scene-copy"><span className="business-scene-sign"><Sparkles size={15} /> Hecho para tu emprendimiento</span><h2>{title}</h2><p>{description}</p></div>
    <div className="business-scene-art" aria-hidden="true">
      <div className="scene-orbit scene-orbit-one" /><div className="scene-orbit scene-orbit-two" />
      <svg className="scene-connections" viewBox="0 0 400 200"><path d="M45 150 C100 150 100 50 190 75 S280 165 360 50" /><path d="M35 50 Q200 210 370 120" /></svg>
      <div className="scene-object scene-object-main"><Main strokeWidth={1.25} /><div className="scene-object-lines"><i /><i /><i /></div></div>
      <span className="scene-object scene-object-secondary"><Secondary /></span><span className="scene-object scene-object-third"><Third /></span>
      <span className="scene-chip"><ShieldCheck size={17} /> CheckBiz</span>
      {Array.from({ length: 8 }, (_, i) => <i key={i} className={`scene-confetti confetti-${i}`} />)}
    </div>
  </section>;
}
