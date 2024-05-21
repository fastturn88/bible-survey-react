import { MDBIcon, MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import React from "react";
import { Link } from "react-router-dom";

import "./App.css";

export default function App() {
  return (
    <MDBContainer fluid className="start-page ">
      <MDBRow className="start-page-main">
        <MDBCol className="start-page-title" md={7} sm={12}>
          <div>
            <div className="">B i b l e</div>
            <div className="">V e r s e</div>
            <div className="">M a s t e r</div>
          </div>
        </MDBCol>
        <MDBCol md={1} sm={12}></MDBCol>
        <MDBCol className="d-flex align-items-center" md={4} sm={12}>
          <Link to="/before">
            <div className="start-page-content">
              S T A R T
              <MDBIcon fas className="ms-3" icon="arrow-right" />
            </div>
            {/* <MDBBtn className="m-3 ">START</MDBBtn> */}
          </Link>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
