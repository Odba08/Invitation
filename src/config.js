// src/config.js

export const CONFIG = {
  // Novios
  groom: "Endir Alvillar",
  bride: "Fiorella Vega de Florio",
  weddingDateFormatted: "14.11.2026",
  weddingYear: "2026",
  weddingMonthName: "NOVIEMBRE",
  weddingDayName: "SÁBADO",
  weddingDayNumber: 14,
  
  // Cuenta regresiva: Año, Mes (0-indexed, 10 = Noviembre), Día, Hora, Minutos
  countdownTargetDate: new Date(2026, 10, 14, 16, 30, 0), // 14 de Noviembre, 2026 a las 4:30 PM

  // Música de fondo (debe ser una URL directa a un archivo de audio como .mp3)
  // Usamos una melodía romántica de piano de fondo de dominio público
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Canción de prueba, se puede reemplazar por cualquiera
  songTitle: "Melodía Romántica de Piano",
  
  // Ceremonia Religiosa
  ceremony: {
    title: "Ceremonia Religiosa",
    time: "4:30 pm",
    locationName: "IGLESIA SAN FRANCISCO",
    city: "Santa Cruz de la Sierra",
    mapLink: "https://maps.app.goo.gl/t6qXnUu9Z2JcZ2jC7", // Ejemplo de mapa
  },

  // Recepción
  reception: {
    title: "Recepción",
    time: "5:30 pm",
    locationName: "SALÓN VENDIMIA",
    city: "Santa Cruz de la Sierra",
    mapLink: "https://maps.app.goo.gl/t6qXnUu9Z2JcZ2jC7", // Ejemplo de mapa
  },

  // Itinerario de actividades
  itinerary: [
    { time: "4:30 pm", title: "Iglesia", icon: "church" },
    { time: "5:30 pm", title: "Coctel de Bienvenida", icon: "cocktail" },
    { time: "7:00 pm", title: "Primer Baile, Vals y Brindis", icon: "dance" },
    { time: "7:30 pm", title: "Cena", icon: "dinner" },
    { time: "8:30 pm", title: "Fiesta y Encuesta de Sexo", icon: "party" },
    { time: "3:00 am", title: "Fin del Evento", icon: "clock" }
  ],

  // Revelación de Sexo (Encuesta abierta sin revelar)
  genderReveal: {
    enabled: true,
  },

  // Código de vestimenta
  dressCode: {
    style: "Elegante",
    description: "Con cariño les pedimos evitar prendas en color blanco y tonos similares.",
  },

  // Confirmación
  confirmation: {
    deadlineDate: "01 de noviembre de 2026",
    childrenPolicy: "SIN NIÑOS",
    childrenDescription: "Un evento para adultos está en camino. ¡Así que prepárense para una noche llena de diversión! Dejemos a los niños en casa esta vez.",
    recommendations: "Seguir las indicaciones del personal de la boda. Ser puntual.",
    thankYouMessage: "¡Muchas Gracias!",
  },

  // Stein HQ API Integraciones
  steinApiUrl: "https://api.steinhq.com/v1/storages/6a4d5c1a92b1163e97174745", 
  
  // Nombre de la hoja de Google Sheets en Stein HQ
  steinRsvpSheet: "Hoja 1",
  steinVotesSheet: "Hoja 1",
};
