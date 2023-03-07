import { FormatRupiah } from "@arismun/format-rupiah";
import { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../config/api";
import { UserContext } from "../context/UseContext";

function Detail() {
    const Navigation = useNavigate()
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
            console.log(response.data.status)


        } catch (error) {
            console.log(error);
        }
    });
    const [state,] = useContext(UserContext)
    return (
        <Container>
            <div style={{ width: "850px", margin: "auto" }}>
                <div style={{ display: "flex", paddingTop: 100, justifyContent: "space-between" }}>
                    <div>
                        <img src={product?.image_product} alt="" style={{ width: 300, height: 450 }} />
                    </div>
                    <div style={{ width: "500px", padding: "50px 30px 50px 30px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div>
                            <h2 style={{ fontFamily: "serif", color: "#613D2B" }}>{product?.name_product}</h2>
                            <h5 style={{ fontFamily: "serif", color: "#974A4A" }}>Stock : {product?.stock}</h5>
                            <h5 style={{ fontFamily: "serif", textAlign: "justify" }}>{product?.description}</h5>
                        </div>
                        <div style={{ fontSize: 24, display: "flex", justifyContent: "flex-end", fontWeight: "bold", paddingRight: 50, fontFamily: "serif", color: "#613D2B" }}>
                            <FormatRupiah value={product?.price} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
                            {(() => {
                                if (state.user.roles === "User") {
                                    return (
                                        <Button style={{ width: 350, backgroundColor: "#613D2B", border: "1px" }} onClick={() => handleBean.mutate()}>
                                            Add Cart
                                        </Button>
                                    )
                                } else {
                                    return (
                                        <Button style={{ width: 350, backgroundColor: "#613D2B", border: "1px" }} onClick={() => Navigation("/")}>
                                            Add Cart
                                        </Button>
                                    )
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Detail;
