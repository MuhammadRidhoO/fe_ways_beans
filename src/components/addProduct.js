
import { useContext, useState } from "react";
import { Container, FloatingLabel } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";

function AddProduct() {
    const navigate = useNavigate()
    const [preview, setPreview] = useState(null)
    const [formAddProduct, setFormAddProduct] = useState({
        name_product: "",
        stock: "",
        price: "",
        descraption: "",
        image_product: ""
    });

    console.log(formAddProduct)

    const handleChangeAddProduct = (e) => {
        setFormAddProduct({
            ...formAddProduct,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value,
        });
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    };
    console.log(formAddProduct)

    const handleSubmitProduct = useMutation(async (e) => {
        e.preventDefault()
        try {
            const config = {
                headers: {
                    // Authorrization:"Bearer " + localStorage.token,
                    'Content-type': 'multipart/form-data'
                }
            }
            const dataProduct = new FormData();
            dataProduct.append('name_product', formAddProduct.name_product)
            dataProduct.append('price', formAddProduct.price)
            dataProduct.append('stock', formAddProduct.stock)
            dataProduct.append('descraption', formAddProduct.descraption)
            dataProduct.append('image_product', formAddProduct.image_product[0])

            const response = await API.post("/product", dataProduct, config);

            console.log(response)
            navigate('/')

        } catch (error) {
            console.log(error)
        }

    });

    return (
        <Container style={{ display: "flex", justifyContent: "center" }} >
            <div>
                <div style={{ padding: "50px 0px 50px 0px" }}>
                    <h1 style={{ marginTop: 80 }}>Add Product Beans</h1>
                </div>
                <Form
                    className="allproductadmin"
                    onSubmit={(e) => handleSubmitProduct.mutate(e)}
                >
                    <div style={{ display: "flex" }}>
                        <div style={{ width: 600, height: "400px" }}>
                            <Form.Group className="mb-3" controlId="formBasicEmail" >
                                <Form.Control
                                    name="name_product"
                                    placeholder="Name Product"
                                    onChange={handleChangeAddProduct}
                                    style={{ backgroundColor: "rgba(97, 61, 43, 0.25)", border: "1px solid #613D2B" }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    onChange={handleChangeAddProduct}
                                    style={{ backgroundColor: "rgba(97, 61, 43, 0.25)", border: "1px solid #613D2B" }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    type="number"
                                    name="stock"
                                    placeholder="Stock"
                                    onChange={handleChangeAddProduct}
                                    style={{ backgroundColor: "rgba(97, 61, 43, 0.25)", border: "1px solid #613D2B" }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <FloatingLabel controlId="floatingTextarea2" label="Description">
                                    <Form.Control
                                        as="textarea"
                                        name="descraption"
                                        onChange={handleChangeAddProduct}
                                        style={{ backgroundColor: "rgba(97, 61, 43, 0.25)", border: "1px solid #613D2B", height: '100px' }}
                                        placeholder="Descraption"
                                    />
                                </FloatingLabel>
                            </Form.Group>
                            <Button
                                type="button"
                                //onSubmit={handleChangePhoto}
                                className="position-relative p-0 m-0"
                                style={{ backgroundColor: "#613D2B", width: "140px", border: "0px" }}
                            >
                                <input
                                    className="d-block position-absolute h-100 w-100"
                                    id="formFile"
                                    type="file"
                                    name="image_product"
                                    onChange={handleChangeAddProduct}
                                    style={{ backgroundColor: "rgba(97, 61, 43, 0.25)", border: "1px solid #613D2B", cursor: "pointer", opacity: 0 }}
                                />
                                <span className="d-block py-2 px-3">
                                    Upload Image
                                </span>
                            </Button>
                            <div
                                style={{
                                    width: "auto",
                                    height: 40,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    variant="primary"
                                    type="submit"
                                    style={{
                                        width: 300,
                                        height: 40,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#613D2B",
                                        border: "0px"
                                    }}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                        <img src={preview} alt={preview} style={{ width: 400, height: "250px", marginLeft: 40, borderRadius: 10, border: "0px solid red" }} />
                    </div>
                </Form>
            </div>
        </Container>
    );
}

export default AddProduct;
