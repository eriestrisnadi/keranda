import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

class CategoryField extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data, categories } = this.props;
        return (
            <Select
                isMulti
                id="categories"
                name="categories"
                options={categories}
                value={categories && data.map(id => {
                    const category = categories.find(cat => cat.value === id);
                    return {
                        label: category.label,
                        value: id,
                    }
                })}
                onChange={cat => cat && this.props.onChange({
                    target: {
                        name: 'categories',
                        value: cat.map(c => c.value),
                    }
                })}
                className="basic-multi-select text-dark"
                classNamePrefix="select"
            />
        );
    }
}

CategoryField.propTypes = {
    onChange: PropTypes.func,
    data: PropTypes.array,
    categories: PropTypes.array,
};

CategoryField.defaultProps = {
    onChange: () => false,
    data: [],
    categories: [],
}

export default CategoryField;
