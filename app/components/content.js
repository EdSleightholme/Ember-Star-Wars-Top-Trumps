import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object'

export default class MessagesComponent extends Component {
    numberPeople = 0;
    numberShips = 0;
    @tracked wins = 0;
    @tracked lost = 0;
    @tracked winner = false;
    @tracked loser = false;
    @tracked selectedStat = 0;
    @tracked played = false;
    @tracked cardItems = [{
        player: true,
    },
    {
    }]


    @action
    fetchFromApi(type, numberForApi, cardNumber) {
        const requestUrl = 'https://swapi.dev/api/' + type + '/' + numberForApi + '/';
        let tempCardItems = this.cardItems
        fetch(requestUrl)
            .then(response => response.json())
            .then(json => {
                if (type == "people") {
                    const cardData = {
                        ...tempCardItems[cardNumber], name: json.name, stats: [
                            { name: "height", value: json.height },
                            { name: "mass", value: json.mass }]
                    };
                    tempCardItems[cardNumber] = cardData;

                    //Done to cause card to reload
                    this.cardItems = tempCardItems;
                } else if (type == "starships") {
                    const cardData = {
                        ...this.cardItems[cardNumber], name: json.name, stats: [
                            { name: "Cost", value: json.cost_in_credits },
                            { name: "Crew", value: json.crew }]
                    };
                    tempCardItems[cardNumber] = cardData;

                    //Done to cause card to reload
                    this.cardItems = tempCardItems;
                }
            })

    }

    loadCards(peopleOrShips) {
        if (peopleOrShips) {
            this.fetchFromApi("people", Math.floor(Math.random() * this.numberPeople - 1) + 1, 0);
            this.fetchFromApi("people", Math.floor(Math.random() * this.numberPeople - 1) + 1, 1);
        } else {
            this.fetchFromApi("starships", Math.floor(Math.random() * this.numberShips - 1) + 1, 0);
            this.fetchFromApi("starships", Math.floor(Math.random() * this.numberShips - 1) + 1, 1);
        }
    }

    @action
    loadGame() {
        fetch('https://swapi.dev/api/people/')
            .then(response => response.json())
            .then(json => {
                this.numberPeople = json.count;
                this.loadCards(true)
            })
        fetch('https://swapi.dev/api/starships/')
            .then(response => response.json())
            .then(json => {
                this.numberShips = json.count
            })


    }
    @action
    confirm() {
        if (this.played) {
            this.played = false
            this.winner = false
            this.loser = false
            this.loadCards(Math.floor(Math.random() * 10) % 2 == 0)
        } else {
            const playersNumber = this.cardItems[0].stats[this.selectedStat].value;
            const oppNumber = this.cardItems[1].stats[this.selectedStat].value;
            if (!playersNumber || playersNumber <= oppNumber) {
                this.lost = this.lost + 1
                this.loser = true
            } else if (!oppNumber || playersNumber > oppNumber) {
                this.wins = this.wins + 1
                this.winner = true
            }
            this.played = true
        }
    }

    @action
    selectStat(value) {
        this.selectedStat = value;
    }
}