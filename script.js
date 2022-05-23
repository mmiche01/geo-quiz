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
	fillButtons(currentCountry);
	countrySVG.src = `data/svg/${currentCountry.countryCode}.svg`;
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

function fillButtons(currentCountry) {
	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
	let buttonSequence = shuffle([1, 2, 3]);
	answerButton1.innerText = currentCountry.nameGer;
	answerButton2.innerText = 'Test';
	answerButton3.innerText = 'Test';
}

function validateAnswer(event) {
	event.target.classList.toggle('correct-answer');
	console.log(event.target);
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
let myArray = [1, 2, 3, 4];
console.log(shuffle(myArray));
