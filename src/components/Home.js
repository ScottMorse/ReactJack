import React, { Component } from 'react'
import '../styles/home.css'

const suits = {
    clubs: '♣',spades: '♠', 
    diamonds:'♦', hearts:'♥'
}

const cards = {
    '2':2, '3':3,
    '4':4, '5':5,
    '6':6, '7':7,
    '8':8, '9':9,
    '10':10, 
    'Jack':10,'Queen':10, 
    'King':10, 'Ace':11
}

class Card extends Component {
    render(){
        const suitSymbol = suits[this.props.suit]
        const cardName = this.props.name
        return (
            <div id={"Card" + this.props.cardKey} data-weight={this.props.weight} className={"Card " + (suitSymbol === '♣' || suitSymbol === '♠' ? 'black-card':'red-card')}>
                <div className="card-top">
                    <div className="card-suit">{suitSymbol}</div>
                    <div className="card-name">{cardName}</div>
                </div>
                <div className="card-bottom">
                    <div className="card-name">{cardName}</div>
                    <div className="card-suit">{suitSymbol}</div>
                </div>
            </div>
        )
    }
}

let cardKey = 0
function createDeck(){
    const deck = []
    Object.keys(suits).forEach(cardSuit => {
        Object.keys(cards).forEach(cardName => {
            const cardWeight = cards[cardName]
            cardKey++
            deck.push({name:cardName,suit:cardSuit,weight:cardWeight,key:cardKey})
        })
    })
    return deck
}

class Deck extends Component {

    render() {
        return (
            <div id="deck">
                {createDeck().map(cardProps => {
                    return <Card name={cardProps.name} suit={cardProps.suit} weight={cardProps.weight} key={cardProps.key} cardKey={cardProps.key}/>
                })}
                <div className="face-down Card"></div>
            </div>
        )
    }
}

let playerBet = 5

let playerCash = 100
export class Home extends Component {
    componentDidMount(){
        document.title = "Blackjack"
    }
    render() {
        return (
            <div id="page-wrap">
                <h1>B<span className="red">l</span>a<span className="red">c</span>k<span className="red">j</span>a<span className="red">c</span>k</h1>
                <div id="hit-stand" className="user-question">
                    <button id="hit" className="choice-button">Hit</button>
                    <button id="stand" className="choice-button">Stand</button>
                </div>
                <div id="tie" className="user-question end-message">Draw</div>
                <div id="dealer-bust" className="user-question end-message">Dealer Busted!</div>
                <div id="shuffling" className="user-question end-message">Shuffling</div>
                <div id="player-bust" className="user-question end-message">You Busted</div>
                <div id="dealer-win" className="user-question end-message">Dealer won</div>
                <div id="player-win" className="user-question end-message">You won!</div>
                <div id="dealer-blackjack" className="user-question end-message">Dealer Blackjack</div>
                <div id="player-blackjack" className="user-question end-message">Blackjack</div>
                <div id="bet-changer" className="user-question">
                    <div id="bet-title">Bet: ${playerBet}</div>
                    <div id="bet-done" className="user-question">Done</div>
                    <div id="arrows">
                        <div id="up-arrow" className="arrow"></div>
                        <div id="down-arrow" className="arrow"></div>
                    </div>
                </div>
                <div id="cash">
                    <div id="current-bet">Bet: ${playerBet}</div><br/>
                    <span id="current-cash">{'$' + playerCash}</span>
                </div>
                <div id="deck">
                    <Deck/>
                </div>
            </div>
        )
    }
}
console.log(Card)
let totalCards = []
let i = 1
while(i <= 52){
    totalCards.push(i)
    i++
}
function randomCard(){
    const randInt = Math.round(Math.random() * (totalCards.length - 1))
    const randCardKey = totalCards[randInt]
    totalCards = totalCards.slice(0,randInt).concat(totalCards.slice(randInt + 1,totalCards.length))
    return document.getElementById("Card" + randCardKey)
}

