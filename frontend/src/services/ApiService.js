class ApiService {
    constructor(axios = undefined) {
        this.axios = axios;
    }

    getBoards(name) {
        return this.axios.get(`http://localhost:8000/api/board/`).then(response => response.data);
    }

    newBoard(name) {
        return this.axios.post(`http://localhost:8000/api/board/`, JSON.stringify({"name": name})).then(response => response.json())
    }

    newRow(name) {
        return fetch(`http://localhost:8000/api/row/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"name": name}),
            }).then(response => response.json())
    }

    updateBoard(pk, data) {
        return fetch(`http://localhost:8000/api/board/${pk}/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify(data),
            }).then(response => response.json())
    }

    updateRow(pk, data) {
        return fetch(`http://localhost:8000/api/row/${pk}/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify(data),
            }).then(response => response.json())
    }

    moveBoard(pk, index) {
        return fetch(`http://localhost:8000/api/board/${pk}/move/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"index": index}),
            }).then(response => response.json())
    }

    removeBoard(taskId) {
        return fetch(`http://localhost:8000/api/board/${taskId}/`,
            {
                method: 'DELETE'
                ,
            }).then(response => response.json())
    }

    removeRow(rowId) {
        return fetch(`http://localhost:8000/api/row/${rowId}/`,
            {
                method: 'DELETE'
                ,
            }).then(response => response.json())
    }

    newCard(boardId, description) {
        return fetch(`http://localhost:8000/api/board/${boardId}/card/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"description": description}),
            }).then(response => response.json())
    }

    updateCard(boardId, data) {
        return fetch(`http://localhost:8000/api/board/${boardId}/card/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify(data),
            }).then(response => response.json())
    }

    moveCard(pk, index, board, row) {
        return fetch(`http://localhost:8000/api/card/${pk}/move/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"index": index, "board": board, "row": row}),
            }).then(response => response.json());
    }

    removeCard(taskId) {
        return fetch(`http://localhost:8000/api/card/${taskId}/`, {
            method: 'DELETE',
            body  : JSON.stringify({pk: taskId}),
        }).then(response => response.json());
    }

    loginUser(username, password) {
        return fetch("http://localhost:8000/api/token/", {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body   : JSON.stringify({
                username,
                password
            })
        })
    }

    createUser(username, password) {
        return fetch("http://127.0.0.1:8000/api/user/", {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body   : JSON.stringify({
                username,
                password
            })
        });
    }
}

export default ApiService;