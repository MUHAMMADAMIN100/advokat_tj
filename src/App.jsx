import { useState, useEffect, useRef } from "react";
import hamzabekPhoto from "./assets/hamzabek.png";

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8681662933:AAFXjgejgixZ91iJ081huW-mx4jYgJ9m8q8";
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID"; // ВАЖНО: Получите Chat ID - отправьте /start боту, затем откройте: https://api.telegram.org/bot8681662933:AAFXjgejgixZ91iJ081huW-mx4jYgJ9m8q8/getUpdates

const NAV = [
  { id: "about", label: "О себе" },
  { id: "specs", label: "Специализация" },
  { id: "process", label: "Процесс работы" },
  { id: "reviews", label: "Отзывы" },
  { id: "contact", label: "Контакты" }
];

const SPECS = [
  { icon: "🏛️", title: "Гражданское право", desc: "Защита прав и интересов в гражданских спорах, сделках, наследстве" },
  { icon: "⚖️", title: "Уголовное право", desc: "Профессиональная защита на всех стадиях уголовного процесса" },
  { icon: "🏢", title: "Бизнес-право", desc: "Юридическое сопровождение бизнеса, договоры, споры" },
  { icon: "👨‍👩‍👧", title: "Семейное право", desc: "Разводы, алименты, раздел имущества, опека" },
  { icon: "🏗️", title: "Земельное право", desc: "Споры по земельным участкам, оформление прав" },
  { icon: "📋", title: "Арбитраж", desc: "Представительство в арбитражных судах" }
];

const PROCESS = [
  { n: 1, title: "Консультация", desc: "Анализируем вашу ситуацию и определяем стратегию" },
  { n: 2, title: "Подготовка", desc: "Собираем документы и готовим позицию" },
  { n: 3, title: "Представительство", desc: "Защищаем ваши интересы в суде" },
  { n: 4, title: "Результат", desc: "Добиваемся положительного решения" }
];

const REVIEWS = [
  { name: "Фарход М.", text: "Хамзабек помог выиграть сложное дело по наследству. Профессионал своего дела!", rating: 5 },
  { name: "Нигора С.", text: "Спасибо за помощь в разводе. Все прошло быстро и без лишних стрессов.", rating: 5 },
  { name: "Рустам А.", text: "Отличный адвокат! Решил мой бизнес-спор в мою пользу.", rating: 5 }
];

const STATS = [
  { val: "15+", label: "Лет опыта" },
  { val: "500+", label: "Выигранных дел" },
  { val: "98%", label: "Успешных кейсов" },
  { val: "24/7", label: "Поддержка" }
];

const FAQ = [
  { q: "Сколько стоит консультация?", a: "Первая консультация — бесплатная. На ней мы обсудим вашу ситуацию и определим стратегию." },
  { q: "Как долго длится судебный процесс?", a: "Срок зависит от сложности дела. В среднем гражданские дела — 2-6 месяцев, уголовные — от 6 месяцев." },
  { q: "Вы работаете по всему Таджикистану?", a: "Да, представляю интересы клиентов во всех судах Таджикистана." },
  { q: "Какие документы нужны для начала работы?", a: "На первой консультации мы определим полный список. Обычно это паспорт и документы по делу." }
];

function Reveal({ children, delay = 0, threshold = 0.2 }) {
  const [inView, setInView] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(28px)", transition: `all 0.7s cubic-bezier(.23,1,.32,1) ${delay}s` }}>
      {children}
    </div>
  );
}

