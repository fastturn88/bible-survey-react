import React, { useState, useEffect } from "react";
import { MDBBtn, MDBContainer, MDBTypography } from "mdb-react-ui-kit";
import Select from "react-select";

import LANG_DATA from "./data/LanguagesData.json";
import SECTION_DATA from "./data/SectionsData.json";

import "./styles.css";

export default function Before() {
  const [versionOptions, setVersionOptions] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState({});
  const [selectedVersion, setSelectedVersion] = useState({});
  const [selectedSection, setSelectedSection] = useState({});

  const [errorMsg, setErrorMsg] = useState({
    language: "",
    version: "",
    section: "",
  });

  useEffect(() => {
    // const temp = LANG_DATA.map();
    setSelectedLanguage({
      language: localStorage.getItem("language"),
    });
    setSelectedVersion({
      short_name: localStorage.getItem("version-short"),
      full_name: localStorage.getItem("version-full"),
    });
    setSelectedSection({
      value: localStorage.getItem("section-value"),
      label: localStorage.getItem("section-label"),
    });
  }, []);

  const onStart = () => {
    if (!selectedLanguage) {
      setErrorMsg;
    }
  };

  return (
    <MDBContainer className="before-page">
      <MDBTypography id="language" className="my-5" tag={"h4"}>
        Please select Language, Version, Section of Bible.
      </MDBTypography>

      <label htmlFor="language" className="mb-4">
        Language:
      </label>
      <Select
        className="mb-1"
        options={LANG_DATA}
        getOptionLabel={(option) => option.language}
        getOptionValue={(option) => option.language}
        onChange={(e) => {
          setSelectedLanguage(e);
          localStorage.setItem("language", e.language);
          setVersionOptions(e.translations);
          setSelectedVersion({});
        }}
        value={selectedLanguage}
        required
      />
      {!selectedLanguage.language && (
        <p className="text-danger">Select the Language</p>
      )}

      <label htmlFor="language" className="mb-1">
        Version:
      </label>
      <Select
        className="mb-4"
        options={versionOptions}
        getOptionLabel={(option) =>
          option.short_name && `${option.short_name} - ${option.full_name}`
        }
        getOptionValue={(option) => option.short_name}
        value={selectedVersion}
        onChange={(val) => {
          setSelectedVersion(val);
          localStorage.setItem("version-short", val.short_name);
          localStorage.setItem("version-full", val.full_name);
        }}
        required
      />
      {!selectedVersion.short_name && (
        <p className="text-danger">Select the Version</p>
      )}

      <label htmlFor="language" className="mb-1">
        Section of Bible:
      </label>
      <Select
        className="mb-4"
        options={SECTION_DATA}
        value={selectedSection}
        onChange={(val) => {
          setSelectedSection(val);
          localStorage.setItem("section-value", val.value);
          localStorage.setItem("section-label", val.label);
        }}
      />
      {!selectedSection.value && (
        <p className="text-danger">Select the Version</p>
      )}

      <div className="text-center">
        <MDBBtn type="submit" onClick={onStart}>
          Start!
        </MDBBtn>
      </div>
    </MDBContainer>
  );
}
