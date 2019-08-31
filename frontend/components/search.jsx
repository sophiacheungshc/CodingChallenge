import React from 'react';
import { withRouter } from 'react-router-dom';
import { searchRestaurantNames } from '../util/restaurant_api_util';

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            keyword: this.props.location.search.slice(8).split('%20').join(' '),
            suggestions: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.showSuggestions = this.showSuggestions.bind(this);
        this.debounce = this.debounce.bind(this);
    }


    update(field) {
        return (e) => {
            let query = e.target.value;
            this.setState({[field]: query}, 
            this.debounce(function(){
                searchRestaurantNames(this.state.keyword)
                    .then((result) => {
                        this.setState({ 
                            suggestions: result
                        }, () => console.log(this.state.suggestions))
                    })
                }, 1000)
            );
        }
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.history.push({
                pathname: '/restaurants',
                search: `?search=${this.state.keyword}`
        });
    }

    showSuggestions(){
        return this.state.suggestions.map( (name) => (
                <li onClick = {() => this.update('keyword')}>{name}</li>
        ))
    }

    debounce(func, wait) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };


    render(){
        if (this.props.location.pathname === '/') {
            return (
                <form className="search-container" onSubmit={this.handleSubmit} method="GET">
          
                    <span className="search-type">
                        <div className="search-icon"></div>
                        <input type="text" onChange={(e) => this.update('keyword')} placeholder="Location, Restaurant, or Cuisine" />
                        {/* {this.state.suggestions.length > 0 ? this.showSuggestions() : null} */}
                    </span>
                    <button type="submit "className="search-submit">Let's go</button>
                </form>
            );
        } else {
            return (
                <div className="index-search-bar">
                    <form className="index-search-container" onSubmit={this.handleSubmit} method="GET">
                   
                        <span className="search-type">
                            <div className="search-icon"></div>
                            <input type="text" value={this.state.keyword} onChange={this.update('keyword')} placeholder="Location, Restaurant, or Cuisine" />
                            {/* {this.state.suggestions.length > 0 ? this.showSuggestions() : null} */}
                        </span>
                        <button type="submit" className="search-submit" >Find a Table</button>
                    </form>
                </div>
            );
        }
    
    }
}


export default withRouter(Search);