let dealerZ = 0
let dealerX = -150
let dealerWeight = 0
let dealerHasAce = false
let dealerCards = []
let dealerFaceDownCard
let dealerBusted = false
let dealerBlackjack = false
function dealToDealer(faceDown){
    if(totalCards.length == 0){
        cardKey = 0
        blinkMessage('shuffling')
        const deck = document.getElementById('deck')
        deck.innerHTML = ''
        createDeck().map(cardProps => {
            const newCard = React.createElement(Card,
                {
                    name: cardProps.name,
                    suit: cardProps.suit,
                    weight: cardProps.weight,
                    key: cardProps.key,
                    cardKey: cardProps.key,
                }
            )
            deck.appendChild(newCard)
            cardKey++
        })
    }
    const selectedCard = randomCard()
    selectedCard.style.transform = 'translate(' + dealerX + 'px,155px)'
    selectedCard.style.zIndex = dealerZ
    if(faceDown){
        dealerFaceDownCard = document.createElement('div')
        dealerFaceDownCard.style.zIndex = selectedCard.style.zIndex + 1
        dealerFaceDownCard.classList.add('face-down-child')
        selectedCard.appendChild(dealerFaceDownCard)
    }
    dealerCards.push(selectedCard)
    const cardWeight = parseInt(selectedCard.dataset.weight)
    if(cardWeight === 11){
        dealerHasAce = true
    }
    dealerWeight += cardWeight
    if(dealerWeight > 21 & dealerHasAce){
        dealerWeight = 0
        dealerCards = dealerCards.sort((a,b)=> parseInt(a.dataset.weight) > parseInt(b.dataset.weight) ? 1:-1)
        dealerCards.forEach(card => {
            const cardWeight2 = parseInt(card.dataset.weight)
            if(cardWeight2 === 11){
                if(dealerWeight + 11 > 21){
                    dealerWeight += 1
                }
                else{
                    dealerWeight += 11
                }
            }
            else{
                dealerWeight += cardWeight2
            }
        })
    }
    if(dealerWeight > 21){
        dealerBusted = true
        dealerBust()
        return
    }
    dealerX += 70
    dealerZ++
}

let playerZ = 0
let playerX = -150
let playerWeight = 0
let playerHasAce = false
let playerCards = []
let playerBusted = false
let playerBlackjack = false
function dealToPlayer(){
    if(totalCards.length == 0){
        cardKey = 0
        blinkMessage('shuffling')
        const deck = document.getElementById('deck')
        deck.innerHTML = ''
        createDeck().map(cardProps => {
            const newCard = React.createElement(Card,
                {
                    name: cardProps.name,
                    suit: cardProps.suit,
                    weight: cardProps.weight,
                    key: cardProps.key,
                    cardKey: cardProps.key,
                }
            )
            deck.appendChild(newCard)
            cardKey++
        })
    }
    if(playerZ <= dealerZ){
        playerZ = dealerZ + 20
    }
    const selectedCard = randomCard()
    selectedCard.style.zIndex = playerZ
    selectedCard.style.transform = 'translate(' + playerX + 'px,355px)'
    playerCards.push(selectedCard)
    const cardWeight = parseInt(selectedCard.dataset.weight)
    if(cardWeight === 11){
        playerHasAce = true
    }
    playerWeight += cardWeight
    if(playerWeight > 21 & playerHasAce){
        playerWeight = 0
        playerCards = playerCards.sort((a,b)=> parseInt(a.dataset.weight) > parseInt(b.dataset.weight) ? 1:-1)
        playerCards.forEach(card => {
            const cardWeight2 = parseInt(card.dataset.weight)
            if(cardWeight2 === 11){
                if(playerWeight + 11 > 21){
                    playerWeight += 1
                }
                else{
                    playerWeight += 11
                }
            }
            else{
                playerWeight += cardWeight2
            }
        })
    }
    if(playerWeight > 21){
        playerBusted = true
        playerBust()
        toggleHitStand(false)
        return
    }
    playerX += 70
    playerZ++
}

