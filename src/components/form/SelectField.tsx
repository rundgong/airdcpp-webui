//import PropTypes from 'prop-types';
import React from 'react';

import Select from 'react-select';

import invariant from 'invariant';

import t from 'utils/tcomb-form';

import * as UI from 'types/ui';


const MultiValueContainer: React.FC<any> = ({ css, children, innerProps }) => {
  return (
    <a { ...innerProps } className="ui label">
      { children }
    </a>
  );
};

const MultiValueLabel: React.FC<any> = ({ children }) => {
  return children;
};

const MultiValueRemove: React.FC<any> = ({ css, innerProps }) => {
  return (
    <i { ...innerProps } className="delete icon"/>
  );
};


type TCombTemplate = { 
  renderSelect: (locals: UI.FormLocals<any, any[]>) => React.ReactNode; 
};

type OptionType = {
  label: string;
  value: any;
};

type OptionsType = OptionType[];

const SelectTemplate: TCombTemplate = {
  renderSelect: (locals) => { // <- locals contains the "recipe" to build the UI
    const onChange = (values: OptionsType) => {
      locals.onChange(values.map(v => v.value, []));
    };

    // translate the option model from tcomb to react-select
    const options: OptionsType = locals.options.map(({ value: v, text }) => ({ value: v, label: text }));
    const value: OptionsType = locals.value.map(v => {
      const option = options.find(anyOption => anyOption.value === v)!;
      invariant(!!option, 'All current values were not found from the option list');
      return option;
    });

    return (
      <Select
        value={ value }
        options={ options }
        onChange={ onChange }
        isMulti={ true }
        components={{ 
          MultiValueContainer,
          MultiValueLabel,
          MultiValueRemove,
        }}
        menuPlacement="top"
      />
    );
  }
};

const ReactSelect = (t as any).form.Form.templates.select.clone(SelectTemplate);

export default ReactSelect;
