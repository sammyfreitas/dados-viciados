if (!document.getElementById("form-ficha")) {
  console.log("ficha.js ignorado (não é ficha.html)");
} else {

const TOTAL_PONTOS_BASE = 17;
const atributosIds = ["forca","agilidade","destreza","carisma","inteligencia","furtividade"];

const bonusClasse = {
  "Mago": { inteligencia: 2 },
  "Guerreiro": { forca: 2 },
  "Ladino": { furtividade: 2 },
  "Paladino": { carisma: 2 },
  "Bardo": { carisma: 1, inteligencia: 1 }
};
const bonusRaca = {
  "Elfo": { agilidade: 2 },
  "Humano": { forca:1, agilidade:1, destreza:1, carisma:1, inteligencia:1, furtividade:1 },
  "Anão": { forca: 2 },
  "Hobbit": { furtividade: 2 }
};

const armaMeta = {
  "Espada": { dado: "d8", nota: "Equilibrada corpo a corpo." },
  "Machado": { dado: "d10", nota: "Alto impacto, exige força." },
  "Arco e Flecha": { dado: "d6", nota: "Ataque à distância." },
  "Feitiço": { dado: "d12", nota: "Poder arcano, escala com Inteligência." }
};

const defesaMeta = {
  "Nenhum":            { reducao: 0, custo: 0, texto: "Sem defesa adicional." },
  "Cota de Malha":     { reducao: 1, custo: 0, texto: "Reduz 1 e deixa mão livre." },
  "Escudo de Madeira": { reducao: 1, custo: 0, texto: "Reduz 1." },
  "Escudo de Ferro":   { reducao: 2, custo: 1, texto: "Reduz 2 (custa 1 ponto dos atributos)." },
  "Escudo Sagrado":    { reducao: 3, custo: 2, texto: "Reduz 3 (custa 2 pontos dos atributos)." }
};

const $ = id => document.getElementById(id);
const setText = (id, val) => { const el = $(id); if (el) el.textContent = val; };

function totalDisponivel() {
  const def = defesaMeta[$("defesa").value] || defesaMeta["Nenhum"];
  return TOTAL_PONTOS_BASE - (def.custo || 0);
}
function somaAtribBase() { return atributosIds.reduce((acc,id)=> acc + Number($(id).value), 0); }
function calcRestantes() { return totalDisponivel() - somaAtribBase(); }

function reduzirExcesso(excesso) {
  let valores = atributosIds.map(id => ({ id, val: Number($(id).value) }));
  valores.sort((a,b) => b.val - a.val);
  for (let i=0; i<valores.length && excesso>0; i++) {
    const podeTirar = Math.min(valores[i].val, excesso);
    valores[i].val -= podeTirar;
    excesso -= podeTirar;
    $(valores[i].id).value = valores[i].val;
  }
}

function atualizarTabelaENarrativa() {
  const cls = $("classe").value;
  const rc  = $("raca").value;

  atributosIds.forEach(id => {
    const base = Number($(id).value);
    const bC = bonusClasse[cls]?.[id] || 0;
    const bR = bonusRaca[rc]?.[id] || 0;
    const total = base + bC + bR;

    setText(`esc-${id}`, base);
    setText(`bonus-classe-${id}`, bC);
    setText(`bonus-raca-${id}`, bR);
    setText(`total-${id}`, total);
    setText(`val-${id}`, base);
  });

  let nar = [];
  if (bonusClasse[cls]) Object.entries(bonusClasse[cls]).forEach(([k,v]) => nar.push(`+${v} em ${k}`));
  if (bonusRaca[rc]) Object.entries(bonusRaca[rc]).forEach(([k,v]) => nar.push(`+${v} em ${k}`));
  setText("texto-narrativo", (cls && rc) ? `Como ${rc} ${cls}, você ganha ${nar.join(", ")}.` : "");
}

function atualizarEquipInfo() {
  const arma = $("arma").value;
  const def  = $("defesa").value;
  const mA = armaMeta[arma];
  const mD = defesaMeta[def] || defesaMeta["Nenhum"];

  const armaTxt = arma ? `Arma: ${arma} (${mA?.dado || "—"}) — ${mA?.nota || ""}` : "";
  const defTxt  = def  ? `Defesa: ${def} — ${mD.texto}` : "";

  $("equip-info").textContent = [armaTxt, defTxt].filter(Boolean).join("\n");

  const disponivel = totalDisponivel();
  setText("total-disponivel", disponivel);

  const rest = calcRestantes();
  if (rest < 0) reduzirExcesso(Math.abs(rest));

  setText("pontos-restantes", calcRestantes());

  const custo = mD.custo || 0;
  $("custo-info").textContent = custo ? `⚠️ Este item defensivo consome ${custo} ponto(s) do seu total.` : "";
}

function atualizarUI() {
  atualizarTabelaENarrativa();
  atualizarEquipInfo();
}

atributosIds.forEach(id => {
  $(id).addEventListener("input", e => {
    let rest = calcRestantes();
    if (rest < 0) {
      e.target.value = Math.max(0, Number(e.target.value) + rest);
    }
    setText("pontos-restantes", calcRestantes());
    setText(`val-${id}`, e.target.value);
    setText(`esc-${id}`, e.target.value);
    atualizarTabelaENarrativa();
  });
});

["classe","raca","arma","defesa"].forEach(sel => {
  $(sel).addEventListener("change", atualizarUI);
});

document.addEventListener("DOMContentLoaded", () => {
  setText("total-disponivel", TOTAL_PONTOS_BASE);
  atualizarUI();
});

$("form-ficha").addEventListener("submit", e => {
  e.preventDefault();

  if (calcRestantes() > 0) {
    alert(`Você precisa gastar todos os ${totalDisponivel()} pontos!`);
    return;
  }
  const cls = $("classe").value;
  const rc  = $("raca").value;
  const arma = $("arma").value;
  const defesa = $("defesa").value;
  if (!rc || !cls || !arma || !defesa) {
    alert("Preencha Raça, Classe, Arma e Defesa.");
    return;
  }

  const jogador = {
    nome: $("nome").value,
    classe: cls,
    raca: rc,
    arma,
    defesa,
    escudoReducao: (defesaMeta[defesa]?.reducao || 0),
    defesaCusto:   (defesaMeta[defesa]?.custo   || 0),
    atributos: {}
  };

  atributosIds.forEach(id => {
    const base = Number($(id).value);
    const bC = bonusClasse[cls]?.[id] || 0;
    const bR = bonusRaca[rc]?.[id] || 0;
    jogador.atributos[id] = base + bC + bR;
  });

  jogador.hp = 10 + jogador.atributos.forca*2 + jogador.atributos.agilidade;
  jogador.hpMax = jogador.hp;

  localStorage.setItem("fichaRPG", JSON.stringify(jogador));
  window.location.href = "jogo.html";
});

$("salvar-ficha").addEventListener("click", () => {
  const data = localStorage.getItem("fichaRPG");
  if (!data) { alert("Nenhuma ficha criada!"); return; }
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ficha.json";
  link.click();
});

$("enviar-ficha").addEventListener("click", () => {
  const data = localStorage.getItem("fichaRPG");
  if (!data) { alert("Nenhuma ficha criada!"); return; }
  const j = JSON.parse(data);
  const resumo = `${j.nome}, ${j.raca} ${j.classe}
Arma: ${j.arma}
Defesa: ${j.defesa} (reduz ${j.escudoReducao}, custo ${j.defesaCusto})
HP: ${j.hpMax}

Força: ${j.atributos.forca}, Agilidade: ${j.atributos.agilidade}, Destreza: ${j.atributos.destreza}
Carisma: ${j.atributos.carisma}, Inteligência: ${j.atributos.inteligencia}, Furtividade: ${j.atributos.furtividade}`;
  window.open("https://wa.me/?text=" + encodeURIComponent(resumo), "_blank");
});

}
