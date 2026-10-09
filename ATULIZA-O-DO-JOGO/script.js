/**
 * ==============================================================================
 * BATALHA POKÉMON — MOTOR PRINCIPAL EXPANDIDO (JAVASCRIPT)
 * Inclui:
 * 1. Arenas com Efeitos Específicos
 * 2. Efeitos de Status / Condições (Queimado, Paralisado, Veneno, Congelado, etc.)
 * 3. Sistema de Combos Progressivos
 * 4. Esquiva / Defesa com Reação Rápida (QTE)
 * 5. Barra de Energia (EP) para Ataques Especiais
 * 6. Eventos Dinâmicos de Batalha com Alteração de Regras
 * 7. Modo Aventura Roguelite (Mapa, Lojas, Encontros, Chefes)
 * 8. Chefes com Fases, Transformações e Mudanças de Arena
 * ==============================================================================
 */

// ==========================================
// 1. BANCO DE DADOS DOS POKÉMON DISPONÍVEIS
// ==========================================
const POKEMON_DATA = [
  {
    id: 1,
    name: "Pikachu",
    type: "Elétrico",
    typeClass: "type-eletrico",
    badgeIcon: "⚡",
    description: "Um Pokémon pequeno e ágil que utiliza eletricidade para atacar seus adversários.",
    characteristic: "Ataques rápidos e agilidade.",
    battleStyle: "Ofensivo Veloz",
    mainAdvantage: "Golpes rápidos e alta chance de esquiva",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    passiveId: "speed",
    baseMaxHp: 100,
    stats: { atk: 85, def: 55, spd: 95, hp: 100 }
  },
  {
    id: 2,
    name: "Charizard",
    type: "Fogo / Voador",
    typeClass: "type-fogo",
    badgeIcon: "🔥",
    description: "Um poderoso Pokémon que possui chamas na ponta da cauda e pode voar.",
    characteristic: "Ataques fortes e dano contínuo.",
    battleStyle: "Poder de Fogo",
    mainAdvantage: "Dano contínuo e poder devastador",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    passiveId: "power",
    baseMaxHp: 105,
    stats: { atk: 92, def: 75, spd: 84, hp: 105 }
  },
  {
    id: 3,
    name: "Mewtwo",
    type: "Psíquico",
    typeClass: "type-psiquico",
    badgeIcon: "🔮",
    description: "Um Pokémon criado artificialmente, conhecido por seus grandes poderes psíquicos.",
    characteristic: "Ataque especial devastador.",
    battleStyle: "Mestre Psíquico",
    mainAdvantage: "Ataques especiais com dano massivo",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    passiveId: "special",
    baseMaxHp: 110,
    stats: { atk: 96, def: 80, spd: 90, hp: 110 }
  },
  {
    id: 4,
    name: "Blastoise",
    type: "Água",
    typeClass: "type-agua",
    badgeIcon: "💧",
    description: "Um Pokémon resistente que utiliza os canhões de água em seu casco durante as batalhas.",
    characteristic: "Defesa e casco impenetrável.",
    battleStyle: "Defensivo Tanque",
    mainAdvantage: "Alta defesa e casco impenetrável",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
    passiveId: "defense",
    baseMaxHp: 115,
    stats: { atk: 78, def: 95, spd: 65, hp: 115 }
  },
  {
    id: 5,
    name: "Venusaur",
    type: "Planta / Veneno",
    typeClass: "type-planta",
    badgeIcon: "🌿",
    description: "Um Pokémon que possui uma grande flor nas costas e utiliza poderes da natureza.",
    characteristic: "Recupera HP com fotossíntese.",
    battleStyle: "Suporte e Cura",
    mainAdvantage: "Auto-regeneração de vida constante",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
    passiveId: "heal",
    baseMaxHp: 110,
    stats: { atk: 82, def: 86, spd: 70, hp: 110 }
  },
  {
    id: 6,
    name: "Gengar",
    type: "Fantasma / Veneno",
    typeClass: "type-fantasma",
    badgeIcon: "👻",
    description: "Um Pokémon misterioso que costuma aparecer escondido nas sombras.",
    characteristic: "Alta chance de ataque crítico.",
    battleStyle: "Assassino das Sombras",
    mainAdvantage: "Críticos elevados e furtividade",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
    passiveId: "crit",
    baseMaxHp: 95,
    stats: { atk: 90, def: 60, spd: 92, hp: 95 }
  },
  {
    id: 7,
    name: "Lucario",
    type: "Lutador / Aço",
    typeClass: "type-lutador",
    badgeIcon: "🥊",
    description: "Um Pokémon habilidoso capaz de perceber e utilizar a energia do combate.",
    characteristic: "Dano equilibrado e golpes firmes.",
    battleStyle: "Lutador Equilibrado",
    mainAdvantage: "Dano equilibrado e golpes consistentes",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png",
    passiveId: "balanced",
    baseMaxHp: 100,
    stats: { atk: 88, def: 78, spd: 86, hp: 100 }
  },
  {
    id: 8,
    name: "Greninja",
    type: "Água / Sombrio",
    typeClass: "type-agua",
    badgeIcon: "💧",
    description: "Um Pokémon rápido e habilidoso que utiliza movimentos ninja para surpreender.",
    characteristic: "Ataque Rápido fortalecido.",
    battleStyle: "Ninja Tático",
    mainAdvantage: "Ataques rápidos amplificados",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png",
    passiveId: "fast",
    baseMaxHp: 100,
    stats: { atk: 88, def: 67, spd: 98, hp: 100 }
  }
];

// ==========================================
// 2. SISTEMA MODULAR DE ARENAS COM EFEITOS
// ==========================================
const ARENAS_DATA = {
  forest: {
    id: "forest",
    name: "Floresta Encantada",
    icon: "🌿",
    cssTheme: "theme-forest",
    description: "Uma floresta densa e repleta de energia natural.",
    effectText: "Regenera +5 HP para ambos no início de cada turno. Ataques do tipo Planta causam +25% de dano.",
    bgGlow1: "#10b981",
    bgGlow2: "#059669",
    onTurnStart(state) {
      const healP = 5;
      const healE = 5;
      CombatSystem.heal("player", healP, "🌿 Floresta");
      CombatSystem.heal("enemy", healE, "🌿 Floresta");
    },
    modifyDamage(attacker, defender, damage) {
      if (attacker.type && attacker.type.includes("Planta")) {
        return Math.round(damage * 1.25);
      }
      return damage;
    }
  },
  volcano: {
    id: "volcano",
    name: "Vulcão Calcinante",
    icon: "🌋",
    cssTheme: "theme-volcano",
    description: "Calor vulcânico infernal e rios de lava borbulhante.",
    effectText: "Golpes têm 30% de chance de aplicar Queimado 🔥. Tipos Fogo causam +25% de dano extra.",
    bgGlow1: "#ef4444",
    bgGlow2: "#f97316",
    onHit(attackerSide, defenderSide) {
      if (Math.random() < 0.30) {
        CombatSystem.applyStatus(defenderSide, "burn", 3);
      }
    },
    modifyDamage(attacker, defender, damage) {
      if (attacker.type && attacker.type.includes("Fogo")) {
        return Math.round(damage * 1.25);
      }
      return damage;
    }
  },
  ocean: {
    id: "ocean",
    name: "Oceano Profundo",
    icon: "🌊",
    cssTheme: "theme-ocean",
    description: "Correntes marinhas poderosas e atmosfera revigorante.",
    effectText: "Golpes bem-sucedidos geram +15 de Energia (EP) adicional. Golpes Elétricos causam +20% por choque condutivo.",
    bgGlow1: "#0284c7",
    bgGlow2: "#06b6d4",
    onHit(attackerSide) {
      CombatSystem.gainEnergy(attackerSide, 15);
    },
    modifyDamage(attacker, defender, damage) {
      if (attacker.type && attacker.type.includes("Elétrico")) {
        return Math.round(damage * 1.20);
      }
      return damage;
    }
  },
  powerplant: {
    id: "powerplant",
    name: "Usina Elétrica",
    icon: "⚡",
    cssTheme: "theme-powerplant",
    description: "Campos magnéticos e sobrecarga de corrente elétrica.",
    effectText: "Geração de Energia é dobrada (+100%). Golpes têm 25% de chance de aplicar Paralisia ⚡.",
    bgGlow1: "#f59e0b",
    bgGlow2: "#eab308",
    onHit(attackerSide, defenderSide) {
      if (Math.random() < 0.25) {
        CombatSystem.applyStatus(defenderSide, "paralysis", 2);
      }
    },
    modifyEnergyGain(amount) {
      return amount * 2;
    }
  },
  frozenpeak: {
    id: "frozenpeak",
    name: "Pico Nevado",
    icon: "❄️",
    cssTheme: "theme-frozenpeak",
    description: "Ventos polares gelados e tempestades de neve eterna.",
    effectText: "Golpes críticos aplicam Congelado ❄️ por 1 turno. Ataques normais têm 20% de chance de Atordoamento 😵.",
    bgGlow1: "#38bdf8",
    bgGlow2: "#818cf8",
    onHit(attackerSide, defenderSide, isCrit) {
      if (isCrit) {
        CombatSystem.applyStatus(defenderSide, "freeze", 1);
      } else if (Math.random() < 0.20) {
        CombatSystem.applyStatus(defenderSide, "stun", 1);
      }
    }
  },
  shadowrealm: {
    id: "shadowrealm",
    name: "Abismo Espectral",
    icon: "👻",
    cssTheme: "theme-shadowrealm",
    description: "Uma dimensão sombria onde a energia vital é drenada.",
    effectText: "Chance de crítico aumentada em +20%. Todos os golpes roubam 15% de vida (Lifesteal) do dano causado!",
    bgGlow1: "#6366f1",
    bgGlow2: "#a855f7",
    onDamageDealt(attackerSide, damage) {
      const drain = Math.max(1, Math.round(damage * 0.15));
      CombatSystem.heal(attackerSide, drain, "👻 Roubo Vital");
    },
    modifyCritChance(baseChance) {
      return baseChance + 0.20;
    }
  }
};

// ==========================================
// 3. SISTEMA DE ESTADOS DE STATUS / CONDIÇÕES
// ==========================================
const STATUS_CONFIG = {
  burn: {
    name: "Queimado",
    icon: "🔥",
    cssClass: "status-burn",
    auraClass: "aura-burn",
    description: "Sofre 6 de dano a cada turno e causa 15% a menos de dano.",
    onTurnEnd(side) {
      const dmg = 6;
      CombatSystem.takeStatusDamage(side, dmg, "🔥 Queimadura");
    },
    modifyDamageDealt(damage) {
      return Math.round(damage * 0.85);
    }
  },
  paralysis: {
    name: "Paralisado",
    icon: "⚡",
    cssClass: "status-paralysis",
    auraClass: "aura-paralysis",
    description: "40% de chance de ficar paralisado e perder a ação do turno.",
    checkCanAct(side) {
      if (Math.random() < 0.40) {
        addLogMessage(`⚡ ${side === "player" ? "Seu Pokémon" : "O adversário"} está paralisado e não conseguiu se mover!`, "log-special");
        SoundFX.statusTick();
        return false;
      }
      return true;
    }
  },
  poison: {
    name: "Envenenado",
    icon: "☠️",
    cssClass: "status-poison",
    auraClass: "aura-burn",
    description: "Sofre 8 de dano tóxico a cada turno.",
    onTurnEnd(side) {
      const dmg = 8;
      CombatSystem.takeStatusDamage(side, dmg, "☠️ Veneno");
    }
  },
  freeze: {
    name: "Congelado",
    icon: "❄️",
    cssClass: "status-freeze",
    auraClass: "aura-freeze",
    description: "Totalmente imóvel! Perde o turno enquanto estiver congelado.",
    checkCanAct(side) {
      addLogMessage(`❄️ ${side === "player" ? "Seu Pokémon" : "O adversário"} está congelado em gelo sólido e não pode atacar!`, "log-special");
      SoundFX.statusTick();
      return false;
    }
  },
  stun: {
    name: "Atordoado",
    icon: "😵",
    cssClass: "status-stun",
    auraClass: "aura-paralysis",
    description: "Ficou tonto com o impacto e perdeu a ação atual!",
    checkCanAct(side) {
      addLogMessage(`😵 ${side === "player" ? "Seu Pokémon" : "O adversário"} está zonzo e atordoado!`, "log-special");
      SoundFX.statusTick();
      return false;
    }
  },
  regen: {
    name: "Regeneração",
    icon: "🌿",
    cssClass: "status-regen",
    auraClass: "aura-shield",
    description: "Recupera +8 HP no início de cada turno.",
    onTurnStart(side) {
      CombatSystem.heal(side, 8, "🌿 Regeneração");
    }
  }
};

// ==========================================
// 4. CHEFES LENDÁRIOS COM FASES & TRANSFORMAÇÕES
// ==========================================
const BOSSES_DATA = [
  {
    id: "mewtwo_supreme",
    name: "Mewtwo Supremo",
    roleName: "CHEFE SUPREMO",
    type: "Psíquico Lendário",
    typeClass: "type-psiquico",
    badgeIcon: "🔮",
    maxHp: 220,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    characteristic: "Mestre mental em 3 fases épicas!",
    phases: [
      {
        phase: 1,
        title: "Fase 1: Mente Serena",
        arena: "shadowrealm",
        aura: "",
        dialogue: "Mewtwo analisa sua força com calma calculada...",
        attacks: [
          { name: "Psico-Corte", type: "quick", damage: [14, 20] },
          { name: "Onda Telecinética", type: "strong", damage: [22, 30] }
        ]
      },
      {
        phase: 2,
        triggerHpPercent: 65,
        title: "Fase 2: Despertar Psíquico",
        arena: "powerplant",
        aura: "aura-rage",
        dialogue: "⚠️ Mewtwo libera energia colossal! Uma barreira psíquica surge e a arena se transforma em uma Usina de Alta Tensão!",
        bonusShield: 25,
        attacks: [
          { name: "Sobrecarga Psíquica", type: "strong", damage: [26, 36], applyStatus: "paralysis" },
          { name: "Psico-Explosão", type: "special", damage: [34, 46], applyStatus: "stun" }
        ]
      },
      {
        phase: 3,
        triggerHpPercent: 30,
        title: "Fase 3: Fúria Cósmica Final",
        arena: "volcano",
        aura: "aura-burn",
        dialogue: "🔥 Mewtwo entra em FRENESI CÓSMICO! A arena se torna um Vulcão Apocalíptico e o poder atinge o limite!",
        attacks: [
          { name: "Cataclismo Estelar", type: "special", damage: [38, 52], applyStatus: "burn" },
          { name: "Hiper Raio Destruidor", type: "special", damage: [42, 58] }
        ]
      }
    ]
  },
  {
    id: "charizard_mega",
    name: "Mega Charizard X",
    roleName: "CHEFE DRACÔNICO",
    type: "Fogo / Dragão",
    typeClass: "type-fogo",
    badgeIcon: "🔥",
    maxHp: 200,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    characteristic: "Dragão ancestral de chamas azuis!",
    phases: [
      {
        phase: 1,
        title: "Fase 1: Asas Flamejantes",
        arena: "volcano",
        aura: "",
        dialogue: "Charizard ruge ferozmente, cuspindo fagulhas ardentes!",
        attacks: [
          { name: "Garra de Fogo", type: "quick", damage: [16, 22] },
          { name: "Lança-Chamas", type: "strong", damage: [24, 32] }
        ]
      },
      {
        phase: 2,
        triggerHpPercent: 60,
        title: "Fase 2: Fogo Negro",
        arena: "shadowrealm",
        aura: "aura-rage",
        dialogue: "⚠️ Charizard canaliza o fogo das sombras! A arena é envolta no Abismo Espectral!",
        bonusShield: 20,
        attacks: [
          { name: "Inferno de Sombras", type: "strong", damage: [28, 38], applyStatus: "burn" },
          { name: "Fúria Dracônica", type: "special", damage: [35, 48] }
        ]
      },
      {
        phase: 3,
        triggerHpPercent: 25,
        title: "Fase 3: Erupção Final",
        arena: "volcano",
        aura: "aura-burn",
        dialogue: "🔥 Charizard atinge temperatura máxima! Todo golpe é devastador!",
        attacks: [
          { name: "Apocalipse Flamejante", type: "special", damage: [40, 55], applyStatus: "burn" }
        ]
      }
    ]
  }
];

// ==========================================
// 5. EVENTOS DINÂMICOS DURANTE A BATALHA
// ==========================================
const BATTLE_EVENTS_CONFIG = [
  {
    id: "solar_storm",
    name: "Tempestade Solar ☀️",
    description: "Dano de todos os ataques aumentado em +35%! Mas o calor drena 4 HP no final do turno.",
    durationTurns: 3,
    onModifyDamage: (damage) => Math.round(damage * 1.35),
    onTurnEnd: () => {
      CombatSystem.takeStatusDamage("player", 4, "☀️ Calor Solar");
      CombatSystem.takeStatusDamage("enemy", 4, "☀️ Calor Solar");
    }
  },
  {
    id: "healing_rain",
    name: "Chuva Restauradora 🌧️",
    description: "Águas curativas caem sobre a arena! Todos os golpes curam 25% do dano causado.",
    durationTurns: 3,
    onDamageDealt: (side, damage) => {
      const heal = Math.max(2, Math.round(damage * 0.25));
      CombatSystem.heal(side, heal, "🌧️ Chuva Curativa");
    }
  },
  {
    id: "energy_surge",
    name: "Sobrecarga de Energia ⚡",
    description: "Campos magnéticos intensificados! Geração de EP é dobrada e Ataques Especiais custam 25 EP!",
    durationTurns: 3,
    modifyEnergyCost: (cost) => Math.round(cost / 2),
    modifyEnergyGain: (gain) => gain * 2
  },
  {
    id: "dense_fog",
    name: "Névoa Espessa 🌫️",
    description: "Visibilidade reduzida! A janela de esquiva é mais fácil, mas golpes normais têm 20% de chance de errar.",
    durationTurns: 2,
    modifyMissChance: 0.20
  },
  {
    id: "critical_resonance",
    name: "Ressonância Crítica 💥",
    description: "Energia cósmica concentrada! Todos os golpes têm +40% de chance de acerto crítico!",
    durationTurns: 2,
    modifyCritChance: 0.40
  }
];

