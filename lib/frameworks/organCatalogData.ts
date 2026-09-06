export interface OrganFrameworkPreset {
  id: 'super-alimentos' | 'alimentos-que-retan' | 'que-sucede-al-comer';
  name: string;
  tagline: string;
  description: string;
  badge: string;
  defaultSceneDuration: 8;
  requiresSpokenScript: boolean;
  promptModifiers: string;
  asmrStyle: string;
  defaultScenesCount: number;
}

export const ORGAN_FRAMEWORK_PRESETS: Record<string, OrganFrameworkPreset> = {
  'super-alimentos': {
    id: 'super-alimentos',
    name: 'Super Alimentos para tu Órgano',
    tagline: 'Alimentos funcionales y regeneración celular 3D',
    description: 'El órgano empieza cansado y, al ser alimentado con superalimentos, se cura, ilumina y sonríe con energía radiante.',
    badge: '🌟 Super Alimentos (Pixar 3D)',
    defaultSceneDuration: 8,
    requiresSpokenScript: false,
    promptModifiers: 'Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. Pixar-style cute organ glowing with healthy aura and sparkles. No text, no letters, no words. --ar 9:16',
    asmrStyle: '¡Crunch-crunch! 🍎 | ¡Gulp! 💦 | ¡Shiing! ✨',
    defaultScenesCount: 4,
  },
  'alimentos-que-retan': {
    id: 'alimentos-que-retan',
    name: 'Alimentos que retan tu Órgano',
    tagline: 'Comidas ultraprocesadas, estrés y fatiga hepática/cardíaca',
    description: 'El órgano inicia saludable y, al recibir alimentos perjudiciales, reacciona con fatiga cómica, hinchazón y depósitos de grasa.',
    badge: '⚠️ Alimentos Dañinos (Pixar 3D)',
    defaultSceneDuration: 8,
    requiresSpokenScript: false,
    promptModifiers: 'Unreal Engine 5 render, Disney animation style, 3D character, 8k, realistic textures. Pixar-style organ character sweating, bloated and exhausted, with small fat deposits. No gore, soft pastel biological cavity. No text. --ar 9:16',
    asmrStyle: '¡Squish-chomp! 🍩 | ¡Pop-pop-pop! 🫧 | ¡Phew... ugrh! 🥺',
    defaultScenesCount: 3,
  },
  'que-sucede-al-comer': {
    id: 'que-sucede-al-comer',
    name: 'Qué sucede en tu cuerpo al comer...',
    tagline: 'Viaje biológico cinemático paso a paso',
    description: 'Escena 0 con zoom-in por la boca y esófago, seguido del recorrido por estómago, hígado y torrente sanguíneo con efectos ASMR inmersivos.',
    badge: '🔬 Viaje Biológico Cinemático',
    defaultSceneDuration: 8,
    requiresSpokenScript: true,
    promptModifiers: 'Cinematic 3D render, Pixar style, Disney style, 8k resolution, highly detailed organic textures, subsurface scattering, cinematic volumetric lighting, depth of field, anamorphic lens. No text, no words. --ar 9:16',
    asmrStyle: '¡Swooosh-fizzzz! 🥤 | ¡Splaaash-viscous! 🛢️ | ¡Thump-thump! 🫀',
    defaultScenesCount: 4,
  },
};

