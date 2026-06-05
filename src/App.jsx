import { useState, useEffect, useRef } from "react";

const COLORS = {
  primary: "#003087",
  accent: "#E8001C",
  gold: "#F5A623",
  bg: "#F4F6FB",
  card: "#FFFFFF",
  text: "#1A1A2E",
  muted: "#6B7280",
  success: "#16A34A",
  border: "#DDE3F0",
};

// ─── Mock Users ───────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    email: "admin@duocuc.cl",
    password: "admin123",
    name: "Administrador Duoc",
    role: "admin",
    rut: "11.111.111-1",
    patent: "ADMIN1",
    vehicleType: "auto",
    brand: "—",
  },
  {
    email: "alumno@duocuc.cl",
    password: "alumno123",
    name: "Alumno Demo",
    role: "user",
    rut: "12.345.678-9",
    patent: "ABCD12",
    vehicleType: "auto",
    brand: "Toyota",
  },
];

const mockSpots = [
  { id: "A01", zone: "A", type: "regular", status: "free" },
  { id: "A02", zone: "A", type: "regular", status: "occupied" },
  { id: "A03", zone: "A", type: "discapacidad", status: "free" },
  { id: "A04", zone: "A", type: "regular", status: "reserved" },
  { id: "A05", zone: "A", type: "regular", status: "free" },
  { id: "B01", zone: "B", type: "regular", status: "occupied" },
  { id: "B02", zone: "B", type: "regular", status: "free" },
  { id: "B03", zone: "B", type: "moto", status: "free" },
  { id: "B04", zone: "B", type: "regular", status: "free" },
  { id: "B05", zone: "B", type: "regular", status: "occupied" },
  { id: "C01", zone: "C", type: "regular", status: "free" },
  { id: "C02", zone: "C", type: "regular", status: "free" },
  { id: "C03", zone: "C", type: "regular", status: "occupied" },
  { id: "C04", zone: "C", type: "discapacidad", status: "reserved" },
  { id: "C05", zone: "C", type: "regular", status: "free" },
];

const scheduleSlots = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00",
];

// ─── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step, total, labels }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: i < step ? COLORS.primary : i === step ? COLORS.accent : "#E5E7EB",
            color: i <= step ? "#fff" : COLORS.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 15,
            boxShadow: i === step ? `0 0 0 4px ${COLORS.accent}33` : "none",
            transition: "all .3s",
            position: "relative",
          }}>
            {i < step ? "✓" : i + 1}
            {labels && (
              <span style={{
                position: "absolute", top: 42, left: "50%", transform: "translateX(-50%)",
                fontSize: 10, color: i === step ? COLORS.accent : COLORS.muted,
                whiteSpace: "nowrap", fontWeight: i === step ? 700 : 400,
              }}>{labels[i]}</span>
            )}
          </div>
          {i < total - 1 && (
            <div style={{
              width: 48, height: 3,
              background: i < step ? COLORS.primary : "#E5E7EB",
              transition: "background .3s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Input Field ───────────────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder, hint, icon, error, maxLength }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
        {icon && <span style={{ marginRight: 6 }}>{icon}</span>}{label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "11px 14px", fontSize: 14,
          border: `2px solid ${error ? COLORS.accent : focused ? COLORS.primary : COLORS.border}`,
          borderRadius: 10, outline: "none", boxSizing: "border-box",
          background: "#FAFBFF", color: COLORS.text,
          transition: "border .2s",
          fontFamily: "inherit",
        }}
      />
      {hint && !error && <p style={{ margin: "4px 0 0", fontSize: 11, color: COLORS.muted }}>{hint}</p>}
      {error && <p style={{ margin: "4px 0 0", fontSize: 11, color: COLORS.accent }}>{error}</p>}
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: COLORS.card, borderRadius: 18,
      boxShadow: "0 4px 24px rgba(0,48,135,.09)",
      padding: 28, ...style,
    }}>{children}</div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", disabled, style }) {
  const base = {
    padding: "12px 28px", borderRadius: 12, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700, fontSize: 15, fontFamily: "inherit", transition: "all .18s",
    opacity: disabled ? .55 : 1, ...style,
  };
  const variants = {
    primary: { background: COLORS.primary, color: "#fff" },
    accent: { background: COLORS.accent, color: "#fff" },
    outline: { background: "transparent", color: COLORS.primary, border: `2px solid ${COLORS.primary}` },
    ghost: { background: "#F1F5FF", color: COLORS.primary },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ children, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, background: color + "22", color,
    }}>{children}</span>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// SCREENS
// ════════════════════════════════════════════════════════════════════════════════

