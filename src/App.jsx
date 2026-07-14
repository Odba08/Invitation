// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import { MapPin, Heart, User, CheckCircle, HelpCircle, Gift } from "lucide-react";
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
    
    // Iniciar reproducción de música de inmediato.
    // Al ejecutarlo síncronamente (sin setTimeout), el navegador lo reconoce como
    // parte de la interacción del usuario al hacer clic en "Abrir" y no bloquea el audio.
    if (audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play().catch((err) => {
        console.log("Autoplay bloqueado o fallido:", err);
        setIsPlaying(false); // Revertir a pausado si el navegador lo bloquea
      });
    }

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
              Fiorella <br />
              &amp; <br />
              Endir
            </h1>
            <p className="header-event-type" style={{ fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "600", color: "var(--color-olive)", margin: "10px 0" }}>
              Nuestra Boda Civil &amp; Gender Reveal
            </p>
            <p className="header-date">{CONFIG.weddingDateFormatted}</p>
          </header>

          {/* Primer bloque: Foto de Portada y Frase */}
          <section className="invitation-section scroll-reveal">
            <div className="photo-frame-container">
              <div className="photo-frame">
                <img src="/couple1.JPG" alt="Fiorella &amp; Endir" />
              </div>
            </div>
            <p className="quote-text" style={{ fontStyle: "italic", fontSize: "1.15rem", color: "var(--color-text-dark)", padding: "0 10px" }}>
              "Queremos que seas parte de este gran momento para nosotros"
            </p>
          </section>

          {/* Reproductor de Música */}
          <section className="invitation-section scroll-reveal" style={{ paddingTop: 0 }}>
            <MusicPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioRef={audioRef} />
          </section>

          {/* Bendición, Cuenta Regresiva y Calendario */}
          <section className="invitation-section olive-theme scroll-reveal">
            <p className="benediction-text">
              Tenemos el honor de invitarles a nuestra boda civil.
            </p>
            <Countdown />
          </section>

          {/* Detalles del Evento Civil */}
          <section className="invitation-section scroll-reveal" style={{ borderTop: "1px solid var(--color-cream-dark)", paddingTop: "2rem" }}>
            <div className="details-section" style={{ display: "flex", justifyContent: "center" }}>
              <div className="detail-card" style={{ width: "100%", maxWidth: "380px" }}>
                <Sparkles size={36} className="detail-icon" style={{ margin: "0 auto 10px auto", display: "block" }} />
                <h3 className="detail-title">{CONFIG.event.title}</h3>
                <p className="detail-time" style={{ fontSize: "1.2rem", fontWeight: "700", margin: "10px 0" }}>{CONFIG.event.time}</p>
                <p className="detail-place" style={{ fontSize: "0.95rem", lineHeight: "1.4" }}>
                  <strong>Dirección:</strong> <br />
                  {CONFIG.event.locationName}
                </p>
                <p className="detail-city" style={{ marginTop: "5px", fontSize: "0.85rem", opacity: 0.8 }}>Sábado, 08 de Agosto de 2026</p>
              </div>
            </div>
          </section>

          {/* Segunda Foto de Pareja */}
          <section className="invitation-section scroll-reveal">
            <div className="photo-frame-container">
              <div className="photo-frame alt">
                <img src="/couple2.JPG" alt="Fiorella &amp; Endir caminando" />
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
            <p className="detail-time" style={{ marginBottom: "5px", fontSize: "1.2rem", fontWeight: "700" }}>{CONFIG.dressCode.style}</p>
            <div className="dress-code-icons">
              <div className="dress-icon-container">🤵</div>
              <div className="dress-icon-container">👗</div>
            </div>
            <p className="dress-code-description" style={{ marginBottom: "20px" }}>{CONFIG.dressCode.description}</p>
            
            <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-olive)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Sugerencias de vestimenta:
            </p>
            
            {/* Galería de imágenes de sugerencias */}
            <div className="dress-code-gallery" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "12px",
              padding: "5px",
              justifyContent: "center"
            }}>
              {CONFIG.dressCode.photos.map((photo, index) => (
                <div className="gallery-item" key={index} style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  border: "2px solid #ffffff",
                  aspectRatio: "2/3"
                }}>
                  <img src={photo} alt={`Sugerencia de vestimenta ${index + 1}`} style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }} />
                </div>
              ))}
            </div>
          </section>



          {/* Formulario RSVP */}
          <section className="invitation-section scroll-reveal" id="rsvp-section">
            <RsvpForm selectedGender={selectedGender} setSelectedGender={setSelectedGender} />
          </section>

          {/* Sugerencia de Regalo */}
          {CONFIG.gifts.enabled && (
            <section className="invitation-section scroll-reveal" style={{ borderTop: "1px solid var(--color-cream-dark)", paddingTop: "2.5rem" }}>
              <Gift size={36} className="detail-icon" style={{ margin: "0 auto 15px auto", display: "block" }} />
              <h2 className="dress-code-title">Sugerencia de Regalo</h2>
              <p className="dress-code-description" style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "20px" }}>
                {CONFIG.gifts.phrase}
              </p>

              <div className="gifts-container" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* Pago Móvil */}
                <div className="gift-card" style={{
                  backgroundColor: "var(--color-olive-light)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid var(--color-cream-dark)",
                  textAlign: "left"
                }}>
                  <h4 style={{ color: "var(--color-olive-dark)", marginBottom: "8px", borderBottom: "1px solid var(--color-cream-dark)", paddingBottom: "4px" }}>🇻🇪 Pago Móvil</h4>
                  <p style={{ fontSize: "0.85rem", margin: "3px 0" }}><strong>Banco:</strong> {CONFIG.gifts.pagoMovil.banco}</p>
                  <p style={{ fontSize: "0.85rem", margin: "3px 0" }}><strong>Nombre:</strong> {CONFIG.gifts.pagoMovil.nombre}</p>
                  <p style={{ fontSize: "0.85rem", margin: "3px 0" }}><strong>C.I.:</strong> {CONFIG.gifts.pagoMovil.ci}</p>
                  <p style={{ fontSize: "0.85rem", margin: "3px 0" }}><strong>Teléfono:</strong> {CONFIG.gifts.pagoMovil.telefono}</p>
                  
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`Banco: ${CONFIG.gifts.pagoMovil.banco}\nNombre: ${CONFIG.gifts.pagoMovil.nombre}\nCI: ${CONFIG.gifts.pagoMovil.ci}\nTelefono: ${CONFIG.gifts.pagoMovil.telefono}`);
                      alert("Datos de Pago Móvil copiados al portapapeles");
                    }}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "var(--color-olive)",
                      color: "#ffffff",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Copiar Datos
                  </button>
                </div>

                {/* Zelle */}
                <div className="gift-card" style={{
                  backgroundColor: "var(--color-olive-light)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid var(--color-cream-dark)",
                  textAlign: "left"
                }}>
                  <h4 style={{ color: "var(--color-olive-dark)", marginBottom: "8px", borderBottom: "1px solid var(--color-cream-dark)", paddingBottom: "4px" }}>🇺🇸 Zelle</h4>
                  <p style={{ fontSize: "0.85rem", margin: "3px 0" }}><strong>Nombre:</strong> {CONFIG.gifts.zelle.nombre}</p>
                  <p style={{ fontSize: "0.85rem", margin: "3px 0" }}><strong>Teléfono:</strong> {CONFIG.gifts.zelle.telefono}</p>
                  
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`Zelle: ${CONFIG.gifts.zelle.nombre} - ${CONFIG.gifts.zelle.telefono}`);
                      alert("Datos de Zelle copiados al portapapeles");
                    }}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "var(--color-olive)",
                      color: "#ffffff",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Copiar Datos
                  </button>
                </div>

                {/* Binance */}
                <div className="gift-card" style={{
                  backgroundColor: "var(--color-olive-light)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid var(--color-cream-dark)",
                  textAlign: "left"
                }}>
                  <h4 style={{ color: "var(--color-olive-dark)", marginBottom: "8px", borderBottom: "1px solid var(--color-cream-dark)", paddingBottom: "4px" }}>🪙 Binance</h4>
                  <p style={{ fontSize: "0.85rem", margin: "3px 0" }}><strong>Usuario:</strong> {CONFIG.gifts.binance.usuario}</p>
                  <p style={{ fontSize: "0.85rem", margin: "3px 0" }}><strong>Correo:</strong> {CONFIG.gifts.binance.correo}</p>
                  
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`Binance: ${CONFIG.gifts.binance.correo} (${CONFIG.gifts.binance.usuario})`);
                      alert("Datos de Binance copiados al portapapeles");
                    }}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "var(--color-olive)",
                      color: "#ffffff",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Copiar Datos
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Recomendaciones, Sin Niños y Footer */}
          <section className="invitation-section scroll-reveal" style={{ backgroundColor: "rgba(94, 107, 78, 0.03)", paddingBottom: "4rem" }}>
            <h3 className="rec-title">Recomendaciones</h3>
            <p className="rec-desc">{CONFIG.confirmation.recommendations}</p>
            
            {CONFIG.confirmation.childrenPolicy && (
              <>
                <h3 className="rec-policy">{CONFIG.confirmation.childrenPolicy}</h3>
                <p className="rec-desc">{CONFIG.confirmation.childrenDescription}</p>
              </>
            )}
            
            <p className="footer-thanks">{CONFIG.confirmation.thankYouMessage}</p>

            <div className="photo-frame-container" style={{ marginTop: "2rem" }}>
              <div className="photo-frame">
                <img src="/couple3.JPG" alt="Fiorella &amp; Endir close up" />
              </div>
            </div>
          </section>

        </div>
      )}

      {/* Audio renderizado desde el inicio para permitir la reproducción inmediata al hacer clic */}
      <audio 
        ref={audioRef}
        src={CONFIG.musicUrl}
        loop
        preload="auto"
      />
    </div>
  );
}
