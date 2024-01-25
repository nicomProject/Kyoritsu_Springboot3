$(function () {
    const Content = {
        load: function () {
            this.draw();
        },
        draw: function () {
            this.event();
        },
        event: function () {
            document.getElementById("btnEmployeeInfo").addEventListener("click", function() {
                window.location.href = '/recruit/employee_info';
            });
            document.getElementById("btnInfo").addEventListener("click", function() {
                window.location.href = '/recruit/info';
            });
            document.getElementById("btnNotice").addEventListener("click", function() {
                window.location.href = '/recruit/notice';
            });
            document.getElementById("btnInquire").addEventListener("click", function() {
                window.location.href = '/recruit/inquire';
            });
            document.querySelectorAll('button').forEach(function(button) {
                console.log(button)
                button.classList.remove('activation');
                if(button.id == "btnEmployeeInfo") button.classList.add('activation');
            });
        }
    }
    Content.load();
});