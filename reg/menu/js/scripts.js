var _timeElement10Digits = Array.from(Array(10)).map(function (n, i) {
	return i;
});
var _timeElement6Digits = _timeElement10Digits.slice(0, 6);
var _timeElement3Digits = _timeElement10Digits.slice(0, 3);
var _timeElementStructure = [[_timeElement3Digits, _timeElement10Digits], [_timeElement6Digits, _timeElement10Digits], [_timeElement6Digits, _timeElement10Digits]];

var clock = document.createElement('div');
clock.id = 'clock';
document.body.appendChild(clock);
var digitGroups = [];
requestAnimationFrame(update);

_timeElementStructure.forEach(function (digits) {
	var digitGroup = document.createElement('div');
	digitGroup.classList.add('digit-group');
	clock.appendChild(digitGroup);
	digitGroups.push(digitGroup);
	digits.forEach(function (digitList) {
		var digit = document.createElement('div');
		digit.classList.add('digit');
		digitList.forEach(function (n) {
			var ele = document.createElement('div');
			ele.classList.add('digit-number');
			ele.innerText = n;
			digit.appendChild(ele);
		});
		digitGroup.appendChild(digit);
	});
});

function update() {
	requestAnimationFrame(update);
	var date = new Date();
	var time = [date.getHours(), date.getMinutes(), date.getSeconds()].map(function (n) {
		return ('0' + n).slice(-2).split('').map(function (e) {
			return +e;
		});
	}).reduce(function (p, n) {
		return p.concat(n);
	}, []);
	time.forEach(function (n, i) {
		var digit = digitGroups[Math.floor(i * 0.5)].children[i % 2].children;
		Array.from(digit).forEach(function (e, i2) {
			return e.classList[i2 === n ? 'add' : 'remove']('highlight');
		});
	});
}
