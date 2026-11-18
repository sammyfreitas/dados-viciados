// /Jogo de RPG simples em JavaScript
if (!document.getElementById("historia")) {
  console.log("jogo.js ignorado (não é jogo.html)");
} else {

// ====== Utils ======
const $ = id => document.getElementById(id);
const d = n => Math.floor(Math.random() * n) + 1;

// ====== Estado ======
let jogador = {};
let inimigo = null;
let rodadas = 15;
let turno = 0;
let jogoIniciado = false;

// ====== Dados de armas ======
const armaDados = { "Espada":8, "Machado":10, "Arco e Flecha":6, "Feitiço":12 };

// ====== Dado escalonado ======
function dadoPorAtributo(v){
  if (v >= 6) return 20;
  if (v === 5) return 12;
  if (v === 4) return 10;
  if (v === 3) return 8;
  if (v === 2) return 6;
  if (v === 1) return 4;
  return 2;
}

// ====== Log ======
function log(msg){
  $("historia").innerText += msg + "\n";
  $("historia").scrollTop = $("historia").scrollHeight;
}
function addLinhaCombate(evento){
  turno++;
  const tr = document.createElement("tr");
  const td1 = document.createElement("td"); td1.textContent = turno;
  const td2 = document.createElement("td"); td2.textContent = evento;
  const td3 = document.createElement("td"); td3.textContent = inimigo ? inimigo.hp : "-";
  const td4 = document.createElement("td"); td4.textContent = `${jogador.hp}/${jogador.hpMax}`;
  tr.append(td1,td2,td3,td4);
  $("combate-body").appendChild(tr);
}

// ====== Inimigos ======
const comunsIniciais = [
  { nome:"Goblin", hp:8, dano:()=>d(4) },
  { nome:"Orc", hp:12, dano:()=>d(6) }
];
const comunsIntermediarios = [
  { nome:"Lobo", hp:14, dano:()=>d(6) },
  { nome:"Bandido", hp:16, dano:()=>d(8) }
];
const comunsFinais = [
  { nome:"Troll", hp:22, dano:()=>d(10) },
  { nome:"Demônio", hp:26, dano:()=>d(12) }
];
const bosses = [
  { nome:"Troll Ancião", hp:32, dano:()=>d(10)+2 },
  { nome:"Demônio Maior", hp:45, dano:()=>d(12)+3 },
  { nome:"Dragão Ancião", hp:60, dano:()=>d(20) }
];

// ====== UI ======
function setHero(){
  $("heroi").innerHTML = `
    <table class="tabela-heroi">
      <tr><th colspan="2">${jogador.nome} — ${jogador.raca} ${jogador.classe}</th></tr>
      <tr><td>HP</td><td>${jogador.hp}/${jogador.hpMax}</td></tr>
      <tr><td>Arma</td><td>${jogador.arma} (d${armaDados[jogador.arma]||6})</td></tr>
      <tr><td>Defesa</td><td>${jogador.defesa} (−${jogador.escudoReducao||0})</td></tr>
      <tr><td>Força</td><td>${jogador.atributos.forca}</td></tr>
      <tr><td>Destreza</td><td>${jogador.atributos.destreza}</td></tr>
      <tr><td>Inteligência</td><td>${jogador.atributos.inteligencia}</td></tr>
      <tr><td>Furtividade</td><td>${jogador.atributos.furtividade}</td></tr>
      <tr><td>Carisma</td><td>${jogador.atributos.carisma}</td></tr>
      <tr><td>Agilidade</td><td>${jogador.atributos.agilidade}</td></tr>
    </table>
  `;
}
function setEnemy(){
  if (!inimigo){ $("inimigo").innerHTML = ""; return; }
  $("inimigo").innerHTML = `
    <table class="tabela-heroi">
      <tr><th colspan="2">${inimigo.nome}</th></tr>
      <tr><td>HP</td><td>${inimigo.hp}</td></tr>
    </table>
  `;
}
function setRodadas(){ $("rodadas").textContent = rodadas; }

// ====== Botões fixos ======
function initBotoesFixos(){
  $("btn-atacar").onclick = atacar;
  $("btn-furtivo").onclick = tentarFurtividade;
  $("btn-carisma").onclick = tentarCarisma;
  $("btn-fugir").onclick = tentarAgilidade;
  $("btn-inventario").onclick = mostrarInventario;
}

// ====== Escolher inimigo ======
function escolherInimigoPorRodada(){
  if (rodadas % 5 === 0){
    const idx = (15 - rodadas) / 5;
    return JSON.parse(JSON.stringify(bosses[idx] || bosses[bosses.length-1]));
  }
  if (rodadas >= 12) return JSON.parse(JSON.stringify(comunsIniciais[Math.floor(Math.random()*comunsIniciais.length)]));
  if (rodadas >= 8) return JSON.parse(JSON.stringify(comunsIntermediarios[Math.floor(Math.random()*comunsIntermediarios.length)]));
  return JSON.parse(JSON.stringify(comunsFinais[Math.floor(Math.random()*comunsFinais.length)]));
}

// ====== Eventos ======
function eventoAleatorio(){
  if (!window.eventos || eventos.length===0){ log("❓ Nenhum evento carregado."); return; }
  const ev = eventos[Math.floor(Math.random()*eventos.length)];
  log(`Evento: ${ev.descricao}`);
  addLinhaCombate(`Evento: ${ev.descricao}`);
  if (ev.efeito){ ev.efeito(jogador); setHero(); }
}

// ====== Batalha ======
function iniciarBatalha(){
  inimigo = escolherInimigoPorRodada();
  const bossTxt = (rodadas % 5 === 0) ? "🔥 CHEFE: " : "⚔️ ";
  log(`${bossTxt}${inimigo.nome} aparece!`);
  setEnemy(); setHero(); setRodadas();
  addLinhaCombate(`${inimigo.nome} HP ${inimigo.hp}`);
}

// ====== Ações ======
function atacar(){
  if (!inimigo){ log("❌ Não há inimigo!"); return; }
  const dFor = dadoPorAtributo(jogador.atributos.forca);
  const dDes = dadoPorAtributo(jogador.atributos.destreza);
  const dArm = armaDados[jogador.arma] || 6;
  const dadoFinal = Math.max(dFor,dDes,dArm);
  const danoHeroi = d(dadoFinal);
  inimigo.hp = Math.max(0,inimigo.hp-danoHeroi);
  log(`🎯 Você ataca (d${dadoFinal}) e causa ${danoHeroi} de dano!`);
  setEnemy(); addLinhaCombate(`${inimigo.nome} HP ${inimigo.hp}`);
  if (inimigo.hp<=0){ vitoria(); return; }

  const danoBruto = inimigo.dano();
  const bloqueio = Math.min(danoBruto,(jogador.escudoReducao||0));
  const danoEfetivo = Math.max(0,danoBruto-(jogador.escudoReducao||0));
  if (bloqueio>0) log(`🛡️ ${jogador.defesa} bloqueou ${bloqueio} de dano.`);
  if (danoEfetivo>0){ jogador.hp = Math.max(0,jogador.hp-danoEfetivo); log(`💥 ${inimigo.nome} acerta ${danoEfetivo}.`); }
  else { log(`${inimigo.nome} não conseguiu te ferir!`); }
  setHero(); addLinhaCombate(`Golpe do ${inimigo.nome} (−${danoEfetivo} HP)`);
  if (jogador.hp<=0){ log("☠️ Você caiu..."); fim(); }
}
function tentarFurtividade(){
  const dado=dadoPorAtributo(jogador.atributos.furtividade);
  if(d(dado)>=7){ log("👣 Você some nas sombras."); addLinhaCombate("Furtividade: sucesso"); avancar(); }
  else{ log("❌ Você falha e inicia combate!"); addLinhaCombate("Furtividade: falha"); atacar(); }
}
function tentarCarisma(){
  const dado=dadoPorAtributo(jogador.atributos.carisma);
  if(d(dado)>=8){ log("🗣️ Convenceu e passou."); addLinhaCombate("Carisma: sucesso"); avancar(); }
  else{ log("😠 Não colou!"); addLinhaCombate("Carisma: falha"); atacar(); }
}
function tentarAgilidade(){
  const dado=dadoPorAtributo(jogador.atributos.agilidade);
  if(d(dado)>=7){ log("🏃 Você foge ileso."); addLinhaCombate("Agilidade: sucesso"); avancar(); }
  else{ log("❌ Tropeçou e iniciou combate!"); addLinhaCombate("Agilidade: falha"); atacar(); }
}
function mostrarInventario(){
  if(!jogador.itens||!jogador.itens.length){ log("🎒 Inventário vazio."); return; }
  jogador.itens.forEach((item,idx)=>{
    log(`Usar ${item.nome}?`);
    item.efeito(); jogador.itens.splice(idx,1); setHero();
    addLinhaCombate(`Usou ${item.nome}`);
  });
}

// ====== Vitória / Avançar ======
function vitoria(){
  log(`🏆 ${inimigo.nome} foi derrotado!`);
  addLinhaCombate(`Derrotou ${inimigo.nome}`);
  inimigo=null;
  avancar(true);
}
function avancar(aposBatalha=false){
  rodadas--; setRodadas();
  if(rodadas<=0){ log("🎉 Você concluiu sua missão!"); fim(); return; }
  if(Math.random()<0.5){ eventoAleatorio(); setHero(); }
  iniciarBatalha();
}
function fim(){ log("🏁 Fim da jornada!"); }

// ====== Botões iniciais ======
$("btn-carregar-ficha").onclick = () => {
  const raw = localStorage.getItem("fichaRPG");
  if(!raw){ alert("Nenhuma ficha criada!"); return; }
  try{ jogador=JSON.parse(raw); }catch(e){ alert("Ficha inválida."); return; }
  jogador.itens=jogador.itens||[]; jogador.level=jogador.level||1;
  jogador.hp=jogador.hpMax||jogador.hp||10;
  $("foto-classe").src=`imagens/${jogador.classe}_${jogador.raca}.png`;
  setHero();
  log(`📜 Ficha carregada: ${jogador.nome}, ${jogador.raca} ${jogador.classe}`);
};
$("btn-iniciar").onclick = () => {
  if(jogoIniciado) return;
  jogoIniciado=true;
  log("➡️ A jornada começa...");
  setRodadas(); iniciarBatalha();
};

initBotoesFixos();

}
