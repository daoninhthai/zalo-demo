import "./Navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css'

import {NavLink, Route, Switch} from "react-router-dom";
import React, {useEffect, useState} from "react";



import CreateUser from "../../pages/ManageAll/ManageUser/create/CreateUser";



import EditUser from "../../pages/ManageAll/ManageUser/edit/EditUser"
import Home from "../../pages/home/Home";
import {Link} from "react-router-dom";
import {ListGroup} from "react-bootstrap";


import ManageUser from "../../pages/ManageAll/ManageUser/manage/ManageUser";


import UserInfo from "../header/UserInfo";
import axios from "axios";
import logo from "../../resources/logo.jpg";
import CreatePost from "../../pages/ManageAll/ManagePost/create/CreatePost";
import EditPost from "../../pages/ManageAll/ManagePost/edit/EditPost";
import ManagePost from "../../pages/ManageAll/ManagePost/manage/ManagePost";
const Navbar = ({setCurrentPage, setChildPage}) => {
    const rootAPI = process.env.REACT_APP_SERVER_URL;
    const [authority, setAuthority] = useState([{
        authority: null
    }]);

    useEffect(() => {
        axios.get(rootAPI + "/my-info")
            .then(response => {
                setAuthority(response.data.authority);
            })
    }, [])
 
    const [responsePost, setResponsePost] = useState({
        id: null,
     
        media: null,
        content: null,
       
        updated: null
  
    });
    const [responseUser, setResponseUser] = useState({
        id: null,
     
        firstName: null,
        lastName: null,
        username: null,
        dob: null,
        gender: null,
        joinedDate: null,
        type: null
    });
  
  
    return (
        <div className="container1 d-flex">
            <div className="navbar-container col-2">
                <img id="logo" src={logo} alt="logo_NashTech" />
                <h5 className={"text-primary"}>Online Zalo Management</h5>
                <div className="navbar">
                    {authority === "user" ? (
                        <ul className="navbar-list">
                            <Link to="/home" onClick={() => setCurrentPage("Home")}>
                                <li className="navbar-list--item home-staff">Home</li>
                            </Link>
                        </ul>
                    ) : (
                        <ListGroup className="navbar-list">
                            <NavLink to="/home"
                                     onClick={() => {
                                         setChildPage(null);
                                         setCurrentPage("Home");
                                     }}
                                     activeClassName={"custom-class"}
                            >
                                <li className="navbar-list--item">Home</li>
                            </NavLink>
                            <NavLink to="/user"
                                     onClick={() => {
                                         setChildPage(null);
                                         setCurrentPage("Manage User")
                                     }}
                                     activeClassName={"custom-class"}
                            >
                                <li className="navbar-list--item">Manage User</li>
                            </NavLink>
                            <NavLink
                                to="/post"
                                onClick={() => {
                                    setChildPage(null);
                                    setCurrentPage("Manage Post")
                                }}
                                activeClassName={"custom-class"}
                            >
                                <li className="navbar-list--item">Manage Post</li>
                            </NavLink>

                         
                    
                        </ListGroup>
                    )}
                </div>
            </div>
            <div className="pages-container col-10">
                {authority === "user" ? (
                    <Switch>
                        <Route path={"/home"} exact>
                            <Home/>
                        </Route>
                        <Route path={"/changepassword"}>
                            <UserInfo/>
                        </Route>
                    </Switch>
                ) : (
                    <Switch>
                        <Route path={"/home"} exact>
                            <Home/>
                        </Route>
                        <Route path={"/user"}>
                            <ManageUser setChildPage={setChildPage}
                                        setCurrentPages={setCurrentPage}
                                        responseUser={responseUser}
                                        setResponseUser={setResponseUser}
                            />
                        </Route>
                        <Route path={"/home"}>
                            <Home/>
                        </Route>
                        <Route path={"/changepassword"}>
                            <UserInfo/>
                        </Route>
                        <Route path={"/createuser"}>
                            <CreateUser setChildPage={setChildPage} setResponseUser={setResponseUser}/>
                        </Route>
                        <Route path={"/edituser/:id"}>
                            <EditUser setChildPage={setChildPage} setResponseUser={setResponseUser}/>
                        </Route>
                        <Route path={"/post"}>
                            <ManagePost setCurrentPages={setCurrentPage}
                                         setChildPage={setChildPage}
                                         responsePost={responsePost}
                                         setResponsePost={setResponsePost}
                            />
                        </Route>
                        <Route path={"/createpost"}>
                            <CreatePost setChildPage={setChildPage} setResponsePost={setResponsePost}/>
                        </Route>
                        <Route path={"/editpost/:id"}>
                            <EditPost setChildPage={setChildPage} setResponsePost={setResponsePost}/>
                        </Route>
                     
                       
                    </Switch>
                )}
            </div>
        </div>
    );
};

export default Navbar;
