// Eventos aleatórios para o jogo
// Cada evento pode ser um baú, NPC, armadilha, teste de atributo, item ou enigma
// Alguns eventos têm variações (ex: enigma fácil/médio/difícil)
// Alguns eventos podem ser duplicados com pequenas variações
// Total: cerca de 100 eventos
(function(){
  const simples = [
    // BAÚS (sempre perguntar se abre ou ignora; alguns têm maldição/trap)
    { tipo:"bau", desc:"📦 Você encontra um baú de madeira sob folhas." },
    { tipo:"bau", desc:"💰 Um baú enferrujado repousa perto de uma pedra." },
    { tipo:"bau", desc:"🎁 Um baú com fecho dourado reluz no local." },
    { tipo:"bau", desc:"📦 Um caixote esquecido à beira da trilha." },
    { tipo:"bau", desc:"💼 Baú pequeno com runas simples gravadas." },
    { tipo:"bau", desc:"🗝️ Um cofre semi-enterrado, tampo rachado." },
    { tipo:"bau", desc:"🧳 Um baú antigo coberto de limo." },

    // NPCs (sempre oferecer sim/não)
    { tipo:"npc", desc:"🚶 Um viajante cansado pede companhia por um trecho." },
    { tipo:"npc", desc:"🤴 Um mendigo pede uma moeda em troca de bênção." },
    { tipo:"npc", desc:"🧙 Um mago oferece ensinar um truque em troca de ajuda." },
    { tipo:"npc", desc:"👩‍🌾 Uma camponesa pede escolta até a vila próxima." },
    { tipo:"npc", desc:"⚒️ Um ferreiro quer sucata para reforjar uma lâmina." },
    { tipo:"npc", desc:"🧝 Um elfo suplica auxílio para resgatar um parente." },
    { tipo:"npc", desc:"🧙‍♀️ Uma alquimista troca poção por ervas raras." },
    { tipo:"npc", desc:"👻 Um espírito oferece conhecimento por um pequeno sacrifício." },
    { tipo:"npc", desc:"🐉 Um dragão jovem aparece curioso, não hostil." },

    // ARMADILHAS/AMBIENTE (usar 'local', não sala)
    { tipo:"armadilha", desc:"🪤 Você pisa numa armadilha de urso em um local estreito." },
    { tipo:"armadilha", desc:"🏹 Uma linha dispara dardos envenenados do arbusto." },
    { tipo:"armadilha", desc:"💀 Um piso falso cede em um trecho da trilha." },
    { tipo:"armadilha", desc:"🔥 Um círculo de runas explode em fogo em um clareira." },
    { tipo:"armadilha", desc:"🌋 Tremores sacodem o chão perto de rochas soltas." },
    { tipo:"armadilha", desc:"🕸️ Teias pegajosas te prendem em um local úmido." },
    { tipo:"armadilha", desc:"💤 Um gás sonífero paira no local e te envolve." },

    // TESTES de atributo (com dificuldade)
    { tipo:"teste", desc:"🌉 Uma ponte instável ameaça cair.", atributo:"agilidade", dificuldade:8 },
    { tipo:"teste", desc:"🧗 Você tenta escalar um penhasco íngreme.", atributo:"forca", dificuldade:7 },
    { tipo:"teste", desc:"🌊 Um riacho caudaloso precisa ser atravessado.", atributo:"destreza", dificuldade:8 },
    { tipo:"teste", desc:"🕵️ Você tenta se esgueirar por guardas locais.", atributo:"furtividade", dificuldade:7 },
    { tipo:"teste", desc:"🗣️ Um guarda desconfiado barra a trilha.", atributo:"carisma", dificuldade:9 },
    { tipo:"teste", desc:"🌲 Árvores encantadas bloqueiam a passagem.", atributo:"inteligencia", difficultyAlias:"dificuldade", dificuldade:8 },

    // ITENS diretos
    { tipo:"item", desc:"📜 Você encontra um pergaminho mágico.", item:"Poção de Mana" },
    { tipo:"item", desc:"🍖 Uma sacola de provisões restaura vigor.", item:"Poção de Cura" },
    { tipo:"item", desc:"🪄 Uma varinha quebrada pode ser consertada.", item:"Feitiço" },
    { tipo:"item", desc:"⚔️ Um punhal prateado foi descartado.", item:"Arma" },
    { tipo:"item", desc:"🛡️ Um escudo de madeira encostado num tronco.", item:"Escudo de Madeira" },

    // ENIGMAS (pergunta/resposta — normal)
    { tipo:"pergunta", desc:"💡 Enigma: 'Tenho cidades mas não casas, montanhas mas não árvores. O que sou?'", resposta:"mapa" },
    { tipo:"pergunta", desc:"💡 Enigma: 'Quanto é 3 + 5?'", resposta:"8" },
    { tipo:"pergunta", desc:"💡 Enigma: 'O que corre mas não tem pernas?'", resposta:"rio" },
    { tipo:"pergunta", desc:"💡 Enigma: 'Qual é a capital da França?'", resposta:"paris" },
    { tipo:"pergunta", desc:"💡 Enigma: 'Sou redondo e marco o tempo. O que sou?'", resposta:"relógio" },

    // ENIGMAS (médio)
    { tipo:"pergunta", desc:"💡 Enigma: 'Se você me tem, quer me compartilhar. Se me compartilha, não me tem. O que sou?'", resposta:"segredo" },
    { tipo:"pergunta", desc:"💡 Enigma: 'Tenho chaves mas não abro portas. O que sou?'", resposta:"piano" },
    { tipo:"pergunta", desc:"💡 Enigma: 'Quanto é 12 ÷ 3?'", resposta:"4" },
    { tipo:"pergunta", desc:"💡 Enigma: 'O que sempre sobe mas nunca desce?'", resposta:"idade" },
    { tipo:"pergunta", desc:"💡 Enigma: 'Qual é o oposto de norte?'", resposta:"sul" },

    // ENIGMAS (difícil)
    { tipo:"pergunta", desc:"💡 Enigma: 'O que é maior: meio de 2 ou 1/4 de 8?'", resposta:"iguais" },
    { tipo:"pergunta", desc:"💡 Enigma: 'Sou leve como uma pluma, mas ninguém pode me segurar. O que sou?'", resposta:"respiração" },
    { tipo:"pergunta", desc:"💡 Enigma: 'Quantos segundos tem um minuto?'", resposta:"60" },
    { tipo:"pergunta", desc:"💡 Enigma: 'O que tem dentes mas não morde?'", resposta:"pente" },
    { tipo:"pergunta", desc:"💡 Enigma: 'O que se quebra quando se fala?'", resposta:"silêncio" },

    // SITUAÇÕES extras
    { tipo:"pergunta", desc:"🚪 Uma porta mágica exige senha.", resposta:"abracadabra" },
    { tipo:"item", desc:"🦉 Uma coruja deixa um mapa antigo.", item:"Mapa Antigo" },
    { tipo:"npc", desc:"🔮 Uma vidente oferece um presságio por uma moeda." },
    { tipo:"teste", desc:"🌪️ Um vendaval ameaça te lançar no abismo.", atributo:"forca", dificuldade:9 },
    { tipo:"item", desc:"⚔️ Um machado pesado está fincado no toco.", item:"Machado" },
    { tipo:"item", desc:"🏹 Um arco refinado foi esquecido no campo.", item:"Arco e Flecha" },
    { tipo:"item", desc:"🛡️ Escudo de ferro com brasão antigo.", item:"Escudo de Ferro" },
    { tipo:"item", desc:"🧴 Poção translúcida vibra na luz.", item:"Poção de Cura" },
  ];

  // Extras para completar 100 (variações e duplicações razoáveis)
  const extras = [
    { tipo:"teste", desc:"🪨 Uma passagem estreita exige equilíbrio.", atributo:"destreza", dificuldade:7 },
    { tipo:"npc", desc:"🎭 Um bardo pede inspiração para uma canção." },
    { tipo:"pergunta", desc:"💡 Enigma: 'Qual número romano representa 10?'", resposta:"x" },
    { tipo:"armadilha", desc:"🌿 Espinhos venenosos no matagal ferem seu braço." },
    { tipo:"bau", desc:"🗄️ Uma arca parcialmente aberta te chama." },
    { tipo:"npc", desc:"🛶 Um barqueiro oferece travessia em troca de favor." },
    { tipo:"pergunta", desc:"💡 Enigma: 'Qual é a raiz quadrada de 81?'", resposta:"9" },
    { tipo:"teste", desc:"🧠 Um enigma mecânico bloqueia uma ponte.", atributo:"inteligencia", dificuldade:9 },
    { tipo:"armadilha", desc:"🪙 Moedas no chão ativam dardos ocultos." },
    { tipo:"bau", desc:"🧰 Uma caixa de ferramentas antiga." },

    { tipo:"teste", desc:"🏔️ Uma borda íngreme exige força nas pernas.", atributo:"forca", dificuldade:8 },
    { tipo:"npc", desc:"🧞 Um gênio cansado pede ajuda para sair de uma garrafa." },
    { tipo:"pergunta", desc:"💡 Enigma: 'Três letras tenho, duas retiro, ainda fico inteiro. Quem sou?'", resposta:"fio" },
    { tipo:"armadilha", desc:"🪵 Troncos rolantes descem pela encosta!" },
    { tipo:"bau", desc:"💎 Um baú com gema incrustada no tampo." },
    { tipo:"npc", desc:"🧜 Uma náiade oferece água curativa se você limpar o riacho." },
    { tipo:"pergunta", desc:"💡 Enigma: 'Qual é o plural de cão?'", resposta:"cães" },
    { tipo:"teste", desc:"🦶 Passos silenciosos necessários para não acordar um urso.", atributo:"furtividade", dificuldade:8 },
    { tipo:"armadilha", desc:"🔥 Brasas escondidas sob folhas queimam seus pés." },
    { tipo:"item", desc:"🗝️ Uma chave antiga pode abrir algo mais à frente.", item:"Chave Antiga" },

    // 10 a mais…
    { tipo:"npc", desc:"🧙‍♂️ Um velho sábio pede que você responda uma pergunta sobre estrelas." },
    { tipo:"pergunta", desc:"💡 Enigma: 'Qual é a soma de 15 com 6?'", resposta:"21" },
    { tipo:"bau", desc:"🪙 Cofre de doações abandonado." },
    { tipo:"armadilha", desc:"🪨 Pedras soltas despencam de um barranco." },
    { tipo:"teste", desc:"🌀 Névoa ilusória confunde seus sentidos.", atributo:"inteligencia", dificuldade:8 },
    { tipo:"npc", desc:"🥾 Um guia local oferece um atalho — por um preço." },
    { tipo:"pergunta", desc:"💡 Enigma: 'Qual é a capital de Portugal?'", resposta:"lisboa" },
    { tipo:"item", desc:"🥤 Frasco rotulado como 'recuperação rápida'.", item:"Poção de Cura" },
    { tipo:"teste", desc:"🌬️ Saltar de pedra em pedra no rio.", atributo:"destreza", dificuldade:9 },
    { tipo:"armadilha", desc:"🪚 Lâminas giratórias surgem da terra." }
  ];

  window.EVENTOS = [...simples, ...extras]; // total ~100
})();
