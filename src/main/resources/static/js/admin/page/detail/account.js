$(function () {
    const Content = {
        categorys: [],
        subCategorys: [],
        params: {},
        formData: {},
        load: function (params) {
            this.params = params;
            this.event();
        },

        event: function () {
            formData = {'manager_id' : '아이디', 'manager_name' : '이름'};

            const paramValue = this.params.key
            if(paramValue !== ""){
                AjaxUtil.requestBody({
                    url: '/api/manager/findSelf',
                    data: {
                        key: paramValue,
                    },
                    success: function (data) {
                        console.log(data)
                        $(".pageSub #manager_id").val(data.result.items[0].userId);
                        $(".pageSub #manager_name").val(data.result.items[0].name);
                        $(".pageSub #manager_role").val(data.result.items[0].role);
                        $(".pageSub #manager_enable").val(data.result.items[0].enable);

                        if (data.code == 200) {
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: "관리자 계정 조회가 실패하였습니다.",
                            })
                        }
                    }
                })
            }

            var modify_password = $("#modify_password");
            var new_password = $("#new_password");
            var new_password_confirm = $("#new_password_confirm");

            var modify_passwordYn = "";
            var new_passwordYn = "";
            var new_password_confirmYn = "";

            modify_password.on("input", function (){
                var validation = ValidationUtil.checkPasswordPattern(modify_password.val());
                var icon = modify_password.parent().find("i");
                if(!validation.result){ // 유효성 검사 실패시
                    icon.removeClass("fas fa-check")
                    icon.addClass("fas fa-times-circle")
                    icon.css({
                        display : "inline"
                    })
                    modify_passwordYn = "false";
                }else if(validation.result){
                    icon.removeClass("fas fa-times-circle")
                    icon.addClass("fas fa-check")
                    icon.css({
                        display : "inline"
                    })
                    modify_passwordYn = "true";
                }
            })

            new_password.on("input", function (){
                var validation = ValidationUtil.checkPasswordPattern(new_password.val());
                var icon = new_password.parent().find("i");
                if(!validation.result){ // 유효성 검사 실패시
                    icon.removeClass("fas fa-check")
                    icon.addClass("fas fa-times-circle")
                    icon.css({
                        display : "inline"
                    })
                    new_passwordYn = "false";
                }else if(validation.result){
                    icon.removeClass("fas fa-times-circle")
                    icon.addClass("fas fa-check")
                    icon.css({
                        display : "inline"
                    })
                    new_passwordYn = "true";
                }
            })

            new_password_confirm.on("input", function (){
                var validation = ValidationUtil.checkPasswordPattern(new_password_confirm.val());
                var icon = new_password_confirm.parent().find("i");
                if(!validation.result){ // 유효성 검사 실패시
                    icon.removeClass("fas fa-check")
                    icon.addClass("fas fa-times-circle")
                    icon.css({
                        display : "inline"
                    })
                    new_password_confirmYn = "false";
                }else if(validation.result){
                    icon.removeClass("fas fa-times-circle")
                    icon.addClass("fas fa-check")
                    icon.css({
                        display : "inline"
                    })
                    new_password_confirmYn = "ture";
                }
            })


            const buttons = document.querySelectorAll("button");

            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    const action = button.getAttribute("data-action");
                    if (action === "add" && ValidateField.valid(formData)) {
                        var manager_id = $("#manager_id").val();
                        var manager_name = $("#manager_name").val();
                        var manager_role = $("#manager_role").val();
                        var manager_enable = $("#manager_enable").val();

                        if(paramValue === ""){
                            AjaxUtil.requestBody({
                                url: '/api/manager/add',
                                data: {
                                    id: manager_id,
                                    name: manager_name,
                                    role: manager_role,
                                    enable: manager_enable,
                                },
                                success: function (data) {
                                    if (data.code == 200) {
                                        Alert.success({text: '관리자 계정이 등록되었습니다.'}, function(){
                                            location.href = '/admin/accounts'
                                        })
                                    } else if(data.code === 210){
                                        Alert.warning({text: data.desc})
                                    }
                                    else{
                                        Alert.error({text: data.desc});
                                    }
                                }
                            })
                        }else if(paramValue !== "" && ValidateField.valid(formData)){

                            AjaxUtil.requestBody({
                                url: '/api/manager/update',
                                data: {
                                    id: manager_id,
                                    name: manager_name,
                                    role: manager_role,
                                    enable: manager_enable,
                                    key: paramValue
                                },
                                success: function (data) {
                                    if (data.code == 200) {
                                        Alert.success({text: '관리자 계정이 수정되었습니다.'}, function(){
                                            location.href = '/admin/accounts'
                                        })
                                    } else if(data.code === 210){
                                        Alert.warning({text: data.desc})
                                    }
                                    else{
                                        Alert.error({text: data.desc});
                                    }
                                }
                            })
                        }}

                    else if(action === "passwordmodify"){
                        if(modify_passwordYn === "false" || modify_passwordYn  === "" || new_passwordYn === "false" || new_passwordYn  === "" || new_password_confirmYn  === "false" || new_password_confirmYn === ""){
                            Alert.warning({text: "비밀번호는 영문자, 숫자, 특수문자 포함 8자 이상 20자이내로 사용 가능합니다."});
                        }else{
                        AjaxUtil.requestBody({
                            url: '/api/manager/mypassword',
                            data: {
                                password: modify_password.val(),
                                newPassword: new_password.val(),
                                newPasswordConfirm: new_password_confirm.val(),
                                key: paramValue
                            },
                            success: function (data) {
                                if (data.code === 200) {
                                    Alert.success({text: '비밀번호가 성공적으로 변경되었습니다!<br>변경된 비밀번호로 다시 로그인해주세요!'}, function () {
                                        location.href = '/admin/logout';

                                    });
                                } else {
                                    Alert.warning({text: data.desc});
                                }
                            }
                        })
                        }
                    }
                    else if(action === "list"){
                        location.href = '/admin/accounts'
                    }
                    else if(action === "delete"){
                        var manager_id = $("#manager_id").val();
                        AjaxUtil.requestBody({
                            url: '/api/manager/delete',
                            data: {
                                type: 'one',
                                id: manager_id,
                                key: paramValue
                            },
                            success: function (data) {
                                if (data.code == 200) {
                                    Alert.success({text: '관리자 계정이 삭제되었습니다.'}, function(){
                                        location.href = '/admin/accounts'
                                    })
                                } else if(data.code === 210){
                                    Alert.warning({text: data.desc})
                                }
                                else{
                                    Alert.error({text: data.desc});
                                }
                            }
                        })
                    }



                });
            });

        }
    };
    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
})