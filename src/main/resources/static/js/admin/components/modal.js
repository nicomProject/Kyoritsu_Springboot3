const Data = {
    roles: {},
    roleHash: {},
    MenuHash: {},
    menus: [],
    subMenuHash: {},
    subMenuCheck:[],
    subMenuCheckHash: {},
    subMenus: [],
    /**
     * @param config
     * @param {boolean} config.role 역할 사용여부
     */
    load: function (config) {
        const roleUse = config.role && true;
        const menuUse = config.menu && true;

        if (roleUse) {
            this.getRoles();
        }
        if(menuUse){
            this.getMenus();
        }

    },
    /**
     * 관리자 역할 조회
     */
    getRoles: function () {
        const that = this;
        AjaxUtil.request({
            url: '/api/adm/setting/roles',
            success: function (data) {
                const items = data.result && data.result.items || [];
                items.forEach(item => {
                    that.roles[item.key] = item;
                    that.roleHash[item.key] = item.value;
                });
            }
        })
    },
    getMenus: function(){
        const that = this;
        AjaxUtil.request({
            url: '/api/main/setting/menus',
            async: false,
            success: function (data) {
                const items = data.result.items;

                that.menus = items.filter(item => item.type === "group");
                that.subMenus = items.filter(item => item.type === "intro")

                that.menus.forEach(menu => {
                    that.MenuHash[menu.recKey] = menu.name;
                })

                that.subMenus.forEach(menu => {
                    that.subMenuHash[menu.recKey] = menu.name;
                    if(menu.content){
                        that.subMenuCheckHash[menu.recKey] = menu.content.recKey;
                    }
                })

            },
        });
    }
};

class AbstractModal {
    /**
     * [AbstractModal] 모달 생성
     * @param id Modal ID
     * @param config 생성 Configuration
     * @param {String} config.titleAdd 등록 시 title
     * @param {String} config.titleMod 수정 시 title
     * @param {function(AbstractModal): string} config.titleCustom title 커스텀
     * @param {Array<String>} config.buttonsForEnable button enable 커스텀
     * @param {function(AbstractModal): void} config.buttonCustom button 커스텀
     * @param {Array<String>} config.fieldsForDisable 등록후 수정 불가 항목
     * @param {Array<String>} config.fieldsForImmutable 아예 수정불가
     * @param {Array<String>} config.fieldsForValidation validation할 항목
     * @param {function(AbstractModal): void} config.fieldCustom 선택 필드 수정
     * @param {boolean} config.fieldRole 권한 선택 여부
     * @param {boolean} config.fieldFill 필드값 채우기 여부
     * @param {function(AbstractModal, jQuery, jQuery, string, string): Promise<boolean>} config.validation validation function
     * @param {object} config.actionHash 버튼(Action)별 행동
     * @param {function(AbstractModal, Object): void} config.actionHash.func 버튼(Action)별 행동 (add - function)
     * @param {object} config.actionHash.required 버튼(Action)별 필수 파라미터 (add - id, name)
     */
    constructor(id, config) {
        this.obj = $(`#${id}Modal`);
        this.config = config;
        this.params = {};
        this.type = 'add';

        this.load();
    }

