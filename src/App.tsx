import React, { useState, useEffect, useRef } from "react";

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
  {
    email: "docente@duocuc.cl",
    password: "docente123",
    name: "Docente Demo",
    role: "teacher",
    rut: "15.678.901-2",
    patent: "DOC001",
    vehicleType: "auto",
    brand: "Mazda",
  },
];

// ─── Campuses / Sedes ───────────────────────────────────────────────────────────
const CAMPUSES = [
  { id: "vespucio", name: "Sede Vespucio", short: "Vespucio", isMain: true, address: "Av. Vespucio, La Florida" },
  { id: "sanjoaquin", name: "Sede San Joaquín", short: "San Joaquín", isMain: false, address: "San Joaquín, Santiago" },
  { id: "puentealto", name: "Sede Puente Alto", short: "Puente Alto", isMain: false, address: "Puente Alto, Santiago" },
];

const mockSpotsByCampus = {
  vespucio: [
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
    { id: "D01", zone: "D", type: "docente", status: "free" },
    { id: "D02", zone: "D", type: "docente", status: "occupied" },
    { id: "D03", zone: "D", type: "docente", status: "free" },
  ],
  sanjoaquin: [
    { id: "A01", zone: "A", type: "regular", status: "free" },
    { id: "A02", zone: "A", type: "regular", status: "free" },
    { id: "A03", zone: "A", type: "discapacidad", status: "free" },
    { id: "A04", zone: "A", type: "regular", status: "occupied" },
    { id: "B01", zone: "B", type: "regular", status: "occupied" },
    { id: "B02", zone: "B", type: "regular", status: "free" },
    { id: "B03", zone: "B", type: "moto", status: "occupied" },
    { id: "B04", zone: "B", type: "regular", status: "reserved" },
    { id: "C01", zone: "C", type: "regular", status: "free" },
    { id: "C02", zone: "C", type: "regular", status: "occupied" },
    { id: "C03", zone: "C", type: "regular", status: "free" },
    { id: "D01", zone: "D", type: "docente", status: "free" },
    { id: "D02", zone: "D", type: "docente", status: "free" },
  ],
  puentealto: [
    { id: "A01", zone: "A", type: "regular", status: "occupied" },
    { id: "A02", zone: "A", type: "regular", status: "free" },
    { id: "A03", zone: "A", type: "discapacidad", status: "reserved" },
    { id: "A04", zone: "A", type: "regular", status: "free" },
    { id: "A05", zone: "A", type: "regular", status: "occupied" },
    { id: "B01", zone: "B", type: "regular", status: "free" },
    { id: "B02", zone: "B", type: "moto", status: "free" },
    { id: "B03", zone: "B", type: "regular", status: "free" },
    { id: "C01", zone: "C", type: "regular", status: "occupied" },
    { id: "C02", zone: "C", type: "regular", status: "free" },
    { id: "D01", zone: "D", type: "docente", status: "occupied" },
    { id: "D02", zone: "D", type: "docente", status: "free" },
  ],
};

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

  const generateRandomPatent = () => {
    const letters = "ABCDEFGHJKLMNPRSTUVWXYZ";
    const digits = "0123456789";
    const rand = (chars, n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    // Formato chileno actual: 4 letras + 2 dígitos (ej: BCDF12)
    return rand(letters, 4) + rand(digits, 2);
  };

  const fillRandomTestData = () => {
    const types = ["auto", "moto", "camioneta"];
    const brands = ["Toyota", "Chevrolet", "Hyundai", "Suzuki", "Nissan", "Mazda", "Yamaha", "Kia"];
    const models = ["Yaris", "Sail", "Accent", "Swift", "Versa", "CX-3", "FZ25", "Rio"];
    const colors = ["Blanco", "Gris", "Negro", "Rojo", "Azul", "Plata"];
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    setData({
      ...data,
      patent: generateRandomPatent(),
      vehicleType: pick(types),
      brand: pick(brands),
      model: pick(models),
      color: pick(colors),
    });
  };

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>
            🔤 Patente
          </label>
          <button onClick={fillRandomTestData} type="button" style={{
            background: "#F1F5FF", border: `1px solid ${COLORS.border}`, color: COLORS.primary,
            borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            🎲 Autorrellenar (prueba)
          </button>
        </div>
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

// ── Parking Timer + Cobro Alert ─────────────────────────────────────────────────
const FREE_MINUTES = 30; // minutos gratis antes de empezar a cobrar
const WARNING_MINUTES = 5; // minutos antes del cobro para avisar

function ParkingTimer({ reservation, onEnd }) {
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!reservation) return;
    const tick = () => {
      setElapsedSec(Math.floor((Date.now() - reservation.startedAt) / 1000));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [reservation]);

  if (!reservation) return null;

  const elapsedMin = elapsedSec / 60;
  const remainingFreeSec = Math.max(0, FREE_MINUTES * 60 - elapsedSec);
  const remainingFreeMin = Math.floor(remainingFreeSec / 60);
  const remainingFreeSecOnly = remainingFreeSec % 60;

  const isWarning = remainingFreeMin <= WARNING_MINUTES && remainingFreeSec > 0;
  const isCharging = remainingFreeSec === 0;

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = n => String(n).padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  return (
    <Card style={{
      marginBottom: 16,
      background: isCharging
        ? `linear-gradient(135deg, ${COLORS.accent} 0%, #b3001a 100%)`
        : isWarning
          ? `linear-gradient(135deg, ${COLORS.gold} 0%, #d68a00 100%)`
          : `linear-gradient(135deg, ${COLORS.primary} 0%, #1a4fa3 100%)`,
      color: "#fff",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, opacity: .8 }}>
            ⏱ Tiempo en estacionamiento · Espacio {reservation.spotId}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 800, fontFamily: "monospace" }}>
            {formatTime(elapsedSec)}
          </p>
        </div>
        <button onClick={onEnd} style={{
          background: "#ffffff22", border: "1px solid #ffffff44", color: "#fff",
          borderRadius: 10, padding: "8px 14px", cursor: "pointer",
          fontSize: 12, fontWeight: 700, fontFamily: "inherit",
        }}>
          Finalizar
        </button>
      </div>

      {!isCharging && (
        <div style={{
          marginTop: 12, padding: "10px 12px", borderRadius: 10,
          background: "#ffffff22", fontSize: 12,
        }}>
          {isWarning ? (
            <>⚠️ En <strong>{formatTime(remainingFreeSec)}</strong> se comenzará a cobrar por el uso del estacionamiento.</>
          ) : (
            <>🅿️ Tiempo gratuito restante: <strong>{formatTime(remainingFreeSec)}</strong></>
          )}
        </div>
      )}

      {isCharging && (
        <div style={{
          marginTop: 12, padding: "10px 12px", borderRadius: 10,
          background: "#ffffff22", fontSize: 12,
        }}>
          💰 Se está cobrando por el tiempo excedido desde hace {formatTime(elapsedSec - FREE_MINUTES * 60)}.
        </div>
      )}
    </Card>
  );
}

