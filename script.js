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

	answerButtonsAll.forEach((item) => {
		item.addEventListener('click', (event) => {
			validateAnswer(event);
		});
	});
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
	buttonSequence[0].dataset.answer = 'true';
	buttonSequence[1].innerText = wrongCountry1.nameGer;
	buttonSequence[1].dataset.answer = 'false';
	buttonSequence[2].innerText = wrongCountry2.nameGer;
	buttonSequence[2].dataset.answer = 'false';
}

function validateAnswer(event) {
	console.log(event.target);
	if (event.target.dataset.answer === 'true') {
		event.target.classList.toggle('correct-answer');
	} else {
		event.target.classList.toggle('wrong-answer');
		document.querySelector('[data-answer="true"]').classList.toggle('correct-answer');
	}
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