let firstRound = true

function dealerBust(){
    blinkMessage('dealer-bust')
    setTimeout(()=>toggleShowBet(true),2000)
    playerWin()
}

function playerBust(){
    setTimeout(()=>toggleShowBet(true),2000)
    blinkMessage('player-bust')
    dealerWin()
}

function dealerWin(){
    playerCash -= playerBet
    const currentCash = document.getElementById('current-cash')
    currentCash.innerHTML = '$' + playerCash
    setTimeout(()=>{
        if(firstRound){
            const newFaceDown = document.createElement('div')
            newFaceDown.classList.add('face-down-discard')
            newFaceDown.classList.add('Card')
            newFaceDown.style.zIndex = 10000
            document.getElementById("deck").appendChild(newFaceDown)
            playerCards.push(newFaceDown)
            setTimeout(()=>newFaceDown.style.opacity = 1,100)
            firstRound = false
        }
        playerCards.forEach(card => card.style.transform = 'translate(200px,200px)')
        dealerCards.forEach(card => card.style.transform = 'translate(200px,200px)')
    },1000)
}

function blinkMessage(elId){
    const winMessage = document.getElementById(elId)
    winMessage.style.display = 'flex'
    setTimeout(()=>{
        winMessage.style.opacity = 1
        setTimeout(()=>{
            winMessage.style.opacity = 0
            setTimeout(()=>winMessage.style.display = 'none',800)
        },1600)
    },100)
}

function playerWin(){
    if(!playerBlackjack){
        playerCash += playerBet
    }
    else{
        playerCash += Math.floor(playerBet * (3/2))
    }
    const currentCash = document.getElementById('current-cash')
    currentCash.innerHTML = '$' + playerCash
    const currentBet = document.getElementById('current-bet')
    const betTitle = document.getElementById('bet-title')
    currentBet.innerHTML = betTitle.innerHTML = 'Bet: $' + playerBet
    setTimeout(()=>{
        if(firstRound){
            const newFaceDown = document.createElement('div')
            newFaceDown.classList.add('face-down-discard')
            newFaceDown.classList.add('Card')
            newFaceDown.style.zIndex = 10000
            document.getElementById("deck").appendChild(newFaceDown)
            dealerCards.push(newFaceDown)
            setTimeout(()=>newFaceDown.style.opacity = 1,100)
            firstRound = false
        }
        playerCards.forEach(card => card.style.transform = 'translate(200px,200px)')
        dealerCards.forEach(card => card.style.transform = 'translate(200px,200px)')
    },1000)
}

function toggleHitStand(show){
    const hitStand = document.getElementById('hit-stand')
    if(!show){
        hitStand.style.opacity = 0
        setTimeout(()=>hitStand.style.display = 'none',800)
    }
    else{
        hitStand.style.display = 'flex'
        setTimeout(()=>hitStand.style.opacity = 1,100)
    }
}

function firstDeal(){
    playerCards = []
    dealerCards = []
    playerWeight = 0
    dealerWeight = 0
    playerBlackjack = false
    dealerBlackjack = false
    dealerHasAce = false
    playerHasAce = false
    dealerBusted = false
    playerBusted = false
    dealerZ = 0
    playerZ = 0
    playerX = -150
    dealerX = -150
    setTimeout(dealToPlayer,325)
    setTimeout(dealToPlayer,650)
    setTimeout(dealToDealer,975)
    setTimeout(()=>dealToDealer(true),1300)
    setTimeout(()=>toggleHitStand(true),1600)
    setTimeout(()=>{
        if(playerWeight == 21 && dealerWeight != 21){
            playerBlackjack = true
            dealerReveal()
            toggleHitStand(false)
            blinkMessage('player-blackjack')
            setTimeout(()=>toggleShowBet(true),2000)
            playerWin()
        }
        else if(playerWeight != 21 && dealerWeight == 21){
            dealerBlackjack = true
            dealerReveal()
            toggleHitStand(false)
            blinkMessage('dealer-blackjack')
            setTimeout(()=>toggleShowBet(true),2000)
            dealerWin()
        }
        else if(playerWeight == 21 && dealerWeight == 21){
            dealerReveal()
            blinkMessage('tie')
            setTimeout(()=>toggleShowBet(true),2000)
            tieGame()
        }
    },2000)
}

