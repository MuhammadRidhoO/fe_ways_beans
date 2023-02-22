import { Container, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { API } from "../config/api";

function IndexOwner() {
    const {id} = useParams()
    let { data: transaction } = useQuery("userTrc", async () => {
        const response = await API.get("/transactions")//localStorage.getItem("token"))
        return response.data.data
    })
    console.log(transaction)
    return (
        <Container style={{ padding: "120px 80px 0px 80px" }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Full name</th>
                        <th>Product Name</th>
                        <th>Status Payment</th>
                    </tr>
                </thead>
                {transaction?.map((a, b) => {
                    return (
                        <tbody>
                            <tr>
                                <td>{a.id}</td>
                                <td>{a.user?.full_name}</td>
                                <td>Otto</td>
                                <td>{a.status_payment}</td>
                            </tr>
                        </tbody>
                    )
                })}
            </Table>

        </Container>
    );
}
export default IndexOwner;
