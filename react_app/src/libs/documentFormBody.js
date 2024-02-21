export class ManageFormBodies {
    constructor(body, setBody) {
        this.body = body;
        this.setBody = setBody;
    }

    append(item) {
        
        if (!this.body.some((existingItem) => existingItem.id === item.id)) {
            this.setBody([...this.body, item]);
        }
    }

    remove(id) {
        const updatedValues = this.body.filter((item) => item.id !== id);
        this.setBody(updatedValues);
    }
}

export function getFormBody(formBody) {
    return formBody.map((item) => Object({ id: item.id }));
}