function useInView(threshold = 0.3) {
  const [inView, setInView] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", desc: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const canvasRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onMouse = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pts = Array(60).fill().map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = "rgba(200,169,110,0.08)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.strokeStyle = `rgba(200,169,110,${(1 - d / 140) * 0.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const sendToTelegram = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    
    setSending(true);
    
    const message = `🔔 *Новая заявка с сайта advokat.tj*

👤 *Имя:* ${form.name}
📱 *Телефон:* ${form.phone}
📝 *Описание:* ${form.desc || 'Не указано'}

🕐 *Время:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Dushanbe' })}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: "", phone: "", desc: "" });
      } else {
        alert('Ошибка отправки. Попробуйте позже или свяжитесь по телефону.');
      }
    } catch (error) {
      console.error('Telegram error:', error);
      alert('Ошибка отправки. Проверьте интернет-соединение.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", background: "#f8f9fa", color: "#1a1a1a", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Roboto', sans-serif; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f8f9fa; }
        ::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.5); border-radius: 3px; }

        .btn-gold {
          background: linear-gradient(135deg, #c8a96e 0%, #e8d090 50%, #c8a96e 100%);
          background-size: 200%;
          color: #fff; border: none; cursor: pointer;
          padding: 14px 34px; border-radius: 12px;
          font-weight: 700; font-size: 16px; line-height: 1.2; font-family: 'Roboto', sans-serif;
          transition: all 0.4s; position: relative; overflow: hidden;
        }
        .btn-gold::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent, rgba(255,255,255,0.25), transparent); transform: translateX(-100%); transition: transform 0.5s; }
        .btn-gold:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(200,169,110,0.45); background-position: right; }
        .btn-gold:hover::after { transform: translateX(100%); }
        .btn-gold:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-outline {
          background: rgba(200,169,110,0.12); color: #c8a96e;
          border: 1px solid rgba(200,169,110,0.3);
          padding: 12px 28px; border-radius: 12px;
          font-weight: 600; font-size: 16px; line-height: 1.2; font-family: 'Roboto', sans-serif;
          cursor: pointer; transition: all 0.3s; backdrop-filter: blur(8px);
        }
        .btn-outline:hover { background: rgba(200,169,110,0.2); border-color: rgba(200,169,110,0.5); transform: translateY(-2px); }

        .glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
          border: 1px solid rgba(200,169,110,0.15);
          backdrop-filter: blur(16px); border-radius: 20px;
          transition: all 0.4s cubic-bezier(.23,1,.32,1);
          position: relative; overflow: hidden;
        }
        .glass:hover { border-color: rgba(200,169,110,0.3); transform: translateY(-5px); box-shadow: 0 20px 60px rgba(200,169,110,0.25); }

        .nav-link { color: rgba(0,0,0,0.65); font-size: 16px; line-height: 1.2; font-weight: 500; cursor: pointer; transition: all 0.25s; padding: 6px 0; position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1.5px; background: #c8a96e; transition: width 0.3s; }
        .nav-link:hover { color: #c8a96e; }
        .nav-link:hover::after { width: 100%; }

        .input-f {
          width: 100%; padding: 14px 18px;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(200,169,110,0.2);
          border-radius: 11px; color: #1a1a1a;
          font-family: 'Roboto', sans-serif; font-size: 16px; line-height: 1.2;
          outline: none; transition: all 0.3s;
        }
        .input-f:focus { border-color: rgba(200,169,110,0.6); background: #fff; box-shadow: 0 0 0 3px rgba(200,169,110,0.15); }
        .input-f::placeholder { color: rgba(0,0,0,0.35); }

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes pulse-r { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.9);opacity:0} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

        .spin-ring { animation: spin 30s linear infinite; }
        .floating { animation: float 7s ease-in-out infinite; }
        .shimmer-gold {
          background: linear-gradient(90deg, #c8a96e, #f5e4a0, #c8a96e, #f5e4a0, #c8a96e);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 5s linear infinite;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, rgba(200,169,110,0.2), rgba(200,169,110,0.1));
          border: 1px solid rgba(200,169,110,0.35); color: #c8a96e;
          padding: 6px 18px; border-radius: 30px;
          font-size: 16px; line-height: 1.2; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 18px; backdrop-filter: blur(8px);
        }
        .gold-bar { width: 48px; height: 2px; background: linear-gradient(90deg,#c8a96e,transparent); border-radius:1px; margin-bottom:18px; }
        .verified { display:inline-flex; align-items:center; gap:5px; background:rgba(126,200,160,0.15); border:1px solid rgba(126,200,160,0.3); border-radius:8px; padding:3px 10px; font-size:16px; line-height:1.2; color:#3a8a6a; font-weight:600; }
        .process-arrow { position: absolute; top: 50%; right: -12px; width: 24px; height: 24px; transform: translateY(-50%); z-index: 2; color: #c8a96e; font-size: 28px; font-weight: 300; }
        
        /* Красивые бордеры для статистики */
        .stat-item {
          border: 2px solid rgba(200,169,110,0.25);
          border-radius: 16px;
          padding: 28px 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          transition: all 0.3s;
        }
        .stat-item:hover {
          border-color: rgba(200,169,110,0.5);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(200,169,110,0.2);
        }

        /* АДАПТИВНОСТЬ ДЛЯ ВСЕХ УСТРОЙСТВ */
        
        /* Планшеты горизонтально - 1024px */
        @media(max-width:1024px) {
          section { padding: 60px 32px !important; }
          .glass { padding: 32px 24px !important; }
          header { padding: 0 32px !important; }
          .hero-title { font-size: 48px !important; }
          .sec-title { font-size: 40px !important; }
          .spec-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .process-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .reviews-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-row { grid-template-columns: repeat(4, 1fr) !important; }
        }

        /* Планшеты вертикально - 768px */
        @media(max-width:768px) {
          section { padding: 50px 28px !important; }
          .glass { padding: 28px 24px !important; }
          header { padding: 0 28px !important; }
          header .btn-gold { padding: 10px 20px !important; font-size: 14px !important; }
          .hero-wrap { flex-direction: column-reverse !important; text-align: center !important; }
          .hero-photo { width: 280px !important; height: 360px !important; margin: 40px auto 0 !important; }
          .hero-title { font-size: 42px !important; }
          .sec-title { font-size: 36px !important; }
          .spec-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .d-none-mob { display: none !important; }
          
          /* Статистика: 2+2 (2 сверху, 2 снизу) */
          .stats-row { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 20px !important;
          }
          
          /* Процесс работы: горизонтальный скролл, меньше размер, центр */
          .process-grid { 
            display: flex !important; 
            overflow-x: auto !important; 
            gap: 16px !important; 
            padding-bottom: 20px !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            justify-content: flex-start !important;
          }
          .process-grid > div { 
            min-width: 240px !important; 
            flex-shrink: 0 !important;
            scroll-snap-align: center !important;
          }
          .process-grid .glass {
            padding: 24px 18px !important;
          }
          .process-arrow { display: none !important; }
        }

        /* Большие телефоны - 425px */
        @media(max-width:425px) {
          section { padding: 40px 24px !important; }
          .glass { padding: 24px 20px !important; }
          header { padding: 0 24px !important; }
          header .btn-gold { padding: 8px 16px !important; font-size: 13px !important; }
          .hero-photo { width: 240px !important; height: 320px !important; margin: 35px auto 0 !important; }
          .hero-title { font-size: 36px !important; line-height: 1.2 !important; }
          .sec-title { font-size: 32px !important; line-height: 1.2 !important; }
          .spec-grid { grid-template-columns: 1fr !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .btn-gold, .btn-outline { padding: 12px 18px !important; font-size: 15px !important; }
          
          /* Статистика: 2 сверху, 1 большой снизу */
          .stats-row { 
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: auto auto !important;
            gap: 16px !important;
          }
          .stats-row > div:nth-child(1),
          .stats-row > div:nth-child(2) {
            grid-column: span 1 !important;
          }
          .stats-row > div:nth-child(3) {
            grid-column: span 2 !important;
          }
          .stats-row > div:nth-child(4) {
            grid-column: span 2 !important;
          }
          
          .process-grid > div { min-width: 220px !important; }
          .process-grid .glass { padding: 20px 16px !important; }
          
          footer { padding: 40px 24px 24px !important; }
          .footer-top { flex-direction: column !important; align-items: center !important; gap: 20px !important; }
          .footer-nav { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
          .footer-bottom { flex-direction: column !important; gap: 10px !important; text-align: center !important; }
        }

        /* iPhone - 375px */
        @media(max-width:375px) {
          section { padding: 35px 22px !important; }
          .glass { padding: 22px 18px !important; }
          header { padding: 0 22px !important; }
          header .btn-gold { padding: 8px 14px !important; font-size: 12px !important; }
          .hero-photo { width: 220px !important; height: 300px !important; margin: 30px auto 0 !important; }
          .hero-title { font-size: 32px !important; }
          .sec-title { font-size: 28px !important; }
          .btn-gold, .btn-outline { padding: 12px 16px !important; font-size: 14px !important; }
          
          .process-grid { gap: 14px !important; }
          .process-grid > div { min-width: 200px !important; }
          .process-grid .glass { padding: 18px 14px !important; }
          
          .stats-row { gap: 14px !important; }
          
          footer { padding: 35px 22px 24px !important; }
        }

        /* Маленькие телефоны - 320px */
        @media(max-width:320px) {
          section { padding: 30px 20px !important; }
          .glass { padding: 20px 16px !important; }
          header { padding: 0 20px !important; }
          header .btn-gold { padding: 7px 12px !important; font-size: 11px !important; }
          .hero-photo { width: 200px !important; height: 280px !important; margin: 25px auto 0 !important; }
          .hero-title { font-size: 28px !important; }
          .sec-title { font-size: 26px !important; }
          .btn-gold, .btn-outline { padding: 11px 14px !important; font-size: 13px !important; }
          
          .process-grid { gap: 12px !important; }
          .process-grid > div { min-width: 180px !important; }
          .process-grid .glass { padding: 16px 12px !important; }
          
          /* Статистика: все в 1 колонку */
          .stats-row { 
            grid-template-columns: 1fr !important;
            gap: 12px !important; 
          }
          .stats-row > div:nth-child(1),
          .stats-row > div:nth-child(2),
          .stats-row > div:nth-child(3),
          .stats-row > div:nth-child(4) {
            grid-column: auto !important;
          }
          
          footer { padding: 30px 20px 20px !important; }
          
          * { font-size: 14px !important; }
          .hero-title, .sec-title { font-size: 24px !important; }
        }
      `}</style>

      {/* Cursor glow */}
      <div style={{ position:"fixed", pointerEvents:"none", zIndex:9999, width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(200,169,110,0.08) 0%,transparent 70%)", transform:`translate(${mousePos.x-140}px,${mousePos.y-140}px)`, transition:"transform 0.08s" }} />

      {/* HEADER */}
      <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background: scrolled ? "rgba(255,255,255,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(200,169,110,0.15)" : "none", transition:"all 0.45s", padding:"0 20px" }}>
        <div style={{ maxWidth:1240, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:70 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, cursor:"pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#c8a96e,#e8d090)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, boxShadow:"0 4px 18px rgba(200,169,110,0.35)" }}>⚖️</div>
            <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:19, fontWeight:700, color:"#1a1a1a" }}>advokat.tj</div>
          </div>
          <nav style={{ display:"flex", gap:32 }} className="d-none-mob">
            {NAV.map(n => <span key={n.id} className="nav-link" onClick={() => scrollTo(n.id)}>{n.label}</span>)}
          </nav>
          <button className="btn-gold" onClick={() => scrollTo("contact")} style={{ fontSize:16, lineHeight:1.2 }}>Консультация</button>
        </div>
      </header>

      {/* HERO */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", padding:"120px 20px 60px", overflow:"hidden" }}>
        <canvas ref={canvasRef} style={{ position:"absolute", inset:0, pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 90% 70% at 40% 45%, #e8f0f5 0%, #f8f9fa 70%)" }} />
        <div style={{ position:"absolute", top:"-10%", right:"-8%", width:600, height:600, borderRadius:"50%", background:"rgba(200,169,110,0.12)", filter:"blur(80px)", pointerEvents:"none" }} />
        
        <div className="hero-wrap" style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", gap:60, position:"relative", zIndex:1, width:"100%" }}>
          <div style={{ flex:1 }}>
            <Reveal>
              <div className="badge">
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#c8a96e", animation:"pulse-r 2s infinite" }} />
                Ваш надежный защитник
              </div>
              <h1 className="hero-title" style={{ fontFamily:"'Roboto',sans-serif", fontSize:58, fontWeight:700, lineHeight:1.15, marginBottom:22, color:"#1a1a1a" }}>
                Профессиональная <span className="shimmer-gold">юридическая</span> защита
              </h1>
              <p style={{ fontSize:18, lineHeight:1.6, color:"rgba(0,0,0,0.6)", marginBottom:34, maxWidth:540 }}>
                Адвокат с 15-летним опытом. Специализируюсь на гражданских, уголовных и семейных делах. Защищаю ваши права в судах всех инстанций Таджикистана.
              </p>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
                <button className="btn-gold" onClick={() => scrollTo("contact")}>Получить консультацию →</button>
                <button className="btn-outline" onClick={() => scrollTo("about")}>Узнать больше</button>
              </div>
              <div style={{ marginTop:48, display:"flex", gap:32, paddingTop:32, borderTop:"1px solid rgba(200,169,110,0.2)", justifyContent:"center" }}>
                {STATS.slice(0, 3).map((s, i) => (
                  <div key={i} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:32, fontWeight:800, color:"#c8a96e", fontFamily:"'Roboto',sans-serif" }}>{s.val}</div>
                    <div style={{ fontSize:12, color:"rgba(0,0,0,0.45)", textTransform:"uppercase", letterSpacing:1.2, marginTop:4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div style={{ position:"relative", paddingTop: 30 }}>
              <div className="floating" style={{ position:"relative" }}>
                <div className="hero-photo" style={{ width:380, height:480, borderRadius:28, overflow:"hidden", boxShadow:"0 35px 90px rgba(200,169,110,0.35)", border:"3px solid rgba(200,169,110,0.25)" }}>
                  <img src={hamzabekPhoto} alt="Хамзабек Хакимзода" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%" }} />
                </div>
                <div style={{ position:"absolute", top:-20, right:-20, width:90, height:90, borderRadius:"50%", background:"linear-gradient(135deg,#c8a96e,#e8d090)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, boxShadow:"0 12px 40px rgba(200,169,110,0.45)" }}>⚖️</div>
              </div>
              <div style={{ position:"absolute", inset:"-30px", border:"2px solid rgba(200,169,110,0.18)", borderRadius:32, pointerEvents:"none" }} className="spin-ring" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding:"80px 20px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div className="gold-bar" style={{ margin:"0 auto 18px" }} />
              <h2 className="sec-title" style={{ fontFamily:"'Roboto',sans-serif", fontSize:46, fontWeight:700, color:"#1a1a1a", marginBottom:18 }}>О себе</h2>
              <p style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.55)", maxWidth:640, margin:"0 auto" }}>
                Мирзовалиен Хамзабек Хакимзода — опытный адвокат с глубоким пониманием законодательства Таджикистана
              </p>
            </div>
          </Reveal>

          <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center" }}>
            <Reveal>
              <div className="glass" style={{ padding:"48px 40px" }}>
                <h3 style={{ fontFamily:"'Roboto',sans-serif", fontSize:32, fontWeight:700, color:"#1a1a1a", marginBottom:24 }}>Образование и опыт</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
                  {[
                    { y: "2010", t: "Таджикский национальный университет", d: "Юридический факультет" },
                    { y: "2011-наст.вр.", t: "Частная адвокатская практика", d: "Специализация: гражданское и уголовное право" },
                    { y: "500+", t: "Выигранных дел", d: "98% успешных кейсов" }
                  ].map((item, i) => (
                    <div key={i} style={{ borderLeft:"3px solid #c8a96e", paddingLeft:20 }}>
                      <div style={{ color:"#c8a96e", fontSize:16, lineHeight:1.2, fontWeight:700, letterSpacing:1, marginBottom:6 }}>{item.y}</div>
                      <div style={{ fontSize:16, lineHeight:1.2, fontWeight:600, color:"#1a1a1a", marginBottom:4 }}>{item.t}</div>
                      <div style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.5)" }}>{item.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="glass" style={{ padding:"48px 40px", background:"linear-gradient(135deg,rgba(200,169,110,0.12),rgba(200,169,110,0.05))" }}>
                <h3 style={{ fontFamily:"'Roboto',sans-serif", fontSize:28, fontWeight:700, color:"#1a1a1a", marginBottom:20 }}>Почему выбирают меня</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  {[
                    { icon: "✓", text: "Индивидуальный подход к каждому клиенту" },
                    { icon: "✓", text: "Прозрачное ценообразование" },
                    { icon: "✓", text: "Работа на результат" },
                    { icon: "✓", text: "Конфиденциальность гарантирована" },
                    { icon: "✓", text: "Постоянная связь с клиентом" }
                  ].map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"start" }}>
                      <div style={{ width:24, height:24, borderRadius:"50%", background:"#c8a96e", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:16, lineHeight:1.2, fontWeight:700 }}>{item.icon}</div>
                      <div style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.7)" }}>{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section id="specs" style={{ padding:"80px 20px", background:"#f8f9fa" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div className="gold-bar" style={{ margin:"0 auto 18px" }} />
              <h2 className="sec-title" style={{ fontFamily:"'Roboto',sans-serif", fontSize:46, fontWeight:700, color:"#1a1a1a", marginBottom:18 }}>Специализация</h2>
              <p style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.55)", maxWidth:640, margin:"0 auto" }}>
                Профессиональная юридическая помощь во всех отраслях права
              </p>
            </div>
          </Reveal>

          <div className="spec-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:28 }}>
            {SPECS.map((sp, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="glass" style={{ padding:"36px 28px", textAlign:"center", cursor:"pointer" }}>
                  <div style={{ fontSize:52, marginBottom:20 }}>{sp.icon}</div>
                  <h3 style={{ fontFamily:"'Roboto',sans-serif", fontSize:22, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>{sp.title}</h3>
                  <p style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.5)" }}>{sp.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ padding:"80px 20px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div className="gold-bar" style={{ margin:"0 auto 18px" }} />
              <h2 className="sec-title" style={{ fontFamily:"'Roboto',sans-serif", fontSize:46, fontWeight:700, color:"#1a1a1a", marginBottom:18 }}>Процесс работы</h2>
              <p style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.55)", maxWidth:640, margin:"0 auto" }}>
                Четкая и понятная схема сотрудничества
              </p>
            </div>
          </Reveal>

          <div className="process-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:24 }}>
            {PROCESS.map((pr, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ position:"relative" }}>
                  <div className="glass" style={{ padding:"32px 24px", textAlign:"center", height:"100%" }}>
                    <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#c8a96e,#e8d090)", color:"#fff", fontSize:24, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 8px 24px rgba(200,169,110,0.35)" }}>{pr.n}</div>
                    <h3 style={{ fontFamily:"'Roboto',sans-serif", fontSize:20, fontWeight:700, color:"#1a1a1a", marginBottom:10 }}>{pr.title}</h3>
                    <p style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.5)" }}>{pr.desc}</p>
                  </div>
                  {i < PROCESS.length - 1 && (
                    <div className="process-arrow" style={{ position:"absolute", top:"50%", right:"-12px", width:24, height:24, transform:"translateY(-50%)", zIndex:2, color:"#c8a96e", fontSize:28, fontWeight:300 }}>→</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding:"60px 20px", background:"linear-gradient(135deg,rgba(200,169,110,0.15),rgba(200,169,110,0.05))" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="stats-row" style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:24 }}>
            {STATS.map((st, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="stat-item" style={{ 
                  textAlign:"center", 
                  padding:"28px 20px"
                }}>
                  <div style={{ fontSize:48, fontWeight:800, color:"#c8a96e", fontFamily:"'Roboto',sans-serif", marginBottom:8 }}>{st.val}</div>
                  <div style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.55)", textTransform:"uppercase", letterSpacing:1.5, fontWeight:600 }}>{st.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" style={{ padding:"80px 20px", background:"#f8f9fa" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div className="gold-bar" style={{ margin:"0 auto 18px" }} />
              <h2 className="sec-title" style={{ fontFamily:"'Roboto',sans-serif", fontSize:46, fontWeight:700, color:"#1a1a1a", marginBottom:18 }}>Отзывы клиентов</h2>
              <p style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.55)", maxWidth:640, margin:"0 auto" }}>
                Что говорят те, кому я помог
              </p>
            </div>
          </Reveal>

          <div className="reviews-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:28 }}>
            {REVIEWS.map((rv, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="glass" style={{ padding:"32px 28px" }}>
                  <div style={{ display:"flex", gap:4, marginBottom:16, justifyContent:"center" }}>
                    {Array(rv.rating).fill("⭐").map((s, j) => <span key={j} style={{ fontSize:18 }}>{s}</span>)}
                  </div>
                  <p style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.7)", marginBottom:20, fontStyle:"italic", textAlign:"center" }}>"{rv.text}"</p>
                  <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center" }}>
                    <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#c8a96e,#e8d090)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"#fff" }}>
                      {rv.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize:16, lineHeight:1.2, fontWeight:600, color:"#1a1a1a" }}>{rv.name}</div>
                      <div className="verified">✓ Проверенный клиент</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"80px 20px", background:"#fff" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div className="gold-bar" style={{ margin:"0 auto 18px" }} />
              <h2 className="sec-title" style={{ fontFamily:"'Roboto',sans-serif", fontSize:46, fontWeight:700, color:"#1a1a1a", marginBottom:18 }}>Частые вопросы</h2>
            </div>
          </Reveal>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {FAQ.map((fq, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="glass" style={{ padding:0, overflow:"hidden", cursor:"pointer", border: openFaq === i ? "1px solid rgba(200,169,110,0.35)" : "1px solid rgba(200,169,110,0.15)" }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div style={{ padding:"24px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <h3 style={{ fontSize:16, lineHeight:1.2, fontWeight:600, color:"#1a1a1a" }}>{fq.q}</h3>
                    <span style={{ fontSize:22, color:"#c8a96e", transition:"transform 0.3s", transform: openFaq === i ? "rotate(180deg)" : "none" }}>↓</span>
                  </div>
                  <div style={{ maxHeight: openFaq === i ? 300 : 0, overflow:"hidden", transition:"max-height 0.4s" }}>
                    <div style={{ padding:"0 28px 24px", fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.6)" }}>{fq.a}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:"80px 20px 100px", background:"#f8f9fa" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div className="gold-bar" style={{ margin:"0 auto 18px" }} />
              <h2 className="sec-title" style={{ fontFamily:"'Roboto',sans-serif", fontSize:46, fontWeight:700, color:"#1a1a1a", marginBottom:18 }}>Свяжитесь со мной</h2>
              <p style={{ fontSize:16, lineHeight:1.2, color:"rgba(0,0,0,0.55)", maxWidth:640, margin:"0 auto" }}>
                Готов помочь решить вашу юридическую проблему
              </p>
            </div>
          </Reveal>

          <div style={{ display:"flex", gap:48, flexWrap:"wrap" }}>
            {/* Contact Info */}
            <div style={{ flex:1, minWidth:280 }}>
              <Reveal>
                <div className="glass" style={{ padding:"36px 32px" }}>
                  <h3 style={{ fontFamily:"'Roboto',sans-serif", fontSize:26, fontWeight:700, color:"#1a1a1a", marginBottom:28 }}>Контактная информация</h3>
                  {[
                    { icon: "📞", label: "Телефон", val: "+992 00 000 00 00" },
                    { icon: "📧", label: "Email", val: "hamzabek@advokat.tj" },
                    { icon: "📍", label: "Адрес", val: "г. Душанбе, ул. Валаматзода, д. 10" },
                    { icon: "🕐", label: "Часы работы", val: "Пн-Пт: 9:00-18:00, Сб: 10:00-15:00" }
                  ].map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:16, marginBottom:24, alignItems:"start" }}>
                      <div style={{ fontSize:28, flexShrink:0 }}>{item.icon}</div>
                      <div>
                        <div style={{ color:"rgba(0,0,0,0.4)", fontSize:16, lineHeight:1.2, marginBottom:2, textTransform:"uppercase", letterSpacing:1 }}>{item.label}</div>
                        <div style={{ color:"#1a1a1a", fontSize:16, lineHeight:1.2, fontWeight:500 }}>{item.val}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display:"flex", gap:10, marginTop:24 }}>
                    {["📱 Telegram", "📷 Instagram"].map(s => (
                      <div key={s} style={{ flex:1, background:"rgba(200,169,110,0.1)", border:"1px solid rgba(200,169,110,0.2)", borderRadius:10, padding:"12px", textAlign:"center", fontSize:16, lineHeight:1.2, color:"#c8a96e", cursor:"pointer", transition:"all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.background="rgba(200,169,110,0.2)"; e.currentTarget.style.borderColor="rgba(200,169,110,0.35)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="rgba(200,169,110,0.1)"; e.currentTarget.style.borderColor="rgba(200,169,110,0.2)"; }}>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div style={{ flex:1, minWidth:280 }}>
              <Reveal delay={0.15}>
                {submitted ? (
                  <div style={{ background:"linear-gradient(135deg,rgba(126,200,160,0.2),rgba(126,200,160,0.1))", border:"1px solid rgba(126,200,160,0.3)", borderRadius:24, padding:"64px 40px", textAlign:"center" }}>
                    <div style={{ fontSize:72, marginBottom:20 }}>✅</div>
                    <h3 style={{ fontFamily:"'Roboto',sans-serif", color:"#3a8a6a", fontSize:32, marginBottom:12 }}>Заявка принята!</h3>
                    <p style={{ color:"rgba(0,0,0,0.5)", fontSize:16, lineHeight:1.2 }}>Хамзабек Хакимзода свяжется с вами в ближайшее время. Спасибо!</p>
                    <button className="btn-outline" style={{ marginTop:24 }} onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", desc: "" }); }}>Отправить ещё одну заявку</button>
                  </div>
                ) : (
                  <form onSubmit={sendToTelegram} style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.85))", border:"1px solid rgba(200,169,110,0.15)", borderRadius:24, padding:"40px 36px", backdropFilter:"blur(20px)", boxShadow:"0 28px 70px rgba(200,169,110,0.15)" }}>
                    {[
                      { label:"Ваше имя *", type:"text", key:"name", ph:"Имя Фамилия" },
                      { label:"Телефон *", type:"tel", key:"phone", ph:"+992 00 000 00 00" },
                    ].map(f => (
                      <div key={f.key} style={{ marginBottom:20 }}>
                        <label style={{ display:"block", color:"rgba(0,0,0,0.5)", fontSize:16, lineHeight:1.2, marginBottom:8, fontWeight:600, letterSpacing:.5, textTransform:"uppercase" }}>{f.label}</label>
                        <input className="input-f" type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} required={f.key!=="email"} />
                      </div>
                    ))}
                    <div style={{ marginBottom:32 }}>
                      <label style={{ display:"block", color:"rgba(0,0,0,0.5)", fontSize:16, lineHeight:1.2, marginBottom:8, fontWeight:600, letterSpacing:.5, textTransform:"uppercase" }}>Описание проблемы</label>
                      <textarea className="input-f" placeholder="Кратко опишите вашу ситуацию..." rows={4} value={form.desc} onChange={e => setForm({...form,desc:e.target.value})} style={{ resize:"vertical", minHeight:110 }} />
                    </div>
                    <button type="submit" className="btn-gold" style={{ width:"100%", padding:"17px", fontSize:16, lineHeight:1.2 }} disabled={sending}>
                      {sending ? "Отправка..." : "Отправить заявку →"}
                    </button>
                    <p style={{ color:"rgba(0,0,0,0.3)", fontSize:16, lineHeight:1.2, textAlign:"center", marginTop:14 }}>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
                  </form>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#e8eef2", borderTop:"1px solid rgba(200,169,110,0.15)", padding:"48px 20px 28px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="footer-top" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24, marginBottom:36 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <img src={hamzabekPhoto} alt="" style={{ width:48, height:48, borderRadius:"50%", objectFit:"cover", objectPosition:"center 15%", border:"2px solid rgba(200,169,110,0.3)" }} />
              <div>
                <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:18, fontWeight:700, color:"#1a1a1a" }}>Хамзабек Хакимзода</div>
                <div style={{ color:"#c8a96e", fontSize:16, lineHeight:1.2, letterSpacing:1.5, textTransform:"uppercase", fontWeight:600 }}>Адвокат · Таджикистан</div>
              </div>
            </div>
            <div className="footer-nav" style={{ display:"flex", gap:28 }}>
              {NAV.map(n => <span key={n.id} className="nav-link" style={{ fontSize:16, lineHeight:1.2 }} onClick={() => scrollTo(n.id)}>{n.label}</span>)}
            </div>
          </div>
          <div className="footer-bottom" style={{ borderTop:"1px solid rgba(200,169,110,0.15)", paddingTop:24, display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ color:"rgba(0,0,0,0.4)", fontSize:16, lineHeight:1.2 }}>© 2026 Мирзовалиен Хамзабек Хакимзода. Все права защищены.</div>
            <div style={{ color:"rgba(0,0,0,0.4)", fontSize:16, lineHeight:1.2 }}>г. Душанбе, ул. Валаматзода, д. 10</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
