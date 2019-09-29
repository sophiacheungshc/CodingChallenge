# Welcome, DeepScribe team 💊💻!

[Kitchen Fable Live!](https://kitchenfable.herokuapp.com/)

Kitchen Fable is a single page app inspired by Open Table, which allows users to search for restaurants in 6 different cities, make reservations, favorite specific restaurants, and leave reviews. This web application was built with Ruby on Rails for the backend and React-Redux for the frontend, while using PostgreSQL to manage the database.

## The Challenge
* Goal: To integrate a toast notification system into this project in a way that makes the most sense.
* Problem: After clicking on the 'Book a Table' button on the reservation form, user was immediately redirected to the profile page without any notice, which can bring about a confusing and abrupt experience. Also, no reminders of upcoming reservations makes it likely for users to forget about their reservations, unless they remember to check their profile page occasionally.
* Action: Using timed and autoclosing notification bubbles from the React-Toastify API, notify the user of a successful booking upon redirection from restaurant show page to profile page. In addition, re-structured the sessions controller to pass a user's reservation data into the jbuilder view file which is rendered upon a successful log in, added the receive user case for reservations & restaurants reducer so that this data can be passed along from redux store to the front end through the mapStateToProps function, then notify the user of any upcoming reservations within the next 5 days. 
* Result: Significantly improved UX, increased level of interactivity. Lower chances of users missing their reservations.

## Technical Design Decisions
* React/Redux: I chose to build the front end of this project with React mainly because of its modularity and reusabilty. React allows me to break down code into components that can be easily manipulated and refactored later on as needed, and keep my code DRY when I need to display previously built components (ex. the search bar is used both on the home page and the search results page). Used concurrently with Redux, my front end views are able to stay consistent with back end data without having to refresh the page after performing CRUD operations. Redux also allows me to intercept dispatched actions by applying middlewares, which is great for debugging and handling async API calls.
* React-Toastify API: I chose this library for displaying the toast notifications because as a React component, it was simple to integrate into my app that was already built with React in the front end. It is light-weight and easy to set up, which allowed me to focus on refactoring my existing codebase. It also offers customizability varying from the design/CSS aspect to component interactions. 
* Ruby On Rails: MVC framework separates each concern into their own files, making for an easier time to manage the little details of CRUD operations involving the database and back end routes. Routing mechanism allows for the mapping of URLS to specific actions, and gives clarity into which view is rendered at the end of each action. I was able to use the controller and jbuilder view files to my advantage and return the needed reservation information to the front end upon signing in.

## Test It Out!
1. On top right corner of homepage, click 'Sign In', then click 'Demo Login'.
2. You should see toast notifications appear one by one on the top right corner. If not, there are no upcoming reservations within the next 5 days; you can go make some new reservations at any restaurant for a date that is no more than 5 days away, then log out and sign back in again. 
3. Go to a restaurant show page by choosing a result from either clicking on a featured area or using the search bar. 
4. To the right, make a reservation by modifying each input to your liking and clicking 'Book a Table'. You will then be redirected to your user profile page.
5. You should see a toast notification appear on the top right corner, notifying you of a successful booking.
6. Click 'Cancel Reservation' on the reservation you just made. Now you should see another toast notification confirming that you just cancelled the reservation.

##### Code Snippet - Sign-In Form Component
```js
    handleSubmit(e) {
        e.preventDefault();
        const { closeModal, processForm } = this.props;
        processForm(this.state)
            .then(closeModal)
            //check for notifications about upcoming reservations upon sign in
            .then(this.notify)
    }
    
    notify(){
        const { reservations, restaurants } = this.props;
        //if there are any reservations under the logged in user, go through them
        if (reservations.length) {
            reservations.forEach((res, idx) => {
                //date difference divided by number of millisecs = total number of days between 2 dates
                let dateDiff = Math.ceil(((new Date(res.date)) - (new Date())) / (1000 * 60 * 60 * 24));
                //only want to notify user about reservations that are 1-5 days away
                if (dateDiff >= 0 && dateDiff <= 5) {
                    //correlate delay time of toast to how far away the reservation is, so that
                    //they appear in order of soonest to furthest
                    let delay = (dateDiff * 1000) + 1000;
                    switch (dateDiff) {
                        case 0:
                            dateDiff = 'today';
                            break;
                        case 1:
                            dateDiff = 'tomorrow';
                            break;
                        default:
                            dateDiff = `in ${dateDiff} days`;
                    }
                    toast(`Reminder: You have an upcoming reservation ${dateDiff} 
                        at ${restaurants[idx]}.`, { delay: delay, className: 'toasty' });
                }
            })        
        }
    }
```

##### Code Snippet - SessionsController and api/users/show
```ruby
  def create
    @user = User.find_by_credentials(
      params[:user][:email],
      params[:user][:password]
    )

    if @user
      login(@user)
      # after successful log in, grab all associated reservations & respective 
      # restaurant names (for a more informative notification)
      @reservations = @user.reservations
      @restaurants = @reservations.map { |res| Restaurant.find(res.rest_id).name }
      render "api/users/show"
    else
      render json: ["Your email and password don't match. Please try again."], status: 401
    end
  end
  
```

```ruby
json.user do 
    json.partial! "api/users/user", user: @user
end

json.reservations @reservations.collect { |reservation| reservation }
json.restaurants @restaurants
```

##### Code Snippet - Reservation Form Component
```js
  handleSubmit(e) {
        e.preventDefault();
        let result = Object.assign({}, this.state);
        result.date = this.state.date.toISOString().substring(0, 10);
        this.props.createRes(result).then(() => {
            //successful reservation toast message
            toast(`🗓 Hooray! Your table for ${this.state.party} has been successfully 
                reserved for ${this.state.date.toString().slice(0, 15)} 
                at ${this.state.time}.`, { className: 'toasty' });

            this.props.history.push(`/user`);
        });
    }
```

##### Code Snippet - Reservation Index Item Component
```js
  cancel(e){
        e.preventDefault();
        this.props.cancelRes(this.props.reservation.id);
        //successful cancellation toast message
        toast(`Your reservation at ${this.props.restaurant.name} on 
            ${this.props.reservation.date} has been cancelled.`, { className: 'toasty' });
    }
```


