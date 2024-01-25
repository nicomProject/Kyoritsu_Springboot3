$(function () {
    const Content = {
        load: function () {
            this.event();
        },
        draw: function () {
            const container = $('#info-section');
            const editorContent = container.find('.editor-content');

            let contentObj = [];

            AjaxUtil.request({
                url: '/api/introductions/find',
                async: false,
                success: function (data){
                    contentObj = data.result.items;
                }
            })

            if(contentObj != null){
                contentObj.forEach(item => {
                    const contentId = item.recKey;
                    const contentData = item.content;

                    const infoContentId = $('#info_contentId').val();

                    if(contentId == infoContentId){
                        editorContent.html(contentData)
                    }
                })
            }

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
            document.getElementById("btnNotice2").addEventListener("click", function() {
                window.location.href = '/recruit/notice';
            });
            document.querySelectorAll('button').forEach(function(button) {
                button.classList.remove('activation');
                if(button.id == "btnInfo") button.classList.add('activation');
            });
        }
    }

    Content.load();
});