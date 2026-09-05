# 🚀 Viral Studios AI - Generador y Automatizador de Videos Virales

Plataforma construida con **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Remotion** y **Supabase**, diseñada para crear videos verticales 9:16 de alto impacto para TikTok, Instagram Reels y YouTube Shorts.

Especializada en los formatos Pixar 3D de **Sano & Punto** (*Super Alimentos para tu Órgano*, *Alimentos que Retan*, *Qué Sucede en tu Cuerpo al Comer*) con modelos oficiales de Google AI (**`gemini-3-pro-image`** para imágenes 3D y **`gemini-omni-flash-preview`** para video) y trazabilidad completa auditada en Supabase.

---

## 🌟 Características Principales

1. **Frameworks de Sano & Punto (Pixar 3D & Biología)**:
   * **Super Alimentos para tu Órgano**: Generación de 1 imagen maestra única (Nano Banana Pro / `gemini-3-pro-image`) propagada en cascada a todas las escenas. Animación de curación, masticación y aura luminosa con efectos ASMR.
   * **Alimentos que Retan tu Órgano**: Órgano saludable que recibe alimentos dañinos/chatarra y reacciona cómicamente con fatiga, sudor y depósitos de grasa.
   * **Qué Sucede al Comer...**: Viaje biológico cinemático paso a paso (Escena 0 Hook con zoom-in por la boca y esófago, estómago, hígado y torrente sanguíneo).

2. **Pipeline de Trazabilidad & Auditoría Real**:
   * Panel visual en vivo (**Logs & Trazabilidad**) integrado en el menú lateral.
   * Registro en tiempo real de llamadas API, modelo utilizado, payload JSON y latencia en milisegundos persistido en la tabla `viral_generation_logs` de Supabase.

3. **Arquitectura Sin Mock Data**:
   * Endpoints de servidor en `/api/generate/image`, `/api/generate/video`, `/api/generate/script` y `/api/projects`.
   * Cero imágenes falsas de stock. Estados transparentes si falta la API Key (`isRealKeyConfigured: false`).

4. **Estudio de Edición Remotion (9:16)**:
   * Reproductor nativo `@remotion/player` a 30 FPS en resolución 1080x1920.
   * Subtítulos dinámicos estilo Alex Hormozi, Cyber Neon y Cyberpunk.
   * Pistas BGM libres de copyright y mezcla de volumen.

---

## 🛠️ Modelos Oficiales de Google AI Utilizados

* **Imágenes 3D**: `gemini-3-pro-image` (Nano Banana Pro)
* **Video 9:16**: `gemini-omni-flash-preview` (Google Omni Flash)
* **Guiones & Razonamiento**: `gemini-2.5-flash`

---

## 🗄️ Base de Datos en Supabase

Las 4 tablas principales creadas y migradas:
* `viral_frameworks` (Catálogo declarativo y reglas de IA)
* `viral_projects` (Proyectos de video)
* `viral_scenes` (Escenas del Storyboard)
* `viral_generation_logs` (Auditoría de APIs en tiempo real)

---

## 🚀 Inicio Rápido

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Copia `.env.example` a `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://skilgzmiryzcvumanlvb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_key
   NANO_BANANA_PRO_API_KEY=tu_api_key
   GOOGLE_VERTEX_API_KEY=tu_api_key
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000).

4. **Compilar para producción**:
   ```bash
   npm run build
   npm start
   ```