// ==========================================
// 6. ITENS DE MOCHILA (MODO AVENTURA)
// ==========================================
const ITEMS_DATA = {
  potion: {
    id: "potion",
    name: "Poção de Cura",
    icon: "🧪",
    price: 35,
    description: "Restaura instantaneamente +45 HP do seu Pokémon.",
    use() {
      if (AdventureState.items.potion <= 0) return false;
      if (playerHP >= currentMaxHP) {
        addLogMessage("ℹ️ Seu HP já está no máximo!", "log-system");
        return false;
      }
      AdventureState.items.potion--;
      CombatSystem.heal("player", 45, "🧪 Poção de Cura");
      SoundFX.heal();
      updateItemsUI();
      return true;
    }
  },
  elixir: {
    id: "elixir",
    name: "Elixir de Energia",
    icon: "⚡",
    price: 30,
    description: "Concede imediatamente +50 de Energia (EP) para ataques especiais.",
    use() {
      if (AdventureState.items.elixir <= 0) return false;
      AdventureState.items.elixir--;
      CombatSystem.gainEnergy("player", 50);
      addLogMessage("⚡ Você usou um Elixir de Energia e recuperou +50 EP!", "log-special");
      SoundFX.special();
      updateItemsUI();
      return true;
    }
  },
  antidote: {
    id: "antidote",
    name: "Antídoto Universal",
    icon: "💊",
    price: 25,
    description: "Remove todos os estados negativos (Queimado, Paralisado, Veneno, etc.).",
    use() {
      if (AdventureState.items.antidote <= 0) return false;
      AdventureState.items.antidote--;
      playerStatuses = {};
      renderStatusEffects();
      addLogMessage("💊 Antídoto usado: Todos os efeitos negativos foram purificados!", "log-special");
      SoundFX.heal();
      updateItemsUI();
      return true;
    }
  }
};

// ==========================================
// 7. SISTEMA DE SONS & MÚSICA RETRÔ VIA WEB AUDIO API (Melhoria 3)
// ==========================================
const SoundFX = {
  ctx: null,
  enabled: true,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },
  toggle() {
    this.enabled = !this.enabled;
    updateAudioUI();
    return this.enabled;
  },
  playTone(freq, type, duration, delay = 0, volume = 0.14) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      setTimeout(() => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      }, delay * 1000);
    } catch (e) {
      // Ignora restrições do navegador
    }
  },
  buttonClick() {
    this.playTone(450, "sine", 0.05, 0, 0.08);
  },
  attack(type = "quick") {
    if (type === "quick") {
      this.playTone(380, "triangle", 0.08, 0, 0.12);
      this.playTone(540, "sine", 0.1, 0.04, 0.14);
    } else if (type === "strong") {
      this.playTone(220, "sawtooth", 0.16, 0, 0.18);
      this.playTone(140, "square", 0.22, 0.06, 0.16);
    } else if (type === "special") {
      this.playTone(330, "sine", 0.12, 0, 0.15);
      this.playTone(495, "sine", 0.12, 0.08, 0.15);
      this.playTone(660, "sawtooth", 0.28, 0.16, 0.2);
    }
  },
  hit() {
    this.playTone(160, "square", 0.15, 0, 0.16);
    this.playTone(95, "sawtooth", 0.2, 0.04, 0.18);
  },
  crit() {
    this.playTone(280, "sawtooth", 0.12, 0, 0.2);
    this.playTone(740, "square", 0.25, 0.04, 0.22);
    this.playTone(1100, "triangle", 0.35, 0.12, 0.18);
  },
  heal() {
    this.playTone(392, "triangle", 0.1, 0, 0.12);
    this.playTone(523.25, "triangle", 0.1, 0.08, 0.14);
    this.playTone(659.25, "sine", 0.15, 0.16, 0.16);
    this.playTone(783.99, "sine", 0.25, 0.24, 0.18);
  },
  defend() {
    this.playTone(320, "square", 0.08, 0, 0.14);
    this.playTone(240, "triangle", 0.18, 0.05, 0.16);
  },
  dodge() {
    this.playTone(680, "sine", 0.08, 0, 0.12);
    this.playTone(920, "sine", 0.14, 0.06, 0.14);
  },
  powerBoost() {
    this.playTone(260, "sawtooth", 0.1, 0, 0.14);
    this.playTone(440, "triangle", 0.12, 0.08, 0.16);
    this.playTone(880, "sawtooth", 0.25, 0.16, 0.18);
  },
  comboUp(comboCount = 2) {
    const baseFreq = 440 + (comboCount * 60);
    this.playTone(baseFreq, "triangle", 0.1, 0, 0.14);
    this.playTone(baseFreq * 1.25, "sine", 0.16, 0.08, 0.16);
  },
  phaseShift() {
    this.playTone(180, "sawtooth", 0.3, 0, 0.2);
    this.playTone(320, "sawtooth", 0.35, 0.15, 0.2);
    this.playTone(640, "square", 0.45, 0.3, 0.2);
  },
  statusTick() {
    this.playTone(280, "sawtooth", 0.07, 0, 0.1);
  },
  coin() {
    this.playTone(987, "square", 0.08, 0, 0.12);
    this.playTone(1318, "square", 0.18, 0.08, 0.14);
  },
  surpriseReveal() {
    this.playTone(220, "sawtooth", 0.18, 0, 0.16);
    this.playTone(440, "sawtooth", 0.22, 0.12, 0.18);
    this.playTone(880, "square", 0.38, 0.26, 0.2);
  },
  special() {
    this.playTone(330, "sine", 0.12, 0, 0.15);
    this.playTone(495, "sine", 0.12, 0.08, 0.15);
    this.playTone(660, "sawtooth", 0.28, 0.16, 0.2);
    this.playTone(880, "triangle", 0.35, 0.24, 0.18);
  },
  victory() {
    const notes = [523.25, 523.25, 523.25, 523.25, 659.25, 783.99, 1046.5];
    const delays = [0, 0.1, 0.2, 0.3, 0.42, 0.56, 0.72];
    notes.forEach((freq, idx) => {
      this.playTone(freq, "square", 0.22, delays[idx], 0.16);
    });
  },
  defeat() {
    this.playTone(440, "sawtooth", 0.22, 0, 0.18);
    this.playTone(370, "sawtooth", 0.25, 0.2, 0.18);
    this.playTone(293, "sawtooth", 0.3, 0.42, 0.18);
    this.playTone(220, "sawtooth", 0.5, 0.65, 0.2);
  }
};

// Gerador de Música de Batalha em Chiptune Procedural
const MusicEngine = {
  enabled: false,
  intervalId: null,
  step: 0,
  melody: [261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66],
  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.start();
    } else {
      this.stop();
    }
    updateAudioUI();
    return this.enabled;
  },
  start() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.step = 0;
    this.intervalId = setInterval(() => {
      if (!this.enabled || !SoundFX.enabled) return;
      try {
        SoundFX.init();
        if (!SoundFX.ctx) return;
        const freq = this.melody[this.step % this.melody.length];
        const osc = SoundFX.ctx.createOscillator();
        const gain = SoundFX.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, SoundFX.ctx.currentTime);
        gain.gain.setValueAtTime(0.025, SoundFX.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, SoundFX.ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(SoundFX.ctx.destination);
        osc.start();
        osc.stop(SoundFX.ctx.currentTime + 0.24);
        this.step++;
      } catch (e) {}
    }, 280);
  },
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
};

// ==========================================
// 8. SISTEMA DE CLIMA (Requisito 9)
// ==========================================
const WEATHER_DATA = {
  sun: {
    id: "sun",
    name: "☀️ Ensolarado",
    icon: "☀️",
    badgeClass: "weather-sun",
    desc: "Aumenta em +25% o dano de Fogo e potencializa ataques luminosos.",
    modifyDamage(attacker, defender, damage) {
      if (attacker.type && attacker.type.includes("Fogo")) return Math.round(damage * 1.25);
      return damage;
    }
  },
  rain: {
    id: "rain",
    name: "🌧️ Chuva",
    icon: "🌧️",
    badgeClass: "weather-rain",
    desc: "Aumenta em +25% o dano de Água e recupera +3 HP ao final do turno.",
    modifyDamage(attacker, defender, damage) {
      if (attacker.type && attacker.type.includes("Água")) return Math.round(damage * 1.25);
      return damage;
    }
  },
  storm: {
    id: "storm",
    name: "⚡ Tempestade",
    icon: "⚡",
    badgeClass: "weather-storm",
    desc: "Aumenta em +25% o dano Elétrico e concede +15% de chance de Ataque Crítico!",
    modifyDamage(attacker, defender, damage) {
      if (attacker.type && attacker.type.includes("Elétrico")) return Math.round(damage * 1.25);
      return damage;
    }
  },
  fog: {
    id: "fog",
    name: "🌫️ Neblina",
    icon: "🌫️",
    badgeClass: "weather-fog",
    desc: "Névoa espessa que aumenta a absorção do escudo e reduz a chance de sofrer golpes críticos.",
    modifyDamage(attacker, defender, damage) {
      return damage;
    }
  }
};

let currentWeather = WEATHER_DATA.sun;

// ==========================================
// 8.1 CAMPANHA DO MODO AVENTURA: 6 ÁREAS (Requisitos 18 a 30)
// ==========================================
const ADVENTURE_ARENAS = [
  {
    area: 1,
    name: "Floresta Inicial",
    icon: "🌳",
    arenaKey: "forest",
    checkpointName: "🚩 Floresta",
    bossName: "Bulbasaur Guardião",
    bossType: "Planta / Veneno",
    bossImg: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    narrative: "Você inicia sua jornada pela serena Floresta Inicial. O ar é puro e pequenos Pokémon selvagens testam seus reflexos!",
    floors: [
      { id: "a1_f1", type: "battle", name: "Trilha das Folhas", icon: "⚔️", desc: "Batalha inicial leve" },
      { id: "a1_f2", type: "event", name: "Fonte Revigorante", icon: "🌿", desc: "Momento de escolha e cura" },
      { id: "a1_f3", type: "boss", name: "Guardião da Floresta", icon: "👑", desc: "Chefe da Área 1" }
    ]
  },
  {
    area: 2,
    name: "Lago Azul",
    icon: "🌊",
    arenaKey: "ocean",
    checkpointName: "🚩 Lago Azul",
    bossName: "Squirtle das Marés",
    bossType: "Água",
    bossImg: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    narrative: "As margens cintilantes do Lago Azul guardam fortes correntes e combatentes aquáticos velozes!",
    floors: [
      { id: "a2_f1", type: "battle", name: "Península Rasa", icon: "⚔️", desc: "Luta contra Pokémon Aquático" },
      { id: "a2_f2", type: "shop", name: "Tenda do Pescador", icon: "🛒", desc: "Compre itens de suporte" },
      { id: "a2_f3", type: "boss", name: "Guardião das Marés", icon: "👑", desc: "Chefe da Área 2" }
    ]
  },
  {
    area: 3,
    name: "Cidade Elétrica",
    icon: "⚡",
    arenaKey: "powerplant",
    checkpointName: "🚩 Usina Neon",
    bossName: "Pikachu Sobrecarga",
    bossType: "Elétrico",
    bossImg: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    narrative: "Torres metálicas e campos magnéticos vibram na Cidade Elétrica. Cuidado com sobrecargas de energia!",
    floors: [
      { id: "a3_f1", type: "battle", name: "Subestação Central", icon: "⚔️", desc: "Combate em campo eletrificado" },
      { id: "a3_f2", type: "event", name: "Gerador Misterioso", icon: "⚡", desc: "Escolha tática de recarga" },
      { id: "a3_f3", type: "boss", name: "Chefe dos Trovões", icon: "👑", desc: "Chefe da Área 3" }
    ]
  },
  {
    area: 4,
    name: "Montanha Vulcânica",
    icon: "🌋",
    arenaKey: "volcano",
    checkpointName: "🚩 Vulcão",
    bossName: "Charizard Vulcânico",
    bossType: "Fogo / Voador",
    bossImg: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    narrative: "O calor é sufocante nas encostas da Montanha Vulcânica. Rios de lava ameaçam os lutadores desatentos!",
    floors: [
      { id: "a4_f1", type: "battle", name: "Cratera Fumegante", icon: "⚔️", desc: "Inimigo que causa queimaduras" },
      { id: "a4_f2", type: "rest", name: "Caverna Termal", icon: "🏕️", desc: "Descanse ou medite" },
      { id: "a4_f3", type: "boss", name: "Dragão Vulcânico", icon: "👑", desc: "Chefe da Área 4" }
    ]
  },
  {
    area: 5,
    name: "Vale Noturno",
    icon: "🌙",
    arenaKey: "shadowrealm",
    checkpointName: "🚩 Vale Noturno",
    bossName: "Gengar Espectral",
    bossType: "Fantasma / Veneno",
    bossImg: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
    narrative: "A lua cheia cobre o Vale Noturno em uma aura misteriosa. Ilusões e sombras tentam confundir sua estratégia!",
    floors: [
      { id: "a5_f1", type: "battle", name: "Clareira Enluarada", icon: "⚔️", desc: "Luta contra energias espectrais" },
      { id: "a5_f2", type: "event", name: "Oráculo das Estrelas", icon: "🔮", desc: "Bênção ou teste misterioso" },
      { id: "a5_f3", type: "boss", name: "Guardião das Sombras", icon: "👑", desc: "Chefe da Área 5" }
    ]
  },
  {
    area: 6,
    name: "Arena Final",
    icon: "👑",
    arenaKey: "shadowrealm",
    checkpointName: "🚩 Cúpula dos Campeões",
    bossName: "Mewtwo Supremo (Final Boss)",
    bossType: "Psíquico / Cósmico",
    bossImg: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    isFinalBossArea: true,
    narrative: "Você pisou na lendária Arena Final! O Chefe Supremo aguarda no trono para a batalha definitiva!",
    floors: [
      { id: "a6_f1", type: "elite", name: "Guardião da Cúpula", icon: "💀", desc: "Adversário de Elite Supremo" },
      { id: "a6_f2", type: "boss_final", name: "O CHEFE FINAL SUPREMO", icon: "👑", desc: "Confronto de 3 Fases pela Glória" }
    ]
  }
];

// ==========================================
// 8.2 ESTADOS GLOBAIS DE JOGO E COMBATE
// ==========================================
let currentMode = "quick"; // 'quick' | 'adventure' | 'boss' | 'training'
let selectedArenaKey = "random";
let currentArena = ARENAS_DATA.forest;

let currentMaxHP = 100;
let enemyMaxHP = 100;
let playerHP = 100;
let enemyHP = 100;

let playerEP = 30;
let enemyEP = 20;
const MAX_EP = 100;
const SPECIAL_COST = 50;

let playerCombo = 0;
let maxComboStreak = 0;
let totalCombosAchieved = 0;
let totalTurns = 0;
let totalCritsAchieved = 0;
let totalTacticsUsed = 0;
let typeAdvantagesUsed = 0;

let playerPokemon = null;
let enemyPokemon = null;
let activeBossConfig = null;
let currentBossPhase = 1;
let bossShieldUsed = false;
let bossHealUsed = false;

let isTurnInProgress = false;
let isBattleOver = false;

// Modo Treino & Forçar Crítico (Requisito 10)
let nextAttackForcedCrit = false;

// Replay da Batalha (Requisito 11)
let battleReplayLog = [];

function recordBattleMoment(title, desc, icon = "⚡", type = "normal") {
  battleReplayLog.push({
    title,
    desc,
    icon,
    type,
    time: new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" })
  });
}

// Estados das Novas Melhorias
let currentDifficulty = "normal"; // 'easy' | 'normal' | 'hard'
let isNightMode = true; // false = diurno, true = noturno
let playerSpecialHealUsed = false;
let playerShieldUsed = false;
let playerShieldActive = false;
let playerPowerBoostUsed = false;
let playerPowerBoostActive = false;

// Estados de Status Ativos
let playerStatuses = {};
let enemyStatuses = {};

// Evento de Batalha Ativo
let activeBattleEvent = null;
let activeEventTurnsLeft = 0;

// Quick-Time-Event (QTE)
let reactionTimerId = null;
let isReactionActive = false;
let reactionResolved = false;
let currentIncomingEnemyAttack = "quick";

// Estado do Modo Aventura (Campanha)
const AdventureState = {
  currentAreaIdx: 0,
  currentFloorIdx: 0,
  checkpointAreaIdx: 0,
  gold: 60,
  currentNodeId: null,
  heroHp: 100,
  heroMaxHp: 100,
  startEnergy: 30,
  items: {
    potion: 2,
    elixir: 1,
    antidote: 1
  },
  mapNodes: []
};

