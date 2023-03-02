import { FormatRupiah } from "@arismun/format-rupiah"
import { Container } from "react-bootstrap"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { API } from "../config/api"
import '../Home1.css'

function Home() {
   let { data: products } = useQuery("productsbeans", async () => {
      const response = await API.get("products")
      return response.data.data
   })
   return (
      <div style={{ display: "flex", flexDirection: "column",height:"50%", width:"70%", margin:"auto" }}>
         <Container style={{ paddingTop: 90 }}>
            <div style={{ width: "1050px", height: "400px", display: "flex", margin: "auto" }}>
               <div style={{ padding: 0 }}>
                  <div style={{ display: "flex", width: "1000px", backgroundColor: "#DBB699", height: "100%", justifyContent: "space-between" }}>
                     <div style={{ height: "100%", width: "500px", display: "flex", flexDirection: "column", justifyContent: "center", padding: 20 }}>
                        <img src="./image/LogoHome.png" alt="" style={{ width: "300px", height: "120px" }} />
                        <h3>BEST QUALITY COFFEE BEANS</h3>
                        <h5>Quality freshly roasted coffee made just for you.
                           Pour, brew and enjoy
                        </h5>
                     </div>
                     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <img src="./image/HomeWaysBeans.png" alt="" style={{ width: "350px", height: "230px", zIndex: 99, marginRight: "-50px", marginTop: -70 }} />
                        <img src="./image/Waves.png" alt="" style={{ width: "300px", height: "100px", position: "absolute", marginTop: 220, marginLeft: -300, marginRight: "-50px" }} />
                     </div>
                  </div>
               </div>
            </div>
         </Container>
         <div className="home">
            {products?.map((a, b) => {
               return (
                  <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#DBB699", width: 250, height: 310, marginTop: 50, border: 1, borderRadius: 10 }}>
                     <Link to={`/detailbeans/${a.id}`}>
                        <img src={a.image_product} alt="Coffe" style={{ width: 250, height: 220, border: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10 }} />
                     </Link>
                     <div style={{ padding: "10px 20px 10px 10px", backgroundColor: "#DBB699", height: 100, borderRadius: 10 }}>
                        <h5>{a.name_product}</h5>
                        <h6><FormatRupiah value={a.price} /></h6>
                        {/* {pay?.map((c, d) => {
                           return ( */}
                        <>
                           {/* {(() => {
                                    if (c.status_payment === "success") {
                                       return ( */}
                           < h6 > Stock : {a.stock}</h6>
                           {/* )
                                    }
                                 })()} */}
                        </>
                        {/* )
                        })} */}
                     </div>
                  </div>
               )
            })}
         </div>
      </div >
   )
}
export default Home