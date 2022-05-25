const selectionArea = document.getElementById('section-selection');
const quizArea = document.getElementById('section-quiz');

const continentSelection = document.getElementById('country-list');

const startButton = document.getElementById('btn-start');

const answerButtonsAll = document.querySelectorAll('.btn-answer');
const answerButton1 = document.getElementById('btn-answer-1');
const answerButton2 = document.getElementById('btn-answer-2');
const answerButton3 = document.getElementById('btn-answer-3');

let usedCountries = {};

let countriesJson;
let countriesJsonFiltered;

startButton.addEventListener('click', () => {
	startGame(continentSelection);
});

answerButtonsAll.forEach((item) => {
	item.addEventListener('click', (event) => {
		validateAnswer(event);
	});
});

async function startGame(continentSelection) {
	countriesJson = await getJson('data/countries.json');
	countriesJsonFiltered = Object.values(countriesJson).filter((value) => {
		if (continentSelection.value !== 'All') {
			return value.continent === continentSelection.value;
		}
		return true;
	});
	selectionArea.classList.add('hidden');
	quizArea.classList.remove('hidden');
	displayQuestion(countriesJsonFiltered);
}

async function getJson(url) {
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

function displayQuestion() {
	const countrySVG = document.getElementById('country-svg');
	let correctCountry = getRandomCountry('correct');
	let wrongCountry1 = getRandomCountry('wrong');
	let wrongCountry2 = getRandomCountry('wrong');
	fillButtons(correctCountry, wrongCountry1, wrongCountry2);
	countrySVG.src = `data/svg/${correctCountry.countryCode}.svg`;
	console.log(usedCountries);
}

function getRandomCountry(param) {
	let random = getRandomNumber();
	let randomCountry = countriesJsonFiltered[random];
	if (param === 'correct') {
		usedCountries[random] = randomCountry;
	}
	return randomCountry;
}

function getRandomNumber() {
	const countEntries = Object.keys(countriesJson).length;
	let random = Math.floor(Math.random() * countEntries);
	if (random in usedCountries || !countriesJsonFiltered[random]) {
		return getRandomNumber();
	} else {
		return random;
	}
}

function fillButtons(correctCountry, wrongCountry1, wrongCountry2) {
	let buttonSequence = shuffle([answerButton1, answerButton2, answerButton3]);
	buttonSequence[0].innerText = correctCountry.nameGer;
	buttonSequence[1].innerText = wrongCountry1.nameGer;
	buttonSequence[2].innerText = wrongCountry2.nameGer;
}

function validateAnswer(event) {
	event.target.classList.toggle('correct-answer');
	// console.log(event.target);
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
