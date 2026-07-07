// src/components/RsvpForm.jsx
import React, { useState } from "react";
import { Check, Mail } from "lucide-react";
import { steinService } from "../services/steinService";
import { CONFIG } from "../config";

export default function RsvpForm({ selectedGender, setSelectedGender }) {
  const [formData, setFormData] = useState({
    name: "",
    attending: true,
    guestsCount: 1,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAttendingChange = (isAttending) => {
    setFormData((prev) => ({
      ...prev,
      attending: isAttending,
      guestsCount: isAttending ? 1 : 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Por favor, ingresa tu nombre completo.");
      return;
    }

    if (!selectedGender) {
      setErrorMessage("Por favor, vota por lo que crees que será el bebé (Niño o Niña) antes de confirmar.");
      return;
    }
    
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Enviar la confirmación y el voto juntos en una sola fila
      await steinService.submitRsvp({
        name: formData.name,
        attending: formData.attending,
        guestsCount: formData.attending ? parseInt(formData.guestsCount, 10) : 0,
        message: formData.message,
        voto: selectedGender // 'Niño' o 'Niña'
      });
      
      // Guardar estado en localStorage
      localStorage.setItem("rsvp_submitted", "true");
      localStorage.setItem("gender_voted", selectedGender === "Niño" ? "boy" : "girl");
      
      // Disparar evento para que el componente de estadísticas se recargue
      window.dispatchEvent(new Event("rsvp_submitted_event"));
      
      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage("Ocurrió un error al enviar tu confirmación. Por favor, inténtalo de nuevo.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rsvp-card">
      <div className="rsvp-header">
        <Mail size={32} className="rsvp-icon" />
        <h2 className="rsvp-title">Confirmación de Asistencia</h2>
        <p className="rsvp-subtitle">
          Por favor, ayúdanos a planificar nuestro gran día confirmando antes del <span className="highlight">{CONFIG.confirmation.deadlineDate}</span>.
        </p>
      </div>

      {isSubmitted ? (
        <div className="rsvp-success-message">
          <div className="success-icon-container">
            <Check size={36} className="success-icon" />
          </div>
          <h3>¡Confirmación Recibida!</h3>
          <p>Muchas gracias, tu confirmación y voto han sido guardados.</p>
          {formData.attending ? (
            <p className="success-subtext">¡Nos vemos el 14 de Noviembre! 🎉</p>
          ) : (
            <p className="success-subtext">Sentimos que no puedas acompañarnos, gracias por informarnos. ❤️</p>
          )}
          
          <button 
            onClick={() => {
              localStorage.removeItem("rsvp_submitted");
              localStorage.removeItem("gender_voted");
              setSelectedGender("");
              setIsSubmitted(false);
              setFormData({
                name: "",
                attending: true,
                guestsCount: 1,
                message: "",
              });
              // Disparar evento para refrescar stats a su estado de voto inicial
              window.dispatchEvent(new Event("rsvp_submitted_event"));
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              textDecoration: "underline",
              fontSize: "0.74rem",
              marginTop: "15px",
              cursor: "pointer"
            }}
          >
            Nueva confirmación (solo pruebas)
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rsvp-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Ej. Juan Pérez"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">¿Asistirás al evento?</label>
            <div className="attending-toggle-buttons">
              <button
                type="button"
                className={`toggle-btn yes ${formData.attending ? "active" : ""}`}
                onClick={() => handleAttendingChange(true)}
                disabled={isSubmitting}
              >
                Sí, con gusto
              </button>
              <button
                type="button"
                className={`toggle-btn no ${!formData.attending ? "active" : ""}`}
                onClick={() => handleAttendingChange(false)}
                disabled={isSubmitting}
              >
                No podré asistir
              </button>
            </div>
          </div>

          {formData.attending && (
            <div className="form-group animate-fade-in">
              <label htmlFor="guestsCount" className="form-label">Cantidad de Asistentes (incluyéndote)</label>
              <select
                id="guestsCount"
                name="guestsCount"
                className="form-select"
                value={formData.guestsCount}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value={1}>1 Persona</option>
                <option value={2}>2 Personas</option>
                <option value={3}>3 Personas</option>
                <option value={4}>4 Personas</option>
                <option value={5}>5 Personas</option>
              </select>
            </div>
          )}

          {/* Sección de Apuesta / Voto de Género integrada */}
          <div className="form-group">
            <label className="form-label">¿Qué crees que será el bebé? (Voto obligatorio)</label>
            <div className="attending-toggle-buttons">
              <button
                type="button"
                className={`toggle-btn yes ${selectedGender === "Niño" ? "active" : ""}`}
                onClick={() => setSelectedGender("Niño")}
                disabled={isSubmitting}
                style={selectedGender === "Niño" ? { backgroundColor: "#ebf5ff", borderColor: "var(--color-boy)", color: "#1e70c0" } : {}}
              >
                💙 Team Niño
              </button>
              <button
                type="button"
                className={`toggle-btn no ${selectedGender === "Niña" ? "active" : ""}`}
                onClick={() => setSelectedGender("Niña")}
                disabled={isSubmitting}
                style={selectedGender === "Niña" ? { backgroundColor: "#ffeef6", borderColor: "var(--color-girl)", color: "#cf3780" } : {}}
              >
                💗 Team Niña
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Mensaje para los Novios (Opcional)</label>
            <textarea
              id="message"
              name="message"
              className="form-textarea"
              placeholder="Escribe un lindo mensaje aquí..."
              value={formData.message}
              onChange={handleChange}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <button
            type="submit"
            className="rsvp-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Confirmar Asistencia"}
          </button>
        </form>
      )}
    </div>
  );
}