// ── Incident Report Modal ───────────────────────────────────────────────────────
const incidentTypes = [
  { id: "ocupado_indebido", label: "Vehículo en espacio incorrecto", icon: "🚫" },
  { id: "doble_estacionado", label: "Vehículo mal estacionado / doble fila", icon: "🚧" },
  { id: "espacio_bloqueado", label: "Espacio bloqueado / inutilizable", icon: "⛔" },
  { id: "vandalismo", label: "Daño o vandalismo", icon: "🔨" },
  { id: "otro", label: "Otro motivo", icon: "❓" },
];

function IncidentModal({ onClose, onSubmit }) {
  const [type, setType] = useState("");
  const [spotId, setSpotId] = useState("");
  const [description, setDescription] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    setSent(true);
    setTimeout(() => {
      onSubmit({ type, spotId, description, createdAt: Date.now() });
      onClose();
    }, 1500);
  };

  if (sent) return (
    <div style={{
      position: "fixed", inset: 0, background: "#000a", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
    }}>
      <Card style={{ maxWidth: 320, width: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>📨</div>
        <h3 style={{ color: COLORS.success, margin: "0 0 8px" }}>¡Reporte enviado!</h3>
        <p style={{ color: COLORS.muted, fontSize: 13 }}>El equipo de administración revisará tu incidencia.</p>
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
        maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: COLORS.primary }}>🚨 Informar incidencia</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 8 }}>
            Tipo de incidencia
          </label>
          {incidentTypes.map(t => (
            <div key={t.id} onClick={() => setType(t.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10, marginBottom: 8, cursor: "pointer",
              border: `2px solid ${type === t.id ? COLORS.primary : COLORS.border}`,
              background: type === t.id ? "#EEF2FF" : "#FAFBFF",
              color: type === t.id ? COLORS.primary : COLORS.text,
              fontWeight: 600, fontSize: 13,
            }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>{t.label}
            </div>
          ))}
        </div>

        <Field label="Espacio afectado (opcional)" value={spotId} onChange={setSpotId}
          placeholder="Ej: A02" icon="🅿️" />

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
            📝 Descripción
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Describe brevemente la situación..."
            rows={4}
            style={{
              width: "100%", padding: "11px 14px", fontSize: 14, border: `2px solid ${COLORS.border}`,
              borderRadius: 10, outline: "none", background: "#FAFBFF", color: COLORS.text,
              fontFamily: "inherit", boxSizing: "border-box", resize: "vertical",
            }}
          />
        </div>

        <Btn onClick={submit} disabled={!type} variant="accent" style={{ width: "100%" }}>
          🚨 Enviar reporte
        </Btn>
      </div>
    </div>
  );
}

// ── Account Modal: QR access + payment history ──────────────────────────────────
function QRCodeVisual({ data, size = 180 }) {
  // Deterministic pseudo-QR pattern generated from the data string (demo only)
  const gridSize = 12;
  let seed = 0;
  for (let i = 0; i < data.length; i++) seed = (seed * 31 + data.charCodeAt(i)) % 100000;

  const cells = [];
  let s = seed || 1;
  for (let i = 0; i < gridSize * gridSize; i++) {
    s = (s * 9301 + 49297) % 233280;
    cells.push(s / 233280 < 0.5);
  }

  const cell = size / gridSize;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", borderRadius: 8 }}>
      <rect width={size} height={size} fill="#fff" />
      {cells.map((on, i) => {
        const x = (i % gridSize) * cell;
        const y = Math.floor(i / gridSize) * cell;
        // Force corner finder patterns like a real QR
        const isCorner =
          (x < cell * 3 && y < cell * 3) ||
          (x >= size - cell * 3 && y < cell * 3) ||
          (x < cell * 3 && y >= size - cell * 3);
        const fill = isCorner ? true : on;
        return fill ? (
          <rect key={i} x={x} y={y} width={cell} height={cell} fill={COLORS.text} />
        ) : null;
      })}
    </svg>
  );
}

