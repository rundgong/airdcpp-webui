'use strict';

import React from 'react';

import Moment from 'moment';

import { Row } from './Grid';

import { SYSTEM_STATS_URL } from 'constants/SystemConstants';
import StatisticsPageDecorator from '../decorators/StatisticsPageDecorator';

const AboutPage = React.createClass({
	render() {
		const { stats } = this.props;

		const uptime = Moment.unix(stats.client_started).from(Moment());
		const buildDate = Moment(new Date(JSON.parse(UI_BUILD_DATE))).format('LLL');

		return (
				<div className="about-page">
					<div className="ui grid two column about-grid">
						<Row title="Application version" text={stats.client_version}/>
						<Row title="Web UI version" text={UI_VERSION}/>
						<Row title="Web UI build date" text={buildDate}/>
						<Row title="Started" text={uptime}/>
						<Row title="Active sessions" text={stats.active_sessions}/>
					</div>
				</div>
		);
	},
});

export default StatisticsPageDecorator(AboutPage, SYSTEM_STATS_URL, null, 5);