// ── 1. Vinculación de cuenta ───────────────────────────────────────────────────
function AccountStep({ data, setData, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.email.endsWith("@duocuc.cl")) e.email = "Debe ser un correo @duocuc.cl";
    if (!data.password || data.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (!data.name.trim()) e.name = "Nombre requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🔗</div>
        <h2 style={{ margin: 0, color: COLORS.primary, fontSize: 22 }}>Vinculación de cuenta</h2>
        <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: 13 }}>Ingresa tus credenciales Duoc UC</p>
      </div>
      <Field label="Nombre completo" value={data.name} onChange={v => setData({ ...data, name: v })}
        placeholder="Ej: Juan Pérez" icon="👤" error={errors.name} />
      <Field label="Correo Duoc UC" type="email" value={data.email} onChange={v => setData({ ...data, email: v })}
        placeholder="usuario@duocuc.cl" icon="📧" error={errors.email}
        hint="Solo se aceptan correos institucionales @duocuc.cl" />
      <Field label="Contraseña" type="password" value={data.password} onChange={v => setData({ ...data, password: v })}
        placeholder="Tu contraseña Duoc" icon="🔒" error={errors.password} />
      <Btn onClick={() => validate() && onNext()} style={{ width: "100%", marginTop: 8 }}>
        Continuar →
      </Btn>
    </div>
  );
}

