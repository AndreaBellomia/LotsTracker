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