function AccountModal({ account, vehicle, paymentHistory, onClose }) {
  const [tab, setTab] = useState("qr");
  const qrData = `DUOC-PARKING|${vehicle.patent}|${account.rut || ""}|${Date.now().toString().slice(0, 8)}`;
  const totalPaid = paymentHistory.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000a", display: "flex",
      alignItems: "flex-end", justifyContent: "center", zIndex: 100,
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px 20px 0 0", padding: 28, width: "100%", maxWidth: 480,
        maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: COLORS.primary }}>👤 Mi cuenta</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[
            { id: "qr", label: "🚗 QR de acceso" },
            { id: "payments", label: "💳 Historial de pagos" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer",
              background: tab === t.id ? COLORS.primary : "#F1F5FF",
              color: tab === t.id ? "#fff" : COLORS.primary, fontWeight: 700, fontSize: 12, fontFamily: "inherit",
            }}>{t.label}</button>
          ))}
        </div>

        {tab === "qr" && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "inline-block", padding: 16, borderRadius: 16,
              border: `2px solid ${COLORS.border}`, background: "#FAFBFF", marginBottom: 16,
            }}>
              <QRCodeVisual data={qrData} />
            </div>
            <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: COLORS.text }}>
              {account?.name}
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: COLORS.muted }}>
              🚗 Patente: <strong>{vehicle.patent}</strong>
            </p>
            <div style={{ background: "#F0F4FF", borderRadius: 10, padding: "10px 14px", fontSize: 11, color: COLORS.muted }}>
              Muestra este código al guardia o escáner de acceso para verificar tu identidad y patente.
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div>
            <Card style={{ marginBottom: 14, background: COLORS.primary + "11", border: `2px solid ${COLORS.primary}22` }}>
              <p style={{ margin: 0, fontSize: 12, color: COLORS.muted }}>Total pagado por excedentes</p>
              <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 800, color: COLORS.primary }}>
                ${totalPaid.toLocaleString("es-CL")}
              </p>
            </Card>

            {paymentHistory.length === 0 ? (
              <Card style={{ textAlign: "center", padding: 30 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <p style={{ margin: 0, color: COLORS.muted, fontSize: 13 }}>
                  No tienes cargos por tiempo excedido.
                </p>
              </Card>
            ) : (
              paymentHistory.slice().reverse().map((p, idx) => {
                const date = new Date(p.date);
                return (
                  <Card key={idx} style={{ marginBottom: 10, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>🅿️ Espacio {p.spotId}</div>
                        <div style={{ fontSize: 11, color: COLORS.muted }}>
                          {p.minutesOver} min excedidos · {date.toLocaleDateString("es-CL")} {date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.accent }}>
                        ${p.amount.toLocaleString("es-CL")}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── 5. Dashboard principal ─────────────────────────────────────────────────────
function Dashboard({ account, vehicle, onReserve, activeReservation, onEndReservation, onReportIncident, campus, onOpenAccount, waitlist }) {
  const [spots] = useState((mockSpotsByCampus[campus?.id] || []).filter(s => s.zone !== "D"));
  const [selectedZone, setSelectedZone] = useState("all");
  const [tab, setTab] = useState("mapa");

  const allZones = Array.from(new Set(spots.map(s => s.zone))).sort();
  const zones = ["all", ...allZones];
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
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge color="#fff">{vehicle.patent}</Badge>
              {campus && <Badge color={COLORS.gold}>📍 {campus.short}</Badge>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, opacity: .7 }}>Espacios libres</p>
            <p style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>{free}</p>
            <p style={{ margin: 0, fontSize: 11, opacity: .7 }}>de {spots.length} totales</p>
          </div>
        </div>
      </div>

      {/* Parking Timer */}
      <ParkingTimer reservation={activeReservation} onEnd={onEndReservation} />

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
              <div key={s.id} onClick={() => onReserve(s)}
                style={{
                  padding: "12px 8px", borderRadius: 12, textAlign: "center",
                  border: `2px solid ${statusColor[s.status]}22`,
                  background: s.status === "free" ? statusColor[s.status] + "11" : "#F9FAFB",
                  cursor: "pointer",
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

      {/* Waitlist */}
      {waitlist && waitlist.filter(w => w.patent === vehicle.patent).length > 0 && (
        <Card style={{ marginTop: 16, background: COLORS.gold + "11", border: `2px solid ${COLORS.gold}33` }}>
          <h4 style={{ margin: "0 0 8px", color: COLORS.gold, fontSize: 13 }}>📝 En lista de espera</h4>
          {waitlist.filter(w => w.patent === vehicle.patent).map((w, i) => (
            <p key={i} style={{ margin: "4px 0", fontSize: 12, color: COLORS.muted }}>
              🅿️ Espacio {w.spotId} (Zona {w.zone}) · Te avisaremos cuando se libere.
            </p>
          ))}
        </Card>
      )}

      {/* Account / QR / Payments button */}
      <button onClick={onOpenAccount} style={{
        width: "100%", marginTop: 16, padding: "13px 0", borderRadius: 12,
        border: `2px solid ${COLORS.primary}33`, background: COLORS.primary + "11",
        color: COLORS.primary, fontWeight: 700, fontSize: 14, cursor: "pointer",
        fontFamily: "inherit", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8,
      }}>
        👤 Mi cuenta — QR y pagos
      </button>

      {/* Incident report button */}
      <button onClick={onReportIncident} style={{
        width: "100%", marginTop: 10, padding: "13px 0", borderRadius: 12,
        border: `2px solid ${COLORS.accent}33`, background: COLORS.accent + "11",
        color: COLORS.accent, fontWeight: 700, fontSize: 14, cursor: "pointer",
        fontFamily: "inherit", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8,
      }}>
        🚨 Informar incidencia
      </button>
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
function ReserveModal({ spot, vehicle, onConfirm, onClose, onJoinWaitlist }) {
  const [mode, setMode] = useState("ahora"); // "ahora" | "anticipada"
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [confirmed, setConfirmed] = useState(false);
  const [waitlisted, setWaitlisted] = useState(false);

  const isFull = spot.status !== "free";

  const confirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onConfirm({
        spotId: spot.id,
        zone: spot.zone,
        time: mode === "anticipada" ? time : "Ahora",
        duration: parseInt(duration, 10),
        startedAt: Date.now(),
        anticipada: mode === "anticipada",
      });
      onClose();
    }, 2000);
  };

  const joinWaitlist = () => {
    setWaitlisted(true);
    setTimeout(() => {
      onJoinWaitlist?.({ spotId: spot.id, zone: spot.zone, patent: vehicle.patent, requestedAt: Date.now() });
      onClose();
    }, 1500);
  };

  if (waitlisted) return (
    <div style={{
      position: "fixed", inset: 0, background: "#000a", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
    }}>
      <Card style={{ maxWidth: 320, width: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>📝</div>
        <h3 style={{ color: COLORS.gold, margin: "0 0 8px" }}>¡Anotado en lista de espera!</h3>
        <p style={{ color: COLORS.muted, fontSize: 13 }}>Te avisaremos cuando el espacio {spot.id} esté disponible.</p>
      </Card>
    </div>
  );

  if (confirmed) return (
    <div style={{
      position: "fixed", inset: 0, background: "#000a", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
    }}>
      <Card style={{ maxWidth: 320, width: "100%", textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
        <h3 style={{ color: COLORS.success, margin: "0 0 8px" }}>¡Reserva confirmada!</h3>
        <p style={{ color: COLORS.muted, fontSize: 13 }}>
          {mode === "anticipada"
            ? `Espacio ${spot.id} reservado para las ${time}`
            : `Espacio ${spot.id} reservado, ¡tu cronómetro ya está en marcha!`}
        </p>
      </Card>
    </div>
  );

  // Spot is occupied/reserved → offer waitlist instead
  if (isFull) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#000a", display: "flex",
        alignItems: "flex-end", justifyContent: "center", zIndex: 100,
      }}>
        <div style={{
          background: "#fff", borderRadius: "20px 20px 0 0", padding: 28, width: "100%", maxWidth: 480,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, color: COLORS.primary }}>Espacio {spot.id} no disponible</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>✕</button>
          </div>

          <div style={{ background: COLORS.gold + "15", borderRadius: 12, padding: 16, marginBottom: 18, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.text }}>
              Este espacio está actualmente <strong>{spot.status === "occupied" ? "ocupado" : "reservado"}</strong>.
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: COLORS.muted }}>
              Puedes anotarte en la lista de espera y te avisaremos cuando se libere.
            </p>
          </div>

          <Btn onClick={joinWaitlist} variant="accent" style={{ width: "100%" }}>
            📝 Unirme a la lista de espera
          </Btn>
        </div>
      </div>
    );
  }

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

        {/* Mode selector: ahora vs anticipada */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 8 }}>
            🗓 ¿Cuándo usarás el espacio?
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setMode("ahora")} style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
              background: mode === "ahora" ? COLORS.primary : "#F1F5FF",
              color: mode === "ahora" ? "#fff" : COLORS.primary, fontWeight: 700, fontSize: 13, fontFamily: "inherit",
            }}>
              🚗 Ahora
            </button>
            <button onClick={() => setMode("anticipada")} style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
              background: mode === "anticipada" ? COLORS.primary : "#F1F5FF",
              color: mode === "anticipada" ? "#fff" : COLORS.primary, fontWeight: 700, fontSize: 13, fontFamily: "inherit",
            }}>
              🕐 Más tarde (anticipada)
            </button>
          </div>
        </div>

        {mode === "anticipada" && (
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
        )}

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

        <Btn onClick={confirm} disabled={mode === "anticipada" && !time} style={{ width: "100%" }}>
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

