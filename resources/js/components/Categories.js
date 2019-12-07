import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CategoryForm from './CategoryForm';
import api from '../api';

class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {
                name: '',
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
        api.get('categories').then(res => {
            const { data, success } = res.data;
            if (success) {
                this.setState({ data });
            }
        }).catch(console.log);
    }

    resetFormData() {
        this.setState({
            formData: {
                name: '',
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

    onSubmit(e) {
        const { formData } = this.state;
        e.preventDefault();

        api.post('categories', formData).then(res => {
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
        e.preventDefault();

        api.put(`categories/${editId}`, formData).then(res => {
            const { success } = res.data;
            if (success) {
                this.fetchData();
                this.resetFormData();
                this.closeEditRef.current.click();
            }
        }).catch(console.log);
    }

    onDelete(id) {
        api.delete(`categories/${id}`).then(res => {
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
                name: data.name
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
                            <h6 className="mb-0">Categories</h6>
                        </div>
                        {(addNew) &&
                            <div className="col-6 text-right">
                                <button onClick={e => this.resetFormData()} className="btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#newCategory">
                                    Add New
                                </button>
                            </div>
                        }
                    </div>
                    {
                        data.map(d => (
                            <div key={d.id} className="media text-white pt-3">
                                <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <strong className="text-gray-dark">{d.name}</strong>
                                        {
                                            (handle) &&
                                            <span>
                                                <a href="#" className="text-warning" data-toggle="modal" data-target="#editCategory" onClick={e => {e.preventDefault();this.onChangeEditData(d)}}>Edit</a>&nbsp;|&nbsp;
                                                <a href="#" className="text-danger" onClick={(e) => {e.preventDefault();this.onDelete(d.id)}}>Delete</a>
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {(addNew) &&
                    <div className="modal fade" id="newCategory" tabIndex="-1" role="dialog" aria-labelledby="newCategoryLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content bg-dark">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="newCategoryLabel">New Category</h5>
                                    <button ref={this.closeRef} type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <CategoryForm onChange={this.onFormChange} formData={formData} />
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
                    <div className="modal fade" id="editCategory" tabIndex="-1" role="dialog" aria-labelledby="editCategoryLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content bg-dark">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="editCategoryLabel">Edit Category</h5>
                                    <button ref={this.closeEditRef} type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <CategoryForm onChange={this.onFormChange} formData={formData} />
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

Categories.propTypes = {
    handle: PropTypes.bool,
    addNew: PropTypes.bool,
};

Categories.defaultProps = {
    handle: false,
    addNew: false,
}

export default Categories;
