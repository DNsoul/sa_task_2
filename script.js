function load() {
    const file = document.getElementById("file");

    console.log(file.files)

    const reader = new FileReader();
    reader.onload = readJson;
    reader.readAsText(file.files[0]);
}

function readJson(event) {
    const json = JSON.parse(event.target.result);
    generator(json);
}

function generator(json) {
    console.log(json);

    createFieldsBlock(json.fields)

    createRefsBlock(json.references);

    createButtonsBlock(json.buttons);
}

function createFieldsBlock(fields = []) {
    const form = document.getElementById("form");

    fields.forEach(field => {
        let div = document.createElement("div");

        const label = createLabel(field.label);
    
        const input = createInput(field.input);
        
        div.append(label);
        div.append(input);
    
        form.append(div);
    });
}

function createLabel(elem) {
    let label = document.createElement("label");
    label.className = "label";
    label.innerHTML = elem;

    return label;
}

function createInput(elem) {
    let input;

    if ([
        "email", 
        "password", 
        "number", 
        "file", 
        "text", 
        "checkbox", 
        "date"
    ].includes(elem.type)) {
        input = document.createElement("input");
        input.type = elem.type;
        input.className = elem.type;
        input.placeholder = elem.input?.placeholder ?? "";
        input.checked = elem?.checked ?? "";
        input.multiple = elem?.multiple ?? "";
        input.accept = elem?.filetype ? elem.filetype.map(type => '.'+type).join() : null;
    } else if (elem.type === "textarea") {
        input = document.createElement("textarea");
        input.className = elem.type;
    } else {
        input = document.createElement("select");
        input.multiple = elem?.multiple ?? null;
        
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
    }
    
    input.required = elem.input?.required ?? false;

    return input;
}

function createRefsBlock(refs = []) {
    const form = document.getElementById("form");

    let div = document.createElement("div");

    refs.forEach( (ref) => {
        let span = createRef(ref);
        div.append(span);
    })

    form.append(div);
}

function createRef(elem) {
    let span = document.createElement("span");

    if (!!elem.input) {
        let input = document.createElement("input");
        input.type = elem.input.type;
        input.checked = elem.input.checked ?? false;
        span.append(input);
    } else {
        span.innerHTML = elem["text without ref"] ?? "";

        let link = document.createElement("a");
        link.innerHTML = elem.text;
        link.href = elem.ref;

        span.append(link);
    }

    return span;
}

function createButtonsBlock(buttons = []) {
    const div = document.createElement("div");

    buttons.forEach( (btn) => {
        const button = document.createElement("button");
        button.textContent = btn.text;
        div.append(button)
    });

    document.getElementById("form").append(div);
}

function reset() {
    console.log("321");
}