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
  ExternalLink,
} from "lucide-react";
import { UserButton, useUser } from "@/lib/clerk-admin";
import { backofficeStore } from "@/lib/backoffice-store";

interface AdminNavbarProps {
  title?: string;
  subtitle?: string;
}

export default function AdminNavbar({ title, subtitle }: AdminNavbarProps) {
  const pathname = usePathname();
  const { user, signOut } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ kycPending: 0, moderationPending: 0 });

  useEffect(() => {
    const s = backofficeStore.getDashboardStats();
    setStats({
      kycPending: s.kycPending,
      moderationPending: s.moderationPending,
    });
  }, [pathname]);

  // Fermer le tiroir mobile lors du changement de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
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
          padding: "0.85rem 1.25rem",
          borderBottom: "1px solid rgba(212, 163, 115, 0.2)",
          backgroundColor: "#0d1a12",
          position: "sticky",
          top: 0,
          zIndex: 60,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Brand & Module Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #d4a373, #f4c07c)",
                  color: "#0b130e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                  boxShadow: "0 0 15px rgba(244, 192, 124, 0.35)",
                }}
              >
                Â
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: "900", fontSize: "0.95rem", color: "#fbfbfb", lineHeight: 1.2, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {title || "Super Admin"}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#d4a373", fontWeight: "700", whiteSpace: "nowrap" }}>
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
              gap: "0.35rem",
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "6px 11px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontSize: "0.82rem",
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
            <UserButton />

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-admin-burger"
              aria-label="Menu Mobile"
              style={{
                backgroundColor: "rgba(244, 192, 124, 0.1)",
                border: "1px solid rgba(212, 163, 115, 0.3)",
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
          backgroundColor: "#070d09",
          borderBottom: "1px solid rgba(212, 163, 115, 0.15)",
          padding: "7px 10px",
          display: "flex",
          gap: "6px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          WebkitOverflowScrolling: "touch",
          zIndex: 50,
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
                fontSize: "0.76rem",
                fontWeight: isActive ? "800" : "600",
                color: isActive ? "#070d09" : "#c7cfcb",
                backgroundColor: isActive ? "#f4c07c" : "rgba(255, 255, 255, 0.04)",
                border: isActive ? "1px solid #f4c07c" : "1px solid rgba(212, 163, 115, 0.12)",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                flexShrink: 0,
                minHeight: "32px",
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

      {/* Mobile Full Screen Sliding Drawer if Burger Toggled */}
      {isMobileMenuOpen && (
        <>
          <div
            className="mobile-drawer-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 80,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "58px",
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#0b160f",
              zIndex: 90,
              padding: "1.25rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div style={{ fontSize: "0.78rem", color: "#d4a373", fontWeight: "800", textTransform: "uppercase", marginBottom: "0.25rem", letterSpacing: "0.05em" }}>
              Navigation Administration
            </div>

            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "14px",
                    backgroundColor: isActive ? "rgba(244, 192, 124, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    border: isActive ? "1.5px solid #f4c07c" : "1px solid rgba(255, 255, 255, 0.06)",
                    color: isActive ? "#f4c07c" : "#fbfbfb",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: "700",
                    fontSize: "0.92rem",
                    minHeight: "48px",
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
              );
            })}

            <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid rgba(212, 163, 115, 0.15)", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link
                href="https://belle-ame-web.vercel.app"
                target="_blank"
                style={{
                  padding: "12px 14px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#c7cfcb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  minHeight: "44px",
                }}
              >
                <span>Ouvrir l&apos;Appli Web Membres</span>
                <ExternalLink size={15} />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(230, 57, 70, 0.15)",
                  border: "1px solid #e63946",
                  color: "#ff858d",
                  fontWeight: "800",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  minHeight: "46px",
                }}
              >
                <LogOut size={16} /> Déconnexion Sécurisée
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
