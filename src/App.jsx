// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import { MapPin, Heart, User, CheckCircle, HelpCircle } from "lucide-react";
import { CONFIG } from "./config";
import Envelope from "./components/Envelope";
import MusicPlayer from "./components/MusicPlayer";
import Countdown from "./components/Countdown";
import GenderReveal from "./components/GenderReveal";
import RsvpForm from "./components/RsvpForm";

// Mapeo de íconos para el itinerario
import { Church, GlassWater, Heart as HeartIcon, Utensils, Sparkles, Clock } from "lucide-react";
const iconMap = {
  church: Church,
  cocktail: GlassWater,
  dance: HeartIcon,
  dinner: Utensils,
  party: Sparkles,
  clock: Clock
};

export default function App() {
  const [isEnvelopeOpening, setIsEnvelopeOpening] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGender, setSelectedGender] = useState(""); // Puede ser 'Niño' o 'Niña'
  const audioRef = useRef(null);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpening(true);
    
    // Iniciar reproducción de música (con retraso opcional para fluidez)
    setTimeout(() => {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.log("Autoplay bloqueado por el navegador, requiere interacción:", err);
        });
      }
    }, 800);

    // Esperar a que termine la animación de apertura (1.5 segundos) para desvanecer el sobre
    setTimeout(() => {
      setIsEnvelopeOpened(true);
    }, 1500);
  };

  // Fallback de IntersectionObserver para animaciones en scroll
  useEffect(() => {
    if (!isEnvelopeOpened) return;

    // Ejecutar solo si no hay soporte nativo de CSS scroll timeline
    const supportsScrollTimeline = CSS.supports("(animation-timeline: view()) and (animation-range: entry)");
    
    if (!supportsScrollTimeline) {
      console.log("Navegador no soporta Scroll Timeline, aplicando fallback de IntersectionObserver");
      
      const revealElements = document.querySelectorAll(".scroll-reveal");
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            } else {
              entry.target.classList.remove("visible");
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -50px 0px"
        }
      );

      revealElements.forEach((el) => {
        el.classList.add("scroll-reveal-fallback");
        observer.observe(el);
      });

      return () => {
        revealElements.forEach((el) => observer.unobserve(el));
      };
    }
  }, [isEnvelopeOpened]);

  return (
    <div className="app-container">
      {/* Sobre interactivo que aparece en pantalla completa */}
      <Envelope isOpening={isEnvelopeOpening} isOpened={isEnvelopeOpened} onOpen={handleEnvelopeOpen} />

      {/* Contenido de la invitación una vez abierto */}
      {isEnvelopeOpened && (
        <div className="invitation-content">
          
          {/* Cabecera / Sección inicial de novios */}
          <header className="wedding-header">
            <h1 className="header-names">
              {CONFIG.bride} <br />
              &amp; <br />
              {CONFIG.groom}
            </h1>
            <p className="header-date">{CONFIG.weddingDateFormatted}</p>
          </header>

          {/* Primer bloque: Foto de Portada y Frase */}
          <section className="invitation-section scroll-reveal">
            <div className="photo-frame-container">
              <div className="photo-frame">
                <img src="/couple1.png" alt="Fiorella &amp; Endir" />
              </div>
            </div>
            <p className="quote-text">
              "De nadie seré, solo de ti. Hasta que mis huesos se vuelvan cenizas y mi corazón deje de latir."
            </p>
          </section>

          {/* Reproductor de Música */}
          <section className="invitation-section scroll-reveal" style={{ paddingTop: 0 }}>
            <MusicPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioRef={audioRef} />
          </section>

          {/* Bendición, Cuenta Regresiva y Calendario */}
          <section className="invitation-section olive-theme scroll-reveal">
            <p className="benediction-text">
              Con la bendición de Dios y nuestros padres, tenemos el honor de invitarles a nuestra boda religiosa.
            </p>
            <Countdown />
          </section>

          {/* Detalles de Ceremonia y Recepción */}
          <section className="invitation-section scroll-reveal">
            <div className="details-section">
              {/* Ceremonia */}
              <div className="detail-card">
                <Church size={36} className="detail-icon" />
                <h3 className="detail-title">{CONFIG.ceremony.title}</h3>
                <p className="detail-time">{CONFIG.ceremony.time}</p>
                <p className="detail-place">{CONFIG.ceremony.locationName}</p>
                <p className="detail-city">{CONFIG.ceremony.city}</p>
                <a 
                  href={CONFIG.ceremony.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="location-btn"
                >
                  <MapPin size={16} /> Ver ubicación
                </a>
              </div>

              {/* Recepción */}
              <div className="detail-card">
                <Sparkles size={36} className="detail-icon" />
                <h3 className="detail-title">{CONFIG.reception.title}</h3>
                <p className="detail-time">{CONFIG.reception.time}</p>
                <p className="detail-place">{CONFIG.reception.locationName}</p>
                <p className="detail-city">{CONFIG.reception.city}</p>
                <a 
                  href={CONFIG.reception.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="location-btn"
                >
                  <MapPin size={16} /> Ver ubicación
                </a>
              </div>
            </div>
          </section>

          {/* Itinerario de actividades */}
          <section className="invitation-section scroll-reveal" style={{ backgroundColor: "rgba(94, 107, 78, 0.03)" }}>
            <h2 className="timeline-section-title">Itinerario de actividades</h2>
            <div className="timeline-container">
              {CONFIG.itinerary.map((item, index) => {
                const IconComponent = iconMap[item.icon] || Clock;
                return (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-node">
                      <IconComponent size={14} className="timeline-node-icon" />
                    </div>
                    <div>
                      <span className="timeline-time">{item.time}</span>
                      <h4 className="timeline-title">{item.title}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Segunda Foto de Pareja */}
          <section className="invitation-section scroll-reveal">
            <div className="photo-frame-container">
              <div className="photo-frame alt">
                <img src="/couple2.png" alt="Fiorella &amp; Endir caminando" />
              </div>
            </div>
          </section>

          {/* Revelación de Sexo */}
          <section className="invitation-section scroll-reveal" style={{ paddingTop: 0 }}>
            <GenderReveal selectedGender={selectedGender} setSelectedGender={setSelectedGender} />
          </section>

          {/* Código de vestimenta */}
          <section className="invitation-section scroll-reveal" style={{ borderTop: "1px solid var(--color-cream-dark)" }}>
            <h2 className="dress-code-title">Código de vestimenta</h2>
            <p className="detail-time" style={{ marginBottom: "5px" }}>{CONFIG.dressCode.style}</p>
            <div className="dress-code-icons">
              <div className="dress-icon-container">🤵</div>
              <div className="dress-icon-container">👗</div>
            </div>
            <p className="dress-code-description">{CONFIG.dressCode.description}</p>
          </section>



          {/* Formulario RSVP */}
          <section className="invitation-section scroll-reveal" id="rsvp-section">
            <RsvpForm selectedGender={selectedGender} setSelectedGender={setSelectedGender} />
          </section>

          {/* Recomendaciones, Sin Niños y Footer */}
          <section className="invitation-section scroll-reveal" style={{ backgroundColor: "rgba(94, 107, 78, 0.03)", paddingBottom: "4rem" }}>
            <h3 className="rec-title">Recomendaciones</h3>
            <p className="rec-desc">{CONFIG.confirmation.recommendations}</p>
            
            <h3 className="rec-policy">{CONFIG.confirmation.childrenPolicy}</h3>
            <p className="rec-desc">{CONFIG.confirmation.childrenDescription}</p>
            
            <p className="footer-thanks">{CONFIG.confirmation.thankYouMessage}</p>

            <div className="photo-frame-container" style={{ marginTop: "2rem" }}>
              <div className="photo-frame">
                <img src="/couple3.png" alt="Fiorella &amp; Endir close up" />
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
