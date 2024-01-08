$(function () {
    const Content = {
        load: function () {

            var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
            var options = { //지도를 생성할 때 필요한 기본 옵션
                center: new kakao.maps.LatLng(37.50581, 127.0281),
                level: 3 //지도의 레벨(확대, 축소 정도)
            };

            var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

            // 마커가 표시될 위치입니다
            var markerPosition  = new kakao.maps.LatLng(37.50581, 127.0281);

            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                position: markerPosition
            });
            // 마커가 지도 위에 표시되도록 설정합니다
            marker.setMap(map);

            this.draw();
        },
        draw: function () {
            const container = $('#location-section');
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

                    const locationContentId = $('#location_contentId').val();

                    if (contentId == locationContentId) {
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