// Catálogo de datos para Super Alimentos (Beneficiosos)
export const SUPER_ALIMENTOS_CATALOG = [
  {
    organ: 'Glándula Tiroides (Forma mariposa)',
    item: 'Nueces de Brasil',
    actionConsume: 'Consume 2 nueces al día.',
    reaction: 'Aportan selenio puro que activa las hormonas T3 y T4, devolviendo energía inmediata a la tiroides.',
    asmr: '¡Crunch-crunch! 🌰 | ¡Shiing! ✨',
    visualPrompt: 'Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. A cute and friendly Pixar-style thyroid gland character with butterfly shape and big expressive eyes, smiling happily as a human hand feeds it Brazil nuts, glowing with golden energy. Situated realistically inside the soft throat cavity environment with pink and salmon-colored biological tissues. Volumetric warm cozy lighting, microscopic depth of field, soft bokeh background. No text, no letters, no words, no watermarks, no UI overlays. --ar 9:16 --v 6.0',
  },
  {
    organ: 'Cerebro',
    item: 'Arándanos Silvestres',
    actionConsume: '1 taza al día en el desayuno.',
    reaction: 'Las antocianinas cruzan la barrera hematoencefálica, encendiendo sinapsis neuronales luminosas.',
    asmr: '¡Pop-juicy! 🫐 | ¡Zzzzt-sparkle! ⚡',
    visualPrompt: 'Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. A cute and friendly Pixar-style human brain character with big expressive eyes and soft convolutions, tasting fresh wild blueberries as synapses light up with radiant blue energy. Situated realistically inside the soft cranial cavity environment with pastel violet and pink biological tissues. Volumetric warm cozy lighting, microscopic depth of field, soft bokeh background. No text, no letters, no words, no watermarks, no UI overlays. --ar 9:16 --v 6.0',
  },
  {
    organ: 'Hígado',
    item: 'Alcachofa & Cardo Mariano',
    actionConsume: 'Consumir al vapor o en infusión.',
    reaction: 'Estimula la producción de bilis y regenera hepatocitos, limpiando toxinas acumuladas.',
    asmr: '¡Gulp-fresh! 🌿 | ¡Glow-pure! ✨',
    visualPrompt: 'Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. A cute and friendly Pixar-style liver character with big expressive eyes and soft rounded lobes, happily receiving herbal tea drops and glowing with a pure emerald health aura. Situated realistically inside the soft abdominal cavity environment with warm coral and pink biological tissues. Volumetric warm cozy lighting, microscopic depth of field, soft bokeh background. No text, no letters, no words, no watermarks, no UI overlays. --ar 9:16 --v 6.0',
  },
  {
    organ: 'Corazón & Arterias',
    item: 'Granada Roja Madura',
    actionConsume: 'Medio vaso de jugo natural sin azúcar.',
    reaction: 'Aumenta el óxido nítrico, dilatando las arterias y optimizando la presión sanguínea con bombeo vigoroso.',
    asmr: '¡Splash-ruby! 🍷 | ¡Thump-rhythmic! 🫀',
    visualPrompt: 'Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. A cute and friendly Pixar-style heart character with big expressive eyes, happily drinking fresh ruby pomegranate juice as its coronary vessels glow with healthy crimson light. Situated realistically inside the soft thoracic cavity environment with pink and rosy biological tissues. Volumetric warm cozy lighting, microscopic depth of field, soft bokeh background. No text, no letters, no words, no watermarks, no UI overlays. --ar 9:16 --v 6.0',
  },
  {
    organ: 'Intestino & Microbiota',
    item: 'Kéfir de Coco / Yogur Probiótico',
    actionConsume: '1 porción en ayunas o merienda.',
    reaction: 'Billones de bacterias amigables repueblan las paredes intestinales reduciendo la inflamación.',
    asmr: '¡Smooth-gulp! 🥛 | ¡Pop-shield! 🛡️',
    visualPrompt: 'Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. A cute and friendly Pixar-style human intestine character with folded tubular structure and big expressive eyes, smiling and hugged by tiny glowing probiotic friends. Situated realistically inside the soft abdominal cavity environment with pink and salmon-colored biological tissues. Volumetric warm cozy lighting, microscopic depth of field, soft bokeh background. No text, no letters, no words, no watermarks, no UI overlays. --ar 9:16 --v 6.0',
  },
  {
    organ: 'Riñones',
    item: 'Sandía con Semillas y Limón',
    actionConsume: '1 rodaja fresca hidratante.',
    reaction: 'Filtración profunda de ácido úrico y máxima hidratación celular con efecto diurético suave.',
    asmr: '¡Crisp-crunch! 🍉 | ¡Flush-water! 💧',
    visualPrompt: 'Unreal Engine 5 render, Disney animation style, 3D character, 8k, highly detailed, realistic textures, subsurface scattering. Cute and friendly twin Pixar-style kidney characters with big expressive eyes, drinking pure crystal-clear watermelon water and glowing cleanly. Situated realistically inside the soft posterior abdominal cavity environment with pastel pink biological tissues. Volumetric warm cozy lighting, microscopic depth of field, soft bokeh background. No text, no letters, no words, no watermarks, no UI overlays. --ar 9:16 --v 6.0',
  },
];

