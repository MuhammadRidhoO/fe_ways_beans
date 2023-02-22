import { FormatRupiah } from "@arismun/format-rupiah";
import jwtDecode from "jwt-decode";
import { Button, Container } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { API } from "../config/api";

function Detail() {
    const { id } = useParams()
    let { data: product } = useQuery("detailbeans", async () => {
        const response = await API.get(`/product/` + id)
        return response.data.data
    })

    const handleBean = useMutation(async () => {
        try {
            const response = await API.post(`/order`, {
                product_id: parseInt(id),
            });
            console.log(response)

        } catch (error) {
            console.log(error);
        }
    });

    // const token = localStorage.getItem("token")
    // const decoded = jwtDecode(token)
    return (
        <Container>
            <div style={{ width: "1000px", margin: "auto" }}>
                <div style={{ display: "flex", paddingTop: 100 }}>
                    <div>
                        <img src={product?.image_product} alt="" style={{ width: 430, height: 550 }} />
                    </div>
                    <div>
                        <div style={{ padding: "70px 50px 70px 50px" }}>
                            <h2 style={{ fontFamily: "serif", color: "#613D2B" }}>{product?.name_product}</h2>
                            <h5 style={{ fontFamily: "serif", color: "#974A4A" }}>Stock : {product?.stock}</h5>
                            <h5 style={{ fontFamily: "serif", textAlign: "justify" }}>{product?.description}</h5>
                        </div>
                        <div style={{ fontSize: 24, display: "flex", justifyContent: "flex-end", fontWeight: "bold", paddingRight: 50, fontFamily: "serif", color: "#613D2B" }}>
                            <FormatRupiah value={product?.price} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
                            {/* {(() => {
                                if (decoded.roles === "User") {
                                    return ( */}
                            <Button style={{ width: 500, backgroundColor: "#613D2B", border: "1px" }} onClick={() => handleBean.mutate()}>
                                Add Cart
                            </Button>
                            {/* )
                                } else {
                                    return (
                                        <></>
                                    )
                                }
                            })()} */}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Detail;
