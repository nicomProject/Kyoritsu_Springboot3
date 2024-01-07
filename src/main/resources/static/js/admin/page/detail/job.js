$(function () {
    const Content = {
        params: {},
        formData: {},
        load: function (params) {
            this.params = params;
            console.log(params)
            let items = [];
            const support = $("#support");

            AjaxUtil.request({
                url: '/api/category/find',
                async: false,
                success: function (data) {
                    items = data.result.items;
                }
            });

            items.forEach(item => {
                support.append($('<option>', {
                        value: item.recKey,
                        text: item.categoryName,
                    }
                ));
            })

            this.event();
        },

        event: function () {
            formData = {'title' : '제목', 'Datefrom' : '시작일', 'Dateto' : '종료일', 'contents' : '본문'};
            formDataKey = {'title' : '제목', 'contents' : '본문'};
            const paramValue = this.params.key

            var oEditors = [];
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: oEditors,
                elPlaceHolder: "contents",
                sSkinURI: "/static/js/smartEditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2"
            })

            if(paramValue !== ""){
                AjaxUtil.requestBody({
                    url: '/api/job/findSelf',
                    data: {
                        key: paramValue,
                    },
                    success: function (data) {
                        $(".pageSub #category").val(data.result.items[0].category);
                        $(".pageSub #title").val(data.result.items[0].title);
                        $(".pageSub #contents").val(data.result.items[0].content);
                        $(".pageSub #create_user").val(data.result.items[0].createUser);
                        $(".pageSub #create_data").val(data.result.items[0].createDate);
                        $(".pageSub #hit").val(data.result.items[0].hit);
                        $(".pageSub #notice_period").val(data.result.items[0].fromDate + "~" + data.result.items[0].toDate);
                        $(".pageSub #support").val(data.result.items[0].support);
                        $(".pageSub #experience").val(data.result.items[0].experience);
                        $(".pageSub #fulltime").val(data.result.items[0].fullTime)
                        $(".pageSub #Datefrom").val(data.result.items[0].fromDate.substring(0, 10));
                        $(".pageSub #Dateto").val(data.result.items[0].toDate.substring(0, 10));

                        if (data.code == 200) {
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: "채용공고 조회가 실패하였습니다.",
                            })
                        }
                    }
                })
            }

            const card = $('.card-body');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;

                oEditors.getById["contents"].exec("UPDATE_CONTENTS_FIELD", []);
                var categoryValue = $("#category").val();
                var supportValue = $("#support").val();
                var experienceValue = $("#experience").val();
                var fulltimeValue = $("#fulltime").val()
                var titleValue = $("#title").val();
                var contentsValue = $("#contents").val();
                var Dateto = $("#Dateto").val();
                var Datefrom = $("#Datefrom").val();

                if(action === 'add' && ValidateField.valid(formData)){
                    AjaxUtil.requestBody({
                        url: '/api/job/add',
                        data: {
                            category: categoryValue,
                            support: supportValue,
                            experience: experienceValue,
                            full_time: fulltimeValue,
                            title: titleValue,
                            contents: contentsValue,
                            date_from: Datefrom,
                            date_to: Dateto
                        },
                        success: function (data) {
                            if(data.code === 200){
                                Alert.success({text: data.desc}, function (){
                                    location.href = '/admin/jobs'
                                })
                            }else if(data.code === 210){
                                Alert.warning({text: data.desc})
                            }
                            else{
                                Alert.error({text: data.desc});
                            }
                        }
                    })
                }
                else if(action === "update" && ValidateField.valid(formDataKey)){
                    AjaxUtil.requestBody({
                        url: '/api/job/update',
                        data: {
                            category: categoryValue,
                            support: supportValue,
                            experience: experienceValue,
                            full_time: fulltimeValue,
                            title: titleValue,
                            contents: contentsValue,
                            date_from: Datefrom,
                            date_to: Dateto,
                            key: paramValue
                        },
                        success: function (data) {
                            if(data.code === 200){
                                Alert.success({text: data.desc}, function (){
                                    location.href = '/admin/jobs'
                                })
                            }else if(data.code === 210){
                                Alert.warning({text: data.desc})
                            }
                            else{
                                Alert.error({text: data.desc});
                            }
                        }
                    })
                }
                else if(action === "list"){
                    location.href = '/admin/jobs'
                }
                else if(action === "delete"){
                    AjaxUtil.requestBody({
                        url: '/api/job/delete',
                        data: {
                            type: 'one',
                            id: paramValue
                        },
                        success: function (data) {
                            if(data.code === 200){
                                Alert.success({text: data.desc}, function (){
                                    location.href = '/admin/jobs'
                                })
                            }
                            else{
                                Alert.error({text: data.desc});
                            }
                        }
                    })
                }



            })


        }
    };
    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
})