import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ProductForm from './ProductForm';
import api from '../api';

class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                name: '',
                description: '',
                categories: [],
            },
            data: [],
            editId: null,
        };

        this.onFormChange = this.onFormChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.closeRef = React.createRef();
        this.closeEditRef = React.createRef();
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        api.get('products').then(res => {
            const { data, success } = res.data;
            if (success) {
                this.setState({ data });
            }
        }).catch(console.log);
    }

    onFormChange(e) {
        this.setState({
            formData: {
                ...this.state.formData,
                [e.target.name]: e.target.value,
            }
        });
    }

    onSubmit(e) {
        const { formData } = this.state;
        e.preventDefault();

        api.post('products', formData).then(res => {
            const { success } = res.data;
            if (success) {
                this.fetchData();
                this.setState({
                    formData: {
                        name: '',
                        description: '',
                        categories: [],
                    }
                });
                this.closeRef.current.click();
            }
        }).catch(console.log);
    }

    onUpdate(e) {
        const { formData, editId } = this.state;
        e.preventDefault();

        const tmpData = {
            ...formData,
        };

        delete tmpData.categoriesEdit;

        api.put(`products/${editId}`, tmpData).then(res => {
            const { success } = res.data;
            if (success) {
                this.fetchData();
                this.setState({
                    formData: {
                        name: '',
                        description: '',
                        categories: [],
                    },
                    editId: null,
                });
                this.closeEditRef.current.click();
            }
        }).catch(console.log);
    }

    onDelete(id) {
        api.delete(`products/${id}`).then(res => {
            const { success } = res.data;
            if (success) {
                this.fetchData();
            }
        }).catch(console.log);
    }

    onChangeEditData(data) {
        this.setState({
            editId: data.id,
            formData: {
                name: data.name,
                categoriesEdit: data.categories.map(c => {
                    return {
                        label: c.name,
                        value: c.id,
                    };
                }),
                categories: data.categories.map(c => c.id),
                description: data.description,
            },
        });
    }

    render() {
        const { data, formData } = this.state;
        const { addNew, handle } = this.props;

        return (
            <div>
                <div className="my-3 p-3 bg-dark rounded shadow-sm">
                    <div className="row border-bottom border-gray pb-2">
                        <div className="col-6">
                            <h6 className="mb-0">Products</h6>
                        </div>
                        {(addNew) &&
                            <div className="col-6 text-right">
                                <button className="btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#newProduct">
                                    Add New
                                </button>
                            </div>
                        }
                    </div>
                    {
                        data.map(d => (
                            <div key={d.id} className="media text-white pt-3">
                                <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                                <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <strong className="text-gray-dark">{d.name}</strong>
                                        {
                                            (handle) &&
                                            <span>
                                                <a href="#" className="text-warning" data-toggle="modal" data-target="#editProduct" onClick={e => this.onChangeEditData(d)}>Edit</a>&nbsp;|&nbsp;
                                                <a href="#" className="text-danger" onClick={(e) => this.onDelete(d.id)}>Delete</a>
                                            </span>
                                        }
                                    </div>
                                    <span className="d-block">{d.description}</span>
                                    {
                                        d.categories.map(c => (
                                            <span key={c.id}><span className="badge badge-secondary" style={{fontSize: '1em'}}>{c.name}</span>&nbsp;</span>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>

                {(addNew) &&
                    <div className="modal fade" id="newProduct" tabIndex="-1" role="dialog" aria-labelledby="newProductLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content bg-dark">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="newProductLabel">New Product</h5>
                                    <button ref={this.closeRef} type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <ProductForm onChange={this.onFormChange} formData={formData} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={this.onSubmit}>Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {(handle) &&
                    <div className="modal fade" id="editProduct" tabIndex="-1" role="dialog" aria-labelledby="editProductLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content bg-dark">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="editProductLabel">Edit Product</h5>
                                    <button ref={this.closeEditRef} type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <ProductForm onChange={this.onFormChange} formData={formData} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={this.onUpdate}>Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

Products.propTypes = {
    handle: PropTypes.bool,
    addNew: PropTypes.bool,
};

Products.defaultProps = {
    handle: false,
    addNew: false,
}

export default Products;

if (document.getElementById('products')) {
    ReactDOM.render(<Products />, document.getElementById('products'));
}
