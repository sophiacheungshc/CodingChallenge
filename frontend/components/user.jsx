import React from 'react';
import { withRouter } from 'react-router-dom';
import ReservationIndexItem from './reserve_index_item';

class User extends React.Component {
    constructor(props){
        super(props);

        this.scrollTo = this.scrollTo.bind(this);
    }

    componentDidMount(){
        this.props.fetchAllRes(this.props.currentUserId);
    }

    handleClick() {
        this.props.history.push(`/restaurants/${this.props.restaurant.id}`);
    }

    scrollTo(el) {
        return () => {
            el.scrollIntoView({
                behavior: 'smooth',
                block: "start"
            });
        };
    }


    upcoming(){

        let all = this.props.reservations;
        let all_upcoming = [];
        let today = new Date();
        all.forEach((reservation) => {
            if (Date.parse(today.toISOString().substring(0, 10)) <= Date.parse(reservation.date)) {
                all_upcoming.push(reservation);
            }
        });

        all_upcoming = this.sortDates(all_upcoming);

        if (all_upcoming.length !== 0){
            return all_upcoming.map(res => (
                <ReservationIndexItem restaurant={res.restaurant} reservation={res} key={res.id} />
            ));
        } else {
            return (
                <div className="no-upcoming">No upcoming reservations.</div>
            )
        }
    }

    past(){

        let all = this.props.reservations;
        let all_past = [];
        let today = new Date();
        all.forEach((reservation) => {
            if (Date.parse(today.toISOString().substring(0, 10)) > Date.parse(reservation.date)) {
                all_past.push(reservation);
            }
        });

        all_past = this.sortDates(all_past);

        if (all_past.length !== 0) {
            return all_past.map(res => (
                <ReservationIndexItem restaurant={res.restaurant} reservation={res} key={res.id} />
            ));
        } else {
            return (
                <div className="no-past">No past reservations.</div>
            )
        }

    }

    sortDates(arr){
        if (arr.length <= 1) return arr;

        let mid = Math.floor(arr.length/2);
        let left = arr.slice(0, mid);
        let right = arr.slice(mid);

        return this.merge(this.sortDates(left), this.sortDates(right));
    }

    merge(left, right){
        let result = [];

        while (left.length && right.length){
            if ((Date.parse(left[0].date) < (Date.parse(right[0].date)))) {
                result.push(left.shift());
            } else {
                result.push(right.shift());
            }
        }

        return result.concat(left).concat(right);
    }

    render(){
        return (
            <div className="user-show-container">
                <div className="user-show-sidebar">
                    <span onClick={this.scrollTo(this.upcomingSection)}>Upcoming Reservations</span>
                    <span onClick={this.scrollTo(this.pastSection)}>Past Reservations</span>
                    <span>My Favorites</span>
                </div>
                <div className="res-index">
                    <div className="upcoming-res-container" ref={el => this.upcomingSection = el}>
                        <h1>Upcoming Reservations</h1>
                        {this.upcoming()}
                    </div>
                    <div className="past-res-container" ref={el => this.pastSection = el}>
                        <h1>Past Reservations</h1>
                        {this.past()}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(User);