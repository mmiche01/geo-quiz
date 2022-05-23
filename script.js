const selectionArea = document.getElementById('section-selection');
const quizArea = document.getElementById('section-quiz');
const startButton = document.getElementById('btn-start');

const answerButtonsAll = document.querySelectorAll('.btn-answer');
const answerButton1 = document.getElementById('btn-answer-1');
const answerButton2 = document.getElementById('btn-answer-2');
const answerButton3 = document.getElementById('btn-answer-3');

let usedCountries = {};

let countriesJson;

startButton.addEventListener('click', startGame);
answerButtonsAll.forEach((item) => {
	item.addEventListener('click', (event) => {
		validateAnswer(event);
	});
});

async function startGame() {
	countriesJson = await getJson('data/countries.json');
	selectionArea.classList.add('hidden');
	quizArea.classList.remove('hidden');
	displayQuestion();
}

async function getJson(url) {
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

function displayQuestion() {
	const countrySVG = document.getElementById('country-svg');
	let currentCountry = getRandomCountry();
}

function getRandomCountry() {
	let random = getRandomNumber();
	let randomCountry = countriesJson[random];
	usedCountries[random] = randomCountry;
	return randomCountry;
}

function getRandomNumber() {
	const countEntries = Object.keys(countriesJson).length;
	let random = Math.floor(Math.random() * countEntries);
	if (random in usedCountries) {
		getRandomNumber();
	}
	return random;
}

function validateAnswer(event) {
	event.target.classList.toggle('correct-answer');
	console.log(event.target);
}
