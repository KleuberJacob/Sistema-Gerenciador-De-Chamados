import { Switch } from 'react-router-dom'
import Route from './Route'

import SignIn from '../pages/Signin/SignIn'
import SignUp from '../pages/Signup/SignUp'
import Dashboard from '../pages/Dashboard/Dashboard'
import Profile from '../pages/Profile/Profile'
import Customers from '../pages/Customers/Customers'
import New from '../pages/New/New'

export default function Routes(){
    return(
        <Switch>
            <Route exact path='/' component={SignIn}></Route>
            <Route exact path='/register' component={SignUp}></Route>

            <Route exact path='/dashboard' component={Dashboard} isPrivate></Route>
            <Route exact path='/profile' component={Profile} isPrivate></Route>
            <Route exact path='/customers' component={Customers} isPrivate></Route>
            <Route exact path='/new' component={New} isPrivate></Route>
            <Route exact path='/new/:id' component={New} isPrivate></Route> 
            
        </Switch>       
    )
}