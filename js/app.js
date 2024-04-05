let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["graveto"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'graveto', power: 5 },
  { name: 'adaga', power: 30 },
  { name: 'martelo', power: 50 },
  { name: 'espada', power: 100 }
];
const monsters = [
  {
    name: "Slime",
    level: 2,
    health: 15
  },
  {
    name: "Besta",
    level: 8,
    health: 60
  },
  {
    name: "Dragão",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Ir para o centro", "Explorar caverna", "Matar o Dragão"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Você está no centro. Você deveria olhar a loja..."
  },
  {
    name: "store",
    "button text": ["Comprar 10 hp (10 moedas)", "Comprar arma (30 moedas)", "Ir para o centro"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Você entra na loja."
  },
  {
    name: "cave",
    "button text": ["Lutar com Slime", "Lutar com Besta", "Ir para o centro"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Você entra na caverna e vê alguns monstros."
  },
  {
    name: "fight",
    "button text": ["Atacar", "Desviar", "Fugir"],
    "button functions": [attack, dodge, goTown],
    text: "Você está lutando com um monstro."
  },
  {
    name: "kill monster",
    "button text": ["Ir para o centro", "Ir para o centro", "Ir para o centro"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'o monstro grita "Arg!" antes de morrer. Você ganha ouro e xp'
  },
  {
    name: "lose",
    "button text": ["Replay", "Replay", "Replay"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["Replay", "Replay", "Replay"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Ir para o centro"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Você encontrou o segredo do rei, escolha uma das 2 opções para ser sorteado, mas cuidado, você pode morrer. Que os jogos comecem."
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

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
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
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
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Consegiui " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " Você possui no inventário: " + inventory;
    } else {
      text.innerText = "Você não tem recursos suficientes para comprar uma arma!";
    }
  } else {
    text.innerText = "Você já possui a arma mais poderosa!";
    button2.innerText = "Vender arma por 15 moedas";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
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

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
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
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Você perdeu.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Sua " + inventory.pop() + " quebrou.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Você desvia do ataque " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
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
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Você escolhe " + guess + ". O sorteio final foi: " + '\t'  + numbers[0];

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
