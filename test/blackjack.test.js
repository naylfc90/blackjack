const {
  buildDeck,
  shuffleDeck,
  startGame,
  getValue,
  checkForAce,
  hit,
  stand,
  handleAce,
} = require("../src/blackjack");

describe("Blackjack", () => {
  describe("Start of round of Blackjack", () => {
    let deck;
    let playersHand;

    beforeEach(() => {
      playersHand = [];
      deck = buildDeck();
    });

    it("produces a built deck of 52 cards", () => {
      expect(deck.length).toEqual(52);
    });
    it("shuffles the built deck", () => {
      let unshuffledDeck = [...deck];
      shuffleDeck();
      expect(deck).not.toEqual(unshuffledDeck);
    });

    it("deals two cards to the player", () => {
      shuffleDeck();
      playersHand = startGame();
      expect(playersHand.length).toEqual(2);
    });
  });

  describe("Tests controls during round of Blackjack", () => {
    it("deals another card to the player when 'hit' is pressed", () => {
      shuffleDeck();
      playersHand = startGame();
      expect(playersHand.length).toEqual(2);

      hit();
      expect(playersHand.length).toEqual(3);
    });

    it("allows the player to hit when they have a valid hand", () => {
      let playerInitialCount = 0;
      let updatedPlayerCount = 0;
      let playersAceCount = 0;
      const playersHand = ["K-Heart", "2-Diamond"];

      playersHand.map((card) => {
        playerInitialCount += getValue(card);
        playersAceCount += checkForAce(card);
      });

      const updatedHand = [...playersHand, "5-Heart"];

      updatedHand.map((card) => {
        updatedPlayerCount += getValue(card);
        playersAceCount += checkForAce(card);
      });

      expect(updatedPlayerCount).toBeGreaterThan(playerInitialCount);
    });
  });

  describe("Checks outcome of round of Blackjack", () => {
    it("checks for win", () => {
      const dealerCount = 20;
      const playerCount = 21;

      expect(stand(dealerCount, playerCount)).toBe("You Win!");
    });

    it("checks for loss", () => {
      const dealerCount = 21;
      const playerCount = 20;

      expect(stand(dealerCount, playerCount)).toBe("You Lose!");
    });

    it("checks for draw", () => {
      const dealerCount = 20;
      const playerCount = 20;

      expect(stand(dealerCount, playerCount)).toBe("It's a Draw!");
    });

    it("checks that player is bust when over 21", () => {
      const playerCount = 22;
      const dealerCount = 23;

      expect(stand(dealerCount, playerCount)).toBe("BUST! You Lose!");
    });

    it("checks players hand is evaluated correctly", () => {
      const playersHand = ["K-Heart", "A-Spade"];
      let playerCount = 0;
      let playersAceCount = 0;

      playersHand.map((card) => {
        playerCount += getValue(card);
        playersAceCount += checkForAce(card);
      });

      playerCount = handleAce(playerCount, playersAceCount);

      expect(playerCount).toEqual(21);
    });

    it("checks players hand is re-evaluated correctly when player has ace", () => {
      const playersHand = ["K-Heart", "Q-Diamond", "A-Spade"];
      let playerCount = 0;
      let playersAceCount = 0;

      playersHand.map((card) => {
        playerCount += getValue(card);
        playersAceCount += checkForAce(card);
      });

      playerCount = handleAce(playerCount, playersAceCount);

      expect(playerCount).toEqual(21);
    });

    it("checks players hand is re-evaluated correctly when player has ace", () => {
      const playersHand = ["9-Heart", "A-Diamond", "A-Spade"];
      let playerCount = 0;
      let playersAceCount = 0;

      playersHand.map((card) => {
        playerCount += getValue(card);
        playersAceCount += checkForAce(card);
      });

      playerCount = handleAce(playerCount, playersAceCount);

      expect(playerCount).toEqual(21);
    });

    it.only("checks dealer does not receive more cards if they have score of 17 or above", () => {
      const dealersHand = ["A-Spade", "6-Diamond"];
      const dealerCount = 17;
      const playerCount = 18;

      expect(stand()).toBe("You Win!");
      expect(dealerHand.length).toBe(2);
    });
  });
});
