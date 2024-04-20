(function () {
    const vscode = acquireVsCodeApi();
    const modal = document.getElementById('modal');
    var tmpText;
    var tmpLink;
    var tmpMemo;
    var isOpenModal = false;

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
        tmpText = document.getElementById(event.currentTarget.id + "-text").value;
        tmpLink = document.getElementById(event.currentTarget.id + "-link").value;
        tmpMemo = document.getElementById(event.currentTarget.id + "-memo").value;
    }

    function onDrop(event) {
        event.currentTarget.classList.remove("dragging");
        var targetId = event.dataTransfer.getData("text");
        var txtElem = changeData(targetId + "-text", event.currentTarget.id + "-text", tmpText);
        var linkElem = changeData(targetId + "-link", event.currentTarget.id + "-link", tmpLink);
        var memoElem = changeData(targetId + "-memo", event.currentTarget.id + "-memo", tmpMemo);
		vscode.postMessage({
			type: 'set',
            data: [
                {
                    id: event.currentTarget.id,
                    text: txtElem[1].value,
                    link: linkElem[1].value,
                    memo: memoElem[1].value,
                },
                {
                    id: targetId,
                    text: txtElem[0].value,
                    link: linkElem[0].value,
                    memo: memoElem[0].value,
                }
            ]
		});
    }

    function changeData(srcId, dstId, tmpText){
        var srcElem = document.getElementById(srcId);
        var dstElem =  document.getElementById(dstId);
        srcElem.value = dstElem.value;
        dstElem.value = tmpText;
        return [srcElem, dstElem];
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

    function onFocusout(event){
        postData(event.currentTarget.parentNode.parentNode.id);
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

    function postData(id){
		vscode.postMessage({
			type: 'set', data:[
                {
                    id: id,
                    text: document.getElementById(id + "-text").value,
                    link: document.getElementById(id + "-link").value,
                    memo: document.getElementById(id + "-memo").value,
                }
            ]
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
                    document.getElementById(element.id + "-text").value = cleanValue(element.text);
                    document.getElementById(element.id + "-link").value = cleanValue(element.link);
                    document.getElementById(element.id + "-memo").value = cleanValue(element.memo);
                } catch (error) {
                }
            });
        } catch {
            console.log('Failed to load data.');
        }
    }

    function cleanValue(value){
        if (value == undefined || value == "undefined") {
            value = "";
        }
        return value;
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


    document.querySelectorAll(".hexamind-hexagon a.link").forEach((element) => {
        element.addEventListener("click", onLinkClick);
    });

    document.querySelectorAll(".hexamind-hexagon a.memo").forEach((element) => {
        element.addEventListener("click", onMemoClick);
    });

    function onLinkClick(event) {
        event.preventDefault();
        modal.style.display = "block";
        isOpenModal = true;
        const linkValueId = event.currentTarget.parentNode.parentNode.id + "-link";
        document.getElementById("modal-type").value = "link";
        document.getElementById("modal-id").value = event.currentTarget.parentNode.parentNode.id;
        document.getElementById("modal-target-id").value = linkValueId;
        document.getElementById("modal-value").value = document.getElementById(linkValueId).value;
    }

    function onMemoClick(event) {
        event.preventDefault();
        modal.style.display = "block";
        isOpenModal = true;
        const memoValueId = event.currentTarget.parentNode.parentNode.id + "-memo";
        document.getElementById("modal-type").value = "memo";
        document.getElementById("modal-id").value = event.currentTarget.parentNode.parentNode.id;
        document.getElementById("modal-target-id").value = memoValueId;
        document.getElementById("modal-value").value = document.getElementById(memoValueId).value;
    }

    document.querySelector(".modal > .modal-wrapper > .modal-head > button.close").addEventListener("click", onCloseModal);
    document.querySelector(".modal").addEventListener("click", onCloseModal);
    document.querySelector(".modal > .modal-wrapper > .modal-body > textarea").addEventListener("change", onChangeModal);

    function onCloseModal(event) {
        if (isOpenModal && event.target.nodeName != "TEXTAREA") {
            modal.style.display = "none";
            isOpenModal = false;
        }
    }

    function onChangeModal(event) {
        if (isOpenModal && event.target.nodeName == "TEXTAREA") {
            const id = document.getElementById("modal-id").value;
            const targetId = document.getElementById("modal-target-id").value;
            const changeValue = document.getElementById("modal-value").value;
            var targetElem = document.getElementById(targetId);
            targetElem.value = changeValue;
            postData(id);
        }
    }

}());