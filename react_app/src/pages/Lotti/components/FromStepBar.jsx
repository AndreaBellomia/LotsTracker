import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import { Stack, Stepper, Step, StepLabel, Box, Typography } from '@mui/material';

import Check from '@mui/icons-material/Check';
import ArticleIcon from '@mui/icons-material/Article';

import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[400],
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.grey[400],
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  '& .QontoStepIcon-completedIcon': {
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: 20,
  },
  '& .QontoStepIcon-circle': {
    width: 9,
    height: 9,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className, icon } = props;

  let iconComponent = <div className="QontoStepIcon-circle" />
  if (completed && icon === 3) {
    iconComponent = <Check className="QontoStepIcon-completedIcon" /> 
  } else if (completed) {
    iconComponent =  <ArticleIcon className="QontoStepIcon-completedIcon" /> 
  }

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {iconComponent}
    </QontoStepIconRoot>
  );
}

function parseDate(date) {
  return new Date(date).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ({ formValue }) {
  const steps = [
    {
      label: 'Documento di carico',
      accessor: 'document_from_supplier',
      render: (value) => (value ? `Documento ${value.number} del ${parseDate(value.date)}` : '--'),
    },
    {
      label: 'Consegna',
      accessor: 'document_customer',
      render: (value) => (value ? `Documento ${value.number} del ${parseDate(value.date)}` : '--'),
    },
    {
      label: 'Restituzione',
      accessor: 'empty_date',
      render: (value) => (value ? `Riconsegnato il ${parseDate(value)}` : '--'),
    },
    {
      label: 'Reso a fornitore',
      accessor: 'document_to_supplier',
      render: (value) => (value ? `Documento ${value.number} del ${parseDate(value.date)}` : '--'),
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (formValue.document_to_supplier) {
      setCurrentStep(4);
    } else if (formValue.empty_date) {
      setCurrentStep(3);
    } else if (formValue.document_customer) {
      setCurrentStep(2);
    } else if (formValue.document_from_supplier) {
      setCurrentStep(1);
    }
  });

  return (
    <>
      <Stack sx={{ width: '100%', position: "relative" }}>
        <Stepper alternativeLabel activeStep={currentStep} connector={<QontoConnector />}>
          {steps.map((obj, index) => (
            <Step key={index}>
              <StepLabel StepIconComponent={QontoStepIcon}>
                {obj.label}
                <Typography variant="subtitle2" color="initial" sx={{ height: 21 }}>
                  {obj.render(formValue[obj.accessor])}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </>
  );
}
