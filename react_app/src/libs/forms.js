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
      if (formBody.some((existingItem) => Object.keys(existingItem).includes("id"))) {
        if (!formBody.some((existingItem) => existingItem.id === item.id)) {
          this.setForm({ ...this.form, body: [...formBody, item] });
        }
      } else {
        if (!formBody.some((existingItem) => existingItem.batch_code === item.batch_code)) {
          this.setForm({ ...this.form, body: [...formBody, item] });
        }
      }
    }
  
    remove(id) {
      const formBody = this.form.body;
      const updatedValues = formBody.filter((item) => item.id !== id);
      this.setForm({ ...this.form, body: updatedValues });
    }
  
    getSubmitForm() {
      const formValues = this.form
      const formBody = this.form.body;

      const data = formBody.map(element => {
        if (Object.keys(element).includes("id")) {
          
          return {
            id: element.id
          }
        } else {
          return { item_type_id: element.item_type.id, batch_code: element.batch_code }
        }
      })

      return {
        ...formValues,
        body: data
      }
      
    }
  }
  