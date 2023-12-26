$(function () {
    const Content = {
        load: function () {
            this.draw();
        },
        draw: function () {
            const container = $('#overview-section')
            const editorContent = container.find('.editor-content')
            
            let contentObj = [];

            AjaxUtil.request({
                url: '/api/introductions/find',
                async: false,
                success: function (data) {
                    contentObj = data.result.items;
                }
            })

            if(contentObj != null){
                contentObj.forEach(item => {
                    const contentId = item.recKey;
                    const contentData = item.content;

                    const overviewContentId = $('#overview_contentId').val();

                    if(contentId == overviewContentId){
                        editorContent.html(contentData)
                    }
                })
            }
            
            this.event();
        },
        event: function () {
        }
    }

    Content.load();
});