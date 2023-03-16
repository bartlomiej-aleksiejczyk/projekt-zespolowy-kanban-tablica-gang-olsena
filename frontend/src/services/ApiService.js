class ApiService {
    constructor(axios = undefined) {
        this.axios = axios;
    }

    getBoards(name) {
        return this.axios.get(`http://localhost:8000/api/board/`).then(response => response.data);
    }

    newBoard(name) {
        return this.axios.post(`http://localhost:8000/api/board/`, {"name": name}).then(response => response.data);
    }

    newRow(name) {
        return this.axios.post(`http://localhost:8000/api/row/`, {"name": name}).then(response => response.data);
    }

    updateBoard(pk, data) {
        return this.axios.post(`http://localhost:8000/api/board/${pk}/`, data).then(response => response.data);
    }

    updateRow(pk, data) {
        return this.axios.post(`http://localhost:8000/api/row/${pk}/`, data).then(response => response.data);
    }

    moveBoard(pk, index) {
        return this.axios.post(`http://localhost:8000/api/board/${pk}/move/`, {"index": index}).then(response => response.data);
    }

    removeBoard(taskId) {
        return this.axios.delete(`http://localhost:8000/api/board/${taskId}/`).then(response => response.data);
    }

    removeRow(rowId) {
        return this.axios.delete(`http://localhost:8000/api/row/${rowId}/`).then(response => response.data);
    }

    newCard(boardId, description) {
        return this.axios.post(`http://localhost:8000/api/board/${boardId}/card/`, {"description": description}).then(response => response.data);
    }

    updateCard(boardId, data) {
        return this.axios.post(`http://localhost:8000/api/board/${boardId}/card/`, data).then(response => response.data);
    }

    moveCard(pk, index, board, row) {
        return this.axios.post(`http://localhost:8000/api/card/${pk}/move/`, {"index": index, "board": board, "row": row}).then(response => response.data);
    }

    removeCard(taskId) {
        return this.axios.delete(`http://localhost:8000/api/card/${taskId}/`, {pk: taskId}).then(response => response.data);
    }

    getUsers() {
        return this.axios.get(`http://localhost:8000/api/user/`).then(response => response.data);

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

    createUser(username, password, password2) {
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