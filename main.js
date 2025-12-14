import { 
  cardValues, 
  resetObjects, 
  resetBoard, 
  displayCard, 
  displayHoleCard, 
  disableHitStand 
} from './utilities.js';


let winner = document.getElementById("winner-text")
let pScore = document.getElementById("player-total")
let dScore = document.getElementById("dealer-total")
let card_deck = "", deck_id = ""

export const player = {
    deck : [],
    score : 0,
    ace11 : false
}

export const dealer = {
    deck : [],
    score : 0,
    ace11 : false
}


function first2CardsValues(user){
    if(user.deck[0].value === "ACE" && user.deck[1].value === "ACE"){
        user.score = 12
        user.ace11 = true
    }
    else{
        if(user.deck[0].value === "ACE" || user.deck[1].value === "ACE"){
            user.ace11 = true
        }
        user.score = cardValues[user.deck[0].value] + cardValues[user.deck[1].value]  
    }
}


async function loadGame(){
    deck_id = 0
    resetObjects();
    resetBoard();

    const cardBack_src = "https://deckofcardsapi.com/static/img/back.png"
    // Fetch card deck
    card_deck = await(await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")).json() 
    console.log(card_deck)

    // Fetch deck id
    deck_id = card_deck.deck_id
    console.log("Deck id is ",deck_id)

    // Fetch first 4 cards, 2 per player
    const first4cards = await(await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=4`)).json()
    console.log("first four cards",first4cards)

    // Add cards to each player's decks
    player.deck.push(first4cards.cards[0])
    dealer.deck.push(first4cards.cards[1])
    player.deck.push(first4cards.cards[2])
    dealer.deck.push(first4cards.cards[3])

    console.log(player.deck)
    console.log(dealer.deck)

    // Display first 4 cards
    displayCard("player-hand", player.deck[0].images.svg)
    displayCard("dealer-hand", dealer.deck[0].images.svg)
    displayCard("player-hand", player.deck[1].images.svg)
    displayCard("dealer-hand", cardBack_src)

    // Calculate score for first 2 cards
    first2CardsValues(player);  
    first2CardsValues(dealer);
}


async function startGame(){
    await loadGame();

    pScore.textContent = player.score;     

    console.log("Player score is ",player.score,"\nDealer Score is ", dealer.score)

    if (player.score == 21 && dealer.score == 21){
        displayResults(21, "Game Tied!")
    }
    else if (player.score == 21){
        displayResults(21, "Blackjack!!! You Win🎉")
    }
    else if (dealer.score == 21){ 
        displayResults(21, "Blackjack!!! Dealer Wins")
    }
}

function displayResults(score, msg){
    winner.textContent = msg
    player.score = score
    pScore.textContent = score
    dScore.textContent = dealer.score
    disableHitStand();
    displayHoleCard();
}

function calculatePlScore(value, score){
    if (score + cardValues[value] ==  21){
        displayResults(21, "You Win!!! 🎉")
    }
    else if(score + cardValues[value] <  21){
        player.score = score + cardValues[value]
        pScore.textContent = player.score
        if (value === "ACE"){
            player.ace11 = true
        }
    }
    else{
        if(value === "ACE"){
            player.score = score + 1
            if (player.score == 21){
                displayResults(21, "You Win!!! 🎉")
            }
            pScore.textContent = player.score
        }
        else if(player.ace11){
            player.score = (score - 11) + 1 + cardValues[value]
            player.ace11 = false
            pScore.textContent = player.score
        }
        else{ // score still greater than 21
            displayResults(cardValues[value] + score, "Bust!!! You Lose :(")
        }
    }
}



async function playerHit(){
    if (player.score < 21){
        const cardDrawn = await(await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)).json()
        player.deck.push(cardDrawn.cards[0])
        console.log("Card drawn is ",cardDrawn.cards[0])
        displayCard("player-hand", cardDrawn.cards[0].images.svg)

        let val = cardDrawn.cards[0].value
        calculatePlScore(val, player.score)
    }
}


function compareScores(){
    if (dealer.score > 21){
        winner.textContent = "You Win!!!🎉" 
        dScore.textContent = dealer.score 
        disableHitStand();
    }
    else if (player.score < dealer.score){
            winner.textContent = "Dealer Wins!!!"
            dScore.textContent = dealer.score
            disableHitStand();
        }
    else if (player.score > dealer.score){
            winner.textContent = "You Win!!!🎉" 
            dScore.textContent = dealer.score 
            disableHitStand();
        }
    else{
            winner.textContent = "Game Tied!" 
            dScore.textContent = dealer.score
            disableHitStand();
    }
}

async function dealerHit(){
    displayHoleCard();
    while(dealer.score < 17 || (dealer.score == 17 && dealer.ace11) ){
        const cardDrawn = await(await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)).json()
        dealer.deck.push(cardDrawn.cards[0])
        let val = cardDrawn.cards[0].value
        displayCard("dealer-hand", cardDrawn.cards[0].images.svg)
        dealer.score += cardValues[val]

        if(val === "ACE"){
            dealer.ace11 = true
        }
        if(dealer.score > 21 && dealer.ace11){
            dealer.score -= 10
            dealer.ace11 = false
        }

    }
    compareScores();
}


window.addEventListener("DOMContentLoaded", () => {
    startGame();

    document.querySelector("#hit-btn").addEventListener("click", playerHit);
    document.querySelector("#stand-btn").addEventListener("click", dealerHit);
    document.querySelector("#play-again").addEventListener("click", startGame);
});
    

