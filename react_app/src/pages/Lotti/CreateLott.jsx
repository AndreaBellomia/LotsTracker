import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import {
  Container,
} from "@mui/material";

import CreateLottForm from "../../components/Forms/CreateLott.jsx"
import SelectArticleList from "../../components/Modals/SelectArticleList.jsx"


export default function CreateLott() {
  const [listModal, setListModal] = useState(false)
  const [articleChoice, setArticleChoice] = useState(false)

  return (
    <>
      <Container maxWidth="md">
        <CreateLottForm articleListModal={setListModal} articleChoice={articleChoice} />
      </Container>

      <SelectArticleList modalState={[listModal, setListModal]} tableChoices={setArticleChoice}/>
    </>
  );
}
