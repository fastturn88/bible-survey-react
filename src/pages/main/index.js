import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBTypography,
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBIcon,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBRadio,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBSpinner,
} from "mdb-react-ui-kit";

import { GetRandomChapter, GetBooks } from "src/libs/axios";
import getRandomNumber from "src/libs/getRandomNumber";

import BooksData from "src/consts/BooksData.json";

let bookRange = [];
let bookId, chapterRange, chapterId, verseId;

const PROBLEM_NUM = 10;

export default function Main() {
  const { lang, section } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);

  const [visibleModal, setVisibleModal] = useState(false);
  const [modalIcon, setModalIcon] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalColor, setModalColor] = useState("");

  const [randomVerse, setRandomVerse] = useState([]);

  const [bookOptions, setBookOptions] = useState([]);
  const [verseOptions, setVerseOptions] = useState([]);

  const [totalPoints, setTotalPoints] = useState(0);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [answerStatus, setAnswerStatus] = useState(0); // 0: pending, 1: success, 2: failded
  const [questionType, setQuestionType] = useState(0); // 0: book, 1: chapter, 2: verse

  const [selectedOption, setSelectedOption] = useState("");

  const handleNewModal = (icon, color, title) => {
    setModalColor(color);
    setModalIcon(icon);
    setModalTitle(title);

    setVisibleModal(true);
  };

  const getQuestion = async () => {
    bookRange = section.split("-").map((one) => +one);
    bookId = getRandomNumber(bookRange[0], bookRange[1]);
    chapterRange = BooksData.find((one) => one.bookid == bookId).chapters;
    chapterId = getRandomNumber(1, +chapterRange);

    setIsLoading(true);
    const randomChapterVerses = await GetRandomChapter(lang, bookId, chapterId);
    // randomChapterVerses.sort((a, b) => 0.5 - Math.random());
    setVerseOptions(randomChapterVerses);
    verseId = getRandomNumber(0, randomChapterVerses.length - 1);
    setRandomVerse(randomChapterVerses[verseId]);
    verseId = randomChapterVerses[verseId].verse;

    const allBooksSection = await GetBooks(lang);
    const booksOfSection = allBooksSection.filter(
      (one) => one.bookid >= bookRange[0] && one.bookid <= bookRange[1]
    );
    // booksOfSection.sort((a, b) => 0.5 - Math.random());
    setBookOptions(booksOfSection);
    setIsLoading(false);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) {
      handleNewModal("exclamation-triangle", "warning", "Select the option");
      return;
    }
    if (questionType == 0) {
      if (selectedOption == bookId) {
        setQuestionType(1);
        setSelectedOption("");
        setCardLoading(true);

        setTimeout(() => {
          setCardLoading(false);
        }, 1000);
      } else {
        setAnswerStatus(2);
        if (questionNumber == PROBLEM_NUM) {
          handleNewModal(
            "exclamation",
            "info",
            `The total Score is ${totalPoints}`
          );
          return;
        }
      }
    } else if (questionType == 1) {
      if (selectedOption == chapterId) {
        setQuestionType(2);
        setSelectedOption("");
        setCardLoading(true);

        handleNewModal("checked", "success", "You scored 1 point.");

        setTotalPoints(totalPoints + 1);

        setTimeout(() => {
          setCardLoading(false);
        }, 1000);
      } else {
        setAnswerStatus(2);
        if (questionNumber == PROBLEM_NUM) {
          handleNewModal(
            "exclamation",
            "info",
            `The total Score is ${totalPoints}`
          );
          return;
        }
      }
    } else {
      if (selectedOption == verseId) {
        setQuestionType(2);

        handleNewModal("checked", "success", "You scored additional 1 point.");

        setTotalPoints(totalPoints + 1);

        setAnswerStatus(1);

        if (questionNumber == PROBLEM_NUM) {
          handleNewModal(
            "exclamation",
            "info",
            `The total Score is ${totalPoints + 1}`
          );
          return;
        }
      } else {
        setAnswerStatus(2);
        if (questionNumber == PROBLEM_NUM) {
          handleNewModal(
            "exclamation",
            "info",
            `The total Score is ${totalPoints}`
          );
          return;
        }
      }
    }
  };
  const handleNext = () => {
    if (questionNumber == PROBLEM_NUM) {
      handleNewModal(
        "exclamation",
        "info",
        `The total Score is ${totalPoints}`
      );
      return;
    }
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
  }, [lang, section]);

  return (
    <MDBContainer className="pt-5 main-page">
      <MDBTypography tag={"h2"} className="text-center fw-bold">
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
        <div>
          <MDBTypography
            tag={"h4"}
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
              <div>
                {questionType === 0 ? (
                  <MDBCardBody>
                    <MDBCardTitle>
                      Select the correct Book where this verse came from.
                    </MDBCardTitle>
                    <MDBCardText>
                      {bookOptions.map((one) => {
                        console.log(one)
                        return (
                          <MDBRadio
                            key={one.bookid}
                            name="bookOption"
                            id={one.bookid}
                            label={one.name}
                            onChange={(_, e) => {
                              // console.log("1111", one.bookid, bookId);
                              setSelectedOption(one.bookid);
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
                                // console.log("2222", index + 1, chapterId);
                                setSelectedOption(index + 1);
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
                            label={one.verse}
                            onChange={() => {
                              // console.log("333333", one.verse, verseId);
                              setSelectedOption(one.verse);
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
                    <MDBBtn
                      outline
                      className="mx-2"
                      onClick={handleSubmitAnswer}
                      style={
                        !answerStatus
                          ? { visibility: "visible" }
                          : { visibility: "hidden" }
                      }
                    >
                      Submit Answer
                    </MDBBtn>
                    <MDBBtn
                      outline
                      className="mx-2"
                      color="info"
                      onClick={handleNext}
                      style={
                        answerStatus && questionNumber != PROBLEM_NUM
                          ? { visibility: "visible" }
                          : { visibility: "hidden" }
                      }
                    >
                      Next Question
                    </MDBBtn>
                    <MDBBtn
                      outline
                      className="mx-2"
                      color="secondary"
                      onClick={() => {
                        navigate("/");
                      }}
                      style={
                        answerStatus && questionNumber == PROBLEM_NUM
                          ? { visibility: "visible" }
                          : { visibility: "hidden" }
                      }
                    >
                      Homepage
                    </MDBBtn>
                  </div>
                </MDBCardFooter>
              </div>
            )}
          </MDBCard>
        </div>
      )}

      <div className="d-flex justify-content-center mt-5">
        <MDBModal
          animationDirection="right"
          show={visibleModal}
          setShow={setVisibleModal}
          tabIndex="-1"
        >
          <MDBModalDialog centered>
            <MDBModalContent>
              <MDBModalBody>
                <div className="text-center">
                  <MDBIcon
                    fas
                    icon={modalIcon}
                    className={`text-${modalColor}`}
                    style={{ fontSize: "3rem" }}
                  />
                </div>
                <MDBTypography tag={"h3"} className="text-center">
                  {modalTitle}
                </MDBTypography>
              </MDBModalBody>
              <MDBModalFooter className="justify-content-center">
                <MDBBtn onClick={toggleModal}>Close</MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </div>
    </MDBContainer>
  );
}
