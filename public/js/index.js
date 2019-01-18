const clients = {};

function* createColorSeq() {
    const colors = ["red", "green", "blue"];
    let i = 0;
    while (true) {
        yield colors[i++];
        if (i >= colors.length)
            i = 0;
    }
}

const colorSeq = createColorSeq();

function addClient(id) {
    const targetEl = document.createElement("div");
    targetEl.className = "mouse-target";
    targetEl.style.backgroundColor = colorSeq.next().value;
    document.body.appendChild(targetEl);
    clients[id] = targetEl;
    return targetEl;
}

function getClient(id) {
    let el = clients[id];
    if (!el) {
        el = addClient(id);
    }
    return el;
}

function removeClient(id) {
    if (clients[id]) {
        let el = clients[id];
        document.body.removeChild(el);
        delete clients[id];
    }
}

function moveMouseTarget(id, x, y) {
    const el = getClient(id);
    el.style.top = y + "px";
    el.style.left = x + "px";
}

function setTargetState(id, state) {
    const el = getClient(id);
    const value = state === "down"
        ? "<span>!!</span>"
        : "";
    el.innerHTML = value;
}

function init() {
    let socket = io();

    document.addEventListener("mousemove", ({ clientX: x, clientY: y }) => {
        socket.emit("mouse move", { x, y });
    });

    document.addEventListener("mousedown", () => {
        socket.emit("mouse state change", { state: "down" });
    });

    document.addEventListener("mouseup", () => {
        socket.emit("mouse state change", { state: "up" });
    });

    socket.on("client connected", ({ id }) => {
        addClient(id);
    });

    socket.on("client disconnected", ({ id }) => {
        removeClient(id);
    });

    socket.on("mouse state change", ({ id, state }) => {
        setTargetState(id, state);
    });

    socket.on("mouse move", ({ id, x, y }) => {
        moveMouseTarget(id, x, y);
    });
}

document.addEventListener("DOMContentLoaded", init);