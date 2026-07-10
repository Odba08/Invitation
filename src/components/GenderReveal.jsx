// src/components/GenderReveal.jsx
import React, { useState, useEffect } from "react";
import { steinService } from "../services/steinService";

export default function GenderReveal({ selectedGender, setSelectedGender }) {
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [voteStats, setVoteStats] = useState({
    boyVotes: 0,
    girlVotes: 0,
    boyPercentage: 50,
    girlPercentage: 50,
    totalVotes: 0,
  });

  const fetchStats = async () => {
    try {
      const stats = await steinService.getVoteStats();
      setVoteStats(stats);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  useEffect(() => {
    // Si ya completaron la confirmación (RSVP), se muestra la estadística
    const rsvpStatus = localStorage.getItem("rsvp_submitted") === "true";
    if (rsvpStatus) {
      setHasConfirmed(true);
    }
    fetchStats();
    
    // Escuchar el evento de envío RSVP para recargar estadísticas inmediatamente
    const handleRsvpSuccess = () => {
      setHasConfirmed(true);
      fetchStats();
    };

    window.addEventListener("rsvp_submitted_event", handleRsvpSuccess);
    return () => {
      window.removeEventListener("rsvp_submitted_event", handleRsvpSuccess);
    };
  }, []);

  const selectTeam = (gender) => {
    const votoString = gender === "boy" ? "Niño" : "Niña";
    setSelectedGender(votoString);
    console.log(`🎯 Team seleccionado localmente: ${votoString}. Desplazando al formulario RSVP...`);
    
    // Desplazar suavemente al formulario RSVP
    setTimeout(() => {
      const element = document.getElementById("rsvp-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="gender-reveal-card">
      <div className="gender-reveal-header">
        <h2 className="reveal-title">¿Niño o Niña?</h2>
        <p className="reveal-subtitle">
          ¡Aún no conocemos el sexo del bebé! Vota por tu favorito y acompáñanos en la dulce espera.
        </p>
      </div>

      <div className="reveal-gift-hints" style={{
        margin: "15px auto",
        fontSize: "0.85rem",
        color: "var(--color-text-dark)",
        backgroundColor: "var(--color-olive-light)",
        padding: "12px 16px",
        borderRadius: "12px",
        border: "1px solid var(--color-cream-dark)",
        maxWidth: "95%",
        textAlign: "left"
      }}>
        <p style={{ fontWeight: "700", marginBottom: "8px", color: "var(--color-olive-dark)", textAlign: "center", fontSize: "0.9rem" }}>
          🎁 Detalle según tu voto:
        </p>
        <p style={{ margin: "6px 0", display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <span>💗</span> <span>Si crees que es <strong>niña</strong> trae: <strong>toallitas húmedas</strong></span>
        </p>
        <p style={{ margin: "6px 0", display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <span>💙</span> <span>Si crees que es <strong>niño</strong> trae: <strong>pañales</strong></span>
        </p>
      </div>

      <div className="poll-container" style={{ borderBottom: "none", paddingBottom: 0 }}>
        {!hasConfirmed ? (
          <>
            <p className="poll-prompt">Elige tu Team:</p>
            <div className="poll-buttons">
              <button 
                className={`poll-btn boy ${selectedGender === "Niño" ? "active-selection" : ""}`} 
                onClick={() => selectTeam("boy")}
                style={selectedGender === "Niño" ? { border: "2px solid var(--color-boy)", transform: "scale(1.05)" } : {}}
              >
                <span className="emoji">💙</span> Team Niño
              </button>
              <button 
                className={`poll-btn girl ${selectedGender === "Niña" ? "active-selection" : ""}`} 
                onClick={() => selectTeam("girl")}
                style={selectedGender === "Niña" ? { border: "2px solid var(--color-girl)", transform: "scale(1.05)" } : {}}
              >
                <span className="emoji">💗</span> Team Niña
              </button>
            </div>
            
            {selectedGender && (
              <p className="voted-thanks animate-fade-in" style={{ color: "var(--color-olive-dark)", fontWeight: 600, marginTop: "15px" }}>
                ¡Has seleccionado Team {selectedGender}! 👇 Ingresa tu nombre abajo en la confirmación para registrar tu voto en el Excel.
              </p>
            )}
          </>
        ) : (
          <div className="poll-results">
            <p className="poll-prompt" style={{ textAlign: "center", color: "var(--color-olive-dark)" }}>
              ¡Gracias por confirmar tu asistencia y votar! Así van las apuestas:
            </p>
            
            <div className="result-row">
              <div className="result-label">
                <span>💙 Team Niño</span>
                <span>{voteStats.boyPercentage}% ({voteStats.boyVotes} votos)</span>
              </div>
              <div className="result-bar-bg">
                <div 
                  className="result-bar-fill boy" 
                  style={{ width: `${voteStats.boyPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="result-row">
              <div className="result-label">
                <span>💗 Team Niña</span>
                <span>{voteStats.girlPercentage}% ({voteStats.girlVotes} votos)</span>
              </div>
              <div className="result-bar-bg">
                <div 
                  className="result-bar-fill girl" 
                  style={{ width: `${voteStats.girlPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <p className="voted-thanks" style={{ marginTop: "15px" }}>
              Total de votos recibidos: {voteStats.totalVotes}
            </p>
            

          </div>
        )}
      </div>
    </div>
  );
}