function dealerReveal(){
    console.log(dealerCards)
    const faceDownChild = dealerCards[1].lastChild
    faceDownChild.style.opacity = 0
}

function nextDeal(){
    toggleShowBet(false)
    firstDeal()
}

function stand(){
    dealerReveal()
    toggleHitStand(false)
    setTimeout(()=>{
        let t = setInterval(()=>{
            if(dealerWeight >= 17 || dealerBusted){
                clearInterval(t)
                endRoundNoBust()
            }
            else if(dealerBusted){
                clearInterval(t)
            }
            else{
                dealToDealer()
            }
        },300)
    },300)
}

let firstBet = true
function toggleShowBet(show){
    if(firstBet){
        const upArrow = document.getElementById('up-arrow')
        const downArrow = document.getElementById('down-arrow')
        const doneButton = document.getElementById('bet-done')
        const hitButton = document.getElementById('hit')
        const standButton = document.getElementById('stand')
        hitButton.addEventListener('click',dealToPlayer)
        standButton.addEventListener('click',stand)
        upArrow.addEventListener('click',()=>changeBet(true))
        downArrow.addEventListener('click',()=>changeBet(false))
        doneButton.addEventListener('click',nextDeal)
        firstBet = false
    }
    const betChanger = document.getElementById('bet-changer')
    if(!show){
        betChanger.style.opacity = 0
        setTimeout(()=>betChanger.style.display = 'none',800)
    }
    else{
        betChanger.style.display = 'flex'
        setTimeout(()=>betChanger.style.opacity = 1,100)
    }
}

function changeBet(up){
    if(up){
        if(playerBet == playerCash){
            return
        }
        playerBet += 1
    }
    else{
        if(playerBet == 1){
            return
        }
        playerBet -= 1
    }
    const currentBet = document.getElementById('current-bet')
    const betTitle = document.getElementById('bet-title')
    currentBet.innerHTML = betTitle.innerHTML = 'Bet: $' + playerBet
}

function tieGame(){
    blinkMessage('tie')
    setTimeout(()=>{
        if(firstRound){
            const newFaceDown = document.createElement('div')
            newFaceDown.classList.add('face-down-discard')
            newFaceDown.classList.add('Card')
            newFaceDown.style.zIndex = 10000
            document.getElementById("deck").appendChild(newFaceDown)
            dealerCards.push(newFaceDown)
            setTimeout(()=>newFaceDown.style.opacity = 1,100)
            firstRound = false
        }
        playerCards.forEach(card => card.style.transform = 'translate(200px,200px)')
        dealerCards.forEach(card => card.style.transform = 'translate(200px,200px)')
    },1000)
}

function endRoundNoBust(){
    dealerReveal()
    setTimeout(()=>toggleShowBet(true),2000)
    if(dealerWeight > playerWeight && !dealerBusted){
        blinkMessage('dealer-win')
        dealerWin()
    }
    else if(playerWeight > dealerWeight && !playerBusted){
        if(playerBlackjack){
            blinkMessage('player-win')
        }
        else{
            blinkMessage('player-win')
        }
        playerWin()
    }
    else if(!dealerBusted && !playerBusted){
        tieGame()
    }
}

window.addEventListener('load',()=>toggleShowBet(true))