// ==========================================
// 9. REFERÊNCIAS DO DOM
// ==========================================
const DOM = {
  // Telas
  selectionScreen: document.getElementById("selection-screen"),
  battleScreen: document.getElementById("battle-screen"),
  adventureScreen: document.getElementById("adventure-screen"),
  pokemonGrid: document.getElementById("pokemon-grid"),
  selectionHeadingTitle: document.getElementById("selection-heading-title"),

  // Áudio & Música
  btnToggleSound: document.getElementById("btn-toggle-sound"),
  btnToggleMusic: document.getElementById("btn-toggle-music"),
  soundIcon: document.getElementById("sound-icon"),
  soundText: document.getElementById("sound-text"),
  musicIcon: document.getElementById("music-icon"),
  musicText: document.getElementById("music-text"),
  btnBattleSound: document.getElementById("btn-battle-sound"),
  btnBattleMusic: document.getElementById("btn-battle-music"),
  battleSoundIcon: document.getElementById("battle-sound-icon"),
  battleMusicIcon: document.getElementById("battle-music-icon"),

  // Modos e Arenas
  modeQuick: document.getElementById("mode-quick"),
  modeAdventure: document.getElementById("mode-adventure"),
  modeBoss: document.getElementById("mode-boss"),
  modeTraining: document.getElementById("mode-training"),
  arenaPickerBar: document.getElementById("arena-picker-bar"),
  arenaPills: document.getElementById("arena-pills"),

  // Topo da Batalha
  btnBackSelect: document.getElementById("btn-back-select"),
  arenaBadge: document.getElementById("arena-badge"),
  arenaIcon: document.getElementById("arena-icon"),
  arenaName: document.getElementById("arena-name"),
  weatherBadge: document.getElementById("weather-badge"),
  weatherIcon: document.getElementById("weather-icon"),
  weatherName: document.getElementById("weather-name"),
  bossPhaseBadge: document.getElementById("boss-phase-badge"),
  bossPhaseText: document.getElementById("boss-phase-text"),
  comboBadge: document.getElementById("combo-badge"),
  comboText: document.getElementById("combo-text"),
  comboBonusSub: document.getElementById("combo-bonus-sub"),
  surpriseBadge: document.getElementById("surprise-badge"),
  surpriseText: document.getElementById("surprise-text"),
  activeRulePill: document.getElementById("active-rule-pill"),
  phaseAlert: document.getElementById("phase-alert"),
  phaseAlertMsg: document.getElementById("phase-alert-msg"),
  criticalAlert: document.getElementById("critical-alert"),
  turnIndicator: document.getElementById("turn-indicator"),

  // Barra do Modo Treino (Requisito 10)
  trainingControlsBar: document.getElementById("training-controls-bar"),
  btnTrainCrit: document.getElementById("btn-train-crit"),
  btnTrainHeal: document.getElementById("btn-train-heal"),
  btnTrainResetTactics: document.getElementById("btn-train-reset-tactics"),
  btnTrainCycleWeather: document.getElementById("btn-train-cycle-weather"),
  btnTrainRestart: document.getElementById("btn-train-restart"),

  // Campo de Batalha
  battleArenaElement: document.getElementById("battle-arena-element"),
  bgGlow1: document.getElementById("bg-glow-1"),
  bgGlow2: document.getElementById("bg-glow-2"),

  // Jogador
  playerStatusCard: document.getElementById("player-status-card"),
  playerTypeBadge: document.getElementById("player-type-badge"),
  playerName: document.getElementById("player-name"),
  playerFeature: document.getElementById("player-feature"),
  playerHPText: document.getElementById("player-hp-text"),
  playerHPBar: document.getElementById("player-hp-bar"),
  playerEPBar: document.getElementById("player-ep-bar"),
  playerEPText: document.getElementById("player-ep-text"),
  playerStatusEffects: document.getElementById("player-status-effects"),
  playerSprite: document.getElementById("player-sprite"),
  playerPlatform: document.getElementById("player-platform"),
  playerStatusAura: document.getElementById("player-status-aura"),
  playerDamageContainer: document.getElementById("player-damage-container"),

  // Adversário
  enemyStatusCard: document.getElementById("enemy-status-card"),
  enemyRoleTag: document.getElementById("enemy-role-tag"),
  enemyTypeBadge: document.getElementById("enemy-type-badge"),
  enemyName: document.getElementById("enemy-name"),
  enemyFeature: document.getElementById("enemy-feature"),
  enemyHPText: document.getElementById("enemy-hp-text"),
  enemyHPBar: document.getElementById("enemy-hp-bar"),
  enemyPhaseMarkers: document.getElementById("enemy-phase-markers"),
  enemyEPBar: document.getElementById("enemy-ep-bar"),
  enemyEPText: document.getElementById("enemy-ep-text"),
  enemyStatusEffects: document.getElementById("enemy-status-effects"),
  enemySprite: document.getElementById("enemy-sprite"),
  enemyPlatform: document.getElementById("enemy-platform"),
  enemyStatusAura: document.getElementById("enemy-status-aura"),
  enemyDamageContainer: document.getElementById("enemy-damage-container"),

  // QTE de Defesa / Esquiva
  reactionOverlay: document.getElementById("reaction-overlay"),
  reactionTitle: document.getElementById("reaction-title"),
  reactionTimerBar: document.getElementById("reaction-timer-bar"),
  btnQteDefend: document.getElementById("btn-qte-defend"),
  btnQteDodge: document.getElementById("btn-qte-dodge"),

  // Registro & Controles
  battleLog: document.getElementById("battle-log"),
  battleItemsBar: document.getElementById("battle-items-bar"),
  btnUsePotion: document.getElementById("btn-use-potion"),
  btnUseElixir: document.getElementById("btn-use-elixir"),
  btnUseAntidote: document.getElementById("btn-use-antidote"),
  itemCountPotion: document.getElementById("item-count-potion"),
  itemCountElixir: document.getElementById("item-count-elixir"),
  itemCountAntidote: document.getElementById("item-count-antidote"),

  btnQuick: document.getElementById("btn-quick-attack"),
  btnStrong: document.getElementById("btn-strong-attack"),
  btnSpecial: document.getElementById("btn-special-attack"),

  // Tela Aventura & Campanha (Requisitos 18 a 30)
  advHeroImg: document.getElementById("adv-hero-img"),
  advHeroName: document.getElementById("adv-hero-name"),
  advHeroHp: document.getElementById("adv-hero-hp"),
  advCheckpointTag: document.getElementById("adv-checkpoint-tag"),
  advStageText: document.getElementById("adv-stage-text"),
  advGoldText: document.getElementById("adv-gold-text"),
  advBagTotalCount: document.getElementById("adv-bag-total-count"),
  btnAdvQuit: document.getElementById("btn-adv-quit"),
  btnAdvOpenBag: document.getElementById("btn-adv-open-bag"),
  adventureAreasBar: document.getElementById("adventure-areas-bar"),
  adventureNarrativeBox: document.getElementById("adventure-narrative-box"),
  narrativeTitle: document.getElementById("narrative-title"),
  narrativeText: document.getElementById("narrative-text"),
  adventureMapTree: document.getElementById("adventure-map-tree"),

  // Modais
  resultModal: document.getElementById("result-modal"),
  modalCard: document.querySelector(".modal-card"),
  modalIcon: document.getElementById("modal-icon"),
  modalTitle: document.getElementById("modal-title"),
  modalDesc: document.getElementById("modal-description"),
  statTurns: document.getElementById("stat-turns"),
  statRemainingHp: document.getElementById("stat-remaining-hp"),
  statCombos: document.getElementById("stat-combos"),
  statCrits: document.getElementById("stat-crits"),
  statTactics: document.getElementById("stat-tactics"),
  statReward: document.getElementById("stat-reward"),
  statScore: document.getElementById("stat-score"),
  scoreStars: document.getElementById("score-stars"),
  scoreRankBadge: document.getElementById("score-rank-badge"),
  btnPlayAgain: document.getElementById("btn-play-again"),
  btnViewReplay: document.getElementById("btn-view-replay"),
  btnChangePokemon: document.getElementById("btn-change-pokemon"),

  // Modal Replay (Requisito 11)
  replayModal: document.getElementById("replay-modal"),
  replayTimeline: document.getElementById("replay-timeline"),
  btnCloseReplay: document.getElementById("btn-close-replay"),
  btnReplayDone: document.getElementById("btn-replay-done"),

  // Modal Vitória Final Aventura (Requisito 30)
  adventureVictoryModal: document.getElementById("adventure-victory-modal"),
  advVictoryHeroImg: document.getElementById("adv-victory-hero-img"),
  advVictoryHeroName: document.getElementById("adv-victory-hero-name"),
  advVictoryScore: document.getElementById("adv-victory-score"),
  btnRestartAdventureCampaign: document.getElementById("btn-restart-adventure-campaign"),
  btnVictoryBackMenu: document.getElementById("btn-victory-back-menu"),

  // Modal Info Pokémon (Melhoria 5)
  pokemonInfoModal: document.getElementById("pokemon-info-modal"),
  infoModalName: document.getElementById("info-modal-name"),
  infoModalDesc: document.getElementById("info-modal-desc"),
  infoModalImg: document.getElementById("info-modal-img"),
  infoModalBadge: document.getElementById("info-modal-badge"),
  infoModalStyle: document.getElementById("info-modal-style"),
  infoModalAdvantage: document.getElementById("info-modal-advantage"),
  infoModalFeature: document.getElementById("info-modal-feature"),
  infoModalHp: document.getElementById("info-modal-hp"),
  infoStatAtk: document.getElementById("info-stat-atk"),
  infoValAtk: document.getElementById("info-val-atk"),
  infoStatDef: document.getElementById("info-stat-def"),
  infoValDef: document.getElementById("info-val-def"),
  infoStatSpd: document.getElementById("info-stat-spd"),
  infoValSpd: document.getElementById("info-val-spd"),
  infoStatHp: document.getElementById("info-stat-hp"),
  infoValHp: document.getElementById("info-val-hp"),
  btnClosePokeInfo: document.getElementById("btn-close-poke-info"),
  btnSelectFromInfo: document.getElementById("btn-select-from-info"),

  shopModal: document.getElementById("shop-modal"),
  shopCurrentGold: document.getElementById("shop-current-gold"),
  shopItemsGrid: document.getElementById("shop-items-grid"),
  btnCloseShop: document.getElementById("btn-close-shop"),

  eventModal: document.getElementById("event-modal"),
  eventModalIcon: document.getElementById("event-modal-icon"),
  eventModalTitle: document.getElementById("event-modal-title"),
  eventModalDesc: document.getElementById("event-modal-desc"),
  eventChoicesList: document.getElementById("event-choices-list"),

  restModal: document.getElementById("rest-modal"),
  btnRestHeal: document.getElementById("btn-rest-heal"),
  btnRestTrain: document.getElementById("btn-rest-train"),

  arenaInfoModal: document.getElementById("arena-info-modal"),
  arenaInfoIcon: document.getElementById("arena-info-icon"),
  arenaInfoTitle: document.getElementById("arena-info-title"),
  arenaInfoDesc: document.getElementById("arena-info-desc"),
  arenaInfoEffect: document.getElementById("arena-info-effect"),
  btnCloseArenaInfo: document.getElementById("btn-close-arena-info"),

  // Elementos Visuais e Melhorias
  difficultyPills: document.getElementById("difficulty-pills"),
  btnDayNight: document.getElementById("btn-day-night"),
  surpriseEnemyAlert: document.getElementById("surprise-enemy-alert"),
  surpriseEnemyMsg: document.getElementById("surprise-enemy-msg"),
  arenaAmbientParticles: document.getElementById("arena-ambient-particles"),
  critImpactOverlay: document.getElementById("crit-impact-overlay"),
  playerSpriteWrapper: document.getElementById("player-sprite-wrapper"),
  btnSpecialHeal: document.getElementById("btn-special-heal"),
  btnShield: document.getElementById("btn-shield"),
  btnPowerBoost: document.getElementById("btn-power-boost"),
  badgeHealStatus: document.getElementById("badge-heal-status"),
  badgeShieldStatus: document.getElementById("badge-shield-status"),
  badgePowerStatus: document.getElementById("badge-power-status")
};

// ==========================================
// 10. INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
function initApp() {
  hideAllModals();
  showScreen("selection");
  renderPokemonSelection();
  setupEventListeners();
  updateArenaTheme("forest");
}

function hideAllModals() {
  const modals = [
    DOM.resultModal,
    DOM.shopModal,
    DOM.eventModal,
    DOM.restModal,
    DOM.arenaInfoModal
  ];
  modals.forEach(modal => {
    if (modal) {
      modal.classList.add("hidden");
      modal.style.display = "none";
    }
  });
}

function showScreen(screenName) {
  DOM.selectionScreen.classList.add("hidden");
  DOM.selectionScreen.style.display = "none";
  DOM.battleScreen.classList.add("hidden");
  DOM.battleScreen.style.display = "none";
  DOM.adventureScreen.classList.add("hidden");
  DOM.adventureScreen.style.display = "none";

  if (screenName === "selection") {
    DOM.selectionScreen.classList.remove("hidden");
    DOM.selectionScreen.style.display = "block";
  } else if (screenName === "battle") {
    DOM.battleScreen.classList.remove("hidden");
    DOM.battleScreen.style.display = "block";
  } else if (screenName === "adventure") {
    DOM.adventureScreen.classList.remove("hidden");
    DOM.adventureScreen.style.display = "block";
  }
}

// ==========================================
// 11. RENDERIZAÇÃO DOS CARDS DE POKÉMON (Melhorias 4 & 5)
// ==========================================
function renderPokemonSelection() {
  DOM.pokemonGrid.innerHTML = "";

  POKEMON_DATA.forEach(poke => {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "pokemon-card-wrapper";

    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.dataset.id = poke.id;

    card.innerHTML = `
      <div class="card-shine"></div>
      <div class="card-header">
        <span class="type-badge ${poke.typeClass}">${poke.badgeIcon} ${poke.type}</span>
      </div>
      <div class="card-img-wrapper">
        <img class="pokemon-card-img" src="${poke.image}" alt="${poke.name}" loading="lazy">
      </div>
      <h3 class="card-name">${poke.name}</h3>
      <p class="card-desc">${poke.description}</p>
      
      <div class="card-feature-box">
        <span class="feature-label">Característica</span>
        <span class="feature-val">${poke.characteristic}</span>
      </div>

      <!-- Mini-Visual de Atributos (Melhorias 4 & 5) -->
      <div class="card-stats-preview">
        <div class="card-stat-line">
          <span>⚔️ ATQ</span>
          <div class="card-stat-track"><div class="card-stat-bar atk" style="width: ${Math.min(100, poke.stats.atk)}%;"></div></div>
          <span>${poke.stats.atk}</span>
        </div>
        <div class="card-stat-line">
          <span>🛡️ DEF</span>
          <div class="card-stat-track"><div class="card-stat-bar def" style="width: ${Math.min(100, poke.stats.def)}%;"></div></div>
          <span>${poke.stats.def}</span>
        </div>
        <div class="card-stat-line">
          <span>💨 VEL</span>
          <div class="card-stat-track"><div class="card-stat-bar spd" style="width: ${Math.min(100, poke.stats.spd)}%;"></div></div>
          <span>${poke.stats.spd}</span>
        </div>
        <div class="card-stat-line">
          <span>💚 HP</span>
          <div class="card-stat-track"><div class="card-stat-bar hp" style="width: ${Math.min(100, poke.stats.hp)}%;"></div></div>
          <span>${poke.stats.hp}</span>
        </div>
      </div>

      <div class="card-actions-row">
        <button class="btn-choose" data-action="choose">Escolher</button>
        <button class="btn-card-info" data-action="info" title="Ver Informações Detalhadas">ℹ️</button>
      </div>
    `;

    attach3DTiltEffect(card);

    const chooseBtn = card.querySelector(".btn-choose");
    const infoBtn = card.querySelector(".btn-card-info");

    chooseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      SoundFX.buttonClick();
      card.style.transform = "scale(0.96)";
      setTimeout(() => {
        onSelectPokemonForMode(poke);
      }, 150);
    });

    infoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      SoundFX.buttonClick();
      openPokemonInfoModal(poke);
    });

    card.addEventListener("click", () => {
      SoundFX.buttonClick();
      onSelectPokemonForMode(poke);
    });

    cardWrapper.appendChild(card);
    DOM.pokemonGrid.appendChild(cardWrapper);
  });
}

function openPokemonInfoModal(poke) {
  if (!poke || !DOM.pokemonInfoModal) return;
  DOM.infoModalName.textContent = poke.name;
  DOM.infoModalDesc.textContent = poke.description;
  DOM.infoModalImg.src = poke.image;
  DOM.infoModalImg.alt = poke.name;
  DOM.infoModalBadge.className = `type-badge ${poke.typeClass}`;
  DOM.infoModalBadge.innerHTML = `${poke.badgeIcon} ${poke.type}`;
  DOM.infoModalStyle.textContent = poke.battleStyle || "Equilibrado";
  DOM.infoModalAdvantage.textContent = poke.mainAdvantage || "Estratégia sólida";
  DOM.infoModalFeature.textContent = poke.characteristic;
  DOM.infoModalHp.textContent = `${poke.baseMaxHp} HP`;

  DOM.infoStatAtk.style.width = `${Math.min(100, poke.stats.atk)}%`;
  DOM.infoValAtk.textContent = poke.stats.atk;
  DOM.infoStatDef.style.width = `${Math.min(100, poke.stats.def)}%`;
  DOM.infoValDef.textContent = poke.stats.def;
  DOM.infoStatSpd.style.width = `${Math.min(100, poke.stats.spd)}%`;
  DOM.infoValSpd.textContent = poke.stats.spd;
  DOM.infoStatHp.style.width = `${Math.min(100, poke.stats.hp)}%`;
  DOM.infoValHp.textContent = poke.stats.hp;

  DOM.btnSelectFromInfo.onclick = () => {
    closePokemonInfoModal();
    onSelectPokemonForMode(poke);
  };

  DOM.pokemonInfoModal.classList.remove("hidden");
  DOM.pokemonInfoModal.style.display = "flex";
}

function closePokemonInfoModal() {
  if (DOM.pokemonInfoModal) {
    DOM.pokemonInfoModal.classList.add("hidden");
    DOM.pokemonInfoModal.style.display = "none";
  }
}

function updateAudioUI() {
  const isSoundOn = SoundFX.enabled;
  const isMusicOn = MusicEngine.enabled;

  if (DOM.btnToggleSound) {
    DOM.btnToggleSound.classList.toggle("active", isSoundOn);
    if (DOM.soundIcon) DOM.soundIcon.textContent = isSoundOn ? "🔊" : "🔇";
    if (DOM.soundText) DOM.soundText.textContent = isSoundOn ? "Sons: ON" : "Sons: OFF";
  }

  if (DOM.btnBattleSound) {
    DOM.btnBattleSound.classList.toggle("active", isSoundOn);
    if (DOM.battleSoundIcon) DOM.battleSoundIcon.textContent = isSoundOn ? "🔊" : "🔇";
  }

  if (DOM.btnToggleMusic) {
    DOM.btnToggleMusic.classList.toggle("active", isMusicOn);
    if (DOM.musicIcon) DOM.musicIcon.textContent = isMusicOn ? "🎵" : "🔇";
    if (DOM.musicText) DOM.musicText.textContent = isMusicOn ? "Música: ON" : "Música: OFF";
  }

  if (DOM.btnBattleMusic) {
    DOM.btnBattleMusic.classList.toggle("active", isMusicOn);
    if (DOM.battleMusicIcon) DOM.battleMusicIcon.textContent = isMusicOn ? "🎵" : "🔇";
  }
}

function attach3DTiltEffect(card) {
  const shine = card.querySelector(".card-shine");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -6px, 0)`;

    if (shine) {
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)`;
      shine.style.opacity = "1";
    }
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
    if (shine) shine.style.opacity = "0";
  });
}

function onSelectPokemonForMode(pokemon) {
  if (currentMode === "quick") {
    startFreeBattle(pokemon);
  } else if (currentMode === "adventure") {
    startAdventureMode(pokemon);
  } else if (currentMode === "boss") {
    startBossChallenge(pokemon);
  } else if (currentMode === "training") {
    startTrainingBattle(pokemon);
  }
}

// ==========================================
// 12. GESTÃO DE MODOS DE JOGO
// ==========================================
function setGameMode(mode) {
  currentMode = mode;
  [DOM.modeQuick, DOM.modeAdventure, DOM.modeBoss, DOM.modeTraining].forEach(btn => {
    if (btn) btn.classList.remove("active");
  });

  if (mode === "quick" && DOM.modeQuick) {
    DOM.modeQuick.classList.add("active");
    DOM.arenaPickerBar.style.display = "flex";
    DOM.selectionHeadingTitle.textContent = "Escolha seu Pokémon para Batalha Rápida";
  } else if (mode === "adventure" && DOM.modeAdventure) {
    DOM.modeAdventure.classList.add("active");
    DOM.arenaPickerBar.style.display = "none";
    DOM.selectionHeadingTitle.textContent = "Escolha seu Pokémon Campeão para a Aventura";
  } else if (mode === "boss" && DOM.modeBoss) {
    DOM.modeBoss.classList.add("active");
    DOM.arenaPickerBar.style.display = "none";
    DOM.selectionHeadingTitle.textContent = "Escolha seu Pokémon para o Desafio de Chefe";
  } else if (mode === "training" && DOM.modeTraining) {
    DOM.modeTraining.classList.add("active");
    DOM.arenaPickerBar.style.display = "flex";
    DOM.selectionHeadingTitle.textContent = "Escolha seu Pokémon para o Modo Treino";
  }
}

