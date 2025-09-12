# 🎲 Dados Viciados – RPG

**Dados Viciados** é um joguinho de RPG onde a sorte nunca é tão aleatória assim…  
Prepare-se para rolar dados, enfrentar situações inusitadas e descobrir que às vezes o destino dá uma ajudinha (ou uma rasteira).

🔗 [Jogue agora no GitHub Pages](https://sammyfreitas.github.io/dadosViciados/)

---

## 📖 Sumário
- [Sobre o jogo](#-sobre-o-jogo)
- [Manual Básico](#-manual-básico)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Como rodar localmente](#-como-rodar-localmente)
- [Próximos passos](#-próximos-passos)
- [Contribuições](#-contribuições)
- [Licença](#-licença)

---

## 🚀 Sobre o jogo
- Um RPG leve, focado em diversão rápida.  
- O sistema usa dados "viciados", em que certas probabilidades são manipuladas para tornar a experiência mais imprevisível.  
- Pode ser jogado **solo** ou em **grupo**, direto no navegador ou no terminal.  

---

## 📖 Manual Básico

### 1. Criação de Personagem
- Escolha um **nome** e uma **classe** (ex.: Guerreiro, Mago, Ladino).
- Cada personagem começa com:
  - **10 pontos de vida (HP)**
  - **1 item especial** (definido pelo jogador)

### 2. Testes de Ação
- Sempre que o personagem tentar algo arriscado, role o dado.  
- O dado tem resultados "viciados":  
  - **1** → falha catastrófica  
  - **2–4** → falha comum  
  - **5–6** → sucesso parcial  
  - **7–10** → sucesso total  
  - **11–12** → sucesso épico ✨

### 3. Combate
- Cada ataque é resolvido com uma rolagem de dado.  
- O dano causado depende do resultado:
  - Falha → **0 de dano**  
  - Sucesso parcial → **1 de dano**  
  - Sucesso total → **2 de dano**  
  - Sucesso épico → **3 de dano**  

### 4. Vitória e Derrota
- Se os pontos de vida do inimigo chegarem a **0** → vitória! 🏆  
- Se os pontos de vida do jogador chegarem a **0** → derrota (ou final alternativo decidido pelo grupo). ☠️  

---

## 🛠️ Tecnologias utilizadas
- **Linguagem:** Python  
- **Interface:** CLI (linha de comando) *(ou pygame, se aplicável)*  
- **Deploy:** GitHub Pages  
- **Controle de versão:** Git + GitHub  

---

## 📦 Como rodar localmente
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dadosViciados.git

# Acesse a pasta do projeto
cd dadosViciados

# Rode o jogo
python main.py

#🧩 Próximos Passos
- Criar sistema de magias
- Adicionar mais classes
- Suporte para partidas online

#🤝 Contribuições
Contribuições são bem-vindas!
Sinta-se à vontade para abrir issues ou enviar um pull request.

#📜 Licença

Este projeto está sob a licença MIT.
Consulte o arquivo LICENSE para mais detalhes.
