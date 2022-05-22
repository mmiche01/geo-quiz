const selectionArea = document.getElementById('section-selection');
const quizArea = document.getElementById('section-quiz');
const startButton = document.getElementById('btn-start');

let countriesJson;

startButton.addEventListener('click', () => {
	startGame();
});

function startGame() {
	selectionArea.classList.add('hidden');
	quizArea.classList.remove('hidden');
}

async function getJson(url) {
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

async function main() {
	//OPTION 1
	// getJson('data/countries.json').then((data) => console.log(data));

	//OPTION 2
	countriesJson = await getJson('data/countries.json');
}

main();
