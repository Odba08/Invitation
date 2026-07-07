// src/services/steinService.js
import { CONFIG } from "../config";

/**
 * Servicio para conectarse con la API de Stein HQ usando autenticación Basic Auth.
 */

// Credenciales para la autenticación de Stein HQ
const AUTH_HEADER = "Basic aW52aXRhdGlvbjppbnZpdGF0aW9uMTIzNDU="; // base64 de "invitation:invitation12345"

// Helper para guardar/obtener datos locales de simulación
const getLocalData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const steinService = {
  /**
   * Envía la confirmación de asistencia (RSVP) a la hoja de Google Sheets.
   */
  async submitRsvp(rsvpData) {
    const payload = {
      nombre: rsvpData.name,
      asistencia: rsvpData.attending ? "Sí" : "No",
      cantidad: rsvpData.attending ? rsvpData.guestsCount : 0,
      mensaje: rsvpData.message || "",
      voto: rsvpData.voto || "",
      fecha: new Date().toLocaleDateString("es-ES") + " " + new Date().toLocaleTimeString("es-ES")
    };

    console.log("🗳️ [RSVP] Iniciando envío de datos de confirmación a Stein HQ...");
    console.log("📦 [RSVP] Payload preparado:", payload);

    if (!CONFIG.steinApiUrl) {
      console.warn("⚠️ [RSVP] No hay CONFIG.steinApiUrl configurada. Usando simulación local.");
      const localRsvps = getLocalData("wedding_rsvp");
      localRsvps.push(payload);
      saveLocalData("wedding_rsvp", localRsvps);
      
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("✅ [RSVP] Simulación exitosa, guardado en localStorage.");
      return { success: true, simulated: true };
    }

    try {
      const url = `${CONFIG.steinApiUrl.replace(/\/$/, "")}/${CONFIG.steinRsvpSheet}`;
      console.log(`🌐 [RSVP] Realizando POST a URL: ${url}`);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": AUTH_HEADER
        },
        body: JSON.stringify([payload]),
      });

      console.log(`📡 [RSVP] Código de respuesta HTTP: ${response.status} (${response.statusText})`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [RSVP] Error en respuesta de Stein HQ:", errorText);
        throw new Error(`Error ${response.status} en la API de Stein: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ [RSVP] Datos guardados con éxito en Google Sheets:", result);
      return { success: true, result };
    } catch (error) {
      console.error("❌ [RSVP] Error capturado al enviar a Stein HQ:", error);
      throw error;
    }
  },

  /**
   * Envía un voto para la revelación del sexo del bebé.
   */
  async submitVote(genderVote) {
    const payload = {
      nombre: "Voto Encuesta",
      asistencia: "No aplica",
      cantidad: 0,
      mensaje: "Votación de sexo del bebé",
      voto: genderVote, // 'Niño' o 'Niña'
      fecha: new Date().toLocaleDateString("es-ES") + " " + new Date().toLocaleTimeString("es-ES")
    };

    console.log(`🗳️ [VOTO] Iniciando envío de voto (${genderVote}) a Stein HQ...`);
    console.log("📦 [VOTO] Payload preparado:", payload);

    if (!CONFIG.steinApiUrl) {
      console.warn("⚠️ [VOTO] No hay CONFIG.steinApiUrl configurada. Usando simulación local.");
      const localVotes = getLocalData("wedding_votes");
      localVotes.push(payload);
      saveLocalData("wedding_votes", localVotes);
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("✅ [VOTO] Simulación exitosa, guardado en localStorage.");
      return { success: true, simulated: true };
    }

    try {
      const url = `${CONFIG.steinApiUrl.replace(/\/$/, "")}/${CONFIG.steinVotesSheet}`;
      console.log(`🌐 [VOTO] Realizando POST a URL: ${url}`);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": AUTH_HEADER
        },
        body: JSON.stringify([payload]),
      });

      console.log(`📡 [VOTO] Código de respuesta HTTP: ${response.status} (${response.statusText})`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [VOTO] Error en respuesta de Stein HQ:", errorText);
        throw new Error(`Error ${response.status} al enviar voto: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ [VOTO] Voto guardado con éxito en Google Sheets:", result);
      return { success: true, result };
    } catch (error) {
      console.error("❌ [VOTO] Error capturado al enviar voto a Stein HQ:", error);
      throw error;
    }
  },

  /**
   * Obtiene los resultados agregados de los votos (conteo de Niño y Niña) de Google Sheets.
   */
  async getVoteStats() {
    console.log("📊 [STATS] Solicitando registros para calcular estadísticas...");

    if (!CONFIG.steinApiUrl) {
      console.warn("⚠️ [STATS] No hay CONFIG.steinApiUrl configurada. Usando simulación local.");
      const rsvps = getLocalData("wedding_rsvp");
      const votes = getLocalData("wedding_votes");
      const localVotes = [...rsvps, ...votes];
      
      const totalBoy = localVotes.filter(v => v.voto === "Niño").length + 15;
      const totalGirl = localVotes.filter(v => v.voto === "Niña").length + 18;
      const total = totalBoy + totalGirl;
      
      const stats = {
        boyVotes: totalBoy,
        girlVotes: totalGirl,
        totalVotes: total,
        boyPercentage: total > 0 ? Math.round((totalBoy / total) * 100) : 50,
        girlPercentage: total > 0 ? Math.round((totalGirl / total) * 100) : 50
      };
      console.log("📈 [STATS] Estadísticas locales simuladas calculadas:", stats);
      return stats;
    }

    try {
      const url = `${CONFIG.steinApiUrl.replace(/\/$/, "")}/${CONFIG.steinVotesSheet}`;
      console.log(`🌐 [STATS] Realizando GET a URL: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          "Authorization": AUTH_HEADER
        }
      });
      
      console.log(`📡 [STATS] Código de respuesta HTTP: ${response.status} (${response.statusText})`);

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const rows = await response.json();
      console.log(`📦 [STATS] Se obtuvieron ${Array.isArray(rows) ? rows.length : 0} filas totales de la API:`, rows);
      
      if (!Array.isArray(rows)) {
        throw new Error("La respuesta de Stein HQ no es un arreglo válido de filas.");
      }

      // Filtrar filas por columna 'voto'
      const totalBoy = rows.filter(r => r.voto === "Niño" || r.voto === "boy" || r.voto === "Boy").length;
      const totalGirl = rows.filter(r => r.voto === "Niña" || r.voto === "girl" || r.voto === "Girl").length;
      const total = totalBoy + totalGirl;

      console.log(`📊 [STATS] Conteo de votos de género -> Niño: ${totalBoy}, Niña: ${totalGirl}, Total: ${total}`);

      if (total === 0) {
        console.warn("⚠️ [STATS] No hay votos registrados en la hoja de cálculo todavía.");
        return {
          boyVotes: 0,
          girlVotes: 0,
          totalVotes: 0,
          boyPercentage: 50,
          girlPercentage: 50
        };
      }

      const stats = {
        boyVotes: totalBoy,
        girlVotes: totalGirl,
        totalVotes: total,
        boyPercentage: Math.round((totalBoy / total) * 100),
        girlPercentage: Math.round((totalGirl / total) * 100)
      };
      console.log("📈 [STATS] Estadísticas calculadas:", stats);
      return stats;
    } catch (error) {
      console.warn("❌ [STATS] Error al leer estadísticas desde Stein HQ (retornando valores por defecto):", error);
      return {
        boyVotes: 18,
        girlVotes: 22,
        totalVotes: 40,
        boyPercentage: 45,
        girlPercentage: 55
      };
    }
  }
};
