import { RECEIVE_ALL_RES, RECEIVE_RES, DELETE_RES } from '../actions/reservation_actions';
import merge from 'lodash/merge';

const ReservationsReducer = (oldState = {}, action) => {
    Object.freeze(oldState);
    switch (action.type) {
        case RECEIVE_ALL_RES:
            return merge({}, action.reservations);
        case RECEIVE_RES:
            return merge({}, oldState, { [action.reservation.id]: action.reservation });
        case DELETE_RES:
            let newState = merge({}, oldState);
            delete newState[action.reservation.id];
            return newState;
        default:
            return oldState;
    }
};

export default ReservationsReducer;