$(function () {
    const Content = {
        load: function () {
            this.draw();
        },
        draw: function () {
            const container = $('#organization-section');
            const editorContent = container.find('.editor-content');
            
            let contentObj = [];

            AjaxUtil.request({
                url: '/api/introductions/find',
                async: false,
                success: function (data){
                    contentObj = data.result.items;
                }

            })

            if(contentObj != null) {
                contentObj.forEach(item => {
                    const contentId = item.recKey;
                    const contentData = item.content;

                    const organizationContentId = $('#organization_contentId').val();

                    if (contentId == organizationContentId) {
                        editorContent.html(contentData)
                    }
                })
            }
            
            this.event();
        },
        event: function () {
            document.getElementById("btnOverview").addEventListener("click", function() {
                window.location.href = '/intro/overview';
            });
            document.getElementById("btnVision").addEventListener("click", function() {
                window.location.href = '/intro/vision';
            });
            document.getElementById("btnHistory").addEventListener("click", function() {
                window.location.href = '/intro/history';
            });
            document.getElementById("btnOrganization").addEventListener("click", function() {
                window.location.href = '/intro/organization';
            });
            document.getElementById("btnLocation").addEventListener("click", function() {
                window.location.href = '/intro/location';
            });
        }
    }

    Content.load();
});