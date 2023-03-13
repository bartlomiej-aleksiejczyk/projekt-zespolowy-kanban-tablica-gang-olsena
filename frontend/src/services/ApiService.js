const ApiService = {
    newBoard   : function(name) {
        return fetch(`http://localhost:8000/api/board/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"name": name}),
            }).then(response => response.json())
    },
    newRow   : function(name) {
        return fetch(`http://localhost:8000/api/board/row/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"name": name}),
            }).then(response => response.json())
    },
    updateBoard: function(pk, data) {
        return fetch(`http://localhost:8000/api/board/${pk}/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify(data),
            }).then(response => response.json())
    },
    updateRow: function(pk, data) {
        return fetch(`http://localhost:8000/api/board/row/${pk}/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify(data),
            }).then(response => response.json())
    },
    moveBoard  : function(pk, index) {
        return fetch(`http://localhost:8000/api/board/${pk}/move/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"index": index}),
            }).then(response => response.json())
    },
    removeBoard: function(taskId) {
        return fetch(`http://localhost:8000/api/board/${taskId}/`,
            {
                method: 'DELETE'
                ,
            }).then(response => response.json())
    },
    removeRow: function(rowId) {
        return fetch(`http://localhost:8000/api/board/row/${rowId}/`,
            {
                method: 'DELETE'
                ,
            }).then(response => response.json())
    },
    newCard    : function(boardId, description) {
        return fetch(`http://localhost:8000/api/board/${boardId}/card/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"description": description}),
            }).then(response => response.json())
    },
    updateCard : function(boardId, data) {
        return fetch(`http://localhost:8000/api/board/${boardId}/card/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify(data),
            }).then(response => response.json())
    },
    moveCard   : function(pk, index, board, row) {
        return fetch(`http://localhost:8000/api/card/${pk}/move/`,
            {
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body   : JSON.stringify({"index": index, "board": board,"row":row}),
            }).then(response => response.json());
    },
    removeCard : function(taskId) {
        return fetch(`http://localhost:8000/api/card/${taskId}/`, {
            method: 'DELETE',
            body  : JSON.stringify({pk: taskId}),
        }).then(response => response.json());
    }
}

export default ApiService;