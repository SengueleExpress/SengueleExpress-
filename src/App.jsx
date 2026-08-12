import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Package,
  CreditCard,
  User,
  MessageCircle,
  LogOut,
  ChevronLeft,
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  MoreVertical,
  Share2,
  Flag,
  Mail,
  MapPin,
  Send,
  Phone,
  UserPlus,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  TEMA — Fundo branco, letras douradas e pretas                        */
/* ---------------------------------------------------------------------- */

const GOLD = "#C9A227"; // dourado legível sobre branco (textos, ícones)
const GOLD_BRIGHT = "#D4AF37"; // dourado de destaque (botões, emblema)
const GOLD_SOFT = "#E9DDB0"; // dourado claro (bordas, fundos suaves)
const INK = "#0D0D0D"; // preto principal
const GRAY = "#6B6B70"; // texto secundário

const WHATSAPP_NUMBER = "244951077875";
const WHATSAPP_MESSAGE = "Olá! Preciso de ajuda com a minha conta na SengueleExpress.";
const openWhatsAppSupport = () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

/* ---------------------------------------------------------------------- */
/*  DADOS SIMULADOS                                                       */
/* ---------------------------------------------------------------------- */

const CATEGORIES = ["Todas", "Moda Feminina", "Eletrónicos", "Zara & Shein", "Calçados"];

const CARTS = [
  {
    id: "c1",
    organizer: "SengueleExpress - Agente Visa",
    initials: "SE",
    title: "Carrinho da Shein - Brisa de Agosto",
    category: "Zara & Shein",
    accumulated: 122573,
    goal: 130000,
    fee: 1100,
    deadline: "05/08/2026",
    rate: 1100.0,
  },
  {
    id: "c2",
    organizer: "SengueleExpress - Agente Visa",
    initials: "SE",
    title: "Carrinho da Zara - Outono",
    category: "Moda Feminina",
    accumulated: 64200,
    goal: 150000,
    fee: 1100,
    deadline: "18/08/2026",
    rate: 1100.0,
  },
  {
    id: "c3",
    organizer: "SengueleExpress - Agente Visa",
    initials: "SE",
    title: "Carrinho do AliExpress",
    category: "Eletrónicos",
    accumulated: 98500,
    goal: 120000,
    fee: 950,
    deadline: "12/08/2026",
    rate: 1100.0,
  },
  {
    id: "c4",
    organizer: "SengueleExpress - Agente Visa",
    initials: "SE",
    title: "Carrinho da Amazon - Casa & Tech",
    category: "Eletrónicos",
    accumulated: 41000,
    goal: 100000,
    fee: 1200,
    deadline: "22/08/2026",
    rate: 1100.0,
  },
  {
    id: "c5",
    organizer: "SengueleExpress - Agente Visa",
    initials: "SE",
    title: "Carrinho de Calçados - Nike & Adidas",
    category: "Calçados",
    accumulated: 75300,
    goal: 90000,
    fee: 1000,
    deadline: "09/08/2026",
    rate: 1100.0,
  },
];

const PAYMENTS_PENDING = [
  { id: "p1", title: "Carrinho da Shein - Brisa de Agosto", amount: 47850, closedAt: "05/08/2026" },
];

const PAYMENTS_DONE = [
  { id: "p2", title: "Carrinho do AliExpress - Julho", amount: 32100, paidAt: "22/07/2026" },
  { id: "p3", title: "Carrinho da Zara - Verão", amount: 58900, paidAt: "03/07/2026" },
];

const ORDERS = [
  {
    id: "o1",
    product: "Vestido midi floral",
    cartTitle: "Carrinho da Shein - Brisa de Agosto",
    amount: 47850,
    status: "Em análise",
    date: "08/08/2026",
  },
  {
    id: "o2",
    product: "Ténis Nike Air",
    cartTitle: "Carrinho de Calçados - Nike & Adidas",
    amount: 62000,
    status: "Aprovado",
    date: "02/08/2026",
  },
  {
    id: "o3",
    product: "Fones Bluetooth",
    cartTitle: "Carrinho do AliExpress - Julho",
    amount: 18500,
    status: "Entregue",
    date: "20/07/2026",
  },
];

