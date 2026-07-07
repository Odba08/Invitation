// src/components/Countdown.jsx
import React, { useState, useEffect } from "react";
import { CONFIG } from "../config";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +CONFIG.countdownTargetDate - +new Date();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Formatear números a 2 dígitos
  const pad = (num) => String(num).padStart(2, "0");

  // Días de la semana para el calendario (Estilo clásico)
  const weekdays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

  // Para Agosto 2026: empieza en Sábado (offset de 6 días vacíos) y tiene 31 días
  const startDayOfWeek = 6; // Sábado (0 = Domingo, ..., 6 = Sábado)
  const totalDays = 31;     // Agosto tiene 31 días

  const emptyCells = Array.from({ length: startDayOfWeek });
  const calendarDays = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="countdown-section">
      <div className="countdown-timer-container">
        <p className="countdown-label">FALTAN</p>
        <div className="countdown-timer">
          <div className="time-block">
            <span className="time-number">{pad(timeLeft.days)}</span>
            <span className="time-text">Días</span>
          </div>
          <span className="time-separator">:</span>
          <div className="time-block">
            <span className="time-number">{pad(timeLeft.hours)}</span>
            <span className="time-text">Horas</span>
          </div>
          <span className="time-separator">:</span>
          <div className="time-block">
            <span className="time-number">{pad(timeLeft.minutes)}</span>
            <span className="time-text">Min</span>
          </div>
          <span className="time-separator">:</span>
          <div className="time-block">
            <span className="time-number">{pad(timeLeft.seconds)}</span>
            <span className="time-text">Seg</span>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <p className="calendar-title">EL GRAN DÍA</p>
        <p className="calendar-subtitle">
          {CONFIG.weddingMonthName} {CONFIG.weddingYear}
        </p>
        
        <div className="calendar-grid">
          {/* Cabecera del calendario */}
          {weekdays.map((day) => (
            <div key={day} className="calendar-header-day">
              {day}
            </div>
          ))}

          {/* Celdas vacías de offset para alinear el día 1 en Sábado */}
          {emptyCells.map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty-day" style={{ opacity: 0 }}></div>
          ))}

          {/* Días del mes (Agosto 2026 empieza en Sábado) */}
          {calendarDays.map((day) => {
            const isTargetDay = day === CONFIG.weddingDayNumber;
            return (
              <div
                key={day}
                className={`calendar-day ${isTargetDay ? "target-day" : ""}`}
              >
                {day}
                {isTargetDay && (
                  <div className="calendar-heart-circle">
                    <svg viewBox="0 0 24 24" className="heart-svg">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
