import React from 'react';
import RemoteSettingForm from 'routes/Settings/components/RemoteSettingForm';
import { ChildFormMixin } from 'routes/Settings/mixins/SettingPageMixin';

import t from 'utils/tcomb-form';
import '../style.css';


const LogSection = React.createClass({
	mixins: [ ChildFormMixin('title', 'content') ],

	convertKey(suffix) {
		return 'log_' + this.props.section + (suffix ? ('_' + suffix) : '');
	},

	getInitialState() {
		return {
			enabled: null,
		};
	},

	onEnableStateReceived(data) {
		this.setState({
			enabled: data[this.convertKey()].value,
		});
	},

	onEnableStateChanged(id, formValue, hasChanges) {
		this.setState({ enabled: formValue[id] });
	},

	onContentSetting(id, fieldOptions, formValue) {
		fieldOptions['disabled'] = !this.state.enabled;
	},

	getChildClass(className) {
		if (this.state.enabled) {
			return className + ' active';
		}

		return className;
	},

	render() {
		const Title = {
			[this.convertKey()]: t.Bool,
		};

		const Content = {
			[this.convertKey('file')]: t.Str,
			[this.convertKey('format')]: t.Str,
		};

		return (
			<div className={ this.getChildClass('log-section') }>
				<div className={ this.getChildClass('title') }>
					<RemoteSettingForm
						ref="title"
						formItems={ Title }
						onFieldChanged={ this.onEnableStateChanged }
						onSourceDataChanged={ this.onEnableStateReceived }
					/>
				</div>

				<div className={ this.getChildClass('content') }>
					<RemoteSettingForm
						ref="content"
						formItems={ Content }
						onFieldSetting={ this.onContentSetting }
					/>
				</div>
			</div>
		);
	}
});

export default LogSection;