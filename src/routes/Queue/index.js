module.exports = {
	path: 'queue',

	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'sources', 
				component: require('./components/SourceDialog').default,
			}, {
				path: 'content', 
				component: require('./components/BundleFileDialog.jsx').default,
			} ]);
		}, 'queue-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Queue').default);
		}, 'queue');
	}
};

