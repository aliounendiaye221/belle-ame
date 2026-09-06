"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Flag,
  FileText,
  BarChart3,
  TrendingUp,
  Settings,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Sparkles,
  Shield,
} from "lucide-react";
import { UserButton, useUser } from "@/lib/clerk-admin";
import { backofficeStore } from "@/lib/backoffice-store";

interface AdminNavbarProps {
  title?: string;
  subtitle?: string;
}

export default function AdminNavbar({ title, subtitle }: AdminNavbarProps) {
  const pathname = usePathname();
  const { signOut } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ kycPending: 0, moderationPending: 0 });

  useEffect(() => {
    const s = backofficeStore.getDashboardStats();
    setStats({
      kycPending: s.kycPending,
      moderationPending: s.moderationPending,
    });
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    {
      href: "/kyc",
      label: `File KYC`,
      badge: stats.kycPending > 0 ? stats.kycPending : undefined,
      badgeColor: "#f4c07c",
      icon: <ShieldCheck size={16} />,
    },
    {
      href: "/moderation",
      label: `Modération SLA`,
      badge: stats.moderationPending > 0 ? stats.moderationPending : undefined,
      badgeColor: "#e63946",
      icon: <Flag size={16} />,
    },
    { href: "/users", label: "Utilisateurs", icon: <Users size={16} /> },
    { href: "/analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
    { href: "/audit", label: "Piste d'Audit", icon: <FileText size={16} /> },
    { href: "/growth", label: "Croissance", icon: <TrendingUp size={16} /> },
    { href: "/settings", label: "Paramètres", icon: <Settings size={16} /> },
  ];

  return (
    <>
      <header
        style={{
          padding: "0.85rem 1.5rem",
          borderBottom: "1px solid rgba(212, 163, 115, 0.18)",
          backgroundColor: "#14231a",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Brand & Module Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #d4a373, #f4c07c)",
                  color: "#0b130e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  fontSize: "1.1rem",
                  boxShadow: "0 0 15px rgba(244, 192, 124, 0.35)",
                }}
              >
                Â
              </div>
              <div>
                <div style={{ fontWeight: "900", fontSize: "1rem", color: "#fbfbfb", lineHeight: 1.2 }}>
                  {title || "Super Admin"}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#d4a373", fontWeight: "700" }}>
                  {subtitle || "« À Chacun Une Belle Âme »"}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav
            className="desktop-admin-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: isActive ? "800" : "600",
                    color: isActive ? "#070d09" : "#c7cfcb",
                    backgroundColor: isActive ? "#f4c07c" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      style={{
                        backgroundColor: link.badgeColor,
                        color: "#070d09",
                        fontSize: "0.68rem",
                        fontWeight: "900",
                        padding: "1px 6px",
                        borderRadius: "999px",
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Controls: User button & Mobile burger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <UserButton />

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-admin-burger"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(212, 163, 115, 0.25)",
                color: "#f4c07c",
                borderRadius: "10px",
                width: "40px",
                height: "40px",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Horizontal Sub-Bar for Quick 1-Tap Access */}
      <div
        className="mobile-quick-scroll-bar"
        style={{
          backgroundColor: "#0d1a12",
          borderBottom: "1px solid rgba(212, 163, 115, 0.15)",
          padding: "8px 12px",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          WebkitOverflowScrolling: "touch",
          zIndex: 40,
        }}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                textDecoration: "none",
                fontSize: "0.78rem",
                fontWeight: isActive ? "800" : "600",
                color: isActive ? "#070d09" : "#c7cfcb",
                backgroundColor: isActive ? "#f4c07c" : "rgba(255, 255, 255, 0.04)",
                border: isActive ? "1px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.12)",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                flexShrink: 0,
              }}
            >
              {link.icon}
              <span>{link.label}</span>
              {link.badge && (
                <span
                  style={{
                    backgroundColor: link.badgeColor,
                    color: "#070d09",
                    fontSize: "0.65rem",
                    fontWeight: "900",
                    padding: "1px 5px",
                    borderRadius: "999px",
                  }}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Mobile Full Screen Drawer if Burger Toggled */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            top: "58px",
            backgroundColor: "rgba(11, 19, 14, 0.98)",
            zIndex: 90,
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#d4a373", fontWeight: "800", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Modules de Gestion Super Admin
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: "14px 16px",
                borderRadius: "14px",
                backgroundColor: pathname === link.href ? "rgba(244, 192, 124, 0.15)" : "rgba(255, 255, 255, 0.03)",
                border: pathname === link.href ? "1.5px solid #f4c07c" : "1px solid rgba(255, 255, 255, 0.06)",
                color: pathname === link.href ? "#f4c07c" : "#fbfbfb",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontWeight: "700",
                fontSize: "0.95rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {link.icon}
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span style={{ backgroundColor: link.badgeColor, color: "#070d09", padding: "2px 8px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "900" }}>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              signOut();
            }}
            style={{
              marginTop: "auto",
              padding: "14px",
              borderRadius: "14px",
              backgroundColor: "rgba(230, 57, 70, 0.15)",
              border: "1px solid #e63946",
              color: "#ff858d",
              fontWeight: "800",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <LogOut size={18} /> Déconnexion Sécurisée
          </button>
        </div>
      )}
    </>
  );
}
