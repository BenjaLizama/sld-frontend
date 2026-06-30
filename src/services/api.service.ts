declare const __VITE_BACKEND_URL__: string | undefined;

const BACKEND_IP =
  typeof __VITE_BACKEND_URL__ === "string" ? __VITE_BACKEND_URL__ : "";
export const BFF_API = BACKEND_IP ? `http://${BACKEND_IP}:8082` : "";

export const API = {
  auth: `${BFF_API}/api/v1/registro`,
  login: `${BFF_API}/api/v1/login`,
  user: `${BFF_API}/api/v1/user`,
  grades: `${BFF_API}/api/v1/bff/grades`,
};

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const rawBody = await response.text();
    let errorData: any = {};
    let isJson = false;

    // 2. Intentamos parsearlo como JSON
    try {
      if (rawBody && rawBody.trim() !== "") {
        errorData = JSON.parse(rawBody);
        isJson = true;
      }
    } catch (e) {
      // Si falla el parseo, guardamos el texto (puede ser HTML de error de Docker/Nginx)
      errorData.rawText = rawBody;
    }

    // 3. Determinamos cuál será el mensaje final del error
    let finalMessage = "Error desconocido";

    if (isJson && (errorData.message || errorData.mensaje || errorData.error)) {
      const bffMessage = errorData.message || errorData.mensaje || errorData.error;
      
      if (typeof bffMessage === 'string' && bffMessage.toLowerCase().includes("no disponible")) {
        finalMessage = "Estamos teniendo problemas técnicos momentáneos, por favor reintenta en unos segundos";
      } else {
        finalMessage = bffMessage;
      }
    } else if (errorData.rawText && errorData.rawText.trim() !== "") {
      finalMessage = `Respuesta cruda del servidor: ${errorData.rawText}`;
    } else if (response.statusText) {
      // Si el cuerpo vino vacío (Postman style), usamos el texto del estado HTTP (ej: "Bad Request")
      finalMessage = `Error de servidor sin cuerpo: ${response.status} - ${response.statusText}`;
    } else {
      finalMessage = `Error de servidor código: ${response.status} (Cuerpo vacío)`;
    }

    // 4. Creamos el objeto de error manteniendo tus propiedades originales
    const customError = new Error(finalMessage) as any;
    customError.status = response.status;
    customError.code =
      errorData.code || response.statusText || `HTTP_${response.status}`;
    customError.error =
      errorData.error || (isJson ? "JSON Error" : "Raw/Empty Error");

    // 5. MODO INSPECTOR (Esto te dirá exactamente qué pasa en tu consola)
    console.log("\n--- 🚨 DETALLE DE ERROR DE API ---");
    console.log(`🔗 URL: ${response.url}`);
    console.log(
      `🔢 Status: ${response.status} (${response.statusText || "Sin texto de estado"})`,
    );
    console.log(`📝 Mensaje Procesado: ${finalMessage}`);
    console.log(
      `📦 Cuerpo Crudo Recibido: ${rawBody ? `"${rawBody}"` : "[VACÍO (Content-Length: 0)]"}`,
    );
    if (isJson) {
      console.log(`🧩 JSON Parseado:`, errorData);
    }
    console.log("-----------------------------------\n");

    throw customError;
  }

  // Si todo salió bien (response.ok es true)
  const rawBody = await response.text();

  if (!rawBody.trim()) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
};
