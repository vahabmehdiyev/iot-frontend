import { useState } from "react";

// 🔧 Buranı öz backend ünvanınla DƏYİŞ:
//   Lokal backend üçün:  "http://127.0.0.1:8000"
//   Serverdədirsə:       "http://<SERVER_IP>:8000"
const API_BASE = "/api";

export default function App() {
    const [loading, setLoading] = useState(false);
    const [devices, setDevices] = useState(null); // null = hələ yüklənməyib
    const [error, setError] = useState("");

    const fetchDevices = async () => {
        setLoading(true);
        setError("");
        setDevices(null);
        try {
            const res = await fetch(`${API_BASE}/device/`, {
                headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setDevices(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message || "Request failed");
        } finally {
            setLoading(false);
        }
    };

    const fmt = (iso) => {
        try {
            return new Date(iso).toLocaleString();
        } catch {
            return iso ?? "";
        }
    };

    return (
        <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial", padding: 24, maxWidth: 960, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 8 }}>IoT Front — Smoke Test</h1>
            <p style={{ marginTop: 0, color: "#555" }}>
                “Show devices” düyməsinə kliklə, <code>GET /device/</code> çağrılsın.
            </p>

            <button
                onClick={fetchDevices}
                disabled={loading}
                style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: loading ? "#eee" : "#fff",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
            >
                {loading ? "Yüklənir..." : "Show devices"}
            </button>

            {error && (
                <div style={{ marginTop: 16, color: "crimson" }}>
                    Xəta: {error}
                </div>
            )}

            {/* Hələ kliklənməyibsə heç nə göstərməyək */}
            {devices !== null && (
                <div style={{ marginTop: 20 }}>
                    <h3 style={{ marginBottom: 12 }}>Nəticə</h3>

                    {devices.length === 0 ? (
                        <div style={{ color: "#666" }}>Heç bir cihaz tapılmadı.</div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                                gap: 12,
                            }}
                        >
                            {devices.map((d) => (
                                <div
                                    key={d.id}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 12,
                                        padding: 14,
                                        background: "#fafafa",
                                    }}
                                >
                                    <div style={{ fontSize: 14, color: "#999" }}>ID: {d.id}</div>
                                    <div style={{ fontWeight: 600, fontSize: 18, marginTop: 4 }}>
                                        {d.name || "-"}
                                    </div>
                                    <div style={{ marginTop: 6, color: "#444", whiteSpace: "pre-wrap" }}>
                                        {d.description || "—"}
                                    </div>
                                    <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                                        Yaradılma: {fmt(d.created_at)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
