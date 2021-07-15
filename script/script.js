function load() {
    reset();

    const file = document.getElementById("file");

    if (file.files.length === 0) {
        alert("Выберите файл!");
        return;
    }

    const reader = new FileReader();
    reader.onload = readJson;
    reader.readAsText(file.files[0]);
}

function readJson(event) {
    const json = JSON.parse(event.target.result);
    generator(json);
}

function generator(json) {

    createFieldsBlock(json.fields)

    createRefsBlock(json.references);

    createButtonsBlock(json.buttons);
}

function createFieldsBlock(fields = []) {
    const form = document.getElementById("form");

    let divFields = document.createElement("div");
    divFields.className = "form__fields";

    fields.forEach(field => {
        let div = document.createElement("div");
        div.className = (field.input.type === "checkbox") ? "field-line" : "field";

        const label = createLabel(field.label);
    
        const input = createInput(field.input);
        
        div.append(label);
        div.append(input);
    
        divFields.append(div);
    });

    form.append(divFields)
}

function createLabel(text = " ") {
    let label = document.createElement("label");
    label.className = "form-label";
    label.innerHTML = text;

    return label;
}

function createInput(elem) {
    let input;

    if ([
        "email", 
        "password", 
        "file", 
        "text", 
        "checkbox", 
        "date"
    ].includes(elem.type)) {
        input = document.createElement("input");
        input.type = elem.type;
        input.className = elem.type === "checkbox" ? "form-check-input" : "form-control";
        input.placeholder = elem.placeholder ?? "";
        input.checked = elem.checked ?? "";
        input.multiple = elem.multiple ?? "";
        input.accept = elem.filetype ? elem.filetype.map(type => '.'+type).join() : "";
    } else if ( elem.type === "number") {
        input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.placeholder = elem.mask ?? "";
        input.onkeydown = (e) => setMask(e, elem.mask);
    } else if (elem.type === "textarea") {
        input = document.createElement("textarea");
        input.className = "form-control";
    } else {
        input = createSelect(elem);
    }
    
    input.required = elem.input?.required ?? false;

    return input;
}

function setMask(event, mask) {

    const char = event.key;
    const code = event.keyCode;

    let pos = event.target.value.length;

    console.log(code);

    if ([8, 37, 39].includes(code)) return;
    if (!((48 <= code && code <= 57) || (96 <= code && code <= 105))) {
        event.preventDefault();
        event.stopPropagation();
        return;
    };

    while (mask[pos] !== "9" && pos <= mask.length-1) {
        console.log(mask[pos], pos)
        event.target.value += String(mask[pos]);
        pos++;
    }

    event.preventDefault();
    event.stopPropagation();

    if (pos >= mask.length)        
        return;

    event.target.value += char;
}

function createSelect(elem) {
    input = document.createElement("select");
    input.className = "form-select";
    input.multiple = elem?.multiple ?? "";
    
    let list;

    Object.keys(elem).some( (key) => {
        if (Array.isArray(elem[key])) {
            list = elem[key];
            return true;
        }
    })

    for (let i = 0; i < list.length; i++) {
        let option = document.createElement("option");
        option.value = list[i];
        option.text = list[i];
        input.appendChild(option);
    }

    return input;
}

function createRefsBlock(refs = []) {
    const form = document.getElementById("form");

    let div = document.createElement("div");
    div.className = "form__refs";

    let span = document.createElement("span");

    refs.forEach( (ref) => {
        if (ref.input) {
            span.append(createCheckbox(ref))
        } else {
            span.append(createRef(ref))
            div.append(span);

            span = document.createElement("span");
        }
    })

    form.append(div);
}

function createCheckbox(elem) {
    let input = document.createElement("input");
    input.type = elem.input.type;
    input.checked = elem.input.checked ?? false;
    input.className = "form__refs-input form-check-input";
    return input;
}

function createRef(elem) {
    let span = document.createElement("span");
    span.innerHTML = (elem["text without ref"] ?? "") + " ";
    span.className = "form__refs-link";

    let link = document.createElement("a");
    link.innerHTML = elem.text;
    link.href = elem.ref;

    span.append(link);
    return span;
}

function createButtonsBlock(buttons = []) {
    const div = document.createElement("div");
    div.className = "form__buttons"

    buttons.forEach( (btn) => {
        const button = document.createElement("button");
        button.textContent = btn.text;
        button.className = "form__buttons-item btn btn-primary";
        div.append(button)
    });

    document.getElementById("form").append(div);
}

function reset() {
    document.getElementById("form").textContent = "";
}