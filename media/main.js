(function () {
    const vscode = acquireVsCodeApi();
    var tmpText;

    document.querySelector(".hexamind-hexagon.drag").draggable = true;
    document.querySelector(".hexamind-hexagon.drag").addEventListener("dragstart", onDragStart);
    document.querySelectorAll(".hexamind-hexagon.drop").forEach((element) => {
        element.addEventListener("drop", onDrop);
        element.addEventListener("dragover", onDragover);
        element.addEventListener("dragenter", onDragenter);
        element.addEventListener("dragleave", onDragleave);
    });
    document.querySelectorAll(".hexamind-hexagon").forEach((element) => {
        element.addEventListener("mouseenter", onMouseEnter);
    });
    document.querySelectorAll(".hexamind-hexagon input").forEach((element) => {
        element.addEventListener("focusout", onFocusout);
    });

    function onDragStart(event) {
        event.dataTransfer.setData("text", event.currentTarget.id);
        tmpText = event.currentTarget.firstElementChild.firstElementChild.value;
    }

    function onDrop(event) {
        event.currentTarget.classList.remove("dragging");
        var targetId = event.dataTransfer.getData("text");
        var element = document.getElementById(targetId);
        element.firstElementChild.firstElementChild.value = event.currentTarget.firstElementChild.firstElementChild.value;
        event.currentTarget.firstElementChild.firstElementChild.value = tmpText;
		vscode.postMessage({
			type: 'set',
            data: [
                {
                    id: event.currentTarget.id,
                    text: event.currentTarget.firstElementChild.firstElementChild.value
                },
                {
                    id: targetId,
                    text: element.firstElementChild.firstElementChild.value
                }
            ]
		});
    }

    function onDragenter(event) {
        event.currentTarget.classList.toggle("dragging");
    }

    function onDragleave(event) {
        event.currentTarget.classList.toggle("dragging");
    }

    function onDragover(event) {
        event.preventDefault();
    }

    function onMouseEnter(event) {
        document.querySelectorAll(".hexamind-hexagon.drag").forEach((element) => {
            element.classList.remove("drag");
            element.classList.add("drop");
            element.draggable = false;
            element.removeEventListener("dragstart", onDragStart);
        });
        event.currentTarget.classList.remove("drop");
        event.currentTarget.removeEventListener("drop", onDrop);
        event.currentTarget.removeEventListener("dragover", onDragover);
        event.currentTarget.removeEventListener("dragenter", onDragenter);
        event.currentTarget.removeEventListener("dragleave", onDragleave);
        event.currentTarget.classList.add("drag");
        event.currentTarget.draggable = true;
        event.currentTarget.addEventListener("dragstart", onDragStart);

        document.querySelectorAll(".hexamind-hexagon.drop").forEach((element) => {
            element.draggable = false;
            element.addEventListener("drop", onDrop);
            element.addEventListener("dragover", onDragover);
            element.addEventListener("dragenter", onDragenter);
            element.addEventListener("dragleave", onDragleave);
        });
    }

    function onFocusout(event){
		vscode.postMessage({
			type: 'set', data:[{id: event.currentTarget.parentNode.parentNode.id, text: event.currentTarget.value}]
		});
    }

    function updateContent(text) {
        let json;
		try {
			if (!text) {
				text = '{}';
			}
			json = JSON.parse(text);
            json.data.forEach(element => {
                try {
                    document.getElementById(element.id).firstElementChild.firstElementChild.value = element.text;
                } catch (error) {
                }
            });
        } catch {
            console.log('Failed to load data.');
        }
    }

	window.addEventListener('message', event => {
		const message = event.data;
		switch (message.type) {
			case 'update':
				const text = message.text;
				updateContent(text);
				vscode.setState({ text });
				return;
		}
	});

    const state = vscode.getState();
	if (state) {
		updateContent(state.text);
	}
}());