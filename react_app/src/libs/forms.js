export class manageHandlerInput {
    constructor(formValue, setFormValue, setFormErrors) {
        this.formValue = formValue;
        this.setFormValue = setFormValue;
        this.setFormErrors = setFormErrors;
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setFormValue({
            ...this.formValue,
            [name]: value,
        });

        this.setFormErrors({});
    };

    handleInputDatepickerChange = (e, name) => {
        
        const date = e.$d;
        this.setFormValue({
            ...this.formValue,
            [name]: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        });

        this.setFormErrors({});
    };

    clearForm() {
        Object.keys(this.formValue).map((key) => {
            this.formValue[key] = "";
        });
    }
}

export class ManageFormDocument {
    constructor(form, setForm) {
      this.form = form;
      this.setForm = setForm;
    }
  
    append(item) {
      const formBody = this.form.body;
  
      if (!formBody.some((existingItem) => existingItem.id === item.id)) {
        this.setForm({ ...this.form, body: [...formBody, item] });
      }
    }
  
    remove(id) {
      const formBody = this.form.body;
      const updatedValues = formBody.filter((item) => item.id !== id);
      this.setForm({ ...this.form, body: updatedValues });
    }
  
    getSubmitForm() {
      const formValues = this.form
  
      return {
          ...formValues,
          body : formValues.body.map((item) => Object({ id: item.id }))
      }
    }
  }
  