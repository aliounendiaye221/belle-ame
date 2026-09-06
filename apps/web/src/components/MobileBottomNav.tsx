"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageCircle, Crown, User, Settings } from "lucide-react";
import { realPlatformStore } from "@/lib/real-platform-store";

interface MobileBottomNavProps {
  activeTab: "discover" | "matches" | "subscription" | "profile" | "settings";
}

export default function MobileBottomNav({ activeTab }: MobileBottomNavProps) {
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    try {
      const matches = realPlatformStore.getMatches();
      const unread = matches.filter((m) => !!m.unread).length;
      setUnreadCount(unread);
    } catch {
      // ignore
    }
  }, []);

  const navItems = [
    {
      id: "discover",
      label: "Découvrir",
      href: "/discover",
      icon: <Sparkles size={20} />,
    },
    {
      id: "matches",
      label: "Messages",
      href: "/matches",
      icon: <MessageCircle size={20} />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: "subscription",
      label: "Privilège",
      href: "/subscription",
      icon: <Crown size={20} />,
      highlight: true,
    },
    {
      id: "profile",
      label: "Profil",
      href: "/profile",
      icon: <User size={20} />,
    },
    {
      id: "settings",
      label: "Réglages",
      href: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <nav
      className="mobile-bottom-navbar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        backgroundColor: "rgba(10, 20, 14, 0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(212, 163, 115, 0.25)",
        boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.7)",
        paddingTop: "8px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        paddingLeft: "8px",
        paddingRight: "8px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const color = isActive
          ? item.highlight
            ? "#f4c07c"
            : "#52b788"
          : "#8a968f";

        return (
          <Link
            key={item.id}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              padding: "6px 10px",
              minWidth: "56px",
              textDecoration: "none",
              position: "relative",
              transition: "transform 0.15s ease",
            }}
          >
            <div
              style={{
                position: "relative",
                color: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: isActive ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s ease",
              }}
            >
              {item.icon}

              {/* Badge de message non lu */}
              {item.badge !== undefined && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-6px",
                    backgroundColor: "#e63946",
                    color: "#ffffff",
                    fontSize: "0.65rem",
                    fontWeight: "900",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 8px rgba(230, 57, 70, 0.6)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: isActive ? 800 : 500,
                color: color,
                letterSpacing: "0.02em",
              }}
            >
              {item.label}
            </span>

            {/* Point indicateur actif */}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  bottom: "2px",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: `0 0 6px ${color}`,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