const ORDER_STATUS_STYLE = {
  "Em análise": { bg: "rgba(201,162,39,0.12)", color: "#9C7D1D" },
  Aprovado: { bg: "rgba(22,163,74,0.1)", color: "#16A34A" },
  Entregue: { bg: "rgba(107,107,112,0.1)", color: "#6B6B70" },
};

const kz = (n) => n.toLocaleString("pt-AO", { maximumFractionDigits: 0 }) + " Kz";

/* ---------------------------------------------------------------------- */
/*  ELEMENTOS PARTILHADOS                                                 */
/* ---------------------------------------------------------------------- */

function BrandMark({ size = 42 }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${GOLD_BRIGHT}, #A9821C)`,
        boxShadow: "0 2px 10px rgba(201,162,39,0.35)",
      }}
    >
      <span
        style={{
          color: INK,
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: size * 0.46,
          lineHeight: 1,
        }}
      >
        S
      </span>
    </div>
  );
}

function StatusBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
      style={{ background: "rgba(22,163,74,0.1)", color: "#16A34A" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#16A34A" }} />
      Aberto
    </span>
  );
}

function KebabMenu({ options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Mais detalhes"
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        style={{ background: open ? "rgba(201,162,39,0.22)" : "rgba(201,162,39,0.12)" }}
      >
        <MoreVertical size={17} style={{ color: GOLD }} strokeWidth={2.5} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden z-20 py-1.5 shadow-lg"
          style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}` }}
        >
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                opt.onClick?.();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] hover:bg-[#FAF6E9] transition-colors"
              style={{ color: INK }}
            >
              <opt.icon size={15} style={{ color: GOLD }} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OrganizerRow({ cart, showKebab = false }) {
  const kebabOptions = [
    { label: "Partilhar carrinho", icon: Share2, onClick: () => {} },
    { label: "Reportar problema", icon: Flag, onClick: () => {} },
  ];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: `linear-gradient(135deg, ${GOLD_BRIGHT}, #A9821C)`, color: INK }}
      >
        {cart.initials}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] truncate" style={{ color: INK, opacity: 0.85 }}>
          {cart.organizer}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <StatusBadge />
        {showKebab && <KebabMenu options={kebabOptions} />}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] mb-1.5" style={{ color: GRAY }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  CRIAR CONTA                                                           */
/* ---------------------------------------------------------------------- */

function AuthScreen({ onCreateAccount }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [touched, setTouched] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const emailValid = /\S+@\S+\.\S+/.test(form.email);
  const canSubmit = form.firstName.trim() && form.lastName.trim() && emailValid && form.phone.trim();

  const handleSubmit = () => {
    setTouched(true);
    if (!canSubmit) return;
    onCreateAccount(form);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-5 py-10"
      style={{ background: "#FFFFFF" }}
    >
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex flex-col items-center mb-8">
          <BrandMark size={64} />
          <p
            className="mt-4 text-[20px] tracking-[0.14em] font-semibold text-center"
            style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}
          >
            SENGUELE EXPRESS
          </p>
          <p className="text-[12.5px] mt-1" style={{ color: GRAY }}>
            Encomendas internacionais · Angola
          </p>
        </div>

        <div
          className="rounded-[20px] p-5 space-y-4"
          style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <UserPlus size={17} style={{ color: GOLD }} />
            <p className="text-[13px] tracking-[0.1em] font-semibold" style={{ color: GOLD }}>
              CRIAR CONTA
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome">
              <input value={form.firstName} onChange={update("firstName")} placeholder="Liandra" className="input-field" />
            </Field>
            <Field label="Sobrenome">
              <input value={form.lastName} onChange={update("lastName")} placeholder="Senguele" className="input-field" />
            </Field>
          </div>

          <Field label="Email">
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: GRAY }} />
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="oteuemail@exemplo.com"
                className="input-field pl-9"
              />
            </div>
            {touched && !emailValid && (
              <p className="text-[11px] mt-1.5" style={{ color: "#B3261E" }}>
                Introduz um email válido.
              </p>
            )}
          </Field>

          <Field label="Número de telefone">
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: GRAY }} />
              <input
                value={form.phone}
                onChange={update("phone")}
                placeholder="+244 9XX XXX XXX"
                className="input-field pl-9"
              />
            </div>
          </Field>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-full text-[14px] font-semibold transition-transform active:scale-[0.98]"
            style={{ background: GOLD_BRIGHT, color: INK }}
          >
            Criar conta e continuar
          </button>

          <p className="text-[11.5px] text-center" style={{ color: GRAY }}>
            Ao criar conta, aceitas receber confirmações das tuas encomendas por email.
          </p>
        </div>

        <button
          onClick={() => onCreateAccount({ firstName: "Liandra", lastName: "Senguele", email: "mariasenguele@gmail.com", phone: "+244 9XX XXX XXX", skipped: true })}
          className="w-full text-center text-[12.5px] mt-5"
          style={{ color: GRAY }}
        >
          Já tens conta? <span style={{ color: GOLD, fontWeight: 600 }}>Entrar</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  CABEÇALHO + MENU LATERAL                                              */
