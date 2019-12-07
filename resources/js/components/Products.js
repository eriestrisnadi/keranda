import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ProductForm from './ProductForm';
import CategoryField from './CategoryField';
import api from '../api';

class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                name: '',
                description: '',
                file: null,
                categories: [],
            },
            data: [],
            editId: null,
            categories: [],
            filterData: {
                categories: [],
            },
        };

        this.onFormChange = this.onFormChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
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
        }).catch(console.log);
    }

    resetFormData() {
        this.setState({
            formData: {
                name: '',
                description: '',
                file: '',
                categories: [],
            },
            editId: null,
        });
    }

    onFormChange(e) {
        this.setState({
            formData: {
                ...this.state.formData,
                [e.target.name]: e.target.value,
            }
        });
    }

    onFileChange(e) {
        this.setState({
            formData: {
                ...this.state.formData,
                file: e.target.files[0],
            }
        });
    }

    onFilterChange(e) {
        this.setState({
            filterData: {
                ...this.state.filterData,
                [e.target.name]: e.target.value,
            }
        }, () => {
            const data = {
                ...this.state.filterData,
            };
            api.get(`products?filter=${JSON.stringify(data)}`).then(res => {
                const { data, success } = res.data;
                if (success) {
                    this.setState({
                        data,
                    });
                }
            }).catch(console.log)
        });
    }

    onSubmit(e) {
        const { formData } = this.state;
        const fData = new FormData();
        e.preventDefault();

        Object.keys(formData).map(k => {
            fData.append(k, formData[k]);
        });

        api.post('products', fData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            const { success } = res.data;
            if (success) {
                this.fetchData();
                this.resetFormData();
                this.closeRef.current.click();
            }
        }).catch(console.log);
    }

    onUpdate(e) {
        const { formData, editId } = this.state;
        const fData = new FormData();
        e.preventDefault();

        const tmpData = {
            ...formData,
        };

        delete tmpData.categoriesEdit;

        Object.keys(tmpData).map(k => {
            fData.append(k, tmpData[k]);
        });

        api.post(`products/${editId}`, fData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            const { success } = res.data;
            if (success) {
                this.fetchData();
                this.resetFormData();
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
        const { data, formData, categories, filterData } = this.state;
        const { addNew, handle } = this.props;

        return (
            <div>
                <div className="my-3 p-3 bg-dark rounded shadow-sm">
                    <div className="row border-bottom border-gray pb-2">
                        <div className="col-3">
                            <h6 className="mb-0">Products</h6>
                        </div>
                        <div className="col-6 text-right">
                            <CategoryField onChange={this.onFilterChange} data={filterData.categories} categories={categories} />
                        </div>
                        <div className="col-3 text-right">
                            {(addNew) &&
                                <button onClick={e => this.resetFormData()} className="btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#newProduct">
                                    Add New
                                </button>
                            }
                        </div>
                    </div>
                    {
                        data.map(d => (
                            <div key={d.id} className="media text-white pt-3">
                                <img src={`/storage/${d.file}`} alt="nopic" width={32} height={32} className="bd-placeholder-img mr-2 rounded"></img>
                                <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <strong className="text-gray-dark">{d.name}</strong>
                                        {
                                            (handle) &&
                                            <span>
                                                <a href="#" className="text-warning" data-toggle="modal" data-target="#editProduct" onClick={e => { e.preventDefault(); this.onChangeEditData(d) }}>Edit</a>&nbsp;|&nbsp;
                                                <a href="#" className="text-danger" onClick={(e) => { e.preventDefault(); this.onDelete(d.id) }}>Delete</a>
                                            </span>
                                        }
                                    </div>
                                    <span className="d-block">{d.description}</span>
                                    {
                                        d.categories.map(c => (
                                            <span key={c.id}><span className="badge badge-secondary" style={{ fontSize: '1em' }}>{c.name}</span>&nbsp;</span>
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
                                    <ProductForm onFileChange={this.onFileChange} onChange={this.onFormChange} formData={formData} categories={categories} />
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
                                    <ProductForm onFileChange={this.onFileChange} onChange={this.onFormChange} formData={formData} categories={categories} />
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
    disableFilter: PropTypes.bool,
};

Products.defaultProps = {
    handle: false,
    addNew: false,
    disableFilter: false,
}

export default Products;

if (document.getElementById('products')) {
    ReactDOM.render(<Products />, document.getElementById('products'));
}
