const selectionArea = document.getElementById('section-selection');
const quizArea = document.getElementById('section-quiz');
const main = document.getElementsByClassName('container')[0];

const continentSelection = document.getElementById('country-list');
const levelSelection = document.getElementById('level-list');

const startButton = document.getElementById('btn-start');
const nextButton = document.getElementById('btn-next');
const progressDisplay = document.getElementById('display-progress');
const progressBar = document.getElementsByTagName('progress')[0];

const answerButtonsAll = document.querySelectorAll('.btn-answer');
const answerButton1 = document.getElementById('btn-answer-1');
const answerButton2 = document.getElementById('btn-answer-2');
const answerButton3 = document.getElementById('btn-answer-3');

let usedCountries = {};

let countriesJson;
let countriesJsonFiltered;

let round = 1;
let points = 0;

continentSelection.addEventListener('change', () => {
	const label = document.querySelector('.select-level label');
	if (continentSelection.value !== 'All') {
		label.classList.add('disabled');
		levelSelection.value = 'all';
		levelSelection.disabled = true;
	} else {
		label.classList.remove('disabled');
		levelSelection.disabled = false;
	}
});

startButton.addEventListener('click', () => startGame(continentSelection, levelSelection));

nextButton.addEventListener('click', () => {
	round++;
	if (round <= 10) {
		displayQuestion();
	} else {
		gameFinished();
	}
});

answerButtonsAll.forEach((button) => {
	button.addEventListener('click', (event) => {
		validateAnswer(event);
	});
});

async function startGame(continentSelection, levelSelection) {
	countriesJson = await getJson('data/countries.json');
	countriesJsonFiltered = filterJson(continentSelection, levelSelection);
	selectionArea.classList.add('hidden');
	quizArea.classList.remove('hidden');
	displayQuestion(countriesJsonFiltered);
}

async function getJson(url) {
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

function filterJson(continentSelection, levelSelection) {
	let filtered = Object.values(countriesJson).filter((value) => {
		if (continentSelection.value !== 'All') {
			return value.continent === continentSelection.value;
		} else if (levelSelection.value !== 'all') {
			return value.level === levelSelection.value;
		}
		return true;
	});
	return filtered;
}

function displayQuestion() {
	const svgElement = document.getElementById('country-svg');
	let tempExcluded = [];
	let correctCountry = getRandomCountry('correct', tempExcluded);
	let wrongCountry1 = getRandomCountry('wrong', tempExcluded);
	let wrongCountry2 = getRandomCountry('wrong', tempExcluded);
	resetStyles();
	fillButtons(correctCountry, wrongCountry1, wrongCountry2);
	svgElement.src = `data/svg/${correctCountry.countryCode}.svg`;

	// TODO: Help buttons?
}

function resetStyles() {
	answerButtonsAll.forEach((button) => {
		button.classList.remove('correct-answer', 'wrong-answer');
		button.disabled = false;
	});
	nextButton.disabled = true;
	progressBar.value = round;
	progressDisplay.innerText = `${round}/10`;
}

function getRandomCountry(param, tempExcluded) {
	let random = getRandomNumber(tempExcluded);
	let randomCountry = countriesJsonFiltered[random];
	if (param === 'correct') {
		usedCountries[random] = randomCountry;
	}
	tempExcluded.push(random);
	return randomCountry;
}

function getRandomNumber(tempExcluded) {
	const countEntries = Object.keys(countriesJson).length;
	let random = Math.floor(Math.random() * countEntries);
	if (random in usedCountries || !countriesJsonFiltered[random] || tempExcluded.includes(random)) {
		return getRandomNumber(tempExcluded);
	} else {
		return random;
	}
}

function fillButtons(correctCountry, wrongCountry1, wrongCountry2) {
	let buttonSequence = shuffle([answerButton1, answerButton2, answerButton3]);
	buttonSequence[0].innerText = correctCountry.nameGer;
	buttonSequence[0].dataset.answer = 'true';
	buttonSequence[1].innerText = wrongCountry1.nameGer;
	buttonSequence[1].dataset.answer = 'false';
	buttonSequence[2].innerText = wrongCountry2.nameGer;
	buttonSequence[2].dataset.answer = 'false';
}

function validateAnswer(event) {
	if (event.target.dataset.answer === 'true') {
		event.target.classList.add('correct-answer');
		points++;
	} else {
		event.target.classList.add('wrong-answer');
		document.querySelector('[data-answer="true"]').classList.add('correct-answer');
	}
	answerButtonsAll.forEach((button) => {
		button.disabled = true;
	});
	nextButton.disabled = false;
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function gameFinished() {
	quizArea.classList.toggle('hidden');
	const resultArea = document.createElement('div');
	const resultDisplay = document.createElement('p');
	const continueButtons = document.createElement('div');
	const playAgainButton = document.createElement('button');
	const backToStartButton = document.createElement('button');

	resultArea.id = 'result-area';
	resultDisplay.innerText = `Ergebnis: ${points} von 10 richtig`;
	continueButtons.id = 'continue-button-container';
	playAgainButton.id = 'btn-play-again';
	playAgainButton.classList.add('btn', 'btn-continue');
	playAgainButton.innerText = 'Nochmal';
	backToStartButton.id = 'btn-back-to-start';
	backToStartButton.classList.add('btn', 'btn-continue');
	backToStartButton.innerText = 'Zurück zum Start';
	continueButtons.append(playAgainButton, backToStartButton);
	resultArea.append(resultDisplay, continueButtons);
	main.append(resultArea);

	playAgainButton.addEventListener('click', () => {
		resetGame(resultArea);
		startGame(continentSelection, levelSelection);
	});

	backToStartButton.addEventListener('click', () => {
		resetGame(resultArea);
		selectionArea.classList.remove('hidden');
	});
}

function resetGame(resultArea) {
	resultArea.remove();
	progressBar.value = 0;
	round = 1;
	points = 0;
	usedCountries = {};
}
