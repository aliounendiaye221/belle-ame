"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, UserCheck, Settings, Lock, Edit3, Camera, Sparkles, MapPin, EyeOff, Save } from "lucide-react";

export default function ProfilePage() {
  const [completion, setCompletion] = useState(85);
  const [isSaved, setIsSaved] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Aminata",
    age: 27,
    city: "Douala",
    country: "Cameroun",
    profession: "Chef de Projet digital",
    bio: "Femme respectueuse, orientée valeurs traditionnelles et projet de mariage sincère.",
    religion: "Chrétienne",
    education: "Master 2"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b130e", color: "#f8f9fa", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#14231a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#d4a373", color: "#0b130e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            Â
          </div>
          <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>Gestion du Profil Sincère</span>
        </div>

        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/discover" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500" }}>
            Découverte
          </Link>
          <Link href="/matches" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500" }}>
            Correspondances
          </Link>
          <Link href="/settings/privacy" style={{ color: "#a0aba4", textDecoration: "none", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Lock size={16} /> Confidentialité RGPD
          </Link>
          <Link href="/profile" style={{ color: "#d4a373", fontWeight: "700", textDecoration: "none", borderBottom: "2px solid #d4a373", paddingBottom: "0.25rem" }}>
            Mon Profil
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1, maxWidth: "760px", width: "100%", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        {/* Completion Gauge Card */}
        <div style={{ backgroundColor: "#14231a", borderRadius: "20px", border: "1px solid rgba(212, 163, 115, 0.25)", padding: "1.75rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={20} color="#d4a373" /> Taux de Complétion du Profil
            </div>
            <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#d4a373" }}>{completion}%</span>
          </div>

          <div style={{ height: "10px", backgroundColor: "#081c15", borderRadius: "5px", overflow: "hidden", marginBottom: "0.75rem" }}>
            <div style={{ height: "100%", backgroundColor: "#d4a373", width: `${completion}%`, borderRadius: "5px", transition: "width 0.3s ease" }} />
          </div>

          <p style={{ fontSize: "0.85rem", color: "#a0aba4", margin: 0 }}>
            💡 Un profil complété à 100% augmente de **3.5x** les chances de correspondances mutuelles.
          </p>
        </div>

        {/* Profile Form */}
        <div style={{ backgroundColor: "#14231a", borderRadius: "24px", border: "1px solid rgba(212, 163, 115, 0.25)", padding: "2rem" }}>
          
          {/* Avatar Section */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(212, 163, 115, 0.15)" }}>
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                alt="Avatar"
                style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "3px solid #d4a373" }}
              />
              <button style={{ position: "absolute", bottom: "0", right: "0", backgroundColor: "#d4a373", color: "#0b130e", border: "none", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {formData.firstName}, {formData.age} ans <ShieldCheck color="#52b788" size={20} />
              </h2>
              <div style={{ fontSize: "0.85rem", color: "#d4a373", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <MapPin size={14} /> {formData.city}, {formData.country}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Profession</label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#d4a373", fontWeight: "600", marginBottom: "0.5rem" }}>Biographie & Intentions</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{ width: "100%", backgroundColor: "#081c15", border: "1px solid rgba(212, 163, 115, 0.3)", color: "#fff", padding: "0.8rem 1rem", borderRadius: "12px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Incognito Mode Toggle */}
            <div style={{ backgroundColor: "#081c15", padding: "1rem 1.25rem", borderRadius: "16px", border: "1px solid rgba(212, 163, 115, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <EyeOff size={20} color="#d4a373" />
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "700" }}>Mode Incognito Privilège</div>
                  <div style={{ fontSize: "0.75rem", color: "#a0aba4" }}>Seules les personnes que vous aimez pourront vous voir.</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={incognitoMode}
                onChange={(e) => setIncognitoMode(e.target.checked)}
                style={{ accentColor: "#d4a373", width: "20px", height: "20px", cursor: "pointer" }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: isSaved ? "#52b788" : "#d4a373",
                color: "#0b130e",
                fontWeight: "700",
                padding: "1rem",
                borderRadius: "30px",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1rem",
                transition: "all 0.2s ease"
              }}
            >
              <Save size={18} /> {isSaved ? "Modifications Enregistrées !" : "Enregistrer les modifications"}
            </button>

          </form>
        </div>

      </main>
    </div>
  );
}
