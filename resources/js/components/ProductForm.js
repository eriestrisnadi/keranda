import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CategoryField from './CategoryField';

class ProductForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { formData, categories } = this.props;
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" name="name" id="name" placeholder="Books" onChange={this.props.onChange} value={formData.name} />
                </div>
                <div className="form-group">
                    <label htmlFor="categories">Select Some Categories</label>
                    <CategoryField onChange={this.props.onChange} data={formData.categories} categories={categories} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" name="description" id="description" rows="3" placeholder="Describe something of your product ..." onChange={this.props.onChange} value={formData.description}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="description">File</label>
                    <input type="file" name="file" className="form-control" id="file" onChange={this.props.onFileChange}/>
                </div>
            </div>
        );
    }
}

ProductForm.propTypes = {
    onChange: PropTypes.func,
    onFileChange: PropTypes.func,
    categories: PropTypes.array,
};

ProductForm.defaultProps = {
    onChange: () => false,
    onFileChange: () => false,
    categories: [],
}

export default ProductForm;