// ==========================================
// 13. CONFIGURAÇÃO DE ARENAS E CLIMA
// ==========================================
function updateArenaTheme(arenaKey) {
  let chosenKey = arenaKey;
  if (chosenKey === "random") {
    const keys = Object.keys(ARENAS_DATA);
    chosenKey = keys[Math.floor(Math.random() * keys.length)];
  }

  currentArena = ARENAS_DATA[chosenKey] || ARENAS_DATA.forest;

  // Atualiza classes do elemento da Arena
  const allThemes = Object.values(ARENAS_DATA).map(a => a.cssTheme);
  allThemes.forEach(theme => DOM.battleArenaElement.classList.remove(theme));
  DOM.battleArenaElement.classList.add(currentArena.cssTheme);

  // Atualiza glow de fundo
  if (DOM.bgGlow1) DOM.bgGlow1.style.background = currentArena.bgGlow1;
  if (DOM.bgGlow2) DOM.bgGlow2.style.background = currentArena.bgGlow2;

  // Atualiza Badge superior
  DOM.arenaIcon.textContent = currentArena.icon;
  DOM.arenaName.textContent = currentArena.name;
}

function setBattleWeather(weatherKey = "random") {
  const weatherKeys = Object.keys(WEATHER_DATA);
  let key = weatherKey;
  if (key === "random" || !WEATHER_DATA[key]) {
    key = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
  }

  currentWeather = WEATHER_DATA[key] || WEATHER_DATA.sun;

  if (DOM.weatherBadge) {
    DOM.weatherBadge.className = `weather-badge ${currentWeather.badgeClass}`;
    DOM.weatherBadge.title = currentWeather.desc;
  }
  if (DOM.weatherIcon) DOM.weatherIcon.textContent = currentWeather.icon;
  if (DOM.weatherName) DOM.weatherName.textContent = currentWeather.name;
}

// ==========================================
// 14. INICIALIZAÇÃO DE COMBATE E MODO TREINO
// ==========================================
function startFreeBattle(selectedHero) {
  playerPokemon = selectedHero;
  activeBossConfig = null;

  // Escolhe adversário aleatório diferente do jogador
  const others = POKEMON_DATA.filter(p => p.id !== selectedHero.id);
  enemyPokemon = others[Math.floor(Math.random() * others.length)];

  // Define arena e clima
  updateArenaTheme(selectedArenaKey);
  setBattleWeather("random");

  initBattleCombatants(selectedHero, enemyPokemon, false);
}

function startBossChallenge(selectedHero) {
  playerPokemon = selectedHero;
  const boss = BOSSES_DATA[0]; // Mewtwo Supremo
  activeBossConfig = boss;
  currentBossPhase = 1;

  updateArenaTheme(boss.phases[0].arena);
  setBattleWeather("storm");
  initBattleCombatants(selectedHero, boss, true);
}

function startTrainingBattle(selectedHero) {
  playerPokemon = selectedHero;
  activeBossConfig = null;

  // Adversário de Treino Especial (Snorlax Sparring Dummy)
  enemyPokemon = {
    id: "training_dummy",
    name: "Snorlax (Manequim de Treino)",
    roleName: "MANEQUIM DE TREINO",
    type: "Normal",
    typeClass: "type-planta",
    badgeIcon: "🎯",
    characteristic: "Manequim resistente perfeito para testar todas as mecânicas!",
    description: "Ideal para treinar ataques, combos, críticos, cura e escudos.",
    baseMaxHp: 250,
    maxHp: 250,
    stats: { atk: 45, def: 80, spd: 30, hp: 250 },
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png"
  };

  updateArenaTheme(selectedArenaKey);
  setBattleWeather("sun");
  initBattleCombatants(selectedHero, enemyPokemon, false);
}

// ==========================================
// FUNÇÕES AUXILIARES DAS MELHORIAS
// ==========================================

/**
 * 1. Vantagem entre os tipos (Melhoria 1)
 * Regras: Água > Fogo, Fogo > Planta, Planta > Água (+ elétrico e outros)
 */
function getTypeAdvantage(attackerType, defenderType) {
  if (!attackerType || !defenderType) return "neutral";

  const isAttWater = attackerType.includes("Água");
  const isAttFire = attackerType.includes("Fogo");
  const isAttGrass = attackerType.includes("Planta");
  const isAttElec = attackerType.includes("Elétrico");
  const isAttPsych = attackerType.includes("Psíquico");
  const isAttGhost = attackerType.includes("Fantasma");

  const isDefWater = defenderType.includes("Água");
  const isDefFire = defenderType.includes("Fogo");
  const isDefGrass = defenderType.includes("Planta");
  const isDefElec = defenderType.includes("Elétrico");
  const isDefPsych = defenderType.includes("Psíquico");
  const isDefGhost = defenderType.includes("Fantasma");

  // Vantagens Super Eficazes
  if (isAttWater && isDefFire) return "super";
  if (isAttFire && isDefGrass) return "super";
  if (isAttGrass && isDefWater) return "super";
  if (isAttElec && isDefWater) return "super";
  if (isAttGhost && isDefPsych) return "super";

  // Desvantagens Pouco Eficazes
  if (isAttWater && isDefGrass) return "weak";
  if (isAttFire && isDefWater) return "weak";
  if (isAttGrass && isDefFire) return "weak";
  if (isAttElec && isDefGrass) return "weak";
  if (isAttPsych && isDefGhost) return "weak";

  return "neutral";
}

/**
 * 2. Alternância entre Modo Diurno e Noturno (Melhoria 2)
 */
function toggleDayNightMode() {
  isNightMode = !isNightMode;
  if (!isNightMode) {
    DOM.battleArenaElement.classList.add("day-mode");
    if (DOM.btnDayNight) {
      DOM.btnDayNight.innerHTML = "🌙 Modo Noturno";
      DOM.btnDayNight.title = "Alternar para Modo Noturno";
    }
  } else {
    DOM.battleArenaElement.classList.remove("day-mode");
    if (DOM.btnDayNight) {
      DOM.btnDayNight.innerHTML = "☀️ Modo Diurno";
      DOM.btnDayNight.title = "Alternar para Modo Diurno";
    }
  }
}

/**
 * 4. Recuperação Especial (Melhoria 4)
 */
function handleSpecialHeal() {
  if (playerSpecialHealUsed || isTurnInProgress || isBattleOver) return;

  if (playerHP >= currentMaxHP) {
    addLogMessage("ℹ️ A vida do seu Pokémon já está no limite máximo!", "log-system");
    return;
  }

  playerSpecialHealUsed = true;
  totalTacticsUsed++;
  if (DOM.btnSpecialHeal) DOM.btnSpecialHeal.disabled = true;
  if (DOM.badgeHealStatus) DOM.badgeHealStatus.textContent = "USADO";

  const healAmount = Math.min(35, currentMaxHP - playerHP);
  playerHP = Math.min(currentMaxHP, playerHP + 35);
  updateHPBar("player", playerHP, currentMaxHP);

  SoundFX.heal();
  recordBattleMoment("Recuperação Especial", `${playerPokemon.name} utilizou cura e recuperou +${healAmount} HP!`, "💚", "heal");

  if (DOM.playerSprite) {
    DOM.playerSprite.classList.add("anim-heal");
    setTimeout(() => {
      if (DOM.playerSprite) DOM.playerSprite.classList.remove("anim-heal");
    }, 900);
  }

  showFloatingText(DOM.playerDamageContainer, `+${healAmount} HP`, "heal");
  addLogMessage(`💚 Recuperação Especial: ${playerPokemon.name} recuperou +${healAmount} HP!`, "log-special");
}

/**
 * 5. Efeito Visual de Impacto de Ataque Crítico (Melhoria 5)
 */
function triggerCritImpact() {
  if (DOM.critImpactOverlay) {
    DOM.critImpactOverlay.classList.remove("active");
    void DOM.critImpactOverlay.offsetWidth;
    DOM.critImpactOverlay.classList.add("active");
  }
  if (DOM.battleArenaElement) {
    DOM.battleArenaElement.classList.add("crit-shake");
    setTimeout(() => {
      if (DOM.battleArenaElement) DOM.battleArenaElement.classList.remove("crit-shake");
    }, 450);
  }
}

/**
 * 6. Escudo de Proteção (Melhoria 6)
 */
function handleShieldActivation() {
  if (playerShieldUsed || isTurnInProgress || isBattleOver) return;

  playerShieldUsed = true;
  playerShieldActive = true;
  totalTacticsUsed++;
  if (DOM.btnShield) DOM.btnShield.disabled = true;
  if (DOM.badgeShieldStatus) DOM.badgeShieldStatus.textContent = "ATIVO";

  if (DOM.playerSpriteWrapper) {
    DOM.playerSpriteWrapper.classList.add("shield-active");
  }

  SoundFX.defend();
  recordBattleMoment("Escudo de Proteção", `${playerPokemon.name} ativou uma barreira protetora contra o próximo golpe.`, "🛡️", "normal");
  showFloatingText(DOM.playerDamageContainer, "ESCUDO ATIVADO 🛡️", "crit");
  addLogMessage("🛡️ Escudo de proteção ativado! O dano do próximo ataque do adversário será reduzido.", "log-special");
}

/**
 * 7. Poder Temporário (Melhoria 7)
 */
function handlePowerBoostActivation() {
  if (playerPowerBoostUsed || isTurnInProgress || isBattleOver) return;

  playerPowerBoostUsed = true;
  playerPowerBoostActive = true;
  totalTacticsUsed++;
  if (DOM.btnPowerBoost) DOM.btnPowerBoost.disabled = true;
  if (DOM.badgePowerStatus) DOM.badgePowerStatus.textContent = "ATIVO";

  if (DOM.playerSpriteWrapper) {
    DOM.playerSpriteWrapper.classList.add("power-boost-active");
  }

  SoundFX.powerBoost();
  recordBattleMoment("Poder Temporário", `${playerPokemon.name} canalizou energia máxima (+50% no próximo ataque).`, "⚡", "normal");
  showFloatingText(DOM.playerDamageContainer, "PODER ATIVADO ⚡", "heal");
  addLogMessage("⚡ Poder temporário ativado! O próximo ataque causará dano potencializado (+50%)!", "log-special");
}

/**
 * 8 e 9. Efeitos de Ambiente e Partículas de Clima (Requisitos 6, 9 e 12)
 */
function renderAmbientWeather(pokemon) {
  if (!DOM.arenaAmbientParticles) return;
  DOM.arenaAmbientParticles.innerHTML = "";

  const type = pokemon ? pokemon.type : "";

  // 1. Partículas do Tipo Elemental
  if (type.includes("Fogo") || currentArena.id === "volcano") {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("div");
      p.className = "ambient-particle particle-ember";
      p.style.left = `${Math.random() * 96}%`;
      p.style.bottom = `${Math.random() * 40}%`;
      p.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      p.style.animationDelay = `${Math.random() * 2.5}s`;
      DOM.arenaAmbientParticles.appendChild(p);
    }
  } else if (type.includes("Água") || currentArena.id === "ocean") {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "ambient-particle particle-droplet";
      p.style.left = `${Math.random() * 96}%`;
      p.style.top = `${Math.random() * 20}%`;
      p.style.animationDuration = `${1.2 + Math.random() * 1.5}s`;
      p.style.animationDelay = `${Math.random() * 2}s`;
      DOM.arenaAmbientParticles.appendChild(p);
    }
  } else if (type.includes("Planta") || currentArena.id === "forest") {
    const leaves = ["🍃", "🌿", "🍀"];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("div");
      p.className = "ambient-particle particle-leaf";
      p.textContent = leaves[Math.floor(Math.random() * leaves.length)];
      p.style.left = `${Math.random() * 95}%`;
      p.style.top = `${-20 + Math.random() * 30}px`;
      p.style.animationDuration = `${3.5 + Math.random() * 3}s`;
      p.style.animationDelay = `${Math.random() * 3}s`;
      DOM.arenaAmbientParticles.appendChild(p);
    }
  } else if (type.includes("Elétrico") || currentArena.id === "powerplant") {
    for (let i = 0; i < 16; i++) {
      const p = document.createElement("div");
      p.className = "ambient-particle particle-spark";
      p.style.left = `${10 + Math.random() * 80}%`;
      p.style.top = `${15 + Math.random() * 70}%`;
      p.style.animationDuration = `${0.9 + Math.random() * 1.2}s`;
      p.style.animationDelay = `${Math.random() * 1.8}s`;
      DOM.arenaAmbientParticles.appendChild(p);
    }
  } else if (type.includes("Psíquico") || currentArena.id === "shadowrealm") {
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("div");
      p.className = "ambient-particle particle-spark";
      p.style.background = "#c084fc";
      p.style.boxShadow = "0 0 12px #a855f7, 0 0 20px #9333ea";
      p.style.left = `${10 + Math.random() * 80}%`;
      p.style.top = `${15 + Math.random() * 70}%`;
      p.style.animationDuration = `${1.2 + Math.random() * 1.5}s`;
      p.style.animationDelay = `${Math.random() * 2}s`;
      DOM.arenaAmbientParticles.appendChild(p);
    }
  }

  // 2. Partículas Dinâmicas do Clima (Requisito 9)
  if (currentWeather && currentWeather.id === "rain") {
    for (let i = 0; i < 22; i++) {
      const drop = document.createElement("div");
      drop.className = "weather-particle-rain";
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.top = `${Math.random() * -30}px`;
      drop.style.animationDuration = `${0.6 + Math.random() * 0.4}s`;
      drop.style.animationDelay = `${Math.random() * 1.5}s`;
      DOM.arenaAmbientParticles.appendChild(drop);
    }
  } else if (currentWeather && currentWeather.id === "storm") {
    for (let i = 0; i < 24; i++) {
      const bolt = document.createElement("div");
      bolt.className = "weather-particle-storm";
      bolt.style.left = `${Math.random() * 100}%`;
      bolt.style.top = `${Math.random() * -40}px`;
      bolt.style.animationDuration = `${0.5 + Math.random() * 0.3}s`;
      bolt.style.animationDelay = `${Math.random() * 1.2}s`;
      DOM.arenaAmbientParticles.appendChild(bolt);
    }
  } else if (currentWeather && currentWeather.id === "fog") {
    for (let i = 0; i < 8; i++) {
      const fog = document.createElement("div");
      fog.className = "weather-particle-fog";
      const size = 120 + Math.random() * 140;
      fog.style.width = `${size}px`;
      fog.style.height = `${size}px`;
      fog.style.left = `${Math.random() * 90}%`;
      fog.style.top = `${20 + Math.random() * 60}%`;
      fog.style.animationDelay = `${Math.random() * 3}s`;
      DOM.arenaAmbientParticles.appendChild(fog);
    }
  }
}

function spawnElementalHitBurst(container, typeClass) {
  if (!container) return;
  const burst = document.createElement("div");
  const fxClass = typeClass ? typeClass.replace("type-", "hit-fx-") : "hit-fx-eletrico";
  burst.className = `elemental-hit-burst ${fxClass}`;
  container.appendChild(burst);
  setTimeout(() => burst.remove(), 450);
}

