let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["graveto"];
let weaponPrice = 50;
let username = "";
let startTime;
let endTime;

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const timeText = document.querySelector("#time");
const caveAudio = document.querySelector("#caveAudio");
const audio = document.querySelector("#audioDragon");

const weapons = [
  { name:     "graveto",        power: 5 },
  { name:     "adaga",          power: 25 },
  { name:     "martelo",        power: 50 },
  { name:     "espada",         power: 75 },
  {name:      "big bertha",     power:100},
  {name:      "Machado D'água", power: 500}
];

const monsters = [
  {
    name: "Slime",
    level: 2,
    health: 15,
  },
  {
    name: "Besta",
    level: 10,
    health: 60,
  },
  {
    name: "Esqueleto",
    level: 15,
    health: 105
  },
  {
    name: "Zumbi", 
    level: 20,
    health: 155 
  },
  {
    name: "Ultra Esqueleto",
    level: 25,
    health:250
  },
  {
    name: "Dragão",
    level: 100,
    health: 500,
  },
];

const locations = [
  {
    name: "town square",
    "button text": ["Explorar a loja", "Explorar caverna", "Matar o Dragão"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Você está no centro. Você deveria olhar a loja...",
  },
  {
    name: "loja",
    "button text": [
      "Comprar 10 hp",
      "Comprar arma",
      "Ir para o centro",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Você entra na loja.",
  },
  {
    name: "caverna",
    "button text": ["Lutar com Slime", "Lutar com Besta", "Ir para o centro"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Você entra na caverna e vê alguns monstros.",
  },
  {
    name: "Supercaverna",
    "button text": ["Lutar com Esqueleto", "Lutar com Zumbi", "Lutar com Super Esqueleto"],
    "button functions": [fightSkeleton, fightZombie, fightUltraSkeleton],
    text: "Você entra numa caverna sem saída, mate um dos monstros para sair vivo."
  },
  {
    name: "lutar",
    "button text": ["Atacar", "Desviar", "Fugir"],
    "button functions": [attack, dodge, goTown],
    text: "Você está lutando com um monstro.",
  },
  {
    name: "matar monstro",
    "button text": ["Ir para o centro", "Ir para o centro", "Ir para o centro"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'o monstro grita "Arg!" antes de morrer. Você ganha ouro e xp',
  },
  {
    name: "perda",
    "button text": ["Replay", "Replay", "Replay"],
    "button functions": [restart, restart, restart],
    text: "Você morreu. &#x2620;",
  },
  {
    name: "ganho",
    "button text": ["Replay", "Replay", "Replay"],
    "button functions": [restart, restart, restart],
    text: " parabéns! Você matou o dragão, você terminou sua jornada.! &#x1F389;",
  },
  {
    name: "roleta russa",
    "button text": ["0", "1", "Ir para o centro"],
    "button functions": [pickZero, pickOne, goTown],
    text: "Você encontrou o segredo do rei, escolha uma das 2 opções para ser sorteado, mas cuidado, você pode morrer. Que os jogos comecem.",
  },
];

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
  caveAudio.pause()
  audio.pause()
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  if (xp > 13) {
    update(locations[3]); 
  } else {
    update(locations[2]); 
  }
  caveAudio.pause();
  caveAudio.currentTime = 0;
  caveAudio.src = "sounds/cave_sound.mp3";
  caveAudio.play();
}


function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem recursos suficientes para comprar hp!";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= weaponPrice) {
      gold -= weaponPrice;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Conseguiu " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " Você possui no inventário: " + inventory;
      weaponPrice += 50;
    } else {
      text.innerText =
        "Você não tem recursos suficientes para comprar uma arma!";
    }
  } else {
    text.innerText = "Você já possui a arma mais poderosa!";
    button2.innerText = "Vender arma por 15 moedas";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 30;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Vendido " + currentWeapon + ".";
    text.innerText += " Você possui no inventário: " + inventory;
  } else {
    text.innerText = "Não venda sua única arma";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightSkeleton() {
  fighting = 2;
  goFight();
}

function fightZombie() {
  fighting = 3;
  goFight();
}

function fightUltraSkeleton() {
  fighting = 4;
  goFight();
}

function fightDragon() {
  fighting = 5;
  goFight();
  caveAudio.pause();
  audio.currentTime = 0;
  audio.src = "sounds/dragon_sound.mp3";
  audio.play();
}

function goFight() {
  update(locations[4]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = monsters[fighting].name + " ataca.";
  text.innerText += " Você revida com seu " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 10;
  } else {
    text.innerText += " Você perdeu.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 5) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Seu " + inventory.pop() + " quebrou.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = "Você desvia do ataque " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[5]);
}

function lose() {
  update(locations[6]);
}

function winGame() {
  update(locations[7]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["graveto"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[8]);
}

function pickZero() {
  pick(0);
}

function pickOne() {
  pick(1);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText =
    "Você escolhe " + guess + ". O sorteio final foi: " + "\t" + numbers[0];

  if (numbers[0] == guess) {
    text.innerText += " \nNa mosca! Ganhou 20 moedas!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += " \nErrado! Perdeu 10 hp!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
