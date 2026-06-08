import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000";

const COLORS = {
  primary: "#0A2540", accent: "#0070F3", success: "#00C48C",
  warning: "#FFB020", danger: "#FF4D4D", surface: "#F7F9FC",
  border: "#E2E8F0", muted: "#94A3B8", secondary: "#64748B"
};

const styles = {
  app: { display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:COLORS.surface },
  sidebar: { width:240, background:COLORS.primary, display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, height:"100vh", zIndex:100 },
  logoArea: { padding:"24px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" },
  logoIcon: { width:36, height:36, background:"linear-gradient(135deg,#0070F3,#00C48C)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, marginBottom:8 },
  logoText: { color:"#fff", fontSize:20, fontWeight:700, letterSpacing:-0.5 },
  logoSub: { color:"rgba(255,255,255,0.35)", fontSize:10, letterSpacing:2, textTransform:"uppercase", marginTop:2 },
  nav: { padding:"16px 12px", flex:1 },
  navLabel: { color:"rgba(255,255,255,0.3)", fontSize:10, letterSpacing:1.5, textTransform:"uppercase", padding:"0 10px", margin:"12px 0 6px" },
  main: { marginLeft:240, flex:1, display:"flex", flexDirection:"column" },
  topbar: { background:"#fff", borderBottom:`1px solid ${COLORS.border}`, padding:"0 28px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, boxShadow:"0 1px 4px rgba(10,37,64,0.06)" },
  pageContent: { padding:"24px 28px", flex:1 },
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 },
  statCard: { background:"#fff", borderRadius:14, padding:"18px 20px", border:`1px solid ${COLORS.border}`, boxShadow:"0 1px 4px rgba(10,37,64,0.05)" },
  card: { background:"#fff", borderRadius:14, border:`1px solid ${COLORS.border}`, boxShadow:"0 1px 4px rgba(10,37,64,0.05)", overflow:"hidden", marginBottom:16 },
  cardHeader: { padding:"18px 22px 0", display:"flex", alignItems:"center", justifyContent:"space-between" },
  cardBody: { padding:"16px 22px 20px" },
  cardTitle: { fontSize:14, fontWeight:700, color:COLORS.primary, display:"flex", alignItems:"center", gap:8 },
  formGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 },
  formGroup: { display:"flex", flexDirection:"column", gap:5 },
  formLabel: { fontSize:10, fontWeight:700, color:COLORS.secondary, textTransform:"uppercase", letterSpacing:0.5 },
  formInput: { padding:"9px 12px", border:`1.5px solid ${COLORS.border}`, borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:COLORS.primary, outline:"none", transition:"border 0.2s" },
  btn: { width:"100%", padding:12, background:"linear-gradient(135deg,#0070F3,#0056D2)", color:"#fff", border:"none", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 14px rgba(0,112,243,0.25)" },
  table: { width:"100%", borderCollapse:"collapse" },
  th: { fontSize:10, fontWeight:700, color:COLORS.muted, textTransform:"uppercase", letterSpacing:0.5, padding:"10px 16px", textAlign:"left", background:COLORS.surface, borderBottom:`1px solid ${COLORS.border}` },
  td: { padding:"13px 16px", fontSize:13, borderBottom:`1px solid ${COLORS.border}`, color:COLORS.primary },
};

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <div onClick={onClick} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:8, cursor:"pointer", color: active ? "#fff" : "rgba(255,255,255,0.5)", background: active ? "rgba(0,112,243,0.2)" : "transparent", fontSize:13, fontWeight:500, marginBottom:2, transition:"all 0.15s", position:"relative", borderLeft: active ? "3px solid #0070F3" : "3px solid transparent" }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      {label}
      {badge > 0 && <span style={{ marginLeft:"auto", background:COLORS.accent, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>{badge}</span>}
    </div>
  );
}

function StatCard({ icon, label, value, color, trend }) {
  return (
    <div style={styles.statCard}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ width:38, height:38, borderRadius:9, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{icon}</div>
        {trend && <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, background:`${color}18`, color }}>{trend}</span>}
      </div>
      <div style={{ fontSize:28, fontWeight:800, color:COLORS.primary, letterSpacing:-0.5, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, color:COLORS.muted, marginTop:4, fontWeight:500 }}>{label}</div>
    </div>
  );
}

