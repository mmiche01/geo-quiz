const selection = document.getElementById('section-selection');
const container = document.getElementsByClassName('container')[0];
const imageSection = document.createElement('section');
const heading = document.createElement('h1');
const islands = [
	'Mallorca',
	'Lesbos',
	'Euboea',
	'Corfu',
	'Teneriffa',
	'Fuerteventura',
	'Iceland',
	'Malta',
	// 'Hokkaido',
	'Sumatra',
];

selection.classList.add('hidden');
imageSection.classList.add('temp-img-display');
heading.classList.add('temp-heading');
heading.innerText = 'Stay tuned...';
container.append(heading);
container.append(imageSection);

islands.forEach((item, index) => {
	const imgContainer = document.createElement('div');
	const svgElement = document.createElement('img');
	imgContainer.classList.add('svg');
	svgElement.id = `island-svg-${index + 1}`;
	svgElement.src = `data/svg/islands/${item}.svg`;
	imgContainer.append(svgElement);
	imageSection.append(imgContainer);
});