function initBattleCombatants(hero, rival, isBoss = false) {
  currentMaxHP = hero.baseMaxHp || 100;
  enemyMaxHP = rival.maxHp || rival.baseMaxHp || 100;

  playerHP = currentMode === "adventure" ? AdventureState.heroHp : currentMaxHP;
  enemyHP = enemyMaxHP;

  playerEP = currentMode === "adventure" ? AdventureState.startEnergy : 30;
  enemyEP = 20;

  playerCombo = 0;
  maxComboStreak = 0;
  totalCombosAchieved = 0;
  totalTurns = 0;
  totalCritsAchieved = 0;
  totalTacticsUsed = 0;
  typeAdvantagesUsed = 0;

  bossShieldUsed = false;
  bossHealUsed = false;

  playerStatuses = {};
  enemyStatuses = {};

  // Reseta Gravação de Replay (Requisito 11)
  battleReplayLog = [];
  recordBattleMoment("Início do Combate", `${hero.name} (${hero.type}) entrou em batalha contra ${rival.name} (${rival.type}) na ${currentArena.name}.`, "⚔️", "normal");

  // Reseta Habilidades Táticas (Melhorias 4, 6 e 7)
  playerSpecialHealUsed = false;
  playerShieldUsed = false;
  playerShieldActive = false;
  playerPowerBoostUsed = false;
  playerPowerBoostActive = false;
  nextAttackForcedCrit = false;

  if (DOM.btnSpecialHeal) DOM.btnSpecialHeal.disabled = false;
  if (DOM.btnShield) DOM.btnShield.disabled = false;
  if (DOM.btnPowerBoost) DOM.btnPowerBoost.disabled = false;
  if (DOM.badgeHealStatus) DOM.badgeHealStatus.textContent = "1x";
  if (DOM.badgeShieldStatus) DOM.badgeShieldStatus.textContent = "1x";
  if (DOM.badgePowerStatus) DOM.badgePowerStatus.textContent = "1x";
  if (DOM.playerSpriteWrapper) {
    DOM.playerSpriteWrapper.classList.remove("shield-active", "power-boost-active");
  }

  // Barra exclusiva do Modo Treino (Requisito 10)
  if (DOM.trainingControlsBar) {
    if (currentMode === "training") {
      DOM.trainingControlsBar.classList.remove("hidden");
    } else {
      DOM.trainingControlsBar.classList.add("hidden");
    }
  }

  activeBattleEvent = null;
  activeEventTurnsLeft = 0;
  isTurnInProgress = false;
  isBattleOver = false;

  setupCombatantUI("player", hero, playerHP, currentMaxHP);
  setupCombatantUI("enemy", rival, enemyHP, enemyMaxHP, isBoss);

  // Efeitos de Ambiente segundo o tipo do Pokémon, Arena e Clima (Melhorias 6, 9 e 12)
  renderAmbientWeather(hero);

  // Animação de Entrada suave dos Pokémon (Melhoria 1)
  if (DOM.playerSprite) {
    DOM.playerSprite.classList.remove("anim-entrance", "anim-victory", "anim-defeat");
    void DOM.playerSprite.offsetWidth;
    DOM.playerSprite.classList.add("anim-entrance");
  }
  if (DOM.enemySprite) {
    DOM.enemySprite.classList.remove("anim-entrance", "anim-victory", "anim-defeat");
    void DOM.enemySprite.offsetWidth;
    DOM.enemySprite.classList.add("anim-entrance");
  }

  // Reseta elementos visuais
  DOM.battleLog.innerHTML = "";
  addLogMessage(`⚡ Início de combate! ${hero.name} entra no campo da ${currentArena.name}!`, "log-system");
  addLogMessage(`🏟️ Efeito da Arena: ${currentArena.effectText}`, "log-special");
  addLogMessage(`🌦️ Clima Atual: ${currentWeather.name} - ${currentWeather.desc}`, "log-special");

  if (isBoss) {
    DOM.bossPhaseBadge.classList.remove("hidden");
    DOM.enemyPhaseMarkers.classList.remove("hidden");
    DOM.bossPhaseText.textContent = `CHEFE: FASE 1 / ${rival.phases.length}`;
    addLogMessage(`👑 DESAFIO DE CHEFE: ${rival.name} assumiu a ${rival.phases[0].title}!`, "log-enemy");
    if (rival.phases[0].dialogue) addLogMessage(`💬 "${rival.phases[0].dialogue}"`, "log-special");
  } else {
    DOM.bossPhaseBadge.classList.add("hidden");
    DOM.enemyPhaseMarkers.classList.add("hidden");
  }

  // Itens na Batalha (visíveis no modo aventura)
  if (currentMode === "adventure") {
    DOM.battleItemsBar.classList.remove("hidden");
    updateItemsUI();
  } else {
    DOM.battleItemsBar.classList.add("hidden");
  }

  DOM.phaseAlert.classList.add("hidden");
  DOM.criticalAlert.classList.add("hidden");
  DOM.reactionOverlay.classList.add("hidden");
  DOM.surpriseBadge.classList.add("hidden");
  DOM.activeRulePill.classList.add("hidden");

  updateEnergyBar("player", playerEP);
  updateEnergyBar("enemy", enemyEP);
  updateComboUI();
  renderStatusEffects();
  updateAudioUI();

  showScreen("battle");

  // Inicia música se estiver ativada
  if (MusicEngine.enabled) {
    MusicEngine.start();
  }

  // 9. Adversário Surpresa com Animação de Revelação (Melhoria 9 e 14)
  if (!isBoss && currentMode !== "training") {
    enableAttackButtons(false);

    DOM.enemySprite.classList.add("silhouette");
    DOM.enemySprite.classList.remove("anim-reveal");
    DOM.enemyName.textContent = "???";
    DOM.enemyTypeBadge.innerHTML = "❓ Desconhecido";

    if (DOM.surpriseEnemyAlert) {
      DOM.surpriseEnemyAlert.classList.remove("hidden");
      if (DOM.surpriseEnemyMsg) DOM.surpriseEnemyMsg.textContent = "UM ADVERSÁRIO APARECEU!";
    }

    addLogMessage("❓ Um adversário misterioso se aproxima nas sombras...", "log-system");
    DOM.turnIndicator.textContent = "Um adversário apareceu!";
    DOM.turnIndicator.style.color = "#fbbf24";

    setTimeout(() => {
      if (isBattleOver) return;

      SoundFX.surpriseReveal();
      recordBattleMoment("Revelação do Adversário", `O oponente foi revelado: ${rival.name} (${rival.type})!`, "❓", "normal");

      DOM.enemySprite.classList.remove("silhouette");
      DOM.enemySprite.classList.add("anim-reveal");
      DOM.enemyName.textContent = rival.name;
      DOM.enemyTypeBadge.className = `type-badge ${rival.typeClass}`;
      DOM.enemyTypeBadge.innerHTML = `${rival.badgeIcon} ${rival.type}`;

      if (DOM.surpriseEnemyAlert) {
        DOM.surpriseEnemyAlert.classList.add("hidden");
      }

      addLogMessage(`⚡ Um adversário apareceu! É ${rival.name} (${rival.type})!`, "log-special");
      DOM.turnIndicator.textContent = "Sua Vez de Atacar!";
      DOM.turnIndicator.style.color = "#38bdf8";
      enableAttackButtons(true);
    }, 1500);
  } else {
    enableAttackButtons(true);
    DOM.turnIndicator.textContent = "Sua Vez de Atacar!";
    DOM.turnIndicator.style.color = "#38bdf8";
  }
}

function setupCombatantUI(side, pokemon, hp, maxHp, isBoss = false) {
  if (side === "player") {
    DOM.playerName.textContent = pokemon.name;
    DOM.playerTypeBadge.className = `type-badge ${pokemon.typeClass}`;
    DOM.playerTypeBadge.innerHTML = `${pokemon.badgeIcon} ${pokemon.type}`;
    DOM.playerFeature.textContent = pokemon.characteristic;
    DOM.playerSprite.src = pokemon.image;
    DOM.playerSprite.alt = pokemon.name;
    updateHPBar("player", hp, maxHp);
  } else {
    DOM.enemyName.textContent = pokemon.name;
    DOM.enemyTypeBadge.className = `type-badge ${pokemon.typeClass}`;
    DOM.enemyTypeBadge.innerHTML = `${pokemon.badgeIcon} ${pokemon.type}`;
    DOM.enemyFeature.textContent = pokemon.characteristic;
    DOM.enemySprite.src = pokemon.image;
    DOM.enemySprite.alt = pokemon.name;
    if (DOM.enemyRoleTag) {
      DOM.enemyRoleTag.textContent = isBoss ? pokemon.roleName : "ADVERSÁRIO";
    }
    updateHPBar("enemy", hp, maxHp);
  }
}

// ==========================================
// 15. SISTEMA DE HP, EP E BARRAS VISUAIS
// ==========================================
function updateHPBar(side, current, max) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const textElem = side === "player" ? DOM.playerHPText : DOM.enemyHPText;
  const barElem = side === "player" ? DOM.playerHPBar : DOM.enemyHPBar;

  textElem.textContent = `${Math.ceil(current)} / ${max} HP`;
  barElem.style.width = `${pct}%`;

  barElem.classList.remove("medium", "danger");
  if (pct <= 30) {
    barElem.classList.add("danger");
  } else if (pct <= 55) {
    barElem.classList.add("medium");
  }

  if (side === "player") {
    if (pct <= 30 && current > 0) {
      DOM.criticalAlert.classList.remove("hidden");
    } else {
      DOM.criticalAlert.classList.add("hidden");
    }
  }
}

function updateEnergyBar(side, ep) {
  const pct = Math.max(0, Math.min(100, (ep / MAX_EP) * 100));
  const barElem = side === "player" ? DOM.playerEPBar : DOM.enemyEPBar;
  const textElem = side === "player" ? DOM.playerEPText : DOM.enemyEPText;

  barElem.style.width = `${pct}%`;
  textElem.textContent = `${ep} / ${MAX_EP} EP`;

  // Destaca o botão Especial se tiver EP suficiente
  if (side === "player") {
    const cost = activeBattleEvent && activeBattleEvent.modifyEnergyCost
      ? activeBattleEvent.modifyEnergyCost(SPECIAL_COST)
      : SPECIAL_COST;

    if (ep >= cost && !isTurnInProgress && !isBattleOver) {
      DOM.btnSpecial.classList.add("critical-highlight");
      DOM.btnSpecial.disabled = false;
    } else {
      DOM.btnSpecial.classList.remove("critical-highlight");
      if (ep < cost) {
        DOM.btnSpecial.disabled = true;
      }
    }
  }
}

// ==========================================
// 16. PROGRESSÃO DE COMBOS
// ==========================================
function advancePlayerCombo() {
  playerCombo++;
  if (playerCombo > maxComboStreak) maxComboStreak = playerCombo;

  if (playerCombo === 2) {
    SoundFX.comboUp();
    addLogMessage("🔥 COMBO x2 ativado! (+10% de Dano)", "log-special");
  } else if (playerCombo === 3) {
    totalCombosAchieved++;
    SoundFX.comboUp();
    addLogMessage("🔥 COMBO x3! (+25% de Dano no próximo golpe!)", "log-special");
  } else if (playerCombo === 4) {
    SoundFX.comboUp();
    addLogMessage("⚡ COMBO x4! (+40% de Dano + Chance Crítica!)", "log-special");
  } else if (playerCombo >= 5) {
    SoundFX.special();
    addLogMessage("💥 SUPER COMBO x5! (+60% de Dano e CRÍTICO GARANTIDO!)", "log-special");
  }

  updateComboUI();
}

function resetPlayerCombo() {
  if (playerCombo > 1) {
    addLogMessage("⚠️ O adversário quebrou o seu ritmo! Sequência de COMBO resetada.", "log-system");
  }
  playerCombo = 0;
  updateComboUI();
}

function updateComboUI() {
  if (playerCombo > 0) {
    DOM.comboBadge.classList.remove("hidden");
    DOM.comboText.textContent = `COMBO x${playerCombo}!`;
    
    let bonusText = "+10% Dano";
    if (playerCombo === 3) bonusText = "+25% Dano";
    else if (playerCombo === 4) bonusText = "+40% Dano";
    else if (playerCombo >= 5) bonusText = "+60% Crítico!";
    DOM.comboBonusSub.textContent = bonusText;
  } else {
    DOM.comboBadge.classList.add("hidden");
  }
}

// ==========================================
// 17. EXECUÇÃO DE ATAQUES DO JOGADOR (Melhorias 1, 2 e 11)
// ==========================================
function handlePlayerAttack(attackType) {
  if (isTurnInProgress || isBattleOver) return;

  // Verifica custo de energia do Especial
  const currentCost = activeBattleEvent && activeBattleEvent.modifyEnergyCost
    ? activeBattleEvent.modifyEnergyCost(SPECIAL_COST)
    : SPECIAL_COST;

  if (attackType === "special" && playerEP < currentCost) {
    addLogMessage(`⚠️ Energia insuficiente! O Ataque Especial requer ${currentCost} EP (você tem ${playerEP} EP).`, "log-system");
    return;
  }

  isTurnInProgress = true;
  enableAttackButtons(false);
  totalTurns++;

  // Destaque de ação ativa no lado do jogador (Melhoria 6)
  if (DOM.playerStatusCard) DOM.playerStatusCard.parentElement.classList.add("active-turn");
  if (DOM.enemyStatusCard) DOM.enemyStatusCard.parentElement.classList.remove("active-turn");

  // Processa início de turno de status (ex: congelado, paralisado, atordoado)
  const canAct = CombatSystem.checkCanAct("player");
  if (!canAct) {
    setTimeout(() => {
      endPlayerTurnPhase();
    }, 1000);
    return;
  }

  // Consumo / Ganho de EP
  if (attackType === "special") {
    playerEP = Math.max(0, playerEP - currentCost);
    updateEnergyBar("player", playerEP);
  } else if (attackType === "quick") {
    let gain = 30;
    if (currentArena.modifyEnergyGain) gain = currentArena.modifyEnergyGain(gain);
    if (activeBattleEvent && activeBattleEvent.modifyEnergyGain) gain = activeBattleEvent.modifyEnergyGain(gain);
    CombatSystem.gainEnergy("player", gain);
  } else if (attackType === "strong") {
    let gain = 15;
    if (currentArena.modifyEnergyGain) gain = currentArena.modifyEnergyGain(gain);
    if (activeBattleEvent && activeBattleEvent.modifyEnergyGain) gain = activeBattleEvent.modifyEnergyGain(gain);
    CombatSystem.gainEnergy("player", gain);
  }

  SoundFX.attack(attackType);
  DOM.turnIndicator.textContent = `${playerPokemon.name} atacando...`;

  // Animação visual específica de ataque (Melhorias 1 e 2)
  const animClass = attackType === "special" ? "anim-attack-special" : (attackType === "strong" ? "anim-attack-strong" : "anim-attack-quick");
  DOM.playerSprite.classList.add(animClass);

  setTimeout(() => {
    DOM.playerSprite.classList.remove(animClass);

    // Cálculo do Dano
    const damageCalc = calculateDamage("player", attackType);

    // Consumo do Poder Temporário (Melhoria 7)
    if (playerPowerBoostActive) {
      playerPowerBoostActive = false;
      if (DOM.badgePowerStatus) DOM.badgePowerStatus.textContent = "USADO";
      if (DOM.playerSpriteWrapper) DOM.playerSpriteWrapper.classList.remove("power-boost-active");
      addLogMessage("⚡ O poder temporário foi descarregado neste golpe!", "log-special");
    }

    // Aplica no adversário
    enemyHP = Math.max(0, enemyHP - damageCalc.finalDamage);
    SoundFX.hit();

    // Partículas de Impacto Elemental (Melhoria 2)
    spawnElementalHitBurst(DOM.enemyDamageContainer, playerPokemon.typeClass);

    // Efeito de impacto do Ataque Crítico (Melhoria 5)
    if (damageCalc.isCrit) {
      totalCritsAchieved++;
      SoundFX.crit();
      triggerCritImpact();
    }

    DOM.enemySprite.classList.add("anim-hit");
    setTimeout(() => DOM.enemySprite.classList.remove("anim-hit"), 450);

    showFloatingText(
      DOM.enemyDamageContainer,
      `-${damageCalc.finalDamage} HP`,
      damageCalc.isCrit ? "crit" : "normal"
    );

    updateHPBar("enemy", enemyHP, enemyMaxHP);

    let logMsg = `⚔️ ${playerPokemon.name} desferiu ${getAttackName(attackType)} e causou ${damageCalc.finalDamage} de dano!`;
    if (damageCalc.isCrit) logMsg += " 💥 Ataque crítico!";
    if (damageCalc.comboMultiplier > 1) logMsg += ` (Combo +${Math.round((damageCalc.comboMultiplier - 1) * 100)}%)`;
    addLogMessage(logMsg, "log-player");

    // Mensagens de Vantagem / Desvantagem Elemental (Melhoria 1)
    if (damageCalc.typeAdvantage === "super") {
      typeAdvantagesUsed++;
      addLogMessage("✨ É super eficaz! Vantagem elemental causou dano adicional!", "log-special");
      showFloatingText(DOM.enemyDamageContainer, "SUPER EFICAZ! ✨", "heal");
    } else if (damageCalc.typeAdvantage === "weak") {
      addLogMessage("🛡️ Não é muito eficaz... Desvantagem elemental causou dano reduzido.", "log-system");
    }

    // Mensagem destacada de Ataque Crítico (Melhoria 5)
    if (damageCalc.isCrit) {
      addLogMessage("💥 Ataque crítico!", "log-special");
    }

    // Habilidades Passivas
    if (playerPokemon.passiveId === "heal" && playerHP > 0 && playerHP < currentMaxHP) {
      CombatSystem.heal("player", 10, "🌿 Síntese do Venusaur");
    }

    // Gatilhos de Arena
    if (currentArena.onHit) {
      currentArena.onHit("player", "enemy", damageCalc.isCrit);
    }
    if (currentArena.onDamageDealt) {
      currentArena.onDamageDealt("player", damageCalc.finalDamage);
    }
    if (activeBattleEvent && activeBattleEvent.onDamageDealt) {
      activeBattleEvent.onDamageDealt("player", damageCalc.finalDamage);
    }

    // Avança Combo
    advancePlayerCombo();

    // Passiva do Pikachu: Segundo golpe surpresa
    if (playerPokemon.passiveId === "speed" && Math.random() < 0.35 && enemyHP > 0) {
      setTimeout(() => {
        const extraDmg = Math.floor(Math.random() * 8) + 8;
        enemyHP = Math.max(0, enemyHP - extraDmg);
        updateHPBar("enemy", enemyHP, enemyMaxHP);
        showFloatingText(DOM.enemyDamageContainer, `-${extraDmg} HP`, "normal");
        addLogMessage(`⚡ Agilidade do Pikachu! Desferiu um raio surpresa de ${extraDmg} de dano!`, "log-special");
      }, 450);
    }

    // Checa transição de fases do Chefe
    if (activeBossConfig) {
      checkBossPhaseTransition();
    }

    // Verifica se derrotou o inimigo
    if (enemyHP <= 0) {
      DOM.playerSprite.classList.add("anim-victory");
      DOM.enemySprite.classList.add("anim-defeat");
      setTimeout(() => endGame(true), 700);
      return;
    }

    endPlayerTurnPhase();

  }, 380);
}

function endPlayerTurnPhase() {
  // Processa efeitos de status de final de turno do Jogador
  CombatSystem.processTurnEndStatuses("player");

  if (playerHP <= 0) {
    DOM.playerSprite.classList.add("anim-defeat");
    DOM.enemySprite.classList.add("anim-victory");
    setTimeout(() => endGame(false), 600);
    return;
  }

  // Turno do Inimigo após pausa
  setTimeout(() => {
    triggerEnemyTurn();
  }, 900);
}

// ==========================================
// 18. IA ESTRATÉGICA DO CHEFE E TURNO ADVERSÁRIO (Melhorias 15 e 16)
// ==========================================
function decideBossAction() {
  const phaseCfg = activeBossConfig.phases[currentBossPhase - 1] || activeBossConfig.phases[0];
  const attacks = phaseCfg.attacks || [{ name: "Golpe Forte", type: "strong" }];

  const bossHpPct = (enemyHP / enemyMaxHP) * 100;
  const playerHpPct = (playerHP / currentMaxHP) * 100;

  // 1. Tática Defensiva/Recuperação: Se o Chefe estiver com HP crítico (<= 35%) e não usou a proteção
  if (bossHpPct <= 35 && !bossShieldUsed && Math.random() < 0.65) {
    bossShieldUsed = true;
    CombatSystem.applyStatus("enemy", "regen", 2);
    addLogMessage(`🛡️ ESTRATÉGIA DO CHEFE: ${activeBossConfig.name} percebeu seu HP baixo e ativou um Escudo de Regeneração Cósmica!`, "log-enemy");
    SoundFX.defend();
  }

  // 2. Reação ao Poder do Jogador: Se o jogador estiver com Poder Temporário ativo
  if (playerPowerBoostActive && Math.random() < 0.55) {
    addLogMessage(`⚠️ VISÃO TÁTICA: O Chefe notou seu Poder ativado e prepara um golpe veloz de contenção!`, "log-special");
    const quickAtk = attacks.find(a => a.type === "quick");
    if (quickAtk) return quickAtk.type;
  }

  // 3. Finalização: Se o Jogador estiver com pouco HP (<= 35%), priorizar ataque devastador
  if (playerHpPct <= 35) {
    const specialAtk = attacks.find(a => a.type === "special");
    const strongAtk = attacks.find(a => a.type === "strong");
    if (specialAtk && Math.random() < 0.65) {
      addLogMessage(`🔥 VISÃO TÁTICA: O Chefe identificou sua fraqueza e vai desferir um Ataque Especial!`, "log-enemy");
      return "special";
    }
    if (strongAtk) {
      addLogMessage(`💥 VISÃO TÁTICA: O Chefe concentrou energia para um Golpe Forte finalizador!`, "log-enemy");
      return "strong";
    }
  }

  // 4. Vantagem Elemental: Priorizar Ataque Especial se tiver vantagem
  const typeAdv = getTypeAdvantage(activeBossConfig.type, playerPokemon.type);
  if (typeAdv === "super" && Math.random() < 0.55) {
    const specialAtk = attacks.find(a => a.type === "special");
    if (specialAtk) {
      addLogMessage(`✨ ESTRATÉGIA: O Chefe aproveitou sua vantagem elemental para intensificar o golpe!`, "log-enemy");
      return "special";
    }
  }

  // 5. Variabilidade Orgânica (20% aleatório entre o rol de ataques)
  const chosen = attacks[Math.floor(Math.random() * attacks.length)];
  return chosen ? chosen.type : "strong";
}