/* ---------------------------------------------------------------------- */

function Header({ onOpenDrawer }) {
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.92)", borderBottom: `1px solid ${GOLD_SOFT}` }}
    >
      <div className="flex items-center justify-between px-4 py-3.5 max-w-lg mx-auto">
        <button onClick={onOpenDrawer} className="p-2 -ml-2 rounded-full hover:bg-[#FAF6E9] transition-colors" aria-label="Abrir menu">
          <Menu size={22} style={{ color: GOLD }} />
        </button>
        <div className="flex items-center gap-2.5">
          <BrandMark size={30} />
          <p
            className="text-[14px] tracking-[0.16em] font-semibold"
            style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}
          >
            SENGUELE EXPRESS
          </p>
        </div>
        <div className="w-9" />
      </div>
    </header>
  );
}

function Drawer({ open, onClose, screen, setScreen, profile }) {
  const items = [
    { key: "explore", icon: ShoppingBag, label: "Explorar Carrinhos" },
    { key: "orders", icon: Package, label: "Minhas Encomendas" },
    { key: "payments", icon: CreditCard, label: "Meus Pagamentos" },
    { key: "profile", icon: User, label: "Meu Perfil" },
    { key: "support", icon: MessageCircle, label: "Contactar Suporte" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[78%] max-w-[300px] flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#FFFFFF", borderRight: `1px solid ${GOLD_SOFT}` }}
      >
        <div
          className="flex items-center justify-between px-5 pt-6 pb-5"
          style={{ borderBottom: `1px solid ${GOLD_SOFT}` }}
        >
          <div className="flex items-center gap-2.5">
            <BrandMark size={32} />
            <p className="text-[13px] tracking-[0.12em] font-semibold" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
              SENGUELE EXPRESS
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#FAF6E9]" aria-label="Fechar menu">
            <X size={18} style={{ color: GRAY }} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => {
                if (key === "support") {
                  openWhatsAppSupport();
                } else if (["explore", "orders", "payments", "profile"].includes(key)) {
                  setScreen(key);
                }
                onClose();
              }}
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[14px] transition-colors"
              style={
                screen === key
                  ? { background: "rgba(201,162,39,0.1)", color: "#9C7D1D", fontWeight: 600 }
                  : { color: INK, opacity: 0.8 }
              }
            >
              <Icon size={18} style={key === "support" ? { color: "#16A34A" } : undefined} />
              {label}
              {key === "support" && (
                <span className="ml-auto text-[10px]" style={{ color: GRAY }}>
                  WhatsApp ↗
                </span>
              )}
            </button>
          ))}
          <button className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[14px] transition-colors mt-2" style={{ color: GRAY }}>
            <LogOut size={18} />
            Sair
          </button>
        </nav>

        <div className="px-5 py-5 flex items-center gap-3" style={{ borderTop: `1px solid ${GOLD_SOFT}` }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `linear-gradient(135deg, ${GOLD_BRIGHT}, #A9821C)`, color: INK }}
          >
            {profile.firstName?.[0] || "L"}
          </div>
          <div>
            <p className="text-[13.5px] font-medium" style={{ color: INK }}>
              {profile.firstName}
            </p>
            <p className="text-[11.5px]" style={{ color: GRAY }}>
              Cliente
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/*  TELA 1 — EXPLORAR CARRINHOS                                           */
/* ---------------------------------------------------------------------- */