    load() {
        const modal = this;
        const obj = this.obj;

        obj.on('show.bs.modal', function (e) {
            const header = obj.find('.modal-header');
            const title = obj.find('.modal-title');
            const body = obj.find('.modal-content .modal-body');
            const footer = obj.find('.modal-footer');

            const form = body.find('form');
            const inputs = body.find('.form-control');
            const buttons = footer.find('.btn');

            const addButton = footer.find('.btn[data-action="add"]');
            const updateButton = footer.find('.btn[data-action="mod"]');
            const deleteButton = footer.find('.btn[data-action="del"]');

            /**
             * parameter parsing
             */
            const param = obj.find('.param[name="item"]');
            const params = [undefined, ''].indexOf(param.val()) > -1 ? {} : JSON.parse(param.val());
            param.remove();
            modal.params = params;

            /**
             * modal type
             */
            const type = param.attr('action');
            modal.type = type;

            /**
             * 초기화
             */
            form.trigger('reset');

            // 유효성 설정
            inputs.removeClass('is-valid is-invalid');

            // 모든 정보 초기화
            inputs.show();
            buttons.hide();


            /*
                Field 커스터마이징
                - select field option 추가
                - field value 추가
             */
            if (modal.config && modal.config.fieldCustom) {
                modal.config.fieldCustom(modal);
            }


            if (modal.config && modal.config.fieldRole) {
                const roleSelect = obj.find('.form-control[name="role"]');
                roleSelect.html('<option value="" disabled>권한을 선택해주세요</option>');

                Object.entries(Data.roleHash).forEach(([key, value]) => {
                    roleSelect.append(`<option value="${key}">${value}</option>`)
                });
            }

            // 정보 추가일시
            if (type === 'add') {
                if (modal.config && modal.config.titleAdd) {
                    title.html(modal.config.titleAdd);
                }
                addButton.show();
                addButton.removeClass('me-2');
            }
            // 정보 수정일시
            else if (type === 'mod') {
                if (modal.config && modal.config.titleMod) {
                    title.html(modal.config.titleMod);
                }
                footer.show();

                updateButton.show();
                deleteButton.show();
            }

            // 모달 제목 변경
            if (modal.config && modal.config.titleCustom) {
                title.html(modal.config.titleCustom(modal))
            }

            /**
             * 수정 불가 항목이 있을 경우 disable 처리
             */
            if (modal.config && modal.config.fieldsForImmutable) {
                modal.config.fieldsForImmutable.forEach(field => {
                    body.find(`.form-control[name="${field}"]`).prop('disabled', true);
                });
            }

            /**
             * 수정 불가 항목이 있을 경우 disable 처리
             */
            if (type === 'mod' && modal.config && modal.config.fieldsForDisable) {
                modal.config.fieldsForDisable.forEach(field => {
                    body.find(`.form-control[name="${field}"]`).prop('disabled', true);
                });
            }

            body.find(`.form-control`).removeClass('required');

            // if (modal.config && modal.config.actionHash[type]) {
            //     const required = modal.config.actionHash[type].required || {};
            //     Object.keys(required).forEach(field => {
            //         body.find(`.form-control[name="${field}"]`).addClass('required');
            //     })
            // }

            /**
             * fieldFill 옵션이 활성화 됐을 경우, 필드값 채우기
             */
            if (type === 'mod' || (modal.config && modal.config.fieldFill)) {
                Object.entries(params).forEach(([column, value]) => {
                    body.find(`.param[name="${column}"]`).val(value);
                });
            }

            // Button Enable 설정
            if (modal.config && modal.config.buttonsForEnable) {
                modal.config.buttonsForEnable.forEach(field => {
                    footer.find(`*[role="action"][data-action="${field}"]`).show();
                });
            }

            // 모달 버튼 커스텀 - show & hide
            if (modal.config && modal.config.buttonCustom) {
                modal.config.buttonCustom(modal);
            }


            modal.event();
            modal.action();
        });
    }

    /**
     * 데이터 전처리 이벤트
     */
    event() {
        const modal = this;
        const obj = this.obj;
        const inputs = obj.find('.form-control');

        inputs.on({
            'focusin': function (e) {
                const $this = $(this);
                const $parent = $this.parent();
                $parent.addClass('active');

                const classes = ['is-invalid', 'is-valid'];
                classes.forEach(nm => {
                    if ($this.hasClass(nm)) {
                        $parent.addClass(nm)
                    }
                });
            },
            'focusout': async function (e) {
                const $this = $(this);
                const $parent = $this.parent();
                const $invalid = $parent.find('.invalid-feedback');

                $this.removeClass('is-invalid is-valid');
                $parent.removeClass('active is-invalid is-valid');

                const type = this.type;
                const name = this.name;
                const value = this.value;

                if (modal.config && modal.config.fieldsForValidation) {
                    if (!modal.config.fieldsForValidation.includes(name)) {
                        return false;
                    }
                }

                // 파일 형태면 change에서 처리
                if (type === 'file') {
                    return false;
                }

                // 값 변동이 없으면 종료
                if (modal.type === 'mod' && modal.params[name] === value) {
                    return false;
                }

                if (value !== '' && modal.config.validation) {
                    if (await modal.config.validation(modal, $this, $invalid, name, value)) {
                        $this.addClass('is-valid');
                    } else {
                        $this.addClass('is-invalid');
                    }
                }
            },
            'change': async function (e) {
                const $this = $(this);
                const $parent = $this.parent();
                const $invalid = $parent.find('.invalid-feedback');

                const type = this.type;
                const name = this.name;
                const value = e.target.value;

                if (modal.config && modal.config.fieldsForValidation) {
                    if (!modal.config.fieldsForValidation.includes(name)) {
                        return false;
                    }
                }

                // 파일 형태만 처리
                if (type !== 'file') {
                    return false;
                }

                $this.removeClass('is-invalid is-valid');
                $parent.removeClass('active is-invalid is-valid');

                if (value !== '' && modal.config.validation) {
                    if (await modal.config.validation(modal, $this, $invalid, name, value)) {
                        $this.addClass('is-valid');
                    } else {
                        $this.addClass('is-invalid');
                    }
                }
            }
        });
    }