// Catálogo de datos para Alimentos que Retan (Dañinos)
export const ALIMENTOS_QUE_RETAN_CATALOG = [
  {
    organ: 'Hígado',
    item: 'Donas con Azúcar Refinada & Jarabe de Maíz',
    damageReason: 'El exceso de fructosa industrial se convierte en triglicéridos, provocando esteatosis (hígado graso).',
    reaction: 'Higadito suda, se siente empalagado y brotan bolitas amarillas de grasa en su tejido.',
    asmr: '¡Squish-chomp! 🍩 | ¡Pop-fat! 🫧 | ¡Ugh... groan! 🥺',
    visualPrompt: 'Unreal Engine 5 render, Disney animation style, 8k. Hand enters slowly holding a sugary glaze donut towards a cute Pixar-style liver character. The liver reluctantly eats it and looks nauseous and bloated, small yellow fat deposits appear on its surface. No text. --ar 9:16',
  },
  {
    organ: 'Arterias & Corazón',
    item: 'Papas Fritas en Aceite Reutilizado (Grasas Trans)',
    damageReason: 'Oxidan el colesterol LDL y forman placas duras que elevan la presión arterial al instante.',
    reaction: 'Las paredes de la arteria vibran en luz roja de alarma y los glóbulos rojos avanzan con esfuerzo.',
    asmr: '¡Crunch-heavy! 🍟 | ¡Sloosh-slow! 🩸 | ¡Thump-alarm! 🚨',
    visualPrompt: 'Cinematic 3D render, Pixar style, Disney style, 8k. Inside a narrow blood vessel, red blood cells struggle to flow as sticky yellow grease clumps attach to the walls. Red alarm pulse. Volumetric lighting. No text. --ar 9:16',
  },
  {
    organ: 'Estómago & Mucosa',
    item: 'Gaseosas Oscuras con Ácido Fosfórico',
    damageReason: 'Desbalancean el pH estomacal, dañan el moco protector y aceleran el reflujo ácido.',
    reaction: 'El estómago siente burbujeo corrosivo y humo de ebullición ácida.',
    asmr: '¡Fizzzz-acid! 🥤 | ¡Sizzle-burn! 💨',
    visualPrompt: 'Unreal Engine 5 render, Disney animation style, 8k. A cute Pixar-style stomach character looking startled as a wave of bubbling dark carbonated liquid hits its pink walls, emitting green steam. No text. --ar 9:16',
  },
  {
    organ: 'Páncreas',
    item: 'Bebidas Energizantes Ultra Azucaradas',
    damageReason: 'Genera un pico insulínico violento que agota las células beta pancreáticas.',
    reaction: 'El páncreas intenta disparar insulina a máxima velocidad hasta quedar mareado.',
    asmr: '¡Zap-overload! ⚡ | ¡Puff-exhausted! 😮‍💨',
    visualPrompt: 'Unreal Engine 5 render, Disney animation style, 8k. A cute Pixar-style pancreas character with spinning dizzy eyes and sweat drops, overwhelmed by floating sugar crystals. No text. --ar 9:16',
  },
];