function CartCard({ cart, onOpen }) {
  const pct = Math.min(100, Math.round((cart.accumulated / cart.goal) * 100));

  return (
    <div
      className="rounded-[20px] p-4 space-y-3.5 transition-transform duration-200 hover:-translate-y-0.5 animate-fade-up"
      style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}`, boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}
    >
      <OrganizerRow cart={cart} showKebab />

      <h3 className="text-[16.5px] leading-snug" style={{ color: INK, fontFamily: "'Playfair Display', serif" }}>
        {cart.title}
      </h3>

      <div className="space-y-1.5">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F1ECD9" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, #A9821C, ${GOLD_BRIGHT})` }}
          />
        </div>
        <div className="flex justify-between text-[12px]" style={{ color: GRAY }}>
          <span>
            <span style={{ color: INK, fontWeight: 500 }}>{kz(cart.accumulated)}</span> acumulados
          </span>
          <span>Meta {kz(cart.goal)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="text-[12px] space-y-0.5" style={{ color: GRAY }}>
          <p>
            Taxa do comprador: <span style={{ color: INK, opacity: 0.85 }}>{kz(cart.fee)}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Clock size={12} /> até {cart.deadline}
          </p>
        </div>
        <button
          onClick={() => onOpen(cart)}
          className="px-4 py-2.5 rounded-full text-[13px] font-semibold transition-colors"
          style={{ background: GOLD_BRIGHT, color: INK }}
        >
          Ver carrinho
        </button>
      </div>
    </div>
  );
}

