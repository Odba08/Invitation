// src/components/Envelope.jsx
import React from "react";
import { CONFIG } from "../config";

export default function Envelope({ isOpen, onOpen }) {
  // Para abreviar los nombres largos en el sobre cerrado
  const shortNames = "Fiorella & Endir";

  return (
    <div className={`envelope-container ${isOpen ? "open" : ""}`}>
      <div className="envelope-wrapper" onClick={!isOpen ? onOpen : null}>
        
        {/* Parte trasera del sobre (Fondo interior) */}
        <div className="envelope-back"></div>
        
        {/* Flap superior (Tapa del sobre) */}
        <div className="envelope-flap"></div>
        
        {/* Papel/Carta (Se desliza hacia arriba) */}
        <div className="envelope-paper">
          <div className="paper-content">
            <h3 className="paper-title">¡Nos Casamos!</h3>
            <p className="paper-names">
              Fiorella <br />
              &amp; <br />
              Endir
            </p>
            <p className="paper-date">{CONFIG.weddingDateFormatted}</p>
            <button className="paper-btn" onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}>
              Ver Invitación
            </button>
          </div>
        </div>

        {/* Dobleces laterales e inferior que cubren el papel */}
        <div className="envelope-left"></div>
        <div className="envelope-right"></div>
        <div className="envelope-bottom"></div>

        {/* Contenido frontal del sobre (Sello y dedicatoria) */}
        <div className="envelope-front">
          <div className="front-content">
            <h1 className="front-names">{shortNames}</h1>
            <div className="seal-heart">
              <span className="heart-icon">❤️</span>
            </div>
            <p className="front-date">{CONFIG.weddingDateFormatted}</p>
            <p className="tap-prompt">Toca para abrir la carta</p>
          </div>
        </div>

      </div>
    </div>
  );
}