// Catálogo de datos para Qué Sucede al Comer (Viaje Interno Cinemático)
export const QUE_SUCEDE_AL_COMER_CATALOG = [
  {
    foodTopic: 'Gaseosa Oscura',
    scenes: [
      {
        step: 'Escena 0 (Hook Entrada)',
        location: 'Boca y Garganta',
        timeframe: 'Minuto 0',
        scriptText: '¿Sabes realmente qué ocurre dentro de ti cuando tomas un solo vaso de gaseosa oscura?',
        concept: 'Vista macro de la boca abierta con chorro burbujeante y zoom-in veloz hacia la garganta y esófago.',
        asmr: '¡Swooosh-fizzzz! 🥤 | ¡Sizzle-burbujas! 🫧',
        visualPrompt: 'Cinematic 3D render, Pixar style, Disney style, 8k resolution, subsurface scattering. A stream of dark bubbly soda liquid droplets entering an open human mouth. Fast zoom-in through the throat with dark carbonated liquid splashing on wet pink walls. Cinematic volumetric lighting. No text. --ar 9:16',
      },
      {
        step: 'Escena 1 (Estómago)',
        location: 'Cavidad Estomacal',
        timeframe: 'Minuto 10',
        scriptText: 'A los 10 minutos, tu estómago recibe el equivalente a 10 cucharadas de azúcar de un solo golpe.',
        concept: 'Marea dulce y ácida que inunda el lago gástrico provocando ebullición de vapor y acidez.',
        asmr: '¡Splaaash-heavy! 🌊 | ¡Fizzzz-acid! 💨',
        visualPrompt: 'Cinematic 3D render, Pixar style, Disney style, 8k. Inside the glowing pink stomach cavity, a deluge of dark sugary liquid crashes into stomach acid, producing sparkling foam and mist. Cinematic depth of field. No text. --ar 9:16',
      },
      {
        step: 'Escena 2 (Hígado)',
        location: 'Hígado & Metabolismo',
        timeframe: 'Minuto 20',
        scriptText: 'A los 20 minutos, tu hígado entra en pánico y convierte toda esa fructosa en depósitos de grasa.',
        concept: 'Higadito queda cubierto de lodo amarillo y empieza a inflarse con pequeñas gotas de grasa.',
        asmr: '¡Splat-mud! 🍔 | ¡Pop-pop! 🫧 | ¡Phew... ugrh! 🥺',
        visualPrompt: 'Unreal Engine 5 render, Disney animation style, 8k. A cute Pixar-style liver character sweating and struggling to process a dark sugary flood, forming small yellow fat spheres around its surface. No text. --ar 9:16',
      },
      {
        step: 'Escena 3 (Cerebro & Dopamina)',
        location: 'Cerebro & Sinapsis',
        timeframe: 'Minuto 40',
        scriptText: 'A los 40 minutos, tus pupilas se dilatan y el cerebro experimenta un disparo masivo de dopamina falso.',
        concept: 'Chispazo artificial de dopamina brillante seguido de un apagón repentino de energía.',
        asmr: '¡Zzzzap-glow! ✨ | ¡Drop-crash! 📉',
        visualPrompt: 'Cinematic 3D render, Pixar style, Disney style, 8k. Brain neurons exploding with bright neon sparks of dopamine before dimming into low-energy shadow. Cinematic lighting. No text. --ar 9:16',
      },
    ],
  },
  {
    foodTopic: 'Papas Fritas con Grasa Trans',
    scenes: [
      {
        step: 'Escena 0 (Hook Entrada)',
        location: 'Boca y Esófago',
        timeframe: 'Segundo 0',
        scriptText: 'Esto es exactamente lo que ocurre en tu interior cuando comes una sola porción de papas fritas.',
        concept: 'Papa frita dorada con ojitos entra a la boca y la cámara se sumerge en el esófago.',
        asmr: '¡CRUNCH! 🍟 | ¡Whoosh-echo! 💨',
        visualPrompt: 'Cinematic 3D render, Pixar style, Disney style, 8k resolution, realistic organic textures. A single golden crispy french fry character floating towards an open human mouth, zooming into dark esophagus with salt crystals. Cinematic volumetric lighting. No text. --ar 9:16',
      },
      {
        step: 'Escena 1 (Estómago)',
        location: 'Estómago',
        timeframe: 'Minuto 5',
        scriptText: 'Segundos después, tu estómago se inunda de aceites densos, ralentizando tu digestión por horas.',
        concept: 'Cascada espesa de aceite dorado cubriendo las paredes estomacales.',
        asmr: '¡Splaaash-viscous! 🛢️ | ¡Fizz-hiss! 💨',
        visualPrompt: 'Cinematic 3D render, Pixar style, Disney style, 8k. An avalanche of thick golden trans-fat oil pouring down into stomach cavity, creating heavy warm vapor. No text. --ar 9:16',
      },
      {
        step: 'Escena 2 (Hígado)',
        location: 'Hígado',
        timeframe: 'Minuto 20',
        scriptText: 'Tu hígado colapsa intentando filtrar los aceites oxidados, reteniéndolos como grasa visceral.',
        concept: 'El hígado recibe la ola grasosa y muestra ojeras de agotamiento.',
        asmr: '¡Splat-mud! 🍔 | ¡Ugh! 🥺',
        visualPrompt: 'Cinematic 3D render, Pixar animation style, 8k. A cute Pixar-style liver character splashed by yellow greasy mud, turning dull and tired with fat deposits. No text. --ar 9:16',
      },
      {
        step: 'Escena 3 (Arterias)',
        location: 'Vasos Sanguíneos',
        timeframe: 'Minuto 45',
        scriptText: 'Tus vasos sanguíneos se estrechan por el sodio, obligando a tu corazón a bombear el doble.',
        concept: 'Corriente de glóbulos rojos sorteando placas de grasa con alarma roja.',
        asmr: '¡Sloosh! 🩸 | ¡Thump-thump-thump! 🫀',
        visualPrompt: 'Cinematic 3D render, Pixar style, 8k. Inside human blood vessel, red blood cells struggle as sticky yellow cholesterol plaques attach to walls. Red warning glow. No text. --ar 9:16',
      },
    ],
  },
];
