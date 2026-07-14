// src/config.js

export const CONFIG = {
  // Novios
  groom: "Endir Alvillar",
  bride: "Fiorella Vega de Florio",
  weddingDateFormatted: "08.08.2026",
  weddingYear: "2026",
  weddingMonthName: "AGOSTO",
  weddingDayName: "SÁBADO",
  weddingDayNumber: 8,
  
  // Cuenta regresiva: Año, Mes (0-indexed, 7 = Agosto), Día, Hora, Minutos
  countdownTargetDate: new Date(2026, 7, 8, 21, 0, 0), // 8 de Agosto, 2026 a las 9:00 PM

  // Música de fondo (debe ser una URL directa a un archivo de audio como .mp3)
  // Ubicado en la carpeta /public
  musicUrl: "/camilo.mp3",
  songTitle: "una canción de amor para la pulga - Camilo",
  
  // Evento Unificado: Boda Civil & Gender Reveal
  event: {
    title: "Nuestra Boda Civil & Gender Reveal",
    time: "9:00 pm",
    locationName: "Calle 70 entre Av 16 y Av 16A",
    phrase: "Queremos que seas parte de este gran momento para nosotros",
    mapLink: "https://maps.app.goo.gl/uNrfEcEH3wfiZ9ex7?g_st=iw", // Dejar vacío si no hay link directo
  },

  // Dinámica de regalos para el Gender Reveal según la sospecha
  genderRevealRules: {
    girlGift: "trae: toallitas húmedas",
    boyGift: "trae: pañales",
  },

  // Código de vestimenta
  dressCode: {
    style: "Coctel",
    description: "Les pedimos de corazón evitar vestir con los colores blanco, negro y gris, o tonos similares.",
    photos: [
      "/dress1.png",
      "/suit1.png",
      "/dress2.png",
      "/suit2.png",
      "/dress3.jpg",
      "/suit3.png"
    ]
  },

  // Regalos
  gifts: {
    enabled: true,
    phrase: "El mejor regalo es tu presencia, pero si deseas tener un detalle con nosotros, les dejamos las siguientes opciones:",
    pagoMovil: {
      banco: "Banesco",
      nombre: "Endir Alvillar",
      ci: "20.206.339",
      telefono: "04124726621"
    },
    zelle: {
      nombre: "Fioreanna Vega",
      telefono: "(346) 843-4060"
    },
    binance: {
      correo: "endiralvillar@gmail.com",
      usuario: "Endir Alvillar"
    }
  },

  // Confirmación
  confirmation: {
    deadlineDate: "01 de agosto de 2026",
    // childrenPolicy: "SIN NIÑOS",
    // childrenDescription: "Un evento para adultos está en camino. ¡Así que prepárense para una noche llena de diversión! Dejemos a los niños en casa esta vez.",
    recommendations: "Ser puntual.",
    thankYouMessage: "¡Muchas Gracias!",
  },

  // Stein HQ API Integraciones
  steinApiUrl: "https://api.steinhq.com/v1/storages/6a4d5c1a92b1163e97174745", 
  
  // Nueva API de Stein HQ para consultar pases de invitados (solo lectura)
  steinReadGuestsApiUrl: "https://api.steinhq.com/v1/storages/6a516c6f92b1163e971942da",
  
  // Nombre de la hoja de Google Sheets en Stein HQ
  steinRsvpSheet: "Hoja 1",
  steinVotesSheet: "Hoja 1",
  steinGuestsSheet: "Invitados", // Nombre de la pestaña de la base de datos de invitados

  // Lista de invitados simulados/pruebas (Desarrollo y Fallback)
  mockGuests: [
    { nombre: "Oscar Bueno", cedula: "20206339", pases: 4 },
    { nombre: "Juan Pérez", cedula: "123456", pases: 2 },
    { nombre: "María Gómez", cedula: "789012", pases: 3 },
    { nombre: "Camilo Echeverry", cedula: "999999", pases: 1 },
    { nombre: "Endir Alvillar", cedula: "888888", pases: 2 },
    { nombre: "Fiorella Vega", cedula: "777777", pases: 2 }
  ],
};
