import { FormatRupiah } from "@arismun/format-rupiah";
import { useEffect, useState } from "react";
import { Button, Container, NavLink, Table } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../config/api";

function Cart() {
    const [total, setTotal] = useState(0)
    const Navigation = useNavigate()
    const [status_Payment, setStatus_Payment] = useState("")

    const [qty, setQty] = useState(0)
    const handleQty = (e) => {
        setQty({
            ...qty,
            [e.target.name]: e.target.value,
        })
    }

    const {
        data: orderCart,
        refetch: orderCartRefetch,
    } = useQuery("cartbeans1", async () => {
        const response = await API.get("/orders")
        if (response.data.data === null) {
            Navigation("/")
            orderCartRefetch()
        }
        return response.data.data
    })
    const handleDeleteOrder = useMutation(async (id) => {
        try {
            const response = await API.delete(`/order/` + id);
            if (response.data.status_payment === "success") {
            }
            orderCartRefetch();
        } catch (e) {
            console.log(e);
        }
    });


    const handleAddQty = useMutation(async (id) => {
        try {
            const response = await API.patch(`/order/${id}`, {
                event: "add",
            });
            if (response.data.status_payment === "success") {
            }
            orderCartRefetch();
        } catch (e) {
            console.log(e);
        }
    });

    // less counter
    const handleLessQty = useMutation(async (id) => {
        try {
            const response = await API.patch(`/order/${id}`, {
                event: "less",
            });
            if (response.data.status_payment === "success") {
            }
            console.log(response.data)
            orderCartRefetch();
        } catch (e) {
            console.log(e);
        }
    });

    const handleAddTransaction = useMutation(async (e) => {
        try {
            e.preventDefault()
            let products = [];

            orderCart.forEach((push) => {
                products.push({
                    id: push.id,
                    status_payment: "pending",
                    order_date: push.order_date,
                    product_id: push.product.id,
                    qty: push.qty
                });
            });
            const body = {
                total: total,
                products: products,
            };
            const response = await API.post("/transaction", body);
            window.snap.pay(response.data.data.token, {
                onSuccess: function (result) {
                    console.log(response)
                    console.log(result, "Test test");
                    Navigation("/profile-user");
                    setStatus_Payment("success")
                    console.log("berhasil")
                },
                onPending: function (result) {
                    console.log(result);
                    Navigation("/");
                    setStatus_Payment("pending")
                },
                onError: function (result) {
                    console.log(result);
                    Navigation("/");
                    setStatus_Payment("failed")
                },
                onClose: function () {
                    alert(" YOU MUSH BUY RIGHT!!");
                },
            })
        } catch (error) {
            console.log(error)
        }
    });

    useEffect(() => {
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js"
        const myMidtransClientKey = "SB-Mid-client-uEsWsCCq1uRJ_gxm"

        let scriptTag = document.createElement("script")
        scriptTag.src = midtransScriptUrl

        scriptTag.setAttribute("data-client-key", myMidtransClientKey)
        document.body.appendChild(scriptTag)

        return () => {
            document.body.removeChild(scriptTag)
        }
    }, [])

    useEffect(() => {
        let total = orderCart?.reduce((sum, order) => {
            return sum + order.qty * order.product.price;
        }, 0);

        setTotal(total);
    }, [orderCart]);

    let { data: order } = useQuery("totalorderUsers", async () => {
        const response = await API.get(`/orders`)
        return response.data.data
    })
    orderCartRefetch()



    return (
        <Container style={{ margin: "auto", width: "850px" }}>
            <div style={{ paddingTop: 100 }}>
                <div>
                    <p style={{ fontWeight: "bold", color: "#613D2B", fontSize: "30px" }}>My Cart</p>
                </div>
                <div>
                    <div>
                        <p style={{ color: "#613D2B", fontSize: "20px" }}>Review Your Order</p>
                    </div>
                    {orderCart?.map((a, b) => {
                        return (
                            <div style={{ display: "flex", width: "850px", justifyContent: "space-between" }}>
                                <Table style={{ width: "450px", marginRight: "10px" }}>
                                    <thead>
                                        <tr style={{ border: "3px solid black", }}></tr>
                                        <div style={{ display: "flex" }}>
                                            <div>
                                                <img src={a.product?.image_product} alt="" style={{ width: 120, height: 140, padding: 6 }} />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", width: "300px" }}>
                                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "250px" }}>
                                                    <div>
                                                        <p style={{ color: "#613D2B", fontWeight: "bold" }}>{a.product?.name_product}</p>
                                                    </div>
                                                    <div style={{ display: "flex" }}>

                                                        <button style={{
                                                            width: "20px", height: "20px",
                                                            display: "flex", justifyContent: "center",
                                                            alignItems: "center", marginRight: 10, borderRadius: 40,
                                                            backgroundColor: "transparent", border: 0, fontSize: "25px"
                                                        }} onClick={() => {
                                                            a.qty > 1
                                                                ? handleLessQty.mutate(a.id)
                                                                : handleDeleteOrder.mutate(a.id);
                                                        }}>-</button>
                                                        <p style={{
                                                            padding: 3, backgroundColor: "#F6E6DA", color: "#613D2B",
                                                            width: "25px", height: "25px", display: "flex", justifyContent: "center",
                                                            alignItems: "center", borderRadius: 6, fontSize: "18px"
                                                        }} name="qty" >{a.qty}</p>
                                                        <button style={{
                                                            width: "20px", height: "20px", display: "flex",
                                                            justifyContent: "center", alignItems: "center", marginLeft: 10,
                                                            borderRadius: 40, backgroundColor: "transparent", border: 0, fontSize: "25px"
                                                        }} onClick={() => {
                                                            a.qty < a.product.stock
                                                                ? handleAddQty.mutate(a.id)
                                                                : Swal.fire({
                                                                    icon: "error",
                                                                    title: "Out of stock",
                                                                });
                                                        }}>+</button>

                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
                                                    <p style={{}}><FormatRupiah value={a.product?.price} /></p>
                                                    <NavLink onClick={() => {
                                                        handleDeleteOrder.mutate(a.id)
                                                    }}>
                                                        <img src="./image/Bin.png" alt="" style={{ width: "25px", height: "25px" }} />
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </div>
                                        <tr style={{ border: "3px solid black" }}></tr>
                                    </thead>
                                </Table>
                                <div style={{ padding: "10px" }}>

                                    <Table striped bordered hover>
                                        <thead>
                                            <tr style={{ border: "3px solid black" }}></tr>
                                            <div style={{ display: "flex" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "250px" }}>
                                                        <div>
                                                            <p style={{ color: "#613D2B", fontWeight: "bold", fontSize: "13px" }}>Name Product</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ color: "#613D2B", fontWeight: "bold", fontSize: "13px", marginTop: -10 }}>Subtotal</p>
                                                        </div>
                                                        <div style={{ display: "flex", marginTop: -10 }}>
                                                            <p style={{ fontSize: "13px" }}>Quantity : </p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end", marginTop: -20, width: "100%" }}>
                                                        <p style={{ fontSize: "13px", fontWeight: "bold" }}>{a.product?.name_product}</p>
                                                        <p style={{ fontSize: "13px", marginTop: -10 }}><FormatRupiah value={a.product?.price} /></p>
                                                        <p style={{ fontSize: "13px", marginTop: -10 }}>{a.qty}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <tr style={{ border: "3px solid black" }}></tr>
                                            <tr style={{ border: "3px solid black" }}></tr>
                                        </thead>

                                    </Table>

                                </div>

                            </div>

                        )
                    })}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "end", width: "850px" }}>
                        <div style={{ display: "flex", justifyContent: "end" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", width: 400 }}>
                                <div>Total</div>
                                {(() => {
                                    if (order?.length !== undefined) {
                                        orderCartRefetch()
                                        return (
                                            <p><FormatRupiah value={total} /></p>
                                        )
                                    } else {
                                        orderCartRefetch()
                                        return (
                                            <div>Rp. 0</div>
                                        )
                                    }
                                })()}
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "end" }}>
                            <Button style={{ width: 300, backgroundColor: "#613D2B", border: "0px", marginTop: 50 }}
                                onClick={(e) => handleAddTransaction.mutate(e)}
                            >
                                Pay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container >
    )
}
export default Cart;