import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CategoryForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { formData } = this.props;
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" name="name" id="name" placeholder="Fashion" onChange={this.props.onChange} value={formData.name} />
                </div>
            </div>
        );
    }
}

CategoryForm.propTypes = {
    onChange: PropTypes.func,
};

CategoryForm.defaultProps = {
    onChange: () => false,
}

export default CategoryForm;