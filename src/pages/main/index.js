import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBTypography,
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBRadio,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner,
} from "mdb-react-ui-kit";

import { GetRandomChapter, GetBooks } from "src/libs/axios";
import getRandomNumber from "src/libs/getRandomNumber";

import BooksData from "src/consts/BooksData.json";

import "./styles.css";

const questions = Array(10).fill({});

let bookRange = [];
let bookId, chapterRange, chapterId, verseId;

export default function Main() {
  const { lang, section } = useParams();
  const navigate = useNavigate();

  const [isBrowser, setIsBrowser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);

  const [visibleModal, setVisibleModal] = useState(true);

  const [randomVerse, setRandomVerse] = useState([]);

  const [bookOptions, setBookOptions] = useState([]);
  const [verseOptions, setVerseOptions] = useState([]);

  const [totalPoints, setTotalPoints] = useState(0);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [answerStatus, setAnswerStatus] = useState(0); // 0: pending, 1: success, 2: failded
  const [questionType, setQuestionType] = useState(0); // 0: book, 1: chapter, 2: verse

  const [selectedOption, setSelectedOption] = useState("");

  const getQuestion = async () => {
    bookRange = section.split("-").map((one) => +one);
    bookId = getRandomNumber(bookRange[0], bookRange[1]);
    chapterRange = BooksData.find((one) => one.bookid == bookId).chapters;
    chapterId = getRandomNumber(1, +chapterRange);

    setIsLoading(true);
    const randomChapterVerses = await GetRandomChapter(lang, bookId, chapterId);
    randomChapterVerses.sort((a, b) => 0.5 - Math.random());
    setVerseOptions(randomChapterVerses);
    verseId = getRandomNumber(0, randomChapterVerses.length - 1);
    setRandomVerse(randomChapterVerses[verseId]);
    verseId = randomChapterVerses[verseId].verse;

    const allBooksSection = await GetBooks(lang);
    const booksOfSection = allBooksSection.filter(
      (one) => one.bookid >= bookRange[0] && one.bookid <= bookRange[1]
    );
    booksOfSection.sort((a, b) => 0.5 - Math.random());
    setBookOptions(booksOfSection);
    setIsLoading(false);
  };

  const handleSubmitAnswer = () => {
    if (questionType == 0) {
      if (selectedOption == bookId) {
        setQuestionType(1);
        setSelectedOption("");
        setCardLoading(true);

        setTimeout(() => {
          setCardLoading(false);
        }, 1000);

        console.log("@@@@@  ", bookId);
      } else {
        setAnswerStatus(2);
        console.log("#####", bookId);
      }
    } else if (questionType == 1) {
      if (selectedOption == chapterId) {
        setQuestionType(2);
        setSelectedOption("");
        setCardLoading(true);

        setVisibleModal(true);
        setTotalPoints(totalPoints + 1);

        setTimeout(() => {
          setCardLoading(false);
        }, 1000);

        console.log("&&&&&&", chapterId);
      } else {
        setAnswerStatus(2);
        console.log("#####", chapterId);
      }
    } else {
      if (selectedOption == verseId) {
        setQuestionType(2);
        setSelectedOption("");
        setCardLoading(true);

        setTimeout(() => {
          setCardLoading(false);
        }, 1000);

        console.log("&&&&&&", verseId);
      } else {
        setAnswerStatus(2);
        console.log("#####", verseId);
      }
    }
  };
  const handleNext = () => {
    getQuestion();
    setQuestionNumber(questionNumber + 1);
    setAnswerStatus(0);
    setQuestionType(0);
    setSelectedOption("");
  };

  const toggleModal = () => {
    setVisibleModal(!visibleModal);
  };

  useEffect(() => {
    getQuestion();

    setIsBrowser(typeof window !== "undefined");
    console.log("`````4444`````", typeof window);
  }, [lang, section]);

  return (
    <MDBContainer className="pt-5 main-page">
      <MDBTypography tag={"h2"} className="text-center">
        Question {questionNumber}
      </MDBTypography>
      {isLoading ? (
        <div className="text-center mt-5">
          <MDBSpinner
            className="m-2"
            style={{ textAlign: "center", width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </MDBSpinner>
        </div>
      ) : (
        <>
          <MDBTypography
            tag={"h2"}
            className="text-center"
            dangerouslySetInnerHTML={{ __html: randomVerse.text }}
          ></MDBTypography>
          <MDBCard>
            <MDBCardHeader className="text-end">
              Scored Points:{" "}
              <big>
                <strong>{totalPoints}</strong>
              </big>
            </MDBCardHeader>
            {cardLoading ? (
              <div className="text-center m-5">
                <MDBSpinner
                  className="m-2"
                  style={{ textAlign: "center", width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </MDBSpinner>
              </div>
            ) : (
              <>
                {questionType === 0 ? (
                  <MDBCardBody>
                    <MDBCardTitle>
                      Select the correct Book where this verse came from.
                    </MDBCardTitle>
                    <MDBCardText>
                      {bookOptions.map((one) => {
                        return (
                          <MDBRadio
                            key={one.bookid}
                            name="bookOption"
                            id={one.bookid}
                            label={one.name}
                            onChange={(_, e) => {
                              setSelectedOption(one.bookid);
                              console.log("00000", one.bookid, bookId);
                            }}
                            value={one.bookid}
                            checked={one.bookid == selectedOption}
                            wrapperStyle={
                              questionType == 0 && answerStatus == 2
                                ? one.bookid == selectedOption
                                  ? { color: "red" }
                                  : one.bookid == bookId
                                  ? { color: "green" }
                                  : { color: "black" }
                                : {}
                            }
                            disabled={answerStatus}
                          />
                        );
                      })}
                    </MDBCardText>
                  </MDBCardBody>
                ) : questionType === 1 ? (
                  <MDBCardBody>
                    <MDBCardTitle>
                      Select the correct Chapter where this verse came from.
                    </MDBCardTitle>
                    <MDBCardText>
                      {Array(chapterRange)
                        .fill(0)
                        .map((one, index) => {
                          return (
                            <MDBRadio
                              key={index + 1}
                              name="bookOption"
                              id={index + 1}
                              label={`Chapter ${index + 1}`}
                              onChange={() => {
                                setSelectedOption(index + 1);
                                console.log("111111", index + 1, chapterId);
                              }}
                              value={index + 1}
                              checked={index + 1 == selectedOption}
                              wrapperStyle={
                                questionType == 1 && answerStatus == 2
                                  ? index + 1 == selectedOption
                                    ? { color: "red" }
                                    : index + 1 == chapterId
                                    ? { color: "green" }
                                    : { color: "black" }
                                  : {}
                              }
                              disabled={answerStatus}
                            />
                          );
                        })}
                    </MDBCardText>
                  </MDBCardBody>
                ) : (
                  <MDBCardBody>
                    <MDBCardTitle>Select the correct Verse.</MDBCardTitle>
                    <MDBCardText>
                      {verseOptions.map((one) => {
                        return (
                          <MDBRadio
                            key={one.pk}
                            name="verseOption"
                            id={one.verse}
                            label={one.text}
                            onChange={() => {
                              setSelectedOption(one.verse);
                              console.log("22222", one.verse, verseId);
                            }}
                            value={one.verse}
                            checked={one.verse == selectedOption}
                            wrapperStyle={
                              questionType == 2 && answerStatus == 2
                                ? one.verse == selectedOption
                                  ? { color: "red" }
                                  : one.verse == verseId
                                  ? { color: "green" }
                                  : { color: "black" }
                                : {}
                            }
                            disabled={answerStatus}
                          />
                        );
                      })}
                    </MDBCardText>
                  </MDBCardBody>
                )}
                <MDBCardFooter>
                  <div className="d-flex justify-content-between text-center">
                    <MDBBtn
                      outline
                      className="mx-2"
                      color="warning"
                      onClick={() => {
                        navigate("/before");
                      }}
                    >
                      Restart
                    </MDBBtn>
                    {answerStatus ? (
                      <MDBBtn
                        outline
                        className="mx-2"
                        color="info"
                        onClick={handleNext}
                      >
                        Next Question
                      </MDBBtn>
                    ) : (
                      <MDBBtn
                        outline
                        className="mx-2"
                        onClick={handleSubmitAnswer}
                      >
                        Submit Answer
                      </MDBBtn>
                    )}
                  </div>
                </MDBCardFooter>
              </>
            )}
          </MDBCard>
        </>
      )}

      {isBrowser ? (
        <MDBModal
          open={visibleModal}
          onClose={() => setVisibleModal(false)}
          tabIndex="-1"
        >
          <MDBModalDialog centered>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Modal title</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={toggleModal}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <p>
                  Cras mattis consectetur purus sit amet fermentum. Cras justo
                  odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                  risus, porta ac consectetur ac, vestibulum at eros.
                </p>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={toggleModal}>
                  Close
                </MDBBtn>
                <MDBBtn>Save changes</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      ) : (
        <div>hi</div>
      )}
    </MDBContainer>
  );
}
