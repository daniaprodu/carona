import { useState, useEffect } from 'react';

const MASTER_KEY = '$2a$10$jVbWYJfM5JDHuWwow8Rpve8NXUY.hbdTTHXc6R8XY1KL/9uGI1QdG';
const BIN_NAME = 'carona-guaruja';
const DAYS = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
const DAY_LABELS = { Segunda: 'Segunda', Terca: 'Terca', Quarta: 'Quarta', Quinta: 'Quinta', Sexta: 'Sexta', Sabado: 'Sabado' };
const MAX_SEATS = 4;

const defaultData = () => ({
  schedule: DAYS.reduce((a, d) => ({ ...a, [d]: { ida: null, volta: null } }), {}),
  passengers: DAYS.reduce((a, d) => ({ ...a, [d]: { ida: [], volta: [] } }), {}),
});

const hdrs = {
  'Content-Type': 'application/json',
  'X-Master-Key': MASTER_KEY,
};

async function getBinId() {
  const stored = localStorage.getItem('carona_bin_id');
  if (stored) return stored;
  const res = await fetch('https://api.jsonbin.io/v3/b', {
    method: 'POST',
    headers: { ...hdrs, 'X-Bin-Name': BIN_NAME, 'X-Bin-Private': 'false' },
    body: JSON.stringify(defaultData()),
  });
  const json = await res.json();
  const id = json.metadata?.id;
  if (id) localStorage.setItem('carona_bin_id', id);
  return id;
}

async function loadData() {
  const id = await getBinId();
  const res = await fetch('https://api.jsonbin.io/v3/b/' + id + '/latest', { headers: hdrs });
  const json = await res.json();
  return json.record;
}

async function saveData(data) {
  const id = await getBinId();
  await fetch('https://api.jsonbin.io/v3/b/' + id, {
    method: 'PUT',
    headers: hdrs,
    body: JSON.stringify(data),
  });
}

const FONT_SYNE = 'Syne, sans-serif';
const FONT_DM = 'DM Sans, sans-serif';

