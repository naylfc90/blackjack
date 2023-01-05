let dealersHand = 1;
let dealerCount = 0;
let playerCount = 0;

let dealersAceCount = 0;
let playersAceCount = 0;

let hiddenCard;
let deck = [];
let playersHand = [];

let playerCanHit = true;

window.onload = () => {
  buildDeck();
  shuffleDeck();
  startGame();
};

const buildDeck = () => {
  let values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  let suits = ["Club", "Diamond", "Heart", "Spade"];

  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + suits[i]);
    }
  }

  return deck;
};

const shuffleDeck = () => {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // random index of the deck
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
};

const startGame = () => {
  hiddenCard = deck.pop();
  dealerCount += getValue(hiddenCard);
  dealersAceCount += checkForAce(hiddenCard);

  while (dealersHand < 2) {
    let card = deck.pop();
    renderDealersCard(card);
    dealerCount += getValue(card);
    dealersAceCount += checkForAce(card);
    dealersHand += 1;
  }

  for (let i = 0; i < 2; i++) {
    let card = deck.pop();
    playersHand.push(card);
    renderPlayersCard(card);
    playerCount += getValue(card);
    playersAceCount += checkForAce(card);
  }

  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stand").addEventListener("click", stand);
  return playersHand;
};

const renderDealersCard = (card) => {
  let cardImage = document.createElement("img");
  cardImage.src = "./assets/" + card + ".png";
  document.getElementById("dealer-cards").append(cardImage);
};

const renderPlayersCard = (card) => {
  let cardImage = document.createElement("img");
  cardImage.src = "./assets/" + card + ".png";
  document.getElementById("player-cards").append(cardImage);
};

const getValue = (card) => {
  let data = card.split("-");
  let cardValue = data[0];

  if (isNaN(cardValue)) {
    if (
      (cardValue === "A" && playerCount <= 10) ||
      (cardValue === "A" && dealerCount <= 10)
    ) {
      return 11;
    } else if (
      (cardValue === "A" && playerCount > 10) ||
      (cardValue === "A" && dealerCount > 10)
    ) {
      return 1;
    }
    return 10;
  }
  return parseInt(cardValue);
};

const checkForAce = (card) => {
  if (card[0] === "A") {
    return 1;
  }
  return 0;
};

const hit = () => {
  if (!playerCanHit) return;

  let card = deck.pop();
  playersHand.push(card);
  renderPlayersCard(card);
  playerCount += getValue(card);
  playersAceCount += checkForAce(card);

  if (handleAce(playerCount, playersAceCount) > 21) {
    playerCanHit = false;
    outcome = "Bust! You Lose!";
    document.getElementById("hit").style["background-color"] = "gray";
    document.getElementById("hit").style.color = "black";
    document.getElementById("hit").disabled = true;
    document.getElementById("hit").innerText = "BUST";

    document.getElementById("stand").innerText = "Results";
  }
};

const handleAce = (playerCount, playersAceCount) => {
  while (playerCount > 21 && playersAceCount > 0) {
    playerCount -= 10;
    playersAceCount -= 1;
  }

  return playerCount;
};

const stand = () => {
  playerCanHit = false;

  while (dealerCount < 17) {
    let card = deck.pop();
    renderDealersCard(card);
    dealerCount += getValue(card);
    dealersAceCount += checkForAce(card);
  }

  dealerCount = handleAce(dealerCount, dealersAceCount);
  playerCount = handleAce(playerCount, playersAceCount);

  document.getElementById("hidden-card").src =
    "./assets/" + hiddenCard + ".png";

  document.getElementById("hit").style["background-color"] = "gray";
  document.getElementById("hit").style.color = "black";
  document.getElementById("hit").disabled = true;
  document.getElementById("stand").style["background-color"] = "gray";
  document.getElementById("stand").style.color = "black";
  document.getElementById("stand").disabled = true;

  let outcome = "";
  if (playerCount > 21) {
    outcome = "Bust! You Lose!";
  } else if (dealerCount > 21) {
    outcome = "You Win!";
  } else if (playerCount === dealerCount) {
    outcome = "It's a Draw!";
  } else if (playerCount > dealerCount) {
    outcome = "You Win!";
  } else if (playerCount < dealerCount) {
    outcome = "You Lose!";
  }

  document.getElementById("outcome").innerText = outcome;
  document.getElementById("outcome").style.margin = "auto";
  document.getElementById("outcome").style["background-color"] = "#f3f3f4";
  document.getElementById("outcome").style["margin-top"] = "5px";
  document.getElementById("outcome").style.padding = "5px";
  document.getElementById("outcome").style.color = "black";
  document.getElementById("outcome").style.width = "150px";
  document.getElementById("outcome").style["border-radius"] = "23px";
  document.getElementById("outcome").style.border = "1px solid black";

  document.getElementById("dealer-count").innerText = dealerCount;
  document.getElementById("player-count").innerText = playerCount;

  let newGameButton = document.createElement("button");
  newGameButton.innerText = "New Game";
  document.getElementById("controls").append(newGameButton);
  newGameButton.style["background-color"] = "dodgerblue";

  newGameButton.addEventListener("click", resetGame);
};

const resetGame = () => {
  window.location.reload();
};

module.exports = {
  buildDeck,
  shuffleDeck,
  startGame,
  getValue,
  checkForAce,
  hit,
  stand,
  handleAce,
  resetGame,
};
