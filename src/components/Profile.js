import { FormatRupiah } from "@arismun/format-rupiah";
import { useState } from "react";
import { Button, Container, Form, Modal, NavLink } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import moment from 'moment'

export default function Profile() {
    const Navigate = useNavigate()

    const [passwordUser, setPasswordUser] = useState(false)
    const handleLogin = () => setPasswordUser(true);
    const handleClose = () => setPasswordUser(false);

    const [PhotoUser, setPhotoUser] = useState(false)
    const handlePhoto = () => setPhotoUser(true);
    const handleClosePhoto = () => setPhotoUser(false);

    let { data: profiles, refetch } = useQuery("ProfileUserTenantView", async () => {
        const response = await API.get("profile")
        return response.data.data
    })
    refetch()

    const [password, setPassword] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });
    const handleChangePassword = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdatePassword = useMutation(async (e) => {
        e.preventDefault()
        try {

            const response = await API.patch(`user-password/${profiles.id}`, password)
            console.log(response)
            alert("Selamat password anda sudah di ganti")
            Navigate("/")
        } catch (error) {
            console.log(error)
        }
    })
    const [formAddPhoto, setFormAddPhoto] = useState({
        image: "",
    });

    const handleChangePhoto = (e) => {
        // e.preventDefault();
        setFormAddPhoto({
            ...formAddPhoto,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        });
    };

    const handleSubmitUser = useMutation(async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            };
            const dataPhoto = new FormData();
            dataPhoto.set("image", formAddPhoto.image[0]);

            const response = await API.patch(`/user-image/${profiles?.id}`, dataPhoto, config);
            refetch()
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    });
    refetch()
    let { data: transaction } = useQuery("user", async () => {
        const response = await API.get(`transaction-user/` + profiles?.id)
        return response.data.data
    })

    return (
        <Container>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ paddingTop: "100px", width: "850px", display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "flex", }}>
                        <div style={{ width: "350", height: "300px", display: "flex", flexDirection: "column" }}>
                            <div>
                                <p style={{ fontWeight: "bold", color: "#613D2B", fontSize: "20px" }}>My Profile</p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div style={{ objectFit: "cover" }}>
                                    <img src={profiles?.image} alt="" style={{ width: 200, height: 250 }} />
                                    <div style={{ marginTop: 20 }}>
                                        <Form onSubmit={(e) => handleSubmitUser.mutate(e)} style={{ display: "flex", flexDirection: "column" }} >
                                            <Button
                                                type="submit"
                                                className="position-relative p-0 m-0"
                                                style={{ backgroundColor: "#5A57AB", width: "200px" }}
                                            >
                                                <span className="d-block py-2 px-3" >
                                                    Upload Profile
                                                </span>
                                            </Button>
                                            <input
                                                // className="d-block position-absolute h-100 w-100"
                                                id="formFile"
                                                type="file"
                                                name="image"
                                                onChange={handleChangePhoto}
                                                style={{ display: "inline-block", cursor: "pointer", backgroundColor: "#5A57AB", width: "200px",marginTop:"10px" }}

                                            />
                                        </Form>
                                    </div>
                                </div>
                                <div style={{ marginLeft: 0, paddingLeft: "10px", paddingRight: "20px" }}>
                                    <div>
                                        <h5 style={{ color: "#613D2B" }}>Full Name</h5>
                                        <p>{profiles?.full_name}</p>
                                    </div>
                                    <div>
                                        <h5 style={{ color: "#613D2B" }}>Email</h5>
                                        <p>{profiles?.email}</p>
                                    </div>
                                    <div>
                                        <NavLink onClick={handleLogin}><h5 style={{ color: "#613D2B" }}>Password</h5></NavLink>
                                        <Modal show={passwordUser} onHide={handleClose}>
                                            <Modal.Title className="text-center p-4">Change Password</Modal.Title>
                                            <Modal.Body>
                                                <Form onSubmit={(e) => handleUpdatePassword.mutate(e)}>
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                        <Form.Label>Old Password</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            name="old_password"
                                                            autoFocus
                                                            onChange={handleChangePassword}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                        <Form.Label>New Password</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            name="new_password"
                                                            autoFocus
                                                            onChange={handleChangePassword}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                        <Form.Label>Confirm Password</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            name="confirm_password"
                                                            autoFocus
                                                            onChange={handleChangePassword}
                                                        />
                                                    </Form.Group>
                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        <Button type="submit" variant="primary" style={{ width: 300 }}
                                                        >
                                                            Save Changes
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </Modal.Body>
                                            <Modal.Footer className="display-flex justify-content-center">
                                            </Modal.Footer>
                                        </Modal>
                                        <p>************</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div style={{ fontWeight: "bold", color: "#613D2B" }}>
                                    <p style={{ fontSize: "20px" }}>
                                        My Transaction
                                    </p>
                                </div>
                                {transaction?.map((a, b) => {
                                    return (
                                        <>
                                            {a.products?.map((product, c) => {
                                                console.log(product)
                                                return (
                                                    <div style={{ display: "flex", backgroundColor: "#F6E6DA", width: "100%", padding: 10, marginTop: 20 }}>
                                                        <div>
                                                            <img src={product.Product?.image_product} alt="" style={{ width: 100, height: 120 }} />
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", paddingLeft: "10px" }}>
                                                            <div>
                                                                <h5 style={{ fontWeight: "bold", color: "#613D2B", fontSize: "15px" }}>{product.Product?.name_product}</h5>
                                                            </div>
                                                            <div style={{ marginTop: -10, color: "#974A4A" }}>
                                                                <p style={{ fontSize: "12px" }}>{moment(a.order_date).format('DD/MMMM/YYYY')}</p>
                                                            </div>
                                                            <div style={{ color: "#974A4A" }}>
                                                                <p style={{ fontSize: "12px" }}><FormatRupiah value={product.Product?.price} /></p>
                                                            </div>
                                                            <div style={{ marginTop: -15, color: "#974A4A" }}>
                                                                <p style={{ fontSize: "12px" }}>Qty : {product.Qty}</p>
                                                            </div>
                                                            <div style={{ fontWeight: "bold", marginTop: -15 }}>
                                                                <h5 style={{ fontWeight: "bold", color: "#974A4A", fontSize: "12px" }}><FormatRupiah value={product.Qty * product.Product?.price} /></h5>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", paddingLeft: "10px" }}>
                                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
                                                                <div>
                                                                    <img src="./image/LogoHome.png" alt="" style={{ width: 140, height: 40 }} />
                                                                </div>
                                                                <div>
                                                                    <img src="./image/Barcode.png" alt="" style={{ width: 70, height: 70 }} />
                                                                </div>
                                                                <div style={{}}>
                                                                    {(() => {
                                                                        if (a.status_payment === "success") {
                                                                            return (
                                                                                <p className="text-success">
                                                                                    Success
                                                                                </p>
                                                                            )
                                                                        } else if (a.status_payment === "pending") {
                                                                            return (
                                                                                <p className="text-warning">
                                                                                    Pending
                                                                                </p>
                                                                            )
                                                                        } else {
                                                                            return (
                                                                                <p className="text-danger">
                                                                                    Failed
                                                                                </p>
                                                                            )
                                                                        }
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                        </>
                                    )
                                })}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}