function triggerEnemyTurn() {
  if (isBattleOver) return;

  DOM.turnIndicator.textContent = `Atenção! ${enemyPokemon.name} está agindo...`;
  DOM.turnIndicator.style.color = "#f87171";

  // Destaque de ação ativa no lado do adversário
  if (DOM.enemyStatusCard) DOM.enemyStatusCard.parentElement.classList.add("active-turn");
  if (DOM.playerStatusCard) DOM.playerStatusCard.parentElement.classList.remove("active-turn");

  // Verifica se o inimigo pode agir (congelado, atordoado, paralisado)
  const canAct = CombatSystem.checkCanAct("enemy");
  if (!canAct) {
    setTimeout(() => {
      endEnemyTurnPhase();
    }, 1000);
    return;
  }

  // Escolha do ataque do inimigo
  let enemyAttackType = "quick";
  if (activeBossConfig) {
    enemyAttackType = decideBossAction();
  } else {
    const r = Math.random();
    if (r > 0.65 && enemyEP >= 40) {
      enemyAttackType = "special";
      enemyEP = Math.max(0, enemyEP - 40);
    } else if (r > 0.35) {
      enemyAttackType = "strong";
      enemyEP = Math.min(MAX_EP, enemyEP + 15);
    } else {
      enemyAttackType = "quick";
      enemyEP = Math.min(MAX_EP, enemyEP + 25);
    }
    updateEnergyBar("enemy", enemyEP);
  }

  // Inicia QTE de Reação (Defesa ou Esquiva)
  startReactionQTE(enemyAttackType);
}

/**
 * Quick-Time-Event (QTE): Janela de 1.8s onde o jogador pode reagir
 */
function startReactionQTE(incomingAttackType) {
  isReactionActive = true;
  reactionResolved = false;
  currentIncomingEnemyAttack = incomingAttackType || "quick";

  DOM.reactionOverlay.classList.remove("hidden");
  DOM.reactionTitle.textContent = `⚠️ ${enemyPokemon.name} vai usar ${getAttackName(currentIncomingEnemyAttack)}! REAGIR:`;
  DOM.reactionTimerBar.style.width = "100%";

  const durationMs = 1800;
  const startTime = Date.now();

  if (reactionTimerId) clearInterval(reactionTimerId);

  reactionTimerId = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, durationMs - elapsed);
    const pct = (remaining / durationMs) * 100;
    DOM.reactionTimerBar.style.width = `${pct}%`;

    if (remaining <= 0) {
      clearInterval(reactionTimerId);
      if (!reactionResolved) {
        resolveReaction("none", currentIncomingEnemyAttack);
      }
    }
  }, 30);
}

function resolveReaction(action, attackType) {
  if (reactionResolved) return;
  reactionResolved = true;
  isReactionActive = false;
  if (reactionTimerId) clearInterval(reactionTimerId);

  const resolvedAttackType = (attackType && attackType !== "incoming")
    ? attackType
    : (currentIncomingEnemyAttack || "quick");

  DOM.reactionOverlay.classList.add("hidden");

  // Animação de investida do inimigo conforme tipo de golpe
  const animClass = resolvedAttackType === "special" ? "anim-attack-special" : (resolvedAttackType === "strong" ? "anim-attack-strong" : "anim-attack-quick");
  DOM.enemySprite.classList.add(animClass);
  SoundFX.attack(resolvedAttackType);

  setTimeout(() => {
    DOM.enemySprite.classList.remove(animClass);

    let rawDamageResult = calculateDamage("enemy", resolvedAttackType);
    let finalDamage = rawDamageResult.finalDamage;

    // 6. Escudo de Proteção do Jogador (Melhoria 6)
    if (playerShieldActive && finalDamage > 0) {
      finalDamage = Math.max(1, Math.round(finalDamage * 0.50));
      playerShieldActive = false;
      if (DOM.badgeShieldStatus) DOM.badgeShieldStatus.textContent = "USADO";
      if (DOM.playerSpriteWrapper) DOM.playerSpriteWrapper.classList.remove("shield-active");
      addLogMessage("🛡️ O escudo de proteção absorveu o impacto e reduziu o dano sofrido!", "log-special");
      showFloatingText(DOM.playerDamageContainer, "ESCUDO ABSORVEU!", "crit");
    }

    if (action === "dodge") {
      // Esquiva Perfeita: 0 Dano + Gera Energia + Bônus de Combo!
      finalDamage = 0;
      SoundFX.dodge();
      showFloatingText(DOM.playerDamageContainer, "ESQUIVA PERFEITA! 💨", "heal");
      addLogMessage(`💨 ESQUIVA PERFEITA! Você desviou do ataque de ${enemyPokemon.name} e contra-atacou o ritmo!`, "log-special");
      CombatSystem.gainEnergy("player", 15);
      advancePlayerCombo();

    } else if (action === "defend") {
      // Defesa: Reduz 65% do dano + Gera +20 EP
      finalDamage = Math.max(1, Math.round(finalDamage * 0.35));
      SoundFX.defend();
      showFloatingText(DOM.playerDamageContainer, `🛡️ BLOQUEADO (-${finalDamage})`, "crit");
      addLogMessage(`🛡️ POSTURA DEFENSIVA! Dano absorvido e reduzido para ${finalDamage}! Ganhou +20 EP.`, "log-special");
      CombatSystem.gainEnergy("player", 20);

      // Aplica dano reduzido
      playerHP = Math.max(0, playerHP - finalDamage);
      updateHPBar("player", playerHP, currentMaxHP);

    } else {
      // Falha / Sem Reação: Sofre dano completo e quebra combo
      SoundFX.hit();

      // Partícula de impacto elemental no jogador
      spawnElementalHitBurst(DOM.playerDamageContainer, enemyPokemon.typeClass);

      // Efeito de impacto de ataque crítico (Melhoria 5)
      if (rawDamageResult.isCrit) {
        SoundFX.crit();
        triggerCritImpact();
      }

      playerHP = Math.max(0, playerHP - finalDamage);
      updateHPBar("player", playerHP, currentMaxHP);

      DOM.playerSprite.classList.add("anim-hit");
      setTimeout(() => DOM.playerSprite.classList.remove("anim-hit"), 450);

      showFloatingText(DOM.playerDamageContainer, `-${finalDamage} HP`, rawDamageResult.isCrit ? "crit" : "normal");
      
      let enemyLogMsg = `💥 ${enemyPokemon.name} acertou em cheio com ${getAttackName(resolvedAttackType)} causando ${finalDamage} de dano!`;
      if (rawDamageResult.isCrit) enemyLogMsg += " 💥 Ataque crítico!";
      addLogMessage(enemyLogMsg, "log-enemy");

      // Vantagem de tipo do golpe adversário (Melhoria 1)
      if (rawDamageResult.typeAdvantage === "super") {
        addLogMessage("⚠️ O ataque do adversário é super eficaz!", "log-enemy");
      } else if (rawDamageResult.typeAdvantage === "weak") {
        addLogMessage("🛡️ O ataque do adversário não é muito eficaz contra seu tipo.", "log-special");
      }

      if (rawDamageResult.isCrit) {
        addLogMessage("💥 Ataque crítico do adversário!", "log-enemy");
      }

      resetPlayerCombo();
    }

    // Gatilhos de Arena para o golpe inimigo
    if (finalDamage > 0) {
      if (currentArena && currentArena.onHit) currentArena.onHit("enemy", "player", rawDamageResult.isCrit);
      if (currentArena && currentArena.onDamageDealt) currentArena.onDamageDealt("enemy", finalDamage);
    }

    // Checa se o jogador caiu
    if (playerHP <= 0) {
      DOM.playerSprite.classList.add("anim-defeat");
      DOM.enemySprite.classList.add("anim-victory");
      setTimeout(() => endGame(false), 700);
      return;
    }

    endEnemyTurnPhase();

  }, 380);
}

function endEnemyTurnPhase() {
  try {
    // Processa status de fim de turno do inimigo
    CombatSystem.processTurnEndStatuses("enemy");

    if (enemyHP <= 0) {
      DOM.playerSprite.classList.add("anim-victory");
      DOM.enemySprite.classList.add("anim-defeat");
      setTimeout(() => endGame(true), 600);
      return;
    }

    // Efeito de Arena por turno (ex: cura da floresta)
    if (currentArena && currentArena.onTurnStart) {
      currentArena.onTurnStart();
    }

    // Verifica e processa Evento de Batalha
    checkAndAdvanceBattleEvents();
  } catch (err) {
    console.error("Erro durante o encerramento do turno do adversário:", err);
  } finally {
    // Devolve o turno ao jogador garantindo fluxo ininterrupto e justo
    if (!isBattleOver && playerHP > 0 && enemyHP > 0) {
      isTurnInProgress = false;
      enableAttackButtons(true);
      DOM.turnIndicator.textContent = "Sua Vez de Atacar!";
      DOM.turnIndicator.style.color = "#38bdf8";
      if (DOM.enemyStatusCard) DOM.enemyStatusCard.parentElement.classList.remove("active-turn");
      if (DOM.playerStatusCard) DOM.playerStatusCard.parentElement.classList.add("active-turn");
    }
  }
}

// ==========================================
// 19. CÁLCULO GERAL DE DANO & MULTIPLICADORES
// ==========================================
function calculateDamage(attackerSide, attackType) {
  const attacker = attackerSide === "player" ? playerPokemon : enemyPokemon;
  const defender = attackerSide === "player" ? enemyPokemon : playerPokemon;

  let base = 0;
  if (attackType === "quick") base = Math.floor(Math.random() * 8) + 14;   // 14 a 21
  else if (attackType === "strong") base = Math.floor(Math.random() * 12) + 22; // 22 a 33
  else if (attackType === "special") base = Math.floor(Math.random() * 15) + 36; // 36 a 50

  // Passivas do Pokémon
  if (attacker.passiveId === "power") base = Math.round(base * 1.15);
  if (attacker.passiveId === "balanced") {
    if (attackType === "quick") base = Math.max(18, base);
    if (attackType === "strong") base = Math.max(26, base);
    if (attackType === "special") base = Math.max(40, base);
  }
  if (attacker.passiveId === "fast" && attackType === "quick") base = Math.round(base * 1.25);
  if (attacker.passiveId === "special" && attackType === "special") base = Math.round(base * 1.30);
  if (defender.passiveId === "defense") base = Math.round(base * 0.80);

  // Modificadores de Arena
  if (currentArena.modifyDamage) {
    base = currentArena.modifyDamage(attacker, defender, base);
  }

  // Modificador de Clima (Requisito 9)
  if (currentWeather && currentWeather.modifyDamage) {
    base = currentWeather.modifyDamage(attacker, defender, base);
  }

  // Modificadores de Eventos da Batalha
  if (activeBattleEvent && activeBattleEvent.onModifyDamage) {
    base = activeBattleEvent.onModifyDamage(base);
  }

  // 1. Vantagem entre os tipos (Melhoria 1)
  const typeAdv = getTypeAdvantage(attacker.type, defender.type);
  if (typeAdv === "super") {
    base = Math.round(base * 1.30); // Dano adicional
  } else if (typeAdv === "weak") {
    base = Math.round(base * 0.75); // Dano reduzido por desvantagem
  }

  // 3. Nível de Dificuldade (Melhoria 3)
  // Afeta exclusivamente o dano causado pelo adversário
  if (attackerSide === "enemy") {
    if (currentDifficulty === "easy") {
      base = Math.round(base * 0.70); // Menos dano no Fácil
    } else if (currentDifficulty === "hard") {
      base = Math.round(base * 1.35); // Mais dano no Difícil
    }
  }

  // 7. Poder Temporário do Jogador (Melhoria 7)
  if (attackerSide === "player" && playerPowerBoostActive) {
    base = Math.round(base * 1.50); // +50% de dano no próximo ataque
  }

  // Modificador de Status: Queimado causa -15%
  const statuses = attackerSide === "player" ? playerStatuses : enemyStatuses;
  if (statuses.burn) {
    base = Math.round(base * 0.85);
  }

  // Combo do Jogador
  let comboMult = 1.0;
  let guaranteedCrit = false;
  if (attackerSide === "player") {
    if (playerCombo === 2) comboMult = 1.10;
    else if (playerCombo === 3) comboMult = 1.25;
    else if (playerCombo === 4) comboMult = 1.40;
    else if (playerCombo >= 5) {
      comboMult = 1.60;
      guaranteedCrit = true;
    }
  }

  base = Math.round(base * comboMult);

  // Chance de Crítico (Melhoria 5 & Modo Treino)
  let isCrit = guaranteedCrit;
  if (attackerSide === "player" && nextAttackForcedCrit) {
    isCrit = true;
    nextAttackForcedCrit = false;
  }

  if (!isCrit) {
    let critRate = attacker.passiveId === "crit" ? 0.35 : 0.15;
    if (currentWeather && currentWeather.id === "storm") critRate += 0.15;
    if (currentArena.modifyCritChance) critRate = currentArena.modifyCritChance(critRate);
    if (activeBattleEvent && activeBattleEvent.modifyCritChance) critRate += activeBattleEvent.modifyCritChance;
    if (attackerSide === "player" && playerCombo >= 4) critRate += 0.20;

    if (Math.random() < critRate) {
      isCrit = true;
    }
  }

  if (isCrit) {
    base = Math.round(base * 1.7);
  }

  return {
    finalDamage: Math.max(1, base),
    isCrit,
    comboMultiplier: comboMult,
    typeAdvantage: typeAdv
  };
}

// ==========================================
// 20. SISTEMA DE REGRAS E EVENTOS ALEATÓRIOS
// ==========================================
function checkAndAdvanceBattleEvents() {
  if (activeBattleEvent) {
    activeEventTurnsLeft--;
    if (activeBattleEvent.onTurnEnd) activeBattleEvent.onTurnEnd();

    if (activeEventTurnsLeft <= 0) {
      addLogMessage(`⌛ O evento ${activeBattleEvent.name} chegou ao fim. As regras normais foram restauradas.`, "log-system");
      activeBattleEvent = null;
      DOM.surpriseBadge.classList.add("hidden");
      DOM.activeRulePill.classList.add("hidden");
    } else {
      DOM.surpriseBadge.classList.remove("hidden");
      DOM.surpriseText.textContent = `${activeBattleEvent.name} (${activeEventTurnsLeft}T)`;
    }
    return;
  }

  // Chance de 25% de disparar um novo evento se nenhum estiver ativo
  if (Math.random() < 0.25 && !isBattleOver) {
    const event = BATTLE_EVENTS_CONFIG[Math.floor(Math.random() * BATTLE_EVENTS_CONFIG.length)];
    activeBattleEvent = event;
    activeEventTurnsLeft = event.durationTurns;

    DOM.surpriseBadge.classList.remove("hidden");
    DOM.surpriseText.textContent = `${event.name} (${activeEventTurnsLeft}T)`;
    DOM.activeRulePill.classList.remove("hidden");
    DOM.activeRulePill.textContent = event.name;

    addLogMessage(`🎲 EVENTO DINÂMICO ATIVADO: ${event.name}! ${event.description}`, "log-special");
    if (typeof SoundFX.special === "function") {
      SoundFX.special();
    }
  }
}

// ==========================================
// 21. GERENCIAMENTO DE STATUS (COMBAT SYSTEM)
// ==========================================
const CombatSystem = {
  applyStatus(side, statusId, duration) {
    const targetMap = side === "player" ? playerStatuses : enemyStatuses;
    targetMap[statusId] = Math.max(targetMap[statusId] || 0, duration);

    const cfg = STATUS_CONFIG[statusId];
    const targetName = side === "player"
      ? (playerPokemon ? playerPokemon.name : "Seu Pokémon")
      : (enemyPokemon ? enemyPokemon.name : "Adversário");
    addLogMessage(`${cfg.icon} ${targetName} agora está sob o efeito de ${cfg.name}!`, "log-special");
    SoundFX.statusTick();

    renderStatusEffects();
  },

  checkCanAct(side) {
    const targetMap = side === "player" ? playerStatuses : enemyStatuses;
    // Checa congelamento
    if (targetMap.freeze) {
      targetMap.freeze--;
      if (targetMap.freeze <= 0) delete targetMap.freeze;
      renderStatusEffects();
      return STATUS_CONFIG.freeze.checkCanAct(side);
    }
    // Checa atordoamento
    if (targetMap.stun) {
      delete targetMap.stun;
      renderStatusEffects();
      return STATUS_CONFIG.stun.checkCanAct(side);
    }
    // Checa paralisia
    if (targetMap.paralysis) {
      return STATUS_CONFIG.paralysis.checkCanAct(side);
    }
    return true;
  },

  processTurnEndStatuses(side) {
    const targetMap = side === "player" ? playerStatuses : enemyStatuses;
    for (const [key, turns] of Object.entries(targetMap)) {
      const cfg = STATUS_CONFIG[key];
      if (cfg && cfg.onTurnEnd) {
        cfg.onTurnEnd(side);
      }
      targetMap[key] = turns - 1;
      if (targetMap[key] <= 0) {
        delete targetMap[key];
      }
    }
    renderStatusEffects();
  },

  takeStatusDamage(side, amount, sourceName) {
    const name = side === "player"
      ? (playerPokemon ? playerPokemon.name : "Seu Pokémon")
      : (enemyPokemon ? enemyPokemon.name : "O adversário");

    if (side === "player") {
      playerHP = Math.max(0, playerHP - amount);
      updateHPBar("player", playerHP, currentMaxHP);
      showFloatingText(DOM.playerDamageContainer, `-${amount} HP`, "crit");
      addLogMessage(`⚠️ ${name} sofreu ${amount} de dano por ${sourceName}!`, "log-enemy");
    } else {
      enemyHP = Math.max(0, enemyHP - amount);
      updateHPBar("enemy", enemyHP, enemyMaxHP);
      showFloatingText(DOM.enemyDamageContainer, `-${amount} HP`, "crit");
      addLogMessage(`💥 ${name} sofreu ${amount} de dano por ${sourceName}!`, "log-player");
    }
  },

  heal(side, amount, sourceName = "Cura") {
    const name = side === "player"
      ? (playerPokemon ? playerPokemon.name : "Seu Pokémon")
      : (enemyPokemon ? enemyPokemon.name : "O adversário");

    if (side === "player") {
      playerHP = Math.min(currentMaxHP, playerHP + amount);
      updateHPBar("player", playerHP, currentMaxHP);
      showFloatingText(DOM.playerDamageContainer, `+${amount} HP`, "heal");
      addLogMessage(`🌿 ${name} recuperou +${amount} HP via ${sourceName}!`, "log-special");
    } else {
      enemyHP = Math.min(enemyMaxHP, enemyHP + amount);
      updateHPBar("enemy", enemyHP, enemyMaxHP);
      showFloatingText(DOM.enemyDamageContainer, `+${amount} HP`, "heal");
    }
  },

  gainEnergy(side, amount) {
    if (side === "player") {
      playerEP = Math.min(MAX_EP, playerEP + amount);
      updateEnergyBar("player", playerEP);
    } else {
      enemyEP = Math.min(MAX_EP, enemyEP + amount);
      updateEnergyBar("enemy", enemyEP);
    }
  }
};

