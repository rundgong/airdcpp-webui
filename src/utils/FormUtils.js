import invariant from 'invariant';
import t from 'utils/tcomb-form';

import { FieldTypes } from 'constants/SettingConstants';

import BrowseField from 'components/form/BrowseField';
import SelectField from 'components/form/SelectField';


const parse = function (v) {
	if (v === 'null') {
		return null;
	}

	return parseInt(v, 10);
};

const format = function (v) {
	return String(v);
};

const typeToField = (info) => {
	switch (info.type) {
		case FieldTypes.NUMBER: {
			if (info.min || info.max) {
				return t.Range(info.min, info.max);
			}
			return t.Positive;
		}
		case FieldTypes.BOOLEAN: return t.Bool;
		case FieldTypes.STRING:
		case FieldTypes.TEXT:
		case FieldTypes.FILE_PATH:
		case FieldTypes.DIRECTORY_PATH: return t.Str;
		case FieldTypes.LIST_STRING: return t.list(t.Str);
		case FieldTypes.LIST_NUMBER: return t.list(t.Num);
		default: 
	}

	return null;
};

const isListType = type => type === FieldTypes.LIST_OBJECT || type === FieldTypes.LIST_STRING || type === FieldTypes.LIST_NUMBER;

const parseFieldType = (info) => {
	const fieldComponent = typeToField(info);
	invariant(fieldComponent, 'Field type ' + info.type + ' is not supported');
	return info.optional ? t.maybe(fieldComponent) : fieldComponent;
};

const parseDefinitions = (definitions) => {
	const ret = definitions.reduce((reduced, def) => {
		if (def.type === FieldTypes.LIST_OBJECT) {
			reduced[def.key] = t.list(parseDefinitions(def.value_definitions));
		} else {
			reduced[def.key] = parseFieldType(def);
		}
		
		return reduced;
	}, {});

	return t.struct(ret);
};

const normalizeField = (value) => {
	if (value) {
		if (typeof value === 'object' && !Array.isArray(value)) {
			// Normalize object properies value.prop.id to value.prop 
			invariant(value.hasOwnProperty('id'), 'Invalid object supplied for valueMapToInfo (id property is required)');
			return value.id;
		} else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
			// Normalize each array item
			invariant(value[0].hasOwnProperty('id'), 'Invalid array supplied for form property (id property is required for values)');
			return value.map(normalizeField);
		}
	} else if (value === '') {
		// Normalize empty strings to null, which is used by tcomb 
		return null;
	}

	return value;
};

const normalizeEnumValue = (rawItem) => {
	return {
		value: rawItem.id,
		text: rawItem.name
	};
};

const normalizeValue = (value, fieldDefinitions) => {
	return fieldDefinitions.reduce((reducedValue, { key, type, value_definitions, defaultValue }) => {
		if (value && value.hasOwnProperty(key)) {
			const fieldValue = value[key];
			if (type === FieldTypes.LIST_OBJECT) {
				// Normalize each list object
				reducedValue[key] = fieldValue.map(arrayItem => normalizeValue(arrayItem, value_definitions));
			} else if (isListType(type)) {
				// Normalize each list value
				reducedValue[key] = fieldValue.map(normalizeField);
			} else {
				reducedValue[key] = normalizeField(fieldValue);
			}
		} else if (!value) {
			// Initialize empty value but don't merge missing fields into an existing value (we might be merging)
			reducedValue[key] = defaultValue ? defaultValue : null;
		}

		return reducedValue;
	}, {});
};

const intTransformer = {
	format: format,
	parse: parse
};

export default {
	// Migrates simple key -> value fields to an array that is compatible with the form
	// undefined values will also be initialized with nulled property fields
	normalizeValue,

	intTransformer,

	normalizeEnumValue,

	// Convert field definitions to tcomb type object
	// Note that there are additional field options that need to be handled separately
	parseDefinitions,

	parseFieldOptions(definition) {
		const options = {};

		// Field type
		switch (definition.type) {
			case FieldTypes.TEXT: {
				options['type'] = 'textarea';
				break;
			} 
			//case FieldTypes.FILE_PATH:
			case FieldTypes.DIRECTORY_PATH: {
				options['factory'] = t.form.Textbox;
				options['template'] = BrowseField;

				// TODO: file selector dialog
				options['config'] = {
					isFile: definition.type === FieldTypes.FILE_PATH
				};
			}
			default:
		}

		// Captions
		options['legend'] = definition.title;
		options['help'] = definition.help;

		// Enum select field?
		if (definition.values) {
			invariant(Array.isArray(definition.values) && definition.values.length > 0, 'Incorrect enum values supplied: ' + JSON.stringify(definition.values));
			Object.assign(options, {
				factory: t.form.Select,
				options: definition.values.map(normalizeEnumValue),
				nullOption: false,
			});

			if (isListType(definition.type)) {
				options['template'] = SelectField;
			} else if (definition.values[0].id === parseInt(definition.values[0].id, 10)) {
				// Integer keys won't work with the default template, do string conversion
				options['transformer'] = intTransformer;
			}
		}

		return options;
	},
}
;
