import React, { useState, useEffect } from 'react';

export default function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`toast ${type === "success" ? "ok" : "er"}`}>
      <div className="tico">{type === "success" ? "✓" : "✕"}</div>{msg}
    </div>
  );
}
