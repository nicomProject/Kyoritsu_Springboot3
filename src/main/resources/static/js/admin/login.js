$(function() {
    const Content = {
        params: {},
        load: function(params) {
            this.params = params;
            this.event();
        },
        event: function() {
            const that = this;

            const form = $('#loginForm');
            const inputs = form.find('.form-control');
            const submitBtn = $('#submitButton');

            const tips = {
                manager_id:
                    tippy('#manager_id', {
                        placement: 'right',
                        content: 'Caps Lock이 켜져있습니다',
                        trigger: 'manual'
                    }),
                manager_pw: tippy('#manager_pw', {
                    placement: 'right',
                    content: 'Caps Lock이 켜져있습니다',
                    trigger: 'manual'
                })
            }

            inputs.on({
                focus: function(e){
                    $(this).parent().addClass('active');
                },
                focusout: function(e){
                    $(this).parent().removeClass('active');
                },
                keyup: function(e){

                    const key = e.keyCode ? e.keyCode : e.which;
                    const tip = tips[e.target.id][0];

                    // Shift Key
                    if(e.keyCode === 20){
                        if(tip.state.isShown){
                            tip.hide();
                        }
                        else {
                            tip.show();
                        }
                    }

                    // Caps Lock 감지
                    if(e.key && e.key.toUpperCase() === e.key && e.key.toLowerCase() !== e.key && !e.shiftKey){
                        tip.show();
                    }
                    else {
                        if(tip.state.isShown){
                            tip.hide();
                        }
                    }

                    // Enter 키 감지
                    switch (key) {
                        case 13:
                            that.validate();
                            break;
                    }
                },
            });

            // 로그인 버튼 클릭
            submitBtn.on('click', function(e) {
                e.preventDefault();
                that.validate();
            });
        },
        // 입력 내용 검증
        validate: function() {
            const that = this;

            const form = $('#loginForm');

            const managerID = form.find('#manager_id');
            const managerPW = form.find('#manager_pw');

            let message = "";

            if(managerID.val().length === 0) {
                Alert.warning({text: '아이디를 입력해 주세요.'});
            }
            else if(managerPW.val().length === 0) {
                Alert.warning({text: '비밀번호를 입력해 주세요.'});
            }
            else {
                that.submit();
            }
        },
        submit: function() {
            sessionStorage.flag = false;

            const that = this;

            const form = $('#loginForm');
            const loading = $('[role="loading"]');

            form.addClass('hide');
            loading.removeClass('hide');

            const managerID = form.find('#manager_id').val();
            const managerPW = form.find('#manager_pw').val();

            AjaxUtil.request({
                url: '/api/admin/authenticate',
                data: {
                    userName: managerID,
                    userPwd: managerPW
                },
                success: function(data) {
                    if(data === undefined){
                        Alert.warning({text: '세션이 만료되었습니다.<br> 페이지를 다시 로딩합니다.'}, function(){
                            location.reload();
                        });
                    }
                    if(data.code === 220) {
                        location.reload();
                    }
                    else if(data.code === 221){
                        sessionStorage.flag = true;
                        location.reload();
                    }
                    else if (data.code === 480) {
                        form.removeClass('hide');
                        loading.addClass('hide');

                        Alert.warning({text: data.desc});
                    }

                },
                error: function(e) {
                    Alert.error({text: e.error().responseText});
                }
            });
        }
    }

    Content.load();
});