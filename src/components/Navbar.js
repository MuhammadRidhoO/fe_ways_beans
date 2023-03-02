import { useContext, useState } from 'react';
import { Button, Dropdown, Form, Modal, NavLink } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { API } from '../config/api';
import { UserContext } from '../context/UseContext';
import LogoBeans from '../../src/image/LogoNavbar.png'
import Card from '../../src/image/card.png'
import UserDropdown from '../../src/image/User.jpg'
import UserDropdown1 from '../../src/image/User.png'

function Navbarr() {

   const navigator = useNavigate();
   const [login, setLogin] = useState(false);

   const handleClose = () => setLogin(false);

   const handleLogin = () => setLogin(true);

   const [register, setRegister] = useState(false);

   const handleCloseRegister = () => setRegister(false);
   const handleRegister = () => setRegister(true)
   let { data: profiles, refetch } = useQuery("ProfileUserViewNavbar", async () => {
      const response = await API.get("profile")
      return response.data.data
   })

   const [signUp, setSignUp] = useState({
      full_name: "",
      user_name: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      status: "",
      address: ""
   })

   const handleChangeSignUp = (e) => {
      setSignUp({
         ...signUp,
         [e.target.name]: e.target.value,
      })
   }

   const handleSignUp = useMutation(async (e) => {
      try {
         e.preventDefault()

         const response = await API.post("/register", signUp)
         if (response === "") {
            alert("Please Resgister Until Done")
            console.log(response)
         }
         if (response.data.code === 200) {
            alert("Congratulations you have the new account")
            setRegister(false)
            setLogin(true)
            setSignUp({
               full_name: "",
               email: "",
               password: "",
            })
         }

      } catch (error) {
         console.log(error)
      }
   })


   const [state, dispatch] = useContext(UserContext)
   const [signIn, setSignIn] = useState({
      email: "",
      password: "",
   })
   const handleChangeSignIn = (e) => {
      setSignIn({
         ...signIn,
         [e.target.name]: e.target.value
      })
   }
   const handleSubmitLogin = useMutation(async (e) => {
      try {
         e.preventDefault()

         const responseSignIn = await API.post("/login", signIn)
         dispatch({
            type: "LOGIN_SUCCESS",
            payload: responseSignIn.data.data,
         })
         alert("Login Berhasil")
         if (localStorage.roles === "Admin") {
            navigator("/")
         } else {
            navigator("/")
         }
      } catch (error) {
         alert("Login Gagal")
         console.log(error)
      }
   })
   const handleLogOut = (e) => {
      e.preventDefault()
      dispatch({
         type: "LOGOUT"
      })
      navigator("/")
   }

   let { data: order,
         refetch: orderCartRefetch, } = useQuery("orderUser", async () => {
         orderCartRefetch()
         const response = await API.get(`/orders`)
         orderCartRefetch()
         return response.data.data
      })

   return (
      <div style={{ position: "fixed", width: "100%", zIndex: 100 }}>
         <Navbar bg="light" expand="lg">
            <Container className='d-flex justify-content-space-between alignItems-center'>
               <div>
                  <Navbar.Brand href="/" ><img src={LogoBeans} alt='' style={{ width: 180, height: 60 }}></img></Navbar.Brand>
               </div>
               <div>
                  <Navbar.Collapse id="basic-navbar-nav">

                  </Navbar.Collapse>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "270px" }}>

                  {localStorage.getItem("token") ? (
                     <Dropdown style={{ display: "flex" }}>
                        <NavLink href='/card-transaction' style={{ marginRight: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                           {(() => {
                              if (state.user.roles !== "Admin") {
                                 refetch()
                                 return (
                                    <div style={{ position: "absolute" }}>
                                       <img src={Card} alt='' />
                                       {(() => {
                                          if (order?.length !== undefined) {
                                             refetch()
                                             return (
                                                <img src="../image/Ellipse 2.png" alt='' style={{ marginTop: -10, marginLeft: -10 }} />
                                             )
                                          } else {
                                             refetch()
                                             return (
                                                <h></h>
                                             )
                                          }
                                       })()}
                                    </div>
                                 )
                              } else {
                                 refetch()
                                 return (
                                    <></>
                                 )
                              }
                           })()}
                        </NavLink>
                        <Dropdown.Toggle
                           variant=""
                           id="dropdown-basic"
                           className="border-0"
                        >
                           {(() => {
                              if (profiles?.image !== "") {
                                 return (
                                    <img
                                       src={profiles?.image}
                                       alt=""
                                       style={{
                                          borderRadius: 40,
                                          height: 50,
                                          width: 50,
                                          fontSize: 24,
                                          color: "Red",
                                          border: "3px solid black"
                                       }}
                                    />
                                 )
                              } else {
                                 return (
                                    <img
                                       src={UserDropdown}
                                       alt=""
                                       style={{
                                          borderRadius: 40,
                                          height: 50,
                                          width: 50,
                                          fontSize: 24,
                                          color: "Blue",
                                          border: "3px solid black"
                                       }}
                                    />
                                 )
                              }
                           })()}

                        </Dropdown.Toggle>
                        {state.user.roles === "Admin" ? (
                           <Dropdown.Menu>
                              <Dropdown.Item href='/index'>
                                 <img src="/image/Beans.png" alt=""></img> List Produsts
                              </Dropdown.Item>
                              <Dropdown.Item href='/product'>
                                 <img src="/image/Beans.png" alt=""></img> Add Product
                              </Dropdown.Item>
                              <hr></hr>
                              <Dropdown.Item
                                 onClick={handleLogOut}
                              >
                                 <img src="/image/Logout.png" alt=""></img> Logout
                              </Dropdown.Item>
                           </Dropdown.Menu>

                        ) : (
                           <Dropdown.Menu>
                              <Dropdown.Item href={`/profile-user`}>
                                 <img src={UserDropdown1} alt=""></img> Profile
                              </Dropdown.Item>
                              <hr></hr>
                              <Dropdown.Item
                                 onClick={handleLogOut}
                              >
                                 <img src="/image/Logout.png" alt=""></img> Logout
                              </Dropdown.Item>
                           </Dropdown.Menu>
                        )}
                     </Dropdown>
                  ) : (

                     <div>
                        <Button style={{ backgroundColor: "white", border: "3px solid #613D2B", width: 100, fontWeight: "bold", color: "#613D2B" }} className='me-2' show={login} onClick={handleLogin}>Login</Button>
                        <Modal show={login} onHide={handleClose} size="sm">
                           <Modal.Header>
                              <Modal.Title style={{ fontWeight: "bold", color: "#613D2B" }}>Login</Modal.Title>
                           </Modal.Header>
                           <Modal.Body>
                              <Form onSubmit={(e) => handleSubmitLogin.mutate(e)}>
                                 <Form.Group className="mb-3">
                                    <Form.Label className="fw-bloder">Email</Form.Label>
                                    <Form.Control
                                       type="email"
                                       name="email"
                                       onChange={handleChangeSignIn}
                                    />
                                 </Form.Group>
                                 <Form.Group className="mb-3">
                                    <Form.Label className="fw-bloder">
                                       Password
                                    </Form.Label>
                                    <Form.Control
                                       type="password"
                                       name="password"
                                       onChange={handleChangeSignIn}
                                    />
                                 </Form.Group>
                                 {/* <Form.Group className="mb-3">
                                            <Form.Label className="fw-bloder">
                                                Status
                                            </Form.Label>
                                            <Form.Select
                                                type="text"
                                                name="status"
                                                onChange={handleChangeSignIn}
                                            >
                                                <option>--- Pilih ---</option>
                                                <option name="Tenant">Tenant</option>
                                                <option name="Owner">Owner</option>
                                            </Form.Select>
                                        </Form.Group> */}
                                 <Modal.Footer className="buttonlogin">
                                    <Button
                                       type="submit"
                                       className="buttonloginacc"
                                       onClick={handleClose}
                                       style={{ width: "100%", backgroundColor: "#613D2B", border: 1 }}
                                    >
                                       Login
                                    </Button>
                                 </Modal.Footer>
                              </Form>
                           </Modal.Body>

                           <div className="noticeregister">
                              <p className="noticeme">
                              </p>
                           </div>
                        </Modal>

                        <Button style={{ backgroundColor: "#613D2B", border: "1px", width: 100 }} show={register}
                           onClick={handleRegister}>Register</Button>

                        <Modal show={register} onHide={handleCloseRegister} size="md">
                           <Modal.Header style={{ display: "flex", color: "#613D2B" }}>
                              <Modal.Title style={{ fontWeight: "bold" }}>Register</Modal.Title>
                           </Modal.Header>

                           <Modal.Body>
                              <Form onClick={(e) => handleSignUp.mutate(e)}>
                                 <Form.Group className="mb-3">
                                    <Form.Label className="fw-bloder">Full Name</Form.Label>
                                    <Form.Control
                                       type="text"
                                       name="full_name"
                                       onChange={handleChangeSignUp}
                                    />
                                 </Form.Group>
                                 <Form.Group className="mb-3">
                                    <Form.Label className="fw-bloder">Email</Form.Label>
                                    <Form.Control
                                       type="email"
                                       name="email"
                                       onChange={handleChangeSignUp}
                                    />
                                 </Form.Group>
                                 <Form.Group className="mb-3">
                                    <Form.Label className="fw-bloder">Password</Form.Label>
                                    <Form.Control
                                       type="password"
                                       name="password"
                                       onChange={handleChangeSignUp}
                                    />
                                 </Form.Group>
                                 {/* <Form.Group className="mb-3">
                                    <Form.Label className="fw-bloder mt-4" type="number">
                                       Gender
                                    </Form.Label>
                                    <Form.Select
                                       aria-label="Default select example"
                                       name="gender"
                                       onChange={handleChangeSignUp}
                                    >
                                       <option>Gender</option>
                                       <option value="Male">Male</option>
                                       <option value="Female">Female</option>
                                    </Form.Select>
                                 </Form.Group> */}
                                 {/* <Form.Group className="mb-3">
                                    <Form.Label className="fw-bloder">Photo Profile </Form.Label>
                                    <Form.Control
                                       name="image"
                                       type='file'
                                       onChange={handleChangeSignUp}
                                    />
                                 </Form.Group> */}
                                 <Modal.Footer className="buttonlogin">
                                    <Button
                                       type="submit"
                                       variant="primary"
                                       className="buttonloginacc"
                                       onClick={handleCloseRegister}
                                       style={{ width: 500, backgroundColor: "#613D2B", border: "1px" }}
                                    >
                                       Register Now
                                    </Button>
                                 </Modal.Footer>
                              </Form>
                           </Modal.Body>
                        </Modal>
                     </div>
                  )}
               </div>
            </Container>
         </Navbar>
      </div>
   );
}

export default Navbarr;