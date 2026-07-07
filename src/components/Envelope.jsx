// src/components/Envelope.jsx
import React from "react";
import { CONFIG } from "../config";

export default function Envelope({ isOpening, isOpened, onOpen }) {
  // Para abreviar los nombres largos en el sobre cerrado
  const shortNames = "Fiorella & Endir";

  return (
    <div className={`envelope-container ${isOpening ? "open-animate" : ""} ${isOpened ? "fade-out" : ""}`}>
      <div className="envelope-wrapper" onClick={!isOpening && !isOpened ? onOpen : null}>
        
        {/* Cuerpo del sobre con esquinas redondeadas y overflow hidden */}
        <div className="envelope-body">
          {/* Parte trasera del sobre (Fondo interior) */}
          <div className="envelope-back"></div>
          
          {/* Dobleces laterales e inferior que cubren el papel */}
          <div className="envelope-left"></div>
          <div className="envelope-right"></div>
          <div className="envelope-bottom"></div>
        </div>
        
        {/* Flap superior (Tapa del sobre) - Fuera del cuerpo para que no se corte al abrirse */}
        <div className="envelope-flap"></div>
        
        {/* Papel/Carta (Se desliza hacia arriba) - Fuera del cuerpo para que no se corte al salir */}
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

        {/* Contenido frontal del sobre (Sello y dedicatoria) */}
        <div className="envelope-front">
          <div className="front-content">
            <h1 className="front-names">{shortNames}</h1>
            <div className="seal-heart">
              <span className="heart-icon">🤍</span>
            </div>
            <p className="front-date">{CONFIG.weddingDateFormatted}</p>
            <p className="tap-prompt">Toca para abrir la carta</p>
          </div>
        </div>

      </div>
    </div>
  );
}