const s = {
  root: { minHeight: '100vh', background: '#0f0f0f', fontFamily: FONT_DM, color: '#f3f4f6' },
  loading: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#0f0f0f' },
  spinner: { width: 40, height: 40, border: '3px solid #1f1f1f', borderTop: '3px solid #f97316', borderRadius: '50%' },
  toast: { position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', borderRadius: 12, fontFamily: FONT_SYNE, fontWeight: 600, fontSize: 14, zIndex: 999, boxShadow: '0 4px 24px rgba(0,0,0,0.4)', color: '#fff' },
  header: { background: '#111', borderBottom: '1px solid #1e1e1e', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 },
  headerInner: { maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', flexWrap: 'wrap', gap: 12 },
  logo: { fontFamily: FONT_SYNE, fontWeight: 800, fontSize: 22, color: '#f97316' },
  subtitle: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  savingBadge: { fontSize: 12, color: '#f97316', fontFamily: FONT_DM },
  tabs: { display: 'flex', gap: 8 },
  tab: { padding: '8px 18px', borderRadius: 8, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontFamily: FONT_DM, fontSize: 14, fontWeight: 500 },
  tabActive: { background: '#f97316', borderColor: '#f97316', color: '#fff' },
  main: { maxWidth: 900, margin: '0 auto', padding: '32px 16px' },
  boardHint: { color: '#9ca3af', fontSize: 14, marginBottom: 24, textAlign: 'center' },
  boardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 },
  dayCard: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 },
  dayTitle: { fontFamily: FONT_SYNE, fontWeight: 700, fontSize: 18, color: '#f97316', borderBottom: '1px solid #1e1e1e', paddingBottom: 10 },
  tripBlock: { background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 },
  tripHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tripLabel: { fontFamily: FONT_SYNE, fontWeight: 600, fontSize: 14, color: '#e5e7eb' },
  tripTime: { fontFamily: FONT_SYNE, fontWeight: 700, fontSize: 18, color: '#f97316' },
  route: { fontSize: 12, color: '#6b7280' },
  seats: { fontSize: 13 },
  seatsOk: { color: '#4ade80' },
  seatsFull: { color: '#f87171' },
  passengerList: { display: 'flex', flexDirection: 'column', gap: 4 },
  passengerChip: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a', borderRadius: 8, padding: '6px 10px', fontSize: 13, color: '#d1d5db' },
  chipRemove: { background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px' },
  addRow: { display: 'flex', gap: 6, marginTop: 4 },
  nameInput: { flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 12px', color: '#f3f4f6', fontSize: 13, fontFamily: FONT_DM, outline: 'none' },
  btnJoin: { padding: '8px 14px', background: '#f97316', border: 'none', borderRadius: 8, color: '#fff', fontFamily: FONT_SYNE, fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  card: { background: '#141414', border: '1px solid #1e1e1e', borderRadius: 16, padding: 28 },
  cardTitle: { fontFamily: FONT_SYNE, fontWeight: 700, fontSize: 20, color: '#f97316', marginBottom: 6 },
  hint: { color: '#9ca3af', fontSize: 14, marginBottom: 20 },
  formRow: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 28 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 140 },
  label: { fontSize: 12, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  select: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '10px 12px', color: '#f3f4f6', fontSize: 14, fontFamily: FONT_DM, outline: 'none' },
  btnPrimary: { padding: '10px 20px', background: '#f97316', border: 'none', borderRadius: 8, color: '#fff', fontFamily: FONT_SYNE, fontWeight: 700, fontSize: 14, cursor: 'pointer', alignSelf: 'flex-end', whiteSpace: 'nowrap' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  summaryCard: { background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: 12, padding: 14 },
  summaryDay: { fontFamily: FONT_SYNE, fontWeight: 700, color: '#f97316', fontSize: 15, marginBottom: 10 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#d1d5db', marginBottom: 6 },
  btnRemove: { background: '#1f1f1f', border: 'none', borderRadius: 6, color: '#f87171', cursor: 'pointer', padding: '2px 8px', fontSize: 14 },
  empty: { gridColumn: '1/-1', textAlign: 'center', color: '#6b7280', padding: '60px 20px' },
};

export default function CaronaApp() {
  const [data, setData] = useState(null);
  const [view, setView] = useState('board');
  const [adminInput, setAdminInput] = useState({ day: 'Segunda', type: 'ida', time: '05:00' });
  const [nameInputs, setNameInputs] = useState({});
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData()
      .then((d) => setData(d || defaultData()))
      .catch(() => setData(defaultData()));
  }, []);

  const showToast = (msg, type) => {
    setToast({ msg, type: type || 'ok' });
    setTimeout(() => setToast(null), 3000);
  };

  const update = async (newData) => {
    setData(newData);
    setSaving(true);
    try {
      await saveData(newData);
    } catch (e) {
      showToast('Erro ao salvar.', 'warn');
    }
    setSaving(false);
  };

  const addTrip = () => {
    const { day, type, time } = adminInput;
    const newData = {
      ...data,
      schedule: { ...data.schedule, [day]: { ...data.schedule[day], [type]: time } },
    };
    update(newData);
    showToast('Carona adicionada em ' + DAY_LABELS[day] + '!');
  };

  const removeTrip = (day, type) => {
    const newData = {
      ...data,
      schedule: { ...data.schedule, [day]: { ...data.schedule[day], [type]: null } },
      passengers: { ...data.passengers, [day]: { ...data.passengers[day], [type]: [] } },
    };
    update(newData);
    showToast('Carona removida.', 'warn');
  };

  const addPassenger = (day, type) => {
    const key = day + '-' + type;
    const name = (nameInputs[key] || '').trim();
    if (!name) return showToast('Digite seu nome!', 'warn');
    const list = data.passengers[day][type];
    if (list.length >= MAX_SEATS) return showToast('Vagas esgotadas!', 'warn');
    if (list.includes(name)) return showToast('Voce ja esta na lista!', 'warn');
    const newData = {
      ...data,
      passengers: { ...data.passengers, [day]: { ...data.passengers[day], [type]: [...list, name] } },
    };
    update(newData);
    setNameInputs((p) => ({ ...p, [key]: '' }));
    showToast(name + ' adicionado(a)!');
  };

  const removePassenger = (day, type, name) => {
    const newData = {
      ...data,
      passengers: {
        ...data.passengers,
        [day]: { ...data.passengers[day], [type]: data.passengers[day][type].filter((n) => n !== name) },
      },
    };
    update(newData);
  };

  if (!data) {
    return (
      <div style={s.loading}>
        <div style={s.spinner} />
        <span style={{ color: '#f97316', fontFamily: FONT_SYNE }}>Carregando...</span>
      </div>
    );
  }

  const { schedule, passengers } = data;
  const hasAny = DAYS.some((d) => schedule[d].ida || schedule[d].volta);

  return (
    <div style={s.root}>
      {toast && (
        <div style={{ ...s.toast, background: toast.type === 'warn' ? '#ef4444' : '#22c55e' }}>
          {toast.msg}
        </div>
      )}

      <header style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.logo}>Carona GP</div>
            <div style={s.subtitle}>Guaruja - Jabaquara</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {saving && <span style={s.savingBadge}>Salvando...</span>}
            <div style={s.tabs}>
              <button onClick={() => setView('board')} style={{ ...s.tab, ...(view === 'board' ? s.tabActive : {}) }}>
                Ver Vagas
              </button>
              <button onClick={() => setView('admin')} style={{ ...s.tab, ...(view === 'admin' ? s.tabActive : {}) }}>
                Gerenciar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={s.main}>
        {view === 'admin' && (
          <div style={s.card}>
            <h2 style={s.cardTitle}>Adicionar Carona da Semana</h2>
            <p style={s.hint}>Configure os dias e horarios que vai dar carona.</p>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Dia</label>
                <select style={s.select} value={adminInput.day} onChange={(e) => setAdminInput((p) => ({ ...p, day: e.target.value }))}>
                  {DAYS.map((d) => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Tipo</label>
                <select style={s.select} value={adminInput.type} onChange={(e) => setAdminInput((p) => ({ ...p, type: e.target.value }))}>
                  <option value='ida'>Ida (Guaruja para Jabaquara)</option>
                  <option value='volta'>Volta (Jabaquara para Guaruja)</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Horario</label>
                <input type='time' style={s.select} value={adminInput.time} onChange={(e) => setAdminInput((p) => ({ ...p, time: e.target.value }))} />
              </div>
              <button style={s.btnPrimary} onClick={addTrip}>+ Adicionar</button>
            </div>
            <div style={s.summaryGrid}>
              {DAYS.map((day) => {
                const { ida, volta } = schedule[day];
                if (!ida && !volta) return null;
                return (
                  <div key={day} style={s.summaryCard}>
                    <div style={s.summaryDay}>{DAY_LABELS[day]}</div>
                    {ida && (
                      <div style={s.summaryRow}>
                        <span>Ida - {ida}</span>
                        <button style={s.btnRemove} onClick={() => removeTrip(day, 'ida')}>X</button>
                      </div>
                    )}
                    {volta && (
                      <div style={s.summaryRow}>
                        <span>Volta - {volta}</span>
                        <button style={s.btnRemove} onClick={() => removeTrip(day, 'volta')}>X</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!hasAny && <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: 24 }}>Nenhuma carona cadastrada ainda.</p>}
          </div>
        )}

        {view === 'board' && (
          <div>
            <p style={s.boardHint}>Veja as vagas e adicione seu nome para reservar!</p>
            <div style={s.boardGrid}>
              {DAYS.map((day) => {
                const { ida, volta } = schedule[day];
                if (!ida && !volta) return null;
                return (
                  <div key={day} style={s.dayCard}>
                    <div style={s.dayTitle}>{DAY_LABELS[day]}</div>
                    {['ida', 'volta'].map((type) => {
                      const time = schedule[day][type];
                      if (!time) return null;
                      const list = passengers[day][type];
                      const key = day + '-' + type;
                      const seats = MAX_SEATS - list.length;
                      const routeText = type === 'ida' ? 'Guaruja para Jabaquara' : 'Jabaquara para Guaruja';
                      const typeLabel = type === 'ida' ? 'Ida' : 'Volta';
                      return (
                        <div key={type} style={s.tripBlock}>
                          <div style={s.tripHeader}>
                            <span style={s.tripLabel}>{typeLabel}</span>
                            <span style={s.tripTime}>{time}</span>
                          </div>
                          <div style={s.route}>{routeText}</div>
                          <div style={s.seats}>
                            {seats > 0
                              ? <span style={s.seatsOk}>{seats} vaga{seats > 1 ? 's' : ''} disponivel</span>
                              : <span style={s.seatsFull}>Lotado</span>
                            }
                          </div>
                          <div style={s.passengerList}>
                            {list.map((name, i) => (
                              <div key={i} style={s.passengerChip}>
                                <span>{name}</span>
                                <button style={s.chipRemove} onClick={() => removePassenger(day, type, name)}>x</button>
                              </div>
                            ))}
                          </div>
                          {seats > 0 && (
                            <div style={s.addRow}>
                              <input
                                style={s.nameInput}
                                placeholder='Seu nome'
                                value={nameInputs[key] || ''}
                                onChange={(e) => setNameInputs((p) => ({ ...p, [key]: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && addPassenger(day, type)}
                              />
                              <button style={s.btnJoin} onClick={() => addPassenger(day, type)}>Entrar</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              {!hasAny && (
                <div style={s.empty}>
                  <div style={{ fontSize: 48 }}>🚗</div>
                  <p>Nenhuma carona disponivel ainda.</p>
                  <p style={{ fontSize: 14, color: '#9ca3af' }}>O dono do carro precisa adicionar os horarios em Gerenciar.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
