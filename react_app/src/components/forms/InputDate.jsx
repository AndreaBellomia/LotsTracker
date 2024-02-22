import React from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@/layout/components';



export default function ({ value, error, handler }) {
  return (
    <>
      <DatePicker
        onChange={(target) => {
          handler.handleInputDatepickerChange(target, 'date');
        }}
        error={Boolean(error)}
        helperText={error}
        value={value ? dayjs(value) : null}
      />
    </>
  )
}