function ExploreScreen({ onOpenCart }) {
  const [category, setCategory] = useState("Todas");

  const filtered = useMemo(
    () => (category === "Todas" ? CARTS : CARTS.filter((c) => c.category === category)),
    [category]
  );

  return (
    <div className="px-4 pt-5 pb-10 max-w-lg mx-auto">
      <h1 className="text-[22px] leading-tight" style={{ color: INK, fontFamily: "'Playfair Display', serif" }}>
        Carrinhos abertos perto de ti
      </h1>
      <p className="text-[13.5px] mt-1.5 mb-5" style={{ color: GRAY }}>
        Junta-te a um carrinho de grupo e paga em Kwanzas quando fechar.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="shrink-0 px-4 py-2 rounded-full text-[12.5px] font-medium border transition-colors whitespace-nowrap"
            style={
              category === cat
                ? { background: GOLD_BRIGHT, color: INK, borderColor: GOLD_BRIGHT }
                : { background: "transparent", color: GRAY, borderColor: GOLD_SOFT }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {filtered.map((cart) => (
          <CartCard key={cart.id} cart={cart} onOpen={onOpenCart} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-[13px] py-10" style={{ color: GRAY }}>
            Ainda não há carrinhos abertos nesta categoria.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  TELA 2 — DETALHES DA META / JUNTAR-ME AO CARRINHO                     */
/* ---------------------------------------------------------------------- */

function CartDetailsScreen({ cart, onBack, clientEmail }) {
  const [productName, setProductName] = useState("");
  const [productLink, setProductLink] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const pct = Math.min(100, Math.round((cart.accumulated / cart.goal) * 100));
  const remaining = Math.max(0, cart.goal - cart.accumulated);

  const totalKz = useMemo(() => {
    const price = parseFloat(priceUSD) || 0;
    const quantity = parseInt(qty, 10) || 0;
    return price * quantity * cart.rate;
  }, [priceUSD, qty, cart.rate]);

  const canSubmit = productName.trim() && productLink.trim() && parseFloat(priceUSD) > 0 && qty > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setProductName("");
      setProductLink("");
      setPriceUSD("");
      setQty(1);
      setNote("");
    }, 2200);
  };

  return (
    <div className="px-4 pt-5 pb-12 max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] transition-colors mb-4"
        style={{ color: GRAY }}
      >
        <ChevronLeft size={16} />
        Voltar aos carrinhos
      </button>

      <div
        className="rounded-[20px] p-5 space-y-4 animate-fade-up"
        style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}`, boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[13px]" style={{ color: INK, opacity: 0.8 }}>
            {cart.organizer}
          </p>
          <div className="flex items-center gap-2">
            <StatusBadge />
            <KebabMenu
              options={[
                { label: "Partilhar carrinho", icon: Share2, onClick: () => {} },
                { label: "Reportar problema", icon: Flag, onClick: () => {} },
              ]}
            />
          </div>
        </div>

        <h2 className="text-[19px] leading-snug" style={{ color: INK, fontFamily: "'Playfair Display', serif" }}>
          {cart.title}
        </h2>

        <div className="space-y-2">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F1ECD9" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, #A9821C, ${GOLD_BRIGHT})` }}
            />
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[26px] font-semibold" style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}>
              {pct}%
            </span>
            <span className="text-[12px]" style={{ color: GRAY }}>
              {kz(cart.accumulated)} de {kz(cart.goal)}
            </span>
          </div>
          <p className="text-[13px]" style={{ color: INK, opacity: 0.85 }}>
            Faltam <span style={{ color: GOLD, fontWeight: 600 }}>{kz(remaining)}</span> para fechar este carrinho
          </p>
        </div>

        <div className="pt-3 flex items-center justify-between text-[12.5px]" style={{ borderTop: `1px solid ${GOLD_SOFT}` }}>
          <span style={{ color: GRAY }}>Câmbio do comprador</span>
          <span style={{ color: INK, opacity: 0.85 }}>{cart.rate.toFixed(2)} Kz/USD</span>
        </div>
      </div>

      <div
        className="rounded-[20px] p-5 mt-5 space-y-4"
        style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}`, boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}
      >
        <p className="text-[13px] tracking-[0.12em] font-semibold" style={{ color: GOLD }}>
          JUNTAR-ME A ESTE CARRINHO
        </p>

        <Field label="Nome do produto">
          <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Vestido midi floral" className="input-field" />
        </Field>

        <Field label="Link do produto">
          <div className="relative">
            <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: GRAY }} />
            <input
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              placeholder="Cola o link da Shein, Zara, Amazon, AliExpress"
              className="input-field pl-9"
            />
          </div>
          <p className="text-[11.5px] mt-1.5" style={{ color: GRAY }}>
            Vai à loja, encontra o produto, e copia o link da página dele para aqui.
          </p>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Preço estimado (USD)">
            <input type="number" min="0" step="0.01" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} placeholder="0.00" className="input-field" />
          </Field>
          <Field label="Qtd">
            <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className="input-field" />
          </Field>
        </div>
        <p className="text-[11.5px] -mt-2.5" style={{ color: GRAY }}>
          O preço que aparece na página do produto, em USD.
        </p>

        <div className="rounded-2xl p-4 space-y-1" style={{ background: "rgba(201,162,39,0.08)", border: `1px solid ${GOLD_SOFT}` }}>
          <p className="text-[11.5px]" style={{ color: GRAY }}>
            Total a pagar em Kwanzas
          </p>
          <p className="text-[24px] font-semibold" style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}>
            {kz(Math.round(totalKz))}
          </p>
          <p className="text-[11px]" style={{ color: GRAY }}>
            Impostos, taxas e entrega já incluídos.
          </p>
        </div>

        <Field label="Observação (opcional)">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tamanho M, Cor Preta" className="input-field" />
        </Field>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-3.5 rounded-full text-[14px] font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            background: canSubmit ? GOLD_BRIGHT : "#F1ECD9",
            color: canSubmit ? INK : "#B5AA80",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          {sent ? (
            <>
              <CheckCircle2 size={16} /> Enviado!
            </>
          ) : (
            "Enviar produto para o carrinho"
          )}
        </button>

        <p className="text-[11.5px] text-center pt-1" style={{ color: GRAY }}>
          A equipa da SengueleExpress analisa o teu pedido antes de avançar com a compra.
        </p>

        {sent && (
          <div
            className="flex items-center gap-2.5 rounded-2xl px-4 py-3 animate-fade-up"
            style={{ background: "rgba(201,162,39,0.08)", border: `1px solid ${GOLD_SOFT}` }}
          >
            <Send size={15} style={{ color: GOLD }} className="shrink-0" />
            <p className="text-[12px]" style={{ color: INK, opacity: 0.85 }}>
              Confirmação enviada para <span style={{ color: GOLD, fontWeight: 600 }}>{clientEmail}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  TELA — MINHAS ENCOMENDAS                                              */
/* ---------------------------------------------------------------------- */

function OrdersScreen({ clientEmail }) {
  return (
    <div className="px-4 pt-5 pb-12 max-w-lg mx-auto">
      <h1 className="text-[22px] leading-tight" style={{ color: INK, fontFamily: "'Playfair Display', serif" }}>
        Minhas Encomendas
      </h1>
      <p className="text-[13.5px] mt-1.5 mb-2" style={{ color: GRAY }}>
        Acompanha o estado dos teus produtos dentro dos carrinhos.
      </p>
      <p className="text-[11.5px] mb-6 flex items-center gap-1.5" style={{ color: GRAY }}>
        <Mail size={12} style={{ color: GOLD }} />
        Notificamos automaticamente <span style={{ color: INK, opacity: 0.8 }}>{clientEmail}</span> a cada atualização.
      </p>

      <div className="space-y-3">
        {ORDERS.map((o) => {
          const s = ORDER_STATUS_STYLE[o.status];
          return (
            <div
              key={o.id}
              className="rounded-[20px] p-4 animate-fade-up"
              style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}`, boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] truncate" style={{ color: INK }}>
                    {o.product}
                  </p>
                  <p className="text-[11.5px] mt-0.5 truncate" style={{ color: GRAY }}>
                    {o.cartTitle}
                  </p>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.color }}>
                  {o.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 text-[12px]" style={{ borderTop: `1px solid ${GOLD_SOFT}` }}>
                <span style={{ color: GRAY }}>{o.date}</span>
                <span style={{ color: INK, opacity: 0.85, fontWeight: 500 }}>{kz(o.amount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  TELA 3 — MEUS PAGAMENTOS                                              */
/* ---------------------------------------------------------------------- */

function PaymentsScreen() {
  return (
    <div className="px-4 pt-5 pb-12 max-w-lg mx-auto">
      <h1 className="text-[22px] leading-tight" style={{ color: INK, fontFamily: "'Playfair Display', serif" }}>
        Os teus pagamentos
      </h1>
      <p className="text-[13.5px] mt-1.5 mb-6" style={{ color: GRAY }}>
        Envia o comprovativo dos carrinhos à espera de pagamento.
      </p>

      <section className="mb-7">
        <p className="text-[12.5px] tracking-[0.12em] font-semibold mb-3" style={{ color: GOLD }}>
          AGUARDAM PAGAMENTO
        </p>
        <div className="space-y-3">
          {PAYMENTS_PENDING.map((p) => (
            <div
              key={p.id}
              className="rounded-[20px] p-4 flex items-center justify-between"
              style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}`, boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}
            >
              <div>
                <p className="text-[14px]" style={{ color: INK }}>{p.title}</p>
                <p className="text-[12px] mt-0.5" style={{ color: GRAY }}>
                  Fechou em {p.closedAt} · {kz(p.amount)}
                </p>
              </div>
              <button className="px-3.5 py-2 rounded-full text-[12px] font-semibold shrink-0" style={{ background: GOLD_BRIGHT, color: INK }}>
                Anexar
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[12.5px] tracking-[0.12em] font-semibold mb-3" style={{ color: GRAY }}>
          PAGOS
        </p>
        <div className="space-y-3">
          {PAYMENTS_DONE.map((p) => (
            <div
              key={p.id}
              className="rounded-[20px] p-4 flex items-center justify-between opacity-90"
              style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}` }}
            >
              <div>
                <p className="text-[14px]" style={{ color: INK }}>{p.title}</p>
                <p className="text-[12px] mt-0.5" style={{ color: GRAY }}>
                  Pago em {p.paidAt} · {kz(p.amount)}
                </p>
              </div>
              <CheckCircle2 size={18} style={{ color: "#16A34A" }} className="shrink-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  TELA 4 — MEU PERFIL                                                   */
/* ---------------------------------------------------------------------- */

function ProfileScreen({ profile, setProfile }) {
  const [draft, setDraft] = useState(profile);
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));
  const emailValid = /\S+@\S+\.\S+/.test(draft.email);

  return (
    <div className="px-4 pt-5 pb-12 max-w-lg mx-auto">
      <div
        className="rounded-[20px] p-5 flex items-center gap-4 animate-fade-up"
        style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}`, boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
          style={{ background: `linear-gradient(135deg, ${GOLD_BRIGHT}, #A9821C)`, color: INK }}
        >
          {draft.firstName?.[0] || "L"}
        </div>
        <div>
          <h2 className="text-[18px]" style={{ color: INK, fontFamily: "'Playfair Display', serif" }}>
            {draft.firstName} {draft.lastName}
          </h2>
          <p className="text-[12px] mt-0.5" style={{ color: GRAY }}>
            Cliente desde Julho 2026
          </p>
        </div>
      </div>

      <div
        className="rounded-[20px] p-5 mt-5 space-y-4 animate-fade-up"
        style={{ background: "#FFFFFF", border: `1px solid ${GOLD_SOFT}`, boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}
      >
        <p className="text-[13px] tracking-[0.12em] font-semibold" style={{ color: GOLD }}>
          DADOS PESSOAIS
        </p>
        <p className="text-[11.5px] -mt-2.5" style={{ color: GRAY }}>
          Estes dados são os usados no registo — verifica se estão corretos.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome">
            <input value={draft.firstName} onChange={update("firstName")} className="input-field" />
          </Field>
          <Field label="Sobrenome">
            <input value={draft.lastName} onChange={update("lastName")} className="input-field" />
          </Field>
        </div>

        <Field label="Email">
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: GRAY }} />
            <input type="email" value={draft.email} onChange={update("email")} placeholder="oteuemail@exemplo.com" className="input-field pl-9" />
          </div>
          <p className="text-[11px] mt-1.5" style={{ color: emailValid ? GRAY : "#B3261E" }}>
            {emailValid ? "Usamos este email para confirmar cada encomenda." : "Introduz um email válido para receberes as confirmações."}
          </p>
        </Field>

        <Field label="Endereço de residência">
          <div className="relative">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: GRAY }} />
            <input value={draft.address} onChange={update("address")} placeholder="Bairro, rua, município" className="input-field pl-9" />
          </div>
        </Field>

        <Field label="Telefone">
          <div className="relative">
            <input value={draft.phone} onChange={update("phone")} className="input-field pr-20" />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10.5px] font-semibold px-2 py-1 rounded-full"
              style={{ background: "rgba(22,163,74,0.1)", color: "#16A34A" }}
            >
              Verificado
            </span>
          </div>
        </Field>

        <Field label="Alterar senha">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nova senha" className="input-field" />
        </Field>

        <button
          onClick={() => {
            setProfile(draft);
            setSaved(true);
            setTimeout(() => setSaved(false), 1800);
          }}
          className="w-full py-3.5 rounded-full text-[14px] font-semibold transition-colors flex items-center justify-center gap-2"
          style={{ background: GOLD_BRIGHT, color: INK }}
        >
          {saved ? (
            <>
              <CheckCircle2 size={16} /> Guardado
            </>
          ) : (
            "Guardar alterações"
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  APP                                                                    */
/* ---------------------------------------------------------------------- */

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [screen, setScreen] = useState("explore");
  const [activeCart, setActiveCart] = useState(null);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleCreateAccount = (form) => {
    setProfile((p) => ({ ...p, ...form, address: p.address }));
    setAuthenticated(true);
  };

  const handleOpenCart = (cart) => {
    setActiveCart(cart);
    setScreen("details");
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .input-field {
          width: 100%;
          background: #FCFAF3;
          border: 1px solid ${GOLD_SOFT};
          border-radius: 14px;
          padding: 11px 14px;
          font-size: 13.5px;
          color: ${INK};
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .input-field::placeholder { color: #B5AA80; }
        .input-field:focus { border-color: ${GOLD_BRIGHT}; background: #FFFFFF; }
        .input-field:disabled { cursor: not-allowed; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.4s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up { animation: none; }
        }
      `}</style>

      {!authenticated ? (
        <AuthScreen onCreateAccount={handleCreateAccount} />
      ) : (
        <>
          <Header onOpenDrawer={() => setDrawerOpen(true)} />
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} screen={screen} setScreen={setScreen} profile={profile} />

          <main>
            {screen === "explore" && <ExploreScreen onOpenCart={handleOpenCart} />}
            {screen === "details" && activeCart && (
              <CartDetailsScreen cart={activeCart} onBack={() => setScreen("explore")} clientEmail={profile.email} />
            )}
            {screen === "orders" && <OrdersScreen clientEmail={profile.email} />}
            {screen === "payments" && <PaymentsScreen />}
            {screen === "profile" && <ProfileScreen profile={profile} setProfile={setProfile} />}
          </main>
        </>
      )}
    </div>
  );
}
