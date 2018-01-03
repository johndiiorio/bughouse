import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { connect } from 'react-redux';

function getLineColor(ratingType) {
	if (ratingType === 'Bullet') {
		return '#ff0000';
	} else if (ratingType === 'Blitz') {
		return '#00c6ff';
	} else {
		return '#00ff00';
	}
}

function mapStateToProps(state) {
	const data = { datasets: [] };

	const user = state.user.profileUsers[state.user.selectedProfile];
	if (state.user.selectedProfile && user) {
		data.datasets.push({
			label: 'Bullet',
			data: user.bulletRatings.map(rating => ({ x: rating[0], y: rating[1] })),
			fill: false,
			borderColor: getLineColor('Bullet'),
			lineTension: 0
		});
		data.datasets.push({
			label: 'Blitz',
			data: user.blitzRatings.map(rating => ({ x: rating[0], y: rating[1] })),
			fill: false,
			borderColor: getLineColor('Blitz'),
			lineTension: 0
		});
		data.datasets.push({
			label: 'Classical',
			data: user.classicalRatings.map(rating => ({ x: rating[0], y: rating[1] })),
			fill: false,
			borderColor: getLineColor('Classical'),
			lineTension: 0
		});
	}

	const options = {
		animation: {
			duration: 0
		},
		scales: {
			xAxes: [{
				type: 'time',
				scaleLabel: {
					display: true,
					labelString: 'Date'
				}
			}],
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Rating'
				}
			}]
		},
		tooltips: {
			mode: 'nearest',
			intersect: false,
			backgroundColor: 'rgba(0,0,0,0.6)',
			displayColors: false,
			callbacks: {
				title: tooltipItems => `${data.datasets[tooltipItems[0].datasetIndex].label}`,
				label: tooltipItems => `${moment(tooltipItems.xLabel).format('L')}: ${tooltipItems.yLabel}`
			}
		}
	};

	return {
		data,
		options,
		redraw: true
	};
}

export default connect(mapStateToProps)(Line);