    /**
     * 버튼 클릭 (action) 이벤트
     */

    action() {
        const modal = this;
        const obj = this.obj;

        obj.find('.btn[role="action"]').click(function (e) {
            e.preventDefault();

            const action = this.dataset.action;
            const data = {};

            // 값 저장
            const inputs = obj.find('.param');
            for (let i = 0; i < inputs.length; i++) {
                const item = inputs[i];
                data[item.name] = item.value;
            }

            if (modal.config && modal.config.actionHash && Object.keys(modal.config.actionHash).includes(action)) {
                const actionHash = modal.config.actionHash[action];
                const required = actionHash.required;
                const func = actionHash.func;

                if (required !== undefined) {
                    for (const [column, name] of Object.entries(required)) {
                        const target = obj.find(`.param[name="${column}"]`);
                        const parent = target.parent();
                        const invalidFeedback = parent.find('.invalid-feedback');

                        if (data[column] === '') {
                            target.addClass('is-invalid');
                            if (invalidFeedback.length === 0) {
                                parent.append(`<div class="invalid-feedback"><b>${name}</b> 값을 입력해주세요!</div>`)
                            } else {
                                invalidFeedback.html(`<b>${name}</b> 값을 입력해주세요!`)
                            }
                        }
                    }

                    for (const [column, name] of Object.entries(required)) {
                        const target = obj.find(`.param[name="${column}"]`);

                        if (data[column] === '') {
                            return false;
                        }
                        if (target.hasClass('is-invalid')) {
                            Alert.warning({text: `<b>${name}</b> 값이 유효하지 않습니다!`});
                            return false;
                        }
                    }
                }

                // 수정일 경우 변경 사항 체크
                if (action === 'mod') {
                    // 바뀐 항목이 없을 경우
                    if (Object.keys(Utils.diffMap(modal.params, data)).length === 0) {
                        Alert.warning({text: '변경된 항목이 없습니다!'});
                        return false;
                    }
                }

                if (func !== undefined) {
                    actionHash.func(modal, data);
                }
            }
        });
    }

    show() {
        const obj = this.obj;
        obj.modal('show');
    }

    hide() {
        const obj = this.obj;
        obj.modal('hide');
    }
}

