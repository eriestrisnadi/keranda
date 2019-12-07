import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import api from '../api';

class ProductForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
        };
    }

    componentDidMount() {
        api.get('categories').then(res => {
            const { success, data } = res.data;
            if (success) {
                this.setState({
                    categories: data.map(c => {
                        return {
                            label: c.name,
                            value: c.id,
                        };
                    }),
                });
            }
        })
    }

    render() {
        const { categories } = this.state;
        const { formData } = this.props;
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" name="name" id="name" placeholder="Books" onChange={this.props.onChange} value={formData.name} />
                </div>
                <div className="form-group">
                    <label htmlFor="categories">Select Some Categories</label>
                    <Select
                        isMulti
                        id="categories"
                        name="categories"
                        options={categories}
                        value={categories && formData.categories.map(id => {
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
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" name="description" id="description" rows="3" placeholder="Describe something of your product ..." onChange={this.props.onChange} value={formData.description}></textarea>
                </div>
            </div>
        );
    }
}

ProductForm.propTypes = {
    onChange: PropTypes.func,
};

ProductForm.defaultProps = {
    onChange: () => false,
}

export default ProductForm;