function AdminDashboard({ account, onLogout, incidents = [] }) {
  const [adminTab, setAdminTab] = useState("overview");
  const [selectedCampus, setSelectedCampus] = useState(CAMPUSES[0].id);
  const [users, setUsers] = useState(mockUsers);
  const [spotsByCampus, setSpotsByCampus] = useState(mockSpotsByCampus);
  const [reservations] = useState(mockReservations);
  const [editUser, setEditUser] = useState(null);
  const [toast, setToast] = useState(null);

  const spots = spotsByCampus[selectedCampus] || [];
  const setSpots = (updater) => {
    setSpotsByCampus(prev => ({
      ...prev,
      [selectedCampus]: typeof updater === "function" ? updater(prev[selectedCampus]) : updater,
    }));
  };

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
    { id: "incidents", label: "Incidencias", icon: "🚨" },
    { id: "reports", label: "Reportes", icon: "📈" },
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

      {/* Campus selector */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: COLORS.muted }}>
          📍 Sede a administrar
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {CAMPUSES.map(c => (
            <button key={c.id} onClick={() => setSelectedCampus(c.id)} style={{
              flex: 1, padding: "10px 6px", borderRadius: 10, border: "none", cursor: "pointer",
              background: selectedCampus === c.id ? "#3d0066" : "#F1F5FF",
              color: selectedCampus === c.id ? "#fff" : "#3d0066",
              fontWeight: 700, fontSize: 12, fontFamily: "inherit", textAlign: "center",
            }}>
              {c.isMain && "⭐ "}{c.short}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 18 }}>
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
            {Array.from(new Set(spots.map(s => s.zone))).sort().map(zone => {
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

      {/* ── INCIDENTS ── */}
      {adminTab === "incidents" && (
        <div>
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 12px" }}>
            Incidencias reportadas por alumnos y docentes.
          </p>
          {incidents.length === 0 && (
            <Card style={{ textAlign: "center", padding: 30 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <p style={{ margin: 0, color: COLORS.muted, fontSize: 13 }}>No hay incidencias reportadas.</p>
            </Card>
          )}
          {incidents.slice().reverse().map((inc, idx) => {
            const t = incidentTypes.find(it => it.id === inc.type) || incidentTypes[incidentTypes.length - 1];
            const date = new Date(inc.createdAt);
            return (
              <Card key={idx} style={{ marginBottom: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
                      {t.icon} {t.label}
                    </div>
                    {inc.spotId && (
                      <div style={{ fontSize: 11, color: COLORS.muted }}>🅿️ Espacio {inc.spotId}</div>
                    )}
                    {inc.description && (
                      <div style={{ fontSize: 12, color: COLORS.text, marginTop: 4 }}>{inc.description}</div>
                    )}
                    <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4 }}>
                      {date.toLocaleDateString("es-CL")} {date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <Badge color={COLORS.accent}>Nueva</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── REPORTS ── */}
      {adminTab === "reports" && (
        <ReportsTab spots={spots} reservations={reservations} incidents={incidents} users={users} />
      )}
    </div>
  );
}

// ── Reports Tab ─────────────────────────────────────────────────────────────────
function ReportsTab({ spots, reservations, incidents, users }) {
  const free = spots.filter(s => s.status === "free").length;
  const occupied = spots.filter(s => s.status === "occupied").length;
  const reserved = spots.filter(s => s.status === "reserved").length;
  const maintenance = spots.filter(s => s.status === "maintenance").length;
  const total = spots.length;

  const occupancyByZone = Array.from(new Set(spots.map(s => s.zone))).sort().map(zone => {
    const zSpots = spots.filter(s => s.zone === zone);
    const occ = zSpots.filter(s => s.status !== "free").length;
    return { zone, occ, total: zSpots.length, pct: Math.round((occ / zSpots.length) * 100) };
  });

  const reservationsByStatus = ["active", "completed", "cancelled"].map(st => ({
    status: st,
    count: reservations.filter(r => r.status === st).length,
  }));

  const incidentsByType = incidentTypes.map(t => ({
    ...t,
    count: incidents.filter(i => i.type === t.id).length,
  })).filter(t => t.count > 0);

  const statusLabels = { active: "Activas", completed: "Completadas", cancelled: "Canceladas" };
  const statusColors2 = { active: COLORS.success, completed: COLORS.muted, cancelled: COLORS.accent };

  const exportCSV = () => {
    const rows = [
      ["Reporte de Estacionamiento Duoc"],
      [""],
      ["Resumen general"],
      ["Espacios totales", total],
      ["Libres", free],
      ["Ocupados", occupied],
      ["Reservados", reserved],
      ["En mantención", maintenance],
      [""],
      ["Ocupación por zona"],
      ["Zona", "Ocupados", "Total", "Porcentaje"],
      ...occupancyByZone.map(z => [z.zone, z.occ, z.total, `${z.pct}%`]),
      [""],
      ["Reservas"],
      ["Estado", "Cantidad"],
      ...reservationsByStatus.map(r => [statusLabels[r.status], r.count]),
      [""],
      ["Incidencias"],
      ["Tipo", "Cantidad"],
      ...incidentsByType.map(i => [i.label, i.count]),
      [""],
      ["Usuarios"],
      ["Total", users.length],
      ["Activos", users.filter(u => u.status === "active").length],
      ["Suspendidos", users.filter(u => u.status === "suspended").length],
    ];
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-estacionamiento-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const BarRow = ({ label, value, max, color }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ color: COLORS.muted }}>{value}</span>
      </div>
      <div style={{ height: 8, background: "#EEF2FF", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${max > 0 ? (value / max) * 100 : 0}%`, borderRadius: 4,
          background: color, transition: "width .5s",
        }} />
      </div>
    </div>
  );

  return (
    <div>
      <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 12px" }}>
        Estadísticas generales de la sede seleccionada.
      </p>

      <Card style={{ marginBottom: 14 }}>
        <h4 style={{ margin: "0 0 12px", color: COLORS.primary, fontSize: 14 }}>📊 Estado general de espacios</h4>
        <BarRow label="✅ Libres" value={free} max={total} color={COLORS.success} />
        <BarRow label="🔴 Ocupados" value={occupied} max={total} color={COLORS.accent} />
        <BarRow label="⏳ Reservados" value={reserved} max={total} color={COLORS.gold} />
        {maintenance > 0 && <BarRow label="🔧 En mantención" value={maintenance} max={total} color={COLORS.muted} />}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <h4 style={{ margin: "0 0 12px", color: COLORS.primary, fontSize: 14 }}>📈 Ocupación por zona</h4>
        {occupancyByZone.map(z => (
          <BarRow key={z.zone} label={`Zona ${z.zone}`} value={z.occ} max={z.total}
            color={z.pct > 75 ? COLORS.accent : z.pct > 40 ? COLORS.gold : COLORS.success} />
        ))}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <h4 style={{ margin: "0 0 12px", color: COLORS.primary, fontSize: 14 }}>📋 Reservas por estado</h4>
        {reservationsByStatus.map(r => (
          <BarRow key={r.status} label={statusLabels[r.status]} value={r.count}
            max={Math.max(...reservationsByStatus.map(x => x.count), 1)} color={statusColors2[r.status]} />
        ))}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <h4 style={{ margin: "0 0 12px", color: COLORS.primary, fontSize: 14 }}>🚨 Incidencias por tipo</h4>
        {incidentsByType.length === 0 ? (
          <p style={{ margin: 0, fontSize: 12, color: COLORS.muted }}>Sin incidencias registradas.</p>
        ) : (
          incidentsByType.map(t => (
            <BarRow key={t.id} label={`${t.icon} ${t.label}`} value={t.count}
              max={Math.max(...incidentsByType.map(x => x.count), 1)} color={COLORS.accent} />
          ))
        )}
      </Card>

      <Btn onClick={exportCSV} style={{ width: "100%" }}>
        📥 Exportar reporte (CSV)
      </Btn>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
function TeacherDashboard({ account, vehicle, onReserve, activeReservation, onEndReservation, onReportIncident, campus, onOpenAccount, waitlist }) {
  const [spots] = useState(mockSpotsByCampus[campus?.id] || []);
  const [tab, setTab] = useState("docentes");

  const teacherSpots = spots.filter(s => s.zone === "D");
  const freeTeacher = teacherSpots.filter(s => s.status === "free").length;

  const statusColor = { free: COLORS.success, occupied: COLORS.accent, reserved: COLORS.gold };
  const statusLabel = { free: "Libre", occupied: "Ocupado", reserved: "Reservado" };

  return (
    <div style={{ width: "100%", maxWidth: 480, padding: "0 16px", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #0E7C7B 0%, #134E4A 100%)`,
        borderRadius: 18, padding: "20px 22px", marginBottom: 20, color: "#fff",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, opacity: .75 }}>Bienvenido/a</p>
            <h3 style={{ margin: "2px 0 4px", fontSize: 20 }}>{account.name.split(" ")[0]} 👋</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge color="#fff">{vehicle.patent}</Badge>
              <span style={{
                background: "#ffffff22", color: "#fff", fontSize: 10, fontWeight: 800,
                padding: "3px 10px", borderRadius: 20,
              }}>DOCENTE</span>
              {campus && <Badge color={COLORS.gold}>📍 {campus.short}</Badge>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, opacity: .7 }}>Espacios docentes libres</p>
            <p style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>{freeTeacher}</p>
            <p style={{ margin: 0, fontSize: 11, opacity: .7 }}>de {teacherSpots.length} reservados</p>
          </div>
        </div>
      </div>

      {/* Parking Timer */}
      <ParkingTimer reservation={activeReservation} onEnd={onEndReservation} />

      {/* Priority access banner */}
      <Card style={{ marginBottom: 16, background: "#0E7C7B11", border: `2px solid #0E7C7B33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎓</span>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0E7C7B" }}>Acceso prioritario docente</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: COLORS.muted }}>
              La zona D está reservada exclusivamente para personal docente.
            </p>
          </div>
        </div>
      </Card>

      {/* Teacher spots grid */}
      <h4 style={{ margin: "0 0 10px", color: "#0E7C7B", fontSize: 14 }}>🅿️ Espacios docentes — Zona D</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
        {teacherSpots.map(s => (
          <div key={s.id} onClick={() => onReserve(s)}
            style={{
              padding: "14px 8px", borderRadius: 12, textAlign: "center",
              border: `2px solid ${statusColor[s.status]}33`,
              background: s.status === "free" ? statusColor[s.status] + "11" : "#F9FAFB",
              cursor: "pointer",
              transition: "transform .15s",
            }}>
            <div style={{ fontSize: 22 }}>🎓</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{s.id}</div>
            <Badge color={statusColor[s.status]}>{statusLabel[s.status]}</Badge>
          </div>
        ))}
      </div>

      {/* Tabs for general view + schedule */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["general", "horario"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer",
            background: tab === t ? "#0E7C7B" : "#F1F5FF",
            color: tab === t ? "#fff" : "#0E7C7B", fontWeight: 700, fontSize: 13, fontFamily: "inherit",
          }}>
            {t === "general" ? "🗺 Otros espacios" : "🕐 Horarios"}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {spots.filter(s => s.zone !== "D").map(s => (
            <div key={s.id} onClick={() => onReserve(s)}
              style={{
                padding: "12px 8px", borderRadius: 12, textAlign: "center",
                border: `2px solid ${statusColor[s.status]}22`,
                background: s.status === "free" ? statusColor[s.status] + "11" : "#F9FAFB",
                cursor: "pointer",
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
      )}

      {tab === "horario" && <ScheduleView />}

      {/* Waitlist */}
      {waitlist && waitlist.filter(w => w.patent === vehicle.patent).length > 0 && (
        <Card style={{ marginTop: 16, background: COLORS.gold + "11", border: `2px solid ${COLORS.gold}33` }}>
          <h4 style={{ margin: "0 0 8px", color: COLORS.gold, fontSize: 13 }}>📝 En lista de espera</h4>
          {waitlist.filter(w => w.patent === vehicle.patent).map((w, i) => (
            <p key={i} style={{ margin: "4px 0", fontSize: 12, color: COLORS.muted }}>
              🅿️ Espacio {w.spotId} (Zona {w.zone}) · Te avisaremos cuando se libere.
            </p>
          ))}
        </Card>
      )}

      {/* Account / QR / Payments button */}
      <button onClick={onOpenAccount} style={{
        width: "100%", marginTop: 16, padding: "13px 0", borderRadius: 12,
        border: `2px solid #0E7C7B33`, background: "#0E7C7B11",
        color: "#0E7C7B", fontWeight: 700, fontSize: 14, cursor: "pointer",
        fontFamily: "inherit", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8,
      }}>
        👤 Mi cuenta — QR y pagos
      </button>

      {/* Incident report button */}
      <button onClick={onReportIncident} style={{
        width: "100%", marginTop: 10, padding: "13px 0", borderRadius: 12,
        border: `2px solid ${COLORS.accent}33`, background: COLORS.accent + "11",
        color: COLORS.accent, fontWeight: 700, fontSize: 14, cursor: "pointer",
        fontFamily: "inherit", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8,
      }}>
        🚨 Informar incidencia
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// CAMPUS SELECT SCREEN
// ════════════════════════════════════════════════════════════════════════════════
function CampusSelectScreen({ account, onSelect, onLogout }) {
  return (
    <div style={{ width: "100%", maxWidth: 480, padding: "0 16px", boxSizing: "border-box" }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📍</div>
          <h2 style={{ margin: 0, color: COLORS.primary, fontSize: 22 }}>Selecciona tu sede</h2>
          <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: 13 }}>
            Hola {account?.name?.split(" ")[0]}, elige la sede donde estacionarás
          </p>
        </div>

        {CAMPUSES.map(c => (
          <div key={c.id} onClick={() => onSelect(c)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 16px", borderRadius: 14, marginBottom: 12, cursor: "pointer",
            border: `2px solid ${c.isMain ? COLORS.primary : COLORS.border}`,
            background: c.isMain ? "#EEF2FF" : "#FAFBFF",
            transition: "all .15s",
          }}>
            <div style={{ fontSize: 28 }}>{c.isMain ? "⭐" : "📍"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>{c.name}</span>
                {c.isMain && (
                  <span style={{
                    background: COLORS.primary, color: "#fff", fontSize: 9, fontWeight: 800,
                    padding: "2px 8px", borderRadius: 20,
                  }}>PRINCIPAL</span>
                )}
              </div>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.muted }}>{c.address}</p>
            </div>
            <div style={{ fontSize: 18, color: COLORS.muted }}>→</div>
          </div>
        ))}

        <button onClick={onLogout} style={{
          width: "100%", marginTop: 8, background: "none", border: "none", color: COLORS.muted,
          cursor: "pointer", fontSize: 12, fontFamily: "inherit", textAlign: "center", padding: "8px 0",
        }}>← Volver al login</button>
      </Card>
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
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
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
              <div style={{ fontSize: 18, marginBottom: 2 }}>🧑‍🎓</div>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Alumno</div>
              <div style={{ fontSize: 10, opacity: .7 }}>alumno@duocuc.cl</div>
              <div style={{ fontSize: 10, opacity: .7 }}>alumno123</div>
            </button>
          </div>
          <button onClick={() => handleLogin("docente@duocuc.cl", "docente123")} style={{
            width: "100%", padding: "12px 8px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
            background: "linear-gradient(135deg, #0E7C7B, #134E4A)",
            border: "none", color: "#fff", textAlign: "center",
          }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>🎓</div>
            <div style={{ fontSize: 12, fontWeight: 800 }}>Docente</div>
            <div style={{ fontSize: 10, opacity: .7 }}>docente@duocuc.cl · docente123</div>
          </button>
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
export default function DuocParking() {
  const [session, setSession] = useState(null); // null = login, {role} = logged in
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState({ name: "", email: "", password: "" });
  const [docData, setDocData] = useState({ rut: "", docType: "", docFile: "" });
  const [vehicle, setVehicle] = useState({ patent: "", vehicleType: "", brand: "", model: "", color: "" });
  const [reserveSpot, setReserveSpot] = useState(null);
  const [activeReservation, setActiveReservation] = useState(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [waitlist, setWaitlist] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);

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
    setActiveReservation(null);
    setSelectedCampus(null);
  };

  const handleReserveConfirm = (reservationData) => {
    setActiveReservation(reservationData);
  };

  const handleJoinWaitlist = (entry) => {
    setWaitlist(prev => [...prev, entry]);
  };

  const handleEndReservation = () => {
    if (activeReservation) {
      const elapsedSec = Math.floor((Date.now() - activeReservation.startedAt) / 1000);
      const overSec = Math.max(0, elapsedSec - FREE_MINUTES * 60);
      if (overSec > 0) {
        const overMin = Math.ceil(overSec / 60);
        const RATE_PER_MIN = 100; // CLP por minuto excedido (demo)
        setPaymentHistory(prev => [...prev, {
          spotId: activeReservation.spotId,
          date: Date.now(),
          minutesOver: overMin,
          amount: overMin * RATE_PER_MIN,
        }]);
      }
    }
    setActiveReservation(null);
  };

  const handleReportIncident = (incident) => {
    setIncidents(prev => [...prev, incident]);
  };

  const containerStyle = {
    minHeight: "100vh",
    background: session?.role === "admin" ? "#0f0020" : session?.role === "teacher" ? "#f0fbfa" : COLORS.bg,
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
      : session?.role === "teacher"
        ? "linear-gradient(135deg, #0E7C7B 0%, #134E4A 100%)"
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
              {session?.role === "admin" ? "Panel de Administración" : session?.role === "teacher" ? "Panel Docente" : "Sistema de estacionamiento institucional"}
            </div>
          </div>
          {session?.role === "admin" && (
            <span style={{
              marginLeft: "auto", background: COLORS.gold, color: "#000",
              fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20,
            }}>ADMIN</span>
          )}
          {(session?.role === "user" || session?.role === "teacher") && (
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
        <AdminDashboard account={session} onLogout={handleLogout} incidents={incidents} />
      )}

      {session?.role === "teacher" && !selectedCampus && (
        <CampusSelectScreen account={session} onSelect={setSelectedCampus} onLogout={handleLogout} />
      )}

      {session?.role === "teacher" && selectedCampus && (
        <TeacherDashboard
          account={session}
          vehicle={{ patent: session.patent, vehicleType: session.vehicleType, brand: session.brand }}
          onReserve={setReserveSpot}
          activeReservation={activeReservation}
          onEndReservation={handleEndReservation}
          onReportIncident={() => setShowIncidentModal(true)}
          campus={selectedCampus}
          onOpenAccount={() => setShowAccountModal(true)}
          waitlist={waitlist}
        />
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
          {step === 4 && !selectedCampus && (
            <div style={{ margin: "0 -16px" }}>
              <CampusSelectScreen account={session?.role === "user" ? session : account} onSelect={setSelectedCampus} onLogout={handleLogout} />
            </div>
          )}
          {step === 4 && selectedCampus && (
            <Dashboard
              account={session?.role === "user" ? session : account}
              vehicle={session?.role === "user" ? { patent: session.patent, vehicleType: session.vehicleType, brand: session.brand } : vehicle}
              onReserve={setReserveSpot}
              activeReservation={activeReservation}
              onEndReservation={handleEndReservation}
              onReportIncident={() => setShowIncidentModal(true)}
              campus={selectedCampus}
              onOpenAccount={() => setShowAccountModal(true)}
              waitlist={waitlist}
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
          onConfirm={handleReserveConfirm}
          onClose={() => setReserveSpot(null)}
          onJoinWaitlist={handleJoinWaitlist}
        />
      )}

      {/* Incident Modal */}
      {showIncidentModal && (
        <IncidentModal
          onClose={() => setShowIncidentModal(false)}
          onSubmit={handleReportIncident}
        />
      )}

      {/* Account Modal (QR + payment history) */}
      {showAccountModal && (
        <AccountModal
          account={session?.role === "user" || session?.role === "teacher" ? session : account}
          vehicle={session?.role === "user" || session?.role === "teacher"
            ? { patent: session.patent, vehicleType: session.vehicleType, brand: session.brand }
            : vehicle}
          paymentHistory={paymentHistory}
          onClose={() => setShowAccountModal(false)}
        />
      )}
    </div>
  );
}
