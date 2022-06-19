const main = document.querySelector('.container');
const selectionArea = document.getElementById('section-selection');
const quizArea = document.getElementById('section-quiz');

const levelDropdown = document.querySelector('#select-level');
const geoSelection = document.querySelector('.geo-param-list');
const levelSelection = document.querySelector('#level-list');

const startButton = document.getElementById('btn-start');
const nextButton = document.getElementById('btn-next');
const progressDisplay = document.getElementById('display-progress');
const progressBar = document.querySelector('progress');

const answerButtonsAll = document.querySelectorAll('.btn-answer');
const answerButton1 = document.getElementById('btn-answer-1');
const answerButton2 = document.getElementById('btn-answer-2');
const answerButton3 = document.getElementById('btn-answer-3');

let quizCategory;

let usedEntities = {};

let jsonData;
let filteredJson;

let round = 0;
let points = 0;

// TODO: Implement Mulitplayer mode

document.addEventListener('load', loadData());

geoSelection.addEventListener('change', () => {
	if (geoSelection.value !== 'All') {
		levelDropdown.classList.add('disabled');
		levelSelection.value = 'all';
		levelSelection.disabled = true;
	} else {
		levelDropdown.classList.remove('disabled');
		levelSelection.disabled = false;
	}
});

levelDropdown.addEventListener('click', () => {
	if (!levelDropdown.classList.contains('disabled')) {
		return;
	}
	const tooltip = document.createElement('p');
	tooltip.classList.add('tooltip');
	tooltip.innerText = 'Kombinierte Auswahl nicht möglich';
	levelDropdown.append(tooltip);
	setTimeout(() => {
		tooltip.remove();
	}, 1500);
});

startButton.addEventListener('click', () => startGame(geoSelection, levelSelection));

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

async function loadData() {
	let path = window.location.pathname;
	quizCategory = path.split('/').pop().replace('.html', '');
	let response = await fetch(`data/${quizCategory}.json`);
	jsonData = await response.json();
}

function startGame(geoSelection, levelSelection) {
	round++;
	filteredJson = filterJson(geoSelection, levelSelection);
	selectionArea.classList.add('hidden');
	quizArea.classList.remove('hidden');
	displayQuestion(filteredJson);
}

function filterJson(geoSelection, levelSelection) {
	let filtered;
	if (quizCategory === 'countries') {
		filtered = Object.values(jsonData).filter((country) => {
			if (geoSelection.value !== 'All') {
				return country.continent === geoSelection.value;
			} else if (levelSelection.value !== 'all') {
				return country.level === levelSelection.value;
			}
			return true;
		});
	} else {
		filtered = Object.values(jsonData).filter((island) => {
			if (geoSelection.value !== 'all') {
				if (geoSelection.value === 'large') {
					return island.areaInKm2 >= 70000;
				} else if (geoSelection.value === 'medium') {
					return island.areaInKm2 >= 20000 && island.areaInKm2 < 70000;
				} else if (geoSelection.value === 'small') {
					return island.areaInKm2 < 20000;
				}
			} else if (levelSelection.value !== 'all') {
				return island.level === levelSelection.value;
			}
			return true;
		});
	}
	return filtered;
}

function displayQuestion() {
	const svgElement = document.querySelector('#svg');
	let tempExcluded = [];
	let correctEntity = getRandomEntity('correct', tempExcluded);
	let wrongEntity1 = getRandomEntity('wrong', tempExcluded);
	let wrongEntity2 = getRandomEntity('wrong', tempExcluded);
	resetStyles();
	fillButtons(correctEntity, wrongEntity1, wrongEntity2);
	svgElement.src = `data/svg/${quizCategory}/${correctEntity.filename}`;
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

function getRandomEntity(param, tempExcluded) {
	let random = getRandomNumber(tempExcluded);
	let randomEntity = filteredJson[random];
	if (param === 'correct') {
		usedEntities[random] = randomEntity;
	}
	tempExcluded.push(random);
	return randomEntity;
}

function getRandomNumber(tempExcluded) {
	const countEntries = Object.keys(jsonData).length;
	let random = Math.floor(Math.random() * countEntries);
	if (random in usedEntities || !filteredJson[random] || tempExcluded.includes(random)) {
		return getRandomNumber(tempExcluded);
	} else {
		return random;
	}
}

function fillButtons(correctEntity, wrongEntity1, wrongEntity2) {
	let buttonSequence = shuffle([answerButton1, answerButton2, answerButton3]);
	buttonSequence[0].innerText = correctEntity.nameGer;
	buttonSequence[0].dataset.answer = 'true';
	buttonSequence[1].innerText = wrongEntity1.nameGer;
	buttonSequence[1].dataset.answer = 'false';
	buttonSequence[2].innerText = wrongEntity2.nameGer;
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
	const resultArea = document.createElement('div');
	const resultDisplay = document.createElement('p');
	const continueButtons = document.createElement('div');
	const playAgainButton = document.createElement('button');
	const backToStartButton = document.createElement('button');

	quizArea.classList.toggle('hidden');

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
		startGame(geoSelection, levelSelection);
	});

	backToStartButton.addEventListener('click', () => {
		resetGame(resultArea);
		selectionArea.classList.remove('hidden');
	});
}

function resetGame(resultArea) {
	resultArea.remove();
	progressBar.value = 0;
	round = 0;
	points = 0;
	usedEntities = {};
}