function Badge({ score }) {
  const color = score >= 75 ? COLORS.success : score >= 50 ? COLORS.warning : COLORS.danger;
  const label = score >= 75 ? "LOW RISK" : score >= 50 ? "MEDIUM" : "HIGH RISK";
  return <span style={{ background:`${color}18`, color, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{label}</span>;
}

function BarRow({ label, pct, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
      <div style={{ fontSize:11, color:COLORS.secondary, width:65, flexShrink:0 }}>{label}</div>
      <div style={{ flex:1, height:8, background:COLORS.surface, borderRadius:20, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:20, transition:"width 1s ease" }} />
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:COLORS.primary, width:32, textAlign:"right" }}>{pct}%</div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("ciq") || "[]"));
  const [form, setForm] = useState({ name:"", owner_age:"", personal_income:"", business_turnover:"", business_expenses:"", business_age_years:"", has_cellphone:"1", current_problem_cash_flow:"0", compliance_income_tax:"1", offers_credit_to_customers:"1" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    fetch(`${API}/health`).then(r => r.json()).then(() => setApiStatus("live")).catch(() => setApiStatus("offline"));
  }, []);

  const total = history.length;
  const approved = history.filter(s => s.score >= 75).length;
  const conditional = history.filter(s => s.score >= 50 && s.score < 75).length;
  const declined = history.filter(s => s.score < 50).length;
  const pct = (v) => total > 0 ? Math.round((v / total) * 100) : 0;

  async function scoreApplicant() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/score`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_age: parseFloat(form.owner_age) || 0,
          personal_income: parseFloat(form.personal_income) || 0,
          business_expenses: parseFloat(form.business_expenses) || 0,
          business_turnover: parseFloat(form.business_turnover) || 0,
          business_age_years: parseFloat(form.business_age_years) || 0,
          has_cellphone: parseInt(form.has_cellphone),
          current_problem_cash_flow: parseInt(form.current_problem_cash_flow),
          compliance_income_tax: parseInt(form.compliance_income_tax),
          offers_credit_to_customers: parseInt(form.offers_credit_to_customers),
          motor_vehicle_insurance: 0
        })
      });
      const data = await res.json();
      const entry = { name: form.name || "Unknown", score: data.credit_score, risk: data.risk_tier, rec: data.recommendation, mobile: data.has_mobile_money_prediction, time: new Date().toISOString() };
      const newHistory = [entry, ...history];
      setHistory(newHistory);
      localStorage.setItem("ciq", JSON.stringify(newHistory));
      setResult(entry);
    } catch { alert("API Error! Make sure your FastAPI server is running on port 8000."); }
    setLoading(false);
  }

  const scoreColor = result ? (result.score >= 75 ? COLORS.success : result.score >= 50 ? COLORS.warning : COLORS.danger) : COLORS.accent;

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>🧠</div>
          <div style={styles.logoText}>Credit<span style={{ color:"#60A5FA" }}>IQ</span></div>
          <div style={styles.logoSub}>AI Scoring Portal</div>
        </div>
        <nav style={styles.nav}>
          <div style={styles.navLabel}>Main</div>
          <NavItem icon="📊" label="Dashboard" active={page==="dashboard"} onClick={() => setPage("dashboard")} />
          <NavItem icon="⚡" label="Score Applicant" active={page==="scoring"} onClick={() => setPage("scoring")} />
          <NavItem icon="📋" label="History" active={page==="history"} onClick={() => setPage("history")} badge={total} />
          <div style={styles.navLabel}>Analytics</div>
          <NavItem icon="📈" label="Analytics" active={page==="analytics"} onClick={() => setPage("analytics")} />
          <NavItem icon="📄" label="Reports" active={page==="reports"} onClick={() => setPage("reports")} />
          <div style={styles.navLabel}>System</div>
          <NavItem icon="🔗" label="API Status" active={page==="api"} onClick={() => setPage("api")} />
        </nav>
        <div style={{ padding:"14px 12px 20px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", background:"rgba(255,255,255,0.06)", borderRadius:8 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#0070F3,#00C48C)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff" }}>MV</div>
            <div><div style={{ fontSize:12, fontWeight:600, color:"#fff" }}>Marvin</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Lender Admin</div></div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        {/* TOPBAR */}
        <div style={styles.topbar}>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:COLORS.primary }}>
              { page==="dashboard"?"Lender Dashboard": page==="scoring"?"Score Applicant": page==="history"?"Score History": page==="analytics"?"Analytics": page==="reports"?"Reports":"API Status" }
            </div>
            <div style={{ fontSize:11, color:COLORS.muted, marginTop:1 }}>
              { new Date().toLocaleDateString("en-KE", { weekday:"short", day:"numeric", month:"short", year:"numeric" }) }
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, background: apiStatus==="live" ? "#E6FAF5" : "#FFF0F0", color: apiStatus==="live" ? COLORS.success : COLORS.danger, fontSize:12, fontWeight:600, padding:"6px 12px", borderRadius:20, border:`1px solid ${apiStatus==="live" ? "rgba(0,196,140,0.2)" : "rgba(255,77,77,0.2)"}` }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background: apiStatus==="live" ? COLORS.success : COLORS.danger, animation: apiStatus==="live" ? "pulse 2s infinite" : "none" }} />
              {apiStatus==="live" ? "API Live" : "API Offline"}
            </div>
          </div>
        </div>

        <div style={styles.pageContent}>

          {/* ── DASHBOARD ── */}
          {page === "dashboard" && (
            <>
              <div style={styles.statsGrid}>
                <StatCard icon="📊" label="Total Scored" value={total} color={COLORS.accent} trend="+12%" />
                <StatCard icon="✅" label="Approved" value={approved} color={COLORS.success} trend="+8%" />
                <StatCard icon="⚠️" label="Conditional" value={conditional} color={COLORS.warning} trend="-3%" />
                <StatCard icon="❌" label="Declined" value={declined} color={COLORS.danger} trend="-5%" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}><div style={styles.cardTitle}><span>📊</span> Risk Distribution</div></div>
                  <div style={styles.cardBody}>
                    <BarRow label="Low Risk" pct={pct(approved)} color={COLORS.success} />
                    <BarRow label="Medium" pct={pct(conditional)} color={COLORS.warning} />
                    <BarRow label="High Risk" pct={pct(declined)} color={COLORS.danger} />
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={styles.cardHeader}><div style={styles.cardTitle}><span>💡</span> Quick Insights</div></div>
                  <div style={styles.cardBody}>
                    {total === 0 ? <p style={{ color:COLORS.muted, fontSize:13 }}>Score applicants to see insights.</p> : (
                      <div style={{ fontSize:13, color:COLORS.secondary, lineHeight:1.8 }}>
                        <p>📈 Approval rate: <strong>{pct(approved)}%</strong></p>
                        <p>🏆 Best score: <strong>{Math.max(...history.map(s=>s.score))}/100</strong></p>
                        <p>📉 Lowest score: <strong>{Math.min(...history.map(s=>s.score))}/100</strong></p>
                        <p>📊 Average: <strong>{(history.reduce((a,b)=>a+b.score,0)/total).toFixed(1)}/100</strong></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTitle}><span>🕐</span> Recent Scores</div>
                  <button onClick={() => setPage("scoring")} style={{ background:"#EBF4FF", color:COLORS.accent, border:"none", padding:"6px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>+ New Score</button>
                </div>
                <div style={{ padding:"10px 0 0" }}>
                  {total === 0 ? <div style={{ textAlign:"center", padding:"30px 0", color:COLORS.muted, fontSize:13 }}>No scores yet — start scoring applicants!</div> : (
                    <table style={styles.table}>
                      <thead><tr><th style={styles.th}>Applicant</th><th style={styles.th}>Score</th><th style={styles.th}>Risk</th><th style={styles.th}>Recommendation</th><th style={styles.th}>Time</th></tr></thead>
                      <tbody>
                        {history.slice(0,8).map((s,i) => (
                          <tr key={i} style={{ cursor:"default" }}>
                            <td style={styles.td}><strong>{s.name}</strong></td>
                            <td style={{ ...styles.td, fontFamily:"monospace", fontWeight:700, color: s.score>=75?COLORS.success:s.score>=50?COLORS.warning:COLORS.danger }}>{s.score}</td>
                            <td style={styles.td}><Badge score={s.score} /></td>
                            <td style={{ ...styles.td, color:COLORS.secondary }}>{s.rec}</td>
                            <td style={{ ...styles.td, color:COLORS.muted, fontSize:11, fontFamily:"monospace" }}>{new Date(s.time).toLocaleTimeString("en-KE")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── SCORING ── */}
          {page === "scoring" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:16 }}>
              <div style={styles.card}>
                <div style={styles.cardHeader}><div style={styles.cardTitle}><span>⚡</span> Applicant Details</div></div>
                <div style={styles.cardBody}>
                  <div style={{ fontSize:11, fontWeight:700, color:COLORS.muted, textTransform:"uppercase", letterSpacing:1, margin:"0 0 10px", paddingBottom:8, borderBottom:`1px solid ${COLORS.border}` }}>Business Information</div>
                  <div style={styles.formGrid}>
                    {[["name","Applicant Name","text","e.g. John Kamau"],["owner_age","Owner Age","number","e.g. 35"],["personal_income","Personal Income (KES)","number","e.g. 45000"],["business_turnover","Business Turnover (KES)","number","e.g. 80000"],["business_expenses","Business Expenses (KES)","number","e.g. 12000"],["business_age_years","Business Age (Years)","number","e.g. 5"]].map(([key,label,type,ph]) => (
                      <div key={key} style={styles.formGroup}>
                        <label style={styles.formLabel}>{label}</label>
                        <input style={styles.formInput} type={type} placeholder={ph} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} onFocus={e => e.target.style.borderColor=COLORS.accent} onBlur={e => e.target.style.borderColor=COLORS.border} />
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:COLORS.muted, textTransform:"uppercase", letterSpacing:1, margin:"14px 0 10px", paddingBottom:8, borderBottom:`1px solid ${COLORS.border}` }}>Financial Behaviour</div>
                  <div style={styles.formGrid}>
                    {[["has_cellphone","Has Cellphone",[["1","Yes"],["0","No"]]],["current_problem_cash_flow","Cash Flow Problems",[["0","No"],["1","Yes"]]],["compliance_income_tax","Tax Compliance",[["1","Compliant"],["0","Non-compliant"]]],["offers_credit_to_customers","Offers Credit",[["1","Yes"],["0","No"]]]].map(([key,label,opts]) => (
                      <div key={key} style={styles.formGroup}>
                        <label style={styles.formLabel}>{label}</label>
                        <select style={{ ...styles.formInput, appearance:"none" }} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})}>
                          {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <button style={{ ...styles.btn, opacity: loading ? 0.8 : 1 }} onClick={scoreApplicant} disabled={loading}>
                    {loading ? <>⏳ Scoring...</> : <>⚡ Generate Credit Score</>}
                  </button>
                </div>
              </div>

              {/* Result Panel */}
              <div style={{ ...styles.card, alignSelf:"start" }}>
                <div style={{ padding:"18px 22px", background:COLORS.primary, color:"#fff" }}>
                  <div style={{ fontSize:15, fontWeight:700 }}>Credit Score Result</div>
                  <div style={{ fontSize:11, opacity:0.5, marginTop:2 }}>AI-powered alternative scoring</div>
                </div>
                <div style={styles.cardBody}>
                  {!result ? (
                    <div style={{ textAlign:"center", padding:"30px 0", color:COLORS.muted }}>
                      <div style={{ fontSize:36, marginBottom:10, opacity:0.3 }}>🎯</div>
                      <div style={{ fontSize:13 }}>Fill in the form and click Generate Credit Score</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ textAlign:"center", marginBottom:16 }}>
                        <div style={{ width:120, height:120, borderRadius:"50%", border:`8px solid ${scoreColor}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", background:`${scoreColor}10`, transition:"all 0.8s ease" }}>
                          <div style={{ fontSize:32, fontWeight:800, color:scoreColor }}>{result.score}</div>
                        </div>
                        <div style={{ fontSize:11, color:COLORS.muted, marginBottom:8 }}>out of 100</div>
                        <Badge score={result.score} />
                      </div>
                      {[["Applicant", result.name],["Score", `${result.score} / 100`],["Risk Tier", result.risk],["Mobile Money", result.mobile ? "✅ Yes" : "❌ No"],["Scored At", new Date(result.time).toLocaleTimeString("en-KE")]].map(([k,v]) => (
                        <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", background:COLORS.surface, borderRadius:8, border:`1px solid ${COLORS.border}`, marginBottom:8 }}>
                          <span style={{ fontSize:11, color:COLORS.secondary, fontWeight:500 }}>{k}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:COLORS.primary, fontFamily:"monospace" }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ marginTop:12, padding:12, borderRadius:8, background:`${scoreColor}12`, border:`1px solid ${scoreColor}30`, display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:20 }}>{result.score>=75?"✅":result.score>=50?"⚠️":"❌"}</span>
                        <span style={{ fontSize:13, fontWeight:700, color: result.score>=75?"#047857":result.score>=50?"#92400E":"#9B1C1C" }}>{result.rec}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── HISTORY ── */}
          {page === "history" && (
            <div style={styles.card}>
              <div style={{ ...styles.cardHeader, paddingBottom:0 }}>
                <div style={styles.cardTitle}><span>📋</span> Score History</div>
                <button onClick={() => { if(window.confirm("Clear all history?")){ setHistory([]); localStorage.removeItem("ciq"); } }} style={{ background:"#FFF0F0", color:COLORS.danger, border:"none", padding:"6px 14px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>Clear All</button>
              </div>
              <div style={{ marginTop:0 }}>
                {total === 0 ? <div style={{ textAlign:"center", padding:"40px 0", color:COLORS.muted, fontSize:13 }}>No history yet</div> : (
                  <table style={styles.table}>
                    <thead><tr><th style={styles.th}>#</th><th style={styles.th}>Applicant</th><th style={styles.th}>Score</th><th style={styles.th}>Risk</th><th style={styles.th}>Recommendation</th><th style={styles.th}>Date</th></tr></thead>
                    <tbody>
                      {history.map((s,i) => (
                        <tr key={i}>
                          <td style={{ ...styles.td, color:COLORS.muted }}>{history.length-i}</td>
                          <td style={styles.td}><strong>{s.name}</strong></td>
                          <td style={{ ...styles.td, fontFamily:"monospace", fontWeight:700, color: s.score>=75?COLORS.success:s.score>=50?COLORS.warning:COLORS.danger }}>{s.score}</td>
                          <td style={styles.td}><Badge score={s.score} /></td>
                          <td style={{ ...styles.td, color:COLORS.secondary }}>{s.rec}</td>
                          <td style={{ ...styles.td, color:COLORS.muted, fontSize:11, fontFamily:"monospace" }}>{new Date(s.time).toLocaleString("en-KE")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {page === "analytics" && (
            <>
              <div style={styles.statsGrid}>
                <StatCard icon="📊" label="Total Scored" value={total||"—"} color={COLORS.accent} />
                <StatCard icon="🏆" label="Highest Score" value={total?Math.max(...history.map(s=>s.score)):"—"} color={COLORS.success} />
                <StatCard icon="📉" label="Lowest Score" value={total?Math.min(...history.map(s=>s.score)):"—"} color={COLORS.danger} />
                <StatCard icon="📈" label="Average Score" value={total?(history.reduce((a,b)=>a+b.score,0)/total).toFixed(1):"—"} color={COLORS.warning} />
              </div>
              <div style={styles.card}>
                <div style={styles.cardHeader}><div style={styles.cardTitle}><span>📊</span> Portfolio Risk Breakdown</div></div>
                <div style={styles.cardBody}>
                  <BarRow label="Low Risk" pct={pct(approved)} color={COLORS.success} />
                  <BarRow label="Medium Risk" pct={pct(conditional)} color={COLORS.warning} />
                  <BarRow label="High Risk" pct={pct(declined)} color={COLORS.danger} />
                </div>
              </div>
            </>
          )}

          {/* ── REPORTS ── */}
          {page === "reports" && (
            <div style={styles.card}>
              <div style={styles.cardHeader}><div style={styles.cardTitle}><span>📄</span> Export Report</div></div>
              <div style={styles.cardBody}>
                <p style={{ fontSize:13, color:COLORS.secondary, marginBottom:14 }}>Download all scoring data as a CSV file.</p>
                <button style={{ ...styles.btn, width:"auto", padding:"10px 24px" }} onClick={() => {
                  if(total===0){alert("No data to export.");return;}
                  const csv = [["Name","Score","Risk","Recommendation","Mobile","Date"],...history.map(s=>[s.name,s.score,s.risk,s.rec,s.mobile?"Yes":"No",new Date(s.time).toLocaleString("en-KE")])].map(r=>r.join(",")).join("\n");
                  const a = Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([csv],{type:"text/csv"})),download:"creditiq_report.csv"});
                  a.click();
                }}>📄 Download CSV Report</button>
              </div>
            </div>
          )}

          {/* ── API STATUS ── */}
          {page === "api" && (
            <div style={styles.card}>
              <div style={styles.cardHeader}><div style={styles.cardTitle}><span>🔗</span> API Endpoints</div></div>
              <div style={styles.cardBody}>
                <div style={{ background:COLORS.primary, borderRadius:10, padding:16, fontFamily:"monospace", fontSize:12, color:"#60A5FA", lineHeight:2.2 }}>
                  <div><span style={{color:"#94A3B8"}}>GET  </span> http://127.0.0.1:8000/</div>
                  <div><span style={{color:"#00C48C"}}>POST </span> http://127.0.0.1:8000/score</div>
                  <div><span style={{color:"#94A3B8"}}>GET  </span> http://127.0.0.1:8000/health</div>
                  <div><span style={{color:"#94A3B8"}}>GET  </span> http://127.0.0.1:8000/docs</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}