// ── 2. Verificación de correo ──────────────────────────────────────────────────
function EmailVerifyStep({ email, onNext }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [sent, setSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const sendCode = () => {
    setSent(true);
    setTimer(60);
  };

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleCodeChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const verify = () => {
    const full = code.join("");
    if (full === "123456" || full.length === 6) { setError(""); onNext(); }
    else setError("Código incorrecto. Usa 123456 para demo.");
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📬</div>
        <h2 style={{ margin: 0, color: COLORS.primary, fontSize: 22 }}>Verificación de correo</h2>
        <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: 13 }}>
          {sent ? `Código enviado a ${email}` : `Verificaremos tu correo institucional`}
        </p>
      </div>

      <div style={{ background: "#F0F4FF", borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "center" }}>
        <span style={{ fontSize: 13, color: COLORS.primary }}>📧 <strong>{email}</strong></span>
      </div>

      {!sent ? (
        <Btn onClick={sendCode} style={{ width: "100%" }}>Enviar código de verificación</Btn>
      ) : (
        <>
          <p style={{ textAlign: "center", fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>
            Ingresa el código de 6 dígitos
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
            {code.map((d, i) => (
              <input key={i} ref={el => inputsRef.current[i] = el}
                value={d} onChange={e => handleCodeChange(i, e.target.value)}
                maxLength={1} style={{
                  width: 44, height: 52, textAlign: "center", fontSize: 22, fontWeight: 700,
                  border: `2px solid ${error ? COLORS.accent : COLORS.border}`,
                  borderRadius: 10, outline: "none", color: COLORS.primary, fontFamily: "inherit",
                }}
              />
            ))}
          </div>
          {error && <p style={{ color: COLORS.accent, fontSize: 12, textAlign: "center" }}>{error}</p>}
          <Btn onClick={verify} style={{ width: "100%", marginBottom: 10 }}>Verificar</Btn>
          <div style={{ textAlign: "center" }}>
            {timer > 0 ? (
              <span style={{ fontSize: 12, color: COLORS.muted }}>Reenviar en {timer}s</span>
            ) : (
              <button onClick={sendCode} style={{ background: "none", border: "none", color: COLORS.primary, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                Reenviar código
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── 3. Registro de documento ───────────────────────────────────────────────────
function DocumentStep({ data, setData, onNext }) {
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const validate = () => {
    const e = {};
    const rut = data.rut.replace(/\./g, "").replace("-", "");
    if (!data.rut.trim()) e.rut = "RUT requerido";
    else if (rut.length < 8) e.rut = "RUT inválido";
    if (!data.docType) e.docType = "Selecciona tipo de documento";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formatRut = val => {
    let r = val.replace(/[^0-9kK]/g, "");
    if (r.length > 1) r = r.slice(0, -1).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + "-" + r.slice(-1);
    return r.toUpperCase();
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setData(d => ({ ...d, docFile: file.name }));
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🪪</div>
        <h2 style={{ margin: 0, color: COLORS.primary, fontSize: 22 }}>Registro de documento</h2>
        <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: 13 }}>Identidad y documentación</p>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
          🗂 Tipo de documento
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          {["Cédula", "Pasaporte"].map(t => (
            <div key={t} onClick={() => setData({ ...data, docType: t })} style={{
              flex: 1, padding: "10px 0", textAlign: "center", borderRadius: 10, cursor: "pointer",
              border: `2px solid ${data.docType === t ? COLORS.primary : COLORS.border}`,
              background: data.docType === t ? "#EEF2FF" : "#FAFBFF",
              color: data.docType === t ? COLORS.primary : COLORS.muted,
              fontWeight: 600, fontSize: 14, transition: "all .2s",
            }}>{t}</div>
          ))}
        </div>
        {errors.docType && <p style={{ color: COLORS.accent, fontSize: 11, margin: "4px 0 0" }}>{errors.docType}</p>}
      </div>

      <Field label="RUT" value={data.rut} onChange={v => setData({ ...data, rut: formatRut(v) })}
        placeholder="12.345.678-9" icon="🔢" error={errors.rut} maxLength={12} />

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
          📎 Foto del documento (opcional)
        </label>
        <label style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: 20, border: `2px dashed ${COLORS.border}`, borderRadius: 12, cursor: "pointer",
          background: "#FAFBFF", color: COLORS.muted, fontSize: 13,
        }}>
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          {preview ? "✅ Documento cargado" : "📷 Subir imagen del documento"}
        </label>
        {preview && (
          <img src={preview} alt="doc" style={{ marginTop: 8, width: "100%", borderRadius: 10, maxHeight: 120, objectFit: "cover" }} />
        )}
      </div>

      <Btn onClick={() => validate() && onNext()} style={{ width: "100%" }}>Continuar →</Btn>
    </div>
  );
}

// ── 4. Registro de patente ─────────────────────────────────────────────────────
function PatentStep({ data, setData, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const p = data.patent.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (!p || (p.length < 6)) e.patent = "Patente inválida (ej: ABCD12 o AB1234)";
    if (!data.vehicleType) e.vehicleType = "Selecciona tipo de vehículo";
    if (!data.brand.trim()) e.brand = "Marca requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formatPatent = v => v.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);

  const types = [
    { id: "auto", label: "Auto", icon: "🚗" },
    { id: "moto", label: "Moto", icon: "🏍️" },
    { id: "camioneta", label: "Camioneta", icon: "🚙" },
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🚘</div>
        <h2 style={{ margin: 0, color: COLORS.primary, fontSize: 22 }}>Registro de patente</h2>
        <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: 13 }}>Datos de tu vehículo</p>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 8 }}>
          🚦 Tipo de vehículo
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          {types.map(t => (
            <div key={t.id} onClick={() => setData({ ...data, vehicleType: t.id })} style={{
              flex: 1, padding: "12px 0", textAlign: "center", borderRadius: 12, cursor: "pointer",
              border: `2px solid ${data.vehicleType === t.id ? COLORS.primary : COLORS.border}`,
              background: data.vehicleType === t.id ? "#EEF2FF" : "#FAFBFF",
              color: data.vehicleType === t.id ? COLORS.primary : COLORS.muted,
              fontWeight: 600, fontSize: 13, transition: "all .2s",
            }}>
              <div style={{ fontSize: 22 }}>{t.icon}</div>
              {t.label}
            </div>
          ))}
        </div>
        {errors.vehicleType && <p style={{ color: COLORS.accent, fontSize: 11, margin: "4px 0 0" }}>{errors.vehicleType}</p>}
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
          🔤 Patente
        </label>
        <input
          value={data.patent} onChange={e => setData({ ...data, patent: formatPatent(e.target.value) })}
          placeholder="ABCD12"
          style={{
            width: "100%", padding: "14px", fontSize: 26, fontWeight: 800, letterSpacing: 8,
            border: `3px solid ${errors.patent ? COLORS.accent : COLORS.primary}`,
            borderRadius: 12, outline: "none", textAlign: "center", boxSizing: "border-box",
            color: COLORS.primary, background: "#F0F4FF", fontFamily: "monospace",
          }}
        />
        {errors.patent && <p style={{ color: COLORS.accent, fontSize: 11, margin: "4px 0 0" }}>{errors.patent}</p>}
      </div>

      <Field label="Marca" value={data.brand} onChange={v => setData({ ...data, brand: v })}
        placeholder="Ej: Toyota, Yamaha, Chevrolet" icon="🏷️" error={errors.brand} />
      <Field label="Modelo" value={data.model} onChange={v => setData({ ...data, model: v })}
        placeholder="Ej: Corolla, FZ25" icon="🔧" />
      <Field label="Color" value={data.color} onChange={v => setData({ ...data, color: v })}
        placeholder="Ej: Rojo, Blanco" icon="🎨" />

      <Btn onClick={() => validate() && onNext()} style={{ width: "100%" }}>Continuar →</Btn>
    </div>
  );
}

// ── 5. Dashboard principal ─────────────────────────────────────────────────────
function Dashboard({ account, vehicle, onReserve }) {
  const [spots] = useState(mockSpots);
  const [selectedZone, setSelectedZone] = useState("all");
  const [tab, setTab] = useState("mapa");

  const zones = ["all", "A", "B", "C"];
  const filtered = selectedZone === "all" ? spots : spots.filter(s => s.zone === selectedZone);

  const free = spots.filter(s => s.status === "free").length;
  const occupied = spots.filter(s => s.status === "occupied").length;
  const reserved = spots.filter(s => s.status === "reserved").length;

  const statusColor = {
    free: COLORS.success,
    occupied: COLORS.accent,
    reserved: COLORS.gold,
  };
  const statusLabel = { free: "Libre", occupied: "Ocupado", reserved: "Reservado" };

  return (
    <div>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, #1a4fa3 100%)`,
        borderRadius: 18, padding: "20px 22px", marginBottom: 20, color: "#fff",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, opacity: .75 }}>Bienvenido/a</p>
            <h3 style={{ margin: "2px 0 4px", fontSize: 20 }}>{account.name.split(" ")[0]} 👋</h3>
            <Badge color="#fff">{vehicle.patent}</Badge>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, opacity: .7 }}>Espacios libres</p>
            <p style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>{free}</p>
            <p style={{ margin: 0, fontSize: 11, opacity: .7 }}>de {spots.length} totales</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Libres", val: free, color: COLORS.success, icon: "✅" },
          { label: "Ocupados", val: occupied, color: COLORS.accent, icon: "🔴" },
          { label: "Reservados", val: reserved, color: COLORS.gold, icon: "⏳" },
        ].map(s => (
          <Card key={s.label} style={{ padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["mapa", "horario"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer",
            background: tab === t ? COLORS.primary : "#F1F5FF",
            color: tab === t ? "#fff" : COLORS.primary, fontWeight: 700, fontSize: 13, fontFamily: "inherit",
          }}>
            {t === "mapa" ? "🗺 Mapa de espacios" : "🕐 Horarios"}
          </button>
        ))}
      </div>

      {tab === "mapa" && (
        <>
          {/* Zone filter */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {zones.map(z => (
              <button key={z} onClick={() => setSelectedZone(z)} style={{
                padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                background: selectedZone === z ? COLORS.primary : "#F1F5FF",
                color: selectedZone === z ? "#fff" : COLORS.primary,
                fontWeight: 600, fontSize: 12, fontFamily: "inherit",
              }}>{z === "all" ? "Todas" : `Zona ${z}`}</button>
            ))}
          </div>

          {/* Spots grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {filtered.map(s => (
              <div key={s.id} onClick={() => s.status === "free" && onReserve(s)}
                style={{
                  padding: "12px 8px", borderRadius: 12, textAlign: "center",
                  border: `2px solid ${statusColor[s.status]}22`,
                  background: s.status === "free" ? statusColor[s.status] + "11" : "#F9FAFB",
                  cursor: s.status === "free" ? "pointer" : "default",
                  transition: "transform .15s",
                }}>
                <div style={{ fontSize: 20 }}>
                  {s.type === "discapacidad" ? "♿" : s.type === "moto" ? "🏍️" : "🚗"}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{s.id}</div>
                <Badge color={statusColor[s.status]}>{statusLabel[s.status]}</Badge>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "horario" && (
        <ScheduleView />
      )}
    </div>
  );
}

// ── Schedule View ──────────────────────────────────────────────────────────────
function ScheduleView() {
  const [selected, setSelected] = useState(null);
  const now = new Date();
  const currentHour = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");

  const availability = scheduleSlots.reduce((acc, slot) => {
    const h = parseInt(slot.split(":")[0]);
    acc[slot] = h < 8 ? "high" : h < 13 ? "low" : h < 15 ? "medium" : h < 18 ? "low" : "high";
    return acc;
  }, {});

  const colors = { high: COLORS.success, medium: COLORS.gold, low: COLORS.accent };
  const labels = { high: "Alta disp.", medium: "Media disp.", low: "Baja disp." };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {Object.entries(labels).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: colors[k] }} />
            <span style={{ color: COLORS.muted }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {scheduleSlots.map(slot => (
          <div key={slot} onClick={() => setSelected(selected === slot ? null : slot)} style={{
            padding: "10px 6px", borderRadius: 10, textAlign: "center", cursor: "pointer",
            background: selected === slot ? COLORS.primary : colors[availability[slot]] + "15",
            border: `2px solid ${selected === slot ? COLORS.primary : colors[availability[slot]] + "44"}`,
            transition: "all .15s",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: selected === slot ? "#fff" : COLORS.text }}>{slot}</div>
            <div style={{ fontSize: 10, color: selected === slot ? "#ffffff99" : colors[availability[slot]] }}>
              {availability[slot] === "high" ? "12+ espacios" : availability[slot] === "medium" ? "5–8 espacios" : "1–4 espacios"}
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <Card style={{ marginTop: 16, background: "#EEF2FF" }}>
          <h4 style={{ margin: "0 0 8px", color: COLORS.primary }}>⏰ Horario seleccionado: {selected}</h4>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.muted }}>
            Disponibilidad estimada: {labels[availability[selected]]}. Puedes reservar un espacio para este horario desde el mapa de espacios.
          </p>
        </Card>
      )}
    </div>
  );
}

// ── Reservation Modal ──────────────────────────────────────────────────────────
function ReserveModal({ spot, vehicle, onConfirm, onClose }) {
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [confirmed, setConfirmed] = useState(false);

  const confirm = () => { setConfirmed(true); setTimeout(() => { onConfirm(); onClose(); }, 2000); };

  if (confirmed) return (
    <div style={{
      position: "fixed", inset: 0, background: "#000a", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
    }}>
      <Card style={{ maxWidth: 320, width: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
        <h3 style={{ color: COLORS.success, margin: "0 0 8px" }}>¡Reserva confirmada!</h3>
        <p style={{ color: COLORS.muted, fontSize: 13 }}>Espacio {spot.id} reservado para las {time}</p>
      </Card>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000a", display: "flex",
      alignItems: "flex-end", justifyContent: "center", zIndex: 100,
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px 20px 0 0", padding: 28, width: "100%", maxWidth: 480,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: COLORS.primary }}>Reservar espacio {spot.id}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ background: "#F0F4FF", borderRadius: 12, padding: 14, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span>🅿️ Zona {spot.zone} - {spot.id}</span>
            <span>🚗 {vehicle.patent}</span>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
            ⏰ Hora de ingreso
          </label>
          <select value={time} onChange={e => setTime(e.target.value)} style={{
            width: "100%", padding: "11px 14px", fontSize: 14, border: `2px solid ${COLORS.border}`,
            borderRadius: 10, outline: "none", background: "#FAFBFF", fontFamily: "inherit",
          }}>
            <option value="">Selecciona hora</option>
            {scheduleSlots.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 8 }}>
            ⌛ Duración estimada
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {["30", "60", "90", "120"].map(d => (
              <button key={d} onClick={() => setDuration(d)} style={{
                flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer",
                background: duration === d ? COLORS.primary : "#F1F5FF",
                color: duration === d ? "#fff" : COLORS.primary, fontWeight: 700, fontSize: 12, fontFamily: "inherit",
              }}>{d} min</button>
            ))}
          </div>
        </div>

        <Btn onClick={confirm} disabled={!time} style={{ width: "100%" }}>
          🎫 Confirmar reserva
        </Btn>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════════
const mockUsers = [
  { id: 1, name: "Juan Pérez", email: "j.perez@duocuc.cl", patent: "ABCD12", role: "user", status: "active", rut: "12.345.678-9", vehicle: "Toyota Corolla" },
  { id: 2, name: "María González", email: "m.gonzalez@duocuc.cl", patent: "XY3421", role: "user", status: "active", rut: "13.456.789-0", vehicle: "Hyundai i20" },
  { id: 3, name: "Pedro Ramos", email: "p.ramos@duocuc.cl", patent: "BC9812", role: "user", status: "suspended", rut: "14.567.890-1", vehicle: "Yamaha FZ25" },
  { id: 4, name: "Administrador Duoc", email: "admin@duocuc.cl", patent: "ADMIN1", role: "admin", status: "active", rut: "11.111.111-1", vehicle: "—" },
];

const mockReservations = [
  { id: "R001", user: "Juan Pérez", spot: "A01", time: "08:00", duration: 60, status: "active", patent: "ABCD12" },
  { id: "R002", user: "María González", spot: "B04", time: "10:30", duration: 90, status: "active", patent: "XY3421" },
  { id: "R003", user: "Pedro Ramos", spot: "C01", time: "07:00", duration: 30, status: "completed", patent: "BC9812" },
  { id: "R004", user: "Juan Pérez", spot: "A05", time: "14:00", duration: 60, status: "cancelled", patent: "ABCD12" },
];

function AdminDashboard({ account, onLogout }) {
  const [adminTab, setAdminTab] = useState("overview");
  const [users, setUsers] = useState(mockUsers);
  const [spots, setSpots] = useState(mockSpots);
  const [reservations] = useState(mockReservations);
  const [editUser, setEditUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, color = COLORS.success) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const toggleUserStatus = (id) => {
    setUsers(u => u.map(usr =>
      usr.id === id ? { ...usr, status: usr.status === "active" ? "suspended" : "active" } : usr
    ));
    showToast("Estado de usuario actualizado");
  };

  const toggleSpotStatus = (id) => {
    setSpots(s => s.map(sp =>
      sp.id === id ? { ...sp, status: sp.status === "free" ? "maintenance" : "free" } : sp
    ));
    showToast("Estado del espacio actualizado");
  };

  const tabs = [
    { id: "overview", label: "Resumen", icon: "📊" },
    { id: "spots", label: "Espacios", icon: "🅿️" },
    { id: "users", label: "Usuarios", icon: "👥" },
    { id: "reservations", label: "Reservas", icon: "📋" },
  ];

  const statusColors = {
    active: COLORS.success, suspended: COLORS.accent, maintenance: COLORS.gold,
    free: COLORS.success, occupied: COLORS.accent, reserved: COLORS.gold,
    completed: COLORS.muted, cancelled: COLORS.accent,
  };
  const statusLabels = {
    active: "Activo", suspended: "Suspendido", maintenance: "Mantención",
    free: "Libre", occupied: "Ocupado", reserved: "Reservado",
    completed: "Completada", cancelled: "Cancelada",
  };

  return (
    <div style={{ width: "100%", maxWidth: 480, padding: "0 16px", boxSizing: "border-box" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: toast.color, color: "#fff", padding: "10px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 200, boxShadow: "0 4px 16px #0003",
        }}>{toast.msg}</div>
      )}

      {/* Admin Header Card */}
      <Card style={{
        background: `linear-gradient(135deg, #1a0533 0%, #3d0066 100%)`,
        marginBottom: 16, padding: "18px 22px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Panel Admin</span>
              <span style={{
                background: COLORS.gold, color: "#000", fontSize: 10, fontWeight: 800,
                padding: "2px 8px", borderRadius: 20,
              }}>ADMIN</span>
            </div>
            <p style={{ margin: 0, color: "#ffffff99", fontSize: 12 }}>{account.name}</p>
            <p style={{ margin: "2px 0 0", color: "#ffffff66", fontSize: 11 }}>{account.email}</p>
          </div>
          <button onClick={onLogout} style={{
            background: "#ffffff22", border: "1px solid #ffffff33", color: "#fff",
            borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 12,
            fontWeight: 600, fontFamily: "inherit",
          }}>Salir</button>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 18 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setAdminTab(t.id)} style={{
            padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer",
            background: adminTab === t.id ? "#3d0066" : "#F1F5FF",
            color: adminTab === t.id ? "#fff" : COLORS.primary,
            fontWeight: 700, fontSize: 11, fontFamily: "inherit", textAlign: "center",
          }}>
            <div style={{ fontSize: 16 }}>{t.icon}</div>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {adminTab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Usuarios activos", val: users.filter(u => u.status === "active").length, icon: "👥", color: COLORS.primary },
              { label: "Espacios libres", val: spots.filter(s => s.status === "free").length, icon: "✅", color: COLORS.success },
              { label: "Reservas hoy", val: reservations.filter(r => r.status === "active").length, icon: "📋", color: COLORS.gold },
              { label: "Incidencias", val: users.filter(u => u.status === "suspended").length, icon: "⚠️", color: COLORS.accent },
            ].map(s => (
              <Card key={s.label} style={{ padding: "16px 14px" }}>
                <div style={{ fontSize: 24 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{s.label}</div>
              </Card>
            ))}
          </div>

          <Card style={{ marginBottom: 14 }}>
            <h4 style={{ margin: "0 0 12px", color: COLORS.primary, fontSize: 14 }}>📈 Ocupación por zona</h4>
            {["A", "B", "C"].map(zone => {
              const zSpots = spots.filter(s => s.zone === zone);
              const occ = zSpots.filter(s => s.status !== "free").length;
              const pct = Math.round((occ / zSpots.length) * 100);
              return (
                <div key={zone} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Zona {zone}</span>
                    <span style={{ color: COLORS.muted }}>{occ}/{zSpots.length} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: "#EEF2FF", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${pct}%`, borderRadius: 4,
                      background: pct > 75 ? COLORS.accent : pct > 40 ? COLORS.gold : COLORS.success,
                      transition: "width .5s",
                    }} />
                  </div>
                </div>
              );
            })}
          </Card>

          <Card>
            <h4 style={{ margin: "0 0 12px", color: COLORS.primary, fontSize: 14 }}>🕐 Reservas recientes</h4>
            {reservations.slice(0, 3).map(r => (
              <div key={r.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.user}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>Espacio {r.spot} · {r.time} · {r.duration} min</div>
                </div>
                <Badge color={statusColors[r.status]}>{statusLabels[r.status]}</Badge>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── SPOTS ── */}
      {adminTab === "spots" && (
        <div>
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 12px" }}>
            Toca un espacio para cambiar su estado. Puedes ponerlo en mantención.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {spots.map(s => {
              const sc = s.status === "maintenance" ? COLORS.gold : statusColors[s.status] || COLORS.muted;
              return (
                <div key={s.id} onClick={() => toggleSpotStatus(s.id)} style={{
                  padding: "12px 8px", borderRadius: 12, textAlign: "center",
                  border: `2px solid ${sc}33`,
                  background: sc + "11", cursor: "pointer", transition: "transform .15s",
                }}>
                  <div style={{ fontSize: 18 }}>
                    {s.status === "maintenance" ? "🔧" : s.type === "discapacidad" ? "♿" : s.type === "moto" ? "🏍️" : "🚗"}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{s.id}</div>
                  <Badge color={sc}>{s.status === "maintenance" ? "Mantención" : statusLabels[s.status] || s.status}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {adminTab === "users" && (
        <div>
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 12px" }}>
            Gestiona los usuarios registrados en el sistema.
          </p>
          {users.map(u => (
            <Card key={u.id} style={{ marginBottom: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{u.name}</span>
                    {u.role === "admin" && (
                      <span style={{
                        background: "#3d0066", color: "#fff", fontSize: 9, fontWeight: 800,
                        padding: "1px 6px", borderRadius: 10,
                      }}>ADMIN</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{u.email}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>🚗 {u.patent} · {u.vehicle}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>RUT: {u.rut}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <Badge color={statusColors[u.status]}>{statusLabels[u.status]}</Badge>
                  {u.role !== "admin" && (
                    <button onClick={() => toggleUserStatus(u.id)} style={{
                      background: u.status === "active" ? COLORS.accent + "15" : COLORS.success + "15",
                      color: u.status === "active" ? COLORS.accent : COLORS.success,
                      border: "none", borderRadius: 8, padding: "4px 10px",
                      fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}>
                      {u.status === "active" ? "Suspender" : "Reactivar"}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── RESERVATIONS ── */}
      {adminTab === "reservations" && (
        <div>
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 12px" }}>
            Historial completo de reservas del sistema.
          </p>
          {reservations.map(r => (
            <Card key={r.id} style={{ marginBottom: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{r.user}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>
                    🅿️ Espacio {r.spot} · ⏰ {r.time} · ⌛ {r.duration} min
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>🚗 {r.patent} · #{r.id}</div>
                </div>
                <Badge color={statusColors[r.status]}>{statusLabels[r.status]}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ════════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (overrideEmail, overridePass) => {
    const e = overrideEmail ?? email;
    const p = overridePass ?? password;
    const user = MOCK_USERS.find(u => u.email === e && u.password === p);
    if (user) { setError(""); onLogin(user); }
    else setError("Credenciales incorrectas. Usa los accesos rápidos abajo.");
  };

  return (
    <div style={{ width: "100%", maxWidth: 480, padding: "0 16px", boxSizing: "border-box" }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🅿️</div>
          <h2 style={{ margin: "0 0 4px", color: COLORS.primary, fontSize: 24 }}>Duoc Parking</h2>
          <p style={{ margin: 0, color: COLORS.muted, fontSize: 13 }}>Sistema de estacionamiento institucional</p>
        </div>

        <Field label="Correo Duoc UC" type="email" value={email} onChange={setEmail}
          placeholder="usuario@duocuc.cl" icon="📧" />
        <Field label="Contraseña" type="password" value={password} onChange={setPassword}
          placeholder="Tu contraseña" icon="🔒" />

        {error && (
          <div style={{ background: COLORS.accent + "15", border: `1px solid ${COLORS.accent}33`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 12, color: COLORS.accent }}>{error}</p>
          </div>
        )}

        <Btn onClick={() => handleLogin()} style={{ width: "100%", marginBottom: 20 }}>
          Ingresar
        </Btn>

        {/* Quick access */}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 18 }}>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: COLORS.muted, textAlign: "center", fontWeight: 600 }}>
            ⚡ Acceso rápido (demo)
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => handleLogin("admin@duocuc.cl", "admin123")} style={{
              flex: 1, padding: "12px 8px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
              background: "linear-gradient(135deg, #1a0533, #3d0066)",
              border: "none", color: "#fff", textAlign: "center",
            }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>🛡️</div>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Admin</div>
              <div style={{ fontSize: 10, opacity: .7 }}>admin@duocuc.cl</div>
              <div style={{ fontSize: 10, opacity: .7 }}>admin123</div>
            </button>
            <button onClick={() => handleLogin("alumno@duocuc.cl", "alumno123")} style={{
              flex: 1, padding: "12px 8px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
              background: `linear-gradient(135deg, ${COLORS.primary}, #1a4fa3)`,
              border: "none", color: "#fff", textAlign: "center",
            }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>🎓</div>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Alumno</div>
              <div style={{ fontSize: 10, opacity: .7 }}>alumno@duocuc.cl</div>
              <div style={{ fontSize: 10, opacity: .7 }}>alumno123</div>
            </button>
          </div>
        </div>
      </Card>

      <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: COLORS.muted }}>
        ¿Primera vez? <button onClick={() => onLogin({ __register: true })} style={{
          background: "none", border: "none", color: COLORS.primary, cursor: "pointer",
          fontWeight: 700, fontSize: 11, fontFamily: "inherit",
        }}>Regístrate aquí</button>
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════════
function DuocParking() {
  const [session, setSession] = useState(null); // null = login, {role} = logged in
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState({ name: "", email: "", password: "" });
  const [docData, setDocData] = useState({ rut: "", docType: "", docFile: "" });
  const [vehicle, setVehicle] = useState({ patent: "", vehicleType: "", brand: "", model: "", color: "" });
  const [reserveSpot, setReserveSpot] = useState(null);

  const stepLabels = ["Cuenta", "Email", "Doc.", "Patente", "App"];

  const handleLogin = (user) => {
    if (user.__register) { setSession("register"); return; }
    setSession(user);
  };

  const handleLogout = () => {
    setSession(null);
    setStep(0);
    setAccount({ name: "", email: "", password: "" });
    setDocData({ rut: "", docType: "", docFile: "" });
    setVehicle({ patent: "", vehicleType: "", brand: "", model: "", color: "" });
  };

  const containerStyle = {
    minHeight: "100vh",
    background: session?.role === "admin" ? "#0f0020" : COLORS.bg,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: COLORS.text,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 0 40px",
  };

  const isRegister = session === "register";
  const showSteps = isRegister && step < 4;

  const headerStyle = {
    width: "100%",
    background: session?.role === "admin"
      ? "linear-gradient(135deg, #1a0533 0%, #3d0066 100%)"
      : `linear-gradient(135deg, ${COLORS.primary} 0%, #1a4fa3 100%)`,
    padding: "18px 24px 24px",
    boxSizing: "border-box",
    marginBottom: 28,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: showSteps ? 20 : 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>🅿️</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: -.3 }}>Duoc Parking</div>
            <div style={{ color: "#ffffff99", fontSize: 11 }}>
              {session?.role === "admin" ? "Panel de Administración" : "Sistema de estacionamiento institucional"}
            </div>
          </div>
          {session?.role === "admin" && (
            <span style={{
              marginLeft: "auto", background: COLORS.gold, color: "#000",
              fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
            }}>ADMIN</span>
          )}
          {session?.role === "user" && (
            <button onClick={handleLogout} style={{
              marginLeft: "auto", background: "#ffffff22", border: "none",
              color: "#fff", borderRadius: 8, padding: "6px 12px",
              cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit",
            }}>Salir</button>
          )}
        </div>

        {showSteps && (
          <StepIndicator step={step} total={5} labels={stepLabels} />
        )}
      </div>

      {/* Content */}
      {!session && <LoginScreen onLogin={handleLogin} />}

      {session?.role === "admin" && (
        <AdminDashboard account={session} onLogout={handleLogout} />
      )}

      {(session?.role === "user" || isRegister) && (
        <div style={{ width: "100%", maxWidth: 480, padding: "0 16px", boxSizing: "border-box" }}>
          {step === 0 && (
            <Card>
              <AccountStep data={account} setData={setAccount} onNext={() => setStep(1)} />
            </Card>
          )}
          {step === 1 && (
            <Card>
              <EmailVerifyStep email={account.email} onNext={() => setStep(2)} />
            </Card>
          )}
          {step === 2 && (
            <Card>
              <DocumentStep data={docData} setData={setDocData} onNext={() => setStep(3)} />
            </Card>
          )}
          {step === 3 && (
            <Card>
              <PatentStep data={vehicle} setData={setVehicle} onNext={() => setStep(4)} />
            </Card>
          )}
          {step === 4 && (
            <Dashboard
              account={session?.role === "user" ? session : account}
              vehicle={session?.role === "user" ? { patent: session.patent, vehicleType: session.vehicleType, brand: session.brand } : vehicle}
              onReserve={setReserveSpot}
            />
          )}
          {step === 0 && isRegister && (
            <button onClick={() => setSession(null)} style={{
              marginTop: 12, background: "none", border: "none", color: COLORS.muted,
              cursor: "pointer", fontSize: 12, fontFamily: "inherit",
            }}>← Volver al login</button>
          )}
        </div>
      )}

      {/* Reserve Modal */}
      {reserveSpot && (
        <ReserveModal
          spot={reserveSpot}
          vehicle={session?.role === "user" ? { patent: session.patent } : vehicle}
          onConfirm={() => {}}
          onClose={() => setReserveSpot(null)}
        />
      )}
    </div>
  );
}
export default DuocParking;
