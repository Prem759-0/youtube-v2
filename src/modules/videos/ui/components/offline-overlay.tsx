"use client";

import { useEffect, useState } from "react";

export const OfflineOverlay = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#1f1f1f",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      {/* YouTube logo */}
      <svg
        width="68"
        height="48"
        viewBox="0 0 68 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="68" height="48" rx="12" fill="#FF0000" />
        <path d="M28 14L46 24L28 34V14Z" fill="white" />
      </svg>

      {/* Offline message */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#aaa",
          fontSize: "15px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Cloud-off icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 2.5 8.17" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
        <span>You&apos;re offline</span>
      </div>
    </div>
  );
};