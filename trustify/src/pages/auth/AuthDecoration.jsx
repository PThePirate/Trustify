import { ShieldCheck, Mail, Fingerprint, KeyRound, Sparkles, ScanLine } from "lucide-react";
import "./authDecoration.css";

export default function AuthDecoration() {
  return <div className="auth-decoration" aria-hidden="true">
    <span className="auth-light auth-light-blue" /><span className="auth-light auth-light-green" /><span className="auth-light auth-light-coral" />
    <svg className="auth-connections" viewBox="0 0 1200 1000" preserveAspectRatio="none"><path d="M-50 180 C360 -50 170 730 600 520 S1050 200 1250 800" /><path className="auth-travel" d="M-50 180 C360 -50 170 730 600 520 S1050 200 1250 800" /><path d="M-40 870 C230 500 570 1100 920 640 S1150 70 1250 150" /></svg>
    {[ShieldCheck, Mail, Fingerprint, KeyRound, Sparkles, ScanLine].map((Icon, index) => <span className={`auth-floating-object auth-object-${index}`} key={index}><Icon /></span>)}
    {Array.from({length:18}, (_, index) => <i className="auth-particle" key={index} style={{left:`${(index * 31 + 8) % 97}%`, top:`${(index * 17 + 10) % 95}%`, animationDelay:`-${index * .8}s`}} />)}
  </div>;
}
