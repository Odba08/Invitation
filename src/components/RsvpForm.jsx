// src/components/RsvpForm.jsx
import React, { useState } from "react";
import { Check, Mail, Search, ArrowLeft, UserCheck } from "lucide-react";
import { steinService } from "../services/steinService";
import { CONFIG } from "../config";

export default function RsvpForm({ selectedGender, setSelectedGender }) {
  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [foundGuest, setFoundGuest] = useState(null);

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
      guestsCount: isAttending && foundGuest ? foundGuest.pases : 0,
    }));
  };

  // Helper para normalizar cadenas (remueve acentos y pasa a mayúsculas)
  const normalise = (str) => {
    return str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
          .toUpperCase()
      : "";
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMessage("Por favor, ingresa tu nombre o cédula.");
      return;
    }

    setErrorMessage("");
    setIsSearching(true);
    setFoundGuest(null);
    setSearchResults([]);

    try {
      const guests = await steinService.fetchGuests();
      const query = normalise(searchQuery);
      const queryWords = query.split(/\s+/).filter((w) => w.length > 0);

      const matches = guests.filter((g) => {
        const normNombre = normalise(g.nombre);
        const normCedula = normalise(g.cedula);

        const matchesCedula = normCedula && (normCedula === query || normCedula.includes(query));
        const matchesName =
          queryWords.length > 0 && queryWords.every((word) => normNombre.includes(word));

        return matchesName || matchesCedula;
      });

      setHasSearched(true);
      if (matches.length === 1) {
        selectGuest(matches[0]);
      } else if (matches.length > 1) {
        setSearchResults(matches);
      } else {
        setErrorMessage("No encontramos tu nombre en la lista de invitados. Por favor, verifica la ortografía o contáctanos para ayudarte.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Ocurrió un error al consultar la lista. Inténtalo de nuevo.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectGuest = (guest) => {
    setFoundGuest(guest);
    setFormData((prev) => ({
      ...prev,
      name: guest.nombre,
      guestsCount: guest.pases,
    }));
    setErrorMessage("");
  };

  const resetSearch = () => {
    setFoundGuest(null);
    setSearchResults([]);
    setHasSearched(false);
    setSearchQuery("");
    setErrorMessage("");
    setFormData({
      name: "",
      attending: true,
      guestsCount: 1,
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Por favor, selecciona o busca tu invitación.");
      return;
    }

    if (!selectedGender) {
      setErrorMessage("Por favor, vota por lo que crees que será el bebé (Niño o Niña) antes de confirmar.");
      return;
    }
    
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await steinService.submitRsvp({
        name: formData.name,
        cedula: foundGuest ? foundGuest.cedula : "",
        attending: formData.attending,
        guestsCount: formData.attending ? parseInt(formData.guestsCount, 10) : 0,
        message: formData.message,
        voto: selectedGender
      });
      
      localStorage.setItem("rsvp_submitted", "true");
      localStorage.setItem("gender_voted", selectedGender === "Niño" ? "boy" : "girl");
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
          Por favor, confirma tu asistencia antes del <span className="highlight">{CONFIG.confirmation.deadlineDate}</span>.
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
            <p className="success-subtext">¡Nos vemos el 08 de Agosto! 🎉</p>
          ) : (
            <p className="success-subtext">Sentimos que no puedas acompañarnos, gracias por informarnos. ❤️</p>
          )}

        </div>
      ) : !foundGuest ? (
        /* PASO 1: BÚSQUEDA DE INVITADO */
        <div className="rsvp-search-container">
          <form onSubmit={handleSearch} className="rsvp-form">
            <div className="form-group">
              <label htmlFor="searchQuery" className="form-label" style={{ textAlign: "center", display: "block" }}>
                Escribe tu Nombre o Cédula:
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  id="searchQuery"
                  className="form-input"
                  placeholder="Ej. Oscar Bueno o 20206339"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isSearching}
                  style={{ paddingRight: "40px" }}
                  required
                />
                <Search 
                  size={18} 
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                    opacity: 0.6
                  }} 
                />
              </div>
            </div>

            {errorMessage && <p className="form-error" style={{ textAlign: "center" }}>{errorMessage}</p>}

            <button
              type="submit"
              className="rsvp-submit-btn"
              disabled={isSearching}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {isSearching ? "Buscando..." : "Buscar Invitación"}
            </button>
          </form>

          {/* Múltiples resultados encontrados */}
          {searchResults.length > 0 && (
            <div className="search-results-list" style={{ marginTop: "20px", animation: "fadeIn 0.3s ease" }}>
              <p style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "10px", color: "var(--color-text-dark)", textAlign: "center" }}>
                Encontramos varias coincidencias. ¿Cuál es tu nombre?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {searchResults.map((guest, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectGuest(guest)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-cream-dark)",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      color: "var(--color-text-dark)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background-color 0.2s, border-color 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--color-olive-light)";
                      e.currentTarget.style.borderColor = "var(--color-olive)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.borderColor = "var(--color-cream-dark)";
                    }}
                  >
                    <span>{guest.nombre}</span>
                    <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "10px", backgroundColor: "var(--color-cream-dark)", color: "var(--color-text-muted)" }}>
                      {guest.pases} {guest.pases === 1 ? "pase" : "pases"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PASO 2: FORMULARIO DE CONFIRMACIÓN CON DATOS BLOQUEADOS */
        <form onSubmit={handleSubmit} className="rsvp-form animate-fade-in">
          <div className="guest-welcome-badge" style={{
            backgroundColor: "var(--color-olive-light)",
            borderRadius: "12px",
            padding: "15px",
            border: "1px solid var(--color-cream-dark)",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            <UserCheck size={28} style={{ color: "var(--color-olive)", margin: "0 auto 8px auto" }} />
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-olive-dark)", fontWeight: "700" }}>
              ¡Hola, {foundGuest.nombre}!
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              Hemos encontrado tu invitación.
            </p>
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
            <div className="form-group" style={{
              backgroundColor: "rgba(94, 107, 78, 0.03)",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px dashed var(--color-cream-dark)",
              textAlign: "center"
            }}>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-dark)" }}>
                Tienes asignado:
              </p>
              <p style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--color-olive)", margin: "4px 0" }}>
                {foundGuest.pases} {foundGuest.pases === 1 ? "Pase" : "Pases"}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                (Cupos fijos y asignados individualmente)
              </p>
            </div>
          )}

          {/* Voto de Género obligatorio */}
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

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              className="rsvp-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Confirmar Asistencia"}
            </button>

            <button
              type="button"
              onClick={resetSearch}
              disabled={isSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                background: "none",
                border: "none",
                color: "var(--color-text-muted)",
                fontSize: "0.8rem",
                cursor: "pointer",
                padding: "8px",
                textDecoration: "underline"
              }}
            >
              <ArrowLeft size={14} /> Buscar otra invitación / No soy yo
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
