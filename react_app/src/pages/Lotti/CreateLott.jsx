import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import {
  Container,
} from "@mui/material";

import CreateLottForm from "../../components/Forms/CreateLott.jsx"
import SelectArticleList from "../../components/Modals/SelectArticleList.jsx"


export default function CreateLott() {
  const [listModal, setListModal] = useState(false)
  const [articleChoice, setArticleChoice] = useState({})

  const { id } = useParams();



  return (
    <>
      <Container maxWidth="md">
        <CreateLottForm articleListModal={setListModal} articleChoice={articleChoice} fetchId={id} />
      </Container>

      <SelectArticleList modalState={[listModal, setListModal]} tableChoices={setArticleChoice}/>
    </>
  );
}
