import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ClienteSection({ icon: Icon, eyebrow, title, description, action, children }) {
  return <div className="client-extra mx-auto max-w-5xl">
    <header className="client-extra-hero">
      <span className="client-extra-icon"><Icon className="size-7" /></span>
      <div><span className="client-extra-eyebrow">{eyebrow}</span><h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1><p>{description}</p></div>
      {action && <Link to={action.to} className="client-extra-action">{action.label}<ArrowRight className="size-4" /></Link>}
    </header>
    {children}
  </div>;
}
