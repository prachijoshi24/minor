// client/src/components/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/assessment">Assessment</NavLink>
        <NavLink to="/relax">Relax</NavLink>
        <NavLink to="/exposure">Exposure Lab</NavLink>
        <NavLink to="/journal">Journal</NavLink>
        <NavLink to="/progress">Progress</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/chat">AI Therapist</NavLink>
      </nav>
    </aside>
  );
}