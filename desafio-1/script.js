function addNewElement() {
    const output = document.getElementById("output");
    const newElement = document.createElement("div");

    newElement.textContent = "Elemento " + (output.childElementCount + 1);
    newElement.style.padding = "10px";
    newElement.style.margin = "5px";
    newElement.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    newElement.style.color = "#fff";
    newElement.style.borderRadius = "5px";

    output.appendChild(newElement);
}

document.getElementById("magicButton").addEventListener("click", addNewElement);