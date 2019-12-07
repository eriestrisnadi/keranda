import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Products from './Products';
import Categories from './Categories';
import menu from './menu.json';

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: menu[0],
        }
    }

    changeMenu(m) {
        this.setState({
            active: m
        });
    }

    render() {
        const { active } = this.state;
        return (
            <div>
                <div className="nav-scroller bg-white shadow-sm">
                    <nav className="nav nav-underline">
                        {menu.map(p => (<button key={p.path} className={`btn btn-link nav-link${(p.path === active.path) ? ' active' : ''}`} onClick={e => this.changeMenu(p)}>{p.name}</button>))}
                    </nav>
                </div>

                <main role="main" className="container py-4">
                    {
                        (menu.findIndex(m => m.path === active.path) === 0)
                            ? <Products handle={true} addNew={true} />
                            : (menu.findIndex(m => m.path === active.path) === 1)
                                ? <Categories handle={true} addNew={true} />
                                : 'Not Found!'
                    }
                </main>
            </div>
        );
    }
}

export default Content;

if (document.getElementById('content')) {
    ReactDOM.render(<Content />, document.getElementById('content'));
}
