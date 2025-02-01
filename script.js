
getInput = document.querySelector(".add-input input");
filters = document.querySelectorAll(".filters span");
taskBox = document.querySelector(".task-box");
task = document.querySelectorAll(".task");
clearAll = document.querySelector("#clear-all");

// for the use of editTask funtion
let isedited = false;
let editId;

// getting the stored todo lists from local storage
let toDo = JSON.parse(localStorage.getItem("todo-lists"));

filters.forEach(btn => {
    btn.addEventListener('click', () => {

        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");

        showToDo(btn.id);
    })
})


// Showing the toDo and the list items on the toDo on the screen
function showToDo(filter) {
    let li = "";
    if (toDo) {
        toDo.forEach((todo, id) => {

            let isCompleted = todo.status == "completed" ? "checked" : "";

            if (filter == todo.status || filter == "all") {
                li += `<li class="task">
                            <label for="${id}">
                                <input onclick = "updateToDoStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                                <p class = "${isCompleted}">${todo.inputValue}</p>
                            </label>
        
                            <div class="setting-menu">
                                <i onclick = "showMenu(this)" class="fa-solid fa-ellipsis"></i>
                                
                                <ul class="settings">
                                    <li onclick = "editTask(${id}, '${todo.inputValue}')" class="edit"><i class="fa-solid fa-pen"></i>Edit</li>
                                    <li onclick = "deleteTask(${id})" class="delete"><i class="fa-regular fa-trash-can"></i>Delete</li>
                                </ul>
        
                            </div>
                        </li>`

            }

        });

    }
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}

showToDo("all");


// Updating the status of the toDo
function updateToDoStatus(element) {

    let para = element.parentElement.lastElementChild;

    if (element.checked) {
        para.classList.add("checked");
        toDo[element.id].status = "completed";
    } else {
        para.classList.remove("checked");
        toDo[element.id].status = "pending";
    }

    localStorage.setItem("todo-lists", JSON.stringify(toDo));

}


// To add the menu list on the toDo for edit and delete work
function showMenu(element) {
    let showSettings = element.parentElement.lastElementChild;
    showSettings.classList.add("show");

    document.addEventListener('click', (e) => {
        if (e.target.tagName != "I" || e.target != element) {
            showSettings.classList.remove("show");
        }
    })
}


// To delete the selected task
function deleteTask(id) {

    toDo.splice(id, 1);
    localStorage.setItem("todo-lists", JSON.stringify(toDo));

    // If you are deleting the task from the {pending} filter, then it will show the {pending} filter items, until you switch to the new filter
    let currentActiveClass = document.querySelector("span.active");

    showToDo(currentActiveClass.id);
}


// for clearing all the task from the toDo
clearAll.addEventListener('click', () => {

    toDo.splice(0, toDo.length);
    localStorage.setItem("todo-lists", JSON.stringify(toDo));

    showToDo();
})


// To edit the selected task
function editTask(id, editableTask) {
    getInput.value = editableTask;
    editId = id;
    isedited = true;

}


// Initializing toDo and updating the toDo with the userInput
getInput.addEventListener('keyup', (e) => {
    let userInput = getInput.value.trim();

    // when user entering the input, then the {active} class will be {all} always
    document.querySelector("span.active").classList.remove("active");
    document.querySelector("span#all").classList.add("active");

    if (e.key == 'Enter' && userInput) {

        if (!isedited) {
            if (!toDo) {
                toDo = [];  // If, toDo does not exist, then create a toDo with an empty array.
            }
            let userInfo = { inputValue: userInput, status: "pending" };
            toDo.push(userInfo);

        }
        else {
            isedited = false;
            toDo[editId].inputValue = userInput;
        }

        getInput.value = "";

        localStorage.setItem("todo-lists", JSON.stringify(toDo));
    }

    showToDo("all");
    
})