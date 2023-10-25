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

    clearForm() {
        Object.keys(this.formValue).map((key) => {
            this.formValue[key] = "";
        });
    }
}
