import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MDBTypography,
  MDBBtn,
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBIcon,
  MDBCarousel,
  MDBCarouselItem,
} from "mdb-react-ui-kit";
import BPromise from "bluebird";

import Axios, { GetRandomVerse } from "src/libs/axios";
import getRandomNumber from "src/libs/getRandomNumber";

import BooksData from "src/consts/BooksData.json";

const questions = Array(10).fill({});

export default function Main() {
  const [randomVerse, setRandomVerse] = useState([]);
  const { lang, section } = useParams();

  useEffect(() => {
    const bookRange = section.split("-").map((one) => +one);
    const bookId = getRandomNumber(bookRange[0], bookRange[1]);
    const chapterRange = BooksData.find((one) => one.bookid == bookId).chapters;
    const chapterId = getRandomNumber(1, +chapterRange);
    console.log("4444", location);

    GetRandomVerse(lang, bookId, chapterId).then((res) => {
      const verseId = getRandomNumber(0, res.length - 1);
      console.log("3333333", res[verseId]);
      setRandomVerse(res[verseId]);
    });
    // BPromise.map(Array(10).fill(0), (_, index) => {
    // });

    // Axios.get("/get-chapter/NKJV/22/8/").then((res) => {
    // });
  }, [lang, section]);

  return (
    <MDBContainer className="pt-5">
      <MDBTypography
        tag={"h2"}
        className="text-center"
        onClick={(e) => console.log("111", questions)}
      >
        <div dangerouslySetInnerHTML={{ __html: randomVerse.text }}></div>
      </MDBTypography>
    </MDBContainer>
  );
}