$(function () {
    /**
     * [Modal] 계정 관리
     * @type {AbstractModal}
     */
    const AccountModal = new AbstractModal('account', {
        fieldsForDisable: ['userId'],
        titleAdd: '관리자 등록',
        titleMod: '관리자 정보 수정',
        titleCustom: function (modal) {
            if (modal.params.userId === memberInfo.id) {
                return "내 정보 수정";
            }
        },
        buttonCustom: function (modal) {
            const footer = modal.obj.find('.modal-footer');
            const updateButton = footer.find('.btn[data-action="mod"]');
            const deleteButton = footer.find('.btn[data-action="del"]');
            if (modal.params.userId === memberInfo.id) {
                updateButton.removeClass('me-2')
                deleteButton.hide();
            }
        },
        fieldRole: true,
        validation: async function (modal, obj, invalid, name, value) {
            if (name === 'userId' && value !== '' && value !== modal.params.userId) {
                const validation = ValidationUtil.checkSpecialPattern(value);
                if (!validation.result) {
                    invalid.html(validation.error);
                    return false;
                } else if (Tabulator.findTable('#table')[0].getData().map(e => e.userId).indexOf(value) > -1) {
                    invalid.html('이미 사용중인 아이디입니다.')
                    return false;
                }
            } else if (name === 'name' && value !== '') {
                const validation = ValidationUtil.checkSpecialPattern(value);
                if (!validation.result) {
                    invalid.html(validation.error);
                    return false;
                }
            }
            return true;
        },
        actionHash: {
            add: {
                required: {'userId': '아이디', 'name': '이름', 'role': '권한'},
                func: function (modal, params) {
                    AjaxUtil.requestBody({
                        url: '/api/manager/add',
                        data: {
                            id: params.userId,
                            name: params.name,
                            role: params.role,
                            enable: params.enable || null
                        },
                        modal: modal.obj,
                        table: 'table',
                        successMessage: '관리자가 성공적으로 추가되었습니다!'
                    });
                }
            },
            mod: {
                required: {'userId': '아이디', 'name': '이름'},
                func: function (modal, params) {
                    AjaxUtil.requestBody({
                        url: '/api/manager/mod',
                        data: {
                            id: modal.params.userId,
                            name: params.name,
                            role: params.role,
                            enable: params.enable || null
                        },
                        modal: modal.obj,
                        table: 'table',
                        successMessage: '관리자가 성공적으로 수정되었습니다!'
                    });
                }
            },
            del: {
                required: {'userId': '아이디'},
                func: function (modal, params) {
                    Alert.confirm({
                        title: '관리자 삭제',
                        text: `해당 관리자를 삭제하시겠습니까?`
                    }, function (result) {
                        if (!result.isConfirmed) return;
                        AjaxUtil.requestBody({
                            url: '/api/manager/del',
                            data: {
                                type: 'one',
                                id: modal.params.userId,
                            },
                            modal: modal.obj,
                            table: 'table',
                            successMessage: '관리자가 성공적으로 삭제되었습니다!'
                        });
                    });
                }
            }
        }
    });


    const ImageModal = new AbstractModal('image', {
        fieldsForDisable: ['key', 'value'],
        fieldFill: true,
        buttonsForEnable: ['send'],
        fieldRoom: true,
        fieldCustom: function (modal) {
            const obj = modal.obj;
            const params = modal.params;

            if (params.imageName && params.imageName !== '') {
                obj.find('#preview')
                    .attr('src', '/api/room/image?key=' + params.key)
                    .on('error', function (e) {
                        this.src = '/static/images/banner/noimage.png';
                    });
            }
        },
        validation: async function (modal, obj, invalid, name, value) {
            if (name === 'imageFile') {
                const file = obj[0].files[0];
                const validation = ValidationUtil.checkFile(file);
                if (!validation.result) {
                    invalid.html(validation.error);
                    return false;
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    modal.obj.find('#preview').attr('src', e.target.result);
                }

                reader.readAsDataURL(file);
            }
            return true;
        },
        actionHash: {
            send: {
                func: function (modal, params) {
                    const $file = modal.obj.find('#file')
                    const files = $file[0].files;
                    if (files.length === 0) {
                        Alert.warning({text: '파일이 없습니다.'});
                        return false;
                    }

                    const file = files[0];
                    const data = new FormData();
                    data.append('file', file);
                    data.append('key', params.key);

                    fetch('/api/room/image', {
                        method: 'POST',
                        body: data
                    }).then(data => {
                        return data.json();
                    }).then(data => {
                        if (data.code === 200) {
                            Alert.success({title: '업로드 완료', text: '성공적으로 업로드되었습니다!'});
                        } else {
                            Alert.danger({text: data.desc});
                        }
                    });
                }
            }
        }
    });


    const jobModal = new AbstractModal('jobModal', {

        titleCustom: function () {
            return "채용공고 카테고리";
        },
        buttonCustom: function (modal) {

            AjaxUtil.requestBody({
                url: '/api/category/find',
                success: function (data) {

                    if (data.code == 200) {
                        let items = [];
                        items = data.result.items;
                        items.forEach(item => {
                            modal.obj.find("#category").append($('<option>', {
                                    value: item.recKey,
                                    text: item.categoryName,
                                }
                            ));
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            html: "카테고리 조회가 실패하였습니다.",
                        })
                    }
                }
            })

            const ModalButton = modal.obj.find('.input-group-append');
            const AddButton = ModalButton.find('*[data-action="add"]');
            const DeleteButton = ModalButton.find('*[data-action="delete"]');
            const SelectValue = modal.obj.find("#category");

            SelectValue.on('change', function(){
                modal.obj.find("#jobCategory").val(modal.obj.find("#category option:selected").text())
            })

            AddButton.click(function (e) {
                AjaxUtil.requestBody({
                    url: '/api/category/add',
                    data: {
                        categoryName: modal.obj.find("#jobCategory").val()
                    },
                    success: function (data) {

                        if (data.code == 200) {
                            Alert.success({text: '카테고리가 추가되었습니다'}, function(){
                                modal.obj.modal('hide');
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: "카테고리가 추가가 실패하였습니다",
                            })
                        }
                    }
                })
            })

            DeleteButton.click(function (e) {
                AjaxUtil.requestBody({
                    url: '/api/category/delete',
                    data: {
                        categoryName: modal.obj.find("#jobCategory").val()
                    },
                    success: function (data) {
                        if (data.code == 200)
                        {
                            Alert.success({text: '카테고리가 삭제되었습니다'}, function(){
                                modal.obj.modal('hide');
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: "해당 카테고리가 삭제가 실패하였습니다.",
                            })
                        }
                    }
                })
            })
        },
    });
});