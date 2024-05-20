import axios from "axios";

const instance = axios.create({
  baseURL: "https://bolls.life/",
});

export const GetRandomVerse = (lang, bookId, chapterId) => {
  return new Promise((resolve, reject) => {
    instance
      .get(`/get-chapter/${lang}/${bookId}/${chapterId}/`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default instance;