function renderStatusEffects() {
  // Jogador
  DOM.playerStatusEffects.innerHTML = "";
  for (const [key, turns] of Object.entries(playerStatuses)) {
    const cfg = STATUS_CONFIG[key];
    if (cfg) {
      const pill = document.createElement("span");
      pill.className = `status-pill ${cfg.cssClass}`;
      pill.innerHTML = `${cfg.icon} ${cfg.name} (${turns})`;
      DOM.playerStatusEffects.appendChild(pill);
    }
  }

  // Adversário
  DOM.enemyStatusEffects.innerHTML = "";
  for (const [key, turns] of Object.entries(enemyStatuses)) {
    const cfg = STATUS_CONFIG[key];
    if (cfg) {
      const pill = document.createElement("span");
      pill.className = `status-pill ${cfg.cssClass}`;
      pill.innerHTML = `${cfg.icon} ${cfg.name} (${turns})`;
      DOM.enemyStatusEffects.appendChild(pill);
    }
  }
}

// ==========================================
// 22. SISTEMA DE FASES DO CHEFE
// ==========================================
function checkBossPhaseTransition() {
  if (!activeBossConfig) return;

  const currentHpPct = (enemyHP / enemyMaxHP) * 100;
  const phases = activeBossConfig.phases;

  for (let i = phases.length - 1; i >= 1; i--) {
    const phaseCfg = phases[i];
    if (phaseCfg.triggerHpPercent !== undefined && currentHpPct <= phaseCfg.triggerHpPercent && currentBossPhase < phaseCfg.phase) {
      triggerBossPhaseShift(phaseCfg);
      break;
    }
  }
}

function triggerBossPhaseShift(newPhaseCfg) {
  currentBossPhase = newPhaseCfg.phase;

  SoundFX.phaseShift();

  DOM.bossPhaseText.textContent = `CHEFE: FASE ${currentBossPhase} / ${activeBossConfig.phases.length}`;
  DOM.phaseAlert.classList.remove("hidden");
  DOM.phaseAlertMsg.textContent = `⚠️ TRANSFORMAÇÃO! ${activeBossConfig.name.toUpperCase()} ENTROU NA ${newPhaseCfg.title.toUpperCase()}!`;

  setTimeout(() => {
    DOM.phaseAlert.classList.add("hidden");
  }, 4000);

  // Altera Arena se o chefe mudar o ambiente
  if (newPhaseCfg.arena) {
    updateArenaTheme(newPhaseCfg.arena);
    addLogMessage(`🌋 A arena tremeu violentamente e foi transformada em ${currentArena.name}!`, "log-special");
  }

  // Aplica Escudo bônus
  if (newPhaseCfg.bonusShield) {
    enemyHP = Math.min(enemyMaxHP, enemyHP + newPhaseCfg.bonusShield);
    updateHPBar("enemy", enemyHP, enemyMaxHP);
    showFloatingText(DOM.enemyDamageContainer, `+${newPhaseCfg.bonusShield} ESCUDO`, "heal");
    addLogMessage(`🛡️ Uma barreira protetora envolve o chefe, garantindo +${newPhaseCfg.bonusShield} de resistência!`, "log-enemy");
  }

  if (newPhaseCfg.dialogue) {
    addLogMessage(`👑 "${newPhaseCfg.dialogue}"`, "log-special");
  }
}

// ==========================================
// 23. MODO AVENTURA: CAMPANHA DE 6 ÁREAS (Requisitos 18 a 30)
// ==========================================
function startAdventureMode(selectedHero) {
  AdventureState.currentAreaIdx = 0;
  AdventureState.currentFloorIdx = 0;
  AdventureState.checkpointAreaIdx = 0;
  AdventureState.gold = 60;
  AdventureState.heroMaxHp = selectedHero.baseMaxHp || 100;
  AdventureState.heroHp = AdventureState.heroMaxHp;
  AdventureState.startEnergy = 30;
  AdventureState.items = { potion: 2, elixir: 1, antidote: 1 };

  playerPokemon = selectedHero;

  loadAdventureArea(0);
  showScreen("adventure");
}

function loadAdventureArea(areaIdx) {
  AdventureState.currentAreaIdx = areaIdx;
  AdventureState.currentFloorIdx = 0;
  const areaData = ADVENTURE_ARENAS[areaIdx];

  // Atualiza Checkpoint e Narrativa
  AdventureState.checkpointAreaIdx = areaIdx;
  if (DOM.advCheckpointTag) DOM.advCheckpointTag.textContent = areaData.checkpointName;
  if (DOM.narrativeTitle) DOM.narrativeTitle.textContent = `Jornada do Campeão: ${areaData.name}`;
  if (DOM.narrativeText) DOM.narrativeText.textContent = areaData.narrative;

  // Atualiza a barra visual das 6 áreas
  updateAdventureAreasBar();

  // Gera os nós da área atual
  generateAdventureAreaNodes(areaData);
  updateAdventureHUD();
  renderAdventureMapTree();
}

function updateAdventureAreasBar() {
  if (!DOM.adventureAreasBar) return;
  const areaNodes = DOM.adventureAreasBar.querySelectorAll(".campaign-area-node");
  areaNodes.forEach((nodeEl, idx) => {
    nodeEl.classList.remove("current", "completed", "locked");
    const statusSpan = nodeEl.querySelector(".area-node-status");
    if (idx < AdventureState.currentAreaIdx) {
      nodeEl.classList.add("completed");
      if (statusSpan) statusSpan.textContent = "✓ Concluído";
    } else if (idx === AdventureState.currentAreaIdx) {
      nodeEl.classList.add("current");
      if (statusSpan) statusSpan.textContent = "● Atual";
    } else {
      nodeEl.classList.add("locked");
      if (statusSpan) statusSpan.textContent = "🔒 Bloqueado";
    }
  });
}

function generateAdventureAreaNodes(areaData) {
  AdventureState.mapNodes = areaData.floors.map((fl, idx) => {
    return {
      floor: idx + 1,
      nodes: [
        {
          id: fl.id,
          type: fl.type,
          name: fl.name,
          icon: fl.icon,
          desc: fl.desc,
          status: idx === 0 ? "available" : "locked"
        }
      ]
    };
  });
}

function renderAdventureMapTree() {
  DOM.adventureMapTree.innerHTML = "";

  AdventureState.mapNodes.forEach(stage => {
    const row = document.createElement("div");
    row.className = "map-stage-row";

    stage.nodes.forEach(node => {
      const nodeEl = document.createElement("div");
      const isBossNode = node.type === "boss" || node.type === "boss_final";
      nodeEl.className = `map-node ${node.status} ${isBossNode ? "node-boss" : ""}`;
      nodeEl.dataset.id = node.id;

      nodeEl.innerHTML = `
        <div class="node-icon-box">${node.icon}</div>
        <div class="node-info">
          <span class="node-name">${node.name}</span>
          <span class="node-type-label">${node.desc}</span>
        </div>
      `;

      if (node.status === "available") {
        nodeEl.addEventListener("click", () => {
          handleSelectAdventureNode(node);
        });
      }

      row.appendChild(nodeEl);
    });

    DOM.adventureMapTree.appendChild(row);
  });
}

function handleSelectAdventureNode(node) {
  AdventureState.currentNodeId = node.id;
  const currentArea = ADVENTURE_ARENAS[AdventureState.currentAreaIdx];

  if (node.type === "battle" || node.type === "elite") {
    // Escolhe adversário
    const pool = POKEMON_DATA.filter(p => p.id !== playerPokemon.id);
    enemyPokemon = pool[Math.floor(Math.random() * pool.length)];
    activeBossConfig = null;
    updateArenaTheme(currentArea.arenaKey);
    setBattleWeather("random");
    initBattleCombatants(playerPokemon, enemyPokemon, false);

  } else if (node.type === "boss") {
    // Chefe Guardião da Área
    const bossPokemon = {
      id: `area_boss_${currentArea.area}`,
      name: currentArea.bossName,
      roleName: `GUARDIÃO DA ${currentArea.name.toUpperCase()}`,
      type: currentArea.bossType,
      typeClass: "type-fogo",
      badgeIcon: "👑",
      characteristic: `O poderoso guardião elemental da ${currentArea.name}!`,
      description: "Possui HP aumentado, dano estratégico e visão tática.",
      baseMaxHp: 160 + (AdventureState.currentAreaIdx * 20),
      maxHp: 160 + (AdventureState.currentAreaIdx * 20),
      image: currentArea.bossImg,
      stats: { atk: 85, def: 80, spd: 75, hp: 160 }
    };
    activeBossConfig = null;
    updateArenaTheme(currentArea.arenaKey);
    setBattleWeather("storm");
    initBattleCombatants(playerPokemon, bossPokemon, false);

  } else if (node.type === "boss_final") {
    // Grande Chefe Final da Aventura (Mewtwo Supremo)
    startBossChallenge(playerPokemon);

  } else if (node.type === "shop") {
    openShopModal();

  } else if (node.type === "mystery" || node.type === "event") {
    openMysteryEventModal();

  } else if (node.type === "rest") {
    openRestModal();
  }
}

function advanceAdventureStage() {
  const currentArea = ADVENTURE_ARENAS[AdventureState.currentAreaIdx];
  const currentFloorIdx = AdventureState.currentFloorIdx;
  const currentFloor = AdventureState.mapNodes[currentFloorIdx];

  if (currentFloor) {
    const node = currentFloor.nodes.find(n => n.id === AdventureState.currentNodeId);
    if (node) node.status = "completed";
  }

  AdventureState.currentFloorIdx++;

  if (AdventureState.currentFloorIdx >= AdventureState.mapNodes.length) {
    // Área Concluída com Sucesso!
    if (AdventureState.currentAreaIdx + 1 >= ADVENTURE_ARENAS.length) {
      // Vitória Épica de Toda a Campanha (Requisito 30)
      openAdventureVictoryModal();
      return;
    } else {
      // Avança para a próxima Área Temática
      alert(`🎉 PARABÉNS! Você conquistou a ${currentArea.name}!\nPróximo destino: ${ADVENTURE_ARENAS[AdventureState.currentAreaIdx + 1].name}!`);
      loadAdventureArea(AdventureState.currentAreaIdx + 1);
      showScreen("adventure");
      return;
    }
  }

  // Libera os nós do próximo andar da mesma área
  const nextFloor = AdventureState.mapNodes[AdventureState.currentFloorIdx];
  if (nextFloor) {
    nextFloor.nodes.forEach(n => n.status = "available");
  }

  updateAdventureHUD();
  renderAdventureMapTree();
  showScreen("adventure");
}

function updateAdventureHUD() {
  if (playerPokemon) {
    DOM.advHeroImg.src = playerPokemon.image;
    DOM.advHeroName.textContent = playerPokemon.name;
  }
  DOM.advHeroHp.textContent = `HP: ${AdventureState.heroHp} / ${AdventureState.heroMaxHp}`;
  DOM.advStageText.textContent = `${AdventureState.currentAreaIdx + 1} / ${ADVENTURE_ARENAS.length} (Área ${AdventureState.currentAreaIdx + 1})`;
  DOM.advGoldText.textContent = `🪙 ${AdventureState.gold}`;

  const bagCount = (AdventureState.items.potion || 0) + (AdventureState.items.elixir || 0) + (AdventureState.items.antidote || 0);
  DOM.advBagTotalCount.textContent = bagCount;
}

function updateItemsUI() {
  DOM.itemCountPotion.textContent = AdventureState.items.potion || 0;
  DOM.itemCountElixir.textContent = AdventureState.items.elixir || 0;
  DOM.itemCountAntidote.textContent = AdventureState.items.antidote || 0;

  DOM.btnUsePotion.disabled = (AdventureState.items.potion <= 0);
  DOM.btnUseElixir.disabled = (AdventureState.items.elixir <= 0);
  DOM.btnUseAntidote.disabled = (AdventureState.items.antidote <= 0);
}

// ==========================================
// 24. MODAL: LOJA POKÉMART
// ==========================================
function openShopModal() {
  DOM.shopCurrentGold.textContent = `🪙 ${AdventureState.gold}`;
  DOM.shopItemsGrid.innerHTML = "";

  Object.values(ITEMS_DATA).forEach(item => {
    const card = document.createElement("div");
    card.className = "shop-item-card";

    card.innerHTML = `
      <div class="shop-item-header">
        <span class="shop-item-icon">${item.icon}</span>
        <div>
          <h4 class="shop-item-title">${item.name}</h4>
          <p class="shop-item-desc">${item.description}</p>
        </div>
      </div>
      <div class="shop-item-footer">
        <span class="shop-item-price">🪙 ${item.price} Moedas</span>
        <button class="btn-buy-item" data-id="${item.id}" ${AdventureState.gold < item.price ? "disabled" : ""}>
          Comprar
        </button>
      </div>
    `;

    const buyBtn = card.querySelector(".btn-buy-item");
    buyBtn.addEventListener("click", () => {
      if (AdventureState.gold >= item.price) {
        AdventureState.gold -= item.price;
        AdventureState.items[item.id] = (AdventureState.items[item.id] || 0) + 1;
        SoundFX.coin();
        openShopModal();
        updateAdventureHUD();
      }
    });

    DOM.shopItemsGrid.appendChild(card);
  });

  DOM.shopModal.classList.remove("hidden");
  DOM.shopModal.style.display = "flex";
}

// ==========================================
// 25. MODAL: ENCONTRO MISTERIOSO / ESCOLHA (Requisito 22 e 23)
// ==========================================
function openMysteryEventModal() {
  DOM.eventChoicesList.innerHTML = "";

  const events = [
    {
      title: "Fonte Ancestral da Região",
      icon: "🌊",
      desc: "Uma fonte límpida e brilhante oferece águas cristalinas ao seu Pokémon.",
      choices: [
        {
          text: "Beber da Fonte (Recuperar +45 HP)",
          action: () => {
            AdventureState.heroHp = Math.min(AdventureState.heroMaxHp, AdventureState.heroHp + 45);
            SoundFX.heal();
            alert("✨ Seu Pokémon bebeu da fonte sagrada e recuperou +45 HP!");
            DOM.eventModal.classList.add("hidden");
            DOM.eventModal.style.display = "none";
            advanceAdventureStage();
          }
        },
        {
          text: "Coletar Água Energética (+1 Elixir)",
          action: () => {
            AdventureState.items.elixir = (AdventureState.items.elixir || 0) + 1;
            SoundFX.coin();
            alert("⚡ Você encheu um frasco com água energética (+1 Elixir de EP)!");
            DOM.eventModal.classList.add("hidden");
            DOM.eventModal.style.display = "none";
            advanceAdventureStage();
          }
        }
      ]
    },
    {
      title: "O Viajante das Chamas",
      icon: "🧙‍♂️",
      desc: "Um sábio treinador oferece conselhos táticos ou uma bolsa de moedas.",
      choices: [
        {
          text: "Aceitar a Bolsa de Moedas (+40 Moedas)",
          action: () => {
            AdventureState.gold += 40;
            SoundFX.coin();
            alert("🪙 O sábio te presenteou com +40 Poké-Moedas!");
            DOM.eventModal.classList.add("hidden");
            DOM.eventModal.style.display = "none";
            advanceAdventureStage();
          }
        },
        {
          text: "Treinar Postura de Combate (Comece com 50 EP)",
          action: () => {
            AdventureState.startEnergy = 50;
            SoundFX.special();
            alert("⚡ O sábio aprimorou seu foco! Próximas batalhas começam com 50 EP!");
            DOM.eventModal.classList.add("hidden");
            DOM.eventModal.style.display = "none";
            advanceAdventureStage();
          }
        }
      ]
    }
  ];

  const ev = events[Math.floor(Math.random() * events.length)];
  DOM.eventModalTitle.textContent = ev.title;
  DOM.eventModalIcon.textContent = ev.icon;
  DOM.eventModalDesc.textContent = ev.desc;

  ev.choices.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "event-choice-btn";
    btn.innerHTML = `<strong>${c.text}</strong>`;
    btn.addEventListener("click", c.action);
    DOM.eventChoicesList.appendChild(btn);
  });

  DOM.eventModal.classList.remove("hidden");
  DOM.eventModal.style.display = "flex";
}

// ==========================================
// 26. MODAL: FOGUEIRA DE DESCANSO
// ==========================================
function openRestModal() {
  DOM.restModal.classList.remove("hidden");
  DOM.restModal.style.display = "flex";
}

// ==========================================
// 27. MODAL DE REPLAY (Requisito 11)
// ==========================================
function openReplayModal() {
  renderReplayTimeline();
  DOM.replayModal.classList.remove("hidden");
  DOM.replayModal.style.display = "flex";
}

function closeReplayModal() {
  DOM.replayModal.classList.add("hidden");
  DOM.replayModal.style.display = "none";
}

function renderReplayTimeline() {
  if (!DOM.replayTimeline) return;
  DOM.replayTimeline.innerHTML = "";

  if (battleReplayLog.length === 0) {
    DOM.replayTimeline.innerHTML = "<p style='color: var(--text-muted); text-align: center; padding: 20px;'>Nenhum momento gravado nesta batalha.</p>";
    return;
  }

  battleReplayLog.forEach((step, index) => {
    const card = document.createElement("div");
    card.className = `replay-step-card step-${step.type || "normal"}`;

    card.innerHTML = `
      <span class="replay-step-icon">${step.icon || "⚡"}</span>
      <div class="replay-step-details">
        <span class="replay-step-title">${index + 1}. ${step.title} <small style="color: var(--text-muted); font-size: 0.7rem;">[${step.time}]</small></span>
        <span class="replay-step-desc">${step.desc}</span>
      </div>
    `;

    DOM.replayTimeline.appendChild(card);
  });
}

// ==========================================
// 28. MODAL DE VITÓRIA DA AVENTURA (Requisito 30)
// ==========================================
function openAdventureVictoryModal() {
  hideAllModals();
  SoundFX.victory();

  if (DOM.advVictoryHeroImg) DOM.advVictoryHeroImg.src = playerPokemon.image;
  if (DOM.advVictoryHeroName) DOM.advVictoryHeroName.textContent = playerPokemon.name;
  if (DOM.advVictoryScore) DOM.advVictoryScore.textContent = `${calculateBattleScore(true).score + 2500} pts`;

  DOM.adventureVictoryModal.classList.remove("hidden");
  DOM.adventureVictoryModal.style.display = "flex";
}

function closeAdventureVictoryModal() {
  DOM.adventureVictoryModal.classList.add("hidden");
  DOM.adventureVictoryModal.style.display = "none";
}

// ==========================================
// 29. FINAL DA BATALHA, PONTUAÇÃO E REINÍCIO
// ==========================================
function calculateBattleScore(isVictory) {
  let score = isVictory ? 500 : 100;

  const hpBonus = Math.round((Math.max(0, playerHP) / currentMaxHP) * 350);
  score += hpBonus;
  score += totalCritsAchieved * 120;
  score += typeAdvantagesUsed * 150;
  score += maxComboStreak * 100;

  let diffMult = 1.0;
  if (currentDifficulty === "easy") diffMult = 0.8;
  else if (currentDifficulty === "hard") diffMult = 1.4;
  if (activeBossConfig) diffMult *= 1.5;

  score = Math.round(score * diffMult);

  let stars = "⭐⭐⭐";
  let rank = "RANK B";

  if (score >= 1350) {
    stars = "⭐⭐⭐⭐⭐";
    rank = "RANK S (MESTRE)";
  } else if (score >= 950) {
    stars = "⭐⭐⭐⭐";
    rank = "RANK A (EXCELENTE)";
  } else if (score >= 650) {
    stars = "⭐⭐⭐";
    rank = "RANK B (BOM)";
  } else if (score >= 350) {
    stars = "⭐⭐";
    rank = "RANK C (REGULAR)";
  } else {
    stars = "⭐";
    rank = "RANK D (INICIANTE)";
  }

  return { score, stars, rank };
}

function endGame(isVictory) {
  isBattleOver = true;
  enableAttackButtons(false);
  DOM.criticalAlert.classList.add("hidden");
  DOM.reactionOverlay.classList.add("hidden");

  DOM.modalCard.classList.remove("victory", "defeat");

  const goldEarned = isVictory ? (activeBossConfig ? 60 : 35) : 10;
  if (currentMode === "adventure") {
    AdventureState.gold += goldEarned;
    AdventureState.heroHp = Math.max(1, playerHP);
  }

  const resultScore = calculateBattleScore(isVictory);

  // Registra no Replay
  if (isVictory) {
    recordBattleMoment("Vitória Épica", `${playerPokemon.name} triunfou sobre ${enemyPokemon.name} com ${Math.ceil(playerHP)} HP restante! Pontuação: ${resultScore.score} pts.`, "🏆", "victory");
  } else {
    recordBattleMoment("Derrota em Batalha", `${playerPokemon.name} foi superado por ${enemyPokemon.name}. Total de ${totalTurns} turnos disputados.`, "💀", "defeat");
  }

  if (DOM.statScore) DOM.statScore.textContent = `${resultScore.score} pts`;
  if (DOM.scoreStars) DOM.scoreStars.textContent = resultScore.stars;
  if (DOM.scoreRankBadge) DOM.scoreRankBadge.textContent = resultScore.rank;

  if (DOM.statRemainingHp) {
    DOM.statRemainingHp.textContent = `${Math.max(0, Math.ceil(playerHP))} / ${currentMaxHP} HP`;
  }
  if (DOM.statCrits) {
    DOM.statCrits.textContent = `${totalCritsAchieved}`;
  }
  if (DOM.statTactics) {
    DOM.statTactics.textContent = `${totalTacticsUsed} usadas`;
  }

  if (isVictory) {
    SoundFX.victory();
    DOM.modalCard.classList.add("victory");
    DOM.modalIcon.textContent = "🏆";
    DOM.modalTitle.textContent = "VITÓRIA ÉPICA!";
    DOM.modalDesc.textContent = `${playerPokemon.name} superou com maestria o confronto contra ${enemyPokemon.name}!`;
    DOM.statReward.textContent = `🪙 +${goldEarned}`;
    addLogMessage(`🏆 Fim de batalha: ${playerPokemon.name} é o grande campeão! Pontuação: ${resultScore.score} pts (${resultScore.rank}).`, "log-special");
  } else {
    SoundFX.defeat();
    DOM.modalCard.classList.add("defeat");
    DOM.modalIcon.textContent = "💀";
    DOM.modalTitle.textContent = "DERROTA...";
    DOM.modalDesc.textContent = `${enemyPokemon.name} levou a melhor desta vez. Ajuste sua estratégia e tente novamente!`;
    DOM.statReward.textContent = "🪙 +10";
    addLogMessage(`💀 Fim de batalha: Você foi derrotado. Pontuação acumulada: ${resultScore.score} pts.`, "log-enemy");
  }

  DOM.statTurns.textContent = `${totalTurns} turnos`;
  DOM.statCombos.textContent = `${totalCombosAchieved} combos`;

  DOM.resultModal.classList.remove("hidden");
  DOM.resultModal.style.display = "flex";
}

function handlePostBattleContinue() {
  hideAllModals();

  if (currentMode === "adventure") {
    if (playerHP > 0) {
      advanceAdventureStage();
    } else {
      // Checkpoint automático (Requisito 27): retorna ao checkpoint da área sem perder o jogo inteiro
      alert(`🚩 CHECKPOINT ACIONADO!\nVocê recuou para o Checkpoint seguro de ${ADVENTURE_ARENAS[AdventureState.checkpointAreaIdx].name}.\nSeu Pokémon recuperou as energias!`);
      AdventureState.heroHp = AdventureState.heroMaxHp;
      loadAdventureArea(AdventureState.checkpointAreaIdx);
      showScreen("adventure");
    }
  } else if (currentMode === "boss") {
    if (playerHP > 0) {
      alert("🎉 PARABÉNS! Você derrotou o Chefe Supremo!");
      resetGameToSelection();
    } else {
      startBossChallenge(playerPokemon);
    }
  } else if (currentMode === "training") {
    startTrainingBattle(playerPokemon);
  } else {
    startFreeBattle(playerPokemon);
  }
}

function resetGameToSelection() {
  hideAllModals();
  if (DOM.playerSprite) DOM.playerSprite.classList.remove("anim-victory", "anim-defeat");
  if (DOM.enemySprite) DOM.enemySprite.classList.remove("anim-victory", "anim-defeat");
  showScreen("selection");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// 30. HELPERS VISUAIS E LOG
// ==========================================
function showFloatingText(container, text, type = "normal") {
  const popup = document.createElement("span");
  popup.className = `damage-popup ${type}`;
  popup.textContent = text;
  container.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1200);
}

function addLogMessage(message, className = "log-player") {
  const p = document.createElement("p");
  p.className = `log-entry ${className}`;
  p.innerHTML = message;
  DOM.battleLog.appendChild(p);
  DOM.battleLog.scrollTop = DOM.battleLog.scrollHeight;
}

function getAttackName(type) {
  switch (type) {
    case "quick": return "Ataque Rápido ⚡";
    case "strong": return "Ataque Forte 💥";
    case "special": return "Ataque Especial 🔥";
    default: return "Ataque";
  }
}

function enableAttackButtons(enabled) {
  DOM.btnQuick.disabled = !enabled;
  DOM.btnStrong.disabled = !enabled;

  const currentCost = activeBattleEvent && activeBattleEvent.modifyEnergyCost
    ? activeBattleEvent.modifyEnergyCost(SPECIAL_COST)
    : SPECIAL_COST;

  DOM.btnSpecial.disabled = !enabled || (playerEP < currentCost);

  if (DOM.btnSpecialHeal) {
    DOM.btnSpecialHeal.disabled = !enabled || playerSpecialHealUsed;
  }
  if (DOM.btnShield) {
    DOM.btnShield.disabled = !enabled || playerShieldUsed;
  }
  if (DOM.btnPowerBoost) {
    DOM.btnPowerBoost.disabled = !enabled || playerPowerBoostUsed;
  }
}

// ==========================================
// 31. EVENT LISTENERS DO JOGO
// ==========================================
function setupEventListeners() {
  // Controles de Áudio e Som (Melhoria 3)
  if (DOM.btnToggleSound) DOM.btnToggleSound.addEventListener("click", () => SoundFX.toggle());
  if (DOM.btnBattleSound) DOM.btnBattleSound.addEventListener("click", () => SoundFX.toggle());
  if (DOM.btnToggleMusic) DOM.btnToggleMusic.addEventListener("click", () => MusicEngine.toggle());
  if (DOM.btnBattleMusic) DOM.btnBattleMusic.addEventListener("click", () => MusicEngine.toggle());

  // Modal Info Pokémon (Melhoria 5)
  if (DOM.btnClosePokeInfo) DOM.btnClosePokeInfo.addEventListener("click", closePokemonInfoModal);

  // Modal Replay (Requisito 11)
  if (DOM.btnViewReplay) DOM.btnViewReplay.addEventListener("click", openReplayModal);
  if (DOM.btnCloseReplay) DOM.btnCloseReplay.addEventListener("click", closeReplayModal);
  if (DOM.btnReplayDone) DOM.btnReplayDone.addEventListener("click", closeReplayModal);

  // Modal Vitória Campanha (Requisito 30)
  if (DOM.btnRestartAdventureCampaign) {
    DOM.btnRestartAdventureCampaign.addEventListener("click", () => {
      closeAdventureVictoryModal();
      startAdventureMode(playerPokemon);
    });
  }
  if (DOM.btnVictoryBackMenu) {
    DOM.btnVictoryBackMenu.addEventListener("click", () => {
      closeAdventureVictoryModal();
      resetGameToSelection();
    });
  }

  // Painel de Ferramentas do Modo Treino (Requisito 10)
  if (DOM.btnTrainCrit) {
    DOM.btnTrainCrit.addEventListener("click", () => {
      nextAttackForcedCrit = true;
      SoundFX.special();
      showFloatingText(DOM.playerDamageContainer, "CRÍTICO ARMADO! 💥", "crit");
      addLogMessage("🎮 Treino: O próximo ataque do seu Pokémon será um Golpe Crítico garantido!", "log-special");
    });
  }

  if (DOM.btnTrainHeal) {
    DOM.btnTrainHeal.addEventListener("click", () => {
      playerHP = currentMaxHP;
      playerEP = MAX_EP;
      enemyHP = enemyMaxHP;
      enemyEP = MAX_EP;
      updateHPBar("player", playerHP, currentMaxHP);
      updateEnergyBar("player", playerEP);
      updateHPBar("enemy", enemyHP, enemyMaxHP);
      updateEnergyBar("enemy", enemyEP);
      SoundFX.heal();
      showFloatingText(DOM.playerDamageContainer, "HP & EP MAX! 💚", "heal");
      addLogMessage("🎮 Treino: HP e Energia de ambos os combatentes foram restaurados ao máximo.", "log-special");
    });
  }

  if (DOM.btnTrainResetTactics) {
    DOM.btnTrainResetTactics.addEventListener("click", () => {
      playerSpecialHealUsed = false;
      playerShieldUsed = false;
      playerShieldActive = false;
      playerPowerBoostUsed = false;
      playerPowerBoostActive = false;
      if (DOM.btnSpecialHeal) DOM.btnSpecialHeal.disabled = false;
      if (DOM.btnShield) DOM.btnShield.disabled = false;
      if (DOM.btnPowerBoost) DOM.btnPowerBoost.disabled = false;
      if (DOM.badgeHealStatus) DOM.badgeHealStatus.textContent = "1x";
      if (DOM.badgeShieldStatus) DOM.badgeShieldStatus.textContent = "1x";
      if (DOM.badgePowerStatus) DOM.badgePowerStatus.textContent = "1x";
      SoundFX.powerBoost();
      addLogMessage("🎮 Treino: Recuperação Especial, Escudo e Poder Temporário foram recarregados!", "log-special");
    });
  }

  if (DOM.btnTrainCycleWeather) {
    DOM.btnTrainCycleWeather.addEventListener("click", () => {
      const keys = Object.keys(WEATHER_DATA);
      const currentIdx = keys.indexOf(currentWeather.id);
      const nextKey = keys[(currentIdx + 1) % keys.length];
      setBattleWeather(nextKey);
      renderAmbientWeather(playerPokemon);
      SoundFX.buttonClick();
      addLogMessage(`🎮 Treino: Clima alterado para ${currentWeather.name}! ${currentWeather.desc}`, "log-special");
    });
  }

  if (DOM.btnTrainRestart) {
    DOM.btnTrainRestart.addEventListener("click", () => {
      startTrainingBattle(playerPokemon);
    });
  }

  // Botão Trocar de Pokémon no Modal de Resultado
  if (DOM.btnChangePokemon) DOM.btnChangePokemon.addEventListener("click", resetGameToSelection);

  // Seletores de Modo de Jogo
  DOM.modeQuick.addEventListener("click", () => setGameMode("quick"));
  DOM.modeAdventure.addEventListener("click", () => setGameMode("adventure"));
  DOM.modeBoss.addEventListener("click", () => setGameMode("boss"));
  if (DOM.modeTraining) DOM.modeTraining.addEventListener("click", () => setGameMode("training"));

  // Pílulas de Seleção de Arena
  const arenaPills = DOM.arenaPills.querySelectorAll(".arena-pill");
  arenaPills.forEach(pill => {
    pill.addEventListener("click", () => {
      arenaPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedArenaKey = pill.dataset.arena;
      updateArenaTheme(selectedArenaKey);
    });
  });

  // Seletor de Níveis de Dificuldade
  if (DOM.difficultyPills) {
    const diffPills = DOM.difficultyPills.querySelectorAll(".difficulty-pill");
    diffPills.forEach(pill => {
      pill.addEventListener("click", () => {
        diffPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        currentDifficulty = pill.dataset.difficulty || "normal";
      });
    });
  }

  // Alternância entre Modo Diurno e Noturno
  if (DOM.btnDayNight) DOM.btnDayNight.addEventListener("click", toggleDayNightMode);

  // Botões das Habilidades Táticas Especiais
  if (DOM.btnSpecialHeal) DOM.btnSpecialHeal.addEventListener("click", handleSpecialHeal);
  if (DOM.btnShield) DOM.btnShield.addEventListener("click", handleShieldActivation);
  if (DOM.btnPowerBoost) DOM.btnPowerBoost.addEventListener("click", handlePowerBoostActivation);

  // Botões de Ataque
  DOM.btnQuick.addEventListener("click", () => handlePlayerAttack("quick"));
  DOM.btnStrong.addEventListener("click", () => handlePlayerAttack("strong"));
  DOM.btnSpecial.addEventListener("click", () => handlePlayerAttack("special"));

  // Reação Rápida / QTE (Clique)
  DOM.btnQteDefend.addEventListener("click", () => resolveReaction("defend", currentIncomingEnemyAttack));
  DOM.btnQteDodge.addEventListener("click", () => resolveReaction("dodge", currentIncomingEnemyAttack));

  // Reação Rápida via Teclado (D = Defesa, Espaço = Esquiva)
  window.addEventListener("keydown", (e) => {
    if (!isReactionActive || reactionResolved) return;
    if (e.key === "d" || e.key === "D") {
      e.preventDefault();
      resolveReaction("defend", currentIncomingEnemyAttack);
    } else if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      resolveReaction("dodge", currentIncomingEnemyAttack);
    }
  });

  // Mochila durante Batalha
  DOM.btnUsePotion.addEventListener("click", () => ITEMS_DATA.potion.use());
  DOM.btnUseElixir.addEventListener("click", () => ITEMS_DATA.elixir.use());
  DOM.btnUseAntidote.addEventListener("click", () => ITEMS_DATA.antidote.use());

  // Navegação e Modais
  DOM.btnBackSelect.addEventListener("click", () => {
    if (confirm("Deseja sair do combate atual?")) {
      resetGameToSelection();
    }
  });

  DOM.btnPlayAgain.addEventListener("click", handlePostBattleContinue);

  // Modal da Loja
  DOM.btnCloseShop.addEventListener("click", () => {
    DOM.shopModal.classList.add("hidden");
    DOM.shopModal.style.display = "none";
    advanceAdventureStage();
  });

  // Modal de Descanso
  DOM.btnRestHeal.addEventListener("click", () => {
    AdventureState.heroHp = Math.min(AdventureState.heroMaxHp, AdventureState.heroHp + 50);
    SoundFX.heal();
    alert("🌿 Seu Pokémon descansou e recuperou +50 HP!");
    DOM.restModal.classList.add("hidden");
    DOM.restModal.style.display = "none";
    advanceAdventureStage();
  });

  DOM.btnRestTrain.addEventListener("click", () => {
    AdventureState.startEnergy = 50;
    SoundFX.special();
    alert("⚡ Treinamento concluído! Você começará as próximas lutas com 50 EP!");
    DOM.restModal.classList.add("hidden");
    DOM.restModal.style.display = "none";
    advanceAdventureStage();
  });

  // Modal de Info da Arena
  DOM.arenaBadge.addEventListener("click", () => {
    DOM.arenaInfoIcon.textContent = currentArena.icon;
    DOM.arenaInfoTitle.textContent = currentArena.name;
    DOM.arenaInfoDesc.textContent = currentArena.description;
    DOM.arenaInfoEffect.innerHTML = `<strong>Efeito em Combate:</strong> ${currentArena.effectText}`;
    DOM.arenaInfoModal.classList.remove("hidden");
    DOM.arenaInfoModal.style.display = "flex";
  });

  DOM.btnCloseArenaInfo.addEventListener("click", () => {
    DOM.arenaInfoModal.classList.add("hidden");
    DOM.arenaInfoModal.style.display = "none";
  });

  // Sair da Aventura
  DOM.btnAdvQuit.addEventListener("click", () => {
    if (confirm("Deseja abandonar a rota de aventura e voltar para o menu principal?")) {
      resetGameToSelection();
    }
  });

  DOM.btnAdvOpenBag.addEventListener("click", () => {
    alert(`🎒 Mochila do Campeão:\n- 🧪 Poções de HP: ${AdventureState.items.potion || 0}\n- ⚡ Elixires de EP: ${AdventureState.items.elixir || 0}\n- 💊 Antídotos: ${AdventureState.items.antidote || 0}\n- 🪙 Poké-Moedas: ${AdventureState.gold}`);
  });
}

// Inicia aplicação após o carregamento da página
document.addEventListener("DOMContentLoaded", initApp);
